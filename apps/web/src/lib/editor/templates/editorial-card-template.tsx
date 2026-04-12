import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function EditorialCardTemplate({ content, contentFormat, width, height, theme, fontSizePreset, pageIndex, pageCount }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark
    ? 'radial-gradient(circle at top left, rgba(120, 138, 163, 0.18), transparent 34%), linear-gradient(180deg, #11151c 0%, #1b222d 100%)'
    : 'radial-gradient(circle at top left, rgba(202, 177, 142, 0.22), transparent 30%), linear-gradient(180deg, #f5efe7 0%, #ece4d8 100%)';
  const cardBackground = isDark ? 'rgba(24, 29, 37, 0.92)' : 'rgba(255, 252, 247, 0.92)';
  const cardBorder = isDark ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(148, 163, 184, 0.22)';
  const textColor = isDark ? '#f5f1ea' : '#1f2937';
  const mutedColor = isDark ? 'rgba(226, 232, 240, 0.68)' : 'rgba(71, 85, 105, 0.72)';
  const cardRadius = Math.round(width * 0.04);
  const cardPaddingX = Math.round(width * 0.075);
  const cardPaddingY = Math.round(width * 0.08);
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

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
        padding: Math.round(width * 0.045),
        boxSizing: 'border-box',
        fontFamily: 'Instrument Serif, Cormorant Garamond, Noto Serif SC, Georgia, serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: cardRadius,
          background: cardBackground,
          border: cardBorder,
          boxShadow: isDark ? '0 30px 80px rgba(3, 7, 18, 0.45)' : '0 30px 80px rgba(120, 113, 108, 0.18)',
          backdropFilter: 'blur(12px)',
          padding: `${cardPaddingY}px ${cardPaddingX}px`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: isDark
              ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.08), transparent 46%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.35), transparent 46%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Math.round(width * 0.05),
            color: mutedColor,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: Math.round(width * 0.019),
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <span>Editorial Card</span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div
          data-poster-body
          style={{
            position: 'relative',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: Math.round(width * 0.035),
            }}
          >
            <div
              style={{
                width: Math.round(width * 0.12),
                height: 2,
                background: isDark ? 'rgba(226, 232, 240, 0.28)' : 'rgba(71, 85, 105, 0.24)',
              }}
            />
            <PosterMarkdownBody
              content={content}
              contentFormat={contentFormat}
              theme={theme}
              color={textColor}
              fontSize={bodyFontSize}
            />
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: Math.round(width * 0.055),
            color: mutedColor,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: Math.round(width * 0.02),
            letterSpacing: '0.08em',
          }}
        >
          <span>Local first poster</span>
          <span>
            {pageIndex}/{pageCount}
          </span>
        </div>
      </div>
    </div>
  );
}
