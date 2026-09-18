import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Binary payloads are mirrored from GitHub; no need to burn crawl budget on them.
      disallow: '/api/asset/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
