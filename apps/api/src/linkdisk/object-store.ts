import { and, asc, eq, inArray, isNull, lt, lte, or } from 'drizzle-orm'
import type { ApiDatabase } from './db'
import { clipboardEntryAttachments, objectParts, objects } from './schema'

export interface StoredObjectSummary {
  id: string
  sha256: string
  fileName: string
  mimeType: string
  sizeBytes: number
  totalParts: number
  status: string
  uploadStrategy: string
  storageProvider: string
  archiveStatus: string
  archiveAttempts: number
  archiveNextAttemptAt: string
  archiveLastError: string | null
  archiveLeaseUntil: string | null
  archivedAt: string | null
}

export interface StoredObjectPart {
  objectId: string
  partIndex: number
  providerFileId: string | null
  providerFilePath: string | null
  r2ObjectKey: string | null
  partSizeBytes: number
}

export interface UploadSessionState {
  object: StoredObjectSummary
  uploadedPartIndexes: number[]
}

export interface ObjectPartUpsertPayload {
  partIndex: number
  providerFileId?: string | null
  providerFilePath?: string | null
  r2ObjectKey?: string | null
  partSizeBytes: number
}

export interface ArchiveCandidate {
  id: string
}

export async function saveUploadingObject(
  db: ApiDatabase,
  payload: {
    objectId: string
    sha256: string
    fileName: string
    mimeType: string
    sizeBytes: number
    totalParts: number
    uploadStrategy?: string
    storageProvider?: string
    archiveStatus?: string
  }
) {
  const nowIso = new Date().toISOString()
  const uploadStrategy = payload.uploadStrategy ?? 'r2'
  const storageProvider = payload.storageProvider ?? (uploadStrategy === 'telegram_direct' ? 'telegram' : 'r2')
  const archiveStatus = payload.archiveStatus ?? 'pending'
  await db.insert(objects).values({
    id: payload.objectId,
    sha256: payload.sha256,
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    sizeBytes: payload.sizeBytes,
    totalParts: payload.totalParts,
    status: 'uploading',
    uploadStrategy,
    storageProvider,
    archiveStatus,
    archiveAttempts: 0,
    archiveNextAttemptAt: nowIso,
    archiveLastError: null,
    archiveLeaseUntil: null,
    archivedAt: null,
    updatedAt: nowIso
  }).onConflictDoUpdate({
    target: objects.id,
    set: {
      sha256: payload.sha256,
      fileName: payload.fileName,
      mimeType: payload.mimeType,
      sizeBytes: payload.sizeBytes,
      totalParts: payload.totalParts,
      status: 'uploading',
      uploadStrategy,
      storageProvider,
      archiveStatus,
      archiveAttempts: 0,
      archiveNextAttemptAt: nowIso,
      archiveLastError: null,
      archiveLeaseUntil: null,
      archivedAt: null,
      updatedAt: nowIso
    }
  })
}

export async function saveObjectParts(
  db: ApiDatabase,
  payload: {
    objectId: string
    parts: ObjectPartUpsertPayload[]
  }
) {
  for (const part of payload.parts) {
    await db.insert(objectParts).values({
      objectId: payload.objectId,
      partIndex: part.partIndex,
      providerFileId: part.providerFileId ?? null,
      providerFilePath: part.providerFilePath ?? null,
      r2ObjectKey: part.r2ObjectKey ?? null,
      partSizeBytes: part.partSizeBytes
    }).onConflictDoUpdate({
      target: [objectParts.objectId, objectParts.partIndex],
      set: {
        providerFileId: part.providerFileId ?? null,
        providerFilePath: part.providerFilePath ?? null,
        r2ObjectKey: part.r2ObjectKey ?? null,
        partSizeBytes: part.partSizeBytes
      }
    })
  }
}

export async function touchObjectUpdatedAt(db: ApiDatabase, objectId: string) {
  await db.update(objects)
    .set({
      updatedAt: new Date().toISOString()
    })
    .where(eq(objects.id, objectId))
}

export async function markObjectReady(
  db: ApiDatabase,
  objectId: string,
  totalParts: number,
  options?: {
    uploadStrategy?: string
    storageProvider?: string
    archiveStatus?: string
    archivedAt?: string | null
  }
) {
  const nowIso = new Date().toISOString()
  const uploadStrategy = options?.uploadStrategy ?? 'r2'
  const storageProvider = options?.storageProvider ?? (uploadStrategy === 'telegram_direct' ? 'telegram' : 'r2')
  const archiveStatus = options?.archiveStatus ?? (storageProvider === 'telegram' ? 'completed' : 'pending')
  await db.update(objects)
    .set({
      status: 'ready',
      uploadStrategy,
      storageProvider,
      archiveStatus,
      archiveLastError: null,
      archiveLeaseUntil: null,
      archiveNextAttemptAt: nowIso,
      archivedAt: options?.archivedAt ?? (archiveStatus === 'completed' ? nowIso : null),
      totalParts,
      updatedAt: nowIso
    })
    .where(eq(objects.id, objectId))
}

export async function markObjectFailed(db: ApiDatabase, objectId: string) {
  await db.update(objects)
    .set({
      status: 'failed',
      archiveStatus: 'failed',
      archiveLeaseUntil: null,
      updatedAt: new Date().toISOString()
    })
    .where(eq(objects.id, objectId))
}

export async function markObjectDeleted(db: ApiDatabase, objectId: string) {
  await db.update(objects)
    .set({
      status: 'deleted',
      archiveStatus: 'failed',
      archiveLeaseUntil: null,
      updatedAt: new Date().toISOString()
    })
    .where(eq(objects.id, objectId))
}

export async function updateObjectMimeType(
  db: ApiDatabase,
  payload: {
    objectId: string
    mimeType: string
  }
) {
  await db.update(objects)
    .set({
      mimeType: payload.mimeType,
      updatedAt: new Date().toISOString()
    })
    .where(eq(objects.id, payload.objectId))
}

export async function listArchiveCandidates(
  db: ApiDatabase,
  payload: {
    nowIso: string
    maxAttempts: number
    limit: number
  }
): Promise<ArchiveCandidate[]> {
  const rows = await db.select({
    id: objects.id
  })
    .from(objects)
    .where(and(
      eq(objects.status, 'ready'),
      inArray(objects.archiveStatus, ['pending', 'processing']),
      lt(objects.archiveAttempts, payload.maxAttempts),
      lte(objects.archiveNextAttemptAt, payload.nowIso),
      or(
        isNull(objects.archiveLeaseUntil),
        lte(objects.archiveLeaseUntil, payload.nowIso)
      )
    ))
    .orderBy(asc(objects.updatedAt))
    .limit(payload.limit)

  return rows
}

export async function claimArchiveLease(
  db: ApiDatabase,
  payload: {
    objectId: string
    nowIso: string
    leaseUntilIso: string
  }
): Promise<boolean> {
  await db.update(objects)
    .set({
      archiveStatus: 'processing',
      archiveLeaseUntil: payload.leaseUntilIso,
      updatedAt: payload.nowIso
    })
    .where(and(
      eq(objects.id, payload.objectId),
      eq(objects.status, 'ready'),
      inArray(objects.archiveStatus, ['pending', 'processing']),
      lte(objects.archiveNextAttemptAt, payload.nowIso),
      or(
        isNull(objects.archiveLeaseUntil),
        lte(objects.archiveLeaseUntil, payload.nowIso)
      )
    ))

  const object = await findObjectById(db, payload.objectId)
  return object?.archiveStatus === 'processing' && object.archiveLeaseUntil === payload.leaseUntilIso
}

export async function markArchiveCompleted(
  db: ApiDatabase,
  payload: {
    objectId: string
    nowIso: string
  }
) {
  await db.update(objects)
    .set({
      storageProvider: 'telegram',
      archiveStatus: 'completed',
      archiveAttempts: 0,
      archiveLeaseUntil: null,
      archiveLastError: null,
      archiveNextAttemptAt: payload.nowIso,
      archivedAt: payload.nowIso,
      updatedAt: payload.nowIso
    })
    .where(eq(objects.id, payload.objectId))
}

export async function markArchiveFailedOrRetry(
  db: ApiDatabase,
  payload: {
    objectId: string
    nowIso: string
    nextAttemptAtIso: string
    nextAttempts: number
    maxAttempts: number
    errorMessage: string
  }
) {
  const shouldFail = payload.nextAttempts >= payload.maxAttempts
  await db.update(objects)
    .set({
      archiveStatus: shouldFail ? 'failed' : 'pending',
      archiveAttempts: payload.nextAttempts,
      archiveNextAttemptAt: payload.nextAttemptAtIso,
      archiveLastError: payload.errorMessage,
      archiveLeaseUntil: null,
      updatedAt: payload.nowIso
    })
    .where(eq(objects.id, payload.objectId))
}

export async function releaseArchiveLease(
  db: ApiDatabase,
  payload: {
    objectId: string
    nowIso: string
  }
) {
  await db.update(objects)
    .set({
      archiveLeaseUntil: null,
      updatedAt: payload.nowIso
    })
    .where(eq(objects.id, payload.objectId))
}

export async function findObjectById(db: ApiDatabase, objectId: string): Promise<StoredObjectSummary | null> {
  const rows = await db.select()
    .from(objects)
    .where(eq(objects.id, objectId))
    .limit(1)

  const row = rows[0]
  return row ? toObjectSummary(row) : null
}

export async function findReadyObjectBySha256(db: ApiDatabase, sha256: string): Promise<StoredObjectSummary | null> {
  const rows = await db.select()
    .from(objects)
    .where(and(
      eq(objects.sha256, sha256),
      eq(objects.status, 'ready')
    ))
    .limit(1)

  const row = rows[0]
  return row ? toObjectSummary(row) : null
}

export async function listStaleOrphanObjects(
  db: ApiDatabase,
  payload: {
    updatedBeforeIso: string
    limit: number
  }
): Promise<StoredObjectSummary[]> {
  const rows = await db.select({
    object: objects
  })
    .from(objects)
    .leftJoin(clipboardEntryAttachments, eq(clipboardEntryAttachments.objectId, objects.id))
    .where(and(
      inArray(objects.status, ['uploading', 'ready', 'failed', 'deleted']),
      lte(objects.updatedAt, payload.updatedBeforeIso),
      isNull(clipboardEntryAttachments.id)
    ))
    .orderBy(asc(objects.updatedAt))
    .limit(payload.limit)

  return rows.map((row) => toObjectSummary(row.object))
}

export async function isObjectUnreferenced(db: ApiDatabase, objectId: string): Promise<boolean> {
  const rows = await db.select({
    id: clipboardEntryAttachments.id
  })
    .from(clipboardEntryAttachments)
    .where(eq(clipboardEntryAttachments.objectId, objectId))
    .limit(1)

  return rows.length === 0
}

export async function findObjectPartsByObjectId(db: ApiDatabase, objectId: string): Promise<StoredObjectPart[]> {
  const rows = await db.select()
    .from(objectParts)
    .where(eq(objectParts.objectId, objectId))
    .orderBy(asc(objectParts.partIndex))

  return rows.map((row) => ({
    objectId: row.objectId,
    partIndex: row.partIndex,
    providerFileId: row.providerFileId,
    providerFilePath: row.providerFilePath,
    r2ObjectKey: row.r2ObjectKey,
    partSizeBytes: row.partSizeBytes
  }))
}

export async function listUploadedPartIndexes(db: ApiDatabase, objectId: string): Promise<number[]> {
  const rows = await db.select({
    partIndex: objectParts.partIndex
  })
    .from(objectParts)
    .where(eq(objectParts.objectId, objectId))
    .orderBy(asc(objectParts.partIndex))

  return rows.map((row) => row.partIndex)
}

export async function getUploadSessionState(db: ApiDatabase, objectId: string): Promise<UploadSessionState | null> {
  const object = await findObjectById(db, objectId)
  if (!object) {
    return null
  }

  return {
    object,
    uploadedPartIndexes: await listUploadedPartIndexes(db, objectId)
  }
}

export async function deleteObjectPermanently(db: ApiDatabase, objectId: string) {
  await db.delete(objects)
    .where(eq(objects.id, objectId))
}

function toObjectSummary(row: typeof objects.$inferSelect): StoredObjectSummary {
  return {
    id: row.id,
    sha256: row.sha256,
    fileName: row.fileName,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    totalParts: row.totalParts,
    status: row.status,
    uploadStrategy: row.uploadStrategy,
    storageProvider: row.storageProvider,
    archiveStatus: row.archiveStatus,
    archiveAttempts: row.archiveAttempts,
    archiveNextAttemptAt: row.archiveNextAttemptAt,
    archiveLastError: row.archiveLastError,
    archiveLeaseUntil: row.archiveLeaseUntil,
    archivedAt: row.archivedAt
  }
}
