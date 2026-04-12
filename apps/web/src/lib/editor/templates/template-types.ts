import type { ContentFormat, ExportTheme, PosterFontSize } from '@/lib/editor/types';

export type PosterBodyTextAlign = 'left' | 'center' | 'right';
export type PosterBodyVerticalAlign = 'top' | 'center' | 'bottom';
export type PosterBodyMaxWidthMode = 'full' | 'prose' | 'narrow';

export interface PosterBodyLayoutConfig {
  textAlign?: PosterBodyTextAlign;
  verticalAlign?: PosterBodyVerticalAlign;
  maxWidthMode?: PosterBodyMaxWidthMode;
}

export interface ResolvedPosterBodyLayout {
  textAlign: PosterBodyTextAlign;
  verticalAlign: PosterBodyVerticalAlign;
  maxWidthMode: PosterBodyMaxWidthMode;
}

export interface PosterTemplateProps {
  content: string;
  contentFormat: ContentFormat;
  blocks: string[];
  width: number;
  height: number;
  theme: ExportTheme;
  fontSizePreset: PosterFontSize;
  pageIndex: number;
  pageCount: number;
}
