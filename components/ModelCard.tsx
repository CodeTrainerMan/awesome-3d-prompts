'use client';

import { useState } from 'react';
import { assetUrl, displayName, formatBytes } from '@/lib/catalog';
import type { Category, Model } from '@/lib/types';

export function ModelCard({ model, category, onOpen }: { model: Model; category?: Category; onOpen: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const previewUrl = model.preview ? assetUrl(model, model.preview.file) : null;
  const showImage = previewUrl && !imageFailed;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={model.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200">
            <span className="text-5xl opacity-60" aria-hidden>
              {category?.emoji ?? '📦'}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent opacity-80" />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur">
          {category?.labelZh ?? model.category}
        </span>

        {!model.hasModel && (
          <span className="absolute right-3 top-3 rounded-full bg-neutral-900/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
            仅提示词
          </span>
        )}

        {model.hasModel && model.availableVariantCount > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-neutral-700 shadow-sm backdrop-blur">
            {model.availableVariantCount} 个版本
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="line-clamp-1 text-[15px] font-semibold text-neutral-900">{displayName(model)}</h3>
          {model.titleZh && model.titleZh !== model.title && (
            <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">{model.title}</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {model.tools.slice(0, 2).map((tool) => (
            <span key={tool} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10.5px] text-neutral-600">
              {tool}
            </span>
          ))}
          {model.hasModel && (
            <span className="ml-auto text-[10.5px] text-neutral-400">{formatBytes(model.modelSize)}</span>
          )}
        </div>
      </div>
    </button>
  );
}
