'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  LOCALES,
  type Locale,
  stripLocalePrefix,
  withLocalePrefix,
} from '@/i18n/config';
import { getLocaleLabel } from '@/i18n/locale-meta';
import { getMessages } from '@/i18n/messages';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  locale: Locale;
  fullWidth?: boolean;
  onSelect?: () => void;
}

function setLocaleCookie(locale: Locale) {
  const secureSuffix = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secureSuffix}`;
}

export function LanguageSwitcher({ locale, fullWidth = false, onSelect }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const messages = getMessages(locale).common;

  if (LOCALES.length <= 1) {
    return null;
  }

  function handleLanguageChange(nextLocale: Locale) {
    if (nextLocale === locale) {
      onSelect?.();
      return;
    }

    const barePath = stripLocalePrefix(pathname ?? '/');
    const nextPath = withLocalePrefix(barePath, nextLocale);
    setLocaleCookie(nextLocale);
    onSelect?.();
    router.push(nextPath);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(fullWidth ? 'w-full justify-between' : 'gap-2')}
          aria-label={messages.languageLabel}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Globe className="size-4" />
            <span className="truncate">{getLocaleLabel(locale)}</span>
          </span>
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((availableLocale) => {
          const isActive = availableLocale === locale;
          return (
            <DropdownMenuItem
              key={availableLocale}
              className="justify-between"
              onClick={() => handleLanguageChange(availableLocale)}
            >
              <span>{getLocaleLabel(availableLocale)}</span>
              {isActive ? <Check className="size-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
