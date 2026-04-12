import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

function splitCalendarEssaySections(blocks: string[]) {
  const normalizedBlocks = blocks.map((block) => block.trim()).filter(Boolean);

  if (normalizedBlocks.length <= 1) {
    return {
      bodyBlocks: normalizedBlocks,
      footerLines: [] as string[],
    };
  }

  const footerLines: string[] = [];

  for (let index = normalizedBlocks.length - 1; index >= 0 && footerLines.length < 3; index -= 1) {
    const candidate = normalizedBlocks[index]?.replace(/\n+/g, ' ').trim() ?? '';

    if (!candidate) {
      break;
    }

    const isTooLong = candidate.length > 20;
    const looksLikeBodyText = /[。！？；：,.!?;:]/.test(candidate);

    if (isTooLong || looksLikeBodyText) {
      break;
    }

    footerLines.unshift(candidate);
  }

  if (footerLines.length === 0 || footerLines.length >= normalizedBlocks.length) {
    return {
      bodyBlocks: normalizedBlocks,
      footerLines: [] as string[],
    };
  }

  return {
    bodyBlocks: normalizedBlocks.slice(0, normalizedBlocks.length - footerLines.length),
    footerLines,
  };
}

export function CalendarEssayTemplate({ blocks, contentFormat, width, height, theme, fontSizePreset }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const { bodyBlocks, footerLines } = splitCalendarEssaySections(blocks);
  const bodyContent = bodyBlocks.join('\n\n');
  const date = new Date();
  const day = String(date.getDate());
  const monthYear = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date).toUpperCase();
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(date);

  const baseTextColor = isDark ? '#f2ece6' : '#2e241d';
  const mutedTextColor = isDark ? '#d5cfc9' : '#4a413d';
  const subtleTextColor = isDark ? '#a59d97' : '#9a9a9a';
  const dividerColor = isDark ? 'rgba(242, 236, 230, 0.24)' : 'rgba(40, 33, 28, 0.22)';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        padding: `${Math.round(width * 0.085)}px ${Math.round(width * 0.09)}px ${Math.round(width * 0.072)}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: Math.round(width * 0.032),
        background: isDark ? '#171413' : '#ededed',
        color: baseTextColor,
        fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, STSong, serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: Math.round(height * 0.016),
          gap: Math.round(width * 0.005),
        }}
      >
        <div
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.19),
            lineHeight: 0.95,
            letterSpacing: '-0.05em',
            fontWeight: 700,
            color: baseTextColor,
          }}
        >
          {day}
        </div>
        <div
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: Math.round(width * 0.062),
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            fontWeight: 700,
            color: baseTextColor,
          }}
        >
          {monthYear}
        </div>
        <div
          style={{
            fontSize: Math.round(width * 0.047),
            fontWeight: 600,
            lineHeight: 1.25,
            color: mutedTextColor,
          }}
        >
          {weekday}
        </div>
      </div>

      <div
        style={{
          alignSelf: 'center',
          width: Math.round(width * 0.14),
          height: 2,
          background: dividerColor,
          marginTop: Math.round(height * 0.006),
          marginBottom: Math.round(height * 0.018),
        }}
      />

      <div
        data-poster-body
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <PosterMarkdownBody
          content={bodyContent}
          contentFormat={contentFormat}
          theme={theme}
          color={baseTextColor}
          fontSize={bodyFontSize}
        />
      </div>

      {footerLines.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: Math.round(width * 0.004),
            textAlign: 'center',
            paddingTop: Math.round(height * 0.008),
          }}
        >
          {footerLines.map((line, index) => (
            <p
              key={`${line}-${index}`}
              style={{
                margin: 0,
                fontSize: Math.round(width * 0.057),
                lineHeight: 1.35,
                fontWeight: index === 0 ? 600 : 500,
                color: index === footerLines.length - 1 ? subtleTextColor : mutedTextColor,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
