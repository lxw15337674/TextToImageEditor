import type { MetadataRoute } from 'next';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: toAbsoluteUrl('/sitemap.xml'),
  };
}
