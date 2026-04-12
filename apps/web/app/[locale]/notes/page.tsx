import type { Metadata } from 'next';
import { MarkdownPosterEditor } from '@/components/MarkdownPosterEditor';
import { getMessages } from '@/i18n/messages';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface NotesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale).notes;

  return createMarketingMetadata({
    locale,
    pathname: '/notes',
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    siteName: getMessages(locale).common.siteName,
  });
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <MarkdownPosterEditor locale={locale} />;
}
