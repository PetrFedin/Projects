'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

type Props = {
  className?: string;
  testId?: string;
};

/**
 * Wave 29: честный баннер вместо disabled «скоро» — Genkit не настроен.
 */
export function Workshop2SketchGenkitHonestBanner({
  className = '',
  testId = 'workshop2-sketch-genkit-banner',
}: Props) {
  return (
    <div
      className={`rounded-md border border-amber-200 bg-amber-50/90 px-3 py-2 text-[11px] text-amber-950 ${className}`}
      data-testid={testId}
    >
      <p className="flex items-start gap-1.5 font-semibold">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        AI-скетч требует Genkit
      </p>
      <p className="mt-1 leading-snug text-amber-900/90">
        Авто-разметка и генерация скетча недоступны без{' '}
        <code className="rounded bg-amber-100 px-1">GOOGLE_GENAI_API_KEY</code>. Загрузите файл
        вручную или настройте AI в setup.
      </p>
      <Link
        href="/brand/production/workshop2/setup#genkit"
        className="mt-1.5 inline-block font-semibold text-indigo-700 underline-offset-2 hover:underline"
      >
        Настроить Genkit →
      </Link>
    </div>
  );
}
