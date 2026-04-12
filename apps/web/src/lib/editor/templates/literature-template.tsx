import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function LiteratureTemplate({ content, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';

  // Wabi-sabi traditional colors
  // Light: Rice paper / light beige. Dark: Ink stone / dark grey-brown.
  const canvasBackground = isDark ? '#1C1B19' : '#F6F4EE';
  const paperBackground = isDark ? '#262522' : '#F9F8F5';
  
  // Ink-like text color
  const textColor = isDark ? '#E5E2DA' : '#33312E';
  
  // Cinnabar red for the seal / small accents
  const cinnabarColor = isDark ? '#A1312E' : '#B23A36';
  
  // Borders / minor lines
  const subtleBorder = isDark ? 'rgba(229, 226, 218, 0.15)' : 'rgba(51, 49, 46, 0.15)';

  const paperMargin = Math.round(width * 0.05);
  const paperPaddingX = Math.round(width * 0.1);
  const paperPaddingY = Math.round(width * 0.12);

  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);
  const headerFontSize = Math.round(width * 0.022);
  const footerFontSize = Math.round(width * 0.024);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        background: canvasBackground,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: paperMargin,
        boxSizing: 'border-box',
        // Force serif fonts heavily for this template
        fontFamily: '"Noto Serif CJK SC", "Noto Serif SC", "Songti SC", "SimSun", "Times New Roman", serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: paperBackground,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          padding: `${paperPaddingY}px ${paperPaddingX}px`,
          boxShadow: isDark 
            ? '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.03)' 
            : '0 8px 30px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Header - simple subtle line and date */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: Math.round(width * 0.06),
            fontSize: headerFontSize,
            color: textColor,
            opacity: 0.6,
            letterSpacing: '0.15em',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: subtleBorder, marginRight: Math.round(width * 0.04) }} />
          <span>{new Date().getFullYear()}</span>
        </div>

        {/* Markdown content container */}
        <div
          data-poster-body
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ lineHeight: 1.9, letterSpacing: '0.02em', height: '100%' }}>
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme={theme}
              color={textColor}
              fontSize={bodyFontSize}
            />
          </div>
        </div>

        {/* Footer - minimal text and a cinnabar seal */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: Math.round(width * 0.08),
            paddingTop: Math.round(width * 0.03),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: Math.round(width * 0.02),
            }}
          >
            <span style={{ fontSize: footerFontSize, opacity: 0.8, letterSpacing: '0.1em' }}>
              撰
            </span>
            <div
              style={{
                width: Math.round(width * 0.04),
                height: Math.round(width * 0.04),
                border: `1.5px solid ${cinnabarColor}`,
                color: cinnabarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: Math.round(width * 0.022),
                fontWeight: 600,
                borderRadius: '2px', // Slight rounding for the "stamp" feel
              }}
            >
              印
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
