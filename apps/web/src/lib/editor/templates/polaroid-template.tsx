import { getPosterBodyContainerStyle, getPosterBodyContentStyle } from '@/lib/editor/templates/poster-body-layout';
import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import type { PosterBodyLayoutConfig } from '@/lib/editor/templates/template-types';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

const POLAROID_BODY_LAYOUT = {
  textAlign: 'left',
  verticalAlign: 'top',
  maxWidthMode: 'full',
} satisfies PosterBodyLayoutConfig;

export function PolaroidTemplate({ content, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark ? '#1f2937' : '#e5e7eb';
  const frameBackground = isDark ? '#f8fafc' : '#fffefc';
  const bodyBackground = isDark ? '#dbe4f0' : '#f8fafc';
  const textColor = '#1f2937';
  const mutedColor = 'rgba(71, 85, 105, 0.72)';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        background: canvasBackground,
        padding: `${Math.round(width * 0.07)}px`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Instrument Serif, Cormorant Garamond, Noto Serif SC, Georgia, serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: Math.round(width * 0.76),
          height: '100%',
          background: frameBackground,
          color: textColor,
          padding: `${Math.round(width * 0.026)}px ${Math.round(width * 0.026)}px ${Math.round(width * 0.065)}px`,
          boxSizing: 'border-box',
          boxShadow: '0 28px 90px rgba(0, 0, 0, 0.24)',
          transform: 'rotate(-1.5deg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          data-poster-body
          data-poster-measure
          style={{
            flex: 1,
            overflow: 'hidden',
            background: bodyBackground,
            border: '1px solid rgba(148, 163, 184, 0.18)',
            padding: `${Math.round(width * 0.04)}px`,
            boxSizing: 'border-box',
            ...getPosterBodyContainerStyle(POLAROID_BODY_LAYOUT),
          }}
        >
          <div style={getPosterBodyContentStyle(POLAROID_BODY_LAYOUT)}>
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme="light"
              color={textColor}
              fontSize={bodyFontSize}
              bodyLayout={POLAROID_BODY_LAYOUT}
            />
          </div>
        </div>

        <div
          style={{
            paddingTop: Math.round(width * 0.03),
            display: 'flex',
            flexDirection: 'column',
            gap: Math.round(width * 0.012),
          }}
        >
          <div
            style={{
              fontFamily: '"Comic Sans MS", "Bradley Hand", cursive',
              fontSize: Math.round(width * 0.028),
              color: mutedColor,
            }}
          >
            Captured note
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: mutedColor,
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontSize: Math.round(width * 0.014),
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <span>Polaroid Frame</span>
              </div>
        </div>
      </div>
    </div>
  );
}
