import type { Locale } from '@/i18n/config';
import { AppPageContainer } from '@/components/app-page-shell';
import { UseCasesHubSection } from '@/components/UseCasesHubSection';

interface UseCasesPageProps {
  locale: Locale;
  titleAs?: 'h1' | 'h2';
}

export function UseCasesPage({ locale, titleAs = 'h2' }: UseCasesPageProps) {
  return (
    <AppPageContainer variant="marketing">
      <UseCasesHubSection locale={locale} titleAs={titleAs} />
    </AppPageContainer>
  );
}
