import rawCatalog from '@/data/models.json';
import type { Catalog, Model, Variant } from './types';

export const catalog = rawCatalog as unknown as Catalog;

export const { categories, models, stats } = catalog;

/** `/api/asset/<category>/<file>` */
export function assetUrl(model: Pick<Model, 'category'>, file: string) {
  return `/api/asset/${model.category}/${encodeURIComponent(file)}`;
}

export function availableVariants(model: Model): Variant[] {
  return model.variants.filter((v) => v.exists);
}

export function categoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 100 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

export function displayName(model: Model) {
  return model.titleZh || model.title;
}
