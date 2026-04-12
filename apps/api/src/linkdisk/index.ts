import { Scalar } from '@scalar/hono-api-reference'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { D1Database, R2Bucket, ScheduledController } from '@cloudflare/workers-types'
import {
  API_DOC_INFO,
  API_MESSAGES,
  API_PATHS,
  createHealthResponse
} from '@linkdisk/shared'
import type {
  ClipboardAttachmentMediaKind,
  ClipboardEntry,
  ClipboardManageResponse,
  ClipboardOverviewStats,
  ClipboardRecentStatsItem,
  ClipboardShareAttachment,
  ClipboardShareResponse
} from '@linkdisk/shared'
import type { Context, MiddlewareHandler, Next } from 'hono'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { jwt } from 'hono/jwt'
import { rateLimiter } from 'hono-rate-limiter'
import { secureHeaders } from 'hono/secure-headers'
import { runArchiveCron } from './archive'
import {
  deleteClipboardBody,
  getClipboardBodyText,
  putClipboardBody
} from './clipboard-body'
import { getDb } from './db'
import { buildObjectStreamWithR2Fallback, getTotalSizeFromParts } from './download'
import { detectMimeTypeFromBytes } from './file-signatures'
import {
  cloneClipboardAttachmentsToEntry,
  createClipboardAttachment,
  createClipboardDraft,
  createClipboardShareAccessToken,
  deleteClipboardEntryPermanently,
  deleteClipboardAttachment,
  deleteExpiredClipboardShareAccessTokens,
  findClipboardAttachmentById,
  findClipboardEntryById,
  findClipboardEntryByManageId,
  findClipboardEntryByShareId,
  findClipboardShareSettings,
  getClipboardAttachmentEventStats,
  getClipboardDashboardOverview,
  incrementClipboardViewCount,
  isValidClipboardShareAccessToken,
  listStaleClipboardDrafts,
  listClipboardAttachments,
  listRecentClipboardEntries,
  markClipboardDeleted,
  markClipboardDestroyed,
  publishClipboardEntry,
  recordClipboardEvent,
  type ClipboardBodyFormat,
  type ClipboardDestroyMode,
  type StoredClipboardAttachment,
  updateClipboardAttachment,
  updateClipboardEntryAndShare
} from './clipboard-store'
import {
  deleteObjectPermanently,
  findObjectById,
  findObjectPartsByObjectId,
  findReadyObjectBySha256,
  isObjectUnreferenced,
  listStaleOrphanObjects,
  markObjectFailed,
  markObjectReady,
  saveObjectParts,
  saveUploadingObject,
  type StoredObjectPart,
  touchObjectUpdatedAt,
  updateObjectMimeType
} from './object-store'
import { createPresignedR2PartUploadUrl, isDirectR2UploadEnabled } from './r2-presign'
import { headR2Part, putR2Part, uploadFileToR2InChunks } from './r2-upload'
import { getChunkSizeBytes, getTotalParts } from './upload'

interface Bindings {
  ADMIN_JWT_SECRET?: string
  ADMIN_JWT_DISABLED?: string
  TELEGRAM_API_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
  TELEGRAM_FETCH_TIMEOUT_MS?: string
  INSTANT_UPLOAD_ENABLED?: string
  ARCHIVE_MAX_ATTEMPTS?: string
  ARCHIVE_BATCH_SIZE?: string
  ARCHIVE_LEASE_SECONDS?: string
  ARCHIVE_RETRY_BASE_SECONDS?: string
  DOWNLOAD_PREFETCH_WINDOW?: string
  R2_DIRECT_UPLOAD_ENABLED?: string
  R2_S3_ACCOUNT_ID?: string
  R2_S3_ACCESS_KEY_ID?: string
  R2_S3_SECRET_ACCESS_KEY?: string
  R2_S3_BUCKET_NAME?: string
  R2_PRESIGNED_URL_TTL_SECONDS?: string
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_SECRET_KEY?: string
  DASHBOARD_ACCESS_TOKEN?: string
  CLIPBOARD_MAX_BODY_CHARS?: string
  CLIPBOARD_MAX_ATTACHMENTS?: string
  CLIPBOARD_ATTACHMENT_MAX_MB?: string
  CLIPBOARD_MAX_EXPIRE_DAYS?: string
  CLIPBOARD_DRAFT_TTL_HOURS?: string
  CLIPBOARD_UPLOAD_TTL_HOURS?: string
  CLIPBOARD_CLEANUP_BATCH_SIZE?: string
  APP_DB?: D1Database
  LINKDISK_R2?: R2Bucket
}

type AppEnv = { Bindings: Bindings }
type JsonResponderContext = Pick<Context<AppEnv>, 'json'>
type UploadStrategy = 'worker-proxy-r2' | 'presigned-r2'

const DEFAULT_DOWNLOAD_PREFETCH_WINDOW = 5
const MAX_PART_SYNC_CONCURRENCY = 6
const CLIPBOARD_PASSWORD_ACCESS_TOKEN_PREFIX = 'pwd_'
const CLIPBOARD_SESSION_ACCESS_TOKEN_PREFIX = 'sess_'
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000

interface StatusError extends Error {
  status: number
}

export const app = new OpenAPIHono<AppEnv>()

function createRateLimitOptions(
  limit: number,
  keyGenerator: (c: Context<AppEnv>) => string,
  message: string
) {
  return {
    windowMs: DEFAULT_RATE_LIMIT_WINDOW_MS,
    limit,
    standardHeaders: 'draft-6',
    keyGenerator,
    message
  } as const
}

function createLazyRateLimitMiddleware(options: ReturnType<typeof createRateLimitOptions>): MiddlewareHandler<AppEnv> {
  let impl: MiddlewareHandler<AppEnv> | null = null
  return async (c, next) => {
    if (impl === null) {
      impl = rateLimiter<AppEnv>(options)
    }
    return impl(c, next)
  }
}

function getClientIp(c: Context<AppEnv>) {
  return c.req.header('cf-connecting-ip') ?? 'anonymous'
}

const adminRateLimitOptions = createRateLimitOptions(
  60,
  (c) => getClientIp(c),
  'Too many requests, please try again later.'
)

const clipboardAccessRateLimitOptions = createRateLimitOptions(
  12,
  (c) => getClientIp(c),
  'Too many access attempts, please try again later.'
)

const clipboardDraftInitRateLimitOptions = createRateLimitOptions(
  60,
  (c) => getClientIp(c),
  'Too many draft creation attempts, please try again later.'
)

const clipboardAttachmentInitRateLimitOptions = createRateLimitOptions(
  120,
  (c) => `${getClientIp(c)}:${c.req.param('entryId') ?? 'entry'}`,
  'Too many attachment upload attempts, please try again later.'
)

const clipboardAttachmentPartRateLimitOptions = createRateLimitOptions(
  1200,
  (c) => `${getClientIp(c)}:${c.req.param('objectId') ?? 'object'}`,
  'Too many upload requests, please try again later.'
)

const clipboardAttachmentCompleteRateLimitOptions = createRateLimitOptions(
  120,
  (c) => `${getClientIp(c)}:${c.req.param('objectId') ?? 'object'}`,
  'Too many attachment finalize attempts, please try again later.'
)

const clipboardPublishRateLimitOptions = createRateLimitOptions(
  60,
  (c) => `${getClientIp(c)}:${c.req.param('entryId') ?? 'entry'}`,
  'Too many publish attempts, please try again later.'
)

const clipboardPasswordVerifyRateLimitOptions = createRateLimitOptions(
  30,
  (c) => `${getClientIp(c)}:${c.req.param('shareId') ?? 'share'}`,
  'Too many password verification attempts, please try again later.'
)

const clipboardManageRateLimitOptions = createRateLimitOptions(
  240,
  (c) => `${getClientIp(c)}:${c.req.param('manageId') ?? 'manage'}`,
  'Too many manage requests, please try again later.'
)

const adminRateLimitMiddleware = createLazyRateLimitMiddleware(adminRateLimitOptions)
const clipboardAccessRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardAccessRateLimitOptions)
const clipboardDraftInitRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardDraftInitRateLimitOptions)
const clipboardAttachmentInitRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardAttachmentInitRateLimitOptions)
const clipboardAttachmentPartRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardAttachmentPartRateLimitOptions)
const clipboardAttachmentCompleteRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardAttachmentCompleteRateLimitOptions)
const clipboardPublishRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardPublishRateLimitOptions)
const clipboardPasswordVerifyRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardPasswordVerifyRateLimitOptions)
const clipboardManageRateLimitMiddleware = createLazyRateLimitMiddleware(clipboardManageRateLimitOptions)

function isStatusError(error: unknown): error is StatusError {
  return error instanceof Error
    && 'status' in error
    && typeof (error as { status?: unknown }).status === 'number'
}

const adminJwtMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (isEnabledFlag(c.env?.ADMIN_JWT_DISABLED)) {
    return next()
  }
  const secret = c.env?.ADMIN_JWT_SECRET
  if (!secret) {
    return c.json({ success: false, message: API_MESSAGES.missingAdminJwtSecret }, 500)
  }
  return jwt({ secret, alg: 'HS256' })(c, next)
}

const requestLoggerMiddleware: MiddlewareHandler<AppEnv> = async (c, next: Next) => {
  const startedAt = Date.now()
  const url = new URL(c.req.url)
  await next()
  console.log(
    JSON.stringify({
      type: 'request',
      method: c.req.method,
      path: url.pathname,
      status: c.res.status,
      durationMs: Date.now() - startedAt
    })
  )
}

app.use('*', requestLoggerMiddleware)
app.use('*', cors())
app.use('*', secureHeaders({
  crossOriginResourcePolicy: 'cross-origin'
}))
app.use('/api/linkdisk/*', etag())
app.use(API_PATHS.clipboardAccess, clipboardAccessRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/entries/init', clipboardDraftInitRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/entries/:entryId/attachments/init', clipboardAttachmentInitRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/entries/:entryId/attachments/:objectId/parts/:partIndex', clipboardAttachmentPartRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/entries/:entryId/attachments/:objectId/complete', clipboardAttachmentCompleteRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/entries/:entryId/publish', clipboardPublishRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/share/:shareId/verify-password', clipboardPasswordVerifyRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/manage/:manageId', clipboardManageRateLimitMiddleware)
app.use('/api/linkdisk/clipboard/manage/:manageId/*', clipboardManageRateLimitMiddleware)
app.use('/admin-api/linkdisk/*', adminRateLimitMiddleware)
app.use('/admin-api/linkdisk/*', adminJwtMiddleware)

function toUploadError(c: JsonResponderContext, message: string, status: 400 | 404 | 409 | 500 | 502) {
  return c.json({ success: false, message }, status)
}

function toApiError(c: JsonResponderContext, message: string, status: 400 | 401 | 403 | 404 | 409 | 416 | 500 | 502) {
  return c.json({ success: false, message }, status)
}

function readStringField(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function isEnabledFlag(rawValue: string | undefined): boolean {
  if (!rawValue) {
    return false
  }
  const normalized = rawValue.trim().toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on'
}

function parseChunkSizeMb(rawValue: string | number | undefined) {
  if (rawValue === undefined) {
    return undefined
  }
  const parsed = typeof rawValue === 'number' ? rawValue : Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('chunkSizeMb must be a positive number')
  }
  return parsed
}

function parseRequestTimeoutMs(rawValue: string | undefined) {
  if (!rawValue) {
    return undefined
  }
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('TELEGRAM_FETCH_TIMEOUT_MS must be a positive number')
  }
  return parsed
}

function parseDownloadPrefetchWindow(rawValue: string | undefined) {
  if (!rawValue) {
    return DEFAULT_DOWNLOAD_PREFETCH_WINDOW
  }
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_DOWNLOAD_PREFETCH_WINDOW
  }
  return Math.max(1, Math.min(8, Math.floor(parsed)))
}

function parsePartIndex(rawValue: string) {
  const parsed = Number(rawValue)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error('partIndex must be a non-negative integer')
  }
  return parsed
}

function isAllowedEmptyPartUpload(object: NonNullable<Awaited<ReturnType<typeof findObjectById>>>, partIndex: number, partSizeBytes: number) {
  return partSizeBytes === 0
    && object.sizeBytes === 0
    && object.totalParts === 1
    && partIndex === 0
}

function toObjectSummary(object: Awaited<ReturnType<typeof findObjectById>>) {
  if (!object) {
    return null
  }
  return {
    id: object.id,
    sha256: object.sha256,
    fileName: object.fileName,
    mimeType: object.mimeType,
    sizeBytes: object.sizeBytes,
    totalParts: object.totalParts,
    status: object.status,
    storageProvider: object.storageProvider
  }
}

function toContentDisposition(fileName: string): string {
  return `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
}

type ClipboardAttachmentMode = 'download'

function parseClipboardAttachmentMode(rawValue: string | undefined): ClipboardAttachmentMode {
  if (rawValue === undefined || rawValue === 'download') {
    return 'download'
  }
  throw new Error('mode must be download')
}

function resolveAttachmentMediaKind(mimeType: string): ClipboardAttachmentMediaKind {
  const normalized = mimeType.trim().toLowerCase()
  if (normalized.startsWith('image/')) {
    return 'image'
  }
  if (normalized.startsWith('video/')) {
    return 'video'
  }
  if (normalized.startsWith('audio/')) {
    return 'audio'
  }
  if (normalized === 'application/pdf') {
    return 'pdf'
  }
  if (normalized.startsWith('text/')) {
    return 'text'
  }
  return 'binary'
}

async function withConcurrency<T>(items: number[], limit: number, task: (item: number) => Promise<T>) {
  const results: T[] = []
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor
      cursor += 1
      const current = items[currentIndex]
      if (current === undefined) {
        continue
      }
      results.push(await task(current))
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

async function syncR2BackedUploadedParts(env: Bindings, objectId: string, totalParts: number) {
  const db = getDb(env)
  const bucket = env.LINKDISK_R2
  const currentParts = await findObjectPartsByObjectId(db, objectId)
  if (!bucket) {
    return currentParts
  }
  const known = new Set(currentParts.map((part) => part.partIndex))
  const missing = Array.from({ length: totalParts }, (_, index) => index).filter((index) => !known.has(index))
  const syncConcurrency = Math.min(MAX_PART_SYNC_CONCURRENCY, totalParts)
  const discovered = await withConcurrency(
    missing,
    syncConcurrency,
    async (partIndex) => headR2Part(bucket, { objectId, partIndex })
  )
  const partsToSave = discovered
    .filter((part): part is NonNullable<typeof part> => Boolean(part))
    .map((part) => ({
      partIndex: part.partIndex,
      partSizeBytes: part.partSizeBytes,
      r2ObjectKey: part.r2ObjectKey,
      providerFileId: null
    }))
  if (partsToSave.length > 0) {
    await saveObjectParts(db, { objectId, parts: partsToSave })
  }
  return findObjectPartsByObjectId(db, objectId)
}

async function readObjectLeadingBytes(
  env: Bindings,
  parts: StoredObjectPart[],
  maxBytes = 512
): Promise<Uint8Array | null> {
  if (!env.LINKDISK_R2) {
    return null
  }
  const firstPart = parts.find((part) => part.partIndex === 0 && part.r2ObjectKey)
  if (!firstPart?.r2ObjectKey || firstPart.partSizeBytes === 0) {
    return null
  }
  const object = await env.LINKDISK_R2.get(firstPart.r2ObjectKey, {
    range: { offset: 0, length: maxBytes }
  })
  if (!object) {
    return null
  }
  return new Uint8Array(await object.arrayBuffer())
}

async function detectObjectMimeTypeFromParts(
  env: Bindings,
  parts: StoredObjectPart[]
): Promise<string | null> {
  const leadingBytes = await readObjectLeadingBytes(env, parts)
  if (!leadingBytes || leadingBytes.length === 0) {
    return null
  }
  return detectMimeTypeFromBytes(leadingBytes)
}

async function resolveObjectMimeType(
  env: Bindings,
  db: ReturnType<typeof getDb>,
  payload: {
    objectId: string
    fallbackMimeType: string
    parts: StoredObjectPart[]
  }
) {
  const detectedMimeType = await detectObjectMimeTypeFromParts(env, payload.parts)
  const resolvedMimeType = detectedMimeType ?? payload.fallbackMimeType
  if (detectedMimeType && detectedMimeType !== payload.fallbackMimeType) {
    await updateObjectMimeType(db, {
      objectId: payload.objectId,
      mimeType: detectedMimeType
    })
  }
  return resolvedMimeType
}

function selectUploadStrategy(env: Bindings): UploadStrategy {
  return isDirectR2UploadEnabled(env) ? 'presigned-r2' : 'worker-proxy-r2'
}

function hasObjectMetadataMismatch(existing: NonNullable<Awaited<ReturnType<typeof findObjectById>>>, payload: {
  sha256?: string
  fileName: string
  mimeType?: string
  sizeBytes: number
}) {
  return existing.fileName !== payload.fileName
    || existing.mimeType !== (payload.mimeType || 'application/octet-stream')
    || existing.sizeBytes !== payload.sizeBytes
    || (payload.sha256 ? existing.sha256 !== payload.sha256 : false)
}

async function buildUploadSession(env: Bindings, payload: {
  objectId: string
  sha256?: string
  fileName: string
  mimeType?: string
  sizeBytes: number
  chunkSizeMb?: number
}) {
  if (!env.LINKDISK_R2) {
    throw new Error('Missing R2 binding LINKDISK_R2')
  }
  const db = getDb(env)
  const existing = await findObjectById(db, payload.objectId)
  if (existing && hasObjectMetadataMismatch(existing, payload)) {
    throw Object.assign(new Error(`Upload session metadata mismatch: ${payload.objectId}`), { status: 409 })
  }
  const normalizedMimeType = payload.mimeType || 'application/octet-stream'
  const normalizedSha256 = payload.sha256 ?? existing?.sha256 ?? payload.objectId
  const totalParts = getTotalParts(payload.sizeBytes, payload.chunkSizeMb)
  const strategy = selectUploadStrategy(env)
  const uploadStrategy = 'r2'
  const storageProvider = 'r2'
  if (!existing || existing.status !== 'ready') {
    await saveUploadingObject(db, {
      objectId: payload.objectId,
      sha256: normalizedSha256,
      fileName: payload.fileName,
      mimeType: normalizedMimeType,
      sizeBytes: payload.sizeBytes,
      totalParts,
      uploadStrategy,
      storageProvider,
      archiveStatus: 'pending'
    })
  }
  const object = await findObjectById(db, payload.objectId)
  if (!object) {
    throw new Error(`Upload session not found after save: ${payload.objectId}`)
  }
  const parts = await syncR2BackedUploadedParts(env, payload.objectId, totalParts)
  const uploadedPartIndexes = parts.map((part) => part.partIndex).sort((left, right) => left - right)
  let partUploadUrls: Array<string | null> | undefined
  let expiresAt: string | undefined
  if (strategy === 'presigned-r2') {
    partUploadUrls = Array.from({ length: totalParts }, () => null)
    const missing = Array.from({ length: totalParts }, (_, index) => index).filter((index) => !uploadedPartIndexes.includes(index))
    const signed = await withConcurrency(
      missing,
      MAX_PART_SYNC_CONCURRENCY,
      async (partIndex) => ({
        partIndex,
        ...(await createPresignedR2PartUploadUrl(env, {
          objectId: payload.objectId,
          partIndex,
          contentType: normalizedMimeType
        }))
      })
    )
    for (const item of signed) {
      partUploadUrls[item.partIndex] = item.url
      expiresAt = item.expiresAt
    }
  }
  return {
    object,
    upload: {
      strategy,
      objectId: payload.objectId,
      chunkSizeBytes: getChunkSizeBytes(payload.chunkSizeMb),
      totalParts,
      uploadedPartIndexes,
      partUploadUrls,
      expiresAt
    }
  }
}

function parseRangeHeader(rangeHeader: string | null, totalSize: number) {
  if (!rangeHeader) {
    return null
  }
  const trimmed = rangeHeader.trim()
  if (!trimmed.startsWith('bytes=') || trimmed.includes(',')) {
    throw new Error('Invalid range')
  }
  const match = /^bytes=(\d*)-(\d*)$/.exec(trimmed)
  if (!match || (!match[1] && !match[2]) || totalSize <= 0) {
    throw new Error('Invalid range')
  }
  let start = 0
  let endInclusive = totalSize - 1
  if (!match[1]) {
    const suffix = Number(match[2])
    if (!Number.isInteger(suffix) || suffix <= 0) {
      throw new Error('Invalid range')
    }
    start = Math.max(0, totalSize - suffix)
  } else {
    start = Number(match[1])
    endInclusive = match[2] ? Number(match[2]) : totalSize - 1
    if (!Number.isInteger(start) || start < 0 || !Number.isInteger(endInclusive) || endInclusive < start || start >= totalSize) {
      throw new Error('Invalid range')
    }
    endInclusive = Math.min(endInclusive, totalSize - 1)
  }
  return { start, endInclusive }
}

function createOpaqueId(length = 14): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

function createNumericShareId(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (byte) => String(byte % 10)).join('')
}

function createEntryScopedObjectId(entryId: string, rawObjectId: string | undefined) {
  const prefix = `${entryId}_`
  if (rawObjectId?.startsWith(prefix)) {
    return rawObjectId
  }
  return `${prefix}${crypto.randomUUID()}`
}

async function createClipboardDraftWithRetry(db: ReturnType<typeof getDb>) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = {
      entryId: crypto.randomUUID(),
      shareId: createNumericShareId(8),
      manageId: createOpaqueId(24)
    }
    try {
      await createClipboardDraft(db, candidate)
      return candidate
    } catch (error) {
      if (!(error instanceof Error) || !/unique|constraint/i.test(error.message)) {
        throw error
      }
    }
  }
  throw new Error('Unable to allocate clipboard identifiers')
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqualText(left: string, right: string) {
  const encoder = new TextEncoder()
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)
  const maxLength = Math.max(leftBytes.length, rightBytes.length)
  let mismatch = leftBytes.length ^ rightBytes.length
  for (let index = 0; index < maxLength; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0)
  }
  return mismatch === 0
}

function parsePositiveIntOrDefault(rawValue: string | undefined, fallback: number): number {
  if (!rawValue) {
    return fallback
  }
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }
  return Math.floor(parsed)
}

function parseClipboardBodyFormat(rawValue: unknown): ClipboardBodyFormat {
  void rawValue
  return 'plain_text'
}

function parseClipboardDestroyMode(rawValue: unknown): ClipboardDestroyMode {
  if (rawValue === 'manual' || rawValue === 'expire' || rawValue === 'max_views' || rawValue === 'first_view') {
    return rawValue
  }
  return 'none'
}

function parseOptionalMaxViews(rawValue: unknown): number | null {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return null
  }
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('maxViews must be a positive integer')
  }
  return Math.floor(parsed)
}

function parseOptionalExpiresAt(rawValue: unknown, maxDays: number): string | null {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return null
  }
  if (typeof rawValue !== 'string') {
    throw new Error('expiresAt must be an ISO string')
  }
  const parsed = new Date(rawValue)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('expiresAt must be an ISO string')
  }
  const now = Date.now()
  const maxMs = maxDays * 24 * 60 * 60 * 1000
  if (parsed.getTime() <= now) {
    throw new Error('expiresAt must be in the future')
  }
  if (parsed.getTime() - now > maxMs) {
    throw new Error(`expiresAt cannot exceed ${maxDays} days in the future`)
  }
  return parsed.toISOString()
}

function getClipboardLimits(env: Bindings) {
  return {
    maxBodyChars: parsePositiveIntOrDefault(env.CLIPBOARD_MAX_BODY_CHARS, 100_000),
    maxAttachments: parsePositiveIntOrDefault(env.CLIPBOARD_MAX_ATTACHMENTS, 50),
    maxExpireDays: parsePositiveIntOrDefault(env.CLIPBOARD_MAX_EXPIRE_DAYS, 30)
  }
}

async function verifyTurnstileToken(env: Bindings, token: string | undefined, remoteIp: string | undefined): Promise<boolean> {
  const siteKey = env.TURNSTILE_SITE_KEY?.trim()
  const secretKey = env.TURNSTILE_SECRET_KEY?.trim()

  if (!siteKey && !secretKey) {
    return true
  }
  if (!secretKey) {
    throw new Error('Missing TURNSTILE_SECRET_KEY')
  }
  if (!token) {
    return false
  }
  const body = new URLSearchParams()
  body.set('secret', secretKey)
  body.set('response', token)
  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  })
  if (!response.ok) {
    return false
  }
  const payload = await response.json()
  return typeof payload === 'object'
    && payload !== null
    && 'success' in payload
    && payload.success === true
}

function getDashboardTokenFromRequest(c: Context<AppEnv>): string | undefined {
  const authorization = c.req.header('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim()
  }
  return c.req.header('x-dashboard-token')?.trim()
}

function isClipboardEntryExpired(expiresAt: string | null, nowIso: string): boolean {
  return expiresAt !== null && expiresAt <= nowIso
}

type ClipboardResolvedStatus = 'draft' | 'published' | 'deleted' | 'destroyed' | 'disabled' | 'expired'

function resolveClipboardStatus(
  entryStatus: string,
  settings: { disabled: boolean; expiresAt: string | null },
  nowIso: string
): ClipboardResolvedStatus {
  if (entryStatus === 'deleted') {
    return 'deleted'
  }
  if (entryStatus === 'destroyed') {
    return 'destroyed'
  }
  if (settings.disabled) {
    return 'disabled'
  }
  if (isClipboardEntryExpired(settings.expiresAt, nowIso)) {
    return 'expired'
  }
  return entryStatus === 'published' ? 'published' : 'draft'
}

function normalizeClipboardText(rawValue: unknown, maxBodyChars: number): string {
  if (typeof rawValue !== 'string') {
    return ''
  }
  const normalized = rawValue.replace(/\r\n/g, '\n')
  if (normalized.length > maxBodyChars) {
    throw new Error(`body cannot exceed ${maxBodyChars} characters`)
  }
  return normalized
}

function normalizeClipboardTitle(rawValue: unknown): string | null {
  if (typeof rawValue !== 'string') {
    return null
  }
  const trimmed = rawValue.trim()
  return trimmed ? trimmed.slice(0, 200) : null
}

function assertClipboardContentPresent(payload: {
  title: string | null | undefined
  bodyText: string | undefined
  attachmentCount: number
}) {
  const hasTitle = Boolean(payload.title)
  const hasBody = Boolean(payload.bodyText?.trim())
  const hasAttachments = payload.attachmentCount > 0
  if (!hasTitle && !hasBody && !hasAttachments) {
    throw new Error('请至少填写标题、正文，或上传一个附件。')
  }
}

function buildClipboardPublicPaths(locale: string, shareId: string, manageId: string) {
  return {
    sharePath: `/${locale}/linkdisk/s/${encodeURIComponent(shareId)}`,
    managePath: `/${locale}/linkdisk/m/${encodeURIComponent(manageId)}`,
    shortPath: `/${locale}/linkdisk/s/${encodeURIComponent(shareId)}`
  }
}

function buildClipboardAttachmentPath(shareId: string, attachmentId: number): string {
  return `/api/linkdisk/clipboard/share/${encodeURIComponent(shareId)}/attachments/${encodeURIComponent(String(attachmentId))}`
}

function buildClipboardAttachmentModeUrl(
  requestUrl: string,
  shareId: string,
  attachmentId: number
) {
  const url = new URL(buildClipboardAttachmentPath(shareId, attachmentId), requestUrl)
  return url.toString()
}

function createClipboardAccessTokenValue(purpose: 'password' | 'session') {
  const prefix = purpose === 'session'
    ? CLIPBOARD_SESSION_ACCESS_TOKEN_PREFIX
    : CLIPBOARD_PASSWORD_ACCESS_TOKEN_PREFIX
  return `${prefix}${createOpaqueId(32)}`
}

function resolveClipboardAccessTokenPurpose(token: string | undefined): 'password' | 'session' | null {
  if (!token) {
    return null
  }
  if (token.startsWith(CLIPBOARD_SESSION_ACCESS_TOKEN_PREFIX)) {
    return 'session'
  }
  if (token.startsWith(CLIPBOARD_PASSWORD_ACCESS_TOKEN_PREFIX)) {
    return 'password'
  }
  // Backward compatibility for tokens created before purpose prefixes were introduced.
  return 'password'
}

async function ensureClipboardShareSessionAccessToken(
  db: ReturnType<typeof getDb>,
  payload: {
    entryId: string
    shareId: string
    existingToken?: string
  }
) {
  if (resolveClipboardAccessTokenPurpose(payload.existingToken) === 'session') {
    return payload.existingToken
  }
  const accessToken = createClipboardAccessTokenValue('session')
  const expiresAt = new Date(Date.now() + (60 * 60 * 1000)).toISOString()
  await createClipboardShareAccessToken(db, {
    token: accessToken,
    entryId: payload.entryId,
    shareId: payload.shareId,
    expiresAt
  })
  return accessToken
}

function normalizeClipboardDestroyConfig(payload: {
  destroyMode: ClipboardDestroyMode
  expiresAt: string | null
  maxViews: number | null
}) {
  if (payload.destroyMode === 'first_view') {
    return {
      destroyMode: payload.destroyMode,
      expiresAt: null,
      maxViews: 1
    }
  }
  if (payload.destroyMode === 'max_views') {
    if (payload.maxViews === null) {
      throw new Error('maxViews is required when destroyMode=max_views')
    }
    return {
      destroyMode: payload.destroyMode,
      expiresAt: null,
      maxViews: payload.maxViews
    }
  }
  if (payload.destroyMode === 'expire') {
    if (payload.expiresAt === null) {
      throw new Error('expiresAt is required when destroyMode=expire')
    }
    return {
      destroyMode: payload.destroyMode,
      expiresAt: payload.expiresAt,
      maxViews: null
    }
  }
  return {
    destroyMode: payload.destroyMode,
    expiresAt: null,
    maxViews: null
  }
}

function getClipboardShareAccessToken(c: Context<AppEnv>): string | undefined {
  const authorization = c.req.header('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim()
  }
  return c.req.header('x-share-access-token')?.trim()
}

function getClipboardManageIdHeader(c: Context<AppEnv>): string | undefined {
  return c.req.header('x-clipboard-manage-id')?.trim()
}

function normalizeLocaleSegment(rawValue: unknown): string {
  if (typeof rawValue !== 'string') {
    return 'zh'
  }
  const normalized = rawValue.trim().replace(/^\//, '')
  return normalized || 'zh'
}

async function readClipboardBodyFromStorage(env: Bindings, entry: Awaited<ReturnType<typeof findClipboardEntryById>>) {
  if (!entry) {
    return null
  }
  if (!entry.bodyR2Key) {
    return ''
  }
  const bucket = env.LINKDISK_R2
  if (!bucket) {
    throw new Error('Missing R2 binding LINKDISK_R2')
  }
  return getClipboardBodyText(bucket, entry.bodyR2Key)
}

async function serializeClipboardEntryWithBody(
  env: Bindings,
  entry: Awaited<ReturnType<typeof findClipboardEntryById>>
): Promise<ClipboardEntry | null> {
  if (!entry) {
    return null
  }
  return {
    id: entry.id,
    title: entry.title,
    body: (await readClipboardBodyFromStorage(env, entry)) ?? '',
    bodyFormat: entry.bodyFormat,
    status: entry.status,
    shareId: entry.shareId,
    manageId: entry.manageId,
    publishedAt: entry.publishedAt,
    destroyedAt: entry.destroyedAt,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  }
}

async function serializeClipboardShareAttachment(
  env: Bindings,
  db: ReturnType<typeof getDb>,
  payload: {
    requestUrl: string
    shareId: string
    attachment: StoredClipboardAttachment
  }
): Promise<ClipboardShareAttachment> {
  const parts = await findObjectPartsByObjectId(db, payload.attachment.objectId)
  const resolvedMimeType = await resolveObjectMimeType(env, db, {
    objectId: payload.attachment.objectId,
    fallbackMimeType: payload.attachment.mimeType,
    parts
  })
  const mediaKind = resolveAttachmentMediaKind(resolvedMimeType)
  return {
    ...payload.attachment,
    mimeType: resolvedMimeType,
    mediaKind,
    downloadUrl: buildClipboardAttachmentModeUrl(payload.requestUrl, payload.shareId, payload.attachment.id)
  }
}

async function recreateClipboardShareSnapshot(
  env: Bindings,
  db: ReturnType<typeof getDb>,
  payload: {
    entry: Awaited<ReturnType<typeof findClipboardEntryById>>
    settings: Awaited<ReturnType<typeof findClipboardShareSettings>>
    attachments: Awaited<ReturnType<typeof listClipboardAttachments>>
  }
) {
  if (!payload.entry || !payload.settings) {
    throw new Error('Clipboard share snapshot is incomplete')
  }
  if (!env.LINKDISK_R2) {
    throw new Error('Missing R2 binding LINKDISK_R2')
  }

  const created = await createClipboardDraftWithRetry(db)
  const bodyText = await readClipboardBodyFromStorage(env, payload.entry) ?? ''
  const storedBody = await putClipboardBody(env.LINKDISK_R2, {
    entryId: created.entryId,
    bodyText
  })

  await cloneClipboardAttachmentsToEntry(db, {
    entryId: created.entryId,
    attachments: payload.attachments.map((attachment) => ({
      objectId: attachment.objectId,
      displayName: attachment.displayName,
      sortOrder: attachment.sortOrder
    }))
  })

  await publishClipboardEntry(db, {
    entryId: created.entryId,
    title: payload.entry.title,
    bodyStorageProvider: 'r2',
    bodyR2Key: storedBody.key,
    bodySizeBytes: storedBody.sizeBytes,
    bodySha256: storedBody.sha256,
    bodyFormat: payload.entry.bodyFormat,
    passwordHash: payload.settings.passwordHash,
    expiresAt: payload.settings.expiresAt,
    maxViews: payload.settings.maxViews,
    destroyMode: payload.settings.destroyMode,
    disabled: false
  })

  await recordClipboardEvent(db, { entryId: payload.entry.id, eventType: 'recreate_share' })
  await recordClipboardEvent(db, { entryId: created.entryId, eventType: 'recreated_from_share' })

  return created
}

async function cleanupClipboardBody(env: Bindings, entry: Awaited<ReturnType<typeof findClipboardEntryById>>) {
  if (!entry?.bodyR2Key || !env.LINKDISK_R2) {
    return
  }
  await deleteClipboardBody(env.LINKDISK_R2, entry.bodyR2Key)
}

async function cleanupObjectParts(env: Bindings, objectId: string) {
  if (!env.LINKDISK_R2) {
    return
  }
  const db = getDb(env)
  const parts = await findObjectPartsByObjectId(db, objectId)
  await Promise.all(parts.map(async (part) => {
    if (part.r2ObjectKey) {
      await env.LINKDISK_R2?.delete(part.r2ObjectKey)
    }
  }))
}

function subtractHours(nowIso: string, hours: number) {
  return new Date(new Date(nowIso).getTime() - (hours * 60 * 60 * 1000)).toISOString()
}

async function runClipboardCleanupCron(env: Bindings) {
  const db = getDb(env)
  const nowIso = new Date().toISOString()
  await deleteExpiredClipboardShareAccessTokens(db, nowIso)

  const cleanupBatchSize = parsePositiveIntOrDefault(env.CLIPBOARD_CLEANUP_BATCH_SIZE, 100)
  const staleDrafts = await listStaleClipboardDrafts(db, {
    updatedBeforeIso: subtractHours(nowIso, parsePositiveIntOrDefault(env.CLIPBOARD_DRAFT_TTL_HOURS, 24)),
    limit: cleanupBatchSize
  })
  for (const draft of staleDrafts) {
    const draftAttachments = await listClipboardAttachments(db, draft.id)
    await cleanupClipboardBody(env, draft)
    await deleteClipboardEntryPermanently(db, draft.id)
    for (const attachment of draftAttachments) {
      if (await isObjectUnreferenced(db, attachment.objectId)) {
        await cleanupObjectParts(env, attachment.objectId)
        await deleteObjectPermanently(db, attachment.objectId)
      }
    }
  }

  const staleOrphanObjects = await listStaleOrphanObjects(db, {
    updatedBeforeIso: subtractHours(nowIso, parsePositiveIntOrDefault(env.CLIPBOARD_UPLOAD_TTL_HOURS, 24)),
    limit: cleanupBatchSize
  })
  for (const object of staleOrphanObjects) {
    await cleanupObjectParts(env, object.id)
    await deleteObjectPermanently(db, object.id)
  }
}

function normalizeShareIdInput(rawValue: unknown): string {
  if (typeof rawValue !== 'string') {
    throw new Error('shareId must be a string')
  }
  const normalized = rawValue.trim()
  if (!/^\d{8}$/.test(normalized)) {
    throw new Error('shareId must be an 8-digit numeric code')
  }
  return normalized
}

async function buildObjectDownloadResponse(
  c: Context<AppEnv>,
  objectId: string,
  fileNameOverride?: string,
  contentTypeOverride?: string
) {
  let requestTimeoutMs: number | undefined
  try {
    requestTimeoutMs = parseRequestTimeoutMs(c.env.TELEGRAM_FETCH_TIMEOUT_MS)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Invalid download config', 400)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const object = await findObjectById(db, objectId)
  if (!object) {
    return toApiError(c, `Object not found: ${objectId}`, 404)
  }
  if (object.status !== 'ready') {
    return toApiError(c, `Object is not ready: ${objectId}`, 409)
  }
  const parts = await findObjectPartsByObjectId(db, objectId)
  if (parts.length === 0) {
    return toApiError(c, `Object parts not found: ${objectId}`, 404)
  }
  const totalSize = object.sizeBytes > 0 ? object.sizeBytes : getTotalSizeFromParts(parts)
  let selectedRange: { start: number; endInclusive: number } | null = null
  try {
    selectedRange = parseRangeHeader(c.req.header('range') ?? null, totalSize)
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Requested range is not satisfiable' }), {
      status: 416,
      headers: new Headers({ 'content-range': `bytes */${totalSize}` })
    })
  }

  try {
    const startOffset = selectedRange?.start ?? 0
    const endOffsetExclusive = selectedRange ? selectedRange.endInclusive + 1 : totalSize
    const contentLength = Math.max(0, endOffsetExclusive - startOffset)
    const stream = buildObjectStreamWithR2Fallback(
      {
        apiToken: c.env.TELEGRAM_API_TOKEN,
        requestTimeoutMs,
        r2Bucket: c.env.LINKDISK_R2,
        prefetchWindow: parseDownloadPrefetchWindow(c.env.DOWNLOAD_PREFETCH_WINDOW),
        onResolvedTelegramFilePath: async (part, providerFilePath) => {
          try {
            await saveObjectParts(db, {
              objectId,
              parts: [{
                partIndex: part.partIndex,
                partSizeBytes: part.partSizeBytes,
                providerFileId: part.providerFileId,
                providerFilePath,
                r2ObjectKey: part.r2ObjectKey
              }]
            })
          } catch (error) {
            console.warn(
              '[download] failed to cache telegram file path',
              objectId,
              part.partIndex,
              error instanceof Error ? error.message : error
            )
          }
        }
      },
      parts,
      { startOffset, endOffsetExclusive }
    )
    const headers = new Headers()
    headers.set('accept-ranges', 'bytes')
    headers.set('content-type', contentTypeOverride || object.mimeType || 'application/octet-stream')
    headers.set('content-disposition', toContentDisposition(fileNameOverride ?? object.fileName))
    headers.set('cache-control', 'no-store')
    headers.set('content-length', String(contentLength))
    if (selectedRange) {
      headers.set('content-range', `bytes ${selectedRange.start}-${selectedRange.endInclusive}/${totalSize}`)
    }
    return new Response(stream, { status: selectedRange ? 206 : 200, headers })
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      return toApiError(c, String((error as { message: unknown }).message), 502)
    }
    return toApiError(c, 'Unknown download error', 500)
  }
}

app.get(API_PATHS.health, (c) => c.json(createHealthResponse(), 200))

app.post('/api/linkdisk/clipboard/entries/init', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }

  const body: { turnstileToken?: string } = await c.req.json<{ turnstileToken?: string }>().catch(() => ({}))
  let turnstileOk = false
  try {
    turnstileOk = await verifyTurnstileToken(c.env, body.turnstileToken, c.req.header('cf-connecting-ip'))
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Turnstile verification misconfigured', 500)
  }
  if (!turnstileOk) {
    return toApiError(c, 'Turnstile verification failed', 403)
  }

  try {
    const created = await createClipboardDraftWithRetry(db)
    return c.json({
      success: true,
      data: {
        entryId: created.entryId,
        shareId: created.shareId,
        manageId: created.manageId
      }
    }, 200)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to create clipboard draft', 500)
  }
})

app.post('/api/linkdisk/clipboard/access', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }

  const body: {
    shareId?: string
    password?: string
    locale?: string
  } = await c.req.json<{
    shareId?: string
    password?: string
    locale?: string
  }>().catch(() => ({}))

  let shareId = ''
  try {
    shareId = normalizeShareIdInput(body.shareId)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Invalid access code', 400)
  }

  const entry = await findClipboardEntryByShareId(db, shareId)
  if (!entry) {
    return toApiError(c, '内容不存在或已失效', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  if (!settings) {
    return toApiError(c, '内容不存在或已失效', 404)
  }
  const nowIso = new Date().toISOString()
  const resolvedStatus = resolveClipboardStatus(entry.status, settings, nowIso)
  if (resolvedStatus !== 'published') {
    return toApiError(c, '内容不存在或已失效', 404)
  }
  if (settings.maxViews !== null && settings.viewCount >= settings.maxViews) {
    return toApiError(c, '内容不存在或已失效', 404)
  }

  let accessToken: string | null = null
  if (settings.passwordHash) {
    const candidateHash = await sha256Hex(body.password?.trim() ?? '')
    if (!timingSafeEqualText(candidateHash, settings.passwordHash)) {
      return toApiError(c, '口令或密码错误', 403)
    }
    accessToken = createClipboardAccessTokenValue('password')
    const expiresAt = new Date(Date.now() + (60 * 60 * 1000)).toISOString()
    await createClipboardShareAccessToken(db, {
      token: accessToken,
      entryId: entry.id,
      shareId,
      expiresAt
    })
  }

  const publicPaths = buildClipboardPublicPaths(normalizeLocaleSegment(body.locale), entry.shareId, entry.manageId)
  return c.json({
    success: true,
    data: {
      shareId: entry.shareId,
      sharePath: publicPaths.sharePath,
      accessToken
    }
  }, 200)
})

app.post('/api/linkdisk/clipboard/entries/:entryId/attachments/init', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const entryId = c.req.param('entryId')?.trim()
  if (!entryId) {
    return toUploadError(c, 'Path param entryId is required', 400)
  }

  const body = await c.req.json<{
    manageId?: string
    objectId?: string
    fileName: string
    mimeType?: string
    sizeBytes: number
    chunkSizeMb?: number
  }>()

  const entry = await findClipboardEntryById(db, entryId)
  if (!entry || entry.manageId !== body.manageId) {
    return toUploadError(c, 'Clipboard entry not found or manageId is invalid', 404)
  }
  if (entry.status === 'deleted' || entry.status === 'destroyed') {
    return toUploadError(c, `Clipboard entry is not writable: ${entry.status}`, 409)
  }

  const limits = getClipboardLimits(c.env)
  const currentAttachments = await listClipboardAttachments(db, entryId)
  if (currentAttachments.length >= limits.maxAttachments) {
    return toUploadError(c, `附件数量不能超过 ${limits.maxAttachments} 个`, 409)
  }

  try {
    const session = await buildUploadSession(c.env, {
      objectId: createEntryScopedObjectId(entryId, body.objectId?.trim()),
      fileName: body.fileName,
      mimeType: body.mimeType,
      sizeBytes: body.sizeBytes,
      chunkSizeMb: parseChunkSizeMb(body.chunkSizeMb)
    })
    return c.json({
      success: true,
      data: {
        object: toObjectSummary(session.object),
        upload: session.upload
      }
    }, 200)
  } catch (error) {
    if (isStatusError(error)) {
      return toUploadError(c, error.message || 'Attachment init failed', 409)
    }
    return toUploadError(c, error instanceof Error ? error.message : 'Unknown attachment init error', 500)
  }
})

app.put('/api/linkdisk/clipboard/entries/:entryId/attachments/:objectId/parts/:partIndex', async (c) => {
  if (!c.env.LINKDISK_R2) {
    return toUploadError(c, 'Missing R2 binding LINKDISK_R2', 500)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const entryId = c.req.param('entryId')?.trim()
  const objectId = c.req.param('objectId')?.trim()
  const manageId = getClipboardManageIdHeader(c)
  if (!entryId || !objectId) {
    return toUploadError(c, 'Path params entryId and objectId are required', 400)
  }
  if (!manageId) {
    return toUploadError(c, 'Manage header x-clipboard-manage-id is required', 400)
  }
  if (!objectId.startsWith(`${entryId}_`)) {
    return toUploadError(c, 'Upload session does not belong to this entry', 404)
  }
  const entry = await findClipboardEntryById(db, entryId)
  if (!entry || entry.manageId !== manageId) {
    return toUploadError(c, 'Clipboard entry not found or manageId is invalid', 404)
  }
  let partIndex = 0
  try {
    partIndex = parsePartIndex(c.req.param('partIndex'))
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Invalid part index', 400)
  }
  const object = await findObjectById(db, objectId)
  if (!object) {
    return toUploadError(c, `Upload session not found: ${objectId}`, 404)
  }
  const partBytes = await c.req.arrayBuffer()
  if (!isAllowedEmptyPartUpload(object, partIndex, partBytes.byteLength) && partBytes.byteLength === 0) {
    return toUploadError(c, 'Chunk body is required', 400)
  }
  const chunk = await putR2Part(c.env.LINKDISK_R2, {
    objectId,
    partIndex,
    partData: partBytes,
    contentType: object.mimeType || c.req.header('content-type') || 'application/octet-stream'
  })
  await saveObjectParts(db, {
    objectId,
    parts: [{ partIndex, partSizeBytes: chunk.partSizeBytes, r2ObjectKey: chunk.r2ObjectKey, providerFileId: null }]
  })
  await touchObjectUpdatedAt(db, objectId)
  return c.json({ success: true, data: { chunk } }, 200)
})

app.post('/api/linkdisk/clipboard/entries/:entryId/attachments/:objectId/complete', async (c) => {
  if (!c.env.LINKDISK_R2) {
    return toUploadError(c, 'Missing R2 binding LINKDISK_R2', 500)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const entryId = c.req.param('entryId')?.trim()
  const objectId = c.req.param('objectId')?.trim()
  if (!entryId || !objectId) {
    return toUploadError(c, 'Path params entryId and objectId are required', 400)
  }
  const body: { manageId?: string; displayName?: string } = await c.req.json<{ manageId?: string; displayName?: string }>().catch(() => ({}))
  const entry = await findClipboardEntryById(db, entryId)
  if (!entry || entry.manageId !== body.manageId) {
    return toUploadError(c, 'Clipboard entry not found or manageId is invalid', 404)
  }
  if (!objectId.startsWith(`${entryId}_`)) {
    return toUploadError(c, 'Upload session does not belong to this entry', 404)
  }
  const object = await findObjectById(db, objectId)
  if (!object) {
    return toUploadError(c, `Upload session not found: ${objectId}`, 404)
  }
  await syncR2BackedUploadedParts(c.env, objectId, object.totalParts)
  const parts = await findObjectPartsByObjectId(db, objectId)
  if (parts.length !== object.totalParts) {
    return toUploadError(c, `Upload is incomplete: expected ${object.totalParts} parts, got ${parts.length}`, 409)
  }
  const uploadedSizeBytes = parts.reduce((sum, part) => sum + part.partSizeBytes, 0)
  if (uploadedSizeBytes !== object.sizeBytes) {
    return toUploadError(
      c,
      `Upload size mismatch: expected ${object.sizeBytes} bytes, got ${uploadedSizeBytes}`,
      409
    )
  }
  await resolveObjectMimeType(c.env, db, {
    objectId,
    fallbackMimeType: object.mimeType,
    parts
  })
  await markObjectReady(db, objectId, parts.length)
  const existingAttachments = await listClipboardAttachments(db, entryId)
  if (!existingAttachments.some((attachment) => attachment.objectId === objectId)) {
    await createClipboardAttachment(db, {
      entryId,
      objectId,
      displayName: body.displayName?.trim() || object.fileName
    })
  }
  const attachments = await listClipboardAttachments(db, entryId)
  return c.json({
    success: true,
    data: {
      attachments
    }
  }, 200)
})

app.post('/api/linkdisk/clipboard/entries/:entryId/publish', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const entryId = c.req.param('entryId')?.trim()
  if (!entryId) {
    return toApiError(c, 'Path param entryId is required', 400)
  }

  const body = await c.req.json<{
    manageId?: string
    locale?: string
    title?: string
    body?: string
    bodyFormat?: ClipboardBodyFormat
    password?: string
    expiresAt?: string | null
    maxViews?: number | null
    destroyMode?: ClipboardDestroyMode
  }>()

  const entry = await findClipboardEntryById(db, entryId)
  if (!entry || entry.manageId !== body.manageId) {
    return toApiError(c, 'Clipboard entry not found or manageId is invalid', 404)
  }

  try {
    const limits = getClipboardLimits(c.env)
    const normalizedBody = normalizeClipboardText(body.body, limits.maxBodyChars)
    const normalizedTitle = normalizeClipboardTitle(body.title)
    const normalizedFormat = parseClipboardBodyFormat(body.bodyFormat)
    const attachments = await listClipboardAttachments(db, entryId)
    assertClipboardContentPresent({
      title: normalizedTitle,
      bodyText: normalizedBody,
      attachmentCount: attachments.length
    })
    if (!c.env.LINKDISK_R2) {
      return toApiError(c, 'Missing R2 binding LINKDISK_R2', 500)
    }
    const storedBody = await putClipboardBody(c.env.LINKDISK_R2, {
      entryId,
      bodyText: normalizedBody
    })
    const passwordHash = body.password?.trim() ? await sha256Hex(body.password.trim()) : null
    const normalizedDestroyConfig = normalizeClipboardDestroyConfig({
      expiresAt: parseOptionalExpiresAt(body.expiresAt, limits.maxExpireDays),
      maxViews: parseOptionalMaxViews(body.maxViews),
      destroyMode: parseClipboardDestroyMode(body.destroyMode)
    })
    await publishClipboardEntry(db, {
      entryId,
      title: normalizedTitle,
      bodyStorageProvider: 'r2',
      bodyR2Key: storedBody.key,
      bodySizeBytes: storedBody.sizeBytes,
      bodySha256: storedBody.sha256,
      bodyFormat: normalizedFormat,
      passwordHash,
      expiresAt: normalizedDestroyConfig.expiresAt,
      maxViews: normalizedDestroyConfig.maxViews,
      destroyMode: normalizedDestroyConfig.destroyMode
    })
    const locale = (body.locale?.trim() || 'zh').replace(/^\//, '')
    const publicPaths = buildClipboardPublicPaths(locale, entry.shareId, entry.manageId)
    return c.json({
      success: true,
      data: {
        entryId,
        shareId: entry.shareId,
        manageId: entry.manageId,
        sharePath: publicPaths.sharePath,
        managePath: publicPaths.managePath,
        shortPath: publicPaths.shortPath
      }
    }, 200)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to publish clipboard entry', 400)
  }
})

app.get('/api/linkdisk/clipboard/share/:shareId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const shareId = c.req.param('shareId')?.trim()
  if (!shareId) {
    return toApiError(c, 'Path param shareId is required', 400)
  }
  const entry = await findClipboardEntryByShareId(db, shareId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  if (!settings) {
    return toApiError(c, 'Clipboard share settings not found', 404)
  }
  const nowIso = new Date().toISOString()
  const resolvedStatus = resolveClipboardStatus(entry.status, settings, nowIso)
  if (resolvedStatus === 'deleted' || resolvedStatus === 'disabled' || resolvedStatus === 'expired') {
    const shareData: ClipboardShareResponse = {
      shareId: entry.shareId,
      title: entry.title,
      status: resolvedStatus,
      requiresPassword: false
    }
    return c.json({
      success: true,
      data: shareData
    }, 200)
  }

  await deleteExpiredClipboardShareAccessTokens(db, nowIso)
  const accessToken = getClipboardShareAccessToken(c)
  const accessTokenPurpose = resolveClipboardAccessTokenPurpose(accessToken)
  const hasStoredAccessToken = accessToken
    ? await isValidClipboardShareAccessToken(db, { shareId, token: accessToken, nowIso })
    : false
  const hasSessionAccessToken = hasStoredAccessToken && accessTokenPurpose === 'session'
  const canContinueCurrentSession = hasSessionAccessToken && (
    resolvedStatus === 'destroyed'
    || (settings.maxViews !== null && settings.viewCount >= settings.maxViews)
  )
  const hasValidShareAccess = settings.passwordHash
    ? hasStoredAccessToken
    : true

  if (resolvedStatus === 'destroyed' && !canContinueCurrentSession) {
    const shareData: ClipboardShareResponse = {
      shareId: entry.shareId,
      title: entry.title,
      status: resolvedStatus,
      requiresPassword: false
    }
    return c.json({
      success: true,
      data: shareData
    }, 200)
  }

  if (settings.passwordHash && !hasValidShareAccess) {
    const shareData: ClipboardShareResponse = {
      shareId: entry.shareId,
      title: entry.title,
      status: resolvedStatus,
      requiresPassword: true
    }
    return c.json({
      success: true,
      data: shareData
    }, 200)
  }

  if (settings.maxViews !== null && settings.viewCount >= settings.maxViews && !canContinueCurrentSession) {
    const shareData: ClipboardShareResponse = {
      shareId: entry.shareId,
      title: entry.title,
      status: 'expired',
      requiresPassword: false
    }
    return c.json({
      success: true,
      data: shareData
    }, 200)
  }

  const nextViewCount = canContinueCurrentSession
    ? settings.viewCount
    : await incrementClipboardViewCount(db, entry.id)
  const shouldDestroy = !canContinueCurrentSession && (
    settings.destroyMode === 'first_view'
    || (settings.destroyMode === 'max_views' && settings.maxViews !== null && nextViewCount >= settings.maxViews)
  )
  const responseAccessToken = shouldDestroy
    ? await ensureClipboardShareSessionAccessToken(db, {
      entryId: entry.id,
      shareId,
      existingToken: hasSessionAccessToken ? accessToken : undefined
    })
    : (hasStoredAccessToken ? accessToken : undefined)
  const attachments = await Promise.all(
    (await listClipboardAttachments(db, entry.id)).map((attachment) => serializeClipboardShareAttachment(c.env, db, {
      requestUrl: c.req.url,
      shareId,
      attachment
    }))
  )
  let bodyText = ''
  try {
    bodyText = await readClipboardBodyFromStorage(c.env, entry) ?? ''
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to load clipboard body', 500)
  }
  if (shouldDestroy) {
    await markClipboardDestroyed(db, entry.id)
  }

  const shareData: ClipboardShareResponse = {
    id: entry.id,
    shareId: entry.shareId,
    title: entry.title,
    body: bodyText,
    bodyFormat: entry.bodyFormat,
    status: 'published',
    requiresPassword: false,
    ...(responseAccessToken ? { accessToken: responseAccessToken } : {}),
    attachments,
    share: {
      expiresAt: settings.expiresAt,
      maxViews: settings.maxViews,
      viewCount: nextViewCount,
      destroyMode: settings.destroyMode
    }
  }

  return c.json({
    success: true,
    data: shareData
  }, 200)
})

app.post('/api/linkdisk/clipboard/share/:shareId/verify-password', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const shareId = c.req.param('shareId')?.trim()
  if (!shareId) {
    return toApiError(c, 'Path param shareId is required', 400)
  }
  const body: { password?: string } = await c.req.json<{ password?: string }>().catch(() => ({}))
  const entry = await findClipboardEntryByShareId(db, shareId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  if (!settings) {
    return toApiError(c, 'Clipboard share settings not found', 404)
  }
  if (!settings.passwordHash) {
    return c.json({ success: true, data: { accessToken: null } }, 200)
  }
  const candidateHash = await sha256Hex(body.password?.trim() ?? '')
  if (!timingSafeEqualText(candidateHash, settings.passwordHash)) {
    return toApiError(c, 'Password is invalid', 403)
  }
  const accessToken = createClipboardAccessTokenValue('password')
  const expiresAt = new Date(Date.now() + (60 * 60 * 1000)).toISOString()
  await createClipboardShareAccessToken(db, {
    token: accessToken,
    entryId: entry.id,
    shareId,
    expiresAt
  })
  return c.json({ success: true, data: { accessToken, expiresAt } }, 200)
})

app.get('/api/linkdisk/clipboard/share/:shareId/attachments/:attachmentId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const shareId = c.req.param('shareId')?.trim()
  if (!shareId) {
    return toApiError(c, 'Path param shareId is required', 400)
  }
  try {
    parseClipboardAttachmentMode(c.req.query('mode')?.trim())
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Invalid attachment mode', 400)
  }
  const attachmentId = parsePartIndex(c.req.param('attachmentId'))
  const entry = await findClipboardEntryByShareId(db, shareId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  if (!settings) {
    return toApiError(c, 'Clipboard share settings not found', 404)
  }
  const nowIso = new Date().toISOString()
  const resolvedStatus = resolveClipboardStatus(entry.status, settings, nowIso)
  await deleteExpiredClipboardShareAccessTokens(db, nowIso)
  const accessToken = getClipboardShareAccessToken(c)
  const accessTokenPurpose = resolveClipboardAccessTokenPurpose(accessToken)
  const hasValidAccessToken = accessToken
    ? await isValidClipboardShareAccessToken(db, { shareId, token: accessToken, nowIso })
    : false
  const hasSessionAccessToken = hasValidAccessToken && accessTokenPurpose === 'session'
  const canContinueCurrentSession = hasSessionAccessToken && (
    resolvedStatus === 'destroyed'
    || (settings.maxViews !== null && settings.viewCount >= settings.maxViews)
  )
  if (resolvedStatus !== 'published' && !canContinueCurrentSession) {
    return toApiError(c, `Clipboard entry is not accessible: ${resolvedStatus}`, 404)
  }
  if (settings.maxViews !== null && settings.viewCount >= settings.maxViews && !canContinueCurrentSession) {
    return toApiError(c, 'Clipboard entry is not accessible: expired', 404)
  }

  if (settings.passwordHash) {
    if (!hasValidAccessToken) {
      return toApiError(c, 'Password verification required', 403)
    }
  }

  const attachment = await findClipboardAttachmentById(db, { attachmentId, entryId: entry.id })
  if (!attachment) {
    return toApiError(c, 'Attachment not found', 404)
  }
  const attachmentParts = await findObjectPartsByObjectId(db, attachment.objectId)
  const resolvedAttachmentMimeType = await resolveObjectMimeType(c.env, db, {
    objectId: attachment.objectId,
    fallbackMimeType: attachment.mimeType,
    parts: attachmentParts
  })
  await recordClipboardEvent(db, { entryId: entry.id, attachmentId, eventType: 'attachment_download' })
  return buildObjectDownloadResponse(c, attachment.objectId, attachment.displayName, resolvedAttachmentMimeType)
})

app.post('/api/linkdisk/clipboard/share/:shareId/attachments/:attachmentId', (c) => {
  return toApiError(c, 'Attachment inline preview is unavailable', 404)
})

app.get('/api/linkdisk/clipboard/manage/:manageId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  const attachments = await listClipboardAttachments(db, entry.id)
  const stats = await getClipboardAttachmentEventStats(db, entry.id)
  let serializedEntry
  try {
    serializedEntry = await serializeClipboardEntryWithBody(c.env, entry)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to load clipboard body', 500)
  }
  const manageData: ClipboardManageResponse = {
    entry: serializedEntry ?? undefined,
    attachments,
    share: settings,
    stats
  }
  return c.json({
    success: true,
    data: manageData
  }, 200)
})

app.patch('/api/linkdisk/clipboard/manage/:manageId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  if (!settings) {
    return toApiError(c, 'Clipboard share settings not found', 404)
  }
  const body = await c.req.json<{
    title?: string | null
    body?: string
    bodyFormat?: ClipboardBodyFormat
    password?: string | null
    clearPassword?: boolean
    expiresAt?: string | null
    maxViews?: number | null
    destroyMode?: ClipboardDestroyMode
    disabled?: boolean
  }>()
  try {
    const limits = getClipboardLimits(c.env)
    let storedBody:
      | {
        key: string
        sizeBytes: number
        sha256: string
      }
      | undefined
    const nextTitle = body.title !== undefined ? normalizeClipboardTitle(body.title) : entry.title
    const nextBodyText = body.body !== undefined
      ? normalizeClipboardText(body.body, limits.maxBodyChars)
      : (
        entry.bodyR2Key && c.env.LINKDISK_R2
          ? await getClipboardBodyText(c.env.LINKDISK_R2, entry.bodyR2Key)
          : (entry.bodySizeBytes > 0 ? '__existing_body__' : '')
      )
    const attachments = await listClipboardAttachments(db, entry.id)
    assertClipboardContentPresent({
      title: nextTitle,
      bodyText: nextBodyText,
      attachmentCount: attachments.length
    })
    const nextDestroyMode = body.destroyMode !== undefined
      ? parseClipboardDestroyMode(body.destroyMode)
      : settings.destroyMode
    const nextExpiresAt = body.expiresAt !== undefined
      ? parseOptionalExpiresAt(body.expiresAt, limits.maxExpireDays)
      : settings.expiresAt
    const nextMaxViews = body.maxViews !== undefined
      ? parseOptionalMaxViews(body.maxViews)
      : settings.maxViews
    const normalizedDestroyConfig = normalizeClipboardDestroyConfig({
      destroyMode: nextDestroyMode,
      expiresAt: nextExpiresAt,
      maxViews: nextMaxViews
    })
    if (body.body !== undefined) {
      if (!c.env.LINKDISK_R2) {
        return toApiError(c, 'Missing R2 binding LINKDISK_R2', 500)
      }
      storedBody = await putClipboardBody(c.env.LINKDISK_R2, {
        entryId: entry.id,
        bodyText: nextBodyText
      })
    }
    await updateClipboardEntryAndShare(db, {
      entryId: entry.id,
      title: body.title !== undefined ? nextTitle : undefined,
      bodyStorageProvider: storedBody ? 'r2' : undefined,
      bodyR2Key: storedBody?.key,
      bodySizeBytes: storedBody?.sizeBytes,
      bodySha256: storedBody?.sha256,
      bodyFormat: body.bodyFormat !== undefined ? parseClipboardBodyFormat(body.bodyFormat) : undefined,
      passwordHash: body.clearPassword ? null : body.password !== undefined ? (body.password ? await sha256Hex(body.password) : null) : undefined,
      expiresAt: normalizedDestroyConfig.expiresAt,
      maxViews: normalizedDestroyConfig.maxViews,
      destroyMode: normalizedDestroyConfig.destroyMode,
      disabled: body.disabled
    })
    const updatedEntry = await findClipboardEntryById(db, entry.id)
    const updatedSettings = await findClipboardShareSettings(db, entry.id)
    return c.json({
      success: true,
      data: {
        entry: await serializeClipboardEntryWithBody(c.env, updatedEntry),
        share: updatedSettings
      }
    }, 200)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to update clipboard entry', 400)
  }
})

app.post('/api/linkdisk/clipboard/manage/:manageId/recreate', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const settings = await findClipboardShareSettings(db, entry.id)
  if (!settings) {
    return toApiError(c, 'Clipboard share settings not found', 404)
  }
  const body: { locale?: string } = await c.req.json<{ locale?: string }>().catch(() => ({}))
  const nowIso = new Date().toISOString()
  const resolvedStatus = resolveClipboardStatus(entry.status, settings, nowIso)
  if (resolvedStatus === 'destroyed' || resolvedStatus === 'deleted') {
    return toApiError(c, `Clipboard entry cannot be recreated from status: ${resolvedStatus}`, 409)
  }
  if (resolvedStatus === 'expired') {
    return toApiError(c, 'Clipboard entry is expired. Update its share settings before recreating it.', 409)
  }

  try {
    const recreated = await recreateClipboardShareSnapshot(c.env, db, {
      entry,
      settings,
      attachments: await listClipboardAttachments(db, entry.id)
    })
    const publicPaths = buildClipboardPublicPaths(normalizeLocaleSegment(body.locale), recreated.shareId, recreated.manageId)
    return c.json({
      success: true,
      data: {
        entryId: recreated.entryId,
        shareId: recreated.shareId,
        manageId: recreated.manageId,
        sharePath: publicPaths.sharePath,
        managePath: publicPaths.managePath,
        shortPath: publicPaths.shortPath
      }
    }, 200)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to recreate clipboard share', 400)
  }
})

app.post('/api/linkdisk/clipboard/manage/:manageId/destroy', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  await markClipboardDestroyed(db, entry.id)
  await cleanupClipboardBody(c.env, entry)
  return c.json({ success: true, data: { status: 'destroyed' } }, 200)
})

app.patch('/api/linkdisk/clipboard/manage/:manageId/attachments/:attachmentId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const attachmentId = parsePartIndex(c.req.param('attachmentId'))
  const currentAttachment = await findClipboardAttachmentById(db, { attachmentId, entryId: entry.id })
  if (!currentAttachment) {
    return toApiError(c, 'Attachment not found', 404)
  }
  const body = await c.req.json<{ displayName?: string; sortOrder?: number; objectId?: string }>()
  await updateClipboardAttachment(db, {
    attachmentId,
    entryId: entry.id,
    displayName: typeof body.displayName === 'string' && body.displayName.trim() ? body.displayName.trim() : undefined,
    sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
    objectId: typeof body.objectId === 'string' && body.objectId.trim() ? body.objectId.trim() : undefined
  })
  const updatedAttachment = await findClipboardAttachmentById(db, { attachmentId, entryId: entry.id })
  return c.json({ success: true, data: { attachment: updatedAttachment } }, 200)
})

app.delete('/api/linkdisk/clipboard/manage/:manageId/attachments/:attachmentId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  const attachmentId = parsePartIndex(c.req.param('attachmentId'))
  const currentAttachment = await findClipboardAttachmentById(db, { attachmentId, entryId: entry.id })
  if (!currentAttachment) {
    return toApiError(c, 'Attachment not found', 404)
  }
  await deleteClipboardAttachment(db, { attachmentId, entryId: entry.id })
  return c.json({ success: true }, 200)
})

app.delete('/api/linkdisk/clipboard/manage/:manageId', async (c) => {
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const manageId = c.req.param('manageId')?.trim()
  if (!manageId) {
    return toApiError(c, 'Path param manageId is required', 400)
  }
  const entry = await findClipboardEntryByManageId(db, manageId)
  if (!entry) {
    return toApiError(c, 'Clipboard entry not found', 404)
  }
  await markClipboardDeleted(db, entry.id)
  await cleanupClipboardBody(c.env, entry)
  return c.json({ success: true, data: { status: 'deleted' } }, 200)
})

app.get('/api/linkdisk/dashboard/stats/overview', async (c) => {
  const expectedToken = c.env.DASHBOARD_ACCESS_TOKEN?.trim()
  if (!expectedToken || getDashboardTokenFromRequest(c) !== expectedToken) {
    return toApiError(c, 'Dashboard access token is invalid', 401)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const overview: ClipboardOverviewStats = await getClipboardDashboardOverview(db)
  return c.json({ success: true, data: overview }, 200)
})

app.get('/api/linkdisk/dashboard/stats/recent', async (c) => {
  const expectedToken = c.env.DASHBOARD_ACCESS_TOKEN?.trim()
  if (!expectedToken || getDashboardTokenFromRequest(c) !== expectedToken) {
    return toApiError(c, 'Dashboard access token is invalid', 401)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const recent: ClipboardRecentStatsItem[] = (await listRecentClipboardEntries(db, 20)).map((item) => ({
    ...item,
    status: item.status as ClipboardRecentStatsItem['status']
  }))
  return c.json({ success: true, data: { items: recent } }, 200)
})

app.get(API_PATHS.adminPing, (c) => c.json({ success: true, message: 'pong' as const }, 200))

app.post(API_PATHS.adminObjectCheck, async (c) => {
  if (!isEnabledFlag(c.env.INSTANT_UPLOAD_ENABLED)) {
    return c.json({ success: true, data: { enabled: false, hit: false, object: null } }, 200)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Failed to initialize database' }, 500)
  }
  const payload = await c.req.json<{ sha256: string }>()
  const object = await findReadyObjectBySha256(db, payload.sha256)
  return c.json({ success: true, data: { enabled: true, hit: object !== null, object: toObjectSummary(object) } }, 200)
})

app.post(API_PATHS.adminObjectUploadInit, async (c) => {
  try {
    const payload = await c.req.json<{
      objectId?: string
      sha256?: string
      fileName: string
      mimeType?: string
      sizeBytes: number
      chunkSizeMb?: number
    }>()
    const session = await buildUploadSession(c.env, {
      objectId: payload.objectId?.trim() || crypto.randomUUID(),
      sha256: payload.sha256,
      fileName: payload.fileName,
      mimeType: payload.mimeType,
      sizeBytes: payload.sizeBytes,
      chunkSizeMb: parseChunkSizeMb(payload.chunkSizeMb)
    })
    return c.json({ success: true, data: { object: toObjectSummary(session.object), upload: session.upload } }, 200)
  } catch (error) {
    if (isStatusError(error)) {
      return toUploadError(c, error.message || 'Upload init failed', 409)
    }
    return toUploadError(c, error instanceof Error ? error.message : 'Unknown upload init error', 500)
  }
})

app.post(API_PATHS.adminObjectUploadBatchInit, async (c) => {
  try {
    const payload = await c.req.json<{
      files: Array<{
        objectId?: string
        sha256?: string
        fileName: string
        mimeType?: string
        sizeBytes: number
        chunkSizeMb?: number
      }>
    }>()

    if (!Array.isArray(payload.files) || payload.files.length === 0) {
      return toUploadError(c, 'files must contain at least one entry', 400)
    }

    const sessions = await Promise.all(
      payload.files.map(async (file) => {
        const session = await buildUploadSession(
          c.env,
          {
            objectId: file.objectId?.trim() || crypto.randomUUID(),
            sha256: file.sha256,
            fileName: file.fileName,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            chunkSizeMb: parseChunkSizeMb(file.chunkSizeMb)
          }
        )

        return {
          object: toObjectSummary(session.object),
          upload: session.upload
        }
      })
    )

    return c.json({
      success: true,
      data: {
        sessions
      }
    }, 200)
  } catch (error) {
    if (isStatusError(error)) {
      return toUploadError(c, error.message || 'Batch upload init failed', 409)
    }

    return toUploadError(c, error instanceof Error ? error.message : 'Unknown batch upload init error', 500)
  }
})

app.put('/admin-api/linkdisk/objects/:objectId/parts/:partIndex', async (c) => {
  if (!c.env.LINKDISK_R2) {
    return toUploadError(c, 'Missing R2 binding LINKDISK_R2', 500)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const objectId = c.req.param('objectId')?.trim()
  if (!objectId) {
    return toUploadError(c, 'Path param objectId is required', 400)
  }
  let partIndex = 0
  try {
    partIndex = parsePartIndex(c.req.param('partIndex'))
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Invalid part index', 400)
  }
  const object = await findObjectById(db, objectId)
  if (!object) {
    return toUploadError(c, `Upload session not found: ${objectId}`, 404)
  }
  const partBytes = await c.req.arrayBuffer()
  if (partBytes.byteLength === 0) {
    return toUploadError(c, 'Chunk body is required', 400)
  }
  const chunk = await putR2Part(c.env.LINKDISK_R2, {
    objectId,
    partIndex,
    partData: partBytes,
    contentType: object.mimeType || c.req.header('content-type') || 'application/octet-stream'
  })
  await saveObjectParts(db, {
    objectId,
    parts: [{ partIndex, partSizeBytes: chunk.partSizeBytes, r2ObjectKey: chunk.r2ObjectKey, providerFileId: null }]
  })
  return c.json({ success: true, data: { chunk } }, 200)
})

app.post('/admin-api/linkdisk/objects/:objectId/complete', async (c) => {
  if (!c.env.LINKDISK_R2) {
    return toUploadError(c, 'Missing R2 binding LINKDISK_R2', 500)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const objectId = c.req.param('objectId')?.trim()
  if (!objectId) {
    return toUploadError(c, 'Path param objectId is required', 400)
  }
  const object = await findObjectById(db, objectId)
  if (!object) {
    return toUploadError(c, `Upload session not found: ${objectId}`, 404)
  }
  await syncR2BackedUploadedParts(c.env, objectId, object.totalParts)
  const parts = await findObjectPartsByObjectId(db, objectId)
  if (parts.length !== object.totalParts) {
    return toUploadError(c, `Upload is incomplete: expected ${object.totalParts} parts, got ${parts.length}`, 409)
  }
  const missingPart = Array.from({ length: object.totalParts }, (_, index) => index).find((partIndex) => !parts.some((part) => part.partIndex === partIndex))
  if (missingPart !== undefined) {
    return toUploadError(c, `Upload is incomplete: missing part ${missingPart}`, 409)
  }
  await resolveObjectMimeType(c.env, db, {
    objectId,
    fallbackMimeType: object.mimeType,
    parts
  })
  await markObjectReady(db, objectId, parts.length)
  const storedObject = await findObjectById(db, objectId)
  return c.json({ success: true, data: { object: toObjectSummary(storedObject) } }, 200)
})

app.post(API_PATHS.adminObjectUpload, async (c) => {
  if (!c.env.LINKDISK_R2) {
    return toUploadError(c, 'Missing R2 binding LINKDISK_R2', 500)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const body = await c.req.parseBody({ all: true })
  const fileField = body.file
  const file = Array.isArray(fileField) ? fileField[0] : fileField
  if (!(file instanceof File)) {
    return toUploadError(c, 'Form field "file" is required', 400)
  }
  const objectId = readStringField(Array.isArray(body.objectId) ? body.objectId[0] : body.objectId) ?? crypto.randomUUID()
  const objectSha256 = readStringField(Array.isArray(body.sha256) ? body.sha256[0] : body.sha256) ?? objectId
  const chunkSizeRaw = readStringField(Array.isArray(body.chunkSizeMb) ? body.chunkSizeMb[0] : body.chunkSizeMb)
  let chunkSizeMb: number | undefined
  try {
    chunkSizeMb = parseChunkSizeMb(chunkSizeRaw)
  } catch (error) {
    return toUploadError(c, error instanceof Error ? error.message : 'Invalid upload config', 400)
  }
  try {
    await saveUploadingObject(db, {
      objectId,
      sha256: objectSha256,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      totalParts: getTotalParts(file.size, chunkSizeMb)
    })
    const chunks = await uploadFileToR2InChunks(c.env.LINKDISK_R2, { objectId, file, chunkSizeMb })
    await saveObjectParts(db, {
      objectId,
      parts: chunks.map((chunk) => ({
        partIndex: chunk.partIndex,
        partSizeBytes: chunk.partSizeBytes,
        providerFileId: chunk.fileId ?? null,
        r2ObjectKey: chunk.r2ObjectKey
      }))
    })
    await markObjectReady(db, objectId, chunks.length)
    const storedObject = await findObjectById(db, objectId)
    return c.json({ success: true, data: { object: toObjectSummary(storedObject), chunks } }, 200)
  } catch (error) {
    await markObjectFailed(db, objectId)
    if (isStatusError(error)) {
      return toUploadError(c, error.message || 'Storage provider failed', 502)
    }
    return toUploadError(c, error instanceof Error ? error.message : 'Unknown upload error', 500)
  }
})

app.get('/admin-api/linkdisk/objects/:objectId/download', async (c) => {
  let requestTimeoutMs: number | undefined
  try {
    requestTimeoutMs = parseRequestTimeoutMs(c.env.TELEGRAM_FETCH_TIMEOUT_MS)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Invalid download config', 400)
  }
  let db
  try {
    db = getDb(c.env)
  } catch (error) {
    return toApiError(c, error instanceof Error ? error.message : 'Failed to initialize database', 500)
  }
  const objectId = c.req.param('objectId')?.trim()
  if (!objectId) {
    return toApiError(c, 'Path param objectId is required', 400)
  }
  const object = await findObjectById(db, objectId)
  if (!object) {
    return toApiError(c, `Object not found: ${objectId}`, 404)
  }
  if (object.status !== 'ready') {
    return toApiError(c, `Object is not ready: ${objectId}`, 409)
  }
  const parts = await findObjectPartsByObjectId(db, objectId)
  if (parts.length === 0) {
    return toApiError(c, `Object parts not found: ${objectId}`, 404)
  }
  if (object.totalParts > 0 && parts.length !== object.totalParts) {
    return toApiError(c, `Object parts mismatch: expected ${object.totalParts}, got ${parts.length}`, 500)
  }
  const totalSize = object.sizeBytes > 0 ? object.sizeBytes : getTotalSizeFromParts(parts)
  let selectedRange: { start: number; endInclusive: number } | null = null
  try {
    selectedRange = parseRangeHeader(c.req.header('range') ?? null, totalSize)
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Requested range is not satisfiable' }), {
      status: 416,
      headers: new Headers({ 'content-range': `bytes */${totalSize}` })
    })
  }
  const startOffset = selectedRange?.start ?? 0
  const endOffsetExclusive = selectedRange ? selectedRange.endInclusive + 1 : totalSize
  const contentLength = Math.max(0, endOffsetExclusive - startOffset)
  try {
    const stream = buildObjectStreamWithR2Fallback(
      {
        apiToken: c.env.TELEGRAM_API_TOKEN,
        requestTimeoutMs,
        r2Bucket: c.env.LINKDISK_R2,
        prefetchWindow: parseDownloadPrefetchWindow(c.env.DOWNLOAD_PREFETCH_WINDOW),
        onResolvedTelegramFilePath: async (part, providerFilePath) => {
          try {
            await saveObjectParts(db, {
              objectId,
              parts: [{
                partIndex: part.partIndex,
                partSizeBytes: part.partSizeBytes,
                providerFileId: part.providerFileId,
                providerFilePath,
                r2ObjectKey: part.r2ObjectKey
              }]
            })
          } catch (error) {
            console.warn(
              '[admin-download] failed to cache telegram file path',
              objectId,
              part.partIndex,
              error instanceof Error ? error.message : error
            )
          }
        }
      },
      parts,
      { startOffset, endOffsetExclusive }
    )
    const headers = new Headers()
    headers.set('accept-ranges', 'bytes')
    headers.set('content-type', object.mimeType || 'application/octet-stream')
    headers.set('content-disposition', toContentDisposition(object.fileName))
    headers.set('cache-control', 'no-store')
    headers.set('content-length', String(contentLength))
    if (selectedRange) {
      headers.set('content-range', `bytes ${selectedRange.start}-${selectedRange.endInclusive}/${totalSize}`)
    }
    return new Response(stream, { status: selectedRange ? 206 : 200, headers })
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      return toApiError(c, String((error as { message: unknown }).message), 502)
    }
    return toApiError(c, 'Unknown download error', 500)
  }
})

app.doc(API_PATHS.openapi, {
  openapi: '3.0.0',
  info: {
    title: API_DOC_INFO.title,
    version: API_DOC_INFO.version,
    description: API_DOC_INFO.description
  }
})

app.get(API_PATHS.docs, Scalar({ theme: 'purple', url: API_PATHS.openapi }))

export type ApiAppType = typeof app

const worker = {
  fetch: app.fetch,
  scheduled: async (_controller: ScheduledController, env: Bindings) => {
    await runArchiveCron(env)
    await runClipboardCleanupCron(env)
  }
}

export default worker
