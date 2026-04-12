import type { Metadata } from 'next';
import { StarterGuidePage } from '@/components/StarterGuidePage';
import { getMessages } from '@/i18n/messages';
import { resolveRouteLocale } from '@/lib/route-locale';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';

interface StarterPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: StarterPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);
  const messages = getMessages(locale).starter;

  return createMarketingMetadata({
    locale,
    pathname: '/starter',
    title: messages.metadataTitle,
    description: messages.metadataDescription,
    siteName: getMessages(locale).common.siteName,
  });
}

export default async function StarterPage({ params }: StarterPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return <StarterGuidePage locale={locale} />;
}
