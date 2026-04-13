import type { Metadata } from 'next';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { WriteDeckEditor } from '@/components/WriteDeckEditor';
import { resolveRouteLocale } from '@/lib/route-locale';
import { buildWriteDeckHomeSeoGraph, createWriteDeckPageMetadata } from '@/lib/seo/writedeck-marketing-pages';

interface WriteDeckPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WriteDeckPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return createWriteDeckPageMetadata(locale);
}

export default async function WriteDeckPage({ params }: WriteDeckPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return (
    <>
      <SeoJsonLd id={`seo-jsonld-${locale}-writedeck-home`} graph={buildWriteDeckHomeSeoGraph(locale)} />
      <WriteDeckEditor locale={locale} />
    </>
  );
}
