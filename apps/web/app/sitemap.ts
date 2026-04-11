import { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/config';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

const INDEXABLE_LOCALIZED_PATHS = ['/', '/starter', '/notes'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return LOCALES.flatMap((locale) =>
    INDEXABLE_LOCALIZED_PATHS.map((pathname, index) => ({
      url: toAbsoluteUrl(pathname === '/' ? `/${locale}` : `/${locale}${pathname}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: index === 0 ? 0.9 : 0.7,
    })),
  );
}
