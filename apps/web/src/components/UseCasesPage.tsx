import { CheckCircle2, FileClock, History, ImageUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UseCasesPageProps {
  locale: Locale;
}

const proofIcons = [ShieldCheck, History, ImageUp] as const;
const valueIcons = [FileClock, History, CheckCircle2, ImageUp] as const;

export function UseCasesPage({ locale }: UseCasesPageProps) {
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
    <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-10 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="grid gap-6 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.9fr)] lg:items-end">
        <div className="space-y-5">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]">
            {messages.eyebrow}
          </Badge>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {messages.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{messages.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={withLocalePrefix('/notes', locale)}>{messages.primaryCta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#use-cases">{messages.secondaryCta}</a>
            </Button>
          </div>
        </div>

        <Card className="border-border/70 bg-background/70 shadow-none">
          <CardHeader>
            <CardTitle>{messages.problemTitle}</CardTitle>
            <CardDescription>{messages.problemDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.proofItems.map((item, index) => {
              const Icon = proofIcons[index % proofIcons.length] ?? ShieldCheck;

              return (
                <div key={item.title} className="rounded-2xl border border-border/60 bg-card px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <section id="use-cases" className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{messages.useCasesTitle}</h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{messages.useCasesDescription}</p>
        </div>
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
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{messages.comparisonTitle}</h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{messages.comparisonDescription}</p>
        </div>
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
      </section>

      <section id="faq" className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{messages.faqTitle}</h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{messages.faqDescription}</p>
        </div>
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
      </section>

      <section className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight">{messages.ctaTitle}</h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">{messages.ctaDescription}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={withLocalePrefix('/notes', locale)}>{messages.ctaPrimary}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#faq">{messages.ctaSecondary}</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
