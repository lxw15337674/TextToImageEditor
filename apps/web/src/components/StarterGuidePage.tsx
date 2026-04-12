import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { AppPageContainer, SectionIntro } from '@/components/app-page-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StarterGuidePageProps {
  locale: Locale;
}

export function StarterGuidePage({ locale }: StarterGuidePageProps) {
  const messages = getMessages(locale).starter;

  return (
    <AppPageContainer width="narrow" className="gap-6 py-10">
      <section className="space-y-3">
        <SectionIntro
          title={<h1 className="text-4xl font-semibold tracking-tight">{messages.title}</h1>}
          description={messages.description}
          descriptionClassName="max-w-3xl text-base"
        />
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
    </AppPageContainer>
  );
}
