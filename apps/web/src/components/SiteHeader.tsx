'use client';

import { Menu } from 'lucide-react';
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
  const navItems = [
    { href: withLocalePrefix('/', locale), label: messages.navHome, match: '/' },
    { href: withLocalePrefix('/starter', locale), label: messages.navStarter, match: '/starter' },
    { href: withLocalePrefix('/notes', locale), label: messages.navNotes, match: '/notes' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-14 max-w-6xl px-3 sm:px-4 md:px-6">
        <div className="flex h-full min-w-0 items-center gap-2">
          <Link
            href={withLocalePrefix('/', locale)}
            className="min-w-0 flex-1 truncate text-sm font-medium text-foreground md:hidden"
          >
            {messages.siteName}
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const isActive = item.match === '/' ? barePath === '/' : barePath.startsWith(item.match);
              return (
                <Button key={item.href} type="button" size="sm" variant={isActive ? 'default' : 'outline'} asChild>
                  <Link href={item.href} className={cn(isActive ? 'pointer-events-none' : undefined)}>
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
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
                  {navItems.map((item) => {
                    const isActive = item.match === '/' ? barePath === '/' : barePath.startsWith(item.match);
                    return (
                      <Button
                        key={item.href}
                        type="button"
                        variant={isActive ? 'default' : 'outline'}
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href={item.href} className={cn(isActive ? 'pointer-events-none' : undefined)}>
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })}

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
