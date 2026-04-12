import type { PosterFontSize } from '@/lib/editor/types';

const FONT_SIZE_BASE: Record<PosterFontSize, number> = {
  small: 24,
  medium: 28,
  large: 32,
};

export function getPosterBodyFontSize(width: number, fontSizePreset: PosterFontSize = 'medium') {
  return Math.round((width / 1080) * FONT_SIZE_BASE[fontSizePreset]);
}
