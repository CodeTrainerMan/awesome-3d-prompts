'use client';

import { useEffect, useState } from 'react';
import { assetUrl, categoryById, displayName, formatBytes } from '@/lib/catalog';
import type { Model } from '@/lib/types';
import { ViewerPanel } from './ViewerPanel';
import { IconCheck, IconClose, IconCopy, IconCube, IconGithub } from './icons';

const REPO = 'https://github.com/CodeTrainerMan/awesome-3d-prompts';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
        copied
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      {copied ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
      {copied ? '已复制' : '复制提示词'}
    </button>
  );
}

export function ModelDialog({ model, onClose }: { model: Model; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const category = categoryById(model.category);
  const sourceUrl = `${REPO}/blob/main/prompts/${model.category}/${model.slug}.md`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/50 p-3 backdrop-blur-sm sm:p-6 lg:p-10">
      <div
        aria-hidden
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={model.title}
        className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-neutral-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-neutral-900"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="h-[46vh] p-3 sm:h-[52vh] lg:h-[78vh]">
            <ViewerPanel model={model} />
          </div>

          <div className="flex max-h-[78vh] flex-col border-neutral-200 lg:border-l">
            <div className="scrollbar-thin flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">
                  <span aria-hidden>{category?.emoji}</span>
                  {category?.labelZh ?? model.category}
                </span>
                {model.author && (
                  <span className="text-neutral-500">
                    作者{' '}
                    {model.author.url ? (
                      <a href={model.author.url} target="_blank" rel="noreferrer" className="hover:text-neutral-900">
                        {model.author.name}
                      </a>
                    ) : (
                      model.author.name
                    )}
                  </span>
                )}
                <span className="text-neutral-400">{formatBytes(model.modelSize)} GLB</span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">{displayName(model)}</h2>
              {model.titleZh && model.title !== model.titleZh && (
                <p className="mt-1 text-sm text-neutral-500">{model.title}</p>
              )}

              {model.tools.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {model.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-600"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {model.description && (
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{model.description}</p>
              )}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Prompt</h3>
                  <CopyButton text={model.prompt} />
                </div>
                <pre className="scrollbar-thin max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-neutral-50 p-4 text-[12.5px] leading-relaxed text-neutral-700 ring-1 ring-inset ring-neutral-100">
                  {model.prompt || '（该条目暂无提示词）'}
                </pre>
              </div>

              {model.video && (
                <div className="mt-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Preview Video</h3>
                  <video
                    src={assetUrl(model, model.video.file)}
                    controls
                    playsInline
                    className="w-full rounded-2xl bg-black"
                  />
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 text-xs">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-500 transition hover:text-neutral-900"
                >
                  <IconGithub className="h-3.5 w-3.5" />
                  查看 Markdown 源文件
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
