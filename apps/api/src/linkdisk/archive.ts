import type { D1Database, R2Bucket } from '@cloudflare/workers-types'
import { getDb } from './db'
import {
  claimArchiveLease,
  findObjectById,
  findObjectPartsByObjectId,
  listArchiveCandidates,
  markArchiveCompleted,
  markArchiveFailedOrRetry,
  releaseArchiveLease,
  saveObjectParts
} from './object-store'
import { buildR2PartObjectKey } from './r2-upload'
import { resolveTelegramFilePath } from './telegram-storage'
import { uploadBlobPartToTelegram } from './upload'

const DEFAULT_ARCHIVE_MAX_ATTEMPTS = 10
const DEFAULT_ARCHIVE_BATCH_SIZE = 20
const DEFAULT_ARCHIVE_LEASE_SECONDS = 540
const DEFAULT_ARCHIVE_RETRY_BASE_SECONDS = 300
const MAX_RETRY_BACKOFF_SECONDS = 21_600

interface ArchiveEnv {
  APP_DB?: D1Database
  LINKDISK_R2?: R2Bucket
  TELEGRAM_API_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
  TELEGRAM_FETCH_TIMEOUT_MS?: string
  ARCHIVE_MAX_ATTEMPTS?: string
  ARCHIVE_BATCH_SIZE?: string
  ARCHIVE_LEASE_SECONDS?: string
  ARCHIVE_RETRY_BASE_SECONDS?: string
}

interface ArchiveConfig {
  maxAttempts: number
  batchSize: number
  leaseSeconds: number
  retryBaseSeconds: number
  requestTimeoutMs?: number
}

function parsePositiveInt(rawValue: string | undefined, fallback: number): number {
  if (!rawValue) {
    return fallback
  }

  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.floor(parsed)
}

function parseRequestTimeoutMs(rawValue: string | undefined): number | undefined {
  if (!rawValue) {
    return undefined
  }

  const parsedValue = Number(rawValue)
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error('TELEGRAM_FETCH_TIMEOUT_MS must be a positive number')
  }

  return parsedValue
}

function loadConfig(env: ArchiveEnv): ArchiveConfig {
  return {
    maxAttempts: parsePositiveInt(env.ARCHIVE_MAX_ATTEMPTS, DEFAULT_ARCHIVE_MAX_ATTEMPTS),
    batchSize: parsePositiveInt(env.ARCHIVE_BATCH_SIZE, DEFAULT_ARCHIVE_BATCH_SIZE),
    leaseSeconds: parsePositiveInt(env.ARCHIVE_LEASE_SECONDS, DEFAULT_ARCHIVE_LEASE_SECONDS),
    retryBaseSeconds: parsePositiveInt(env.ARCHIVE_RETRY_BASE_SECONDS, DEFAULT_ARCHIVE_RETRY_BASE_SECONDS),
    requestTimeoutMs: parseRequestTimeoutMs(env.TELEGRAM_FETCH_TIMEOUT_MS)
  }
}

function nextAttemptAtIso(nowMs: number, retryBaseSeconds: number, attemptNumber: number): string {
  const expFactor = Math.max(0, attemptNumber - 1)
  const delaySeconds = Math.min(MAX_RETRY_BACKOFF_SECONDS, retryBaseSeconds * (2 ** expFactor))
  return new Date(nowMs + (delaySeconds * 1000)).toISOString()
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Unknown archive error'
}

export async function runArchiveCron(env: ArchiveEnv): Promise<void> {
  if (!env.APP_DB) {
    console.warn('[archive] skip: missing APP_DB binding')
    return
  }
  if (!env.LINKDISK_R2) {
    console.warn('[archive] skip: missing LINKDISK_R2 binding')
    return
  }
  if (!env.TELEGRAM_API_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.warn('[archive] skip: missing Telegram env TELEGRAM_API_TOKEN or TELEGRAM_CHAT_ID')
    return
  }

  const config = loadConfig(env)
  const db = getDb(env)
  const nowIso = new Date().toISOString()
  const candidates = await listArchiveCandidates(
    db,
    {
      nowIso,
      maxAttempts: config.maxAttempts,
      limit: config.batchSize
    }
  )

  for (const candidate of candidates) {
    const claimNowIso = new Date().toISOString()
    const leaseUntilIso = new Date(Date.now() + (config.leaseSeconds * 1000)).toISOString()
    const claimed = await claimArchiveLease(
      db,
      {
        objectId: candidate.id,
        nowIso: claimNowIso,
        leaseUntilIso
      }
    )
    if (!claimed) {
      continue
    }

    const object = await findObjectById(db, candidate.id)
    if (!object) {
      await releaseArchiveLease(db, {
        objectId: candidate.id,
        nowIso: new Date().toISOString()
      })
      continue
    }

    try {
      const parts = await findObjectPartsByObjectId(db, object.id)
      if (parts.length === 0) {
        throw new Error(`Object parts not found: ${object.id}`)
      }

      for (const part of parts) {
        if (part.providerFileId) {
          continue
        }

        const r2Key = part.r2ObjectKey ?? buildR2PartObjectKey(object.id, part.partIndex)
        const r2Object = await env.LINKDISK_R2.get(r2Key)
        if (!r2Object?.body) {
          throw new Error(`R2 part missing: object=${object.id}, part=${part.partIndex}, key=${r2Key}`)
        }

        const partBuffer = await r2Object.arrayBuffer()
        const uploadedPart = await uploadBlobPartToTelegram(
          {
            apiToken: env.TELEGRAM_API_TOKEN,
            chatId: env.TELEGRAM_CHAT_ID,
            requestTimeoutMs: config.requestTimeoutMs
          },
          {
            objectId: object.id,
            fileName: object.fileName,
            mimeType: object.mimeType || 'application/octet-stream',
            totalParts: object.totalParts > 0 ? object.totalParts : parts.length,
            partIndex: part.partIndex,
            partData: partBuffer
          }
        )
        const providerFileId = uploadedPart.fileId ?? null
        const providerFilePath = providerFileId
          ? await resolveTelegramFilePath(
            {
              apiToken: env.TELEGRAM_API_TOKEN,
              requestTimeoutMs: config.requestTimeoutMs
            },
            providerFileId
          )
          : null

        await saveObjectParts(
          db,
          {
            objectId: object.id,
            parts: [
              {
                partIndex: part.partIndex,
                partSizeBytes: part.partSizeBytes,
                providerFileId,
                providerFilePath,
                r2ObjectKey: r2Key
              }
            ]
          }
        )
      }

      const refreshedParts = await findObjectPartsByObjectId(db, object.id)
      const missingProviderPart = refreshedParts.find((part) => !part.providerFileId)
      if (missingProviderPart) {
        throw new Error(`Archive incomplete: missing Telegram file_id at part ${missingProviderPart.partIndex}`)
      }

      const r2Keys = refreshedParts
        .map((part) => part.r2ObjectKey)
        .filter((key): key is string => Boolean(key))
      if (r2Keys.length > 0) {
        await env.LINKDISK_R2.delete(r2Keys)
      }

      await saveObjectParts(
        db,
        {
          objectId: object.id,
          parts: refreshedParts.map((part) => ({
            partIndex: part.partIndex,
            partSizeBytes: part.partSizeBytes,
            providerFileId: part.providerFileId,
            providerFilePath: part.providerFilePath,
            r2ObjectKey: null
          }))
        }
      )

      await markArchiveCompleted(
        db,
        {
          objectId: object.id,
          nowIso: new Date().toISOString()
        }
      )
    } catch (error) {
      const nowMs = Date.now()
      const nextAttempts = object.archiveAttempts + 1
      const nextAttemptIso = nextAttemptAtIso(nowMs, config.retryBaseSeconds, nextAttempts)
      await markArchiveFailedOrRetry(
        db,
        {
          objectId: object.id,
          nowIso: new Date(nowMs).toISOString(),
          nextAttemptAtIso: nextAttemptIso,
          nextAttempts,
          maxAttempts: config.maxAttempts,
          errorMessage: toErrorMessage(error)
        }
      )
    }
  }
}
