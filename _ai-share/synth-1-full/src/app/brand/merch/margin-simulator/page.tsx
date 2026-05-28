'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { simulateMargin } from '@/lib/fashion/margin-simulator';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function MarginSimulatorPage() {
  const [selectedSku, setSelectedSku] = useState(products[0].sku);
  const [retailPrice, setRetailPrice] = useState(String(products[0].price));
  const [productionCost, setProductionCost] = useState(
    String(Math.round(products[0].price * 0.25))
  );

  const product = useMemo(
    () => products.find((p) => p.sku === selectedSku) || products[0],
    [selectedSku]
  );

  const simulation = useMemo(
    () =>
      simulateMargin(product, {
        retailPrice: parseFloat(retailPrice) || 0,
        productionCost: parseFloat(productionCost) || 0,
      }),
    [product, retailPrice, productionCost]
  );

  return (
    <CabinetPageContent maxWidth="6xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Calculator className="h-6 w-6" />
            Margin & Profit Simulator
          </h1>
          <p className="text-sm text-muted-foreground">
            Инструмент для байеров и мерчантов: моделирование цен и прибыли.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Параметры SKU</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Выберите товар</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={selectedSku}
                  onChange={(e) => {
                    const p = products.find((x) => x.sku === e.target.value)!;
                    setSelectedSku(p.sku);
                    setRetailPrice(String(p.price));
                    setProductionCost(String(Math.round(p.price * 0.25)));
                  }}
                >
                  {products.slice(0, 20).map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retail">Retail Price (₽)</Label>
                <Input
                  id="retail"
                  inputMode="decimal"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Production Cost (₽)</Label>
                <Input
                  id="cost"
                  inputMode="decimal"
                  value={productionCost}
                  onChange={(e) => setProductionCost(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="py-3">
                <CardDescription className="text-[10px] font-bold uppercase">
                  Net Profit
                </CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {simulation.netProfit.toLocaleString()} ₽
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardHeader className="py-3">
                <CardDescription className="text-[10px] font-bold uppercase">
                  Net Margin
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-emerald-700">
                  {simulation.netMarginPct}%
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="py-3">
                <CardDescription className="text-[10px] font-bold uppercase">
                  Markup (x)
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-blue-700">
                  {simulation.markup}x
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unit Economics Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Retail Price (inc. VAT)</TableCell>
                    <TableCell className="text-right font-mono">
                      {simulation.retailPrice.toLocaleString()} ₽
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8 text-muted-foreground">VAT (20%)</TableCell>
                    <TableCell className="text-right font-mono text-rose-600">
                      -{Math.round(simulation.retailPrice * 0.166).toLocaleString()} ₽
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Production Cost</TableCell>
                    <TableCell className="text-right font-mono text-rose-600">
                      -{simulation.productionCost.toLocaleString()} ₽
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Logistics & Warehousing</TableCell>
                    <TableCell className="text-right font-mono text-rose-600">
                      -{simulation.logisticsCost.toLocaleString()} ₽
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketing & Sales</TableCell>
                    <TableCell className="text-right font-mono text-rose-600">
                      -{simulation.marketingCost.toLocaleString()} ₽
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Net Operating Profit</TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">
                      {simulation.netProfit.toLocaleString()} ₽
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </CabinetPageContent>
  );
}
