'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { postB2bExportOrder } from '@/lib/b2b/post-b2b-export-order-client';

/**
 * Карточка экспорта заказа на платформу Syntha (`POST /api/b2b/export-order`, provider `platform`).
 * `data-testid` — контракт `e2e/b2b-create-order-platform-export-ui.spec.ts` и `SOURCE_OF_TRUTH.md`.
 */
export function ShopB2bPlatformExportCard() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setExportJobId(null);
    setResolvedOrderId(null);
    const oid = orderIdInput.trim();
    if (!oid) {
      setError('Укажите номер заказа.');
      return;
    }
    setLoading(true);
    try {
      const { body: data } = await postB2bExportOrder({
        provider: 'platform',
        payload: { orderId: oid },
      });
      if (data.success && data.exportJobId) {
        setExportJobId(data.exportJobId);
        setResolvedOrderId(data.orderId ?? oid);
      } else {
        setError(data.error ?? 'Экспорт не выполнен.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6" data-testid="shop-b2b-create-order-platform-export">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase">Экспорт на платформу</CardTitle>
        <CardDescription>
          Тестовый вызов <code className="text-xs">POST /api/b2b/export-order</code> (provider{' '}
          <code>platform</code>). Для демо интеграций и регрессии E2E.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1">
            <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Номер заказа (orderId)
            </label>
            <Input
              data-testid="shop-b2b-platform-export-order-id"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="например wholesale-123"
              className="font-mono text-sm"
            />
          </div>
          <Button
            type="button"
            data-testid="shop-b2b-platform-export-submit"
            disabled={loading}
            className="shrink-0 rounded-xl text-[10px] font-black uppercase tracking-widest"
            onClick={() => void onSubmit()}
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="mr-2 size-4" aria-hidden />
            )}
            Отправить
          </Button>
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        {exportJobId && resolvedOrderId ? (
          <div
            data-testid="shop-b2b-platform-export-result"
            className="border-border-subtle bg-bg-surface2/50 rounded-lg border p-3 text-sm"
          >
            <p>
              <span className="text-text-muted">exportJobId:</span> {exportJobId}
            </p>
            <p className="mt-1">{resolvedOrderId}</p>
            <p className="text-muted-foreground mt-2">Готово.</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
