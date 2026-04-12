import { getPosterBodyContainerStyle, getPosterBodyContentStyle } from '@/lib/editor/templates/poster-body-layout';
import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import type { PosterBodyLayoutConfig } from '@/lib/editor/templates/template-types';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

const SPOTIFY_BODY_LAYOUT = {
  textAlign: 'left',
  verticalAlign: 'top',
  maxWidthMode: 'full',
} satisfies PosterBodyLayoutConfig;

export function SpotifyTemplate({ content, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

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
          <span> </span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div
          data-poster-body
          style={{
            flex: 1,
            overflow: 'hidden',
            ...getPosterBodyContainerStyle(SPOTIFY_BODY_LAYOUT),
          }}
        >
          <div style={getPosterBodyContentStyle(SPOTIFY_BODY_LAYOUT)}>
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme={theme}
              color="#111827"
              fontSize={bodyFontSize}
              bodyLayout={SPOTIFY_BODY_LAYOUT}
            />
          </div>
        </div>

       
      </div>
    </div>
  );
}
