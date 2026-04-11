import { match } from '@formatjs/intl-localematcher';

export const ALL_LOCALES = ['en', 'zh', 'es', 'ja'] as const;
export type Locale = (typeof ALL_LOCALES)[number];
export const LOCALE_COOKIE_NAME = 'lang';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

// Runtime locales currently exposed in routing and UI.
export const LOCALES = ALL_LOCALES;
export const DEFAULT_LOCALE: (typeof LOCALES)[number] = 'en';

const ACCEPT_LANGUAGE_LOCALE_ALIASES: Record<string, Locale> = {
  en: 'en',
  'en-au': 'en',
  'en-ca': 'en',
  'en-gb': 'en',
  'en-us': 'en',
  es: 'es',
  'es-419': 'es',
  'es-es': 'es',
  'es-mx': 'es',
  ja: 'ja',
  'ja-jp': 'ja',
  zh: 'zh',
  'zh-cn': 'zh',
  'zh-hans': 'zh',
  'zh-hans-cn': 'zh',
  'zh-hant': 'zh',
  'zh-hant-hk': 'zh',
  'zh-hant-mo': 'zh',
  'zh-hant-tw': 'zh',
  'zh-hk': 'zh',
  'zh-mo': 'zh',
  'zh-tw': 'zh',
};

export function isLocale(value: string | null | undefined): value is Locale {
  if (!value) return false;
  return (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  const segment = pathname.split('/')[1];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  if (!pathname) return '/';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const parts = normalized.split('/');
  const segment = parts[1];

  if (!isLocale(segment)) return normalized;
  const rest = `/${parts.slice(2).join('/')}`;
  return rest === '/' ? '/' : rest.replace(/\/+$/, '') || '/';
}

export function withLocalePrefix(pathname: string, locale: Locale): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const barePath = stripLocalePrefix(normalizedPath);
  return barePath === '/' ? `/${locale}` : `/${locale}${barePath}`;
}

export function getAcceptedLanguages(acceptLanguage: string | null | undefined): string[] {
  if (!acceptLanguage) return [];

  return acceptLanguage
    .split(',')
    .map((part) => {
      const [tagPart, qualityPart] = part.trim().split(';q=');
      const tag = tagPart.trim();
      const quality = qualityPart ? Number.parseFloat(qualityPart) : 1;

      return {
        tag,
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((item) => item.tag.length > 0)
    .sort((a, b) => b.quality - a.quality)
    .map((item) => item.tag);
}

export function resolveLocaleFromAcceptLanguage(languages: string[]): Locale {
  for (const language of languages) {
    const normalized = language.toLowerCase();
    const aliasedLocale = ACCEPT_LANGUAGE_LOCALE_ALIASES[normalized];
    if (aliasedLocale) {
      return aliasedLocale;
    }
  }

  try {
    return match(languages, [...LOCALES], DEFAULT_LOCALE) as Locale;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function detectLocaleFromAcceptLanguage(acceptLanguage: string | null | undefined): Locale {
  return resolveLocaleFromAcceptLanguage(getAcceptedLanguages(acceptLanguage));
}
