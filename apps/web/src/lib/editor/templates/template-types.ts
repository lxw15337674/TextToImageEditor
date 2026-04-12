import type { ContentFormat, ExportTheme } from '@/lib/editor/types';

export interface PosterTemplateProps {
  content: string;
  contentFormat: ContentFormat;
  blocks: string[];
  width: number;
  height: number;
  theme: ExportTheme;
  pageIndex: number;
  pageCount: number;
}
