import type { MetadataRoute } from 'next';
import { catalog } from '@/lib/catalog';
import { absoluteUrl, modelPath } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalog.generatedAt);

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...catalog.models.map((model) => ({
      url: absoluteUrl(modelPath(model)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
