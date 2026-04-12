import type { Metadata } from 'next';
import { NotesUseCasesPage } from '@/components/NotesUseCasesPage';
import { getMessages } from '@/i18n/messages';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface NotesUseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NotesUseCasesRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const allMessages = getMessages(locale);
  const messages = allMessages.useCases;

  return createMarketingMetadata({
    locale,
    pathname: '/notes/use-cases',
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    siteName: allMessages.common.siteName,
  });
}

export default async function NotesUseCasesRoutePage({ params }: NotesUseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <NotesUseCasesPage locale={locale} />;
}
