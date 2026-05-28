'use client';

import {
  useWorkshop2RefColors,
  useWorkshop2ReferencesPgOk,
} from '@/components/brand/production/use-workshop2-references';

/** Справочники Workshop2 — честный static/PG badge (Wave M/W28). */
export default function Workshop2ReferencesPage() {
  const { items: colors, state } = useWorkshop2RefColors(true);
  const pgOk = useWorkshop2ReferencesPgOk(true);

  return (
    <div className="space-y-4 pb-16">
      <div
        data-testid="workshop2-references-static-banner"
        className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-[12px] text-amber-950"
        role="status"
      >
        {pgOk
          ? 'Справочники: PostgreSQL'
          : 'Справочники: файл (PG off) — данные могут быть статическими'}
      </div>
      <p className="text-sm text-muted-foreground">
        Цвета загружены: {state} · записей {colors.length}
      </p>
    </div>
  );
}
