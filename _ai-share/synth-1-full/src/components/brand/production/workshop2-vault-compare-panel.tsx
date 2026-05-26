'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  collectionId: string;
  articleId: string;
};

function Workshop2VaultComparePanelInner({ collectionId, articleId }: Props) {
  const [compareLeft, setCompareLeft] = useState('');
  const [compareRight, setCompareRight] = useState('');
  const [compareResult, setCompareResult] = useState<string | null>(null);

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3" data-testid="workshop2-vault-compare-panel">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Сравнить ревизии
      </p>
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          className="h-8 max-w-[120px] text-[11px]"
          placeholder="left id"
          value={compareLeft}
          onChange={(e) => setCompareLeft(e.target.value)}
        />
        <Input
          className="h-8 max-w-[120px] text-[11px]"
          placeholder="right id"
          value={compareRight}
          onChange={(e) => setCompareRight(e.target.value)}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-[10px]"
          onClick={async () => {
            if (!compareLeft.trim() || !compareRight.trim()) return;
            const qs = new URLSearchParams({
              left: compareLeft.trim(),
              right: compareRight.trim(),
              collectionId,
              articleId,
            });
            const res = await fetch(`/api/workshop2/vault/compare?${qs.toString()}`);
            const json = (await res.json()) as { ok?: boolean; compare?: { summaryRu?: string } };
            setCompareResult(json.compare?.summaryRu ?? (json.ok ? 'OK' : 'Ошибка compare'));
          }}
        >
          Сравнить ревизии
        </Button>
      </div>
      {compareResult ? (
        <p className="mt-2 text-[10px] text-slate-600" role="status">
          {compareResult}
        </p>
      ) : null}
    </div>
  );
}

/** Wave 14: lazy chunk для vault compare (тяжёлый fetch UI). */
export const Workshop2VaultComparePanel = dynamic(
  () => Promise.resolve({ default: Workshop2VaultComparePanelInner }),
  { ssr: false, loading: () => <p className="text-[10px] text-slate-400">Загрузка compare…</p> }
);
