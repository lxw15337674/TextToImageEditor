import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Locale } from '@/i18n/config';
import { getUseCasesPageCopy } from '@/linkdisk/lib/seo/marketing-pages';

export function UseCasesPage({ locale }: { locale: Locale }) {
  const copy = getUseCasesPageCopy(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6 sm:p-8">
        <div className=" space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">{copy.description}</p>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{copy.strengthsTitle}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.benefits.map((item) => (
            <Card key={item.title} className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-xl leading-7">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{copy.scenariosTitle}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {copy.scenarios.map((item) => (
            <Card key={item.title} className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{copy.faqTitle}</h2>
        </div>

        <div className="grid gap-4">
          {copy.faqs.map((faq) => (
            <Card key={faq.question} className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
