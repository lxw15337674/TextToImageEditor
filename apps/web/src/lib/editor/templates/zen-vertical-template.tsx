import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function ZenVerticalTemplate({ content, contentFormat, width, height, theme, fontSizePreset, pageIndex, pageCount }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark ? '#161616' : '#f6f0e8';
  const panelBackground = isDark ? 'rgba(24, 24, 24, 0.92)' : 'rgba(255, 250, 244, 0.92)';
  const panelBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(36, 36, 36, 0.08)';
  const textColor = isDark ? '#e7e0d7' : '#2f2924';
  const mutedColor = isDark ? 'rgba(231, 224, 215, 0.56)' : 'rgba(47, 41, 36, 0.54)';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        background: canvasBackground,
        padding: `${Math.round(width * 0.055)}px ${Math.round(width * 0.05)}px`,
        boxSizing: 'border-box',
        color: textColor,
        fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, STSong, serif',
        display: 'flex',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: `${Math.round(width * 0.16)}px 1fr`,
          gap: Math.round(width * 0.045),
          borderRadius: Math.round(width * 0.03),
          background: panelBackground,
          border: panelBorder,
          overflow: 'hidden',
          boxShadow: isDark ? '0 20px 80px rgba(0, 0, 0, 0.4)' : '0 20px 80px rgba(120, 113, 108, 0.14)',
        }}
      >
        <div
          style={{
            position: 'relative',
            background: isDark ? 'linear-gradient(180deg, rgba(153, 27, 27, 0.24), rgba(0, 0, 0, 0))' : 'linear-gradient(180deg, rgba(153, 27, 27, 0.12), rgba(0, 0, 0, 0))',
            borderRight: panelBorder,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontSize: Math.round(width * 0.03),
              lineHeight: 1.8,
              letterSpacing: '0.24em',
              color: mutedColor,
            }}
          >
            禅 意 留 白
          </div>
          <div
            style={{
              position: 'absolute',
              top: Math.round(width * 0.028),
              left: '50%',
              transform: 'translateX(-50%)',
              width: Math.round(width * 0.038),
              height: Math.round(width * 0.038),
              borderRadius: 6,
              background: '#9f1239',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: `${Math.round(width * 0.055)}px ${Math.round(width * 0.055)}px ${Math.round(width * 0.045)}px 0`,
            boxSizing: 'border-box',
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: mutedColor,
              fontSize: Math.round(width * 0.016),
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: Math.round(width * 0.03),
            }}
          >
            Zen Vertical
          </div>

          <div
            data-poster-body
            data-poster-measure
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme={theme}
              color={textColor}
              fontSize={bodyFontSize}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: Math.round(width * 0.04),
              color: mutedColor,
              fontSize: Math.round(width * 0.016),
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            <span>Stillness</span>
            <span>
              {pageIndex}/{pageCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
