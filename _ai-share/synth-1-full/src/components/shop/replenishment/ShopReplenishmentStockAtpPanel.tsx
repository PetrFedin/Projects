'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buildShopReplenishmentSession } from '@/lib/b2b/shop-replenishment-workspace';
import {
  buildIntakeAllocationPayloadFromAtpRows,
  postB2bIntakeAllocation,
  type IntakeAllocationResult,
} from '@/lib/b2b/intake-allocation-client';
import {
  buildShopReplenishmentStockRows,
  type ReplenishmentStockAtpSource,
  type ReplenishmentStockRow,
} from '@/lib/platform/shop-replenishment-stock-atp';
import {
  buildReplenishmentStockSliceHref,
  readReplenishmentStockSliceFromSearchParams,
  REPLENISHMENT_STOCK_SLICE_PARAMS,
  REPLENISHMENT_STOCK_SLICE_PRESETS,
} from '@/lib/platform/shop-replenishment-stock-slices';
import {
  fetchShopReplenishmentStockSlice,
  saveShopReplenishmentStockSlice,
} from '@/lib/shop/shop-replenishment-stock-slice-store';
import { cn } from '@/lib/utils';

type Props = {
  collectionId?: string;
  orderId?: string;
};

export function ShopReplenishmentStockAtpPanel({ collectionId, orderId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = useMemo(
    () => buildShopReplenishmentSession({ collectionId, orderId }),
    [collectionId, orderId]
  );
  const slice = useMemo(
    () => readReplenishmentStockSliceFromSearchParams(searchParams),
    [searchParams]
  );
  const demoRows = useMemo(() => buildShopReplenishmentStockRows(12, slice), [slice]);
  const [rows, setRows] = useState<ReplenishmentStockRow[]>(demoRows);
  const [source, setSource] = useState<ReplenishmentStockAtpSource>('demo');
  const [sliceStorageMode, setSliceStorageMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [allocateResult, setAllocateResult] = useState<IntakeAllocationResult | null>(null);
  const [allocateError, setAllocateError] = useState<string | null>(null);

  useEffect(() => {
    const hasSliceParams =
      searchParams.has(REPLENISHMENT_STOCK_SLICE_PARAMS.org) ||
      searchParams.has(REPLENISHMENT_STOCK_SLICE_PARAMS.season);
    if (hasSliceParams) return;
    void fetchShopReplenishmentStockSlice().then(({ slice, storageMode }) => {
      if (!slice) return;
      setSliceStorageMode(storageMode ?? null);
      const href = buildReplenishmentStockSliceHref(
        pathname,
        slice,
        new URLSearchParams(searchParams.toString())
      );
      router.replace(href, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    let cancelled = false;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set('limit', '12');
    if (collectionId) qs.set('collection', collectionId);
    setLoading(true);
    void fetch(`/api/shop/b2b/replenishment/stock-atp?${qs.toString()}`)
      .then((res) => res.json())
      .then((json: { ok?: boolean; rows?: ReplenishmentStockRow[]; source?: ReplenishmentStockAtpSource }) => {
        if (cancelled || json.ok !== true || !Array.isArray(json.rows)) return;
        setRows(json.rows);
        setSource(json.source ?? 'demo');
      })
      .catch(() => {
        if (!cancelled) {
          setRows(demoRows);
          setSource('demo');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionId, demoRows, searchParams]);

  const lowAtp = rows.filter((r) => r.atp < 5).length;

  const runIntakeAllocate = () => {
    setAllocating(true);
    setAllocateError(null);
    const batchId = `batch-${session.collectionId}-${Date.now()}`;
    const payload = buildIntakeAllocationPayloadFromAtpRows({
      rows,
      batchId,
      orderId: session.orderId,
    });
    void postB2bIntakeAllocation(payload)
      .then((result) => setAllocateResult(result))
      .catch((err: unknown) => {
        setAllocateResult(null);
        setAllocateError(err instanceof Error ? err.message : 'Ошибка аллокации');
      })
      .finally(() => setAllocating(false));
  };

  const setSlice = (preset: (typeof REPLENISHMENT_STOCK_SLICE_PRESETS)[number]) => {
    void saveShopReplenishmentStockSlice(preset).then((res) => {
      if (res.storageMode) setSliceStorageMode(res.storageMode);
    });
    const href = buildReplenishmentStockSliceHref(
      pathname,
      preset,
      new URLSearchParams(searchParams.toString())
    );
    router.replace(href, { scroll: false });
  };

  return (
    <div className="space-y-4" data-testid="shop-replenishment-feature-stock-atp">
      <div className="space-y-2">
        <p className="text-text-muted text-[10px] uppercase">Filter slices</p>
        <div className="flex flex-wrap gap-1">
          {REPLENISHMENT_STOCK_SLICE_PRESETS.map((preset) => {
            const active =
              preset.orgId === slice.orgId &&
              preset.seasonId === slice.seasonId &&
              preset.collectionId === slice.collectionId;
            return (
              <button
                key={preset.labelRu}
                type="button"
                onClick={() => setSlice(preset)}
                className={cn(
                  'rounded-md border px-2 py-1 text-[11px] font-medium transition-colors',
                  active
                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                    : 'border-border-subtle text-text-secondary hover:bg-bg-surface2'
                )}
                data-testid={`shop-replenishment-slice-${preset.seasonId}`}
              >
                {preset.labelRu}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">SKU: {rows.length}</Badge>
        <Badge variant="outline">{slice.labelRu}</Badge>
        <Badge
          variant="outline"
          data-testid={`shop-replenishment-stock-atp-source-${source}`}
          className={source === 'pg' ? 'border-emerald-500/40 text-emerald-700' : ''}
        >
          {source === 'pg' ? 'PG grains' : source === 'demo' ? 'Demo grains' : `Source: ${source}`}
        </Badge>
        {sliceStorageMode === 'pg' ? (
          <Badge variant="outline" className="border-sky-500/40 text-sky-700">
            Slice saved · PG
          </Badge>
        ) : null}
        {loading ? (
          <Badge variant="outline" className="animate-pulse">
            Loading ATP…
          </Badge>
        ) : null}
        <Badge variant="outline" className="border-amber-500/40 text-amber-700">
          ATP &lt; 5: {lowAtp}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href={session.inventoryOverviewHref}>Ритейл · inventory</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={session.rulesHref}>Правила</Link>
        </Button>
        <Button size="sm" asChild data-testid="shop-replenishment-stock-atp-matrix-link">
          <Link href={session.matrixHref}>Reorder · матрица</Link>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          disabled={allocating || loading}
          onClick={runIntakeAllocate}
          data-testid="shop-replenishment-intake-allocate-run"
        >
          {allocating ? 'Аллокация…' : 'Intake · allocate'}
        </Button>
        <Button variant="outline" size="sm" asChild data-testid="shop-replenishment-supplier-forecast-link">
          <Link href={session.supplierForecastHref}>Supplier · forecast</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={session.prepackHref}>Pre-pack</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={session.workingOrderHref}>Working order · bulk</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={session.landedMarginHref}>Landed margin</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={session.orderCommsHref}>Order tracking</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={session.collaborativeApprovalsHref}>Collaborative approvals</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={session.brandOrderChatHref}>Brand order chat</Link>
        </Button>
      </div>

      {allocateResult?.planId ? (
        <Card
          className="border-emerald-200/60 bg-emerald-50/40"
          data-testid="shop-replenishment-intake-allocate-result"
        >
          <CardContent className="py-3 text-sm">
            <p className="font-medium text-emerald-900">
              {allocateResult.messageRu ?? `План ${allocateResult.planId} сохранён.`}
            </p>
            <p className="text-text-muted mt-1 text-xs">
              Allocations: {allocateResult.allocations?.length ?? 0} · Unallocated:{' '}
              {allocateResult.unallocated?.length ?? 0}
              {allocateResult.persistMode ? ` · ${allocateResult.persistMode}` : ''}
            </p>
          </CardContent>
        </Card>
      ) : null}
      {allocateError ? (
        <p className="text-destructive text-sm" data-testid="shop-replenishment-intake-allocate-error">
          {allocateError}
        </p>
      ) : null}

      <Card className="border-border-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stock details</CardTitle>
          <CardDescription>
            Onfinity-style: on hand, reserved, ATP — ledger grains
            {source === 'pg' ? ' из PostgreSQL' : source === 'demo' ? ' (demo fallback)' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">On hand</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">ATP</TableHead>
                <TableHead className="text-right">In transit</TableHead>
                <TableHead className="text-right">Unconfirmed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.sku} data-testid={`shop-replenishment-stock-row-${r.sku}`}>
                  <TableCell>
                    <span className="font-mono text-xs">{r.sku}</span>
                    <p className="text-text-muted line-clamp-1 max-w-[180px] text-[10px]">{r.name}</p>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{r.onHand}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{r.reserved}</TableCell>
                  <TableCell
                    className={`text-right font-mono text-sm ${r.atp < 5 ? 'text-amber-600' : ''}`}
                  >
                    {r.atp}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{r.inTransit}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{r.unconfirmed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
