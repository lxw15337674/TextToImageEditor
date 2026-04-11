import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { StarterNotesPage } from '@/components/StarterNotesPage';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface NotesPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const messages = getMessages(locale).notes;
  const absoluteCanonical = toAbsoluteUrl(`/${locale}/notes`);

  return {
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates('/notes'),
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return <StarterNotesPage locale={locale} />;
}
