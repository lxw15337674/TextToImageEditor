import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { ClipboardEditorPage } from '@/linkdisk/components/ClipboardEditorPage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/linkdisk/i18n/messages';
import { LINKDISK_BASE_PATH } from '@/linkdisk/lib/clipboard';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface ClipboardManagePageProps {
  params: Promise<{ locale: string; manageId: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}

export async function generateMetadata({ params }: ClipboardManagePageProps): Promise<Metadata> {
  const { locale: requestedLocale, manageId } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale);
  const absoluteCanonical = toAbsoluteUrl(`/${locale}${LINKDISK_BASE_PATH}/m/${manageId}`);

  return {
    title: messages.routeMeta.manage.title,
    description: messages.routeMeta.manage.description,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates(`${LINKDISK_BASE_PATH}/m/${manageId}`),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ClipboardManagePage({ params }: ClipboardManagePageProps) {
  const { locale: requestedLocale, manageId } = await params;
  const locale = resolveLocale(requestedLocale);

  return <ClipboardEditorPage locale={locale} manageId={manageId} />;
}
