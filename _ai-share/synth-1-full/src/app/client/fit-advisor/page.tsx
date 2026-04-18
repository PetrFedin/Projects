'use client';

import { useMemo, Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { loadForYouPreferences } from '@/lib/platform/for-you';
import { buildFitAdvice } from '@/lib/fashion/fit-advisor';
import { ArrowLeft, Ruler, ArrowDown, ArrowUp, MinusCircle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function IconFor({ skew }: { skew: ReturnType<typeof buildFitAdvice>['skew'] }) {
  if (skew === 'size_down') return <ArrowDown className="h-8 w-8 text-amber-600" />;
  if (skew === 'size_up') return <ArrowUp className="h-8 w-8 text-sky-600" />;
  if (skew === 'true_to_size') return <MinusCircle className="h-8 w-8 text-emerald-600" />;
  return <HelpCircle className="h-8 w-8 text-muted-foreground" />;
}

function FitAdvisorInner() {
  const search = useSearchParams();
  const initialSku = search.get('sku') || products[0]?.sku || '';
  const [sku, setSku] = useState(initialSku);

  const prefs = useMemo(() => loadForYouPreferences(), []);
  const advice = useMemo(
    () => buildFitAdvice(sku.trim() || products[0]?.sku || '', prefs),
    [sku, prefs]
  );
  const product = products.find((p) => p.sku === sku.trim());

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">SKU</CardTitle>
          <CardDescription>
            Голоса посадки с PDP (localStorage) + ваш размер из «Для вас».
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">Артикул / SKU</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Базовый размер в профиле: <strong className="text-foreground">{prefs.sizeHint}</strong>.
            Изменить в{' '}
            <Link href={ROUTES.client.forYou} className="underline">
              Для вас
            </Link>
            .
          </p>
          {product && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products/${product.slug}`}>Открыть карточку</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <IconFor skew={advice.skew} />
          <div>
            <CardTitle className="text-base">{advice.headline}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed">
              {advice.detail}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline">{advice.skew}</Badge>
          <Badge variant="secondary">источник: браузер</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientFitAdvisorPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <Ruler className="h-6 w-6" />
              Посадка и размер
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Детерминированный совет до подключения size-ML и истории заказов.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Загрузка…</p>}>
        <FitAdvisorInner />
      </Suspense>
    </div>
  );
}
