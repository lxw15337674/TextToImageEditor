import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { UseCasesPage } from '@/components/UseCasesPage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface UseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: UseCasesRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const allMessages = getMessages(locale);
  const messages = allMessages.useCases;
  const absoluteCanonical = toAbsoluteUrl(`/${locale}/use-cases`);
  const openGraphImageUrl = toAbsoluteUrl(`/${locale}/opengraph-image`);
  const twitterImageUrl = toAbsoluteUrl(`/${locale}/twitter-image`);

  return {
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates('/use-cases'),
    },
    openGraph: {
      type: 'website',
      url: absoluteCanonical,
      title: messages.metadataTitle,
      description: messages.metadataDescription,
      siteName: allMessages.common.siteName,
      images: [
        {
          url: openGraphImageUrl,
          width: 1200,
          height: 630,
          alt: `${allMessages.common.siteName} social preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.metadataTitle,
      description: messages.metadataDescription,
      images: [
        {
          url: twitterImageUrl,
          alt: `${allMessages.common.siteName} social preview`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function UseCasesRoutePage({ params }: UseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return <UseCasesPage locale={locale} />;
}
