export const SCAFFOLD_INFO = Object.freeze({
  name: 'LinkDisk Scaffold',
  version: '0.1.0'
})

export const API_PATHS = Object.freeze({
  health: '/api/linkdisk/health',
  clipboardEntryInit: '/api/linkdisk/clipboard/entries/init',
  clipboardAccess: '/api/linkdisk/clipboard/access',
  clipboardEntryPublishTemplate: '/api/linkdisk/clipboard/entries/{entryId}/publish',
  clipboardEntryAttachmentInitTemplate: '/api/linkdisk/clipboard/entries/{entryId}/attachments/init',
  clipboardEntryAttachmentPartTemplate: '/api/linkdisk/clipboard/entries/{entryId}/attachments/{objectId}/parts/{partIndex}',
  clipboardEntryAttachmentCompleteTemplate: '/api/linkdisk/clipboard/entries/{entryId}/attachments/{objectId}/complete',
  clipboardShareTemplate: '/api/linkdisk/clipboard/share/{shareId}',
  clipboardShareVerifyPasswordTemplate: '/api/linkdisk/clipboard/share/{shareId}/verify-password',
  clipboardShareAttachmentTemplate: '/api/linkdisk/clipboard/share/{shareId}/attachments/{attachmentId}',
  clipboardManageTemplate: '/api/linkdisk/clipboard/manage/{manageId}',
  clipboardManageDestroyTemplate: '/api/linkdisk/clipboard/manage/{manageId}/destroy',
  clipboardManageRecreateTemplate: '/api/linkdisk/clipboard/manage/{manageId}/recreate',
  clipboardManageAttachmentTemplate: '/api/linkdisk/clipboard/manage/{manageId}/attachments/{attachmentId}',
  dashboardStatsOverview: '/api/linkdisk/dashboard/stats/overview',
  dashboardStatsRecent: '/api/linkdisk/dashboard/stats/recent',
  adminPing: '/admin-api/linkdisk/ping',
  adminObjectCheck: '/admin-api/linkdisk/objects/check',
  adminObjectUpload: '/admin-api/linkdisk/objects/upload',
  adminObjectUploadInit: '/admin-api/linkdisk/objects/upload/init',
  adminObjectUploadBatchInit: '/admin-api/linkdisk/objects/upload/init-batch',
  adminObjectUploadPartTemplate: '/admin-api/linkdisk/objects/{objectId}/parts/{partIndex}',
  adminObjectUploadCompleteTemplate: '/admin-api/linkdisk/objects/{objectId}/complete',
  adminObjectDownloadTemplate: '/admin-api/linkdisk/objects/{objectId}/download',
  docs: '/docs/linkdisk',
  openapi: '/openapi/linkdisk.json'
})

export const API_DOC_INFO = Object.freeze({
  title: 'LinkDisk Admin API',
  version: '1.0.0',
  description: 'Admin upload API with health checks, optional hash-first dedupe (disabled by default), and OpenAPI docs'
})

export const API_MESSAGES = Object.freeze({
  missingAdminJwtSecret: 'Missing env ADMIN_JWT_SECRET'
})

export function createHealthResponse() {
  return {
    success: true,
    status: 'ok'
  }
}

export function createClipboardEntryPublishPath(entryId) {
  return `/api/linkdisk/clipboard/entries/${encodeURIComponent(entryId)}/publish`
}

export function createClipboardEntryInitPath() {
  return API_PATHS.clipboardEntryInit
}

export function createClipboardAccessPath() {
  return API_PATHS.clipboardAccess
}

export function createClipboardEntryAttachmentInitPath(entryId) {
  return `/api/linkdisk/clipboard/entries/${encodeURIComponent(entryId)}/attachments/init`
}

export function createClipboardEntryAttachmentPartPath(entryId, objectId, partIndex) {
  return `/api/linkdisk/clipboard/entries/${encodeURIComponent(entryId)}/attachments/${encodeURIComponent(objectId)}/parts/${encodeURIComponent(String(partIndex))}`
}

export function createClipboardEntryAttachmentCompletePath(entryId, objectId) {
  return `/api/linkdisk/clipboard/entries/${encodeURIComponent(entryId)}/attachments/${encodeURIComponent(objectId)}/complete`
}

export function createClipboardSharePath(shareId) {
  return `/api/linkdisk/clipboard/share/${encodeURIComponent(shareId)}`
}

export function createClipboardShareVerifyPasswordPath(shareId) {
  return `/api/linkdisk/clipboard/share/${encodeURIComponent(shareId)}/verify-password`
}

export function createClipboardShareAttachmentPath(shareId, attachmentId) {
  return `/api/linkdisk/clipboard/share/${encodeURIComponent(shareId)}/attachments/${encodeURIComponent(String(attachmentId))}`
}

export function createClipboardManagePath(manageId) {
  return `/api/linkdisk/clipboard/manage/${encodeURIComponent(manageId)}`
}

export function createClipboardManageDestroyPath(manageId) {
  return `/api/linkdisk/clipboard/manage/${encodeURIComponent(manageId)}/destroy`
}

export function createClipboardManageRecreatePath(manageId) {
  return `/api/linkdisk/clipboard/manage/${encodeURIComponent(manageId)}/recreate`
}

export function createClipboardManageAttachmentPath(manageId, attachmentId) {
  return `/api/linkdisk/clipboard/manage/${encodeURIComponent(manageId)}/attachments/${encodeURIComponent(String(attachmentId))}`
}

export function createAdminObjectDownloadPath(objectId) {
  return `/admin-api/linkdisk/objects/${encodeURIComponent(objectId)}/download`
}

export function createAdminObjectUploadPartPath(objectId, partIndex) {
  return `/admin-api/linkdisk/objects/${encodeURIComponent(objectId)}/parts/${encodeURIComponent(String(partIndex))}`
}

export function createAdminObjectUploadCompletePath(objectId) {
  return `/admin-api/linkdisk/objects/${encodeURIComponent(objectId)}/complete`
}
