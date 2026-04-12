import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { routing } from '@/i18n/routing';

export function resolveRouteLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export function resolveLocaleForMetadata(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : DEFAULT_LOCALE;
}
