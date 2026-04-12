import type { Metadata } from 'next';
import { SeoJsonLd } from '@/linkdisk/components/SeoJsonLd';
import { UseCasesPage } from '@/linkdisk/components/UseCasesPage';
import { resolveRouteLocale } from '@/lib/route-locale';
import {
  buildUseCasesPageSeoGraph,
  createUseCasesPageMetadata
} from '@/linkdisk/lib/seo/marketing-pages';

interface UseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: UseCasesRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return createUseCasesPageMetadata(locale);
}

export default async function UseCasesRoutePage({ params }: UseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  return (
    <>
      <SeoJsonLd id={`seo-jsonld-${locale}-use-cases`} graph={buildUseCasesPageSeoGraph(locale)} />
      <UseCasesPage locale={locale} />
    </>
  );
}
