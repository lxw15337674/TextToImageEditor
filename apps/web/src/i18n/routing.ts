import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME, LOCALES } from '@/i18n/config';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  },
});
