import type { Metadata } from 'next';
import { ClipboardEditorPage } from '@/linkdisk/components/ClipboardEditorPage';
import { SeoJsonLd } from '@/linkdisk/components/SeoJsonLd';
import { getMessages } from '@/linkdisk/i18n/messages';
import { buildHomeSeoGraph, LINKDISK_BASE_PATH } from '@/linkdisk/lib/seo/marketing-pages';
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
    pathname: LINKDISK_BASE_PATH,
    title: messages.home.metadataTitle,
    description: messages.home.metadataDescription,
    siteName: messages.common.siteName,
    absoluteTitle: true,
  });
}

export default async function LocaleIndexPage({ params }: LocaleIndexPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return (
    <>
      <SeoJsonLd id={`seo-jsonld-${locale}-home`} graph={buildHomeSeoGraph(locale)} />
      <ClipboardEditorPage locale={locale} />
    </>
  );
}
