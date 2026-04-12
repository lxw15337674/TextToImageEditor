'use client';

import { Clock3, Link2, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Locale } from '@/i18n/config';
import { formatMessage } from '@/i18n/format';
import { getMessages } from '@/linkdisk/i18n/messages';
import {
  clearClipboardRecentRecords,
  CLIPBOARD_RECENT_RECORD_LIMIT,
  formatCompactDateTime,
  readClipboardRecentRecords,
  removeClipboardRecentRecord,
  type ClipboardRecentRecord
} from '@/linkdisk/lib/clipboard';

export function ClipboardRecentPage({ locale }: { locale: Locale }) {
  const [records, setRecords] = useState<ClipboardRecentRecord[]>([]);
  const messages = getMessages(locale).recent;

  useEffect(() => {
    setRecords(readClipboardRecentRecords());
  }, []);

  function openExternalUrl(url: string) {
    if (!url) {
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard write failures silently on this local utility page.
    }
  }

  function handleClearAll() {
    clearClipboardRecentRecords();
    setRecords([]);
  }

  function handleRemoveRecord(shareId: string) {
    setRecords(removeClipboardRecentRecord(shareId));
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-6 lg:h-[calc(100dvh-57px)] lg:overflow-hidden">
      <Card className="flex h-full min-h-0 w-full flex-1 border-transparent bg-background">
        <CardContent className="flex h-full min-h-0 w-full flex-col gap-4 p-4 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold">{messages.title}</h1>
            <span className="text-xs text-muted-foreground">
              {formatMessage(messages.limitLabel, { limit: CLIPBOARD_RECENT_RECORD_LIMIT })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {records.length > 0 ? (
              <Button type="button" variant="outline" onClick={handleClearAll}>
                {messages.clearAll}
              </Button>
            ) : null}
          </div>

          {records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card/90 p-6">
              <p className="text-sm text-muted-foreground">{messages.emptyState}</p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
              {records.map((record) => {
                const manageEnabled = Boolean(record.manageEnabled);
                return (
                  <div key={record.shareId} className="rounded-2xl border border-border/70 bg-card/90 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{record.title || messages.untitled}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock3 className="size-3.5" />
                          {formatCompactDateTime(record.createdAt)}
                        </p>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={() => handleRemoveRecord(record.shareId)}>
                        <Trash2 className="size-3.5" />
                        {messages.delete}
                      </Button>
                    </div>

                    <div className="mt-3 rounded-xl border border-border/70 bg-background/60 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Link2 className="size-3.5" />
                        {messages.shareLinkLabel}
                      </div>
                      <p className="mt-1 break-all text-sm">{record.shareUrl}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => openExternalUrl(record.shareUrl)}>
                          {messages.openShare}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => { void copyText(record.shareUrl); }}>
                          {messages.copyShare}
                        </Button>
                      </div>
                    </div>

                    {manageEnabled ? (
                      <div className="mt-3 rounded-xl border border-border/70 bg-background/60 p-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Shield className="size-3.5" />
                          {messages.manageLinkLabel}
                        </div>
                        <p className="mt-1 break-all text-sm">{record.manageUrl}</p>
                        <p className="mt-2 text-xs text-amber-400/90">{messages.manageLinkRiskText}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openExternalUrl(record.manageUrl)}
                          >
                            {messages.openManage}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => { void copyText(record.manageUrl); }}
                          >
                            {messages.copyManage}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
