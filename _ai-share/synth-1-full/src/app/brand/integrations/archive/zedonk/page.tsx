'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Building2, Layers, Loader2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function BrandIntegrationsZedonkPage() {
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      orderNumber: string;
      status: string;
      partnerName?: string;
      brandId?: string;
      total?: number;
      currency?: string;
    }>
  >([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [brands, setBrands] = useState<Array<{ id: string; name?: string }>>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [consolidated, setConsolidated] = useState<
    Array<{ id: string; total?: number; brandOrders?: unknown[] }>
  >([]);
  const [consolidatedLoading, setConsolidatedLoading] = useState(false);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/b2b/zedonk/orders?limit=20');
      const data = (await res.ok) ? res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadBrands = async () => {
    setBrandsLoading(true);
    try {
      const res = await fetch('/api/b2b/zedonk/brands');
      const data = (await res.ok) ? res.json() : [];
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  };

  const loadConsolidated = async () => {
    setConsolidatedLoading(true);
    try {
      const res = await fetch('/api/b2b/zedonk/consolidated-orders?limit=20');
      const data = (await res.ok) ? res.json() : [];
      setConsolidated(Array.isArray(data) ? data : []);
    } catch {
      setConsolidated([]);
    } finally {
      setConsolidatedLoading(false);
    }
  };

  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Zedonk"
        leadPlain="Приём заказов из Zedonk (и при необходимости из JOOR/NuOrder через него). Multi-brand / agent — сводные заказы и список брендов при появлении API."
        eyebrow={
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.integrations} aria-label="Назад к интеграциям">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <ShoppingCart className="h-4 w-4" /> Приём заказов
            </CardTitle>
            <CardDescription>
              Заказы из Zedonk (и из JOOR/NuOrder через Zedonk) в раздел B2B заказов.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={loadOrders} disabled={ordersLoading}>
                {ordersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Загрузить заказы
              </Button>
              <Link href={ROUTES.brand.b2bOrders}>
                <Button variant="ghost" size="sm">
                  B2B заказы
                </Button>
              </Link>
            </div>
            {orders.length > 0 && (
              <ul className="divide-y rounded-md border text-sm">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex items-center justify-between px-3 py-2">
                    <span>
                      {o.orderNumber} — {o.partnerName ?? '—'}
                    </span>
                    {o.brandId && <Badge variant="outline">{o.brandId}</Badge>}
                    <Badge variant="secondary">{o.status}</Badge>
                    {o.total != null && (
                      <span>
                        {o.currency ?? ''} {o.total}
                      </span>
                    )}
                  </li>
                ))}
                {orders.length > 5 && (
                  <li className="text-text-secondary px-3 py-2">… ещё {orders.length - 5}</li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Building2 className="h-4 w-4" /> Multi-brand — список брендов
            </CardTitle>
            <CardDescription>Бренды в агентском кабинете. При появлении API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadBrands} disabled={brandsLoading}>
              {brandsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить бренды
            </Button>
            {brands.length > 0 && (
              <ul className="divide-y rounded-md border text-sm">
                {brands.slice(0, 10).map((b) => (
                  <li key={b.id} className="px-3 py-2">
                    {b.name ?? b.id}
                  </li>
                ))}
                {brands.length > 10 && (
                  <li className="text-text-secondary px-3 py-2">… ещё {brands.length - 10}</li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Layers className="h-4 w-4" /> Сводные заказы агента
            </CardTitle>
            <CardDescription>
              Один драфт по разным брендам. MOV/MOQ по бренду. При появлении API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadConsolidated}
              disabled={consolidatedLoading}
            >
              {consolidatedLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить сводные заказы
            </Button>
            {consolidated.length > 0 && (
              <ul className="divide-y rounded-md border text-sm">
                {consolidated.slice(0, 5).map((c) => (
                  <li key={c.id} className="px-3 py-2">
                    {c.id} {c.total != null && `· ${c.total}`} · брендов:{' '}
                    {c.brandOrders?.length ?? 0}
                  </li>
                ))}
                {consolidated.length > 5 && (
                  <li className="text-text-secondary px-3 py-2">… ещё {consolidated.length - 5}</li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase">Конфигурация</CardTitle>
            <CardDescription>
              ZEDONK_API_BASE (или NEXT_PUBLIC_ZEDONK_API_BASE) и ZEDONK_ACCESS_TOKEN. Документация:
              api-docs.jooraccess.com (Zedonk ERP).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={ROUTES.brand.b2bOrders}>
          <Button variant="outline" size="sm">
            B2B заказы
          </Button>
        </Link>
        <Link href={ROUTES.shop.b2bAgentCabinet}>
          <Button variant="outline" size="sm">
            Агентский кабинет
          </Button>
        </Link>
        <Link href={ROUTES.brand.integrationsColect}>
          <Button variant="ghost" size="sm">
            Colect
          </Button>
        </Link>
      </div>
    </RegistryPageShell>
  );
}
