import type { Metadata } from 'next';
import { StarterHomePage } from '@/components/StarterHomePage';
import { getMessages } from '@/i18n/messages';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface LocaleIndexPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleIndexPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale);

  return createMarketingMetadata({
    locale,
    pathname: '/',
    title: messages.useCasesHub.metadataTitle,
    description: messages.useCasesHub.metadataDescription,
    siteName: messages.common.siteName,
    absoluteTitle: true,
  });
}

export default async function LocaleIndexPage({ params }: LocaleIndexPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <StarterHomePage locale={locale} />;
}
