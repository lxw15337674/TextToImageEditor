export type ContentFormat = 'markdown' | 'plain';
export type SaveStatus = 'dirty' | 'saving' | 'saved';
export type ExportTheme = 'light' | 'dark';
export type PosterFontSize = 'small' | 'medium' | 'large';
export type PosterTemplateBase =
  | 'calendar-essay'
  | 'xiaohongshu'
  | 'spotify'
  | 'ocean-quote'
  | 'editorial-card'
  | 'cinema-book'
  | 'code-snippet'
  | 'ticket-stub'
  | 'zen-vertical'
  | 'news-flash'
  | 'polaroid'
  | 'literature';
export type ExportTemplate = `${PosterTemplateBase}-${ExportTheme}`;
export type VersionKind = 'auto' | 'milestone' | 'import-backup' | 'rollback-backup' | 'reset-backup';

export interface EditorDocument {
  id: string;
  content: string;
  contentFormat: ContentFormat;
  exportTemplate: ExportTemplate;
  fontSizePreset: PosterFontSize;
  updatedAt: number;
  lastSavedAt: number | null;
}

export interface EditorVersion {
  id: string;
  documentId: string;
  kind: VersionKind;
  contentSnapshot: string;
  label: string | null;
  createdAt: number;
}

export interface PosterPage {
  index: number;
  markdown: string;
}
