import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { StarterGuidePage } from '@/components/StarterGuidePage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface StarterPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: StarterPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale).starter;
  const absoluteCanonical = toAbsoluteUrl(`/${locale}/starter`);

  return {
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates('/starter'),
    },
  };
}

export default async function StarterPage({ params }: StarterPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return <StarterGuidePage locale={locale} />;
}
