'use client';

import { ArrowUpRight, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LOCALES, type Locale, stripLocalePrefix } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { isSiteFeatureActive, type SiteFeatureItem } from '@/lib/site-features';
import { getSiteHeaderConfig, type SiteHeaderConfig } from '@/lib/site-header';
import { cn } from '@/lib/utils';

function HeaderFeatureList({
  barePath,
  items,
  itemClassName,
  listClassName,
}: {
  barePath: string;
  items: SiteFeatureItem[];
  itemClassName?: string;
  listClassName?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return <div className={listClassName}>{items.map((item) => renderFeatureLink(item, barePath, itemClassName))}</div>;
}

function renderFeatureLink(item: SiteFeatureItem, barePath: string, className?: string) {
  const isActive = isSiteFeatureActive(item, barePath);
  const activeClassName = isActive ? 'border-primary/40 bg-accent' : 'hover:bg-accent/70';
  const baseClassName =
    className ??
    'flex min-w-0 flex-col gap-1 rounded-2xl border border-border/60 bg-background/70 p-4 text-left transition-colors';

  if (item.external) {
    return (
      <a
        key={item.id}
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={cn(baseClassName, activeClassName)}
      >
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        </div>
      </a>
    );
  }

  return (
    <Link key={item.id} href={item.href} className={cn(baseClassName, activeClassName)}>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{item.label}</p>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
    </Link>
  );
}

function HeaderLeftArea({
  barePath,
  brand,
  leftArea,
  featureItems,
  messages,
  mobile = false,
}: {
  barePath: string;
  brand: SiteHeaderConfig['brand'];
  leftArea: SiteHeaderConfig['leftArea'];
  featureItems: SiteFeatureItem[];
  messages: ReturnType<typeof getMessages>['common'];
  mobile?: boolean;
}) {
  const containerClassName = mobile
    ? 'flex min-w-0 flex-1 items-center gap-1.5 md:hidden'
    : 'hidden min-w-0 items-center gap-1.5 md:flex';
  const brandClassName = 'min-w-0 shrink-0 truncate text-sm font-medium text-foreground transition-colors hover:text-primary';

  return (
    <div className={containerClassName}>
      <Link href={brand.href} className={brandClassName}>
        {brand.label}
      </Link>
      {!mobile ? (
        <>
          <span className="shrink-0 text-muted-foreground mr-0.5">/</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-2 -ml-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
              >
                <span className="min-w-0 truncate">{leftArea.kind === 'brand-label' ? leftArea.label : messages.featureLauncher}</span>
                <ChevronDown className="ml-1.5 size-3.5 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[36rem] max-w-[calc(100vw-2rem)] p-4">
              <HeaderFeatureList barePath={barePath} items={featureItems} listClassName="grid gap-3 sm:grid-cols-2" />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : leftArea.kind === 'brand-label' ? (
        <>
          <span className="shrink-0 text-muted-foreground">/</span>
          <Link href={leftArea.href} className="min-w-0 truncate text-sm text-muted-foreground transition-colors hover:text-foreground">
            {leftArea.label}
          </Link>
        </>
      ) : null}
    </div>
  );
}

function HeaderActionButton({
  barePath,
  item,
  primary = false,
}: {
  barePath: string;
  item: SiteFeatureItem;
  primary?: boolean;
}) {
  const isActive = isSiteFeatureActive(item, barePath);
  const variant = isActive ? 'default' : 'outline';
  const className = cn(isActive ? 'pointer-events-none' : undefined, primary ? 'gap-2' : undefined);

  if (item.external) {
    return (
      <Button type="button" size="sm" variant={variant} asChild>
        <a href={item.href} target="_blank" rel="noreferrer" className={className}>
          {item.label}
          {primary ? <ArrowUpRight data-icon="inline-end" /> : null}
        </a>
      </Button>
    );
  }

  return (
    <Button type="button" size="sm" variant={variant} asChild>
      <Link href={item.href} className={className}>
        {item.label}
        {primary ? <ArrowUpRight data-icon="inline-end" /> : null}
      </Link>
    </Button>
  );
}

function HeaderMobileNavigation({
  barePath,
  featureItems,
  locale,
  messages,
}: {
  barePath: string;
  featureItems: SiteFeatureItem[];
  locale: Locale;
  messages: ReturnType<typeof getMessages>['common'];
}) {
  return (
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
          <HeaderFeatureList
            barePath={barePath}
            items={featureItems}
            listClassName="flex flex-col gap-2"
            itemClassName="flex min-w-0 flex-col gap-1 rounded-2xl border border-border/60 bg-background/70 px-4 py-3.5 text-left transition-colors"
          />

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
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const messages = getMessages(locale).common;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const barePath = isHydrated ? stripLocalePrefix(pathname ?? window.location.pathname) : '/';
  const headerConfig = getSiteHeaderConfig(locale, barePath);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-14 w-full max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-w-0 items-center gap-2">
          <HeaderLeftArea
            barePath={barePath}
            brand={headerConfig.brand}
            leftArea={headerConfig.leftArea}
            featureItems={headerConfig.launcherItems}
            messages={messages}
            mobile
          />

          <HeaderLeftArea
            barePath={barePath}
            brand={headerConfig.brand}
            leftArea={headerConfig.leftArea}
            featureItems={headerConfig.launcherItems}
            messages={messages}
          />

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {headerConfig.quickActions.map((item) => (
              <HeaderActionButton key={item.id} barePath={barePath} item={item} />
            ))}
            <LanguageSwitcher locale={locale} />
            <ModeToggle
              toggleLabel={messages.themeLabel}
              themeLightLabel={messages.themeLight}
              themeDarkLabel={messages.themeDark}
              themeSystemLabel={messages.themeSystem}
            />
          </div>

          <div className="ml-auto md:hidden">
            <HeaderMobileNavigation
              barePath={barePath}
              featureItems={headerConfig.launcherItems}
              locale={locale}
              messages={messages}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
