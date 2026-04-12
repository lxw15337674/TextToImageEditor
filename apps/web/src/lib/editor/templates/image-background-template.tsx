import { PosterMarkdownBody } from '@/lib/editor/templates/poster-markdown-body';
import { getPosterBodyFontSize } from '@/lib/editor/templates/template-typography';
import type { PosterTemplateProps } from '@/lib/editor/templates/template-types';

export function ImageBackgroundTemplate({ content, contentFormat, width, height, theme, fontSizePreset, pageIndex, pageCount }: PosterTemplateProps) {
  const isDark = theme === 'dark';
  const bodyFontSize = getPosterBodyFontSize(width, fontSizePreset);

  return (
    <div
      data-poster-root
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 46%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f97316 0%, #fb7185 46%, #38bdf8 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(circle at 20% 20%, rgba(125,211,252,0.18), transparent 28%), radial-gradient(circle at 80% 80%, rgba(244,114,182,0.14), transparent 30%)'
            : 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.26), transparent 24%), radial-gradient(circle at 80% 80%, rgba(15,23,42,0.14), transparent 26%)',
          backdropFilter: 'blur(0px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark ? 'rgba(2, 6, 23, 0.34)' : 'rgba(15, 23, 42, 0.22)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: Math.round(width * 0.065),
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: Math.round(width * 0.025), opacity: 0.86 }}>Share image</div>

        <div
          data-poster-body
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: Math.round(width * 0.04),
            borderRadius: Math.round(width * 0.028),
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <PosterMarkdownBody
            content={content}
            contentFormat={contentFormat}
            theme={theme}
            color="#ffffff"
            fontSize={bodyFontSize}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: Math.round(width * 0.024), opacity: 0.86 }}>
          <span>Saved locally</span>
          <span>
            {pageIndex}/{pageCount}
          </span>
        </div>
      </div>
    </div>
  );
}
