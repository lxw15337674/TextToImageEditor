import Link from 'next/link';
import { ArrowRight, Database, Globe2, MoonStar, Server } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StarterHomePageProps {
  locale: Locale;
}

const featureIcons = [Globe2, MoonStar, Server, Database] as const;

export function StarterHomePage({ locale }: StarterHomePageProps) {
  const messages = getMessages(locale).home;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,1fr)] lg:items-end">
        <div className="space-y-5">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]">
            {messages.eyebrow}
          </Badge>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {messages.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {messages.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href={withLocalePrefix('/notes', locale)}>
                {messages.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={withLocalePrefix('/starter', locale)}>{messages.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border/70 bg-background/70 shadow-none">
          <CardHeader>
            <CardTitle>{messages.stackTitle}</CardTitle>
            <CardDescription>{messages.stackDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.stackItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {messages.featureItems.map((item, index) => {
          const Icon = featureIcons[index % featureIcons.length];
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
    </main>
  );
}
