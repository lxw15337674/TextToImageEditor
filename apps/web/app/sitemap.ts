import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/config';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

const INDEXABLE_LOCALIZED_PATHS = ['/', '/linkdisk', '/linkdisk/use-cases', '/starter', '/notes', '/use-cases'];

export default function sitemap(): MetadataRoute.Sitemap {
  const configured = process.env.SITE_LAST_MODIFIED?.trim();
  const lastModified = configured ? new Date(configured) : new Date();
  const resolvedLastModified = Number.isNaN(lastModified.getTime()) ? new Date() : lastModified;

  return LOCALES.flatMap((locale) =>
    INDEXABLE_LOCALIZED_PATHS.map((pathname, index) => ({
      url: toAbsoluteUrl(pathname === '/' ? `/${locale}` : `/${locale}${pathname}`),
      lastModified: resolvedLastModified,
      changeFrequency: 'weekly' as const,
      priority: index === 0 ? 0.9 : 0.7,
    })),
  );
}
