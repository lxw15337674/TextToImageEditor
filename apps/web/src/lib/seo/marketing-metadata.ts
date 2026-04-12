import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { buildLocaleAlternates } from '@/lib/seo/locale-alternates';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

interface CreateMarketingMetadataOptions {
  absoluteTitle?: boolean;
  description: string;
  follow?: boolean;
  imageAlt?: string;
  includeSocialImages?: boolean;
  index?: boolean;
  locale: Locale;
  pathname: string;
  siteName: string;
  title: string;
}

function normalizeLocalizedPath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '';
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function createMarketingMetadata({
  absoluteTitle = false,
  description,
  follow = true,
  imageAlt,
  includeSocialImages = true,
  index = true,
  locale,
  pathname,
  siteName,
  title,
}: CreateMarketingMetadataOptions): Metadata {
  const localizedPath = normalizeLocalizedPath(pathname);
  const absoluteCanonical = toAbsoluteUrl(`/${locale}${localizedPath}`);
  const openGraphImageUrl = includeSocialImages ? toAbsoluteUrl(`/${locale}/opengraph-image`) : null;
  const twitterImageUrl = includeSocialImages ? toAbsoluteUrl(`/${locale}/twitter-image`) : null;
  const socialImageAlt = imageAlt ?? `${siteName} social preview`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: absoluteCanonical,
      languages: buildLocaleAlternates(localizedPath || '/'),
    },
    openGraph: {
      type: 'website',
      url: absoluteCanonical,
      title,
      description,
      siteName,
      images: openGraphImageUrl
        ? [
            {
              url: openGraphImageUrl,
              width: 1200,
              height: 630,
              alt: socialImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: twitterImageUrl
        ? [
            {
              url: twitterImageUrl,
              alt: socialImageAlt,
            },
          ]
        : undefined,
    },
    robots: {
      index,
      follow,
    },
  };
}
