import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog, displayName, formatBytes } from '@/lib/catalog';
import { SITE, absoluteUrl, modelPath } from '@/lib/site';
import { ModelDetail } from '@/components/ModelDetail';
import { IconArrowLeft, IconGithub } from '@/components/icons';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

const { models } = catalog;

export function generateStaticParams() {
  return models.map((model) => ({ category: model.category, slug: model.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const model = models.find((m) => m.category === category && m.slug === slug);
  if (!model) return { title: '未找到该模型' };

  const title = `${displayName(model)} · ${model.tools.slice(0, 3).join(' / ')} 3D 生成对照`;
  const description =
    model.description ??
    `${model.prompt.slice(0, 110).replace(/\s+/g, ' ')}… — 用 ${model.tools.join('、')} 生成的真实 3D 模型对照，可在线预览并下载 GLB。`;
  const url = absoluteUrl(modelPath(model));

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [model.title, model.category, '3D prompt', 'GLB', 'AI 3D 生成', ...model.tools],
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: SITE.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SITE.twitter,
    },
  };
}

export default async function ModelPage({ params }: PageProps) {
  const { category, slug } = await params;
  const model = models.find((m) => m.category === category && m.slug === slug);
  if (!model) notFound();

  const related = models
    .filter((m) => m.category === model.category && m.id !== model.id)
    .slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 sm:px-8">
      <header className="flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.svg" alt="3D Prompts logo" className="h-8 w-8" />
          {SITE.name}
        </Link>
        <a
          href={SITE.repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          <IconGithub className="h-3.5 w-3.5" />
          GitHub
        </a>
      </header>

      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition hover:text-neutral-900"
      >
        <IconArrowLeft className="h-3.5 w-3.5" />
        返回画廊
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_90px_-40px_rgba(0,0,0,0.35)]">
        <ModelDetail model={model} />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">同分类作品</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={modelPath(item)}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                {displayName(item)}
                <span className="ml-1.5 text-neutral-400">{formatBytes(item.modelSize)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-200 pt-6 text-xs text-neutral-400">
        <a
          href="https://t.me/prompts3D"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-600 underline decoration-neutral-300 underline-offset-2"
        >
          Telegram 社区
        </a>
        <span>所有模型与提示词来自开源社区贡献，遵循 MIT 协议。</span>
      </footer>
    </div>
  );
}
