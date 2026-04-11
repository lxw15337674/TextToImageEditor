import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { StarterHomePage } from '@/components/StarterHomePage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface LocaleIndexPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: LocaleIndexPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);
  const absoluteCanonical = toAbsoluteUrl(`/${locale}`);
  const openGraphImageUrl = toAbsoluteUrl(`/${locale}/opengraph-image`);
  const twitterImageUrl = toAbsoluteUrl(`/${locale}/twitter-image`);

  return {
    title: {
      absolute: messages.home.metadataTitle,
    },
    description: messages.home.metadataDescription,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates('/'),
    },
    openGraph: {
      type: 'website',
      url: absoluteCanonical,
      title: messages.home.metadataTitle,
      description: messages.home.metadataDescription,
      siteName: messages.common.siteName,
      images: [
        {
          url: openGraphImageUrl,
          width: 1200,
          height: 630,
          alt: `${messages.common.siteName} social preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.home.metadataTitle,
      description: messages.home.metadataDescription,
      images: [
        {
          url: twitterImageUrl,
          alt: `${messages.common.siteName} social preview`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleIndexPage({ params }: LocaleIndexPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return <StarterHomePage locale={locale} />;
}
