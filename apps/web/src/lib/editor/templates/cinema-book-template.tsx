import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function CinemaBookTemplate({ content, contentFormat, width, height, theme, fontSizePreset, pageIndex, pageCount }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark
    ? 'radial-gradient(circle at top, rgba(96, 165, 250, 0.18), transparent 36%), linear-gradient(180deg, #06070b 0%, #11131a 42%, #06070b 100%)'
    : 'radial-gradient(circle at top, rgba(59, 130, 246, 0.14), transparent 38%), linear-gradient(180deg, #13151c 0%, #1d2230 42%, #0f1117 100%)';
  const frameBorder = isDark ? '1px solid rgba(244, 244, 245, 0.14)' : '1px solid rgba(244, 244, 245, 0.14)';
  const frameBackground = isDark ? 'rgba(12, 14, 19, 0.82)' : 'rgba(14, 17, 24, 0.82)';
  const textColor = '#f8fafc';
  const mutedColor = 'rgba(226, 232, 240, 0.62)';
  const accentColor = '#fcd34d';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        padding: `${Math.round(width * 0.07)}px ${Math.round(width * 0.07)}px ${Math.round(width * 0.06)}px`,
        boxSizing: 'border-box',
        background: canvasBackground,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        color: textColor,
        fontFamily: 'Instrument Serif, Cormorant Garamond, Noto Serif SC, Georgia, serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: Math.round(width * 0.04),
          border: frameBorder,
          background: frameBackground,
          boxShadow: '0 34px 120px rgba(0, 0, 0, 0.46)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: `${Math.round(width * 0.055)}px ${Math.round(width * 0.065)}px ${Math.round(width * 0.05)}px`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 18%, transparent 82%, rgba(255,255,255,0.03) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: mutedColor,
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.018),
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          <span>Cinema Book</span>
          <span>Curated Frame</span>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            gap: Math.round(width * 0.012),
            marginTop: Math.round(width * 0.04),
            marginBottom: Math.round(width * 0.038),
            color: accentColor,
            fontSize: Math.round(width * 0.032),
            letterSpacing: '0.12em',
          }}
        >
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        <div
          data-poster-body
          data-poster-measure
          style={{
            position: 'relative',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `0 ${Math.round(width * 0.025)}px`,
            textAlign: 'center',
          }}
        >
          <div style={{ width: '100%' }}>
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme={theme}
              color={textColor}
              fontSize={bodyFontSize}
              centered
            />
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: Math.round(width * 0.042),
            color: mutedColor,
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.019),
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>Must watch / read</span>
          <span>
            {pageIndex}/{pageCount}
          </span>
        </div>
      </div>
    </div>
  );
}
