import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_BASE_PATH } from '@/linkdisk/lib/clipboard';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface ClipboardAttachmentOpenRoutePageProps {
  params: Promise<{ locale: string; shareId: string; attachmentId: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}

export async function generateMetadata({ params }: ClipboardAttachmentOpenRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale, shareId, attachmentId } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);
  const absoluteCanonical = toAbsoluteUrl(`/${locale}${LINKDISK_BASE_PATH}/s/${shareId}/a/${attachmentId}`);

  return {
    title: messages.routeMeta.attachment.title,
    description: messages.routeMeta.attachment.description,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates(`${LINKDISK_BASE_PATH}/s/${shareId}/a/${attachmentId}`),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ClipboardAttachmentOpenRoutePage({ params }: ClipboardAttachmentOpenRoutePageProps) {
  const { locale: requestedLocale, shareId, attachmentId } = await params;
  const locale = resolveLocale(requestedLocale);
  const parsedAttachmentId = Number(attachmentId);
  if (!Number.isInteger(parsedAttachmentId) || parsedAttachmentId < 0) {
    notFound();
  }
  redirect(`/${locale}${LINKDISK_BASE_PATH}/s/${encodeURIComponent(shareId)}`);
}
