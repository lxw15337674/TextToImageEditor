import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function XiaohongshuTemplate({ content, contentFormat, width, height, theme, pageIndex, pageCount }: PosterTemplateProps) {
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
              alignItems: 'flex-start',
            }}
          >
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme={theme}
              color={isDark ? '#e5e7eb' : '#111827'}
              fontSize={width >= 1400 ? 29 : 22}
            />
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
