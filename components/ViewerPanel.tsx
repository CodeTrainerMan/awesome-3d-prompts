'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import type { OrbitControls as OrbitControlsRef } from 'three-stdlib';
import { assetUrl, availableVariants, formatBytes } from '@/lib/catalog';
import type { Model } from '@/lib/types';
import { IconCamera, IconDownload, IconPause, IconRotate } from './icons';

const ModelScene = dynamic(() => import('./ModelScene'), { ssr: false });

function ToolButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
      }`}
    >
      {children}
    </button>
  );
}

export function ViewerPanel({ model }: { model: Model }) {
  const variants = useMemo(() => availableVariants(model), [model]);
  const [index, setIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControlsRef | null>(null);
  const { progress, active } = useProgress();

  useEffect(() => {
    setIndex(0);
    setAutoRotate(true);
  }, [model.id]);

  const variant = variants[Math.min(index, variants.length - 1)];

  if (!variant) {
    return (
      <div className="grid h-full min-h-[280px] place-items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 p-6 text-center">
        <div>
          <p className="text-sm font-medium text-neutral-700">暂无可预览的模型文件</p>
          <p className="mt-1 text-xs text-neutral-500">该条目目前只有提示词，欢迎补充生成结果</p>
        </div>
      </div>
    );
  }

  const url = assetUrl(model, variant.file);
  const loading = active && progress < 100;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,#eef0f5_70%,#e8ebf1_100%)]">
        <ModelScene url={url} autoRotate={autoRotate} controlsRef={controlsRef} />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
          {variants.length > 1 && variant.label && (
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur">
              {variant.label}
            </span>
          )}
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-neutral-500 backdrop-blur">
            {formatBytes(variant.size)}
          </span>
        </div>

        {loading && (
          <div className="absolute inset-0 grid place-items-center bg-white/45 backdrop-blur-[2px]">
            <div className="w-40">
              <div className="h-1 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-neutral-900 transition-[width] duration-200"
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>
              <p className="mt-2 text-center text-[11px] text-neutral-500">加载模型 {Math.round(progress)}%</p>
            </div>
          </div>
        )}

        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-[11px] text-neutral-500 backdrop-blur">
          拖拽旋转 · 滚轮缩放 · 右键平移
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v, i) => (
              <button
                key={v.file}
                type="button"
                onClick={() => setIndex(i)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                  i === index
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {v.label ?? `版本 ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ToolButton
            active={autoRotate}
            onClick={() => setAutoRotate((v) => !v)}
            title={autoRotate ? '停止旋转' : '自动旋转'}
          >
            {autoRotate ? <IconPause className="h-3.5 w-3.5" /> : <IconRotate className="h-3.5 w-3.5" />}
            {autoRotate ? '暂停' : '旋转'}
          </ToolButton>
          <ToolButton onClick={() => controlsRef.current?.reset()} title="重置视角">
            <IconCamera className="h-3.5 w-3.5" />
            重置
          </ToolButton>
          <a
            href={url}
            download={variant.file}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
          >
            <IconDownload className="h-3.5 w-3.5" />
            下载 GLB
          </a>
        </div>
      </div>
    </div>
  );
}
