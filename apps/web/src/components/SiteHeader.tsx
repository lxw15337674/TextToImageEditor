'use client';

import { ArrowUpRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LOCALES, type Locale, stripLocalePrefix, withLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { cn } from '@/lib/utils';

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const messages = getMessages(locale).common;
  const barePath = stripLocalePrefix(pathname ?? '/');
  const useCasesHref = withLocalePrefix('/use-cases', locale);
  const notesHref = withLocalePrefix('/notes', locale);
  const isUseCasesActive = barePath.startsWith('/use-cases');
  const isEditorActive = barePath.startsWith('/notes');

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-14 w-full max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-w-0 items-center gap-2">
          <Link
            href={withLocalePrefix('/', locale)}
            className="min-w-0 flex-1 truncate text-sm font-medium text-foreground md:hidden"
          >
            {messages.siteName}
          </Link>

          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <Link href={withLocalePrefix('/', locale)} className="shrink-0 text-sm font-medium text-foreground">
              {messages.siteName}
            </Link>
            <Button type="button" size="sm" variant={isEditorActive ? 'default' : 'outline'} asChild>
              <Link href={notesHref} className={cn(isEditorActive ? 'pointer-events-none gap-2' : 'gap-2')}>
                {messages.openEditor}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button type="button" size="sm" variant={isUseCasesActive ? 'default' : 'outline'} asChild>
              <Link href={useCasesHref} className={cn(isUseCasesActive ? 'pointer-events-none' : undefined)}>
                {messages.navUseCases}
              </Link>
            </Button>
            <LanguageSwitcher locale={locale} />
            <ModeToggle
              toggleLabel={messages.themeLabel}
              themeLightLabel={messages.themeLight}
              themeDarkLabel={messages.themeDark}
              themeSystemLabel={messages.themeSystem}
            />
          </div>

          <div className="ml-auto md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" size="icon" variant="outline">
                  <Menu className="size-4" />
                  <span className="sr-only">{messages.mobileMenuOpenLabel}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(20rem,100vw-1rem)] border-border/70 bg-card px-4">
                <SheetHeader>
                  <SheetTitle>{messages.siteName}</SheetTitle>
                  <SheetDescription>{messages.mobileMenuDescription}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    type="button"
                    variant={isEditorActive ? 'default' : 'outline'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={notesHref} className={cn(isEditorActive ? 'pointer-events-none gap-2' : 'gap-2')}>
                      {messages.openEditor}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>

                  <Button
                    type="button"
                    variant={isUseCasesActive ? 'default' : 'outline'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={useCasesHref} className={cn(isUseCasesActive ? 'pointer-events-none' : undefined)}>
                      {messages.navUseCases}
                    </Link>
                  </Button>

                  <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-3">
                    {LOCALES.length > 1 ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">{messages.languageLabel}</span>
                        <div className="min-w-0 flex-1">
                          <LanguageSwitcher locale={locale} fullWidth />
                        </div>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{messages.themeLabel}</span>
                      <ModeToggle
                        toggleLabel={messages.themeLabel}
                        themeLightLabel={messages.themeLight}
                        themeDarkLabel={messages.themeDark}
                        themeSystemLabel={messages.themeSystem}
                      />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
