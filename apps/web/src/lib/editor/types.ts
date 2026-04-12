export type ContentFormat = 'markdown' | 'plain';
export type SaveStatus = 'dirty' | 'saving' | 'saved';
export type ExportTheme = 'light' | 'dark';
export type ExportPreset = '1:1' | '3:4' | '9:16';
export type ExportResolution = '1080x1080' | '1080x1440' | '1440x1920' | '1080x1920' | '1440x2560';
export type ExportTemplate = 'xiaohongshu' | 'image-background' | 'spotify';
export type VersionKind = 'auto' | 'milestone' | 'import-backup' | 'rollback-backup';

export interface EditorDocument {
  id: string;
  content: string;
  contentFormat: ContentFormat;
  exportTheme: ExportTheme;
  exportPreset: ExportPreset;
  exportResolution: ExportResolution;
  exportTemplate: ExportTemplate;
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
