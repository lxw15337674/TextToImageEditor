import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StarterGuidePageProps {
  locale: Locale;
}

export function StarterGuidePage({ locale }: StarterGuidePageProps) {
  const messages = getMessages(locale).starter;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">{messages.title}</h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">{messages.description}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>{messages.webTitle}</CardTitle>
            <CardDescription>{messages.webDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.webItems.map((item) => (
              <div key={item} className="rounded-xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>{messages.apiTitle}</CardTitle>
            <CardDescription>{messages.apiDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.apiItems.map((item) => (
              <div key={item} className="rounded-xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{messages.checklistTitle}</CardTitle>
          <CardDescription>{messages.checklistDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.checklist.map((item) => (
            <div key={item} className="rounded-xl border border-dashed border-border/70 bg-background/60 px-4 py-3 text-sm">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
