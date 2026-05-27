'use client';

import { cn } from '@/lib/utils';

export function Workshop2ConstructionCadZipReadinessStrip({
  techPackCount,
  techPackWithBytes,
  nextZipBytesStepLabel,
}: {
  techPackCount: number;
  techPackWithBytes: number;
  /** Текст «Следующий шаг», если первый невыполненный гейт — zip_bytes. */
  nextZipBytesStepLabel?: string | null;
}) {
  const cadZipAllFilled = techPackCount > 0 && techPackWithBytes === techPackCount;
  const cadZipPartialBytes =
    techPackCount > 0 && techPackWithBytes > 0 && techPackWithBytes < techPackCount;
  const cadZipEmptyBytes = techPackCount > 0 && techPackWithBytes === 0;
  const cadZipNoAttachments = techPackCount === 0;
  const zipBytesHint = nextZipBytesStepLabel?.trim() ?? '';

  return (
    <div
      className="border-border-subtle bg-bg-surface2/35 rounded-md border px-3 py-2"
      role="status"
      aria-label="Готовность CAD и ZIP пакета"
    >
      <p className="text-text-primary text-[10px] font-semibold">Готовность CAD/ZIP</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        <li
          className={cn(
            'rounded px-1.5 py-0.5 text-[10px] font-medium',
            cadZipAllFilled
              ? 'bg-emerald-100 text-emerald-800'
              : cadZipPartialBytes
                ? 'bg-amber-100 text-amber-900'
                : cadZipEmptyBytes
                  ? 'bg-rose-100 text-rose-900'
                  : 'text-text-muted bg-muted'
          )}
        >
          {cadZipAllFilled ? '✓' : cadZipPartialBytes ? '!' : '○'}{' '}
          {cadZipNoAttachments
            ? 'Вложений в пакете нет'
            : `Файлы с данными: ${techPackWithBytes}/${techPackCount}`}
        </li>
        {zipBytesHint ? (
          <li className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
            Следующий шаг: {zipBytesHint}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
