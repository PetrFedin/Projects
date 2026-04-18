'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';
import {
  getConsolidatedDraft,
  getTotalsByBrand,
  runPreflightPerBrand,
  addLineToConsolidatedDraft,
  updateLineQty,
  removeLineFromConsolidatedDraft,
  clearConsolidatedDraft,
  type ConsolidatedDraft,
  type ConsolidatedOrderLine,
} from '@/lib/b2b/consolidated-order-draft';
import { getOrderRulesForBrand } from '@/lib/b2b/order-rules';
import products from '@/lib/products';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

const BRANDS = [
  { id: 'brand_syntha_lab', name: 'Syntha Lab' },
  { id: 'brand_nordic_wool', name: 'Nordic Wool' },
];

export default function AgentConsolidatedOrderPage() {
  const [draft, setDraft] = useState<ConsolidatedDraft | null>(null);
  const [addBrand, setAddBrand] = useState(BRANDS[0].id);
  const [addProductId, setAddProductId] = useState('');
  const [addQty, setAddQty] = useState(6);

  const load = useCallback(() => setDraft(getConsolidatedDraft()), []);
  useEffect(() => {
    load();
  }, [load]);

  const productsByBrand = BRANDS.map((b) => {
<<<<<<< HEAD
    const list = (products as any[]).filter((p: any) =>
      (p.brand ?? '').toLowerCase().includes(b.name.toLowerCase())
    );
=======
    const list = (products as any[]).filter((p: any) => (p.brand ?? '') === b.name);
>>>>>>> recover/cabinet-wip-from-stash
    return { brandId: b.id, brandName: b.name, products: list.slice(0, 8) };
  });
  const productsForAdd = productsByBrand.find((x) => x.brandId === addBrand)?.products ?? [];

  const totalsByBrand = draft ? getTotalsByBrand(draft.lines) : {};
  const preflightByBrand = draft ? runPreflightPerBrand(draft.lines, 'Moscow') : {};

  const handleAddLine = () => {
    const product = (products as any[]).find((p: any) => p.id === addProductId);
    if (!product) return;
    const brand = BRANDS.find((b) => b.id === addBrand)!;
    const price = typeof product.price === 'number' ? product.price * 0.4 : 0;
    addLineToConsolidatedDraft({
      brandId: brand.id,
      brandName: brand.name,
      productId: product.id,
      sku: (product as any).sku ?? product.id,
      name: product.name ?? 'Unnamed',
      qty: addQty,
      unitPrice: price,
    });
    load();
  };

  const linesByBrand = draft
    ? draft.lines.reduce(
        (acc, line) => {
          const key = line.brandId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(line);
          return acc;
        },
        {} as Record<string, ConsolidatedOrderLine[]>
      )
    : {};

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2bAgentCabinet}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Мультибрендовый заказ</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Корзина по нескольким брендам — для дистрибьюторов и агентов. Zedonk-style. MOV/MOQ по
            бренду.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader
        backHref={ROUTES.shop.b2bAgentCabinet}
        lead="Корзина по нескольким брендам для агентов и дистрибьюторов; MOV/MOQ по бренду (Zedonk-style)."
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Добавить позицию</CardTitle>
          <CardDescription>
            Выберите бренд, товар и количество. Правила MOV/MOQ применяются по бренду.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div>
<<<<<<< HEAD
            <label className="mb-1 block text-xs font-medium text-slate-500">Бренд</label>
=======
            <label className="text-text-secondary mb-1 block text-xs font-medium">Бренд</label>
>>>>>>> recover/cabinet-wip-from-stash
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={addBrand}
              onChange={(e) => {
                setAddBrand(e.target.value);
                setAddProductId('');
              }}
            >
              {BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
<<<<<<< HEAD
            <label className="mb-1 block text-xs font-medium text-slate-500">Товар</label>
=======
            <label className="text-text-secondary mb-1 block text-xs font-medium">Товар</label>
>>>>>>> recover/cabinet-wip-from-stash
            <select
              className="min-w-[200px] rounded-lg border px-3 py-2 text-sm"
              value={addProductId}
              onChange={(e) => setAddProductId(e.target.value)}
            >
              <option value="">—</option>
              {productsForAdd.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name ?? p.id} · {(p.price * 0.4).toFixed(0)} ₽
                </option>
              ))}
            </select>
          </div>
          <div>
<<<<<<< HEAD
            <label className="mb-1 block text-xs font-medium text-slate-500">Кол-во</label>
=======
            <label className="text-text-secondary mb-1 block text-xs font-medium">Кол-во</label>
>>>>>>> recover/cabinet-wip-from-stash
            <input
              type="number"
              min={1}
              className="w-20 rounded-lg border px-3 py-2 text-sm"
              value={addQty}
              onChange={(e) => setAddQty(Number(e.target.value) || 1)}
            />
          </div>
          <Button size="sm" onClick={handleAddLine} disabled={!addProductId}>
            <Plus className="mr-1 h-4 w-4" /> Добавить
          </Button>
        </CardContent>
      </Card>

      {draft && draft.lines.length > 0 ? (
        <>
          {Object.entries(linesByBrand).map(([brandId, lines]) => {
            const brandName = lines[0]?.brandName ?? brandId;
            const total = totalsByBrand[brandId];
            const preflight = preflightByBrand[brandId] ?? [];
            const rules = getOrderRulesForBrand(brandName);
            const movOk = rules && total ? total.amount >= rules.minOrderValue : false;
            return (
              <Card key={brandId} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{brandName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {(total?.amount ?? 0).toLocaleString('ru-RU')} ₽
                      </span>
                      <Badge variant={movOk ? 'default' : 'secondary'}>
                        MOV {rules ? (rules.minOrderValue / 1000).toFixed(0) + 'k' : '—'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <table className="w-full text-sm">
                    <thead>
<<<<<<< HEAD
                      <tr className="border-b text-left text-slate-500">
=======
                      <tr className="text-text-secondary border-b text-left">
>>>>>>> recover/cabinet-wip-from-stash
                        <th className="pb-1">SKU</th>
                        <th className="pb-1">Товар</th>
                        <th className="pb-1 text-right">Кол-во</th>
                        <th className="pb-1 text-right">Цена</th>
                        <th className="pb-1 text-right">Сумма</th>
                        <th className="w-8 pb-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.id} className="border-border-subtle border-b">
                          <td className="py-1.5 font-mono text-xs">{line.sku}</td>
                          <td className="max-w-[180px] truncate py-1.5">{line.name}</td>
                          <td className="py-1.5 text-right">{line.qty}</td>
                          <td className="py-1.5 text-right">
                            {line.unitPrice.toLocaleString('ru-RU')} ₽
                          </td>
                          <td className="py-1.5 text-right font-medium">
                            {line.lineTotal.toLocaleString('ru-RU')} ₽
                          </td>
                          <td className="py-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                removeLineFromConsolidatedDraft(line.id);
                                load();
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="space-y-1 pt-2">
                    {preflight.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        {item.status === 'ok' ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span
                          className={
                            item.status === 'error'
                              ? 'text-rose-600'
                              : item.status === 'warning'
                                ? 'text-amber-600'
<<<<<<< HEAD
                                : 'text-slate-600'
=======
                                : 'text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                          }
                        >
                          {item.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearConsolidatedDraft();
                load();
              }}
            >
              Очистить драфт
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.shop.b2bAgentCabinet}>В кабинет агента</Link>
            </Button>
          </div>
        </>
      ) : (
        <Card>
<<<<<<< HEAD
          <CardContent className="py-8 text-center text-sm text-slate-500">
=======
          <CardContent className="text-text-secondary py-8 text-center text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Драфт пуст. Добавьте позиции выше — по разным брендам. MOV и MOQ проверяются отдельно по
            каждому бренду.
          </CardContent>
        </Card>
      )}
    </RegistryPageShell>
  );
}
