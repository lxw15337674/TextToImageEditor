'use client';

import {
  createClipboardAccessPath,
  createClipboardEntryAttachmentCompletePath,
  createClipboardEntryAttachmentInitPath,
  createClipboardEntryAttachmentPartPath,
  createClipboardEntryPublishPath,
  createClipboardManageAttachmentPath,
  createClipboardManageDestroyPath,
  createClipboardManagePath,
  createClipboardShareAttachmentPath,
  createClipboardSharePath
} from '@linkdisk/shared';
import type {
  ClipboardAccessResponse,
  ClipboardAttachment,
  ClipboardAttachmentMediaKind,
  ClipboardBodyFormat,
  ClipboardDestroyMode,
  ClipboardDraftInitResponse,
  ClipboardEntry,
  ClipboardManageResponse,
  ClipboardManageStats,
  ClipboardOverviewStats,
  ClipboardPublishResponse,
  ClipboardRecentStatsItem,
  ClipboardShareAttachment,
  ClipboardShareResponse,
  ClipboardShareSettings
} from '@linkdisk/shared';
export type {
  ClipboardAccessResponse,
  ClipboardAttachment,
  ClipboardAttachmentMediaKind,
  ClipboardBodyFormat,
  ClipboardDestroyMode,
  ClipboardDraftInitResponse,
  ClipboardEntry,
  ClipboardManageResponse,
  ClipboardManageStats,
  ClipboardOverviewStats,
  ClipboardPublishResponse,
  ClipboardRecentStatsItem,
  ClipboardShareAttachment,
  ClipboardShareResponse,
  ClipboardShareSettings
};
import type { Locale } from '@/i18n/config';

export interface ClipboardDraftSessionData {
  entryId: string | null;
  shareId: string | null;
  manageId: string | null;
  title: string;
  body: string;
  password: string;
  hasPassword: boolean;
  expiresAt: string;
  maxViews: string;
  destroyMode: Exclude<ClipboardDestroyMode, 'manual'>;
  disabledShare: boolean;
  manageFeatureEnabled?: boolean;
  attachments: ClipboardAttachment[];
  updatedAt: string;
}

export interface ClipboardRecentRecord {
  shareId: string;
  shareUrl: string;
  manageUrl: string;
  title: string;
  createdAt: string;
  manageEnabled: boolean;
}

export const CLIPBOARD_RECENT_RECORDS_STORAGE_KEY = 'clipboard-editor:recent-records:v1';
export const CLIPBOARD_RECENT_RECORD_LIMIT = 100;

export function normalizeApiBaseUrl(rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname === '127.0.0.1') {
      url.hostname = 'localhost';
    }
    return url.toString().replace(/\/+$/, '');
  } catch {
    return trimmed
      .replace(/^http:\/\/127\.0\.0\.1(?=[:/]|$)/, 'http://localhost')
      .replace(/^https:\/\/127\.0\.0\.1(?=[:/]|$)/, 'https://localhost')
      .replace(/\/+$/, '');
  }
}

const DEV_API_BASE_URL_FALLBACK = 'http://localhost:8787';

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL
  ?? (process.env.NODE_ENV === 'development' ? DEV_API_BASE_URL_FALLBACK : '')
);
export const TURNSTILE_SITE_KEY = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();
export const CLIPBOARD_MAX_ATTACHMENTS = 50;
export const DEFAULT_CHUNK_SIZE_MB = 16;
export const DEFAULT_UPLOAD_CONCURRENCY = 6;
export const REQUEST_TIMEOUT_MS = 180_000;
export const LINKDISK_BASE_PATH = '/linkdisk';
export const LINKDISK_RECENT_PATH = `${LINKDISK_BASE_PATH}/clipboard/recent`;

export function apiUrl(path: string) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export function bytesToDisplay(size: number) {
  if (!Number.isFinite(size) || size < 1024) {
    return `${size} B`;
  }
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = size / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : 2)} ${units[unitIndex]}`;
}

export function formatDateTime(value: string | number | null | undefined) {
  if (!value) {
    return '--';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date(value));
}

export function formatCompactDateTime(value: string | number | null | undefined) {
  if (!value) {
    return '--';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(value));
}

function normalizeClipboardRecentRecords(records: ClipboardRecentRecord[]) {
  return records
    .filter((item) => Boolean(item?.shareId && item?.shareUrl && item?.manageUrl && item?.createdAt))
    .map((item) => ({
      ...item,
      manageEnabled: Boolean(item.manageEnabled)
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, CLIPBOARD_RECENT_RECORD_LIMIT);
}

export function readClipboardRecentRecords() {
  if (typeof window === 'undefined') {
    return [] as ClipboardRecentRecord[];
  }

  const raw = window.localStorage.getItem(CLIPBOARD_RECENT_RECORDS_STORAGE_KEY);
  if (!raw) {
    return [] as ClipboardRecentRecord[];
  }

  try {
    const parsed = JSON.parse(raw) as ClipboardRecentRecord[];
    if (!Array.isArray(parsed)) {
      return [] as ClipboardRecentRecord[];
    }
    return normalizeClipboardRecentRecords(parsed);
  } catch {
    return [] as ClipboardRecentRecord[];
  }
}

export function writeClipboardRecentRecords(records: ClipboardRecentRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(
    CLIPBOARD_RECENT_RECORDS_STORAGE_KEY,
    JSON.stringify(normalizeClipboardRecentRecords(records))
  );
}

export function upsertClipboardRecentRecord(record: ClipboardRecentRecord) {
  const nextRecords = normalizeClipboardRecentRecords([
    record,
    ...readClipboardRecentRecords().filter((item) => item.shareId !== record.shareId)
  ]);
  writeClipboardRecentRecords(nextRecords);
  return nextRecords;
}

export function removeClipboardRecentRecord(shareId: string) {
  const nextRecords = readClipboardRecentRecords().filter((item) => item.shareId !== shareId);
  writeClipboardRecentRecords(nextRecords);
  return nextRecords;
}

export function clearClipboardRecentRecords() {
  writeClipboardRecentRecords([]);
}

export async function runWithConcurrency<T>(items: T[], limit: number, task: (item: T) => Promise<void>) {
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      const current = items[currentIndex];
      if (current === undefined) {
        continue;
      }
      await task(current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
}

export function buildLocalizedShareUrl(origin: string, locale: Locale, shareId: string) {
  return `${origin}/${locale}${LINKDISK_BASE_PATH}/s/${encodeURIComponent(shareId)}`;
}

export function buildLocalizedManageUrl(origin: string, locale: Locale, manageId: string) {
  return `${origin}/${locale}${LINKDISK_BASE_PATH}/m/${encodeURIComponent(manageId)}`;
}

export function buildShareAccessStorageKey(shareId: string) {
  return `clipboard-share-access-token:${shareId}`;
}

export function buildShareSessionAccessStorageKey(shareId: string) {
  return `clipboard-share-session-access-token:${shareId}`;
}

export function resolveClipboardAttachmentMediaKind(mimeType: string): ClipboardAttachmentMediaKind {
  const normalized = mimeType.trim().toLowerCase();
  if (normalized.startsWith('image/')) {
    return 'image';
  }
  if (normalized.startsWith('video/')) {
    return 'video';
  }
  if (normalized.startsWith('audio/')) {
    return 'audio';
  }
  if (normalized === 'application/pdf') {
    return 'pdf';
  }
  if (normalized.startsWith('text/')) {
    return 'text';
  }
  return 'binary';
}

export function clipboardApiPaths(entryId: string, objectId: string, shareId: string, manageId: string, attachmentId: number) {
  return {
    access: createClipboardAccessPath(),
    attachmentInit: createClipboardEntryAttachmentInitPath(entryId),
    attachmentPart: createClipboardEntryAttachmentPartPath(entryId, objectId, 0),
    attachmentComplete: createClipboardEntryAttachmentCompletePath(entryId, objectId),
    publish: createClipboardEntryPublishPath(entryId),
    share: createClipboardSharePath(shareId),
    shareAttachment: createClipboardShareAttachmentPath(shareId, attachmentId),
    manage: createClipboardManagePath(manageId),
    manageDestroy: createClipboardManageDestroyPath(manageId),
    manageAttachment: createClipboardManageAttachmentPath(manageId, attachmentId)
  };
}
