import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function TicketStubTemplate({ content, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const canvasBackground = isDark ? '#09090b' : '#f8fafc';
  const ticketBackground = isDark ? '#111827' : '#fffef8';
  const ticketBorder = isDark ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(148, 163, 184, 0.22)';
  const textColor = isDark ? '#f8fafc' : '#111827';
  const mutedColor = isDark ? 'rgba(203, 213, 225, 0.68)' : 'rgba(71, 85, 105, 0.72)';
  const dividerColor = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.26)';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  const barcodePattern = [4, 1, 2, 1, 3, 1, 5, 2, 2, 1, 4, 1, 2, 3, 1, 2, 5, 1, 3, 2, 1, 4, 2, 1];

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        background: canvasBackground,
        padding: `${Math.round(width * 0.06)}px`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: Math.round(width * 0.72),
          borderRadius: Math.round(width * 0.035),
          overflow: 'hidden',
          background: ticketBackground,
          border: ticketBorder,
          boxShadow: isDark ? '0 24px 80px rgba(0, 0, 0, 0.44)' : '0 24px 80px rgba(15, 23, 42, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -Math.round(width * 0.014),
            top: Math.round(height * 0.26),
            width: Math.round(width * 0.028),
            height: Math.round(width * 0.028),
            borderRadius: 999,
            background: canvasBackground,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -Math.round(width * 0.014),
            top: Math.round(height * 0.26),
            width: Math.round(width * 0.028),
            height: Math.round(width * 0.028),
            borderRadius: 999,
            background: canvasBackground,
          }}
        />

        <div
          style={{
            padding: `${Math.round(width * 0.04)}px ${Math.round(width * 0.05)}px`,
            borderBottom: `2px dashed ${dividerColor}`,
          }}
        >
          <div
            style={{
              fontSize: Math.round(width * 0.014),
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: mutedColor,
              marginBottom: Math.round(width * 0.01),
            }}
          >
            Official Entrance Ticket
          </div>
          <div
            style={{
              fontSize: Math.round(width * 0.05),
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Entry Pass
          </div>
        </div>

        <div
          data-poster-body
          data-poster-measure
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: `${Math.round(width * 0.045)}px ${Math.round(width * 0.05)}px`,
            boxSizing: 'border-box',
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
            borderTop: ticketBorder,
            padding: `${Math.round(width * 0.028)}px ${Math.round(width * 0.05)}px ${Math.round(width * 0.034)}px`,
            display: 'flex',
            alignItems: 'flex-end',
            gap: Math.round(width * 0.03),
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                height: Math.round(width * 0.085),
                gap: 2,
              }}
            >
              {barcodePattern.map((barWidth, index) => (
                <span
                  key={`${barWidth}-${index}`}
                  style={{
                    display: 'block',
                    width: barWidth,
                    height: '100%',
                    background: isDark ? '#cbd5e1' : '#0f172a',
                    opacity: index % 3 === 0 ? 0.95 : 0.75,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                color: mutedColor,
                fontSize: Math.round(width * 0.013),
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              TKT-042-A1
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                color: mutedColor,
                fontSize: Math.round(width * 0.013),
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Page
            </div>
            <div style={{ fontSize: Math.round(width * 0.035), fontWeight: 700 }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
