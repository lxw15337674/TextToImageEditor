import type { Metadata } from 'next';
import { ClipboardEditorPage } from '@/linkdisk/components/ClipboardEditorPage';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_BASE_PATH } from '@/linkdisk/lib/clipboard';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface ClipboardManagePageProps {
  params: Promise<{ locale: string; manageId: string }>;
}

export async function generateMetadata({ params }: ClipboardManagePageProps): Promise<Metadata> {
  const { locale: requestedLocale, manageId } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: `${LINKDISK_BASE_PATH}/m/${manageId}`,
    title: messages.routeMeta.manage.title,
    description: messages.routeMeta.manage.description,
    siteName: messages.common.siteName,
    includeSocialImages: false,
    index: false,
    follow: false,
  });
}

export default async function ClipboardManagePage({ params }: ClipboardManagePageProps) {
  const { locale: requestedLocale, manageId } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <ClipboardEditorPage locale={locale} manageId={manageId} />;
}
