'use client';

import axios from 'axios';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import {
  Clock3,
  KeyRound,
  Link2,
  Paperclip,
  QrCode,
  Shield
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  createClipboardEntryInitPath,
  createClipboardEntryAttachmentCompletePath,
  createClipboardEntryAttachmentInitPath,
  createClipboardEntryAttachmentPartPath,
  createClipboardEntryPublishPath,
  createClipboardManageAttachmentPath,
  createClipboardManageDestroyPath,
  createClipboardManagePath
} from '@linkdisk/shared';
import { useEffect, useRef, useState, type ClipboardEvent as ReactClipboardEvent, type DragEvent as ReactDragEvent } from 'react';
import { TurnstileWidget } from '@/linkdisk/components/TurnstileWidget';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppPageContainer, WorkspaceSurface } from '@/components/app-page-shell';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { TextareaAutosize } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Locale } from '@/i18n/config';
import { formatMessage } from '@/i18n/format';
import { getMessages } from '@/linkdisk/i18n/messages';
import {
  apiUrl,
  buildLocalizedManageUrl,
  buildLocalizedShareUrl,
  CLIPBOARD_MAX_ATTACHMENTS,
  bytesToDisplay,
  type ClipboardAttachment,
  type ClipboardDraftSessionData,
  type ClipboardDestroyMode,
  type ClipboardManageResponse,
  type ClipboardManageStats,
  type ClipboardPublishResponse,
  type ClipboardRecentRecord,
  DEFAULT_CHUNK_SIZE_MB,
  DEFAULT_UPLOAD_CONCURRENCY,
  upsertClipboardRecentRecord,
  REQUEST_TIMEOUT_MS,
  TURNSTILE_SITE_KEY,
  runWithConcurrency
} from '@/linkdisk/lib/clipboard';
import { cn } from '@/lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';
type ShareExpiryMode = 'expire' | 'max_views';

interface UploadTask {
  id: string;
  fileName: string;
  percent: number;
  status: UploadStatus;
  errorText: string;
}

interface ShareResultState {
  shareId: string;
  shareUrl: string;
  manageUrl: string;
  manageFeatureEnabled: boolean;
}

type EditorMessages = ReturnType<typeof getMessages>['editor'];

type PendingTurnstileAction =
  | { type: 'pick_files' }
  | { type: 'publish' }
  | { type: 'upload_files'; files: File[] };

function newUploadTask(fileName: string): UploadTask {
  return {
    id: crypto.randomUUID(),
    fileName,
    percent: 0,
    status: 'uploading',
    errorText: ''
  };
}

function toErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | undefined;
    return payload?.message ?? error.message;
  }
  return error instanceof Error ? error.message : fallback;
}

function getPartSize(fileSize: number, chunkSizeBytes: number, partIndex: number) {
  const start = partIndex * chunkSizeBytes;
  const end = Math.min(fileSize, start + chunkSizeBytes);
  return Math.max(0, end - start);
}

function getUploadTaskStatusLabel(status: UploadStatus, messages: EditorMessages) {
  switch (status) {
    case 'done':
      return messages.uploadStatusDone;
    case 'error':
      return messages.uploadStatusError;
    case 'uploading':
      return messages.uploadStatusUploading;
    default:
      return messages.uploadStatusIdle;
  }
}

const CLIPBOARD_DRAFT_SESSION_KEY = 'clipboard-editor:draft-session:v1';
const MAX_EXPIRE_DAYS = 30;
const DEFAULT_EXPIRE_DAYS = 1;
const DEFAULT_MAX_VIEWS = '10';
const SHARE_PRESET_MATCH_TOLERANCE_MS = 5 * 60 * 1000;

type SharePresetId = 'expire_1d' | 'expire_7d' | 'expire_30d' | 'max_views_1' | 'max_views_10' | 'max_views_100';

function toDateTimeLocalValue(date: Date) {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
}

function getDateTimeAfterDays(days: number) {
  return toDateTimeLocalValue(addDays(new Date(), days));
}

function parseDateTimeLocalValue(value: string) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getExpireTimeValue(value: string) {
  const parsed = parseDateTimeLocalValue(value);
  return parsed ? format(parsed, 'HH:mm') : format(new Date(), 'HH:mm');
}

function getNextValidExpireDateTime() {
  const next = new Date();
  next.setSeconds(0, 0);
  next.setMinutes(next.getMinutes() + 1);
  return next;
}

function formatExpireDateDisplay(value: string, placeholder: string) {
  const parsed = parseDateTimeLocalValue(value);
  return parsed ? format(parsed, 'yyyy-MM-dd') : placeholder;
}

function mergeDateWithTime(date: Date, timeValue: string) {
  const next = new Date(date);
  const [hoursText = '0', minutesText = '0'] = timeValue.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  next.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0
  );
  return normalizeExpireAtInput(toDateTimeLocalValue(next), { enforceFuture: true });
}

function getMaxExpireDate() {
  return addDays(new Date(), MAX_EXPIRE_DAYS);
}

function normalizeExpireAtInput(value: string, options?: { enforceFuture?: boolean }) {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  if (options?.enforceFuture && parsed.getTime() <= Date.now()) {
    return toDateTimeLocalValue(getNextValidExpireDateTime());
  }
  const maxExpire = new Date(Date.now() + MAX_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
  if (parsed.getTime() > maxExpire.getTime()) {
    return toDateTimeLocalValue(maxExpire);
  }
  return value;
}

function resolveActiveSharePreset(params: {
  destroyMode: ShareExpiryMode;
  expiresAt: string;
  maxViews: string;
}): SharePresetId | null {
  if (params.destroyMode === 'max_views') {
    const normalizedMaxViews = params.maxViews.trim();
    if (normalizedMaxViews === '1') {
      return 'max_views_1';
    }
    if (normalizedMaxViews === '10') {
      return 'max_views_10';
    }
    if (normalizedMaxViews === '100') {
      return 'max_views_100';
    }
    return null;
  }
  if (params.destroyMode !== 'expire') {
    return null;
  }
  const parsed = new Date(params.expiresAt);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const now = Date.now();
  const targets: Array<{ id: SharePresetId; offsetMs: number }> = [
    { id: 'expire_1d', offsetMs: 24 * 60 * 60 * 1000 },
    { id: 'expire_7d', offsetMs: 7 * 24 * 60 * 60 * 1000 },
    { id: 'expire_30d', offsetMs: 30 * 24 * 60 * 60 * 1000 }
  ];

  for (const target of targets) {
    const targetMs = now + target.offsetMs;
    if (Math.abs(parsed.getTime() - targetMs) <= SHARE_PRESET_MATCH_TOLERANCE_MS) {
      return target.id;
    }
  }
  return null;
}

function normalizeShareExpiryMode(mode: ClipboardDestroyMode): ShareExpiryMode {
  if (mode === 'manual' || mode === 'none') {
    return 'expire';
  }
  if (mode === 'first_view') {
    return 'max_views';
  }
  return mode;
}

async function createQrCodePngBlob(
  svgElement: SVGSVGElement,
  messages: Pick<EditorMessages, 'qrRenderError' | 'qrExportError'>,
) {
  const serializedSvg = new XMLSerializer().serializeToString(svgElement);
  const size = Math.max(
    svgElement.viewBox.baseVal?.width || 0,
    Number(svgElement.getAttribute('width')) || 0,
    svgElement.getBoundingClientRect().width || 0,
    148
  );
  const svgBlob = new Blob([serializedSvg], {
    type: 'image/svg+xml;charset=utf-8'
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error(messages.qrRenderError));
      nextImage.src = svgUrl;
    });

    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = size * scale;
    canvas.height = size * scale;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(messages.qrRenderError);
    }

    context.scale(scale, scale);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    if (!pngBlob) {
      throw new Error(messages.qrExportError);
    }
    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function ClipboardEditorPage({
  locale,
  manageId: initialManageId
}: {
  locale: Locale;
  manageId?: string;
}) {
  const isManageMode = Boolean(initialManageId);
  const messages = getMessages(locale).editor;
  const shareExpiryOptions: Array<{ value: ShareExpiryMode; title: string; description: string }> = [
    {
      value: 'expire',
      title: messages.expiryOptionExpireTitle,
      description: messages.expiryOptionExpireDescription,
    },
    {
      value: 'max_views',
      title: messages.expiryOptionMaxViewsTitle,
      description: messages.expiryOptionMaxViewsDescription,
    },
  ];
  const sharePresets: Array<{ id: SharePresetId; label: string }> = [
    { id: 'expire_1d', label: messages.presetExpire1d },
    { id: 'expire_7d', label: messages.presetExpire7d },
    { id: 'expire_30d', label: messages.presetExpire30d },
    { id: 'max_views_1', label: messages.presetMaxViews1 },
    { id: 'max_views_10', label: messages.presetMaxViews10 },
    { id: 'max_views_100', label: messages.presetMaxViews100 },
  ];
  const [entryId, setEntryId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [manageId, setManageId] = useState<string | null>(initialManageId ?? null);
  const [entryStatus, setEntryStatus] = useState<string>(isManageMode ? 'published' : 'draft');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [password, setPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState(getDateTimeAfterDays(DEFAULT_EXPIRE_DAYS));
  const [maxViews, setMaxViews] = useState('');
  const [destroyMode, setDestroyMode] = useState<ShareExpiryMode>('expire');
  const [disabledShare, setDisabledShare] = useState(false);
  const [attachments, setAttachments] = useState<ClipboardAttachment[]>([]);
  const [isUpdatingAttachmentId, setIsUpdatingAttachmentId] = useState<number | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [, setTurnstileToken] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [manageUrl, setManageUrl] = useState('');
  const [lastShareResult, setLastShareResult] = useState<ShareResultState | null>(null);
  const [isShareResultOpen, setIsShareResultOpen] = useState(false);
  const [isTurnstileDialogOpen, setIsTurnstileDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renamingAttachmentId, setRenamingAttachmentId] = useState<number | null>(null);
  const [renamingAttachmentName, setRenamingAttachmentName] = useState('');
  const [manageFeatureEnabled, setManageFeatureEnabled] = useState(false);
  const [recordRecentOnThisDevice, setRecordRecentOnThisDevice] = useState(false);
  const [turnstileWidgetKey, setTurnstileWidgetKey] = useState(0);
  const [pendingTurnstileAction, setPendingTurnstileAction] = useState<PendingTurnstileAction | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isManageMode);
  const [errorText, setErrorText] = useState('');
  const [manageStats, setManageStats] = useState<ClipboardManageStats>({
    attachmentOpenCount: 0,
    attachmentDownloadCount: 0
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const qrCodeContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileTokenRef = useRef('');
  const activeUploadKeysRef = useRef<Set<string>>(new Set());
  const dropDepthRef = useRef(0);
  const hasRestoredDraftRef = useRef(false);
  const hasRecordedRecentRef = useRef(false);
  const currentShareResult = isManageMode && shareId && shareUrl && manageUrl
    ? {
      shareId,
      shareUrl,
      manageUrl,
      manageFeatureEnabled: true
    }
    : null;
  const activeShareResult = isManageMode ? currentShareResult : lastShareResult;
  const showShareResult = Boolean(activeShareResult);
  const isManageContentLocked = isManageMode && (entryStatus === 'destroyed' || entryStatus === 'deleted');
  const hasDraft = Boolean(entryId && manageId && shareId);
  const activeSharePresetId = resolveActiveSharePreset({
    destroyMode,
    expiresAt,
    maxViews
  });
  const renamingAttachment = renamingAttachmentId
    ? attachments.find((attachment) => attachment.id === renamingAttachmentId) ?? null
    : null;
  const selectedExpireDate = parseDateTimeLocalValue(expiresAt);
  const expireTimeValue = getExpireTimeValue(expiresAt);
  const minExpireTimeValue = (
    selectedExpireDate && isSameDay(selectedExpireDate, new Date())
      ? format(getNextValidExpireDateTime(), 'HH:mm')
      : undefined
  );

  useEffect(() => {
    if (!initialManageId) {
      return;
    }

    const currentManageId = initialManageId;
    let cancelled = false;

    async function loadManageState() {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl(createClipboardManagePath(currentManageId)), {
          timeout: REQUEST_TIMEOUT_MS
        });
        if (cancelled) {
          return;
        }
        const payload = response.data as { data?: ClipboardManageResponse };
        const entry = payload.data?.entry;
        const share = payload.data?.share;
        if (!entry) {
          throw new Error(messages.invalidManageLinkError);
        }

        setEntryId(entry.id);
        setShareId(entry.shareId);
        setManageId(entry.manageId);
        setEntryStatus(entry.status);
        setTitle(entry.title ?? '');
        setBody(entry.body);
        setAttachments(payload.data?.attachments ?? []);
        const normalizedDestroyMode = normalizeShareExpiryMode(share?.destroyMode ?? 'none');
        setHasPassword(Boolean(share?.passwordHash));
        setExpiresAt(
          share?.expiresAt
            ? share.expiresAt.slice(0, 16)
            : (normalizedDestroyMode === 'expire' ? getDateTimeAfterDays(DEFAULT_EXPIRE_DAYS) : '')
        );
        setMaxViews(
          share?.maxViews
            ? String(share.maxViews)
            : (share?.destroyMode === 'first_view' ? '1' : '')
        );
        setDestroyMode(normalizedDestroyMode);
        setDisabledShare(Boolean(share?.disabled));
        setManageStats({
          attachmentOpenCount: payload.data?.stats?.attachmentOpenCount ?? 0,
          attachmentDownloadCount: payload.data?.stats?.attachmentDownloadCount ?? 0
        });

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(buildLocalizedShareUrl(origin, locale, entry.shareId));
        setManageUrl(buildLocalizedManageUrl(origin, locale, entry.manageId));
      } catch (error) {
        if (!cancelled) {
          setErrorText(toErrorMessage(error, messages.unknownError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadManageState();
    return () => {
      cancelled = true;
    };
  }, [initialManageId, locale, messages.invalidManageLinkError, messages.unknownError]);

  useEffect(() => {
    if (!errorText) {
      return;
    }
    toast.error(errorText);
  }, [errorText]);

  useEffect(() => {
    if (isManageMode || hasRestoredDraftRef.current || typeof window === 'undefined') {
      return;
    }
    hasRestoredDraftRef.current = true;

    const raw = window.sessionStorage.getItem(CLIPBOARD_DRAFT_SESSION_KEY);
    if (!raw) {
      return;
    }

    try {
      const draft = JSON.parse(raw) as ClipboardDraftSessionData;
      setEntryId(draft.entryId ?? null);
      setShareId(draft.shareId ?? null);
      setManageId(draft.manageId ?? null);
      setTitle(typeof draft.title === 'string' ? draft.title : '');
      setBody(typeof draft.body === 'string' ? draft.body : '');
      setPassword(typeof draft.password === 'string' ? draft.password : '');
      setHasPassword(Boolean(draft.hasPassword));
      const restoredDestroyMode: ShareExpiryMode = draft.destroyMode === 'max_views' || draft.destroyMode === 'first_view'
        ? 'max_views'
        : 'expire';
      setExpiresAt(
        typeof draft.expiresAt === 'string' && draft.expiresAt
          ? draft.expiresAt
          : (restoredDestroyMode === 'expire' ? getDateTimeAfterDays(DEFAULT_EXPIRE_DAYS) : '')
      );
      setMaxViews(
        typeof draft.maxViews === 'string' && draft.maxViews
          ? draft.maxViews
          : (draft.destroyMode === 'first_view' ? '1' : '')
      );
      setDestroyMode(restoredDestroyMode);
      setDisabledShare(Boolean(draft.disabledShare));
      setManageFeatureEnabled(Boolean(draft.manageFeatureEnabled));
      setAttachments(Array.isArray(draft.attachments) ? draft.attachments : []);
    } catch {
      window.sessionStorage.removeItem(CLIPBOARD_DRAFT_SESSION_KEY);
    }
  }, [isManageMode]);

  useEffect(() => {
    if (isManageMode || !hasRestoredDraftRef.current || typeof window === 'undefined' || showShareResult) {
      return;
    }

    const timer = window.setTimeout(() => {
      const payload: ClipboardDraftSessionData = {
        entryId,
        shareId,
        manageId,
        title,
        body,
        password,
        hasPassword,
        expiresAt,
        maxViews,
        destroyMode,
        disabledShare,
        manageFeatureEnabled,
        attachments,
        updatedAt: new Date().toISOString()
      };
      window.sessionStorage.setItem(CLIPBOARD_DRAFT_SESSION_KEY, JSON.stringify(payload));
    }, 200);

    return () => window.clearTimeout(timer);
  }, [
    attachments,
    body,
    destroyMode,
    disabledShare,
    manageFeatureEnabled,
    entryId,
    expiresAt,
    hasPassword,
    isManageMode,
    manageId,
    maxViews,
    password,
    shareId,
    showShareResult,
    title
  ]);

  useEffect(() => {
    hasRecordedRecentRef.current = false;
    setRecordRecentOnThisDevice(false);
  }, [shareId, shareUrl, manageUrl]);

  function updateTurnstileToken(token: string) {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }

  function shouldRequestTurnstileVerification(token = turnstileTokenRef.current) {
    return Boolean(TURNSTILE_SITE_KEY) && !isManageMode && !hasDraft && !token;
  }

  function getTurnstileDialogDescription(action: PendingTurnstileAction | null) {
    if (action?.type === 'publish') {
      return messages.turnstilePublishDescription;
    }
    if (action?.type === 'pick_files' || action?.type === 'upload_files') {
      return messages.turnstileUploadDescription;
    }
    return messages.turnstileContinueDescription;
  }

  function openTurnstileDialogForAction(action: PendingTurnstileAction) {
    setPendingTurnstileAction(action);
    setErrorText('');
    updateTurnstileToken('');
    setTurnstileWidgetKey((current) => current + 1);
    setIsTurnstileDialogOpen(true);
  }

  async function continuePendingTurnstileAction(action: PendingTurnstileAction | null) {
    if (!action) {
      return;
    }
    if (action.type === 'pick_files') {
      fileInputRef.current?.click();
      return;
    }
    if (action.type === 'upload_files') {
      await handleFilesSelected(action.files);
      return;
    }
    await handlePublish();
  }

  function handleTurnstileDialogOpenChange(open: boolean) {
    setIsTurnstileDialogOpen(open);
    if (!open) {
      setPendingTurnstileAction(null);
      updateTurnstileToken('');
    }
  }

  async function ensureDraft() {
    if (entryId && manageId && shareId) {
      return { entryId, manageId, shareId };
    }

    if (shouldRequestTurnstileVerification()) {
      throw new Error(messages.turnstileRequiredError);
    }

    const response = await axios.post(apiUrl(createClipboardEntryInitPath()), {
      turnstileToken: turnstileTokenRef.current
    }, {
      timeout: REQUEST_TIMEOUT_MS
    });
    const payload = response.data as { data?: { entryId: string; manageId: string; shareId: string } };
    if (!payload.data) {
      throw new Error(messages.draftInitFailed);
    }

    setEntryId(payload.data.entryId);
    setManageId(payload.data.manageId);
    setShareId(payload.data.shareId);
    return payload.data;
  }

  function updateUploadTask(taskId: string, updater: (task: UploadTask) => UploadTask) {
    setUploadTasks((current) => current.map((task) => (task.id === taskId ? updater(task) : task)));
  }

  function removeUploadTask(taskId: string) {
    setUploadTasks((current) => current.filter((task) => task.id !== taskId));
  }

  function getUploadFileKey(file: File) {
    return `${file.name}:${file.size}:${file.lastModified}`;
  }

  async function uploadAttachment(file: File) {
    if (!ensureManageContentMutable(messages.pickAttachments)) {
      return;
    }
    const uploadFileKey = getUploadFileKey(file);
    if (activeUploadKeysRef.current.has(uploadFileKey)) {
      return;
    }
    activeUploadKeysRef.current.add(uploadFileKey);

    const draft = await ensureDraft();
    const task = newUploadTask(file.name);
    setUploadTasks((current) => [task, ...current]);

    try {
      const initResponse = await axios.post(apiUrl(createClipboardEntryAttachmentInitPath(draft.entryId)), {
        manageId: draft.manageId,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        chunkSizeMb: DEFAULT_CHUNK_SIZE_MB
      }, {
        timeout: REQUEST_TIMEOUT_MS
      });
      const initPayload = initResponse.data as {
        data?: {
          upload?: {
            strategy: 'worker-proxy-r2' | 'presigned-r2';
            objectId: string;
            chunkSizeBytes: number;
            totalParts: number;
            uploadedPartIndexes: number[];
            partUploadUrls?: Array<string | null>;
          };
        };
      };
      const upload = initPayload.data?.upload;
      if (!upload) {
        throw new Error(messages.attachmentUploadInitFailed);
      }

      const progressByPart: Record<number, number> = {};
      for (const partIndex of upload.uploadedPartIndexes) {
        progressByPart[partIndex] = getPartSize(file.size, upload.chunkSizeBytes, partIndex);
      }

      const missingPartIndexes = Array.from({ length: upload.totalParts }, (_, index) => index)
        .filter((partIndex) => !upload.uploadedPartIndexes.includes(partIndex));

      const pushProgress = () => {
        const loaded = Object.values(progressByPart).reduce((sum, value) => sum + value, 0);
        updateUploadTask(task.id, (current) => ({
          ...current,
          percent: file.size > 0 ? Math.min(100, (loaded / file.size) * 100) : 100
        }));
      };

      await runWithConcurrency(missingPartIndexes, DEFAULT_UPLOAD_CONCURRENCY, async (partIndex) => {
        const start = partIndex * upload.chunkSizeBytes;
        const end = Math.min(file.size, start + upload.chunkSizeBytes);
        const blob = file.slice(start, end);
        progressByPart[partIndex] = 0;

        if (upload.strategy === 'presigned-r2') {
          const url = upload.partUploadUrls?.[partIndex];
          if (!url) {
            throw new Error(formatMessage(messages.missingPresignedUrl, { partIndex }));
          }
          await axios.put(url, blob, {
            headers: {
              'Content-Type': file.type || 'application/octet-stream'
            },
            timeout: REQUEST_TIMEOUT_MS,
            onUploadProgress: (event) => {
              progressByPart[partIndex] = Math.min(blob.size, event.loaded);
              pushProgress();
            }
          });
        } else {
          await axios.put(
            apiUrl(createClipboardEntryAttachmentPartPath(draft.entryId, upload.objectId, partIndex)),
            blob,
            {
              headers: {
                'Content-Type': file.type || 'application/octet-stream',
                'x-clipboard-manage-id': draft.manageId
              },
              timeout: REQUEST_TIMEOUT_MS,
              onUploadProgress: (event) => {
                progressByPart[partIndex] = Math.min(blob.size, event.loaded);
                pushProgress();
              }
            }
          );
        }

        progressByPart[partIndex] = blob.size;
        pushProgress();
      });

      const completeResponse = await axios.post(
        apiUrl(createClipboardEntryAttachmentCompletePath(draft.entryId, upload.objectId)),
        {
          manageId: draft.manageId,
          displayName: file.name
        },
        { timeout: REQUEST_TIMEOUT_MS }
      );
      const completePayload = completeResponse.data as { data?: { attachments?: ClipboardAttachment[] } };
      setAttachments(completePayload.data?.attachments ?? []);
      removeUploadTask(task.id);
    } catch (error) {
      updateUploadTask(task.id, (current) => ({
        ...current,
        status: 'error',
        errorText: toErrorMessage(error, messages.unknownError)
      }));
      throw error;
    } finally {
      activeUploadKeysRef.current.delete(uploadFileKey);
    }
  }

  async function handleFilesSelected(files: FileList | File[] | null) {
    if (!files || files.length === 0) {
      return;
    }
    if (shouldRequestTurnstileVerification()) {
      openTurnstileDialogForAction({
        type: 'upload_files',
        files: Array.from(files)
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setErrorText('');
    const incomingFiles = Array.from(files);
    const activeUploadingCount = uploadTasks.filter((task) => task.status === 'uploading').length;
    const remainingAttachmentSlots = CLIPBOARD_MAX_ATTACHMENTS - attachments.length - activeUploadingCount;
    if (remainingAttachmentSlots <= 0) {
      setErrorText(formatMessage(messages.maxAttachmentsReached, { max: CLIPBOARD_MAX_ATTACHMENTS }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    if (incomingFiles.length > remainingAttachmentSlots) {
      setErrorText(formatMessage(messages.remainingAttachmentSlotsError, {
        remaining: remainingAttachmentSlots,
        max: CLIPBOARD_MAX_ATTACHMENTS,
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    for (const file of incomingFiles) {
      if (file.size === 0) {
        setErrorText(formatMessage(messages.emptyAttachmentFile, { fileName: file.name }));
        continue;
      }
      try {
        await uploadAttachment(file);
      } catch (error) {
        setErrorText(toErrorMessage(error, messages.unknownError));
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handlePaste(event: ReactClipboardEvent<HTMLElement>) {
    const files = event.clipboardData?.files;
    if (!files || files.length === 0) {
      return;
    }
    if (shouldRequestTurnstileVerification()) {
      event.preventDefault();
      openTurnstileDialogForAction({
        type: 'upload_files',
        files: Array.from(files)
      });
      return;
    }
    event.preventDefault();
    void handleFilesSelected(files);
  }

  function hasDraggedFiles(event: ReactDragEvent<HTMLElement>) {
    return Array.from(event.dataTransfer.types).includes('Files');
  }

  function handleDropZoneDragEnter(event: ReactDragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }
    event.preventDefault();
    dropDepthRef.current += 1;
    setIsDropZoneActive(true);
  }

  function handleDropZoneDragOver(event: ReactDragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDropZoneActive(true);
  }

  function handleDropZoneDragLeave(event: ReactDragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }
    event.preventDefault();
    dropDepthRef.current = Math.max(0, dropDepthRef.current - 1);
    if (dropDepthRef.current === 0) {
      setIsDropZoneActive(false);
    }
  }

  function handleDropZoneDrop(event: ReactDragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }
    event.preventDefault();
    dropDepthRef.current = 0;
    setIsDropZoneActive(false);
    if (shouldRequestTurnstileVerification()) {
      openTurnstileDialogForAction({
        type: 'upload_files',
        files: Array.from(event.dataTransfer.files)
      });
      return;
    }
    void handleFilesSelected(event.dataTransfer.files);
  }

  async function updateAttachment(attachmentId: number, payload: { displayName?: string; sortOrder?: number }) {
    if (!ensureManageContentMutable(messages.renameAttachment)) {
      return null;
    }
    if (!manageId) {
      return null;
    }
    const response = await axios.patch(
      apiUrl(createClipboardManageAttachmentPath(manageId, attachmentId)),
      payload,
      { timeout: REQUEST_TIMEOUT_MS }
    );
    const result = response.data as { data?: { attachment?: ClipboardAttachment } };
    return result.data?.attachment ?? null;
  }

  function openRenameDialog(attachment: ClipboardAttachment) {
    if (!ensureManageContentMutable(messages.renameAttachment)) {
      return;
    }
    setRenamingAttachmentId(attachment.id);
    setRenamingAttachmentName(attachment.displayName);
    setIsRenameDialogOpen(true);
  }

  function handleRenameDialogOpenChange(open: boolean) {
    setIsRenameDialogOpen(open);
    if (!open) {
      setRenamingAttachmentId(null);
      setRenamingAttachmentName('');
    }
  }

  async function handleAttachmentRenameSave() {
    if (!renamingAttachment) {
      return;
    }
    const nextName = renamingAttachmentName.trim();
    if (!nextName || nextName === renamingAttachment.displayName) {
      handleRenameDialogOpenChange(false);
      return;
    }

    setIsUpdatingAttachmentId(renamingAttachment.id);
    try {
      const updatedAttachment = await updateAttachment(renamingAttachment.id, { displayName: nextName });
      if (updatedAttachment) {
        setAttachments((current) => current.map((item) => (
          item.id === updatedAttachment.id ? updatedAttachment : item
        )));
      }
      handleRenameDialogOpenChange(false);
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
    } finally {
      setIsUpdatingAttachmentId(null);
    }
  }

  function applySharePreset(presetId: SharePresetId) {
    if (presetId === 'expire_1d') {
      setDestroyMode('expire');
      setExpiresAt(getDateTimeAfterDays(1));
      setMaxViews('');
      return;
    }
    if (presetId === 'expire_7d') {
      setDestroyMode('expire');
      setExpiresAt(getDateTimeAfterDays(7));
      setMaxViews('');
      return;
    }
    if (presetId === 'expire_30d') {
      setDestroyMode('expire');
      setExpiresAt(getDateTimeAfterDays(MAX_EXPIRE_DAYS));
      setMaxViews('');
      return;
    }
    if (presetId === 'max_views_1') {
      setDestroyMode('max_views');
      setExpiresAt('');
      setMaxViews('1');
      return;
    }
    if (presetId === 'max_views_10') {
      setDestroyMode('max_views');
      setExpiresAt('');
      setMaxViews('10');
      return;
    }
    setDestroyMode('max_views');
    setExpiresAt('');
    setMaxViews('100');
  }

  function handleExpireDateSelect(date?: Date) {
    if (!date) {
      return;
    }
    setDestroyMode('expire');
    setMaxViews('');
    setExpiresAt((current) => mergeDateWithTime(date, getExpireTimeValue(current)));
  }

  function handleExpireTimeChange(value: string) {
    if (!value) {
      return;
    }
    setDestroyMode('expire');
    setMaxViews('');
    setExpiresAt((current) => {
      const baseDate = parseDateTimeLocalValue(current) ?? getNextValidExpireDateTime();
      return mergeDateWithTime(baseDate, value);
    });
  }

  function resetComposerForNewDraft() {
    setEntryId(null);
    setShareId(null);
    setManageId(null);
    setEntryStatus('draft');
    setTitle('');
    setBody('');
    setPassword('');
    setHasPassword(false);
    setExpiresAt(getDateTimeAfterDays(DEFAULT_EXPIRE_DAYS));
    setMaxViews('');
    setDestroyMode('expire');
    setDisabledShare(false);
    setAttachments([]);
    setUploadTasks([]);
    updateTurnstileToken('');
    setTurnstileWidgetKey((current) => current + 1);
    setPendingTurnstileAction(null);
    setIsTurnstileDialogOpen(false);
    setShareUrl('');
    setManageUrl('');
    setManageFeatureEnabled(false);
    setRecordRecentOnThisDevice(false);
    setIsDropZoneActive(false);
    setIsRenameDialogOpen(false);
    setRenamingAttachmentId(null);
    setRenamingAttachmentName('');
    setIsUpdatingAttachmentId(null);
    hasRecordedRecentRef.current = false;
  }

  function saveShareResultToRecentRecords(result: ShareResultState) {
    if (!result.shareId || !result.shareUrl || !result.manageUrl) {
      return;
    }
    const now = new Date().toISOString();
    const record: ClipboardRecentRecord = {
      shareId: result.shareId,
      shareUrl: result.shareUrl,
      manageUrl: result.manageUrl,
      title: title.trim() || messages.untitled,
      createdAt: now,
      manageEnabled: result.manageFeatureEnabled
    };
    upsertClipboardRecentRecord(record);
    hasRecordedRecentRef.current = true;
  }

  function handleRecentRecordToggle(checked: boolean) {
    setRecordRecentOnThisDevice(checked);
    if (!checked || hasRecordedRecentRef.current) {
      return;
    }
    if (isManageMode && currentShareResult) {
      saveShareResultToRecentRecords(currentShareResult);
    }
  }

  function ensureManageContentMutable(actionLabel: string) {
    if (!isManageContentLocked) {
      return true;
    }
    const statusText = entryStatus === 'deleted' ? messages.lockedStatusDeleted : messages.lockedStatusDestroyed;
    setErrorText(formatMessage(messages.lockedActionError, {
      status: statusText,
      action: actionLabel,
    }));
    return false;
  }

  function parseRequiredMaxViews() {
    if (destroyMode !== 'max_views') {
      return null;
    }
    const parsed = Number(maxViews);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error(messages.maxViewsPositiveIntegerError);
    }
    return parsed;
  }

  function validateContentPresence() {
    const hasTitle = title.trim().length > 0;
    const hasBody = body.trim().length > 0;
    const hasAttachments = attachments.length > 0;
    if (!hasTitle && !hasBody && !hasAttachments) {
      throw new Error(messages.contentRequiredError);
    }
  }

  function validateUploadsReadyForPublish() {
    const hasUploadingTasks = uploadTasks.some((task) => task.status === 'uploading');
    if (hasUploadingTasks) {
      throw new Error(messages.publishPendingUploadsError);
    }
  }

  function openExternalUrl(url: string) {
    if (!url) {
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function copyTextToClipboard(text: string, successText?: string) {
    try {
      await navigator.clipboard.writeText(text);
      if (successText) {
        toast.success(successText);
      }
      return true;
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
      return false;
    }
  }

  async function handleCopyManageUrl(url: string) {
    const copied = await copyTextToClipboard(url, messages.copiedManageUrl);
    if (copied) {
      toast.warning(messages.manageLinkRiskText);
    }
  }

  async function handlePublish() {
    try {
      validateContentPresence();
      validateUploadsReadyForPublish();
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
      return;
    }

    if (shouldRequestTurnstileVerification()) {
      openTurnstileDialogForAction({ type: 'publish' });
      return;
    }

    setIsSaving(true);
    setErrorText('');
    try {
      const normalizedMaxViews = parseRequiredMaxViews();
      const normalizedExpiresAt = destroyMode === 'expire'
        ? normalizeExpireAtInput(expiresAt, { enforceFuture: true })
        : '';
      if (destroyMode === 'expire' && !normalizedExpiresAt) {
        throw new Error(formatMessage(messages.publishExpireValidationError, { days: MAX_EXPIRE_DAYS }));
      }
      if (normalizedExpiresAt && normalizedExpiresAt !== expiresAt) {
        setExpiresAt(normalizedExpiresAt);
      }
      const draft = await ensureDraft();
      const response = await axios.post(apiUrl(createClipboardEntryPublishPath(draft.entryId)), {
        manageId: draft.manageId,
        locale,
        title,
        body,
        bodyFormat: 'plain_text',
        password: hasPassword ? password : '',
        expiresAt: normalizedExpiresAt ? new Date(normalizedExpiresAt).toISOString() : null,
        maxViews: normalizedMaxViews,
        destroyMode
      }, {
        timeout: REQUEST_TIMEOUT_MS
      });
      const payload = response.data as { data?: ClipboardPublishResponse };
      const result = payload.data;
      if (!result) {
        throw new Error(messages.publishFailed);
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const nextShareResult: ShareResultState = {
        shareId: result.shareId,
        shareUrl: origin + result.sharePath,
        manageUrl: origin + result.managePath,
        manageFeatureEnabled
      };
      if (recordRecentOnThisDevice) {
        saveShareResultToRecentRecords(nextShareResult);
      }
      setLastShareResult(nextShareResult);
      setIsShareResultOpen(true);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(CLIPBOARD_DRAFT_SESSION_KEY);
      }
      resetComposerForNewDraft();
      toast.success(messages.publishSuccess);
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteAttachment(attachment: ClipboardAttachment) {
    if (!ensureManageContentMutable(messages.deleteAttachment)) {
      return;
    }
    if (!manageId) {
      return;
    }

    try {
      await axios.delete(apiUrl(createClipboardManageAttachmentPath(manageId, attachment.id)), {
        timeout: REQUEST_TIMEOUT_MS
      });
      setAttachments((current) => current.filter((item) => item.id !== attachment.id));
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
    }
  }

  async function saveManageChanges() {
    if (!ensureManageContentMutable(messages.saveChanges)) {
      return false;
    }
    if (!manageId) {
      return false;
    }

    try {
      validateContentPresence();
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
      return false;
    }

    setIsSaving(true);
    setErrorText('');
    try {
      const normalizedMaxViews = parseRequiredMaxViews();
      const normalizedExpiresAt = destroyMode === 'expire'
        ? normalizeExpireAtInput(expiresAt, { enforceFuture: true })
        : '';
      if (destroyMode === 'expire' && !normalizedExpiresAt) {
        throw new Error(formatMessage(messages.publishExpireValidationError, { days: MAX_EXPIRE_DAYS }));
      }
      if (normalizedExpiresAt && normalizedExpiresAt !== expiresAt) {
        setExpiresAt(normalizedExpiresAt);
      }
      const nextPassword = password.trim();
      const payload: {
        title: string;
        body: string;
        bodyFormat: 'plain_text';
        clearPassword?: boolean;
        password?: string;
        expiresAt: string | null;
        maxViews: number | null;
        destroyMode: ShareExpiryMode;
        disabled: boolean;
      } = {
        title,
        body,
        bodyFormat: 'plain_text',
        expiresAt: normalizedExpiresAt ? new Date(normalizedExpiresAt).toISOString() : null,
        maxViews: normalizedMaxViews,
        destroyMode,
        disabled: disabledShare
      };
      if (!hasPassword) {
        payload.clearPassword = true;
      } else if (nextPassword) {
        payload.password = nextPassword;
      }
      await axios.patch(apiUrl(createClipboardManagePath(manageId)), payload, {
        timeout: REQUEST_TIMEOUT_MS
      });
      return true;
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveManageChanges() {
    await saveManageChanges();
  }

  async function handleDestroy() {
    if (!ensureManageContentMutable(messages.manualDestroy)) {
      return;
    }
    if (!manageId) {
      return;
    }

    try {
      await axios.post(apiUrl(createClipboardManageDestroyPath(manageId)), undefined, {
        timeout: REQUEST_TIMEOUT_MS
      });
      setEntryStatus('destroyed');
      setAttachments([]);
      setDisabledShare(true);
      setIsRenameDialogOpen(false);
      toast.success(messages.destroySuccess);
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
    }
  }

  async function handleDelete() {
    if (!ensureManageContentMutable(messages.deleteContent)) {
      return;
    }
    if (!manageId) {
      return;
    }

    try {
      await axios.delete(apiUrl(createClipboardManagePath(manageId)), {
        timeout: REQUEST_TIMEOUT_MS
      });
      setEntryStatus('deleted');
      setAttachments([]);
      setDisabledShare(true);
      setIsRenameDialogOpen(false);
      toast.success(messages.deleteSuccess);
    } catch (error) {
      setErrorText(toErrorMessage(error, messages.unknownError));
    }
  }

  function handleShareExpiryModeChange(nextMode: ShareExpiryMode) {
    setDestroyMode(nextMode);
    if (nextMode === 'expire') {
      setExpiresAt((current) => current || getDateTimeAfterDays(DEFAULT_EXPIRE_DAYS));
      setMaxViews('');
      return;
    }
    if (nextMode === 'max_views') {
      setExpiresAt('');
      setMaxViews((current) => current.trim() || DEFAULT_MAX_VIEWS);
    }
  }

  async function handleQrCodeCopyOrDownload() {
    if (!shareUrl || !qrCodeContainerRef.current) {
      return;
    }

    const svgElement = qrCodeContainerRef.current.querySelector('svg');
    if (!svgElement) {
      return;
    }

    const pngBlob = await createQrCodePngBlob(svgElement, messages);

    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
        throw new Error('clipboard-image-unsupported');
      }
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': pngBlob
        })
      ]);
    } catch {
      const downloadUrl = URL.createObjectURL(pngBlob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `clipboard-qrcode-${shareId ?? 'share'}.png`;
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
    }
  }

  return (
    <AppPageContainer
      variant="workspace"
      className="pb-24 lg:h-[calc(100dvh-57px)] lg:overflow-hidden lg:pb-0"
      onPaste={handlePaste}
    >
      {isLoading ? (
        <Alert>
          <Clock3 />
          <AlertTitle>{messages.loadingTitle}</AlertTitle>
          <AlertDescription>{messages.loadingDescription}</AlertDescription>
        </Alert>
      ) : null}

      {isManageContentLocked ? (
        <Alert>
          <Shield />
          <AlertTitle>{entryStatus === 'deleted' ? messages.deletedTitle : messages.destroyedTitle}</AlertTitle>
          <AlertDescription>
            {messages.lockedDescription}
          </AlertDescription>
        </Alert>
      ) : null}

      <WorkspaceSurface className="border-transparent bg-background shadow-none">
        <div className="grid h-full min-h-0 w-full items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_480px]">
            <Card className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-border/70 bg-card/90">
              <CardContent className="flex h-full min-h-0 flex-1 flex-col gap-4 p-3 sm:gap-6 sm:p-4 lg:p-5">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium">{messages.titleLabel}</label>
                  <Input
                    placeholder={messages.titlePlaceholder}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium">{messages.bodyLabel}</label>
                  <TextareaAutosize
                    cacheMeasurements
                    className="min-h-[180px] resize-none overflow-hidden sm:min-h-[220px] lg:min-h-[260px] lg:max-h-[55vh] lg:overflow-y-auto"
                    minRows={6}
                    placeholder={messages.bodyPlaceholder}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                </div>

                <div
                  className={cn(
                    'rounded-2xl border bg-background/50 p-4 transition-colors',
                    isDropZoneActive ? 'border-primary/60 bg-primary/5' : 'border-border/70'
                  )}
                  onDragEnter={handleDropZoneDragEnter}
                  onDragOver={handleDropZoneDragOver}
                  onDragLeave={handleDropZoneDragLeave}
                  onDrop={handleDropZoneDrop}
                >
                  <div className="flex items-center gap-2">
                    <Paperclip className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">{messages.attachmentsTitle}</h3>
                  </div>

                  <input
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    type="file"
                    onChange={(event) => { void handleFilesSelected(event.target.files); }}
                  />

                  <div className="mt-4 flex flex-col gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading || isManageContentLocked}
                      onClick={() => {
                        if (shouldRequestTurnstileVerification()) {
                          openTurnstileDialogForAction({ type: 'pick_files' });
                          return;
                        }
                        fileInputRef.current?.click();
                      }}
                    >
                      {messages.pickAttachments}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {formatMessage(messages.attachmentsHint, { max: CLIPBOARD_MAX_ATTACHMENTS })}
                    </p>

                    {uploadTasks.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {uploadTasks.map((task) => (
                          <div key={task.id} className="rounded-xl border border-border/70 bg-background/80 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{task.fileName}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{getUploadTaskStatusLabel(task.status, messages)}</p>
                              </div>
                              <span className="shrink-0 text-xs text-muted-foreground">{task.percent.toFixed(0)}%</span>
                            </div>
                            <Progress className="mt-3" value={task.percent} />
                            {task.errorText ? (
                              <p className="mt-2 text-xs text-destructive">{task.errorText}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                      <div className="flex flex-col gap-2">
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/80 px-3 py-3 sm:flex-row sm:items-center"
                          >
                            <div className="min-w-0 flex-1 space-y-2">
                              <p className="truncate text-sm font-medium">{attachment.displayName}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{bytesToDisplay(attachment.sizeBytes)}</p>
                            </div>
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full sm:w-auto"
                                disabled={isManageContentLocked || isUpdatingAttachmentId === attachment.id}
                                onClick={() => openRenameDialog(attachment)}
                              >
                                {messages.renameAttachment}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="w-full sm:w-auto" disabled={isManageContentLocked}>{messages.deleteAttachment}</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{messages.deleteAttachmentDialogTitle}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {formatMessage(messages.deleteAttachmentDialogDescription, { name: attachment.displayName })}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{messages.cancel}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => { void deleteAttachment(attachment); }}>
                                      {messages.confirmDelete}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex min-h-0 min-w-0 flex-col gap-4 lg:h-full lg:overflow-y-auto lg:pr-1">
              <div className="rounded-2xl border border-border/70 bg-card/90 p-4">
                <div className="flex items-center gap-2">
                  <Link2 className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">{messages.actionsTitle}</h3>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {isManageMode ? (
                    <>
                      <Button type="button" disabled={isLoading || isSaving || isManageContentLocked} onClick={() => { void handleSaveManageChanges(); }}>
                        {isSaving ? messages.savingChanges : messages.saveChanges}
                      </Button>

                      {showShareResult ? (
                        <Button type="button" variant="outline" onClick={() => setIsShareResultOpen(true)}>
                          {messages.viewShareResult}
                        </Button>
                      ) : null}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="outline" disabled={isManageContentLocked}>{messages.manualDestroy}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{messages.manualDestroyDialogTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {messages.manualDestroyDialogDescription}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{messages.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { void handleDestroy(); }}>
                              {messages.confirmDestroy}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="outline" disabled={isManageContentLocked}>{messages.deleteContent}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{messages.deleteContentDialogTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {messages.deleteContentDialogDescription}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{messages.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { void handleDelete(); }}>
                              {messages.confirmDelete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        className="hidden lg:inline-flex"
                        disabled={isSaving || isLoading}
                        onClick={() => { void handlePublish(); }}
                      >
                        {isSaving ? messages.publishing : messages.publish}
                      </Button>

                      <div className="mt-1 flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                        <div className="min-w-0">
                          <label className="text-sm font-medium text-foreground" htmlFor="share-manage-feature-switch">
                            {messages.manageFeatureTitle}
                          </label>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {messages.manageFeatureDescription}
                          </p>
                        </div>
                        <Switch
                          id="share-manage-feature-switch"
                          checked={manageFeatureEnabled}
                          onCheckedChange={setManageFeatureEnabled}
                        />
                      </div>

                      <div className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{messages.saveRecentTitle}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {messages.saveRecentDescription}
                          </p>
                        </div>
                        <Switch checked={recordRecentOnThisDevice} onCheckedChange={handleRecentRecordToggle} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {isManageMode ? (
                <div className="rounded-2xl border border-border/70 bg-card/90 p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{messages.statsBadge}</Badge>
                    <h3 className="text-sm font-medium">{messages.currentContentTitle}</h3>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                      <p className="text-xs text-muted-foreground">{messages.attachmentOpenCount}</p>
                      <p className="mt-1 text-lg font-semibold">{manageStats.attachmentOpenCount}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                      <p className="text-xs text-muted-foreground">{messages.attachmentDownloadCount}</p>
                      <p className="mt-1 text-lg font-semibold">{manageStats.attachmentDownloadCount}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-border/70 bg-card/90 p-4">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">{messages.shareSettingsTitle}</h3>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">{messages.passwordLabel}</label>
                    <div className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                      <div className="min-w-0">
                        <label className="text-sm font-medium text-foreground" htmlFor="share-password-switch">
                          {messages.passwordSwitchLabel}
                        </label>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {messages.passwordSwitchDescription}
                        </p>
                      </div>
                      <Switch
                        id="share-password-switch"
                        checked={hasPassword}
                        onCheckedChange={setHasPassword}
                      />
                    </div>
                    <Input
                      disabled={!hasPassword}
                      placeholder={messages.passwordPlaceholder}
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">{messages.presetsLabel}</label>
                    <div className="grid gap-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{messages.presetsExpireLabel}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {sharePresets.slice(0, 3).map((preset) => (
                            <Button
                              key={preset.id}
                              type="button"
                              variant="outline"
                              className={cn(
                                'justify-center',
                                activeSharePresetId === preset.id
                                  ? 'border-primary/40 bg-background text-foreground hover:bg-background'
                                  : ''
                              )}
                              onClick={() => applySharePreset(preset.id)}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{messages.presetsViewsLabel}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {sharePresets.slice(3).map((preset) => (
                            <Button
                              key={preset.id}
                              type="button"
                              variant="outline"
                              className={cn(
                                'justify-center',
                                activeSharePresetId === preset.id
                                  ? 'border-primary/40 bg-background text-foreground hover:bg-background'
                                  : ''
                              )}
                              onClick={() => applySharePreset(preset.id)}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">{messages.shareValidForLabel}</label>
                    <RadioGroup
                      value={destroyMode}
                      onValueChange={(value) => handleShareExpiryModeChange(value as ShareExpiryMode)}
                      className="gap-2"
                    >
                      {shareExpiryOptions.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-3 transition-colors',
                            destroyMode === option.value ? 'border-primary/40 bg-background' : 'hover:bg-background/80'
                          )}
                        >
                          <RadioGroupItem value={option.value} className="mt-0.5 border-white/30 text-primary" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{option.title}</p>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  {destroyMode === 'expire' ? (
                    <div className="flex flex-col gap-3">
                      <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                        <label className="text-sm font-medium text-foreground" htmlFor="share-expire-at">
                          {messages.expireAtLabel}
                        </label>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {formatMessage(messages.expireAtDescription, { days: MAX_EXPIRE_DAYS })}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-medium text-muted-foreground" htmlFor="share-expire-at">
                            {messages.dateLabel}
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="share-expire-at"
                                type="button"
                                variant="outline"
                                className={cn(
                                  'h-10 w-full justify-start text-left font-normal',
                                  !selectedExpireDate ? 'text-muted-foreground' : ''
                                )}
                              >
                                <Clock3 data-icon="inline-start" />
                                {formatExpireDateDisplay(expiresAt, messages.datePlaceholder)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedExpireDate ?? undefined}
                                onSelect={handleExpireDateSelect}
                                disabled={(date) => (
                                  date < startOfDay(new Date()) ||
                                  date > startOfDay(getMaxExpireDate())
                                )}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-medium text-muted-foreground" htmlFor="share-expire-time">
                            {messages.timeLabel}
                          </label>
                          <Input
                            id="share-expire-time"
                            type="time"
                            step="60"
                            value={expireTimeValue}
                            min={minExpireTimeValue}
                            onChange={(event) => handleExpireTimeChange(event.target.value)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {messages.expireMustBeFuture}
                      </p>
                    </div>
                  ) : null}

                  {destroyMode === 'max_views' ? (
                    <div className="flex flex-col gap-3">
                      <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                        <label className="text-sm font-medium text-foreground" htmlFor="share-max-views">
                          {messages.maxViewsLabel}
                        </label>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {messages.maxViewsDescription}
                        </p>
                      </div>
                      <Input
                        id="share-max-views"
                        inputMode="numeric"
                        placeholder={messages.maxViewsPlaceholder}
                        value={maxViews}
                        onChange={(event) => setMaxViews(event.target.value)}
                      />
                    </div>
                  ) : null}

                  {isManageMode ? (
                    <div className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-3">
                      <div className="min-w-0">
                        <label className="text-sm font-medium text-foreground" htmlFor="share-disabled-switch">
                          {messages.disablePublicShareLabel}
                        </label>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {messages.disablePublicShareDescription}
                        </p>
                      </div>
                      <Switch
                        id="share-disabled-switch"
                        checked={disabledShare}
                        onCheckedChange={setDisabledShare}
                      />
                    </div>
                  ) : null
                  }
                </div>
              </div>

            </div>
        </div>
      </WorkspaceSurface>

      {!isManageMode ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sm:px-6 backdrop-blur lg:hidden">
          <div className="mx-auto flex w-full max-w-[92rem]">
            <Button
              type="button"
              className="h-11 w-full"
              disabled={isSaving || isLoading}
              onClick={() => { void handlePublish(); }}
            >
              {isSaving ? messages.publishing : messages.publish}
            </Button>
          </div>
        </div>
      ) : null}

      {activeShareResult ? (
        <Dialog
          open={isShareResultOpen}
          onOpenChange={(open) => {
            setIsShareResultOpen(open);
            if (!open && !isManageMode) {
              setLastShareResult(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-3xl overflow-hidden border-border/70 bg-card p-0 sm:w-full">
            <DialogHeader className="border-b border-border/70 px-3 py-2.5 text-left sm:px-4 sm:py-3">
              <div className="flex items-center gap-2">
                <Link2 className="size-4 text-muted-foreground" />
                <DialogTitle>{messages.shareResultTitle}</DialogTitle>
              </div>
              {!isManageMode ? (
                <DialogDescription className="pt-1 text-xs text-muted-foreground">
                  {messages.shareResultDescription}
                </DialogDescription>
              ) : null}
            </DialogHeader>

            <div className="overflow-y-auto px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_216px]">
                <div className="flex flex-col gap-2">
                  {(isManageMode || activeShareResult.manageFeatureEnabled) ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={() => openExternalUrl(activeShareResult.manageUrl)}
                      >
                        {messages.openManagePage}
                      </Button>
                    </div>
                  ) : null}

                  <div className="rounded-lg border border-border/70 bg-background/70 p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <KeyRound className="size-4" />
                        <span>{messages.shareCodeLabel}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={() => navigator.clipboard.writeText(activeShareResult.shareId)}
                      >
                        {messages.copy}
                      </Button>
                    </div>
                    <p className="mt-1.5 font-mono text-2xl font-semibold sm:text-3xl">
                      {activeShareResult.shareId}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="rounded-lg border border-border/70 bg-background/70 p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-muted-foreground">{messages.publicShareLinkLabel}</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={() => navigator.clipboard.writeText(activeShareResult.shareUrl)}
                        >
                          {messages.copy}
                        </Button>
                      </div>
                      <p className="mt-1 break-all text-sm leading-5">{activeShareResult.shareUrl}</p>
                    </div>

                    {(isManageMode || activeShareResult.manageFeatureEnabled) ? (
                      <div className="rounded-lg border border-border/70 bg-background/70 p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-muted-foreground">{messages.privateManageLinkLabel}</p>
                        </div>
                        <div className="mt-2 flex items-start justify-between gap-2">
                          <p className="min-w-0 flex-1 break-all text-sm leading-5">{activeShareResult.manageUrl}</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-8 px-3 text-xs"
                            onClick={() => { void handleCopyManageUrl(activeShareResult.manageUrl); }}
                          >
                            {messages.copy}
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-amber-400/90">{messages.manageLinkRiskText}</p>
                      </div>
                    ) : null}
                  </div>

                </div>

                <div className="rounded-lg border border-border/70 bg-background/70 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <QrCode className="size-4 text-muted-foreground" />
                      <span>{messages.shareQrCodeLabel}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => { void handleQrCodeCopyOrDownload(); }}
                    >
                      {messages.copy}
                    </Button>
                  </div>
                  <div ref={qrCodeContainerRef} className="mt-2 flex justify-center">
                    <QRCodeSVG size={184} value={activeShareResult.shareUrl} />
                  </div>
                </div>
              </div>
            </div>

          </DialogContent>
        </Dialog>
      ) : null}

      <Dialog open={isRenameDialogOpen} onOpenChange={handleRenameDialogOpenChange}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-md border-border/70 bg-card sm:w-full">
          <DialogHeader className="text-left">
            <DialogTitle>{messages.renameDialogTitle}</DialogTitle>
            <DialogDescription>
              {messages.renameDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="rename-attachment-input">
              {messages.attachmentNameLabel}
            </label>
            <Input
              id="rename-attachment-input"
              autoFocus
              value={renamingAttachmentName}
              onChange={(event) => setRenamingAttachmentName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleAttachmentRenameSave();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleRenameDialogOpenChange(false)}>
              {messages.cancel}
            </Button>
            <Button
              type="button"
              disabled={!renamingAttachment || isUpdatingAttachmentId === renamingAttachmentId}
              onClick={() => { void handleAttachmentRenameSave(); }}
            >
              {isUpdatingAttachmentId === renamingAttachmentId ? messages.saving : messages.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTurnstileDialogOpen} onOpenChange={handleTurnstileDialogOpenChange}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-md border-border/70 bg-card sm:w-full">
          <DialogHeader className="text-left">
            <DialogTitle>{messages.turnstileDialogTitle}</DialogTitle>
            <DialogDescription>
              {getTurnstileDialogDescription(pendingTurnstileAction)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-3">
              <TurnstileWidget
                key={turnstileWidgetKey}
                onVerify={(token) => {
                  const nextAction = pendingTurnstileAction;
                  updateTurnstileToken(token);
                  setErrorText('');
                  setPendingTurnstileAction(null);
                  setIsTurnstileDialogOpen(false);
                  void continuePendingTurnstileAction(nextAction);
                }}
                onExpire={() => {
                  updateTurnstileToken('');
                  setTurnstileWidgetKey((current) => current + 1);
                }}
              />
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {messages.turnstileSuccessDescription}
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleTurnstileDialogOpenChange(false)}>
              {messages.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppPageContainer>
  );
}
