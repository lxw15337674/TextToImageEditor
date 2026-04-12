import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { SeoJsonLd } from '@/linkdisk/components/SeoJsonLd';
import { UseCasesPage } from '@/linkdisk/components/UseCasesPage';
import type { Locale } from '@/i18n/config';
import { routing } from '@/i18n/routing';
import {
  buildUseCasesPageSeoGraph,
  createUseCasesPageMetadata
} from '@/linkdisk/lib/seo/marketing-pages';

interface UseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: UseCasesRoutePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return createUseCasesPageMetadata(locale);
}

export default async function UseCasesRoutePage({ params }: UseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);

  return (
    <>
      <SeoJsonLd id={`seo-jsonld-${locale}-use-cases`} graph={buildUseCasesPageSeoGraph(locale)} />
      <UseCasesPage locale={locale} />
    </>
  );
}
