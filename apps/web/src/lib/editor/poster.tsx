'use client';

import { createRoot } from 'react-dom/client';
import { domToBlob } from 'modern-screenshot';
import { POSTER_DIMENSIONS, splitContentBlocks, splitOversizedBlock } from '@/lib/editor/markdown';
import { CalendarEssayTemplate } from '@/lib/editor/templates/calendar-essay-template';
import { EditorialCardTemplate } from '@/lib/editor/templates/editorial-card-template';
import { ImageBackgroundTemplate } from '@/lib/editor/templates/image-background-template';
import { OceanQuoteTemplate } from '@/lib/editor/templates/ocean-quote-template';
import { SpotifyTemplate } from '@/lib/editor/templates/spotify-template';
import { XiaohongshuTemplate } from '@/lib/editor/templates/xiaohongshu-template';
import type { ContentFormat, ExportTemplate, ExportTheme } from '@/lib/editor/types';

interface PosterCanvasProps {
  content: string;
  contentFormat: ContentFormat;
  theme: ExportTheme;
  template: ExportTemplate;
  pageIndex: number;
  pageCount: number;
  heightOverride?: number;
}

export const MAX_POSTER_HEIGHT = 12_000;
const { width: POSTER_WIDTH, height: POSTER_BASE_HEIGHT } = POSTER_DIMENSIONS;

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function createHost() {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-20000px';
  host.style.top = '0';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-1';
  document.body.appendChild(host);
  return host;
}

export function PosterCanvas({ content, contentFormat, theme, template, pageIndex, pageCount, heightOverride }: PosterCanvasProps) {
  const width = POSTER_WIDTH;
  const height = heightOverride ?? POSTER_BASE_HEIGHT;
  const blocks = splitContentBlocks(content, contentFormat);

  switch (template) {
    case 'editorial-card':
      return <EditorialCardTemplate content={content} contentFormat={contentFormat} blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    case 'image-background':
      return <ImageBackgroundTemplate content={content} contentFormat={contentFormat} blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    case 'spotify':
      return <SpotifyTemplate content={content} contentFormat={contentFormat} blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    case 'ocean-quote':
      return <OceanQuoteTemplate content={content} contentFormat={contentFormat} blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    case 'calendar-essay':
      return <CalendarEssayTemplate content={content} contentFormat={contentFormat} blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    default:
      return <XiaohongshuTemplate content={content} contentFormat={contentFormat} blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
  }
}

async function posterFits(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  template: ExportTemplate,
  heightOverride?: number,
) {
  const host = createHost();
  const root = createRoot(host);

  root.render(
    <PosterCanvas
      content={content}
      contentFormat={contentFormat}
      theme={theme}
      template={template}
      pageIndex={1}
      pageCount={1}
      heightOverride={heightOverride}
    />,
  );
  await waitForPaint();

  const measureTarget =
    host.querySelector<HTMLElement>('[data-poster-measure]') ?? host.querySelector<HTMLElement>('[data-poster-body]');
  const fits = measureTarget ? measureTarget.scrollHeight <= measureTarget.clientHeight + 1 : true;

  root.unmount();
  host.remove();

  return fits;
}

export async function resolvePosterLayout(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  template: ExportTemplate,
  maxHeight = MAX_POSTER_HEIGHT,
) {
  const safeMaxHeight = Math.max(POSTER_BASE_HEIGHT, maxHeight);

  if (await posterFits(content, contentFormat, theme, template, POSTER_BASE_HEIGHT)) {
    return {
      height: POSTER_BASE_HEIGHT,
      isClipped: false,
    };
  }

  const step = 240;

  for (let nextHeight = POSTER_BASE_HEIGHT + step; nextHeight <= safeMaxHeight; nextHeight += step) {
    if (await posterFits(content, contentFormat, theme, template, nextHeight)) {
      return {
        height: nextHeight,
        isClipped: false,
      };
    }
  }

  return {
    height: safeMaxHeight,
    isClipped: true,
  };
}

export async function paginateMarkdownForPoster(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  template: ExportTemplate,
) {
  const blocks = splitContentBlocks(content, contentFormat);

  if (blocks.length === 0) {
    return [''];
  }

  const pages: string[] = [];
  let currentBlocks: string[] = [];

  for (const block of blocks) {
    const candidate = [...currentBlocks, block].join('\n\n');

    if (await posterFits(candidate, contentFormat, theme, template)) {
      currentBlocks.push(block);
      continue;
    }

    if (currentBlocks.length > 0) {
      pages.push(currentBlocks.join('\n\n'));
    }

    const splitBlocks = splitOversizedBlock(block);
    let nextBlocks: string[] = [];

    for (const segment of splitBlocks) {
      const segmentCandidate = [...nextBlocks, segment].join('\n\n');

      if (await posterFits(segmentCandidate, contentFormat, theme, template)) {
        nextBlocks.push(segment);
        continue;
      }

      if (nextBlocks.length > 0) {
        pages.push(nextBlocks.join('\n\n'));
      }

      nextBlocks = [segment];
    }

    currentBlocks = nextBlocks;
  }

  if (currentBlocks.length > 0) {
    pages.push(currentBlocks.join('\n\n'));
  }

  return pages;
}

export async function renderPosterBlob(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  template: ExportTemplate,
  pageIndex: number,
  pageCount: number,
  heightOverride?: number,
) {
  const resolvedHeight = heightOverride ?? (await resolvePosterLayout(content, contentFormat, theme, template)).height;
  const host = createHost();
  const root = createRoot(host);

  root.render(
    <PosterCanvas
      content={content}
      contentFormat={contentFormat}
      theme={theme}
      template={template}
      pageIndex={pageIndex}
      pageCount={pageCount}
      heightOverride={resolvedHeight}
    />,
  );
  await waitForPaint();

  const posterRoot = host.querySelector<HTMLElement>('[data-poster-root]');

  if (!posterRoot) {
    root.unmount();
    host.remove();
    throw new Error('Poster render failed.');
  }

  const blob = await domToBlob(posterRoot, {
    scale: 1,
  });

  root.unmount();
  host.remove();

  return blob;
}
