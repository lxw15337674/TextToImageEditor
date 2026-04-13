import { permanentRedirect } from 'next/navigation';
import { resolveRouteLocale } from '@/lib/route-locale';

interface UseCasesRoutePageProps {
  params: Promise<{ locale: string }>;
}

export default async function UseCasesRoutePage({ params }: UseCasesRoutePageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveRouteLocale(requestedLocale);

  permanentRedirect(`/${locale}`);
}
