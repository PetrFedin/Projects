'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  Truck,
  FileEdit,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

type Message = { type: 'success' | 'error'; text: string };

export default function BrandIntegrationsNuorderPage() {
  const [inventoryMsg, setInventoryMsg] = useState<Message | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [shipmentMsg, setShipmentMsg] = useState<Message | null>(null);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [orderIdShipment, setOrderIdShipment] = useState('');
  const [editMsg, setEditMsg] = useState<Message | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [orderIdEdit, setOrderIdEdit] = useState('');
  const [replenishmentMsg, setReplenishmentMsg] = useState<Message | null>(null);
  const [replenishmentLoading, setReplenishmentLoading] = useState(false);

  const pushInventory = async () => {
    setInventoryMsg(null);
    setInventoryLoading(true);
    try {
      const res = await fetch('/api/b2b/nuorder/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory: [{ sku: 'DEMO-SKU-01', qty: 50, pre_book_qty: 20, ats_qty: 30 }],
          overwrite: false,
        }),
      });
      const data = await res.json();
      if (data.success)
        setInventoryMsg({ type: 'success', text: `Обработано: ${data.processed ?? 0}` });
      else setInventoryMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setInventoryMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setInventoryLoading(false);
    }
  };

  const sendShipment = async () => {
    setShipmentMsg(null);
    setShipmentLoading(true);
    try {
      const res = await fetch('/api/b2b/nuorder/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderIdShipment || 'demo-order-id',
          tracking_number: '1Z999AA10123456784',
          carrier: 'UPS',
          status: 'shipped',
          shipped_at: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) setShipmentMsg({ type: 'success', text: 'Статус отгрузки отправлен' });
      else setShipmentMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setShipmentMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setShipmentLoading(false);
    }
  };

  const updateOrder = async () => {
    setEditMsg(null);
    setEditLoading(true);
    try {
      const res = await fetch('/api/b2b/nuorder/order-edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderIdEdit || 'demo-order-id',
          lines: [{ sku: 'DEMO-SKU-01', qty: 10 }],
          note: 'Amendment: quantity update',
        }),
      });
      const data = await res.json();
      if (data.success) setEditMsg({ type: 'success', text: 'Заказ обновлён' });
      else setEditMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setEditMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setEditLoading(false);
    }
  };

  const pushReplenishment = async () => {
    setReplenishmentMsg(null);
    setReplenishmentLoading(true);
    try {
      const res = await fetch('/api/b2b/nuorder/replenishment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ sku: 'DEMO-SKU-01', qty_suggested: 25, min_qty: 10 }],
        }),
      });
      const data = await res.json();
      if (data.success)
        setReplenishmentMsg({ type: 'success', text: `Обработано: ${data.processed ?? 0}` });
      else setReplenishmentMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setReplenishmentMsg({
        type: 'error',
        text: e instanceof Error ? e.message : 'Ошибка запроса',
      });
    } finally {
      setReplenishmentLoading(false);
    }
  };

  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="NuOrder"
        leadPlain="Остатки (pre-book, ATS), отгрузки, amendments, replenishment. OAuth 1.0."
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
              <Package className="h-4 w-4" /> Inventory — синхрон остатков
            </CardTitle>
            <CardDescription>
              Pre-book и ATS (available to ship). Выгрузка из ERP в NuOrder.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button onClick={pushInventory} disabled={inventoryLoading}>
              {inventoryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Синхронизировать остатки с NuOrder
            </Button>
            {inventoryMsg && (
              <span className={inventoryMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {inventoryMsg.type === 'success' ? (
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                ) : (
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                )}
                {inventoryMsg.text}
              </span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Truck className="h-4 w-4" /> Orders Shipments
            </CardTitle>
            <CardDescription>Отправка статусов отгрузок и трекинга в NuOrder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              placeholder="Order ID"
              value={orderIdShipment}
              onChange={(e) => setOrderIdShipment(e.target.value)}
              className="w-48 rounded border px-2 py-1.5 text-sm"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={sendShipment} disabled={shipmentLoading}>
                {shipmentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Отправить отгрузку
              </Button>
              {shipmentMsg && (
                <span
                  className={shipmentMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}
                >
                  {shipmentMsg.type === 'success' ? (
                    <CheckCircle2 className="mr-1 inline h-4 w-4" />
                  ) : (
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                  )}
                  {shipmentMsg.text}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <FileEdit className="h-4 w-4" /> Orders Edits (amendments)
            </CardTitle>
            <CardDescription>Обновление заказов: изменение строк, отмена позиций.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              placeholder="Order ID"
              value={orderIdEdit}
              onChange={(e) => setOrderIdEdit(e.target.value)}
              className="w-48 rounded border px-2 py-1.5 text-sm"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={updateOrder} disabled={editLoading}>
                {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Обновить заказ
              </Button>
              {editMsg && (
                <span className={editMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                  {editMsg.type === 'success' ? (
                    <CheckCircle2 className="mr-1 inline h-4 w-4" />
                  ) : (
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                  )}
                  {editMsg.text}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <RotateCcw className="h-4 w-4" /> Replenishment
            </CardTitle>
            <CardDescription>Рекомендуемые к дозаказу позиции (опционально).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button onClick={pushReplenishment} disabled={replenishmentLoading}>
              {replenishmentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Выгрузить replenishment
            </Button>
            {replenishmentMsg && (
              <span
                className={replenishmentMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}
              >
                {replenishmentMsg.type === 'success' ? (
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                ) : (
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                )}
                {replenishmentMsg.text}
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={ROUTES.brand.b2bOrders}>
          <Button variant="outline" size="sm">
            B2B заказы
          </Button>
        </Link>
        <Link href={ROUTES.brand.integrationsJoor}>
          <Button variant="ghost" size="sm">
            JOOR
          </Button>
        </Link>
        <Link href={ROUTES.brand.integrationsFashionCloud}>
          <Button variant="ghost" size="sm">
            Fashion Cloud
          </Button>
        </Link>
        <Link href={ROUTES.brand.integrationsSparkLayer}>
          <Button variant="ghost" size="sm">
            SparkLayer
          </Button>
        </Link>
        <Link href={ROUTES.brand.integrationsColect}>
          <Button variant="ghost" size="sm">
            Colect
          </Button>
        </Link>
        <Link href={ROUTES.brand.integrationsZedonk}>
          <Button variant="ghost" size="sm">
            Zedonk
          </Button>
        </Link>
      </div>
    </RegistryPageShell>
  );
}
