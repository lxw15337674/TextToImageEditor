'use client';

import { history, historyKeymap, redo, redoDepth, undo, undoDepth } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { EditorSelection } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Download, History, Import, LoaderCircle, PencilLine, Redo2, RotateCcw, Share2, Undo2 } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  buildMarkdownExport,
  buildPlainTextExport,
  createTimestampedFilename,
  createDocumentSignature,
  createManualMilestoneLabel,
  createSnapshotSignature,
  formatTimestamp,
  normalizeImportedDocument,
  parseMarkdownImport,
  parsePlainTextImport,
  POSTER_DIMENSIONS,
  PRESET_RESOLUTIONS,
  summarizeContent,
} from '@/lib/editor/markdown';
import { PosterCanvas, renderPosterBlob } from '@/lib/editor/poster';
import {
  createVersionFromDocument,
  deleteVersion,
  duplicateVersionAsMilestone,
  EDITOR_DOCUMENT_ID,
  getOrCreateDocument,
  listVersions,
  saveDocument,
  trimAutoSnapshots,
  updateVersionLabel,
} from '@/lib/editor/store';
import type { EditorDocument, EditorVersion, ExportResolution, ExportTemplate, ExportTheme, SaveStatus, VersionKind } from '@/lib/editor/types';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { cn } from '@/lib/utils';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
});

type MobilePane = 'editor' | 'preview';

const DEFAULT_AUTO_SNAPSHOT_IDLE_MS = 15_000;
const MIN_AUTO_SNAPSHOT_INTERVAL_MS = 120_000;

const VERSION_KIND_STYLES: Record<VersionKind, string> = {
  auto: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  milestone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  'import-backup': 'border-amber-500/30 bg-amber-500/10 text-amber-100',
  'rollback-backup': 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-100',
};

function getVersionKindLabel(kind: VersionKind, messages: ReturnType<typeof getMessages>['notes']) {
  switch (kind) {
    case 'milestone':
      return messages.versionKindMilestone;
    case 'import-backup':
      return messages.versionKindImportBackup;
    case 'rollback-backup':
      return messages.versionKindRollbackBackup;
    default:
      return messages.versionKindAuto;
  }
}

function getSaveStatusLabel(status: SaveStatus, messages: ReturnType<typeof getMessages>['notes']) {
  switch (status) {
    case 'saving':
      return messages.statusSaving;
    case 'saved':
      return messages.statusSaved;
    default:
      return messages.statusEditing;
  }
}

function createDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function createTextDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  createDownload(blob, filename);
}

export function MarkdownPosterEditor({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).notes;
  const { resolvedTheme } = useTheme();
  const editorViewRef = useRef<EditorView | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const previewZoomUrlRef = useRef<string | null>(null);
  const lastPersistedSignatureRef = useRef('');
  const lastVersionSignatureRef = useRef('');
  const lastAutoSnapshotAtRef = useRef(0);
  const latestDocumentSignatureRef = useRef('');

  const [documentState, setDocumentState] = useState<EditorDocument | null>(null);
  const [versions, setVersions] = useState<EditorVersion[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>('editor');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState('');
  const [isPosterOverflowing, setIsPosterOverflowing] = useState(false);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  const previewContent = useDeferredValue(documentState?.content ?? '');
  const previewTheme = documentState?.exportTheme;
  const previewResolution = documentState?.exportResolution;
  const previewTemplate = documentState?.exportTemplate;

  const editorExtensions = useMemo(
    () => [markdown(), history(), EditorView.lineWrapping, keymap.of(historyKeymap)],
    [],
  );

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add('notes-scroll-lock');
    body.classList.add('notes-scroll-lock');

    return () => {
      html.classList.remove('notes-scroll-lock');
      body.classList.remove('notes-scroll-lock');
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadEditorState() {
      try {
        const nextDocument = await getOrCreateDocument();
        const nextVersions = await listVersions(EDITOR_DOCUMENT_ID);

        if (!active) {
          return;
        }

        setDocumentState(nextDocument);
        setVersions(nextVersions);
        setIsHydrated(true);
        setSaveStatus('saved');

        const signature = createDocumentSignature(nextDocument);
        lastPersistedSignatureRef.current = signature;
        latestDocumentSignatureRef.current = signature;
        lastVersionSignatureRef.current = nextVersions[0] ? createSnapshotSignature({ content: nextVersions[0].contentSnapshot }) : createSnapshotSignature(nextDocument);
        lastAutoSnapshotAtRef.current = nextVersions.find((version) => version.kind === 'auto')?.createdAt ?? 0;
      } catch (error) {
        console.error(error);
        toast.error(messages.loadError);
      }
    }

    void loadEditorState();

    return () => {
      active = false;
    };
  }, [messages.loadError]);

  useEffect(() => {
    if (!documentState) {
      return;
    }

    latestDocumentSignatureRef.current = createDocumentSignature(documentState);
  }, [documentState]);

  useEffect(() => {
    return () => {
      if (previewZoomUrlRef.current) {
        URL.revokeObjectURL(previewZoomUrlRef.current);
        previewZoomUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!previewTheme || !previewResolution || !previewTemplate) {
      return;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      try {
        const blob = await renderPosterBlob(
          previewContent,
          previewTheme,
          previewResolution,
          previewTemplate,
          1,
          1,
        );
        const nextUrl = URL.createObjectURL(blob);

        if (!active) {
          URL.revokeObjectURL(nextUrl);
          return;
        }

        const previousUrl = previewZoomUrlRef.current;
        previewZoomUrlRef.current = nextUrl;
        setPreviewZoomUrl(nextUrl);

        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
      } catch (error) {
        if (active) {
          console.error(error);
        }
      }
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [
    previewContent,
    previewResolution,
    previewTemplate,
    previewTheme,
  ]);

  useEffect(() => {
    if (!documentState || !isHydrated) {
      return;
    }

    const nextSignature = createDocumentSignature(documentState);

    if (nextSignature === lastPersistedSignatureRef.current) {
      return;
    }

    setSaveStatus('dirty');

    const timeout = window.setTimeout(async () => {
      const signatureBeingSaved = nextSignature;
      setSaveStatus('saving');

      try {
        const savedDocument = await saveDocument(documentState);
        lastPersistedSignatureRef.current = signatureBeingSaved;

        setDocumentState((currentDocument) => {
          if (!currentDocument) {
            return currentDocument;
          }

          return {
            ...currentDocument,
            updatedAt: savedDocument.updatedAt,
            lastSavedAt: savedDocument.lastSavedAt,
          };
        });

        setSaveStatus(latestDocumentSignatureRef.current === signatureBeingSaved ? 'saved' : 'dirty');
      } catch (error) {
        console.error(error);
        setSaveStatus('dirty');
        toast.error(messages.saveError);
      }
    }, 800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [documentState, isHydrated, messages.saveError]);

  useEffect(() => {
    if (!documentState || !isHydrated) {
      return;
    }

    const snapshotSignature = createSnapshotSignature(documentState);

    if (snapshotSignature === lastVersionSignatureRef.current) {
      return;
    }

    const remainingInterval = Math.max(
      DEFAULT_AUTO_SNAPSHOT_IDLE_MS,
      MIN_AUTO_SNAPSHOT_INTERVAL_MS - (Date.now() - lastAutoSnapshotAtRef.current),
    );

    const timeout = window.setTimeout(async () => {
      if (!documentState.content.trim()) {
        return;
      }

      const currentSignature = createSnapshotSignature(documentState);

      if (currentSignature === lastVersionSignatureRef.current) {
        return;
      }

      try {
        await createVersionFromDocument(documentState, 'auto');
        await trimAutoSnapshots();
        const nextVersions = await listVersions(EDITOR_DOCUMENT_ID);
        startTransition(() => setVersions(nextVersions));
        lastVersionSignatureRef.current = currentSignature;
        lastAutoSnapshotAtRef.current = Date.now();
      } catch (error) {
        console.error(error);
        toast.error(messages.versionError);
      }
    }, remainingInterval);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [documentState, isHydrated, messages.versionError]);

  useEffect(() => {
    function persistOnUnload() {
      if (!documentState) {
        return;
      }

      const nextSignature = createDocumentSignature(documentState);

      if (nextSignature === lastPersistedSignatureRef.current) {
        return;
      }

      void saveDocument(documentState);
    }

    window.addEventListener('beforeunload', persistOnUnload);
    return () => {
      window.removeEventListener('beforeunload', persistOnUnload);
    };
  }, [documentState]);

  useEffect(() => {
    let frameA = 0;
    let frameB = 0;

    const measureOverflow = () => {
      const body = previewFrameRef.current?.querySelector<HTMLElement>('[data-poster-body]');
      setIsPosterOverflowing(body ? body.scrollHeight > body.clientHeight + 1 : false);
    };

    const scheduleMeasure = () => {
      frameA = window.requestAnimationFrame(() => {
        frameB = window.requestAnimationFrame(measureOverflow);
      });
    };

    scheduleMeasure();
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [
    mobilePane,
    previewContent,
    documentState?.exportResolution,
    documentState?.exportTemplate,
    documentState?.exportTheme,
  ]);

  function syncHistoryDepth(view: EditorView) {
    setCanUndo(undoDepth(view.state) > 0);
    setCanRedo(redoDepth(view.state) > 0);
  }

  async function refreshVersions() {
    const nextVersions = await listVersions(EDITOR_DOCUMENT_ID);
    startTransition(() => setVersions(nextVersions));
  }

  async function persistNow(nextDocument: EditorDocument) {
    setSaveStatus('saving');
    const savedDocument = await saveDocument(nextDocument);
    lastPersistedSignatureRef.current = createDocumentSignature(savedDocument);
    latestDocumentSignatureRef.current = createDocumentSignature(savedDocument);
    setDocumentState(savedDocument);
    setSaveStatus('saved');
    return savedDocument;
  }

  function handleDocumentChange<K extends keyof EditorDocument>(key: K, value: EditorDocument[K]) {
    setDocumentState((currentDocument) => {
      if (!currentDocument) {
        return currentDocument;
      }

      return {
        ...currentDocument,
        [key]: value,
      };
    });
  }

  function handleUndo() {
    if (!editorViewRef.current) {
      return;
    }

    undo(editorViewRef.current);
    syncHistoryDepth(editorViewRef.current);
  }

  function handleRedo() {
    if (!editorViewRef.current) {
      return;
    }

    redo(editorViewRef.current);
    syncHistoryDepth(editorViewRef.current);
  }

  async function handleCreateMilestone() {
    if (!documentState) {
      return;
    }

    try {
      await createVersionFromDocument(documentState, 'milestone', createManualMilestoneLabel());
      lastVersionSignatureRef.current = createSnapshotSignature(documentState);
      await refreshVersions();
      toast.success(messages.milestoneSaved);
    } catch (error) {
      console.error(error);
      toast.error(messages.versionError);
    }
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile || !documentState) {
      return;
    }

    setIsBusy(true);

    try {
      await createVersionFromDocument(documentState, 'import-backup', messages.versionKindImportBackup);
      const content = await selectedFile.text();
      const nextContent = selectedFile.name.toLowerCase().endsWith('.md') ? parseMarkdownImport(content) : parsePlainTextImport(content);
      const nextDocument = normalizeImportedDocument(documentState, nextContent);
      const savedDocument = await persistNow(nextDocument);
      lastVersionSignatureRef.current = createSnapshotSignature(savedDocument);
      await refreshVersions();
      toast.success(messages.importSuccess);
    } catch (error) {
      console.error(error);
      toast.error(messages.importError);
    } finally {
      event.target.value = '';
      setIsBusy(false);
    }
  }

  function handleExportMarkdown() {
    if (!documentState) {
      return;
    }

    createTextDownload(createTimestampedFilename('md'), buildMarkdownExport(documentState.content), 'text/markdown;charset=utf-8');
    toast.success(messages.exportMarkdownSuccess);
  }

  function handleExportPlainText() {
    if (!documentState) {
      return;
    }

    createTextDownload(createTimestampedFilename('txt'), buildPlainTextExport(documentState.content), 'text/plain;charset=utf-8');
    toast.success(messages.exportTextSuccess);
  }

  async function handleRestoreVersion(version: EditorVersion) {
    if (!documentState) {
      return;
    }

    setIsBusy(true);

    try {
      await createVersionFromDocument(documentState, 'rollback-backup', messages.versionKindRollbackBackup);
      const savedDocument = await persistNow({
        ...documentState,
        content: version.contentSnapshot,
      });
      lastVersionSignatureRef.current = createSnapshotSignature(savedDocument);
      await refreshVersions();
      setIsHistoryOpen(false);
      toast.success(messages.restoreSuccess);
    } catch (error) {
      console.error(error);
      toast.error(messages.versionError);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDuplicateAsMilestone(version: EditorVersion) {
    try {
      await duplicateVersionAsMilestone(version, version.label ?? createManualMilestoneLabel());
      await refreshVersions();
      toast.success(messages.milestoneSaved);
    } catch (error) {
      console.error(error);
      toast.error(messages.versionError);
    }
  }

  async function handleDeleteAutoVersion(versionId: string) {
    try {
      await deleteVersion(versionId);
      await refreshVersions();
    } catch (error) {
      console.error(error);
      toast.error(messages.versionError);
    }
  }

  async function handleSaveVersionLabel(versionId: string) {
    try {
      await updateVersionLabel(versionId, editingLabelValue.trim() || null);
      setEditingLabelId(null);
      setEditingLabelValue('');
      await refreshVersions();
      toast.success(messages.versionLabelSaved);
    } catch (error) {
      console.error(error);
      toast.error(messages.versionError);
    }
  }

  async function exportPosterImage(shareInsteadOfDownload: boolean) {
    if (!documentState) {
      return;
    }

    setIsBusy(true);

    try {
      const blob = await renderPosterBlob(
        documentState.content,
        documentState.exportTheme,
        documentState.exportResolution,
        documentState.exportTemplate,
        1,
        1,
      );

      const file = new File([blob], createTimestampedFilename('png'), { type: 'image/png' });

      if (shareInsteadOfDownload) {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
          });

          toast.success(messages.shareSuccess);
        } else {
          createDownload(blob, file.name);
          toast.info(messages.shareFallback);
        }
      } else {
        createDownload(blob, file.name);
        toast.success(messages.exportImagesSuccessOne);
      }
    } catch (error) {
      console.error(error);
      toast.error(shareInsteadOfDownload ? messages.shareError : messages.exportImageError);
    } finally {
      setIsBusy(false);
    }
  }

  if (!documentState) {
    return (
      <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        <Card className="w-full border-border/70">
          <CardContent className="flex min-h-[16rem] items-center justify-center gap-3 p-6 text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
            <span>{messages.loadingDocument}</span>
          </CardContent>
        </Card>
      </main>
    );
  }

  const resolutionOptions = PRESET_RESOLUTIONS[documentState.exportPreset];
  const dimensions = POSTER_DIMENSIONS[documentState.exportResolution];
  const posterPreviewScale = Math.min(1, 420 / dimensions.width);
  return (
    <>
      <input ref={fileInputRef} type="file" accept=".md,.txt,text/plain,text/markdown" className="hidden" onChange={handleImportFile} />

      <main className="mx-auto flex min-h-0 w-full max-w-[92rem] flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        <Card className="flex min-h-0 w-full flex-1 border-border/70">
          <CardContent className="flex min-h-0 w-full flex-1 flex-col p-0">
            <div className="border-b border-border/60 px-4 py-3 xl:hidden">
              <div className="inline-flex rounded-full border border-border/70 bg-background/80 p-1">
                <button
                  type="button"
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm transition-colors',
                    mobilePane === 'editor' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                  )}
                  onClick={() => setMobilePane('editor')}
                >
                  {messages.mobileEditorTab}
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm transition-colors',
                    mobilePane === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                  )}
                  onClick={() => setMobilePane('preview')}
                >
                  {messages.mobilePreviewTab}
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 xl:grid-cols-2">
              <div className={cn('flex min-h-0 flex-col xl:border-r xl:border-border/60', mobilePane === 'preview' ? 'hidden xl:flex' : 'flex')}>
                <div className="border-b border-border/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="px-4 pt-4 text-sm font-medium text-muted-foreground">{messages.editorCardTitle}</div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-sm text-muted-foreground">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          saveStatus === 'saved' ? 'bg-emerald-400' : saveStatus === 'saving' ? 'bg-amber-400' : 'bg-sky-400',
                        )}
                      />
                      {getSaveStatusLabel(saveStatus, messages)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 px-4 pb-4 pt-4">
                    <Button type="button" variant="outline" className="gap-2" onClick={handleUndo} disabled={!canUndo || isBusy}>
                      <Undo2 className="size-4" />
                      {messages.undo}
                    </Button>
                    <Button type="button" variant="outline" className="gap-2" onClick={handleRedo} disabled={!canRedo || isBusy}>
                      <Redo2 className="size-4" />
                      {messages.redo}
                    </Button>
                    <Button type="button" variant="outline" className="gap-2" onClick={() => void handleCreateMilestone()} disabled={isBusy}>
                      <RotateCcw className="size-4" />
                      {messages.saveMilestone}
                    </Button>
                    <Button type="button" variant="outline" className="gap-2" onClick={() => setIsHistoryOpen(true)} disabled={isBusy}>
                      <History className="size-4" />
                      {messages.history}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="gap-2" disabled={isBusy}>
                          <Import className="size-4" />
                          {messages.fileMenu}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>{messages.fileMenu}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>{messages.importFile}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleExportMarkdown}>{messages.exportMarkdown}</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPlainText}>{messages.exportText}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="border-b border-border/60 px-4 py-3 text-sm font-medium text-muted-foreground">{messages.editorBodyLabel}</div>
                <div className="markdown-editor min-h-[16rem] flex-1 overflow-y-auto xl:min-h-0">
                  <CodeMirror
                    value={documentState.content}
                    theme={resolvedTheme === 'dark' ? oneDark : 'light'}
                    basicSetup={{
                      lineNumbers: false,
                      foldGutter: false,
                      highlightActiveLineGutter: false,
                    }}
                    extensions={editorExtensions}
                    onChange={(value, viewUpdate) => {
                      handleDocumentChange('content', value);
                      syncHistoryDepth(viewUpdate.view);
                    }}
                    onCreateEditor={(view) => {
                      editorViewRef.current = view;
                      syncHistoryDepth(view);
                      view.dispatch({
                        selection: EditorSelection.cursor(documentState.content.length),
                      });
                    }}
                    editable={!isBusy}
                  />
                </div>
              </div>

              <div className={cn('flex min-h-0 flex-col', mobilePane === 'editor' ? 'hidden xl:flex' : 'flex')}>
                <div className="border-b border-border/60">
                  <div className="px-4 pt-4 text-sm font-medium text-muted-foreground">{messages.previewCardTitle}</div>

                  <div className="grid gap-4 px-4 pb-4 pt-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{messages.exportTemplateLabel}</label>
                      <Select value={documentState.exportTemplate} onValueChange={(value) => handleDocumentChange('exportTemplate', value as ExportTemplate)}>
                        <SelectTrigger>
                          <SelectValue placeholder={messages.exportTemplateLabel} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xiaohongshu">{messages.templateXiaohongshu}</SelectItem>
                          <SelectItem value="image-background">{messages.templateImageBackground}</SelectItem>
                          <SelectItem value="spotify">{messages.templateSpotify}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium">{messages.exportThemeLabel}</div>
                      <RadioGroup
                        value={documentState.exportTheme}
                        onValueChange={(value) => handleDocumentChange('exportTheme', value as ExportTheme)}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
                          <RadioGroupItem value="light" id="export-theme-light" />
                          {messages.exportThemeLight}
                        </label>
                        <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
                          <RadioGroupItem value="dark" id="export-theme-dark" />
                          {messages.exportThemeDark}
                        </label>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid gap-4 border-t border-border/60 px-4 py-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{messages.exportPresetLabel}</label>
                      <Select
                        value={documentState.exportPreset}
                        onValueChange={(value) => {
                          const preset = value as EditorDocument['exportPreset'];
                          handleDocumentChange('exportPreset', preset);
                          handleDocumentChange('exportResolution', PRESET_RESOLUTIONS[preset][0]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={messages.exportPresetLabel} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">1:1</SelectItem>
                          <SelectItem value="3:4">3:4</SelectItem>
                          <SelectItem value="9:16">9:16</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{messages.exportResolutionLabel}</label>
                      <Select value={documentState.exportResolution} onValueChange={(value) => handleDocumentChange('exportResolution', value as ExportResolution)}>
                        <SelectTrigger>
                          <SelectValue placeholder={messages.exportResolutionLabel} />
                        </SelectTrigger>
                        <SelectContent>
                          {resolutionOptions.map((resolution) => (
                            <SelectItem key={resolution} value={resolution}>
                              {resolution}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4">
                    <p className="text-sm leading-6 text-muted-foreground">{messages.exportHint.replace('{size}', `${dimensions.width}×${dimensions.height}`)}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" className="gap-2" disabled={isBusy} onClick={() => void exportPosterImage(true)}>
                        {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Share2 className="size-4" />}
                        {messages.shareImage}
                      </Button>
                      <Button type="button" className="gap-2" disabled={isBusy} onClick={() => void exportPosterImage(false)}>
                        {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
                        {messages.exportImage}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-background/30">
                  <div className="flex min-h-full flex-col gap-0">
                    <div className="w-full border-b border-border/60 bg-background/70 shadow-sm">
                      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-muted-foreground">
                        <span>{messages.exportPreviewLabel}</span>
                        <span>{dimensions.width}×{dimensions.height}</span>
                      </div>

                      <Zoom
                        a11yNameButtonUnzoom={messages.previewZoomCloseLabel}
                        a11yNameButtonZoom={messages.previewZoomOpenLabel}
                        classDialog="poster-preview-zoom-dialog"
                        isDisabled={!previewZoomUrl}
                        zoomMargin={24}
                      >
                        <div
                          className={cn(
                            'relative overflow-auto bg-muted/30',
                            previewZoomUrl ? 'cursor-zoom-in' : 'cursor-default',
                          )}
                        >
                          <div
                            className="mx-auto"
                            style={{
                              width: dimensions.width * posterPreviewScale,
                              height: dimensions.height * posterPreviewScale,
                            }}
                          >
                            <div
                              ref={previewFrameRef}
                              style={{
                                transform: `scale(${posterPreviewScale})`,
                                transformOrigin: 'top left',
                                width: dimensions.width,
                                height: dimensions.height,
                              }}
                            >
                              <PosterCanvas
                                markdown={previewContent}
                                theme={documentState.exportTheme}
                                resolution={documentState.exportResolution}
                                template={documentState.exportTemplate}
                                pageIndex={1}
                                pageCount={1}
                              />
                            </div>
                          </div>

                          {previewZoomUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={messages.exportPreviewLabel}
                              className="absolute inset-0 h-full w-full rounded-[1.5rem] object-fill opacity-0"
                              draggable={false}
                              src={previewZoomUrl}
                            />
                          ) : null}
                        </div>
                      </Zoom>
                    </div>

                    {isPosterOverflowing ? (
                      <div className="w-full border-t border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
                        {messages.overflowWarning}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden p-0">
          <DialogHeader className="border-b border-border/60 px-6 py-5">
            <DialogTitle>{messages.historyTitle}</DialogTitle>
            <DialogDescription>{messages.historyDescription}</DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            {versions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 px-4 py-8 text-sm text-muted-foreground">
                {messages.emptyHistory}
              </div>
            ) : (
              <div className="grid gap-3">
                {versions.map((version) => (
                  <div key={version.id} className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', VERSION_KIND_STYLES[version.kind])}>
                            {getVersionKindLabel(version.kind, messages)}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatTimestamp(version.createdAt)}</span>
                        </div>

                        {editingLabelId === version.id ? (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Input value={editingLabelValue} onChange={(event) => setEditingLabelValue(event.target.value)} placeholder={messages.versionLabelPlaceholder} />
                            <div className="flex gap-2">
                              <Button type="button" size="sm" onClick={() => void handleSaveVersionLabel(version.id)}>
                                {messages.saveVersionLabel}
                              </Button>
                              <Button type="button" size="sm" variant="outline" onClick={() => setEditingLabelId(null)}>
                                {messages.cancel}
                              </Button>
                            </div>
                          </div>
                        ) : version.label ? (
                          <div className="text-sm font-medium text-foreground">{version.label}</div>
                        ) : null}

                        <div className="text-sm leading-6 text-muted-foreground">{summarizeContent(version.contentSnapshot) || messages.emptyVersionSummary}</div>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <Button type="button" size="sm" onClick={() => void handleRestoreVersion(version)} disabled={isBusy}>
                          {messages.restoreVersion}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => void handleDuplicateAsMilestone(version)} disabled={isBusy}>
                          {messages.saveAsMilestone}
                        </Button>
                        {version.kind === 'milestone' ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingLabelId(version.id);
                              setEditingLabelValue(version.label ?? '');
                            }}
                          >
                            <PencilLine className="size-4" />
                            {messages.renameMilestone}
                          </Button>
                        ) : null}
                        {version.kind === 'auto' ? (
                          <Button type="button" size="sm" variant="outline" onClick={() => void handleDeleteAutoVersion(version.id)}>
                            {messages.deleteVersion}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
