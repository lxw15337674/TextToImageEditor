import { ImageResponse } from 'next/og';
import { hasLocale } from 'next-intl';
import { getMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';

export const alt = 'MintyHub social preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface OpenGraphImageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(input: string) {
  return hasLocale(routing.locales, input) ? input : routing.defaultLocale;
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

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);

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
              maxWidth: 940,
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
                ST
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: -1,
                }}
              >
                {messages.common.siteName}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 62,
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: -2.5,
                maxWidth: 980,
                textWrap: 'balance',
              }}
            >
              {messages.home.metadataDescription}
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
            {[messages.common.siteTagline, messages.common.navStarter, messages.common.navNotes].map((item) => (
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
    size,
  );
}
