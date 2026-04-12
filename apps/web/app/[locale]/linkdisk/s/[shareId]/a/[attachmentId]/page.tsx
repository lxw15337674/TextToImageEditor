import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_BASE_PATH } from '@/linkdisk/lib/clipboard';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface ClipboardAttachmentOpenRoutePageProps {
  params: Promise<{ locale: string; shareId: string; attachmentId: string }>;
}

export async function generateMetadata({ params }: ClipboardAttachmentOpenRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale, shareId, attachmentId } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: `${LINKDISK_BASE_PATH}/s/${shareId}/a/${attachmentId}`,
    title: messages.routeMeta.attachment.title,
    description: messages.routeMeta.attachment.description,
    siteName: messages.common.siteName,
    includeSocialImages: false,
    index: false,
    follow: false,
  });
}

export default async function ClipboardAttachmentOpenRoutePage({ params }: ClipboardAttachmentOpenRoutePageProps) {
  const { locale: requestedLocale, shareId, attachmentId } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const parsedAttachmentId = Number(attachmentId);
  if (!Number.isInteger(parsedAttachmentId) || parsedAttachmentId < 0) {
    notFound();
  }
  redirect(`/${locale}${LINKDISK_BASE_PATH}/s/${encodeURIComponent(shareId)}`);
}
