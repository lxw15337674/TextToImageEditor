import { ImageResponse } from 'next/og';

export const SOCIAL_IMAGE_ALT = 'Social preview image';
export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};
export const SOCIAL_IMAGE_CONTENT_TYPE = 'image/png';

interface CreatePageSocialImageOptions {
  description: string;
  locale: string;
  siteName: string;
  tags?: string[];
  title: string;
}

function getLocaleBadge(locale: string) {
  switch (locale) {
    case 'zh':
      return 'ZH';
    case 'es':
      return 'ES';
    case 'ja':
      return 'JA';
    default:
      return 'EN';
  }
}

export function createPageSocialImage({ description, locale, siteName, tags = [], title }: CreatePageSocialImageOptions) {
  const filteredTags = tags.filter((tag) => tag.trim().length > 0).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 40%, #dbeafe 100%)',
          color: '#0f172a',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top right, rgba(14, 165, 233, 0.24), transparent 34%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.18), transparent 30%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 56,
            display: 'flex',
            border: '1px solid rgba(15, 23, 42, 0.12)',
            borderRadius: 999,
            padding: '12px 18px',
            background: 'rgba(255, 255, 255, 0.72)',
            fontSize: 24,
            letterSpacing: 2,
            color: '#0369a1',
          }}
        >
          {getLocaleBadge(locale)}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              maxWidth: 980,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  background: 'rgba(14, 165, 233, 0.12)',
                  border: '1px solid rgba(14, 165, 233, 0.24)',
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#0284c7',
                }}
              >
                {siteName.slice(0, 2).toUpperCase()}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: -1,
                }}
              >
                {siteName}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 58,
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: -2.5,
                maxWidth: 980,
                textWrap: 'balance',
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 28,
                lineHeight: 1.35,
                color: '#334155',
                maxWidth: 980,
                textWrap: 'balance',
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {filteredTags.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 999,
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  background: 'rgba(255, 255, 255, 0.72)',
                  padding: '12px 20px',
                  fontSize: 24,
                  color: '#334155',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    SOCIAL_IMAGE_SIZE,
  );
}
