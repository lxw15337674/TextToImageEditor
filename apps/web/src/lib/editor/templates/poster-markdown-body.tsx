import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resolvePosterBodyLayout } from '@/lib/editor/templates/poster-body-layout';
import type { PosterBodyLayoutConfig } from '@/lib/editor/templates/template-types';
import type { ContentFormat, ExportTheme } from '@/lib/editor/types';

interface PosterMarkdownBodyProps {
  content: string;
  contentFormat: ContentFormat;
  theme: ExportTheme;
  color: string;
  fontSize: number;
  bodyLayout?: PosterBodyLayoutConfig;
}

function splitPlainTextParagraphs(content: string) {
  const normalized = content.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  return normalized.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function PosterMarkdownBody({
  content,
  contentFormat,
  theme,
  color,
  fontSize,
  bodyLayout,
}: PosterMarkdownBodyProps) {
  const isDark = theme === 'dark';
  const resolvedBodyLayout = resolvePosterBodyLayout(bodyLayout);
  const accentColor = isDark ? '#cbd5e1' : '#334155';
  const mutedColor = isDark ? 'rgba(226, 232, 240, 0.72)' : 'rgba(51, 65, 85, 0.72)';
  const inlineCodeBackground = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)';
  const blockCodeBackground = isDark ? 'rgba(15, 23, 42, 0.52)' : 'rgba(255, 255, 255, 0.72)';
  const ruleColor = isDark ? 'rgba(226, 232, 240, 0.18)' : 'rgba(51, 65, 85, 0.16)';
  const blockGap = Math.max(16, Math.round(fontSize * 0.7));
  const headingGap = Math.max(16, Math.round(fontSize * 0.58));
  const listPadding = Math.max(24, Math.round(fontSize * 1.15));
  const codeFontSize = Math.max(12, Math.round(fontSize * 0.72));
  const rootStyle = {
    width: '100%',
    color,
    fontSize,
    lineHeight: 1.72,
    direction: 'ltr' as const,
    writingMode: 'horizontal-tb' as const,
    textOrientation: 'mixed' as const,
    textAlign: resolvedBodyLayout.textAlign,
  };

  if (contentFormat === 'plain') {
    const paragraphs = splitPlainTextParagraphs(content);

    return (
      <div style={{ ...rootStyle, display: 'flex', flexDirection: 'column', gap: blockGap }}>
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 24)}`}
            style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div style={rootStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                margin: `0 0 ${headingGap}px`,
                fontSize: Math.round(fontSize * 1.9),
                lineHeight: 1.14,
                letterSpacing: '-0.03em',
                fontWeight: 700,
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                margin: `0 0 ${headingGap}px`,
                fontSize: Math.round(fontSize * 1.55),
                lineHeight: 1.18,
                letterSpacing: '-0.025em',
                fontWeight: 700,
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                margin: `0 0 ${Math.round(headingGap * 0.9)}px`,
                fontSize: Math.round(fontSize * 1.25),
                lineHeight: 1.22,
                fontWeight: 700,
              }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              style={{
                margin: `0 0 ${blockGap}px`,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul
              style={{
                margin: `0 0 ${blockGap}px`,
                paddingLeft: listPadding,
                textAlign: 'left',
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                margin: `0 0 ${blockGap}px`,
                paddingLeft: listPadding,
                textAlign: 'left',
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              style={{
                margin: `0 0 ${Math.max(10, Math.round(blockGap * 0.35))}px`,
              }}
            >
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                margin: `0 0 ${blockGap}px`,
                paddingLeft: Math.max(18, Math.round(fontSize * 0.85)),
                borderLeft: `3px solid ${ruleColor}`,
                color: mutedColor,
              }}
            >
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong
              style={{
                fontWeight: 700,
                color: accentColor,
              }}
            >
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em
              style={{
                fontStyle: 'italic',
              }}
            >
              {children}
            </em>
          ),
          code: ({ children, className }) => {
            if (className) {
              return (
                <code
                  style={{
                    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: codeFontSize,
                  }}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                style={{
                  padding: '0.18em 0.38em',
                  borderRadius: 8,
                  background: inlineCodeBackground,
                  fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: codeFontSize,
                }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              style={{
                margin: `0 0 ${blockGap}px`,
                padding: `${Math.max(14, Math.round(fontSize * 0.7))}px`,
                borderRadius: 18,
                background: blockCodeBackground,
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                textAlign: 'left',
              }}
            >
              {children}
            </pre>
          ),
          hr: () => (
            <hr
              style={{
                margin: `${blockGap}px 0`,
                border: 'none',
                borderTop: `1px solid ${ruleColor}`,
              }}
            />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              style={{
                color: accentColor,
                textDecoration: 'underline',
                textUnderlineOffset: '0.16em',
              }}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src ?? ''}
              alt={alt ?? ''}
              style={{
                display: 'block',
                width: '100%',
                borderRadius: 20,
                margin: `0 0 ${blockGap}px`,
                objectFit: 'cover',
              }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
