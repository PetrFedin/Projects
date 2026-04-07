'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
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
import { ArrowLeft, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const BRANDS = [
  { id: 'syntha', name: 'Syntha' },
  { id: 'apc', name: 'A.P.C.' },
  { id: 'acne', name: 'Acne Studios' },
];

export default function AgentConsolidatedOrderPage() {
  const [draft, setDraft] = useState<ConsolidatedDraft | null>(null);
  const [addBrand, setAddBrand] = useState(BRANDS[0].id);
  const [addProductId, setAddProductId] = useState('');
  const [addQty, setAddQty] = useState(6);

  const load = useCallback(() => setDraft(getConsolidatedDraft()), []);
  useEffect(() => { load(); }, [load]);

  const productsByBrand = BRANDS.map((b) => {
    const list = (products as any[]).filter((p: any) => (p.brand ?? '').toLowerCase().includes(b.name.toLowerCase()));
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
    ? draft.lines.reduce((acc, line) => {
        const key = line.brandId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(line);
        return acc;
      }, {} as Record<string, ConsolidatedOrderLine[]>)
    : {};

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bAgentCabinet}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Мультибрендовый заказ</h1>
          <p className="text-slate-500 text-sm mt-0.5">Корзина по нескольким брендам — для дистрибьюторов и агентов. Zedonk-style. MOV/MOQ по бренду.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Добавить позицию</CardTitle>
          <CardDescription>Выберите бренд, товар и количество. Правила MOV/MOQ применяются по бренду.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Бренд</label>
            <select className="rounded-lg border px-3 py-2 text-sm" value={addBrand} onChange={(e) => { setAddBrand(e.target.value); setAddProductId(''); }}>
              {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Товар</label>
            <select className="rounded-lg border px-3 py-2 text-sm min-w-[200px]" value={addProductId} onChange={(e) => setAddProductId(e.target.value)}>
              <option value="">—</option>
              {productsForAdd.map((p: any) => <option key={p.id} value={p.id}>{p.name ?? p.id} · {(p.price * 0.4).toFixed(0)} ₽</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Кол-во</label>
            <input type="number" min={1} className="rounded-lg border px-3 py-2 text-sm w-20" value={addQty} onChange={(e) => setAddQty(Number(e.target.value) || 1)} />
          </div>
          <Button size="sm" onClick={handleAddLine} disabled={!addProductId}><Plus className="h-4 w-4 mr-1" /> Добавить</Button>
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
                      <span className="text-sm font-semibold">{(total?.amount ?? 0).toLocaleString('ru-RU')} ₽</span>
                      <Badge variant={movOk ? 'default' : 'secondary'}>MOV {rules ? (rules.minOrderValue / 1000).toFixed(0) + 'k' : '—'}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="pb-1">SKU</th>
                        <th className="pb-1">Товар</th>
                        <th className="pb-1 text-right">Кол-во</th>
                        <th className="pb-1 text-right">Цена</th>
                        <th className="pb-1 text-right">Сумма</th>
                        <th className="pb-1 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.id} className="border-b border-slate-100">
                          <td className="py-1.5 font-mono text-xs">{line.sku}</td>
                          <td className="py-1.5 truncate max-w-[180px]">{line.name}</td>
                          <td className="py-1.5 text-right">{line.qty}</td>
                          <td className="py-1.5 text-right">{line.unitPrice.toLocaleString('ru-RU')} ₽</td>
                          <td className="py-1.5 text-right font-medium">{line.lineTotal.toLocaleString('ru-RU')} ₽</td>
                          <td className="py-1.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { removeLineFromConsolidatedDraft(line.id); load(); }}>
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pt-2 space-y-1">
                    {preflight.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        {item.status === 'ok' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        <span className={item.status === 'error' ? 'text-rose-600' : item.status === 'warning' ? 'text-amber-600' : 'text-slate-600'}>{item.message}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => { clearConsolidatedDraft(); load(); }}>Очистить драфт</Button>
            <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bAgentCabinet}>В кабинет агента</Link></Button>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-slate-500 text-sm">
            Драфт пуст. Добавьте позиции выше — по разным брендам. MOV и MOQ проверяются отдельно по каждому бренду.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
