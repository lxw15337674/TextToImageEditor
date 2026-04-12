import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { ClipboardSharePage } from '@/linkdisk/components/ClipboardSharePage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_BASE_PATH } from '@/linkdisk/lib/clipboard';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface ClipboardShareRoutePageProps {
  params: Promise<{ locale: string; shareId: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}

export async function generateMetadata({ params }: ClipboardShareRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale, shareId } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);
  const absoluteCanonical = toAbsoluteUrl(`/${locale}${LINKDISK_BASE_PATH}/s/${shareId}`);

  return {
    title: messages.routeMeta.share.title,
    description: messages.routeMeta.share.description,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates(`${LINKDISK_BASE_PATH}/s/${shareId}`),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ClipboardShareRoutePage({ params }: ClipboardShareRoutePageProps) {
  const { locale: requestedLocale, shareId } = await params;
  const locale = resolveLocale(requestedLocale);

  return <ClipboardSharePage locale={locale} shareId={shareId} />;
}
