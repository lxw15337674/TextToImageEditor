import createMiddleware from 'next-intl/middleware';
import { hasLocale } from 'next-intl';
import { NextRequest, NextResponse } from 'next/server';
import {
  detectLocaleFromAcceptLanguage,
  isLocale,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
} from '@/i18n/config';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware({
  ...routing,
  alternateLinks: false,
});

const BOT_USER_AGENT_PATTERN =
  /googlebot|bingbot|yandex|baiduspider|slurp|duckduckbot|bytespider|petalbot|applebot|facebookexternalhit|twitterbot|linkedinbot/i;
const LOCALE_REDIRECT_VARY_HEADERS = ['Accept-Language', 'Cookie', 'User-Agent'] as const;

function isBotUserAgent(userAgent: string): boolean {
  return BOT_USER_AGENT_PATTERN.test(userAgent);
}

function appendVaryHeader(headers: Headers, values: readonly string[]) {
  const existing = headers.get('Vary');
  const varyValues = new Set(
    existing
      ?.split(',')
      .map((value) => value.trim())
      .filter(Boolean) ?? [],
  );

  for (const value of values) {
    varyValues.add(value);
  }

  headers.set('Vary', [...varyValues].join(', '));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split('/')[1];

  if (hasLocale(routing.locales, segment)) {
    return handleI18nRouting(request);
  }

  const redirectUrl = request.nextUrl.clone();
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const userAgent = request.headers.get('user-agent') ?? '';
  const isBot = isBotUserAgent(userAgent);
  const preferredLocale =
    !isBot && isLocale(cookieLocale)
      ? cookieLocale
      : detectLocaleFromAcceptLanguage(request.headers.get('accept-language'));

  redirectUrl.pathname = pathname === '/' ? `/${preferredLocale}` : `/${preferredLocale}${pathname}`;

  const response = NextResponse.redirect(redirectUrl, 307);
  appendVaryHeader(response.headers, LOCALE_REDIRECT_VARY_HEADERS);

  if (!isBot && !isLocale(cookieLocale)) {
    response.cookies.set(LOCALE_COOKIE_NAME, preferredLocale, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}

export default proxy;

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
