import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { ClipboardRecentPage } from '@/linkdisk/components/ClipboardRecentPage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_RECENT_PATH } from '@/linkdisk/lib/clipboard';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface ClipboardRecentRoutePageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}

export async function generateMetadata({ params }: ClipboardRecentRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);
  const absoluteCanonical = toAbsoluteUrl(`/${locale}${LINKDISK_RECENT_PATH}`);

  return {
    title: messages.routeMeta.recent.title,
    description: messages.routeMeta.recent.description,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates(LINKDISK_RECENT_PATH),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ClipboardRecentRoutePage({ params }: ClipboardRecentRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return <ClipboardRecentPage locale={locale} />;
}
