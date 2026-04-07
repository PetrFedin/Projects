'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, ShoppingBag, AlertCircle, ArrowRight } from 'lucide-react';
import { parseEzOrderToken } from '@/lib/b2b/ez-order-link';
import allProducts from '@/lib/products';

/** NuOrder: EZ Order по ссылке — заказ без входа. Публичная страница. */
export default function EzOrderByLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [email, setEmail] = useState('');
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const payload = parseEzOrderToken(token);
  const products = allProducts.slice(0, 8);
  const totalUnits = Object.values(qtys).reduce((a, b) => a + b, 0);
  const totalAmount = products.reduce((sum, p) => sum + (qtys[p.id] || 0) * p.price, 0);

  if (!payload) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Ссылка недействительна</CardTitle>
            </div>
            <CardDescription>
              Ссылка истекла или некорректна. Запросите новую у бренда.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/">На главную</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    const items = products.filter(p => (qtys[p.id] || 0) > 0).map(p => ({
      productId: p.id,
      size: p.sizes?.[0]?.name || 'M',
      quantity: qtys[p.id] || 0,
      price: p.price,
    }));
    if (items.length === 0) return;
    if (!email.trim()) {
      alert('Укажите email для подтверждения заказа');
      return;
    }
    setSubmitted(true);
    // В проде — API: POST /api/b2b/ez-order/submit { token, email, items }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">EZ Order по ссылке</h1>
            <p className="text-slate-500 text-sm">NuOrder: заказ без входа в платформу</p>
          </div>
        </div>

        {submitted ? (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <CardTitle className="text-emerald-800">Заказ отправлен</CardTitle>
              <CardDescription>
                На {email} придёт подтверждение. Бренд обработает заказ в течение 24 ч.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild><Link href="/">На главную</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Лайншит FW26 — Core Collection</CardTitle>
              <CardDescription>Выберите количество и укажите email для подтверждения</CardDescription>
              <Badge variant="secondary" className="w-fit mt-2">Без регистрации</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email для подтверждения</label>
                <Input
                  type="email"
                  placeholder="buyer@store.ru"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.images?.[0]?.url && (
                        <img src={p.images[0].url} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.sku} · {p.price.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      className="w-20 text-center"
                      value={qtys[p.id] ?? ''}
                      onChange={e => setQtys(prev => ({ ...prev, [p.id]: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm font-medium">Итого: {totalUnits} ед.</span>
                <span className="font-semibold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={totalUnits === 0}>
                <ShoppingBag className="h-4 w-4 mr-2" /> Отправить заказ
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
