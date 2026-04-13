import type { Metadata } from 'next';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { WriteDeckUseCasesPage } from '@/components/WriteDeckUseCasesPage';
import { resolveRouteLocale } from '@/lib/route-locale';
import {
  buildWriteDeckUseCasesSeoGraph,
  createWriteDeckUseCasesMetadata,
} from '@/lib/seo/writedeck-marketing-pages';

interface WriteDeckUseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WriteDeckUseCasesRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return createWriteDeckUseCasesMetadata(locale);
}

export default async function WriteDeckUseCasesRoutePage({ params }: WriteDeckUseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return (
    <>
      <SeoJsonLd id={`seo-jsonld-${locale}-writedeck-use-cases`} graph={buildWriteDeckUseCasesSeoGraph(locale)} />
      <WriteDeckUseCasesPage locale={locale} />
    </>
  );
}
