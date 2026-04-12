import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function CodeSnippetTemplate({ content, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark
    ? 'linear-gradient(180deg, #050816 0%, #0f172a 100%)'
    : 'linear-gradient(180deg, #eef4ff 0%, #f8fafc 100%)';
  const shellBackground = isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)';
  const shellBorder = isDark ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(148, 163, 184, 0.24)';
  const bodyColor = isDark ? '#dbeafe' : '#0f172a';
  const mutedColor = isDark ? 'rgba(148, 163, 184, 0.74)' : 'rgba(71, 85, 105, 0.82)';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        padding: `${Math.round(width * 0.06)}px`,
        boxSizing: 'border-box',
        background: canvasBackground,
        color: bodyColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: Math.round(width * 0.03),
          border: shellBorder,
          background: shellBackground,
          boxShadow: isDark ? '0 24px 80px rgba(2, 6, 23, 0.42)' : '0 24px 80px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Math.round(width * 0.012),
            padding: `${Math.round(width * 0.024)}px ${Math.round(width * 0.03)}px`,
            borderBottom: shellBorder,
            color: mutedColor,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#f87171', display: 'block' }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#fbbf24', display: 'block' }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#34d399', display: 'block' }} />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: Math.round(width * 0.015),
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            snippet.ts
          </div>
        </div>

        <div
          data-poster-body
          data-poster-measure
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: `${Math.round(width * 0.04)}px ${Math.round(width * 0.04)}px ${Math.round(width * 0.03)}px`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: Math.round(width * 0.022),
          }}
        >
          <div
            style={{
              color: mutedColor,
              fontSize: Math.round(width * 0.015),
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Main Flow
          </div>
          <PosterMarkdownBody
            content={content}
            contentFormat={contentFormat}
            theme={theme}
            color={bodyColor}
            fontSize={bodyFontSize}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${Math.round(width * 0.018)}px ${Math.round(width * 0.03)}px`,
            borderTop: shellBorder,
            color: mutedColor,
            fontSize: Math.round(width * 0.014),
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span>UTF-8</span>
          </div>
      </div>
    </div>
  );
}
