import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function NewsFlashTemplate({ content, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark ? '#050505' : '#fffdf8';
  const lineColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15, 23, 42, 0.12)';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? 'rgba(226,232,240,0.64)' : 'rgba(71,85,105,0.72)';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        background: canvasBackground,
        color: textColor,
        padding: `${Math.round(width * 0.05)}px ${Math.round(width * 0.055)}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Space Grotesk, Inter, Noto Sans SC, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: Math.round(width * 0.018),
          marginBottom: Math.round(width * 0.03),
        }}
      >
        <div
          style={{
            background: '#dc2626',
            color: '#ffffff',
            padding: `${Math.round(width * 0.008)}px ${Math.round(width * 0.018)}px`,
            fontSize: Math.round(width * 0.016),
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Breaking
        </div>
        <div style={{ flex: 1, height: 2, background: lineColor }} />
        <div
          style={{
            color: mutedColor,
            fontSize: Math.round(width * 0.015),
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Live Bulletin
        </div>
      </div>

      <div
        data-poster-body
        data-poster-measure
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PosterMarkdownBody
          content={content}
          contentFormat={contentFormat}
          theme={theme}
          color={isDark ? '#e5e7eb' : '#334155'}
          fontSize={bodyFontSize}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: Math.round(width * 0.032),
          paddingTop: Math.round(width * 0.02),
          borderTop: `4px double ${lineColor}`,
          color: mutedColor,
          fontSize: Math.round(width * 0.014),
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        <span>Digital Herald</span>
      </div>
    </div>
  );
}
