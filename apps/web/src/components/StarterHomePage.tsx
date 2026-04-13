import { UseCasesPage } from '@/components/UseCasesPage';
import type { Locale } from '@/i18n/config';

interface StarterHomePageProps {
  locale: Locale;
}

export function StarterHomePage({ locale }: StarterHomePageProps) {
  return <UseCasesPage locale={locale} />;
}
