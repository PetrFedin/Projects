'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { calculateLcaScore } from '@/lib/fashion/lca-logic';
import { ArrowLeft, Leaf, Droplets, Wind } from 'lucide-react';

export default function LcaReportPage() {
  const rows = useMemo(() => {
    return products
      .map((p) => ({
        product: p,
        lca: calculateLcaScore(p),
      }))
      .sort((a, b) => b.lca.totalScore - a.lca.totalScore);
  }, []);

  const averages = useMemo(() => {
    const sum = rows.reduce(
      (acc, r) => ({
        score: acc.score + r.lca.totalScore,
        water: acc.water + r.lca.waterLiters,
        co2: acc.co2 + r.lca.co2Kg,
      }),
      { score: 0, water: 0, co2: 0 }
    );

    return {
      score: Math.round(sum.score / rows.length),
      water: Math.round(sum.water / rows.length),
      co2: Math.round((sum.co2 / rows.length) * 10) / 10,
    };
  }, [rows]);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Leaf className="h-6 w-6 text-emerald-600" />
            Environmental Footprint (LCA)
          </h1>
          <p className="text-sm text-muted-foreground">
            Отчет по воздействию коллекции на окружающую среду на основе материалов.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Avg Sustainability Score</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              {averages.score}/100
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Avg Water Intensity</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700">
              {averages.water} L <span className="text-xs font-normal">/ SKU</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border-default bg-bg-surface2/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Avg CO₂ Emission</CardDescription>
            <CardTitle className="text-text-primary text-2xl font-bold">
              {averages.co2} kg <span className="text-xs font-normal">/ SKU</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catalog LCA Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / Товар</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Вода (л)</TableHead>
                <TableHead className="text-right">CO₂ (кг)</TableHead>
                <TableHead>Основные материалы</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.product.sku}>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate text-xs font-medium">{r.product.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{r.product.sku}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        r.lca.grade === 'A'
                          ? 'border-none bg-emerald-500 text-white'
                          : r.lca.grade === 'B'
                            ? 'border-none bg-lime-500 text-white'
                            : r.lca.grade === 'C'
                              ? 'border-none bg-yellow-500 text-white'
                              : r.lca.grade === 'D'
                                ? 'border-none bg-orange-500 text-white'
                                : 'border-none bg-rose-500 text-white'
                      }
                    >
                      {r.lca.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold">{r.lca.totalScore}</TableCell>
                  <TableCell className="text-right text-xs">{r.lca.waterLiters}</TableCell>
                  <TableCell className="text-right text-xs">{r.lca.co2Kg}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">
                    {r.lca.breakdown.map((b) => b.label).join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
