export declare const SCAFFOLD_INFO: Readonly<{
  name: 'LinkDisk Scaffold'
  version: '0.1.0'
}>

export declare const API_PATHS: Readonly<{
  health: '/api/linkdisk/health'
  clipboardEntryInit: '/api/linkdisk/clipboard/entries/init'
  clipboardAccess: '/api/linkdisk/clipboard/access'
  clipboardEntryPublishTemplate: '/api/linkdisk/clipboard/entries/{entryId}/publish'
  clipboardEntryAttachmentInitTemplate: '/api/linkdisk/clipboard/entries/{entryId}/attachments/init'
  clipboardEntryAttachmentPartTemplate: '/api/linkdisk/clipboard/entries/{entryId}/attachments/{objectId}/parts/{partIndex}'
  clipboardEntryAttachmentCompleteTemplate: '/api/linkdisk/clipboard/entries/{entryId}/attachments/{objectId}/complete'
  clipboardShareTemplate: '/api/linkdisk/clipboard/share/{shareId}'
  clipboardShareVerifyPasswordTemplate: '/api/linkdisk/clipboard/share/{shareId}/verify-password'
  clipboardShareAttachmentTemplate: '/api/linkdisk/clipboard/share/{shareId}/attachments/{attachmentId}'
  clipboardManageTemplate: '/api/linkdisk/clipboard/manage/{manageId}'
  clipboardManageDestroyTemplate: '/api/linkdisk/clipboard/manage/{manageId}/destroy'
  clipboardManageRecreateTemplate: '/api/linkdisk/clipboard/manage/{manageId}/recreate'
  clipboardManageAttachmentTemplate: '/api/linkdisk/clipboard/manage/{manageId}/attachments/{attachmentId}'
  dashboardStatsOverview: '/api/linkdisk/dashboard/stats/overview'
  dashboardStatsRecent: '/api/linkdisk/dashboard/stats/recent'
  adminPing: '/admin-api/linkdisk/ping'
  adminObjectCheck: '/admin-api/linkdisk/objects/check'
  adminObjectUpload: '/admin-api/linkdisk/objects/upload'
  adminObjectUploadInit: '/admin-api/linkdisk/objects/upload/init'
  adminObjectUploadBatchInit: '/admin-api/linkdisk/objects/upload/init-batch'
  adminObjectUploadPartTemplate: '/admin-api/linkdisk/objects/{objectId}/parts/{partIndex}'
  adminObjectUploadCompleteTemplate: '/admin-api/linkdisk/objects/{objectId}/complete'
  adminObjectDownloadTemplate: '/admin-api/linkdisk/objects/{objectId}/download'
  docs: '/docs/linkdisk'
  openapi: '/openapi/linkdisk.json'
}>

export declare const API_DOC_INFO: Readonly<{
  title: 'LinkDisk Admin API'
  version: '1.0.0'
  description: 'Admin upload API with health checks, optional hash-first dedupe (disabled by default), and OpenAPI docs'
}>

export declare const API_MESSAGES: Readonly<{
  missingAdminJwtSecret: 'Missing env ADMIN_JWT_SECRET'
}>

export declare function createHealthResponse(): {
  success: true
  status: 'ok'
}

export declare function createClipboardEntryInitPath(): string
export declare function createClipboardAccessPath(): string
export declare function createClipboardEntryPublishPath(entryId: string): string
export declare function createClipboardEntryAttachmentInitPath(entryId: string): string
export declare function createClipboardEntryAttachmentPartPath(entryId: string, objectId: string, partIndex: number): string
export declare function createClipboardEntryAttachmentCompletePath(entryId: string, objectId: string): string
export declare function createClipboardSharePath(shareId: string): string
export declare function createClipboardShareVerifyPasswordPath(shareId: string): string
export declare function createClipboardShareAttachmentPath(shareId: string, attachmentId: number): string
export declare function createClipboardManagePath(manageId: string): string
export declare function createClipboardManageDestroyPath(manageId: string): string
export declare function createClipboardManageRecreatePath(manageId: string): string
export declare function createClipboardManageAttachmentPath(manageId: string, attachmentId: number): string
export declare function createAdminObjectDownloadPath(objectId: string): string
export declare function createAdminObjectUploadPartPath(objectId: string, partIndex: number): string
export declare function createAdminObjectUploadCompletePath(objectId: string): string

export type ClipboardBodyFormat = 'plain_text'
export type ClipboardDestroyMode = 'none' | 'manual' | 'expire' | 'max_views' | 'first_view'
export type ClipboardEntryStatus = 'draft' | 'published' | 'deleted' | 'destroyed'
export type ClipboardShareStatus = ClipboardEntryStatus | 'expired' | 'disabled'
export type ClipboardAttachmentMediaKind = 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'binary'

export interface ClipboardAttachment {
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

export interface ClipboardShareAttachment extends ClipboardAttachment {
  mediaKind: ClipboardAttachmentMediaKind
  downloadUrl: string
}

export interface ClipboardEntry {
  id: string
  title: string | null
  body: string
  bodyFormat: ClipboardBodyFormat
  status: ClipboardEntryStatus
  shareId: string
  manageId: string
  publishedAt: string | null
  destroyedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ClipboardShareSettings {
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

export interface ClipboardOverviewStats {
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

export interface ClipboardRecentStatsItem {
  id: string
  title: string | null
  shareId: string
  status: ClipboardEntryStatus
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  viewCount: number | null
}

export interface ClipboardDraftInitResponse {
  entryId: string
  shareId: string
  manageId: string
}

export interface ClipboardPublishResponse {
  entryId: string
  shareId: string
  manageId: string
  sharePath: string
  managePath: string
  shortPath: string
}

export interface ClipboardAccessResponse {
  shareId: string
  sharePath: string
  accessToken: string | null
}

export interface ClipboardPasswordVerifyResponse {
  accessToken: string | null
  expiresAt?: string
}

export interface ClipboardShareViewInfo {
  expiresAt: string | null
  maxViews: number | null
  viewCount: number
  destroyMode: ClipboardDestroyMode
}

export interface ClipboardShareResponse {
  id?: string
  shareId: string
  title: string | null
  body?: string
  bodyFormat?: ClipboardBodyFormat
  status: ClipboardShareStatus
  requiresPassword: boolean
  accessToken?: string
  attachments?: ClipboardShareAttachment[]
  share?: ClipboardShareViewInfo
}

export interface ClipboardManageStats {
  attachmentOpenCount: number
  attachmentDownloadCount: number
}

export interface ClipboardManageResponse {
  entry?: ClipboardEntry
  attachments?: ClipboardAttachment[]
  share?: ClipboardShareSettings | null
  stats?: ClipboardManageStats
}
