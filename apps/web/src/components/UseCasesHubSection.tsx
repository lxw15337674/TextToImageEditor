import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { PagePanel, PageSection, SectionIntro } from '@/components/app-page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UseCasesHubSectionProps {
  id?: string;
  locale: Locale;
  titleAs?: 'h1' | 'h2';
}

export function UseCasesHubSection({ id, locale, titleAs = 'h2' }: UseCasesHubSectionProps) {
  const messages = getMessages(locale).useCasesHub;
  const TitleTag = titleAs;

  return (
    <PageSection id={id}>
      <PagePanel className="space-y-5">
        <SectionIntro
          eyebrow={messages.eyebrow}
          title={<TitleTag className="max-w-4xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{messages.title}</TitleTag>}
          description={messages.description}
          className="space-y-3"
          titleClassName="max-w-4xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          descriptionClassName="max-w-3xl text-base"
        />
      </PagePanel>

      <PageSection className="grid gap-4 lg:grid-cols-2" spacing="none">
        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-5 p-6 sm:p-7">
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl">{messages.writedeckTitle}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                {messages.writedeckDescription}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href={withLocalePrefix('/writedeck', locale)}>
                  {messages.writedeckAppCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href={withLocalePrefix('/writedeck/use-cases', locale)}>
                  {messages.writedeckCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-5 p-6 sm:p-7">
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl">{messages.linkdiskTitle}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                {messages.linkdiskDescription}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href={withLocalePrefix('/linkdisk', locale)}>
                  {messages.linkdiskAppCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href={withLocalePrefix('/linkdisk/use-cases', locale)}>
                  {messages.linkdiskCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </PageSection>
    </PageSection>
  );
}
