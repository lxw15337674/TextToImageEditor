'use client';

import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClipboardSharePath,
  createClipboardShareVerifyPasswordPath
} from '@linkdisk/shared';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Locale } from '@/i18n/config';
import { formatMessage } from '@/i18n/format';
import { getMessages } from '@/linkdisk/i18n/messages';
import {
  apiUrl,
  buildShareAccessStorageKey,
  buildShareSessionAccessStorageKey,
  bytesToDisplay,
  resolveClipboardAttachmentMediaKind,
  type ClipboardShareResponse,
  formatCompactDateTime,
  REQUEST_TIMEOUT_MS
} from '@/linkdisk/lib/clipboard';

function toErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | undefined;
    return payload?.message ?? error.message;
  }
  return error instanceof Error ? error.message : fallback;
}

function getStatusText(status: string, messages: ReturnType<typeof getMessages>['share']) {
  switch (status) {
    case 'published':
      return messages.statusLabels.published;
    case 'expired':
      return messages.statusLabels.expired;
    case 'destroyed':
      return messages.statusLabels.destroyed;
    case 'disabled':
      return messages.statusLabels.disabled;
    case 'deleted':
      return messages.statusLabels.deleted;
    case 'loading':
      return messages.loadingStatus;
    default:
      return status || messages.statusLabels.unknown;
  }
}

function getMediaKindLabel(mimeType: string, messages: ReturnType<typeof getMessages>['share']) {
  const mediaKind = resolveClipboardAttachmentMediaKind(mimeType);
  switch (mediaKind) {
    case 'image':
      return messages.mediaKindLabels.image;
    case 'video':
      return messages.mediaKindLabels.video;
    case 'audio':
      return messages.mediaKindLabels.audio;
    case 'pdf':
      return messages.mediaKindLabels.pdf;
    case 'text':
      return messages.mediaKindLabels.text;
    default:
      return messages.mediaKindLabels.other;
  }
}

export function ClipboardSharePage({
  locale,
  shareId
}: {
  locale: Locale;
  shareId: string;
}) {
  const messages = getMessages(locale).share;
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.sessionStorage.getItem(buildShareAccessStorageKey(shareId));
    const sessionStored = window.sessionStorage.getItem(buildShareSessionAccessStorageKey(shareId));
    if (stored || sessionStored) {
      setAccessToken(sessionStored || stored || '');
    }
  }, [shareId]);

  const shareQuery = useQuery({
    queryKey: ['clipboard-share', shareId, accessToken],
    queryFn: async () => {
      const response = await axios.get(apiUrl(createClipboardSharePath(shareId)), {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        timeout: REQUEST_TIMEOUT_MS
      });
      const payload = response.data as { data?: ClipboardShareResponse };
      if (!payload.data) {
        throw new Error(messages.missingShareError);
      }
      return payload.data;
    }
  });

  const shareData = shareQuery.data;
  const canShowBody = Boolean(shareData && !shareData.requiresPassword && shareData.status === 'published');
  const visibleShareData = canShowBody ? shareData : null;

  useEffect(() => {
    if (!shareData?.accessToken) {
      return;
    }
    setAccessToken(shareData.accessToken);
    if (typeof window === 'undefined') {
      return;
    }
    const sessionKey = buildShareSessionAccessStorageKey(shareId);
    if (shareData.accessToken.startsWith('sess_')) {
      window.sessionStorage.setItem(sessionKey, shareData.accessToken);
    } else {
      window.sessionStorage.removeItem(sessionKey);
    }
    const clearSessionToken = () => window.sessionStorage.removeItem(sessionKey);
    window.addEventListener('beforeunload', clearSessionToken);
    return () => {
      window.removeEventListener('beforeunload', clearSessionToken);
    };
  }, [shareData?.accessToken, shareId]);

  async function handleVerifyPassword() {
    if (!password.trim()) {
      setPasswordError(messages.passwordRequiredError);
      return;
    }
    setIsVerifying(true);
    setPasswordError('');
    try {
      const response = await axios.post(
        apiUrl(createClipboardShareVerifyPasswordPath(shareId)),
        { password: password.trim() },
        { timeout: REQUEST_TIMEOUT_MS }
      );
      const token = (response.data as { data?: { accessToken?: string | null } }).data?.accessToken;
      if (!token) {
        throw new Error(messages.verifyTokenMissingError);
      }
      setAccessToken(token);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(buildShareAccessStorageKey(shareId), token);
      }
      await queryClient.invalidateQueries({ queryKey: ['clipboard-share', shareId] });
    } catch (error) {
      setPasswordError(toErrorMessage(error, messages.unknownError));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleAttachmentDownload(attachment: NonNullable<ClipboardShareResponse['attachments']>[number]) {
    setAttachmentError('');
    setDownloadingAttachmentId(attachment.id);
    try {
      const response = await axios.get(attachment.downloadUrl, {
        responseType: 'blob',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        timeout: REQUEST_TIMEOUT_MS
      });
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data as BlobPart]);
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = attachment.displayName;
      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setAttachmentError(toErrorMessage(error, messages.unknownError));
    } finally {
      setDownloadingAttachmentId(null);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{shareData?.title || messages.defaultTitle}</CardTitle>
                <Badge variant={shareData?.status === 'published' ? 'default' : 'secondary'}>
                  {getStatusText(shareData?.status ?? 'loading', messages)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {shareQuery.isLoading ? (
            <div className="rounded-md border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{messages.loading}</div>
          ) : null}

          {shareQuery.error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {toErrorMessage(shareQuery.error, messages.unknownError)}
            </div>
          ) : null}

          {shareData?.requiresPassword ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{messages.passwordCardTitle}</CardTitle>
                <CardDescription>{messages.passwordCardDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder={messages.passwordPlaceholder}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button type="button" disabled={isVerifying} onClick={() => { void handleVerifyPassword(); }}>
                  {isVerifying ? messages.verifyingPassword : messages.verifyPassword}
                </Button>
              </CardContent>
              {passwordError ? (
                <div className="px-6 pb-6 text-sm text-destructive">{passwordError}</div>
              ) : null}
            </Card>
          ) : null}

          {shareData && !shareData.requiresPassword && shareData.status !== 'published' ? (
            <div className="rounded-md border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {formatMessage(messages.unavailableStatusNotice, {
                status: getStatusText(shareData.status, messages),
              })}
            </div>
          ) : null}

          {visibleShareData ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
              <Card className="border-border/70 bg-background/80">
                <CardHeader>
                  <CardTitle className="text-base">{messages.bodyTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
                    {visibleShareData.body || messages.emptyBody}
                  </pre>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-border/70 bg-background/80">
                  <CardHeader>
                    <CardTitle className="text-base">{messages.infoTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                      <span className="text-muted-foreground">{messages.viewCountLabel}</span>
                      <span>{visibleShareData.share?.viewCount ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                      <span className="text-muted-foreground">{messages.maxViewsLabel}</span>
                      <span>{visibleShareData.share?.maxViews ?? messages.unlimited}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                      <span className="text-muted-foreground">{messages.expiresAtLabel}</span>
                      <span>{formatCompactDateTime(visibleShareData.share?.expiresAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                      <span className="text-muted-foreground">{messages.destroyModeLabel}</span>
                      <span>
                        {{
                          expire: messages.destroyModeLabels.expire,
                          max_views: messages.destroyModeLabels.maxViews,
                          manual: messages.destroyModeLabels.manual,
                          none: messages.destroyModeLabels.none,
                          first_view: messages.destroyModeLabels.firstView,
                        }[visibleShareData.share?.destroyMode ?? 'none'] ?? messages.destroyModeLabels.unknown}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          {visibleShareData ? (
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">{messages.attachmentsTitle}</CardTitle>
                <CardDescription>
                  {visibleShareData.attachments?.length ? messages.attachmentsAvailableDescription : messages.attachmentsEmptyDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attachmentError ? (
                  <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {attachmentError}
                  </div>
                ) : null}
                {visibleShareData.attachments?.length ? (
                  <div className="rounded-md border border-border/70 bg-background/70">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{messages.attachmentNameHeader}</TableHead>
                          <TableHead>{messages.attachmentSizeHeader}</TableHead>
                          <TableHead>{messages.attachmentTypeHeader}</TableHead>
                          <TableHead>{messages.attachmentStatusHeader}</TableHead>
                          <TableHead className="text-right">{messages.attachmentActionHeader}</TableHead>
                        </TableRow>
                      </TableHeader>
                        <TableBody>
                        {visibleShareData.attachments.map((attachment) => {
                          return (
                            <TableRow key={attachment.id}>
                              <TableCell className="max-w-[320px] truncate">{attachment.displayName}</TableCell>
                              <TableCell>{bytesToDisplay(attachment.sizeBytes)}</TableCell>
                              <TableCell>{getMediaKindLabel(attachment.mimeType, messages)}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{messages.downloadOnlyBadge}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={downloadingAttachmentId === attachment.id}
                                  onClick={() => {
                                    void handleAttachmentDownload(attachment);
                                  }}
                                >
                                  {downloadingAttachmentId === attachment.id ? messages.downloading : messages.download}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
