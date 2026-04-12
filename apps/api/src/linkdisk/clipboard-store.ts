import { and, asc, count, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm'
import type { ApiDatabase } from './db'
import {
  clipboardEntries,
  clipboardEntryAttachments,
  clipboardEvents,
  clipboardShareAccessTokens,
  clipboardShareSettings,
  objects
} from './schema'

export type ClipboardBodyFormat = 'plain_text'
export type ClipboardEntryStatus = 'draft' | 'published' | 'deleted' | 'destroyed'
export type ClipboardDestroyMode = 'none' | 'manual' | 'expire' | 'max_views' | 'first_view'

export interface StoredClipboardEntry {
  id: string
  title: string | null
  bodyStorageProvider: string
  bodyR2Key: string | null
  bodySizeBytes: number
  bodySha256: string
  bodyFormat: ClipboardBodyFormat
  status: ClipboardEntryStatus
  shareId: string
  manageId: string
  publishedAt: string | null
  destroyedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface StoredClipboardShareSettings {
  entryId: string
  passwordHash: string | null
  expiresAt: string | null
  maxViews: number | null
  viewCount: number
  destroyMode: ClipboardDestroyMode
  disabled: boolean
  createdAt: string
  updatedAt: string
}

export interface StoredClipboardAttachment {
  id: number
  entryId: string
  objectId: string
  displayName: string
  sortOrder: number
  createdAt: string
  fileName: string
  mimeType: string
  sizeBytes: number
  storageProvider: string
  archiveStatus: string
}

export interface ClipboardDashboardOverview {
  totalEntries: number
  publishedEntries: number
  destroyedEntries: number
  deletedEntries: number
  totalViews: number
  totalAttachmentOpens: number
  totalAttachmentDownloads: number
  archivedAttachments: number
  failedArchives: number
}

export interface ClipboardAttachmentEventStats {
  attachmentOpenCount: number
  attachmentDownloadCount: number
}

function toClipboardEntry(row: typeof clipboardEntries.$inferSelect): StoredClipboardEntry {
  return {
    id: row.id,
    title: row.title,
    bodyStorageProvider: row.bodyStorageProvider,
    bodyR2Key: row.bodyR2Key,
    bodySizeBytes: row.bodySizeBytes,
    bodySha256: row.bodySha256,
    bodyFormat: row.bodyFormat as ClipboardBodyFormat,
    status: row.status as ClipboardEntryStatus,
    shareId: row.shareId,
    manageId: row.manageId,
    publishedAt: row.publishedAt,
    destroyedAt: row.destroyedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

function toShareSettings(row: typeof clipboardShareSettings.$inferSelect): StoredClipboardShareSettings {
  return {
    entryId: row.entryId,
    passwordHash: row.passwordHash,
    expiresAt: row.expiresAt,
    maxViews: row.maxViews,
    viewCount: row.viewCount,
    destroyMode: row.destroyMode as ClipboardDestroyMode,
    disabled: row.disabled === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

export async function createClipboardDraft(
  db: ApiDatabase,
  payload: {
    entryId: string
    shareId: string
    manageId: string
  }
) {
  const nowIso = new Date().toISOString()
  await db.insert(clipboardEntries).values({
    id: payload.entryId,
    title: null,
    bodyStorageProvider: 'r2',
    bodyR2Key: null,
    bodySizeBytes: 0,
    bodySha256: '',
    bodyFormat: 'plain_text',
    status: 'draft',
    shareId: payload.shareId,
    manageId: payload.manageId,
    publishedAt: null,
    destroyedAt: null,
    updatedAt: nowIso
  })
  await db.insert(clipboardShareSettings).values({
    entryId: payload.entryId,
    passwordHash: null,
    expiresAt: null,
    maxViews: null,
    viewCount: 0,
    destroyMode: 'none',
    disabled: 0,
    updatedAt: nowIso
  })
  await recordClipboardEvent(db, { entryId: payload.entryId, eventType: 'create' })
}

export async function findClipboardEntryById(db: ApiDatabase, entryId: string): Promise<StoredClipboardEntry | null> {
  const rows = await db.select()
    .from(clipboardEntries)
    .where(eq(clipboardEntries.id, entryId))
    .limit(1)
  return rows[0] ? toClipboardEntry(rows[0]) : null
}

export async function findClipboardEntryByShareId(db: ApiDatabase, shareId: string): Promise<StoredClipboardEntry | null> {
  const rows = await db.select()
    .from(clipboardEntries)
    .where(eq(clipboardEntries.shareId, shareId))
    .limit(1)
  return rows[0] ? toClipboardEntry(rows[0]) : null
}

export async function findClipboardEntryByManageId(db: ApiDatabase, manageId: string): Promise<StoredClipboardEntry | null> {
  const rows = await db.select()
    .from(clipboardEntries)
    .where(eq(clipboardEntries.manageId, manageId))
    .limit(1)
  return rows[0] ? toClipboardEntry(rows[0]) : null
}

export async function findClipboardShareSettings(db: ApiDatabase, entryId: string): Promise<StoredClipboardShareSettings | null> {
  const rows = await db.select()
    .from(clipboardShareSettings)
    .where(eq(clipboardShareSettings.entryId, entryId))
    .limit(1)
  return rows[0] ? toShareSettings(rows[0]) : null
}

export async function listStaleClipboardDrafts(
  db: ApiDatabase,
  payload: {
    updatedBeforeIso: string
    limit: number
  }
): Promise<StoredClipboardEntry[]> {
  const rows = await db.select()
    .from(clipboardEntries)
    .where(and(
      eq(clipboardEntries.status, 'draft'),
      lte(clipboardEntries.updatedAt, payload.updatedBeforeIso)
    ))
    .orderBy(asc(clipboardEntries.updatedAt))
    .limit(payload.limit)

  return rows.map(toClipboardEntry)
}

export async function deleteClipboardEntryPermanently(db: ApiDatabase, entryId: string) {
  await db.delete(clipboardEntries)
    .where(eq(clipboardEntries.id, entryId))
}

export async function publishClipboardEntry(
  db: ApiDatabase,
  payload: {
    entryId: string
    title?: string | null
    bodyStorageProvider: string
    bodyR2Key: string
    bodySizeBytes: number
    bodySha256: string
    bodyFormat: ClipboardBodyFormat
    passwordHash?: string | null
    expiresAt?: string | null
    maxViews?: number | null
    destroyMode?: ClipboardDestroyMode
    disabled?: boolean
  }
) {
  const nowIso = new Date().toISOString()
  await db.update(clipboardEntries)
    .set({
      title: payload.title ?? null,
      bodyStorageProvider: payload.bodyStorageProvider,
      bodyR2Key: payload.bodyR2Key,
      bodySizeBytes: payload.bodySizeBytes,
      bodySha256: payload.bodySha256,
      bodyFormat: payload.bodyFormat,
      status: 'published',
      publishedAt: nowIso,
      updatedAt: nowIso
    })
    .where(eq(clipboardEntries.id, payload.entryId))

  await db.update(clipboardShareSettings)
    .set({
      passwordHash: payload.passwordHash ?? null,
      expiresAt: payload.expiresAt ?? null,
      maxViews: payload.maxViews ?? null,
      destroyMode: payload.destroyMode ?? 'none',
      disabled: payload.disabled ? 1 : 0,
      updatedAt: nowIso
    })
    .where(eq(clipboardShareSettings.entryId, payload.entryId))

  await recordClipboardEvent(db, { entryId: payload.entryId, eventType: 'publish' })
}

export async function updateClipboardEntryAndShare(
  db: ApiDatabase,
  payload: {
    entryId: string
    title?: string | null
    bodyStorageProvider?: string
    bodyR2Key?: string
    bodySizeBytes?: number
    bodySha256?: string
    bodyFormat?: ClipboardBodyFormat
    passwordHash?: string | null
    expiresAt?: string | null
    maxViews?: number | null
    destroyMode?: ClipboardDestroyMode
    disabled?: boolean
  }
) {
  const nowIso = new Date().toISOString()
  if (
    payload.title !== undefined
    || payload.bodyStorageProvider !== undefined
    || payload.bodyR2Key !== undefined
    || payload.bodySizeBytes !== undefined
    || payload.bodySha256 !== undefined
    || payload.bodyFormat !== undefined
  ) {
    await db.update(clipboardEntries)
      .set({
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.bodyStorageProvider !== undefined ? { bodyStorageProvider: payload.bodyStorageProvider } : {}),
        ...(payload.bodyR2Key !== undefined ? { bodyR2Key: payload.bodyR2Key } : {}),
        ...(payload.bodySizeBytes !== undefined ? { bodySizeBytes: payload.bodySizeBytes } : {}),
        ...(payload.bodySha256 !== undefined ? { bodySha256: payload.bodySha256 } : {}),
        ...(payload.bodyFormat !== undefined ? { bodyFormat: payload.bodyFormat } : {}),
        updatedAt: nowIso
      })
      .where(eq(clipboardEntries.id, payload.entryId))
  }

  await db.update(clipboardShareSettings)
    .set({
      ...(payload.passwordHash !== undefined ? { passwordHash: payload.passwordHash } : {}),
      ...(payload.expiresAt !== undefined ? { expiresAt: payload.expiresAt } : {}),
      ...(payload.maxViews !== undefined ? { maxViews: payload.maxViews } : {}),
      ...(payload.destroyMode !== undefined ? { destroyMode: payload.destroyMode } : {}),
      ...(payload.disabled !== undefined ? { disabled: payload.disabled ? 1 : 0 } : {}),
      updatedAt: nowIso
    })
    .where(eq(clipboardShareSettings.entryId, payload.entryId))

  await recordClipboardEvent(db, { entryId: payload.entryId, eventType: 'manage_update' })
}

export async function listClipboardAttachments(db: ApiDatabase, entryId: string): Promise<StoredClipboardAttachment[]> {
  const rows = await db.select({
    id: clipboardEntryAttachments.id,
    entryId: clipboardEntryAttachments.entryId,
    objectId: clipboardEntryAttachments.objectId,
    displayName: clipboardEntryAttachments.displayName,
    sortOrder: clipboardEntryAttachments.sortOrder,
    createdAt: clipboardEntryAttachments.createdAt,
    fileName: objects.fileName,
    mimeType: objects.mimeType,
    sizeBytes: objects.sizeBytes,
    storageProvider: objects.storageProvider,
    archiveStatus: objects.archiveStatus
  })
    .from(clipboardEntryAttachments)
    .innerJoin(objects, eq(clipboardEntryAttachments.objectId, objects.id))
    .where(eq(clipboardEntryAttachments.entryId, entryId))
    .orderBy(asc(clipboardEntryAttachments.sortOrder), asc(clipboardEntryAttachments.id))

  return rows
}

export async function createClipboardAttachment(
  db: ApiDatabase,
  payload: {
    entryId: string
    objectId: string
    displayName: string
    sortOrder?: number
  }
) {
  const sortOrder = payload.sortOrder ?? await getNextAttachmentSortOrder(db, payload.entryId)
  await db.insert(clipboardEntryAttachments).values({
    entryId: payload.entryId,
    objectId: payload.objectId,
    displayName: payload.displayName,
    sortOrder
  })
  await recordClipboardEvent(db, { entryId: payload.entryId, eventType: 'attachment_add' })
}

export async function cloneClipboardAttachmentsToEntry(
  db: ApiDatabase,
  payload: {
    entryId: string
    attachments: Array<{
      objectId: string
      displayName: string
      sortOrder: number
    }>
  }
) {
  if (payload.attachments.length === 0) {
    return
  }
  await db.insert(clipboardEntryAttachments).values(
    payload.attachments.map((attachment) => ({
      entryId: payload.entryId,
      objectId: attachment.objectId,
      displayName: attachment.displayName,
      sortOrder: attachment.sortOrder
    }))
  )
}

export async function updateClipboardAttachment(
  db: ApiDatabase,
  payload: {
    attachmentId: number
    entryId: string
    displayName?: string
    sortOrder?: number
    objectId?: string
  }
) {
  await db.update(clipboardEntryAttachments)
    .set({
      ...(payload.displayName !== undefined ? { displayName: payload.displayName } : {}),
      ...(payload.sortOrder !== undefined ? { sortOrder: payload.sortOrder } : {}),
      ...(payload.objectId !== undefined ? { objectId: payload.objectId } : {})
    })
    .where(and(
      eq(clipboardEntryAttachments.id, payload.attachmentId),
      eq(clipboardEntryAttachments.entryId, payload.entryId)
    ))
  await recordClipboardEvent(db, { entryId: payload.entryId, attachmentId: payload.attachmentId, eventType: 'attachment_update' })
}

export async function findClipboardAttachmentById(
  db: ApiDatabase,
  payload: {
    attachmentId: number
    entryId: string
  }
): Promise<StoredClipboardAttachment | null> {
  const rows = await db.select({
    id: clipboardEntryAttachments.id,
    entryId: clipboardEntryAttachments.entryId,
    objectId: clipboardEntryAttachments.objectId,
    displayName: clipboardEntryAttachments.displayName,
    sortOrder: clipboardEntryAttachments.sortOrder,
    createdAt: clipboardEntryAttachments.createdAt,
    fileName: objects.fileName,
    mimeType: objects.mimeType,
    sizeBytes: objects.sizeBytes,
    storageProvider: objects.storageProvider,
    archiveStatus: objects.archiveStatus
  })
    .from(clipboardEntryAttachments)
    .innerJoin(objects, eq(clipboardEntryAttachments.objectId, objects.id))
    .where(and(
      eq(clipboardEntryAttachments.id, payload.attachmentId),
      eq(clipboardEntryAttachments.entryId, payload.entryId)
    ))
    .limit(1)

  return rows[0] ?? null
}

export async function deleteClipboardAttachment(
  db: ApiDatabase,
  payload: {
    attachmentId: number
    entryId: string
  }
) {
  await db.delete(clipboardEntryAttachments)
    .where(and(
      eq(clipboardEntryAttachments.id, payload.attachmentId),
      eq(clipboardEntryAttachments.entryId, payload.entryId)
    ))
  await recordClipboardEvent(db, { entryId: payload.entryId, attachmentId: payload.attachmentId, eventType: 'attachment_delete' })
}

async function getNextAttachmentSortOrder(db: ApiDatabase, entryId: string): Promise<number> {
  const rows = await db.select({
    sortOrder: clipboardEntryAttachments.sortOrder
  })
    .from(clipboardEntryAttachments)
    .where(eq(clipboardEntryAttachments.entryId, entryId))
    .orderBy(desc(clipboardEntryAttachments.sortOrder))
    .limit(1)

  return rows[0] ? rows[0].sortOrder + 1 : 0
}

export async function createClipboardShareAccessToken(
  db: ApiDatabase,
  payload: {
    token: string
    entryId: string
    shareId: string
    expiresAt: string
  }
) {
  await db.insert(clipboardShareAccessTokens).values({
    token: payload.token,
    entryId: payload.entryId,
    shareId: payload.shareId,
    expiresAt: payload.expiresAt
  })
}

export async function isValidClipboardShareAccessToken(
  db: ApiDatabase,
  payload: {
    shareId: string
    token: string
    nowIso: string
  }
): Promise<boolean> {
  const rows = await db.select({
    token: clipboardShareAccessTokens.token
  })
    .from(clipboardShareAccessTokens)
    .where(and(
      eq(clipboardShareAccessTokens.shareId, payload.shareId),
      eq(clipboardShareAccessTokens.token, payload.token),
      gte(clipboardShareAccessTokens.expiresAt, payload.nowIso)
    ))
    .limit(1)

  return rows.length > 0
}

export async function deleteExpiredClipboardShareAccessTokens(db: ApiDatabase, nowIso: string) {
  await db.delete(clipboardShareAccessTokens)
    .where(lte(clipboardShareAccessTokens.expiresAt, nowIso))
}

export async function incrementClipboardViewCount(db: ApiDatabase, entryId: string): Promise<number> {
  const current = await findClipboardShareSettings(db, entryId)
  const nextViewCount = (current?.viewCount ?? 0) + 1
  await db.update(clipboardShareSettings)
    .set({
      viewCount: nextViewCount,
      updatedAt: new Date().toISOString()
    })
    .where(eq(clipboardShareSettings.entryId, entryId))

  await recordClipboardEvent(db, { entryId, eventType: 'view' })
  return nextViewCount
}

export async function markClipboardDestroyed(db: ApiDatabase, entryId: string) {
  const nowIso = new Date().toISOString()
  await db.update(clipboardEntries)
    .set({
      status: 'destroyed',
      destroyedAt: nowIso,
      updatedAt: nowIso
    })
    .where(eq(clipboardEntries.id, entryId))
  await recordClipboardEvent(db, { entryId, eventType: 'destroy' })
}

export async function markClipboardDeleted(db: ApiDatabase, entryId: string) {
  const nowIso = new Date().toISOString()
  await db.update(clipboardEntries)
    .set({
      status: 'deleted',
      updatedAt: nowIso
    })
    .where(eq(clipboardEntries.id, entryId))
  await recordClipboardEvent(db, { entryId, eventType: 'delete' })
}

export async function recordClipboardEvent(
  db: ApiDatabase,
  payload: {
    entryId?: string | null
    attachmentId?: number | null
    eventType: string
  }
) {
  await db.insert(clipboardEvents).values({
    entryId: payload.entryId ?? null,
    attachmentId: payload.attachmentId ?? null,
    eventType: payload.eventType
  })
}

export async function getClipboardAttachmentEventStats(
  db: ApiDatabase,
  entryId: string
): Promise<ClipboardAttachmentEventStats> {
  const [openStats, downloadStats] = await Promise.all([
    db.select({
      count: count()
    })
      .from(clipboardEvents)
      .where(and(
        eq(clipboardEvents.entryId, entryId),
        eq(clipboardEvents.eventType, 'attachment_open')
      )),
    db.select({
      count: count()
    })
      .from(clipboardEvents)
      .where(and(
        eq(clipboardEvents.entryId, entryId),
        eq(clipboardEvents.eventType, 'attachment_download')
      ))
  ])

  return {
    attachmentOpenCount: openStats[0]?.count ?? 0,
    attachmentDownloadCount: downloadStats[0]?.count ?? 0
  }
}

export async function getClipboardDashboardOverview(db: ApiDatabase): Promise<ClipboardDashboardOverview> {
  const [entryStatusCounts, shareStats, openStats, downloadStats, archiveStats] = await Promise.all([
    db.select({
      status: clipboardEntries.status,
      count: count()
    })
      .from(clipboardEntries)
      .groupBy(clipboardEntries.status),
    db.select({
      totalViews: sql<number>`coalesce(sum(${clipboardShareSettings.viewCount}), 0)`
    })
      .from(clipboardShareSettings),
    db.select({
      totalOpens: count()
    })
      .from(clipboardEvents)
      .where(eq(clipboardEvents.eventType, 'attachment_open')),
    db.select({
      totalDownloads: count()
    })
      .from(clipboardEvents)
      .where(eq(clipboardEvents.eventType, 'attachment_download')),
    db.select({
      archived: sql<number>`coalesce(sum(case when ${objects.storageProvider} = 'telegram' then 1 else 0 end), 0)`,
      failed: sql<number>`coalesce(sum(case when ${objects.archiveStatus} = 'failed' then 1 else 0 end), 0)`
    })
      .from(objects)
      .where(inArray(objects.id, db.select({ objectId: clipboardEntryAttachments.objectId }).from(clipboardEntryAttachments)))
  ])

  const countsByStatus = new Map(entryStatusCounts.map((row) => [row.status, row.count]))
  return {
    totalEntries: entryStatusCounts.reduce((sum, row) => sum + row.count, 0),
    publishedEntries: countsByStatus.get('published') ?? 0,
    destroyedEntries: countsByStatus.get('destroyed') ?? 0,
    deletedEntries: countsByStatus.get('deleted') ?? 0,
    totalViews: Number(shareStats[0]?.totalViews ?? 0),
    totalAttachmentOpens: openStats[0]?.totalOpens ?? 0,
    totalAttachmentDownloads: downloadStats[0]?.totalDownloads ?? 0,
    archivedAttachments: Number(archiveStats[0]?.archived ?? 0),
    failedArchives: Number(archiveStats[0]?.failed ?? 0)
  }
}

export async function listRecentClipboardEntries(db: ApiDatabase, limit: number) {
  const rows = await db.select({
    id: clipboardEntries.id,
    title: clipboardEntries.title,
    shareId: clipboardEntries.shareId,
    status: clipboardEntries.status,
    createdAt: clipboardEntries.createdAt,
    updatedAt: clipboardEntries.updatedAt,
    publishedAt: clipboardEntries.publishedAt,
    viewCount: clipboardShareSettings.viewCount
  })
    .from(clipboardEntries)
    .leftJoin(clipboardShareSettings, eq(clipboardEntries.id, clipboardShareSettings.entryId))
    .orderBy(desc(clipboardEntries.updatedAt))
    .limit(limit)

  return rows
}
