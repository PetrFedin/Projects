'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RegistryPageShell } from '@/components/design-system';
import {
  SUPPORTED_CURRENCIES,
  DEMO_RATES_TO_RUB,
  convertAmount,
  formatCurrency,
} from '@/lib/rf-market/multi-currency';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

/** B2B-Center: Мультивалютность — валюты и курсы (РФ) */
export default function MultiCurrencyPage() {
  const [amount, setAmount] = useState(10000);
  const [fromCur, setFromCur] = useState('RUB');
  const [toCur, setToCur] = useState('USD');

  const converted = convertAmount(amount, fromCur, toCur);

  return (
    <RegistryPageShell className="max-w-2xl space-y-6">
      <ShopB2bContentHeader lead="Несколько валют и курсов для заказов (B2B-Center style)." />
      <ShopAnalyticsSegmentErpStrip />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Курсы валют к рублю</CardTitle>
          <CardDescription>
            Демо: фиксированные курсы. В проде — интеграция с ЦБ РФ или внутренний справочник
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {SUPPORTED_CURRENCIES.filter((c) => c.code !== 'RUB').map((c) => (
              <li
                key={c.code}
                className="border-border-subtle flex items-center justify-between border-b py-2 last:border-0"
              >
                <span>
                  {c.name} ({c.code})
                </span>
                <span className="font-mono">{DEMO_RATES_TO_RUB[c.code] ?? '—'} ₽</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" /> Конвертер
          </CardTitle>
          <CardDescription>Пересчёт суммы между валютами</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-text-secondary mb-1 block text-xs">Сумма</label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-36"
              />
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-xs">Из</label>
              <select
                className="h-10 w-24 rounded-md border px-3"
                value={fromCur}
                onChange={(e) => setFromCur(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-xs">В</label>
              <select
                className="h-10 w-24 rounded-md border px-3"
                value={toCur}
                onChange={(e) => setToCur(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-lg font-semibold">
            {formatCurrency(amount, fromCur)} = {formatCurrency(converted, toCur)}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCatalog}>B2B каталог</Link>
        </Button>
      </div>

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-multi-currency-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-multi-currency-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>
    </RegistryPageShell>
  );
}
