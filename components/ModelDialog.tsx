'use client';

import { useEffect } from 'react';
import type { Model } from '@/lib/types';
import { ModelDetail } from './ModelDetail';
import { IconClose } from './icons';

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/50 p-3 backdrop-blur-sm sm:p-6 lg:p-10">
      <div aria-hidden className="absolute inset-0 cursor-default" onClick={onClose} />
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

        <ModelDetail model={model} />
      </div>
    </div>
  );
}
