import Link from 'next/link';
import { ArrowRight, History, ImageUp, LockKeyhole } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StarterHomePageProps {
  locale: Locale;
}

const detailIcons = [History, LockKeyhole, ImageUp] as const;

export function StarterHomePage({ locale }: StarterHomePageProps) {
  const commonMessages = getMessages(locale).common;
  const messages = getMessages(locale).home;

  return (
    <main className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-10 lg:px-8">
      <section className="space-y-5">
        <div className="space-y-3">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]">
            {messages.eyebrow}
          </Badge>
        </div>
        <div className="space-y-3">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {messages.title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{messages.description}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/70 bg-card/80 md:col-span-2">
          <CardHeader className="space-y-5 p-6 sm:p-7">
            <div className="flex flex-wrap gap-2">
              {messages.primaryCardTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl">{messages.primaryCardTitle}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                {messages.primaryCardDescription}
              </CardDescription>
            </div>
            <div>
              <Button asChild size="lg" className="gap-2">
                <Link href={withLocalePrefix('/notes', locale)}>
                  {messages.primaryCardCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border/70 bg-card/70">
          <CardHeader className="h-full justify-between space-y-8 p-6">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
                {commonMessages.navUseCases}
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{messages.secondaryCardTitle}</CardTitle>
                <CardDescription className="text-sm leading-6">{messages.secondaryCardDescription}</CardDescription>
              </div>
            </div>
            <Button asChild variant="outline" className="w-fit gap-2">
              <Link href={withLocalePrefix('/use-cases', locale)}>
                {messages.secondaryCardCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
        </Card>

        {messages.detailCards.map((item, index) => {
          const Icon = detailIcons[index % detailIcons.length] ?? History;

          return (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="space-y-4 p-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl sm:text-2xl">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
