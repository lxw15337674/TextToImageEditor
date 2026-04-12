import { Link2, LockKeyhole, Package } from 'lucide-react';
import Link from 'next/link';
import { AppPageContainer, PagePanel, SectionIntro } from '@/components/app-page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Locale } from '@/i18n/config';
import { withLocalePrefix } from '@/i18n/config';
import { getUseCasesPageCopy } from '@/linkdisk/lib/seo/marketing-pages';

const benefitIcons = [Link2, LockKeyhole, Package] as const;

export function UseCasesPage({ locale }: { locale: Locale }) {
  const copy = getUseCasesPageCopy(locale);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <AppPageContainer className="gap-8 py-8 sm:py-10 lg:gap-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <PagePanel className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.9fr)] lg:items-end">
        <div className="space-y-5">
          <SectionIntro
            eyebrow={copy.eyebrow}
            title={<h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>}
            description={copy.description}
            descriptionClassName="max-w-2xl"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={withLocalePrefix('/linkdisk', locale)}>{copy.primaryCta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#use-cases">{copy.secondaryCta}</a>
            </Button>
          </div>
        </div>

        <Card className="border-border/70 bg-background/70 shadow-none">
          <CardHeader className="space-y-3">
            <CardTitle>{copy.problemTitle}</CardTitle>
            <CardDescription className="text-sm leading-6">{copy.problemDescription}</CardDescription>
          </CardHeader>
        </Card>
      </PagePanel>

      <section className="space-y-4">
        <SectionIntro
          title={<h2 className="text-3xl font-semibold tracking-tight">{copy.strengthsTitle}</h2>}
          description={copy.strengthsDescription}
          className="space-y-2"
          titleClassName="text-3xl font-semibold tracking-tight"
          descriptionClassName="max-w-3xl text-base"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {copy.benefits.map((item, index) => {
            const Icon = benefitIcons[index % benefitIcons.length] ?? Link2;

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
      </section>

      <section id="use-cases" className="space-y-4">
        <SectionIntro
          title={<h2 className="text-3xl font-semibold tracking-tight">{copy.scenariosTitle}</h2>}
          description={copy.scenariosDescription}
          className="space-y-2"
          titleClassName="text-3xl font-semibold tracking-tight"
          descriptionClassName="max-w-3xl text-base"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {copy.scenarios.map((item) => (
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
        <SectionIntro
          title={<h2 className="text-3xl font-semibold tracking-tight">{copy.faqTitle}</h2>}
          description={copy.faqDescription}
          className="space-y-2"
          titleClassName="text-3xl font-semibold tracking-tight"
          descriptionClassName="max-w-3xl text-base"
        />

        <div className="grid gap-4">
          {copy.faqs.map((faq) => (
            <Card key={faq.question} className="border-border/70">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{faq.question}</CardTitle>
                <CardDescription className="text-sm leading-6">{faq.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <PagePanel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            title={<h2 className="max-w-3xl text-3xl font-semibold tracking-tight">{copy.ctaTitle}</h2>}
            description={copy.ctaDescription}
            descriptionClassName="max-w-2xl text-base"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={withLocalePrefix('/linkdisk', locale)}>{copy.ctaPrimary}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#faq">{copy.ctaSecondary}</a>
            </Button>
          </div>
        </div>
      </PagePanel>
    </AppPageContainer>
  );
}
