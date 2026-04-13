import type { Metadata } from 'next';
import { WriteDeckEditor } from '@/components/WriteDeckEditor';
import { getMessages } from '@/i18n/messages';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface WriteDeckPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WriteDeckPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale).writedeck;

  return createMarketingMetadata({
    locale,
    pathname: '/writedeck',
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    siteName: getMessages(locale).common.siteName,
  });
}

export default async function WriteDeckPage({ params }: WriteDeckPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <WriteDeckEditor locale={locale} />;
}
