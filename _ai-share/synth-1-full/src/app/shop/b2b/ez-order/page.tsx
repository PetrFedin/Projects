'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Zap, ShoppingBag, Link2, Copy, Check } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import allProducts from '@/lib/products';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { generateEzOrderToken } from '@/lib/b2b/ez-order-link';

/** NuOrder: EZ Order / One-Click Linesheet — лайншит = форма заказа без перехода в матрицу. */
const LINESHEET_PRODUCTS = allProducts.slice(0, 8);

export default function EzOrderPage() {
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [ezLink, setEzLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateLink = () => {
    const { url } = generateEzOrderToken({
      brandId: 'brand-syntha',
      linesheetId: 'fw26-core',
      collectionId: 'all',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    setEzLink(url);
    navigator.clipboard.writeText(url).then(() => setCopied(true));
    setTimeout(() => setCopied(false), 2000);
  };
  const totalUnits = Object.values(qtys).reduce((a, b) => a + b, 0);
  const totalAmount = LINESHEET_PRODUCTS.reduce((sum, p) => sum + (qtys[p.id] || 0) * p.price, 0);

  const handleSubmit = () => {
    const items = LINESHEET_PRODUCTS.filter(p => (qtys[p.id] || 0) > 0).map(p => ({
      productId: p.id,
      size: p.sizes?.[0]?.name || 'M',
      quantity: qtys[p.id] || 0,
      price: p.price,
    }));
    if (items.length === 0) return;
    window.alert(`EZ Order: отправлено ${items.length} позиций, ${totalUnits} ед. на ${totalAmount.toLocaleString('ru-RU')} ₽. В проде — API.`);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bOrderMode}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Zap className="h-6 w-6" /> EZ Order</h1>
          <p className="text-slate-500 text-sm mt-0.5">NuOrder: открыл лайншит → выбрал qty → отправил. Без перехода в матрицу.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Лайншит FW26 — Core Collection</CardTitle>
          <CardDescription>Выберите количество по стилям и отправьте заказ одной кнопкой.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {LINESHEET_PRODUCTS.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  {p.images?.[0]?.url && (
                    <img src={p.images[0].url} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sku} · {p.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Input
                    type="number"
                    min={0}
                    className="w-20 text-center"
                    value={qtys[p.id] ?? ''}
                    onChange={e => setQtys(prev => ({ ...prev, [p.id]: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                  />
                  <span className="text-xs text-slate-400">ед.</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="text-sm font-medium">Итого: {totalUnits} ед.</span>
            <span className="font-semibold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
          </div>
          <Button className="w-full mt-4" onClick={handleSubmit} disabled={totalUnits === 0}>
            <ShoppingBag className="h-4 w-4 mr-2" /> Отправить заказ (EZ Order)
          </Button>
        </CardContent>
      </Card>

      {ezLink && (
        <Card className="mb-6 border-indigo-200 bg-indigo-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Link2 className="h-4 w-4" /> Заказ по ссылке (NuOrder)</CardTitle>
            <CardDescription>Отправьте ссылку байеру — он оформит заказ без входа в платформу</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={ezLink} readOnly className="font-mono text-xs" />
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(ezLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleCreateLink}><Link2 className="h-3 w-3 mr-1" /> Создать ссылку для заказа</Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bMatrix}>Матрица заказа</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Матрица, Working Order, аналитика" className="mt-6" />
    </div>
  );
}
