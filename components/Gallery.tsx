'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Catalog, Model } from '@/lib/types';
import { categoryById, formatBytes } from '@/lib/catalog';
import { ModelCard } from './ModelCard';
import { ModelDialog } from './ModelDialog';
import { IconCube, IconGithub, IconSearch } from './icons';

export function Gallery({ catalog }: { catalog: Catalog }) {
  const { models, categories, stats } = catalog;

  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [onlyPreviewable, setOnlyPreviewable] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Deep-link support: /?model=<category>/<slug>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('model');
    if (id && models.some((m) => m.id === id)) setActiveId(id);
  }, [models]);

  const open = useCallback((id: string) => {
    setActiveId(id);
    window.history.replaceState(null, '', `?model=${encodeURIComponent(id)}`);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const activeModel = useMemo<Model | null>(
    () => models.find((m) => m.id === activeId) ?? null,
    [models, activeId],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const model of models) map.set(model.category, (map.get(model.category) ?? 0) + 1);
    return map;
  }, [models]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models
      .filter((model) => {
        if (onlyPreviewable && !model.hasModel) return false;
        if (activeCategory !== 'all' && model.category !== activeCategory) return false;
        if (!q) return true;
        const haystack = [model.title, model.titleZh ?? '', model.category, model.tools.join(' '), model.prompt]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => Number(b.hasModel) - Number(a.hasModel));
  }, [models, activeCategory, query, onlyPreviewable]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8">
      <header className="flex items-center justify-between py-6">
        <a href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-neutral-900 text-white">
            <IconCube className="h-4 w-4" />
          </span>
          Awesome 3D Prompts
        </a>
        <a
          href="https://github.com/CodeTrainerMan/awesome-3d-prompts"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          <IconGithub className="h-3.5 w-3.5" />
          GitHub
        </a>
      </header>

      <section className="pt-10 sm:pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">Model Gallery</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-6xl">
          把提示词生成的 3D 模型
          <br className="hidden sm:block" />
          直接搬到浏览器里转一圈
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
          收录 {stats.models} 个提示词与它们真实的生成结果。点开任意作品即可在线预览 GLB、对比不同工具的版本，并一键复制背后的完整提示词。
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div>
            <dt className="text-neutral-400">提示词</dt>
            <dd className="mt-0.5 text-2xl font-semibold text-neutral-900">{stats.models}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">可预览模型</dt>
            <dd className="mt-0.5 text-2xl font-semibold text-neutral-900">{stats.previewable}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">分类</dt>
            <dd className="mt-0.5 text-2xl font-semibold text-neutral-900">{stats.categories}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">模型体积</dt>
            <dd className="mt-0.5 text-2xl font-semibold text-neutral-900">{formatBytes(stats.totalBytes)}</dd>
          </div>
        </dl>
      </section>

      <section className="sticky top-0 z-30 -mx-5 mt-12 border-b border-neutral-200/80 bg-white/85 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="scrollbar-thin -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1">
            <FilterChip
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              label="全部"
              count={models.length}
            />
            {categories
              .filter((c) => c.count > 0)
              .map((category) => (
                <FilterChip
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                  label={`${category.emoji} ${category.labelZh}`}
                  count={counts.get(category.id) ?? category.count}
                />
              ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="relative block w-full lg:w-64">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、工具或提示词"
                className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </label>
            <button
              type="button"
              onClick={() => setOnlyPreviewable((v) => !v)}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition ${
                onlyPreviewable
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              仅看可预览
            </button>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="mt-20 text-center text-sm text-neutral-500">
          没有匹配的作品，换个关键词或分类试试。
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              category={categoryById(model.category)}
              onOpen={() => open(model.id)}
            />
          ))}
        </div>
      )}

      <footer className="mt-20 border-t border-neutral-200 pt-6 text-xs text-neutral-400">
        <p>
          所有模型与提示词来自开源社区贡献，遵循 MIT 协议。想上传自己的作品？阅读{' '}
          <a
            href="https://github.com/CodeTrainerMan/awesome-3d-prompts/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 underline decoration-neutral-300 underline-offset-2"
          >
            贡献指南
          </a>
          。
        </p>
      </footer>

      {activeModel && <ModelDialog model={activeModel} onClose={close} />}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
      }`}
    >
      {label}
      <span className={active ? 'ml-1.5 text-white/60' : 'ml-1.5 text-neutral-400'}>{count}</span>
    </button>
  );
}
