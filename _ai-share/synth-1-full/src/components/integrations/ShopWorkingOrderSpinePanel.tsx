'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { ROUTES, shopB2bMatrixReorderHref, shopB2bOrderHref } from '@/lib/routes';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-demo-context';
import {
  formatWholesaleOrderDisplayId,
  isIntegrationImportedWholesaleOrderId,
} from '@/lib/integrations/spine/integration-ui-utils';

type Version = {
  versionId: string;
  label: string;
  status: string;
  createdAt: string;
  lines: Array<{ productId?: string; quantity?: number }>;
};

type Props = {
  wholesaleOrderId: string;
};

/** Wave C2 · F-WORKING-ORDER on shop pillar 3 (replaces legacy redirect). */
export function ShopWorkingOrderSpinePanel({ wholesaleOrderId }: Props) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [exportId, setExportId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoadState('loading');
    try {
      const res = await fetch(
        `/api/integrations/v1/working-order/${encodeURIComponent(wholesaleOrderId)}`,
        { cache: 'no-store' }
      );
      const json = (await res.json()) as {
        data?: {
          versions?: Version[];
          export?: { externalExportId?: string } | null;
        };
      };
      if (res.ok && json.data) {
        setVersions(json.data.versions ?? []);
        setExportId(json.data.export?.externalExportId ?? null);
        setLoadState('ready');
      } else {
        setLoadState('error');
      }
    } catch {
      setLoadState('error');
    }
  };

  useEffect(() => {
    if (!wholesaleOrderId.trim()) return;
    void load();
  }, [wholesaleOrderId]);

  const addVersion = async () => {
    setBusy(true);
    try {
      await fetch(`/api/integrations/v1/working-order/${encodeURIComponent(wholesaleOrderId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: `Shop edit ${new Date().toLocaleDateString('ru-RU')}` }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (!isIntegrationImportedWholesaleOrderId(wholesaleOrderId)) {
    return (
      <Card data-testid="shop-working-order-non-spine">
        <CardContent className="py-4 text-sm text-muted-foreground">
          Рабочий заказ доступен для внешних оптовых заказов.
          <Link href={shopB2bOrderHref(wholesaleOrderId)} className="text-accent-primary ml-2 hover:underline">
            Карточка заказа
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="shop-working-order-spine-panel">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
          <FileText className="h-4 w-4" aria-hidden />
          Рабочий заказ · {formatWholesaleOrderDisplayId(wholesaleOrderId)}
        </CardTitle>
        <CardDescription>Версии редактирования и экспорт во внешний B2B-канал</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {exportId ? (
          <Badge variant="secondary" className="text-[10px]" data-testid="shop-working-order-export-badge">
            Экспорт · {exportId}
          </Badge>
        ) : null}
        {loadState === 'loading' ? (
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Загрузка версий…
          </p>
        ) : (
          <ul className="space-y-1.5 text-xs" data-testid="shop-working-order-version-list">
            {versions.map((v) => (
              <li key={v.versionId} className="rounded border px-2 py-1.5">
                <span className="font-medium">{v.label}</span>
                <span className="text-muted-foreground ml-2">{v.status}</span>
                <span className="text-muted-foreground ml-2">{v.lines.length} строк</span>
              </li>
            ))}
            {versions.length === 0 ? (
              <li className="text-muted-foreground">Нет версий — появятся после confirm брендом.</li>
            ) : null}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => void addVersion()}
            data-testid="shop-working-order-add-version-btn"
          >
            {busy ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            Новая версия
          </Button>
          <Link
            href={shopB2bMatrixReorderHref(PLATFORM_CORE_DEMO.collectionId, wholesaleOrderId)}
            className="text-accent-primary text-[11px] font-medium hover:underline"
            data-testid="shop-working-order-matrix-link"
          >
            Сравнить с матрицей
          </Link>
          <Link href={shopB2bOrderHref(wholesaleOrderId)} className="text-accent-primary text-[11px] hover:underline">
            Карточка заказа
          </Link>
          <Link href={ROUTES.shop.b2bOrders} className="text-muted-foreground text-[11px] hover:underline">
            Реестр
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
