import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function OceanQuoteTemplate({ blocks, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const normalizedBlocks = blocks.map((block) => block.trim()).filter(Boolean);
  const lastBlock = normalizedBlocks[normalizedBlocks.length - 1] ?? '';
  const hasSourceLine = lastBlock.startsWith('/') && lastBlock.length <= 88;
  const bodyBlocks = hasSourceLine ? normalizedBlocks.slice(0, normalizedBlocks.length - 1) : normalizedBlocks;
  const bodyContent = bodyBlocks.join('\n\n');
  const sourceLine = hasSourceLine ? lastBlock : '';

  const heroHeight = 640;
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);
  const canvasBg = isDark ? '#ecebed' : '#f0eff1';
  const bodyColor = '#242934';
  const mutedColor = '#5f6674';
  const pexelsSeaImage = 'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000';

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        background: canvasBg,
        display: 'flex',
        flexDirection: 'column',
        color: bodyColor,
        fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, STSong, serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: heroHeight,
          backgroundImage: `linear-gradient(180deg, rgba(153,183,214,0.52) 0%, rgba(32,89,144,0.26) 34%, rgba(17,66,120,0.62) 100%), url(${pexelsSeaImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: `${Math.round(width * 0.09)}px ${Math.round(width * 0.095)}px`,
          boxSizing: 'border-box',
        }}
      >
      </div>

      <div
        data-poster-body
        data-poster-measure
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: `${Math.round(width * 0.09)}px ${Math.round(width * 0.09)}px ${Math.round(width * 0.075)}px`,
          boxSizing: 'border-box',
          gap: Math.round(width * 0.05),
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(width * 0.05) }}>
          <PosterMarkdownBody
            content={bodyContent}
            contentFormat={contentFormat}
            theme={theme}
            color={bodyColor}
            fontSize={bodyFontSize}
          />

          {sourceLine ? (
            <div
              style={{
                color: mutedColor,
                fontSize: Math.round(width * 0.056),
                lineHeight: 1.35,
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {sourceLine}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
