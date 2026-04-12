import { ArrowRight, FileText, Link2 } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { AppPageContainer, PagePanel, SectionIntro } from '@/components/app-page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UseCasesPageProps {
  locale: Locale;
}

export function UseCasesPage({ locale }: UseCasesPageProps) {
  const messages = getMessages(locale).useCasesHub;

  return (
    <AppPageContainer className="gap-8 py-8 sm:py-10 lg:gap-10">
      <PagePanel>
        <SectionIntro
          eyebrow={messages.eyebrow}
          title={<h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{messages.title}</h1>}
          description={messages.description}
          descriptionClassName="max-w-3xl"
        />
      </PagePanel>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-5 p-6 sm:p-7">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl">{messages.notesTitle}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                {messages.notesDescription}
              </CardDescription>
            </div>
            <div>
              <Button asChild size="lg" className="gap-2">
                <Link href={withLocalePrefix('/notes/use-cases', locale)}>
                  {messages.notesCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-5 p-6 sm:p-7">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Link2 className="size-5" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl">{messages.linkdiskTitle}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                {messages.linkdiskDescription}
              </CardDescription>
            </div>
            <div>
              <Button asChild size="lg" className="gap-2">
                <Link href={withLocalePrefix('/linkdisk/use-cases', locale)}>
                  {messages.linkdiskCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>
    </AppPageContainer>
  );
}
