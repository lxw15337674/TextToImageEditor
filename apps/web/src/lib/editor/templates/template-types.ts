import type { ContentFormat, ExportTheme, PosterFontSize } from '@/lib/editor/types';

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
