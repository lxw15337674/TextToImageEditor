'use client';

import { createRoot } from 'react-dom/client';
import { domToBlob } from 'modern-screenshot';
import { POSTER_DIMENSIONS, splitContentBlocks, splitOversizedBlock } from '@/lib/editor/markdown';
import type { ContentFormat, ExportResolution, ExportTemplate, ExportTheme } from '@/lib/editor/types';

interface PosterCanvasProps {
  content: string;
  contentFormat: ContentFormat;
  theme: ExportTheme;
  resolution: ExportResolution;
  template: ExportTemplate;
  pageIndex: number;
  pageCount: number;
}

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

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        padding: Math.round(width * 0.04),
        display: 'flex',
        flexDirection: 'column',
        gap: Math.round(width * 0.028),
        background: isDark ? '#111827' : '#f8fafc',
        color: isDark ? '#f9fafb' : '#111827',
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: 1,
          overflow: 'hidden',
          borderRadius: Math.round(width * 0.032),
          background: isDark
            ? 'linear-gradient(180deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(241,245,249,1) 100%)',
          padding: Math.round(width * 0.05),
          boxShadow: isDark ? '0 25px 60px rgba(2, 6, 23, 0.45)' : '0 25px 60px rgba(15, 23, 42, 0.12)',
          border: isDark ? '1px solid rgba(148, 163, 184, 0.14)' : '1px solid rgba(148, 163, 184, 0.22)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 38%), radial-gradient(circle at bottom right, rgba(236,72,153,0.12), transparent 30%)'
              : 'radial-gradient(circle at top left, rgba(248,113,113,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.10), transparent 34%)',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: Math.round(width * 0.028),
              fontSize: Math.round(width * 0.023),
              opacity: 0.78,
            }}
          >
            <span>Local draft</span>
            <span>{new Date().toISOString().slice(0, 10)}</span>
          </div>

          <div
            data-poster-body
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {renderParagraphs(blocks, isDark ? '#e5e7eb' : '#111827', width >= 1400 ? 29 : 22)}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: Math.round(width * 0.032),
              fontSize: Math.round(width * 0.024),
              opacity: 0.78,
            }}
          >
            <span>Markdown Poster</span>
            <span>
              {pageIndex}/{pageCount}
            </span>
          </div>
        </div>
      </div>
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

export function PosterCanvas({ content, contentFormat, theme, resolution, template, pageIndex, pageCount }: PosterCanvasProps) {
  const { width, height } = POSTER_DIMENSIONS[resolution];
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

async function posterFits(content: string, contentFormat: ContentFormat, theme: ExportTheme, resolution: ExportResolution, template: ExportTemplate) {
  const host = createHost();
  const root = createRoot(host);

  root.render(
    <PosterCanvas content={content} contentFormat={contentFormat} theme={theme} resolution={resolution} template={template} pageIndex={1} pageCount={1} />,
  );
  await waitForPaint();

  const body = host.querySelector<HTMLElement>('[data-poster-body]');
  const fits = body ? body.scrollHeight <= body.clientHeight + 1 : true;

  root.unmount();
  host.remove();

  return fits;
}

export async function paginateMarkdownForPoster(
  content: string,
  contentFormat: ContentFormat,
  theme: ExportTheme,
  resolution: ExportResolution,
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

    if (await posterFits(candidate, contentFormat, theme, resolution, template)) {
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

      if (await posterFits(segmentCandidate, contentFormat, theme, resolution, template)) {
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
  resolution: ExportResolution,
  template: ExportTemplate,
  pageIndex: number,
  pageCount: number,
) {
  const host = createHost();
  const root = createRoot(host);

  root.render(
    <PosterCanvas
      content={content}
      contentFormat={contentFormat}
      theme={theme}
      resolution={resolution}
      template={template}
      pageIndex={pageIndex}
      pageCount={pageCount}
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
