import { CheckCircle2, FileClock, History, ImageUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { AppPageContainer, PagePanel, PageSection, SectionIntro } from '@/components/app-page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NotesUseCasesPageProps {
  locale: Locale;
}

const proofIcons = [ShieldCheck, History, ImageUp] as const;
const valueIcons = [FileClock, History, CheckCircle2, ImageUp] as const;

export function NotesUseCasesPage({ locale }: NotesUseCasesPageProps) {
  const messages = getMessages(locale).useCases;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: messages.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <AppPageContainer variant="marketing">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PagePanel className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.9fr)] lg:items-end">
        <div className="space-y-5">
          <SectionIntro
            eyebrow={messages.eyebrow}
            title={<h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{messages.title}</h1>}
            description={messages.description}
            descriptionClassName="max-w-2xl"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={withLocalePrefix('/notes', locale)}>{messages.primaryCta}</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border/70 bg-background/70 shadow-none">
          <CardHeader className="space-y-3">
            <CardTitle>{messages.problemTitle}</CardTitle>
            <CardDescription className="text-sm leading-6">{messages.problemDescription}</CardDescription>
          </CardHeader>
        </Card>
      </PagePanel>

      <PageSection>
        <div className="grid gap-4 md:grid-cols-3">
          {messages.proofItems.map((item, index) => {
            const Icon = proofIcons[index % proofIcons.length] ?? ShieldCheck;

            return (
              <Card key={item.title} className="border-border/70">
                <CardHeader className="space-y-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" spacing="none">
        {messages.valueItems.map((item, index) => {
          const Icon = valueIcons[index % valueIcons.length] ?? CheckCircle2;

          return (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </PageSection>

      <PageSection id="use-cases">
        <SectionIntro
          title={<h2 className="text-3xl font-semibold tracking-tight">{messages.useCasesTitle}</h2>}
          description={messages.useCasesDescription}
          className="space-y-2"
          titleClassName="text-3xl font-semibold tracking-tight"
          descriptionClassName="max-w-3xl text-base"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {messages.useCaseItems.map((item) => (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionIntro
          title={<h2 className="text-3xl font-semibold tracking-tight">{messages.comparisonTitle}</h2>}
          description={messages.comparisonDescription}
          className="space-y-2"
          titleClassName="text-3xl font-semibold tracking-tight"
          descriptionClassName="max-w-3xl text-base"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {messages.comparisonItems.map((item) => (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection id="faq">
        <SectionIntro
          title={<h2 className="text-3xl font-semibold tracking-tight">{messages.faqTitle}</h2>}
          description={messages.faqDescription}
          className="space-y-2"
          titleClassName="text-3xl font-semibold tracking-tight"
          descriptionClassName="max-w-3xl text-base"
        />
        <div className="grid gap-4">
          {messages.faqs.map((item) => (
            <Card key={item.question} className="border-border/70">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{item.question}</CardTitle>
                <CardDescription className="text-sm leading-6">{item.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageSection>

      <PagePanel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            title={<h2 className="max-w-3xl text-3xl font-semibold tracking-tight">{messages.ctaTitle}</h2>}
            description={messages.ctaDescription}
            descriptionClassName="max-w-2xl text-base"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={withLocalePrefix('/notes', locale)}>{messages.ctaPrimary}</Link>
            </Button>
          </div>
        </div>
      </PagePanel>
    </AppPageContainer>
  );
}
