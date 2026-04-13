import type { Metadata } from 'next';
import { WriteDeckUseCasesPage } from '@/components/WriteDeckUseCasesPage';
import { getMessages } from '@/i18n/messages';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface WriteDeckUseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WriteDeckUseCasesRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const allMessages = getMessages(locale);
  const messages = allMessages.writedeckUseCases;

  return createMarketingMetadata({
    locale,
    pathname: '/writedeck/use-cases',
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    siteName: allMessages.common.siteName,
  });
}

export default async function WriteDeckUseCasesRoutePage({ params }: WriteDeckUseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <WriteDeckUseCasesPage locale={locale} />;
}
