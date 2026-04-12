import type { Metadata } from 'next';
import { ClipboardSharePage } from '@/linkdisk/components/ClipboardSharePage';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_BASE_PATH } from '@/linkdisk/lib/clipboard';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface ClipboardShareRoutePageProps {
  params: Promise<{ locale: string; shareId: string }>;
}

export async function generateMetadata({ params }: ClipboardShareRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale, shareId } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: `${LINKDISK_BASE_PATH}/s/${shareId}`,
    title: messages.routeMeta.share.title,
    description: messages.routeMeta.share.description,
    siteName: messages.common.siteName,
    includeSocialImages: false,
    index: false,
    follow: false,
  });
}

export default async function ClipboardShareRoutePage({ params }: ClipboardShareRoutePageProps) {
  const { locale: requestedLocale, shareId } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <ClipboardSharePage locale={locale} shareId={shareId} />;
}
