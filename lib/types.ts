export interface FileRef {
  file: string;
  size: number;
}

export interface Variant {
  file: string;
  label: string | null;
  size: number;
  exists: boolean;
}

export interface Category {
  id: string;
  label: string;
  labelZh: string;
  emoji: string;
  count: number;
  modelCount: number;
}

export interface Model {
  id: string;
  slug: string;
  category: string;
  title: string;
  titleZh: string | null;
  author: { name: string; url: string | null } | null;
  prompt: string;
  description: string | null;
  tools: string[];
  preview: FileRef | null;
  video: FileRef | null;
  variants: Variant[];
  availableVariantCount: number;
  modelSize: number;
  hasModel: boolean;
}

export interface Catalog {
  generatedAt: string;
  categories: Category[];
  models: Model[];
  stats: {
    models: number;
    previewable: number;
    categories: number;
    totalBytes: number;
  };
}
