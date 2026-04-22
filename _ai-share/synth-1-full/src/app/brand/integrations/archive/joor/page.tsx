'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  DollarSign,
  ShoppingCart,
  Shirt,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

type Message = { type: 'success' | 'error'; text: string };

export default function BrandIntegrationsJoorPage() {
  const [inventoryMsg, setInventoryMsg] = useState<Message | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [priceTypes, setPriceTypes] = useState<Array<{ id: string; name?: string; currency_code?: string }>>([]);
  const [priceTypesLoading, setPriceTypesLoading] = useState(false);
  const [pricesMsg, setPricesMsg] = useState<Message | null>(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [orders, setOrders] = useState<Array<{ id: string; orderNumber: string; status: string; partnerName?: string; createdAt: string; total?: number; currency?: string }>>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stylesMsg, setStylesMsg] = useState<Message | null>(null);
  const [stylesLoading, setStylesLoading] = useState(false);
  const [customersMsg, setCustomersMsg] = useState<Message | null>(null);
  const [customersLoading, setCustomersLoading] = useState(false);

  const pushInventory = async () => {
    setInventoryMsg(null);
    setInventoryLoading(true);
    try {
      const res = await fetch('/api/b2b/joor/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ sku: 'DEMO-SKU-01', quantity: 100, availableDate: new Date().toISOString().slice(0, 10) }],
          overwrite: false,
        }),
      });
      const data = await res.json();
      if (data.success) setInventoryMsg({ type: 'success', text: `Обработано: ${data.processed ?? 0}` });
      else setInventoryMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setInventoryMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setInventoryLoading(false);
    }
  };

  const loadPriceTypes = async () => {
    setPriceTypesLoading(true);
    try {
      const res = await fetch('/api/b2b/joor/price-types');
      const data = await res.ok ? res.json() : [];
      setPriceTypes(Array.isArray(data) ? data : []);
    } catch {
      setPriceTypes([]);
    } finally {
      setPriceTypesLoading(false);
    }
  };

  const upsertPrices = async () => {
    setPricesMsg(null);
    setPricesLoading(true);
    try {
      const res = await fetch('/api/b2b/joor/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prices: [
            {
              sku_identifier: 'DEMO-SKU-01',
              price_type_name: 'Wholesale',
              price_type_currency_code: 'USD',
              wholesale_value: 50,
              retail_value: 100,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) setPricesMsg({ type: 'success', text: `Обновлено: ${data.count ?? 0}` });
      else setPricesMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setPricesMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setPricesLoading(false);
    }
  };

  const importOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/b2b/joor/orders?limit=20');
      const data = await res.ok ? res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const syncStyles = async () => {
    setStylesMsg(null);
    setStylesLoading(true);
    try {
      const res = await fetch('/api/b2b/joor/sync-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styles: [{ style_identifier: 'DEMO-STYLE-01', name: 'Demo Style' }] }),
      });
      const data = await res.json();
      if (data.success) setStylesMsg({ type: 'success', text: `Синхронизировано: ${data.synced ?? 0}` });
      else setStylesMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setStylesMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setStylesLoading(false);
    }
  };

  const syncCustomers = async () => {
    setCustomersMsg(null);
    setCustomersLoading(true);
    try {
      const res = await fetch('/api/b2b/joor/sync-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: [{ name: 'Demo Partner', email: 'partner@example.com' }] }),
      });
      const data = await res.json();
      if (data.success) setCustomersMsg({ type: 'success', text: `Синхронизировано: ${data.synced ?? 0}` });
      else setCustomersMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setCustomersMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setCustomersLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.integrations}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">JOOR</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Остатки (v2), цены (v4), импорт заказов, синхрон стилей и клиентов.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Inventory v2 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Package className="h-4 w-4" /> Остатки (Inventory v2)
            </CardTitle>
            <CardDescription>Выгрузка остатков по складам и датам. Overwrite или Update.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button onClick={pushInventory} disabled={inventoryLoading}>
              {inventoryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Синхронизировать с JOOR
            </Button>
            {inventoryMsg && (
              <span className={inventoryMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {inventoryMsg.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                {inventoryMsg.text}
              </span>
            )}
          </CardContent>
        </Card>

        {/* Prices v4 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Цены (Prices v4)
            </CardTitle>
            <CardDescription>Типы цен и массовое обновление по SKU, валютам, клиентам.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={loadPriceTypes} disabled={priceTypesLoading}>
                {priceTypesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Типы цен JOOR
              </Button>
              <Button size="sm" onClick={upsertPrices} disabled={pricesLoading}>
                {pricesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Выгрузить цены в JOOR
              </Button>
            </div>
            {priceTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {priceTypes.slice(0, 10).map((t) => (
                  <Badge key={t.id} variant="secondary">{t.name ?? t.id} {t.currency_code ?? ''}</Badge>
                ))}
                {priceTypes.length > 10 && <Badge variant="outline">+{priceTypes.length - 10}</Badge>}
              </div>
            )}
            {pricesMsg && (
              <p className={pricesMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {pricesMsg.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                {pricesMsg.text}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Orders import */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Импорт заказов
            </CardTitle>
            <CardDescription>Загрузка заказов из JOOR в раздел B2B заказов.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={importOrders} disabled={ordersLoading}>
                {ordersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Импорт из JOOR
              </Button>
              <Link href={ROUTES.brand.b2bOrders}>
                <Button variant="ghost" size="sm">B2B заказы</Button>
              </Link>
            </div>
            {orders.length > 0 && (
              <ul className="border rounded-md divide-y text-sm">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="px-3 py-2 flex justify-between items-center">
                    <span>{o.orderNumber} — {o.partnerName ?? '—'}</span>
                    <Badge variant="secondary">{o.status}</Badge>
                    {o.total != null && <span>{o.currency ?? ''} {o.total}</span>}
                  </li>
                ))}
                {orders.length > 5 && <li className="px-3 py-2 text-slate-500">… ещё {orders.length - 5}</li>}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Styles */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Shirt className="h-4 w-4" /> Стили / продукты
            </CardTitle>
            <CardDescription>Синхрон стилей и лайншитов в JOOR (bulk).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button onClick={syncStyles} disabled={stylesLoading}>
              {stylesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Синхрон стилей в JOOR
            </Button>
            {stylesMsg && (
              <span className={stylesMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {stylesMsg.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                {stylesMsg.text}
              </span>
            )}
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Users className="h-4 w-4" /> Клиенты / партнёры
            </CardTitle>
            <CardDescription>Синхрон контактов и правил (sales rep, warehouse, скидки).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button onClick={syncCustomers} disabled={customersLoading}>
              {customersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Синхрон партнёров в JOOR
            </Button>
            {customersMsg && (
              <span className={customersMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {customersMsg.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                {customersMsg.text}
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={ROUTES.brand.b2bOrders}>
          <Button variant="outline" size="sm">B2B заказы</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsNuOrder}>
          <Button variant="ghost" size="sm">NuOrder</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsFashionCloud}>
          <Button variant="ghost" size="sm">Fashion Cloud</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsSparkLayer}>
          <Button variant="ghost" size="sm">SparkLayer</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsColect}>
          <Button variant="ghost" size="sm">Colect</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsZedonk}>
          <Button variant="ghost" size="sm">Zedonk</Button>
        </Link>
      </div>
    </div>
  );
}
