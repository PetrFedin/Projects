'use client';

import Link from 'next/link';
import {
  useWorkshop2BackendStatusHint,
  workshop2BackendStatusHintRu,
} from '@/components/brand/production/use-workshop2-backend-status-hint';

/** Единый banner деградации PG/API на хабе Workshop2. */
export function Workshop2BackendStatusBanner({ active = true }: { active?: boolean }) {
  const status = useWorkshop2BackendStatusHint(active);

  if (status === 'loading' || status === 'server') {
    return null;
  }

  return (
    <div
      className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50/95 px-3 py-2.5 text-[12px] text-amber-950"
      role="status"
    >
      <span>{workshop2BackendStatusHintRu(status)}</span>
      <Link
        href="/brand/production/workshop2/setup"
        className="shrink-0 font-medium text-amber-900 underline underline-offset-2"
      >
        Настройка →
      </Link>
    </div>
  );
}
