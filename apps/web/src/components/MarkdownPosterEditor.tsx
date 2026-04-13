'use client';

import { history, historyKeymap, redo, redoDepth, undo, undoDepth } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { EditorSelection } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Download, FolderOpen, History, Import, LoaderCircle, Redo2, RotateCcw, Share2, Undo2 } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TemplateSelector, type TemplateSelectorOption } from '@/components/TemplateSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AppPageContainer, WorkspaceSurface } from '@/components/app-page-shell';
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
  summarizeContent,
} from '@/lib/editor/markdown';
import {
  MAX_POSTER_HEIGHT,
  renderPosterBlob,
  renderPosterHtml,
  resolvePosterLayout,
  resolvePosterPreviewLayout,
} from '@/lib/editor/poster';
import {
  createDefaultDocument,
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
import type { ContentFormat, EditorDocument, EditorVersion, PosterFontSize, SaveStatus, VersionKind } from '@/lib/editor/types';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { cn } from '@/lib/utils';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
});

type MobilePane = 'editor' | 'preview';

const DOCUMENT_AUTOSAVE_IDLE_MS = 1_000;
const AUTO_SNAPSHOT_IDLE_MS = 120_000;
const AUTO_SNAPSHOT_ACTIVE_INTERVAL_MS = 600_000;

const VERSION_KIND_STYLES: Record<VersionKind, string> = {
  auto: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  milestone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  'import-backup': 'border-amber-500/30 bg-amber-500/10 text-amber-100',
  'rollback-backup': 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-100',
  'reset-backup': 'border-rose-500/30 bg-rose-500/10 text-rose-100',
};

function getVersionKindLabel(kind: VersionKind, messages: ReturnType<typeof getMessages>['notes']) {
  switch (kind) {
    case 'milestone':
      return messages.versionKindMilestone;
    case 'import-backup':
      return messages.versionKindImportBackup;
    case 'rollback-backup':
      return messages.versionKindRollbackBackup;
    case 'reset-backup':
      return messages.versionKindResetBackup;
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

async function convertBlobToJpegBlob(blob: Blob, quality = 0.92) {
  const imageBitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const context = canvas.getContext('2d');

  if (!context) {
    imageBitmap.close();
    throw new Error('Canvas context unavailable.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(imageBitmap, 0, 0);
  imageBitmap.close();

  const jpegBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((nextBlob) => resolve(nextBlob), 'image/jpeg', quality);
  });

  if (!jpegBlob) {
    throw new Error('JPEG conversion failed.');
  }

  return jpegBlob;
}

export function MarkdownPosterEditor({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).notes;
  const { resolvedTheme } = useTheme();
  const editorViewRef = useRef<EditorView | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewZoomUrlRef = useRef<string | null>(null);
  const lastPersistedSignatureRef = useRef('');
  const lastVersionSignatureRef = useRef('');
  const lastAutoSnapshotAtRef = useRef(0);
  const latestDocumentSignatureRef = useRef('');

  const [documentState, setDocumentState] = useState<EditorDocument | null>(null);
  const [versions, setVersions] = useState<EditorVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
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
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const previewContent = useDeferredValue(documentState?.content ?? '');
  const previewTemplate = documentState?.exportTemplate;
  const previewFontSizePreset = documentState?.fontSizePreset ?? 'medium';
  const contentFormat = documentState?.contentFormat ?? 'plain';
  const isPlainTextMode = contentFormat === 'plain';

  const baseEditorExtensions = useMemo(() => [history(), EditorView.lineWrapping, keymap.of(historyKeymap)], []);
  const editorExtensions = useMemo(
    () => (isPlainTextMode ? baseEditorExtensions : [markdown(), ...baseEditorExtensions]),
    [baseEditorExtensions, isPlainTextMode],
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
    if (!previewTemplate) {
      return;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      try {
        const layout = await resolvePosterPreviewLayout(
          previewContent,
          contentFormat,
          previewTemplate,
          previewFontSizePreset,
        );

        if (!active) {
          return;
        }

        setPreviewHeight(layout.height);
        setIsPosterOverflowing(layout.isClipped);

        const blob = await renderPosterBlob(
          previewContent,
          contentFormat,
          previewTemplate,
          previewFontSizePreset,
          1,
          1,
          layout.height,
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
    contentFormat,
    previewFontSizePreset,
    previewTemplate,
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
    }, DOCUMENT_AUTOSAVE_IDLE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [documentState, isHydrated, messages.saveError]);

  useEffect(() => {
    if (!documentState || !isHydrated) {
      return;
    }

    const currentDocument = documentState;
    const snapshotSignature = createSnapshotSignature(currentDocument);

    if (snapshotSignature === lastVersionSignatureRef.current) {
      return;
    }

    let cancelled = false;

    async function createAutoSnapshot() {
      if (cancelled || !currentDocument.content.trim()) {
        return;
      }

      const currentSignature = createSnapshotSignature(currentDocument);

      if (currentSignature === lastVersionSignatureRef.current) {
        return;
      }

      try {
        await createVersionFromDocument(currentDocument, 'auto');
        await trimAutoSnapshots();
        lastVersionSignatureRef.current = currentSignature;
        lastAutoSnapshotAtRef.current = Date.now();

        if (isHistoryOpen) {
          await refreshVersions();
        }
      } catch (error) {
        console.error(error);
        toast.error(messages.versionError);
      }
    }

    const elapsedSinceLastAutoSnapshot = Date.now() - lastAutoSnapshotAtRef.current;
    const activeDelay = Math.max(0, AUTO_SNAPSHOT_ACTIVE_INTERVAL_MS - elapsedSinceLastAutoSnapshot);

    const activeTimeout = window.setTimeout(() => {
      void createAutoSnapshot();
    }, activeDelay);

    const idleTimeout = window.setTimeout(() => {
      void createAutoSnapshot();
    }, AUTO_SNAPSHOT_IDLE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(activeTimeout);
      window.clearTimeout(idleTimeout);
    };
  }, [documentState, isHistoryOpen, isHydrated, messages.versionError]);

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
    if (!isHistoryOpen) {
      return;
    }

    void refreshVersions();
  }, [isHistoryOpen]);

  useEffect(() => {
    if (!isHistoryOpen) {
      return;
    }

    if (versions.length === 0) {
      setSelectedVersionId(null);
      return;
    }

    setSelectedVersionId((currentId) => {
      if (currentId && versions.some((version) => version.id === currentId)) {
        return currentId;
      }

      const firstVersion = versions[0];
      return firstVersion ? firstVersion.id : null;
    });
  }, [isHistoryOpen, versions]);

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
      await createVersionFromDocument(documentState, 'milestone', createManualMilestoneLabel(messages.milestoneLabelPrefix, locale));
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
      const nextContentFormat: ContentFormat = selectedFile.name.toLowerCase().endsWith('.md') ? 'markdown' : 'plain';
      const nextContent = nextContentFormat === 'markdown' ? parseMarkdownImport(content) : parsePlainTextImport(content);
      const nextDocument = normalizeImportedDocument(documentState, nextContent, nextContentFormat);
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

  async function handleExportHtml() {
    if (!documentState) {
      return;
    }

    setIsBusy(true);

    try {
      const layout = await resolvePosterLayout(
        documentState.content,
        documentState.contentFormat,
        documentState.exportTemplate,
        documentState.fontSizePreset,
        MAX_POSTER_HEIGHT,
      );

      const html = await renderPosterHtml(
        documentState.content,
        documentState.contentFormat,
        documentState.exportTemplate,
        documentState.fontSizePreset,
        1,
        1,
        layout.height,
      );

      createTextDownload(createTimestampedFilename('html'), html, 'text/html;charset=utf-8');
      toast.success(messages.exportHtmlSuccess);
    } catch (error) {
      console.error(error);
      toast.error(messages.exportHtmlError);
    } finally {
      setIsBusy(false);
    }
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
      await duplicateVersionAsMilestone(
        version,
        version.label ?? createManualMilestoneLabel(messages.milestoneLabelPrefix, locale),
      );
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

  function handleHistoryOpenChange(open: boolean) {
    setIsHistoryOpen(open);

    if (!open) {
      setEditingLabelId(null);
      setEditingLabelValue('');
    }
  }

  async function handleResetNote() {
    if (!documentState) {
      return;
    }

    setIsBusy(true);

    try {
      await createVersionFromDocument(documentState, 'reset-backup', messages.versionKindResetBackup);
      const savedDocument = await persistNow({
        ...createDefaultDocument(),
        id: documentState.id,
      });
      lastVersionSignatureRef.current = createSnapshotSignature(savedDocument);
      await refreshVersions();
      setIsResetDialogOpen(false);
      toast.success(messages.resetSuccess);
    } catch (error) {
      console.error(error);
      toast.error(messages.resetError);
    } finally {
      setIsBusy(false);
    }
  }

  async function exportPosterImage(shareInsteadOfDownload: boolean) {
    if (!documentState) {
      return;
    }

    setIsBusy(true);

    try {
      const layout = await resolvePosterLayout(
        documentState.content,
        documentState.contentFormat,
        documentState.exportTemplate,
        documentState.fontSizePreset,
        MAX_POSTER_HEIGHT,
      );

      setPreviewHeight(layout.height);
      setIsPosterOverflowing(layout.isClipped);

      const blob = await renderPosterBlob(
        documentState.content,
        documentState.contentFormat,
        documentState.exportTemplate,
        documentState.fontSizePreset,
        1,
        1,
        layout.height,
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

  async function exportPosterJpeg() {
    if (!documentState) {
      return;
    }

    setIsBusy(true);

    try {
      const layout = await resolvePosterLayout(
        documentState.content,
        documentState.contentFormat,
        documentState.exportTemplate,
        documentState.fontSizePreset,
        MAX_POSTER_HEIGHT,
      );

      setPreviewHeight(layout.height);
      setIsPosterOverflowing(layout.isClipped);

      const pngBlob = await renderPosterBlob(
        documentState.content,
        documentState.contentFormat,
        documentState.exportTemplate,
        documentState.fontSizePreset,
        1,
        1,
        layout.height,
      );

      const jpegBlob = await convertBlobToJpegBlob(pngBlob);
      createDownload(jpegBlob, createTimestampedFilename('jpg'));
      toast.success(messages.exportJpegSuccess);
    } catch (error) {
      console.error(error);
      toast.error(messages.exportJpegError);
    } finally {
      setIsBusy(false);
    }
  }

  if (!documentState) {
    return (
      <AppPageContainer variant="workspace" width="content">
        <Card className="w-full border-border/70">
          <CardContent className="flex min-h-[16rem] items-center justify-center gap-3 p-6 text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
            <span>{messages.loadingDocument}</span>
          </CardContent>
        </Card>
      </AppPageContainer>
    );
  }

  const dimensions = POSTER_DIMENSIONS;
  const effectivePreviewHeight = previewHeight ?? dimensions.height;
  const posterPreviewScale = Math.min(1, 420 / dimensions.width);
  const selectedVersion = versions.find((version) => version.id === selectedVersionId) ?? null;
  const templateOptions: TemplateSelectorOption[] = [
    { value: 'calendar-essay-light', label: `${messages.templateCalendarEssay} · ${messages.exportThemeLight}`, aliases: ['calendar essay', 'chronicle'] },
    { value: 'calendar-essay-dark', label: `${messages.templateCalendarEssay} · ${messages.exportThemeDark}`, aliases: ['calendar essay', 'chronicle'] },
    { value: 'xiaohongshu-light', label: `${messages.templateXiaohongshu} · ${messages.exportThemeLight}`, aliases: ['xiaohongshu', 'crimson'] },
    { value: 'xiaohongshu-dark', label: `${messages.templateXiaohongshu} · ${messages.exportThemeDark}`, aliases: ['xiaohongshu', 'crimson'] },
    { value: 'spotify-light', label: `${messages.templateSpotify} · ${messages.exportThemeLight}`, aliases: ['spotify', 'vibe'] },
    { value: 'spotify-dark', label: `${messages.templateSpotify} · ${messages.exportThemeDark}`, aliases: ['spotify', 'vibe'] },
    { value: 'ocean-quote-light', label: `${messages.templateOceanQuote} · ${messages.exportThemeLight}`, aliases: ['ocean quote', 'azure'] },
    { value: 'ocean-quote-dark', label: `${messages.templateOceanQuote} · ${messages.exportThemeDark}`, aliases: ['ocean quote', 'azure'] },
    { value: 'editorial-card-light', label: `${messages.templateEditorialCard} · ${messages.exportThemeLight}`, aliases: ['editorial card', 'ink'] },
    { value: 'editorial-card-dark', label: `${messages.templateEditorialCard} · ${messages.exportThemeDark}`, aliases: ['editorial card', 'ink'] },
    { value: 'cinema-book-light', label: `${messages.templateCinemaBook} · ${messages.exportThemeLight}`, aliases: ['cinema book', 'cinema'] },
    { value: 'cinema-book-dark', label: `${messages.templateCinemaBook} · ${messages.exportThemeDark}`, aliases: ['cinema book', 'cinema'] },
    { value: 'code-snippet-light', label: `${messages.templateCodeSnippet} · ${messages.exportThemeLight}`, aliases: ['code snippet', 'kernel'] },
    { value: 'code-snippet-dark', label: `${messages.templateCodeSnippet} · ${messages.exportThemeDark}`, aliases: ['code snippet', 'kernel'] },
    { value: 'ticket-stub-light', label: `${messages.templateTicketStub} · ${messages.exportThemeLight}`, aliases: ['ticket stub', 'entry'] },
    { value: 'ticket-stub-dark', label: `${messages.templateTicketStub} · ${messages.exportThemeDark}`, aliases: ['ticket stub', 'entry'] },
    { value: 'zen-vertical-light', label: `${messages.templateZenVertical} · ${messages.exportThemeLight}`, aliases: ['zen vertical', 'zen'] },
    { value: 'zen-vertical-dark', label: `${messages.templateZenVertical} · ${messages.exportThemeDark}`, aliases: ['zen vertical', 'zen'] },
    { value: 'news-flash-light', label: `${messages.templateNewsFlash} · ${messages.exportThemeLight}`, aliases: ['news flash', 'herald'] },
    { value: 'news-flash-dark', label: `${messages.templateNewsFlash} · ${messages.exportThemeDark}`, aliases: ['news flash', 'herald'] },
    { value: 'polaroid-light', label: `${messages.templatePolaroid} · ${messages.exportThemeLight}`, aliases: ['polaroid'] },
    { value: 'polaroid-dark', label: `${messages.templatePolaroid} · ${messages.exportThemeDark}`, aliases: ['polaroid'] },
    { value: 'literature-light', label: `${messages.templateLiterature} · ${messages.exportThemeLight}`, aliases: ['literature'] },
    { value: 'literature-dark', label: `${messages.templateLiterature} · ${messages.exportThemeDark}`, aliases: ['literature'] },
  ];

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".md,.txt,text/plain,text/markdown" className="hidden" onChange={handleImportFile} />

      <AppPageContainer variant="workspace" className="py-8 sm:py-10">
        <WorkspaceSurface>
          <div className="flex w-full flex-1 flex-col">
            <div className="border-b border-border/60 px-3 py-3 xl:hidden">
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

            <div className="flex flex-1 flex-col xl:grid xl:min-h-0 xl:grid-cols-2">
              <div
                className={cn(
                  'flex flex-col xl:min-h-0 xl:border-r xl:border-border/60',
                  mobilePane === 'preview' ? 'hidden xl:flex' : 'flex',
                )}
              >
                <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border/40 bg-background/95 px-3 py-3 backdrop-blur-md sm:px-4 xl:h-14 xl:flex-row xl:items-center xl:justify-between xl:gap-4 xl:rounded-tl-[calc(var(--radius)-1px)] xl:px-5 xl:py-0">
                  <div className="flex min-w-0 items-center justify-start gap-2 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1 sm:pb-0">
                    <span className="text-sm font-black tracking-[0.14em] uppercase opacity-50 shrink-0 mr-2">{messages.editorCardTitle}</span>
                      <Separator orientation="vertical" className="mx-1 hidden h-5 opacity-20 sm:block" />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 shrink-0 gap-2 rounded-xl border border-transparent px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:px-3 xl:rounded-md xl:border-transparent"
                        onClick={() => setIsHistoryOpen(true)}
                        disabled={isBusy}
                      >
                        <History className="size-[18px]" data-icon="inline-start" />
                        <span className="hidden lg:inline">{messages.history}</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 shrink-0 gap-2 rounded-xl border border-transparent px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:px-3 xl:rounded-md xl:border-transparent"
                            disabled={isBusy}
                          >
                            {isBusy ? (
                              <LoaderCircle className="size-[18px] animate-spin" data-icon="inline-start" />
                            ) : (
                              <FolderOpen className="size-[18px]" data-icon="inline-start" />
                            )}
                            <span className="hidden lg:inline">{messages.fileMenu}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2">
                          <DropdownMenuLabel className="px-3 py-2 text-sm uppercase tracking-[0.12em] opacity-60">{messages.fileMenu}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => void handleCreateMilestone()} className="gap-2.5 px-3 py-2.5 text-sm">
                            <RotateCcw className="size-[18px] opacity-70" /> {messages.saveMilestone}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2.5 px-3 py-2.5 text-sm">
                            <Import className="size-[18px] opacity-70" /> {messages.importFile}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2.5 px-3 py-2.5 text-sm">
                            <Download className="size-[18px] opacity-70" /> {messages.exportMarkdown}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportPlainText} className="gap-2.5 px-3 py-2.5 text-sm">
                            <Download className="size-[18px] opacity-70" /> {messages.exportText}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="opacity-50" />
                          <DropdownMenuItem
                            onClick={() => setIsResetDialogOpen(true)}
                            className="gap-2.5 px-3 py-2.5 text-sm text-destructive focus:text-destructive"
                          >
                            <RotateCcw className="size-[18px] opacity-70" /> {messages.resetNote}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                                        <div className="flex items-center cursor-help ml-auto pl-2 shrink-0" title={getSaveStatusLabel(saveStatus, messages)}>
                      <div
                        className={cn(
                          'size-2 rounded-full transition-all duration-500',
                          saveStatus === 'saved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                          saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-sky-500',
                        )}
                      />
                      <span className="ml-2 truncate whitespace-nowrap text-sm font-semibold tracking-normal text-muted-foreground/80">
                        {getSaveStatusLabel(saveStatus, messages)}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 xl:w-auto xl:flex-row xl:flex-nowrap xl:items-center">
                    <div className="flex items-center rounded-xl border border-border/60 bg-muted/30 p-1 xl:mr-1 xl:rounded-lg xl:border-0 xl:bg-muted/40">
                      <button
                        type="button"
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm font-bold transition-all',
                          isPlainTextMode ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => handleDocumentChange('contentFormat', 'plain')}
                        disabled={isBusy}
                      >
                        TXT
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm font-bold transition-all',
                          !isPlainTextMode ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => handleDocumentChange('contentFormat', 'markdown')}
                        disabled={isBusy}
                      >
                        MD
                      </button>
                    </div>

                    <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 xl:flex-none xl:overflow-visible xl:pb-0">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-xl border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground xl:rounded-md xl:border-transparent" 
                        onClick={handleUndo} 
                        disabled={!canUndo || isBusy}
                        title={messages.undo}
                      >
                        <Undo2 className="size-[18px]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-xl border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground xl:rounded-md xl:border-transparent" 
                        onClick={handleRedo} 
                        disabled={!canRedo || isBusy}
                        title={messages.redo}
                      >
                        <Redo2 className="size-[18px]" />
                      </Button>

</div>
                  </div>
                </div>

                <div className="markdown-editor h-[calc(100svh-15rem)] min-h-[24rem] max-h-[72svh] flex-1 overflow-y-auto xl:h-auto xl:min-h-0 xl:max-h-none">
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

              <div
                className={cn(
                  'flex flex-col overflow-visible xl:min-h-0 xl:overflow-y-auto',
                  mobilePane === 'editor' ? 'hidden xl:flex' : 'flex',
                )}
              >
                <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border/40 bg-background/95 px-3 py-3 backdrop-blur-md sm:px-4 xl:h-14 xl:flex-row xl:items-center xl:justify-between xl:gap-4 xl:rounded-tr-[calc(var(--radius)-1px)] xl:px-5 xl:py-0">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <span className="text-sm font-black tracking-[0.14em] uppercase opacity-50">{messages.previewCardTitle}</span>
                    <span className="truncate text-sm font-semibold tabular-nums text-muted-foreground/60">
                      {dimensions.width}×{effectivePreviewHeight}
                    </span>
                  </div>

                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                        className="h-10 flex-1 gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:flex-none sm:rounded-md sm:border-transparent sm:bg-transparent" 
                      disabled={isBusy} 
                      onClick={() => void exportPosterImage(true)}
                    >
                        {isBusy ? <LoaderCircle className="size-[18px] animate-spin" /> : <Share2 className="size-[18px]" />}
                      <span className="hidden sm:inline">{messages.shareImage}</span>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          type="button" 
                          variant="ghost"
                          size="sm"
                            className="h-10 flex-1 gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:flex-none sm:rounded-md sm:border-transparent sm:bg-transparent" 
                          disabled={isBusy}
                        >
                            {isBusy ? <LoaderCircle className="size-[18px] animate-spin" /> : <Download className="size-[18px]" />}
                          <span className="hidden sm:inline">{messages.exportMenu}</span>
                        </Button>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-2">
                          <DropdownMenuLabel className="px-3 py-2 text-sm uppercase tracking-[0.12em] opacity-60">{messages.exportMenu}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => void exportPosterImage(false)} className="gap-2.5 px-3 py-2.5 text-sm">
                          {messages.exportImage}
                        </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void exportPosterJpeg()} className="gap-2.5 px-3 py-2.5 text-sm">
                          {messages.exportJpeg}
                        </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void handleExportHtml()} className="gap-2.5 px-3 py-2.5 text-sm">
                          {messages.exportHtml}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="border-b border-border/60 bg-muted/5">
                  <div className="grid gap-3 px-3 py-4 sm:px-4 xl:grid-cols-2 xl:gap-x-8 xl:gap-y-5 xl:px-5 xl:py-5">
                    <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-3 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
                      <label className="text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground/80">{messages.exportTemplateLabel}</label>
                      <TemplateSelector
                        options={templateOptions}
                        value={documentState.exportTemplate}
                        placeholder={messages.templateSearchPlaceholder}
                        emptyText={messages.templateSearchEmpty}
                        clearLabel={messages.templateSearchPlaceholder}
                        disabled={isBusy}
                        onValueChange={(value) => handleDocumentChange('exportTemplate', value)}
                      />
                    </div>

                    <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-3 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
                      <label className="text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground/80">{messages.fontSizeLabel}</label>
                      <Select value={documentState.fontSizePreset} onValueChange={(value) => handleDocumentChange('fontSizePreset', value as PosterFontSize)}>
                        <SelectTrigger className="h-11 rounded-lg border-border/60 bg-background/50 text-sm">
                          <SelectValue placeholder={messages.fontSizeLabel} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">{messages.fontSizeSmall}</SelectItem>
                          <SelectItem value="medium">{messages.fontSizeMedium}</SelectItem>
                          <SelectItem value="large">{messages.fontSizeLarge}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-background/30 px-3 py-4 sm:px-4 xl:px-0 xl:py-0">
                  <div className="flex flex-col gap-0 overflow-hidden rounded-[1.25rem] border border-border/60 bg-background/70 shadow-sm xl:rounded-none xl:border-x-0 xl:border-b-0 xl:border-t-0 xl:bg-transparent xl:shadow-none">
                    <div className="w-full border-b border-border/60 bg-background/80 shadow-sm xl:bg-background/70">
                      <div className="flex items-center justify-between gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                        <span>{messages.exportPreviewLabel}</span>
                      </div>

                      <div className="overflow-auto bg-muted/20 px-3 py-3 sm:px-4 sm:py-4 xl:bg-muted/30 xl:px-0 xl:py-0">
                        {previewZoomUrl ? (
                          <Zoom
                            a11yNameButtonUnzoom={messages.previewZoomCloseLabel}
                            a11yNameButtonZoom={messages.previewZoomOpenLabel}
                            classDialog="poster-preview-zoom-dialog"
                            zoomMargin={24}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt={messages.exportPreviewLabel}
                              className="mx-auto block h-auto w-full cursor-zoom-in rounded-[1.1rem] shadow-lg xl:rounded-none"
                              draggable={false}
                              src={previewZoomUrl}
                              style={{
                                maxWidth: dimensions.width * posterPreviewScale,
                              }}
                            />
                          </Zoom>
                        ) : (
                          <div
                            className="mx-auto flex items-center justify-center text-sm text-muted-foreground"
                            style={{
                              width: '100%',
                              maxWidth: dimensions.width * posterPreviewScale,
                              aspectRatio: `${dimensions.width} / ${effectivePreviewHeight}`,
                            }}
                          >
                            {messages.exportPreviewLoading}
                          </div>
                        )}
                      </div>
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
          </div>
        </WorkspaceSurface>
      </AppPageContainer>

      <Sheet open={isHistoryOpen} onOpenChange={handleHistoryOpenChange}>
        <SheetContent side="right" className="flex h-full w-full max-w-none flex-col border-l border-border/70 bg-background p-0 sm:max-w-xl">
          <SheetHeader className="sticky top-0 z-10 border-b border-border/60 bg-background/95 px-4 py-4 backdrop-blur-md sm:px-5">
            <SheetTitle className="text-base font-semibold">{messages.historyTitle}</SheetTitle>
            <SheetDescription className="text-xs leading-5 text-muted-foreground">{messages.historyDescription}</SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col">
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-2 p-3 sm:p-4">
                {versions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-sm text-muted-foreground">
                    {messages.emptyHistory}
                  </div>
                ) : (
                  versions.map((version) => {
                    const isSelected = selectedVersion?.id === version.id;

                    return (
                      <button
                        key={version.id}
                        type="button"
                        className={cn(
                          'w-full rounded-xl border px-3 py-3 text-left transition-colors',
                          isSelected
                            ? 'border-primary/45 bg-primary/10'
                            : 'border-border/70 bg-background/40 hover:bg-accent/35',
                        )}
                        onClick={() => {
                          setSelectedVersionId(version.id);

                          if (editingLabelId && editingLabelId !== version.id) {
                            setEditingLabelId(null);
                            setEditingLabelValue('');
                          }
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', VERSION_KIND_STYLES[version.kind])}>
                            {getVersionKindLabel(version.kind, messages)}
                          </span>
                          <span className="truncate text-[11px] tabular-nums text-muted-foreground">
                            {formatTimestamp(version.createdAt, locale)}
                          </span>
                        </div>

                        <div className="mt-2 truncate text-sm font-medium text-foreground">
                          {version.label || getVersionKindLabel(version.kind, messages)}
                        </div>

                        <p className="mt-1 max-h-10 overflow-hidden break-all text-xs leading-5 text-muted-foreground">
                          {summarizeContent(version.contentSnapshot) || messages.emptyVersionSummary}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            <div className="sticky bottom-0 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md sm:p-4">
              <div className="space-y-3">
              {selectedVersion ? (
                <>
                  <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">
                    <div className="truncate text-sm font-medium text-foreground">
                      {selectedVersion.label || getVersionKindLabel(selectedVersion.kind, messages)}
                    </div>
                    <div className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {formatTimestamp(selectedVersion.createdAt, locale)}
                    </div>
                  </div>

                  {editingLabelId === selectedVersion.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingLabelValue}
                        onChange={(event) => setEditingLabelValue(event.target.value)}
                        placeholder={messages.versionLabelPlaceholder}
                      />

                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" onClick={() => void handleSaveVersionLabel(selectedVersion.id)} disabled={isBusy}>
                          {messages.saveVersionLabel}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLabelId(null);
                            setEditingLabelValue('');
                          }}
                          disabled={isBusy}
                        >
                          {messages.cancel}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" onClick={() => void handleRestoreVersion(selectedVersion)} disabled={isBusy}>
                        {messages.restoreVersion}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => void handleDuplicateAsMilestone(selectedVersion)} disabled={isBusy}>
                        {messages.saveAsMilestone}
                      </Button>
                      {selectedVersion.kind === 'milestone' ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLabelId(selectedVersion.id);
                            setEditingLabelValue(selectedVersion.label ?? '');
                          }}
                          disabled={isBusy}
                        >
                          {messages.renameMilestone}
                        </Button>
                      ) : null}
                      {selectedVersion.kind === 'auto' ? (
                        <Button type="button" size="sm" variant="outline" onClick={() => void handleDeleteAutoVersion(selectedVersion.id)} disabled={isBusy}>
                          {messages.deleteVersion}
                        </Button>
                      ) : null}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-muted-foreground">{messages.emptyHistory}</div>
              )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{messages.resetConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{messages.resetConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>{messages.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleResetNote()} disabled={isBusy}>
              {messages.resetNote}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
