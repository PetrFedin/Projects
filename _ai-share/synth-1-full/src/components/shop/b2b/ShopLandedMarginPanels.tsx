'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { buildShopLandedMarginSession } from '@/lib/b2b/shop-landed-margin';
import {
  fetchShopLandedMarginRollup,
  refreshShopLandedMarginRollup,
} from '@/lib/b2b/landed-margin-feed-store';
import { fetchShopPricelistTierSync } from '@/lib/b2b/brand-pricelist-tier-sync-store';
import { summarizeBrandPricelistTierSync } from '@/lib/b2b/brand-pricelist-tier-sync';
import { PRICE_TIER_LABELS } from '@/lib/b2b/price-tiers';
import { ROUTES } from '@/lib/routes';
import { BarChart3, Calculator, Loader2, PieChart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';

export function ShopLandedMarginHubPanel() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });

  return (
    <div className="space-y-4" data-testid="shop-landed-margin-hub-panel">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="text-text-secondary h-4 w-4" />
              Калькулятор
            </CardTitle>
            <CardDescription>Маржа в корзине</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full text-xs font-black uppercase" asChild>
              <Link href={ROUTES.shop.b2bMarginCalculator}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="text-text-secondary h-4 w-4" />
              Отчёт ASOS
            </CardTitle>
            <CardDescription>По брендам и категориям</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full text-xs font-black uppercase" asChild>
              <Link href={ROUTES.shop.b2bMarginReport}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="text-text-secondary h-4 w-4" />
              Landed cost
            </CardTitle>
            <CardDescription>Полная себестоимость поставки</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full text-xs font-black uppercase" asChild>
              <Link href={ROUTES.shop.b2bLandedCost}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ShopLandedMarginRollupPanel() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });
  const { activeOrderId } = useSpineActiveWholesaleOrderId({ resolveFrom: ['allocation', 'operational'] });
  const session = useMemo(
    () => buildShopLandedMarginSession({ collectionId, orderId: activeOrderId }),
    [activeOrderId, collectionId]
  );
  const [rows, setRows] = useState<Awaited<ReturnType<typeof fetchShopLandedMarginRollup>>['rows']>([]);
  const [summary, setSummary] = useState({ total: 0, onTarget: 0, avgMarginPct: 0 });
  const [storageMode, setStorageMode] = useState('demo');
  const [orderLinked, setOrderLinked] = useState(false);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    const res = await fetchShopLandedMarginRollup({ collectionId, orderId: activeOrderId });
    setRows(res.rows ?? []);
    setSummary({
      total: res.summary?.total ?? 0,
      onTarget: res.summary?.onTarget ?? 0,
      avgMarginPct: res.summary?.avgMarginPct ?? 0,
    });
    setStorageMode(res.storageMode ?? 'demo');
    setOrderLinked(res.orderLinked ?? false);
  }, [activeOrderId, collectionId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const syncRollup = async () => {
    setBusy(true);
    try {
      const res = await refreshShopLandedMarginRollup({ collectionId, orderId: activeOrderId });
      if (res.ok && res.rows) {
        setRows(res.rows);
        setSummary({
          total: res.summary?.total ?? 0,
          onTarget: res.summary?.onTarget ?? 0,
          avgMarginPct: res.summary?.avgMarginPct ?? 0,
        });
        setStorageMode(res.storageMode ?? storageMode);
        setOrderLinked(res.orderLinked ?? orderLinked);
      } else {
        await reload();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="shop-landed-margin-rollup-panel">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Lines: {summary.total}</Badge>
        <Badge variant="outline">On target: {summary.onTarget}</Badge>
        <Badge variant="outline">Avg margin: {summary.avgMarginPct}%</Badge>
        {orderLinked ? (
          <Badge variant="outline" data-testid="shop-landed-margin-order-linked">
            B2B order
          </Badge>
        ) : null}
        <Badge variant="outline" data-testid={`shop-landed-margin-feed-source-${storageMode}`}>
          {storageMode === 'pg' ? 'PG margin feed' : `${storageMode} margin feed`}
        </Badge>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.brandMarginSimulatorHref}>Brand simulator</Link>
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={() => void reload()}>
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={busy}
          onClick={() => void syncRollup()}
          data-testid="shop-landed-margin-rollup-sync"
        >
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Sync order feed'}
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Landed margin roll-up</CardTitle>
          <CardDescription>
            Wholesale vs landed для active B2B order · persisted PG/file feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Line</TableHead>
                <TableHead className="text-right">Wholesale</TableHead>
                <TableHead className="text-right">Landed</TableHead>
                <TableHead className="text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rows ?? []).map((row) => (
                <TableRow key={row.lineId} data-testid={`shop-landed-margin-row-${row.lineId}`}>
                  <TableCell className="text-xs">{row.label}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {row.wholesaleRub.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {row.landedRub.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={row.onTarget ? 'secondary' : 'outline'}>{row.marginPct}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function ShopLandedMarginPricelistPanel() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });
  const { activeOrderId } = useSpineActiveWholesaleOrderId({ resolveFrom: ['allocation', 'operational'] });
  const session = useMemo(
    () => buildShopLandedMarginSession({ collectionId, orderId: activeOrderId }),
    [activeOrderId, collectionId]
  );
  const [syncRows, setSyncRows] = useState<
    Awaited<ReturnType<typeof fetchShopPricelistTierSync>>['rows']
  >([]);
  const [storageMode, setStorageMode] = useState<string>('demo');

  useEffect(() => {
    void fetchShopPricelistTierSync(collectionId).then((res) => {
      setSyncRows(res.rows ?? []);
      setStorageMode(res.storageMode ?? 'demo');
    });
  }, [collectionId]);

  const syncSummary = useMemo(() => summarizeBrandPricelistTierSync(syncRows ?? []), [syncRows]);

  return (
    <div className="space-y-4" data-testid="shop-landed-margin-pricelist-panel">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Synced tiers: {syncSummary.synced}</Badge>
        <Badge variant="outline" data-testid={`shop-pricelist-tier-sync-source-${storageMode}`}>
          {storageMode === 'pg' ? 'PG tier sync' : `${storageMode} tier sync`}
        </Badge>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.brandShopSyncHref}>Brand shop sync</Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Synced multipliers</CardTitle>
          <CardDescription>Brand pricelist tier → shop wholesale / landed margin.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>List</TableHead>
                <TableHead className="text-right">×</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(syncRows ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-text-muted text-xs">
                    Нет synced tiers — push на brand · shop sync.
                  </TableCell>
                </TableRow>
              ) : (
                (syncRows ?? []).map((row) => (
                  <TableRow
                    key={row.tierId}
                    data-testid={`shop-pricelist-tier-sync-row-${row.tierId}`}
                  >
                    <TableCell>{PRICE_TIER_LABELS[row.tierId]}</TableCell>
                    <TableCell className="text-xs">{row.priceListName}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{row.multiplier}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
