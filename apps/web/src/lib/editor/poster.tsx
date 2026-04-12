'use client';

import { createRoot } from 'react-dom/client';
import { domToBlob } from 'modern-screenshot';
import { POSTER_DIMENSIONS, splitContentBlocks, splitOversizedBlock } from '@/lib/editor/markdown';
import type { ContentFormat, ExportPreset, ExportTemplate, ExportTheme } from '@/lib/editor/types';

interface PosterCanvasProps {
  content: string;
  contentFormat: ContentFormat;
  theme: ExportTheme;
  preset: ExportPreset;
  template: ExportTemplate;
  pageIndex: number;
  pageCount: number;
  heightOverride?: number;
}

export const MAX_POSTER_HEIGHT = 12_000;

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

function createTextBlocks(content: string, contentFormat: ContentFormat) {
  if (contentFormat === 'plain') {
    const normalized = content.replace(/\r\n/g, '\n').trim();

    if (!normalized) {
      return [];
    }

    return normalized.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  }

  const normalized = content
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim();

  if (!normalized) {
    return [];
  }

  return normalized.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
}

function renderParagraphs(blocks: string[], color: string, fontSize: number, centered = false) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: centered ? 20 : 16,
        color,
        fontSize,
        lineHeight: 1.7,
        textAlign: centered ? 'center' : 'left',
      }}
    >
      {blocks.map((block, index) => (
        <p
          key={`${index}-${block.slice(0, 20)}`}
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {block}
        </p>
      ))}
    </div>
  );
}

function splitCalendarEssaySections(blocks: string[]) {
  const normalizedBlocks = blocks.map((block) => block.trim()).filter(Boolean);

  if (normalizedBlocks.length <= 1) {
    return {
      bodyBlocks: normalizedBlocks,
      footerLines: [] as string[],
    };
  }

  const footerLines: string[] = [];

  for (let index = normalizedBlocks.length - 1; index >= 0 && footerLines.length < 3; index -= 1) {
    const candidate = normalizedBlocks[index]?.replace(/\n+/g, ' ').trim() ?? '';

    if (!candidate) {
      break;
    }

    const isTooLong = candidate.length > 20;
    const looksLikeBodyText = /[。！？；：,.!?;:]/.test(candidate);

    if (isTooLong || looksLikeBodyText) {
      break;
    }

    footerLines.unshift(candidate);
  }

  if (footerLines.length === 0 || footerLines.length >= normalizedBlocks.length) {
    return {
      bodyBlocks: normalizedBlocks,
      footerLines: [] as string[],
    };
  }

  return {
    bodyBlocks: normalizedBlocks.slice(0, normalizedBlocks.length - footerLines.length),
    footerLines,
  };
}

function XiaohongshuTemplate({
  blocks,
  width,
  height,
  theme,
  pageIndex,
  pageCount,
}: {
  blocks: string[];
  width: number;
  height: number;
  theme: ExportTheme;
  pageIndex: number;
  pageCount: number;
}) {
  const isDark = theme === 'dark';
  const { bodyBlocks, footerLines } = splitCalendarEssaySections(blocks);
  const date = new Date();
  const day = String(date.getDate());
  const monthYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date).toUpperCase();
  const weekday = new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long',
  }).format(date);

  const baseTextColor = isDark ? '#f2ece6' : '#2e241d';
  const mutedTextColor = isDark ? '#d5cfc9' : '#4a413d';
  const subtleTextColor = isDark ? '#a59d97' : '#9a9a9a';
  const dividerColor = isDark ? 'rgba(242, 236, 230, 0.24)' : 'rgba(40, 33, 28, 0.22)';
  const bodyFontSize = width >= 1400 ? 42 : 31;

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        padding: `${Math.round(width * 0.085)}px ${Math.round(width * 0.09)}px ${Math.round(width * 0.072)}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: Math.round(width * 0.032),
        background: isDark ? '#171413' : '#ededed',
        color: baseTextColor,
        fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, STSong, serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: Math.round(height * 0.016),
          gap: Math.round(width * 0.005),
        }}
      >
        <div
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.19),
            lineHeight: 0.95,
            letterSpacing: '-0.05em',
            fontWeight: 700,
            color: baseTextColor,
          }}
        >
          {day}
        </div>
        <div
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.062),
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            fontWeight: 700,
            color: baseTextColor,
          }}
        >
          {monthYear}
        </div>
        <div
          style={{
            fontSize: Math.round(width * 0.047),
            fontWeight: 600,
            lineHeight: 1.25,
            color: mutedTextColor,
          }}
        >
          {weekday}
        </div>
      </div>

      <div
        style={{
          alignSelf: 'center',
          width: Math.round(width * 0.14),
          height: 2,
          background: dividerColor,
          marginTop: Math.round(height * 0.006),
          marginBottom: Math.round(height * 0.018),
        }}
      />

      <div
        data-poster-body
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {renderParagraphs(bodyBlocks, baseTextColor, bodyFontSize)}
      </div>

      {footerLines.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: Math.round(width * 0.004),
            textAlign: 'center',
            paddingTop: Math.round(height * 0.008),
          }}
        >
          {footerLines.map((line, index) => (
            <p
              key={`${line}-${index}`}
              style={{
                margin: 0,
                fontSize: Math.round(width * 0.057),
                lineHeight: 1.35,
                fontWeight: index === 0 ? 600 : 500,
                color: index === footerLines.length - 1 ? subtleTextColor : mutedTextColor,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}

      {pageCount > 1 ? (
        <div
          style={{
            alignSelf: 'center',
            marginTop: Math.round(height * 0.004),
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.03),
            color: subtleTextColor,
          }}
        >
          {pageIndex}/{pageCount}
        </div>
      ) : null}
    </div>
  );
}

function ImageBackgroundTemplate({
  blocks,
  width,
  height,
  theme,
  pageIndex,
  pageCount,
}: {
  blocks: string[];
  width: number;
  height: number;
  theme: ExportTheme;
  pageIndex: number;
  pageCount: number;
}) {
  const isDark = theme === 'dark';

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 46%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f97316 0%, #fb7185 46%, #38bdf8 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(circle at 20% 20%, rgba(125,211,252,0.18), transparent 28%), radial-gradient(circle at 80% 80%, rgba(244,114,182,0.14), transparent 30%)'
            : 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.26), transparent 24%), radial-gradient(circle at 80% 80%, rgba(15,23,42,0.14), transparent 26%)',
          backdropFilter: 'blur(0px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark ? 'rgba(2, 6, 23, 0.34)' : 'rgba(15, 23, 42, 0.22)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: Math.round(width * 0.065),
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: Math.round(width * 0.025), opacity: 0.86 }}>Share image</div>

        <div
          data-poster-body
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: Math.round(width * 0.04),
            borderRadius: Math.round(width * 0.028),
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderParagraphs(blocks, '#ffffff', width >= 1400 ? 29 : 22)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: Math.round(width * 0.024), opacity: 0.86 }}>
          <span>Saved locally</span>
          <span>
            {pageIndex}/{pageCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function SpotifyTemplate({
  blocks,
  width,
  height,
  theme,
  pageIndex,
  pageCount,
}: {
  blocks: string[];
  width: number;
  height: number;
  theme: ExportTheme;
  pageIndex: number;
  pageCount: number;
}) {
  const isDark = theme === 'dark';

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        padding: Math.round(width * 0.04),
        background: isDark ? '#52525b' : '#a1a1aa',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          borderRadius: Math.round(width * 0.03),
          background: isDark ? '#71717a' : '#d4d4d8',
          boxShadow: '0 22px 50px rgba(0,0,0,0.18)',
          padding: Math.round(width * 0.05),
          color: '#111827',
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(width * 0.03),
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: Math.round(width * 0.023), opacity: 0.7 }}>
          <span>Now writing</span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div
          data-poster-body
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {renderParagraphs(blocks, '#111827', width >= 1400 ? 32 : 24, true)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: Math.round(width * 0.024), opacity: 0.74, fontWeight: 600 }}>
          <span>Markdown Poster</span>
          <span>
            {pageIndex}/{pageCount}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PosterCanvas({ content, contentFormat, theme, preset, template, pageIndex, pageCount, heightOverride }: PosterCanvasProps) {
  const { width, height: defaultHeight } = POSTER_DIMENSIONS[preset];
  const height = heightOverride ?? defaultHeight;
  const blocks = createTextBlocks(content, contentFormat);

  switch (template) {
    case 'image-background':
      return <ImageBackgroundTemplate blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    case 'spotify':
      return <SpotifyTemplate blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
    default:
      return <XiaohongshuTemplate blocks={blocks} width={width} height={height} theme={theme} pageIndex={pageIndex} pageCount={pageCount} />;
  }
}

async function posterFits(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  preset: ExportPreset,
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
      preset={preset}
      template={template}
      pageIndex={1}
      pageCount={1}
      heightOverride={heightOverride}
    />,
  );
  await waitForPaint();

  const body = host.querySelector<HTMLElement>('[data-poster-body]');
  const fits = body ? body.scrollHeight <= body.clientHeight + 1 : true;

  root.unmount();
  host.remove();

  return fits;
}

export async function resolvePosterLayout(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  preset: ExportPreset,
  template: ExportTemplate,
  maxHeight = MAX_POSTER_HEIGHT,
) {
  const { height: minHeight } = POSTER_DIMENSIONS[preset];
  const safeMaxHeight = Math.max(minHeight, maxHeight);

  if (await posterFits(content, contentFormat, theme, preset, template, minHeight)) {
    return {
      height: minHeight,
      isClipped: false,
    };
  }

  const step = 240;

  for (let nextHeight = minHeight + step; nextHeight <= safeMaxHeight; nextHeight += step) {
    if (await posterFits(content, contentFormat, theme, preset, template, nextHeight)) {
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
  preset: ExportPreset,
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

    if (await posterFits(candidate, contentFormat, theme, preset, template)) {
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

      if (await posterFits(segmentCandidate, contentFormat, theme, preset, template)) {
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
  preset: ExportPreset,
  template: ExportTemplate,
  pageIndex: number,
  pageCount: number,
  heightOverride?: number,
) {
  const resolvedHeight = heightOverride ?? (await resolvePosterLayout(content, contentFormat, theme, preset, template)).height;
  const host = createHost();
  const root = createRoot(host);

  root.render(
    <PosterCanvas
      content={content}
      contentFormat={contentFormat}
      theme={theme}
      preset={preset}
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
