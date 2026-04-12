import type { Metadata } from 'next';
import { ClipboardRecentPage } from '@/linkdisk/components/ClipboardRecentPage';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_RECENT_PATH } from '@/linkdisk/lib/clipboard';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface ClipboardRecentRoutePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ClipboardRecentRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: LINKDISK_RECENT_PATH,
    title: messages.routeMeta.recent.title,
    description: messages.routeMeta.recent.description,
    siteName: messages.common.siteName,
    includeSocialImages: false,
    index: false,
    follow: false,
  });
}

export default async function ClipboardRecentRoutePage({ params }: ClipboardRecentRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <ClipboardRecentPage locale={locale} />;
}
