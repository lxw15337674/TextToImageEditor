import { Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import 'react-medium-image-zoom/dist/styles.css';
import '../globals.css';
import { AppShellHeader } from '@/components/AppShellHeader';
import { HtmlLangSync } from '@/components/HtmlLangSync';
import { QueryProvider } from '@/components/query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { LOCALES } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getHtmlLang } from '@/i18n/locale-meta';
import { resolveLocaleForMetadata, resolveRouteLocale } from '@/lib/route-locale';
import { getSiteOrigin } from '@/lib/seo/site-origin';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap' });
const metadataBase = getSiteOrigin();

export const dynamicParams = false;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

function GoogleAnalyticsScript({ gaId }: { gaId: string }) {
  const encodedGaId = encodeURIComponent(gaId);

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${encodedGaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: [
            'window.dataLayer = window.dataLayer || [];',
            'function gtag(){dataLayer.push(arguments);}',
            "gtag('js', new Date());",
            `gtag('config', ${JSON.stringify(gaId)});`,
          ].join(''),
        }}
      />
    </>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocaleForMetadata(requestedLocale);
  const messages = getMessages(locale);
  const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase,
    title: {
      default: messages.common.siteName,
      template: `%s | ${messages.common.siteName}`,
    },
    description: messages.home.metadataDescription,
    keywords: [...messages.home.metadataKeywords],
    verification: googleSiteVerification
      ? {
          google: googleSiteVerification,
        }
      : undefined,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const gaId =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
      : undefined;

  return (
    <html lang={getHtmlLang(locale)} suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} flex min-h-screen flex-col bg-background text-foreground antialiased`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <HtmlLangSync />
            <AppShellHeader locale={locale} />
            {children}
            <Toaster richColors position="top-center" />
            {gaId ? <GoogleAnalyticsScript gaId={gaId} /> : null}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
