import type { CSSProperties } from 'react';
import type { PosterBodyLayoutConfig, PosterBodyMaxWidthMode, PosterBodyVerticalAlign, ResolvedPosterBodyLayout } from '@/lib/editor/templates/template-types';

const DEFAULT_POSTER_BODY_LAYOUT: ResolvedPosterBodyLayout = {
  textAlign: 'left',
  verticalAlign: 'top',
  maxWidthMode: 'full',
};

const BODY_VERTICAL_ALIGN_MAP: Record<PosterBodyVerticalAlign, CSSProperties['justifyContent']> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
};

const BODY_MAX_WIDTH_MAP: Record<PosterBodyMaxWidthMode, CSSProperties['maxWidth']> = {
  full: '100%',
  prose: '42em',
  narrow: '34em',
};

export function resolvePosterBodyLayout(layout?: PosterBodyLayoutConfig): ResolvedPosterBodyLayout {
  return {
    ...DEFAULT_POSTER_BODY_LAYOUT,
    ...layout,
  };
}

export function getPosterBodyContainerStyle(layout?: PosterBodyLayoutConfig): CSSProperties {
  const resolvedLayout = resolvePosterBodyLayout(layout);

  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: BODY_VERTICAL_ALIGN_MAP[resolvedLayout.verticalAlign],
    alignItems: 'stretch',
  };
}

export function getPosterBodyContentStyle(layout?: PosterBodyLayoutConfig): CSSProperties {
  const resolvedLayout = resolvePosterBodyLayout(layout);

  return {
    width: '100%',
    maxWidth: BODY_MAX_WIDTH_MAP[resolvedLayout.maxWidthMode],
  };
}
