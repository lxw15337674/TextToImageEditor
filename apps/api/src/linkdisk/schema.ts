import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const objects = sqliteTable(
  'objects',
  {
    id: text('id').primaryKey(),
    sha256: text('sha256').notNull(),
    fileName: text('file_name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    totalParts: integer('total_parts').notNull().default(0),
    status: text('status').notNull().default('uploading'),
    uploadStrategy: text('upload_strategy').notNull().default('r2'),
    storageProvider: text('storage_provider').notNull().default('telegram'),
    archiveStatus: text('archive_status').notNull().default('pending'),
    archiveAttempts: integer('archive_attempts').notNull().default(0),
    archiveNextAttemptAt: text('archive_next_attempt_at').notNull().default(sql`(datetime('now'))`),
    archiveLastError: text('archive_last_error'),
    archiveLeaseUntil: text('archive_lease_until'),
    archivedAt: text('archived_at'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    sha256Unique: uniqueIndex('idx_objects_sha256').on(table.sha256),
    archiveScanIdx: index('idx_objects_archive_scan').on(table.archiveStatus, table.archiveNextAttemptAt)
  })
)

export const objectParts = sqliteTable(
  'object_parts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    objectId: text('object_id')
      .notNull()
      .references(() => objects.id, { onDelete: 'cascade' }),
    partIndex: integer('part_index').notNull(),
    providerFileId: text('provider_file_id'),
    providerFilePath: text('provider_file_path'),
    r2ObjectKey: text('r2_object_key'),
    partSizeBytes: integer('part_size_bytes').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    objectPartUnique: uniqueIndex('idx_object_parts_object_id_part_index').on(table.objectId, table.partIndex)
  })
)

export const clipboardEntries = sqliteTable(
  'clipboard_entries',
  {
    id: text('id').primaryKey(),
    title: text('title'),
    bodyStorageProvider: text('body_storage_provider').notNull().default('r2'),
    bodyR2Key: text('body_r2_key'),
    bodySizeBytes: integer('body_size_bytes').notNull().default(0),
    bodySha256: text('body_sha256').notNull().default(''),
    bodyFormat: text('body_format').notNull().default('plain_text'),
    status: text('status').notNull().default('draft'),
    shareId: text('share_id').notNull(),
    manageId: text('manage_id').notNull(),
    publishedAt: text('published_at'),
    destroyedAt: text('destroyed_at'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    shareIdUnique: uniqueIndex('idx_clipboard_entries_share_id').on(table.shareId),
    manageIdUnique: uniqueIndex('idx_clipboard_entries_manage_id').on(table.manageId),
    statusIdx: index('idx_clipboard_entries_status').on(table.status, table.updatedAt)
  })
)

export const clipboardEntryAttachments = sqliteTable(
  'clipboard_entry_attachments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    entryId: text('entry_id')
      .notNull()
      .references(() => clipboardEntries.id, { onDelete: 'cascade' }),
    objectId: text('object_id')
      .notNull()
      .references(() => objects.id, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    attachmentObjectIdx: index('idx_clipboard_entry_attachments_object_id').on(table.objectId),
    attachmentSortIdx: index('idx_clipboard_entry_attachments_entry_sort').on(table.entryId, table.sortOrder)
  })
)

export const clipboardShareSettings = sqliteTable(
  'clipboard_share_settings',
  {
    entryId: text('entry_id')
      .primaryKey()
      .references(() => clipboardEntries.id, { onDelete: 'cascade' }),
    passwordHash: text('password_hash'),
    expiresAt: text('expires_at'),
    maxViews: integer('max_views'),
    viewCount: integer('view_count').notNull().default(0),
    destroyMode: text('destroy_mode').notNull().default('none'),
    disabled: integer('disabled').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    expiresIdx: index('idx_clipboard_share_settings_expires_at').on(table.expiresAt)
  })
)

export const clipboardShareAccessTokens = sqliteTable(
  'clipboard_share_access_tokens',
  {
    token: text('token').primaryKey(),
    entryId: text('entry_id')
      .notNull()
      .references(() => clipboardEntries.id, { onDelete: 'cascade' }),
    shareId: text('share_id').notNull(),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    shareTokenIdx: index('idx_clipboard_share_access_tokens_share_id').on(table.shareId, table.expiresAt)
  })
)

export const clipboardEvents = sqliteTable(
  'clipboard_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    entryId: text('entry_id').references(() => clipboardEntries.id, { onDelete: 'cascade' }),
    attachmentId: integer('attachment_id'),
    eventType: text('event_type').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
  },
  (table) => ({
    eventTypeIdx: index('idx_clipboard_events_type_created').on(table.eventType, table.createdAt),
    entryEventIdx: index('idx_clipboard_events_entry_created').on(table.entryId, table.createdAt)
  })
)
