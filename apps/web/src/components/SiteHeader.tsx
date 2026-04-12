'use client';

import { ArrowUpRight, LayoutGrid, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import {
  isSiteFeatureActive,
  type SiteFeatureItem,
} from '@/lib/site-features';
import { getSiteHeaderConfig } from '@/lib/site-header';
import { cn } from '@/lib/utils';

function renderFeatureLink(item: SiteFeatureItem, barePath: string, compact = false) {
  const Icon = item.icon;
  const isActive = isSiteFeatureActive(item, barePath);
  const baseClassName = compact
    ? 'flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3'
    : 'flex min-h-32 flex-col gap-4 rounded-2xl border border-border/60 bg-background/70 p-4';
  const activeClassName = isActive ? 'border-primary/40 bg-accent' : 'hover:bg-accent/70';

  if (item.external) {
    return (
      <a
        key={item.id}
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={cn(baseClassName, activeClassName)}
      >
        <div className={cn('flex items-center gap-3', compact ? undefined : 'justify-between')}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          {!compact ? <ArrowUpRight className="size-4 text-muted-foreground" /> : null}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
        </div>
      </a>
    );
  }

  return (
    <Link key={item.id} href={item.href} className={cn(baseClassName, activeClassName)}>
      <div className={cn('flex items-center gap-3', compact ? undefined : 'justify-between')}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        {!compact ? <ArrowUpRight className="size-4 text-muted-foreground" /> : null}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{item.label}</p>
        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
    </Link>
  );
}

function HeaderBrand({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'min-w-0 truncate text-sm font-medium text-foreground transition-colors hover:text-primary',
        mobile ? 'flex-1 md:hidden' : 'hidden shrink-0 md:block',
      )}
    >
      {label}
    </Link>
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

function HeaderFeatureLauncher({
  barePath,
  featureGroups,
  messages,
}: {
  barePath: string;
  featureGroups: ReturnType<typeof getSiteHeaderConfig>['launcherGroups'];
  messages: ReturnType<typeof getMessages>['common'];
}) {
  const showGroupLabel = featureGroups.length > 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <LayoutGrid data-icon="inline-start" />
          {messages.featureLauncher}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[36rem] max-w-[calc(100vw-2rem)] p-4">
        <div className="flex flex-col gap-4">
          <div className="px-1">
            <p className="text-sm font-medium text-foreground">{messages.featureLauncher}</p>
          </div>
          {featureGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-3">
              {showGroupLabel ? (
                <p className="px-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{group.label}</p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">{group.items.map((item) => renderFeatureLink(item, barePath))}</div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderMobileNavigation({
  barePath,
  featureGroups,
  locale,
  messages,
  quickActions,
}: {
  barePath: string;
  featureGroups: ReturnType<typeof getSiteHeaderConfig>['launcherGroups'];
  locale: Locale;
  messages: ReturnType<typeof getMessages>['common'];
  quickActions: ReturnType<typeof getSiteHeaderConfig>['quickActions'];
}) {
  const showGroupLabel = featureGroups.length > 1;

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
          {quickActions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {quickActions.map((item) => renderFeatureLink(item, barePath, true))}
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{messages.featureLauncher}</p>
            </div>
            {featureGroups.map((group) => (
              <div key={group.id} className="flex flex-col gap-2">
                {showGroupLabel ? (
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{group.label}</p>
                ) : null}
                <div className="flex flex-col gap-2">{group.items.map((item) => renderFeatureLink(item, barePath, true))}</div>
              </div>
            ))}
          </div>

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
  const messages = getMessages(locale).common;
  const barePath = stripLocalePrefix(pathname ?? '/');
  const headerConfig = getSiteHeaderConfig(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-14 w-full max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-w-0 items-center gap-2">
          <HeaderBrand href={headerConfig.brand.href} label={headerConfig.brand.label} mobile />

          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <HeaderBrand href={headerConfig.brand.href} label={headerConfig.brand.label} />
            {headerConfig.primaryAction ? (
              <HeaderActionButton barePath={barePath} item={headerConfig.primaryAction} primary />
            ) : null}
          </div>

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
            <HeaderFeatureLauncher barePath={barePath} featureGroups={headerConfig.launcherGroups} messages={messages} />
          </div>

          <div className="ml-auto md:hidden">
            <HeaderMobileNavigation
              barePath={barePath}
              featureGroups={headerConfig.launcherGroups}
              locale={locale}
              messages={messages}
              quickActions={headerConfig.quickActions}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
