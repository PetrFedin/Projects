'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { RangePlannerTier } from '@/lib/production/workshop2-range-planner-bridge';
import {
  WORKSHOP2_BUDGET_PARAM,
  WORKSHOP2_COL_PARAM,
  WORKSHOP2_CREATE_PARAM,
  WORKSHOP2_MARGIN_PARAM,
  WORKSHOP2_TIER_PARAM,
} from '@/lib/production/workshop2-url';

export function RangePlannerQuickCreateButton({
  tier,
  label,
  budget,
  targetMargin,
  collectionId = 'SS27',
}: {
  tier: RangePlannerTier;
  label: string;
  budget: number;
  targetMargin: number;
  collectionId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createViaApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/workshop2/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...buildWorkshop2ApiRequestHeaders(),
        },
        body: JSON.stringify({
          collectionId,
          tier,
          budget,
          targetMargin,
          commit: true,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; href?: string; message?: string };
      if (!res.ok || !json.ok || !json.href) {
        setError(json.message ?? 'Не удалось создать артикул');
        return;
      }
      router.push(json.href);
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  }, [budget, collectionId, router, targetMargin, tier]);

  const wizardHref = `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${collectionId}&${WORKSHOP2_CREATE_PARAM}=1&${WORKSHOP2_TIER_PARAM}=${tier}&${WORKSHOP2_BUDGET_PARAM}=${budget}&${WORKSHOP2_MARGIN_PARAM}=${targetMargin}`;

  return (
    <div className="space-y-2">
      <Button
        size="sm"
        className="w-full text-[10px] font-bold"
        disabled={loading}
        onClick={() => void createViaApi()}
      >
        <Sparkles className="mr-1 h-3 w-3" />
        {loading ? 'Создание…' : `Создать в W2 (${label})`}
      </Button>
      <Button size="sm" variant="outline" className="w-full text-[10px] font-bold" asChild>
        <Link href={wizardHref}>Мастер создания</Link>
      </Button>
      {error ? <p className="text-[10px] text-rose-600">{error}</p> : null}
    </div>
  );
}
