import type { Locale } from '@/i18n/config';
import { AppPageContainer } from '@/components/app-page-shell';
import { UseCasesHubSection } from '@/components/UseCasesHubSection';

interface UseCasesPageProps {
  locale: Locale;
}

export function UseCasesPage({ locale }: UseCasesPageProps) {
  return (
    <AppPageContainer variant="marketing">
      <UseCasesHubSection locale={locale} />
    </AppPageContainer>
  );
}
