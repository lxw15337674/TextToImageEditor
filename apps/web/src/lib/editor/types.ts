export type ContentFormat = 'markdown' | 'plain';
export type SaveStatus = 'dirty' | 'saving' | 'saved';
export type ExportTheme = 'light' | 'dark';
export type PosterFontSize = 'small' | 'medium' | 'large';
export type ExportTemplate =
  | 'calendar-essay'
  | 'xiaohongshu'
  | 'image-background'
  | 'spotify'
  | 'ocean-quote'
  | 'editorial-card'
  | 'cinema-book'
  | 'code-snippet'
  | 'ticket-stub'
  | 'zen-vertical'
  | 'news-flash'
  | 'polaroid';
export type VersionKind = 'auto' | 'milestone' | 'import-backup' | 'rollback-backup';

export interface EditorDocument {
  id: string;
  content: string;
  contentFormat: ContentFormat;
  exportTheme: ExportTheme;
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
