'use client';

import { useEffect, useState } from 'react';
import { formatWorkshop2ArticleRowDateTime } from '@/components/brand/production/workshop2-tab-content-utils';

export function Workshop2ArticleDateFlip({
  addedAtIso,
  updatedAtIso,
}: {
  addedAtIso?: string;
  updatedAtIso?: string;
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const canFlip =
      addedAtIso &&
      updatedAtIso &&
      updatedAtIso !== addedAtIso &&
      updatedAtIso.localeCompare(addedAtIso) > 0;
    if (!canFlip) return;
    const id = window.setInterval(() => setPhase((p) => p + 1), 30_000);
    return () => clearInterval(id);
  }, [addedAtIso, updatedAtIso]);

  if (!addedAtIso) {
    return <span className="text-text-muted text-[9px]">Нет даты создания в разработке</span>;
  }
  const canFlip =
    updatedAtIso && updatedAtIso !== addedAtIso && updatedAtIso.localeCompare(addedAtIso) > 0;
  const showUpdated = canFlip && phase % 2 === 1;
  if (showUpdated && updatedAtIso) {
    return (
      <span className="text-text-secondary block text-[9px] leading-tight">
        <span className="text-text-muted">Изменён</span>
        <span className="text-text-primary block font-medium tabular-nums">
          {formatWorkshop2ArticleRowDateTime(updatedAtIso)}
        </span>
      </span>
    );
  }
  return (
    <span className="text-text-secondary block text-[9px] leading-tight">
      <span className="text-text-muted">Создан</span>
      <span className="text-text-primary block font-medium tabular-nums">
        {formatWorkshop2ArticleRowDateTime(addedAtIso)}
      </span>
    </span>
  );
}
