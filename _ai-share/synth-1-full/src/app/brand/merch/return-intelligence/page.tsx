'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { getFitSentiment } from '@/lib/fashion/return-intelligence';
import { ArrowLeft, MessageSquare, ThumbsDown, TrendingDown, AlertCircle } from 'lucide-react';

export default function ReturnIntelligencePage() {
  const rows = useMemo(() => {
    return products.slice(0, 30).map(p => ({
      product: p,
      sentiment: getFitSentiment(p)
    })).sort((a, b) => b.sentiment.returnRate - a.sentiment.returnRate);
  }, []);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <TrendingDown className="h-6 w-6" />
            Return Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">Анализ причин возвратов и фидбека по посадке для отдела качества и дизайна.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-rose-200 bg-rose-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">High Return Alert ({'>'}15%)</CardDescription>
            <CardTitle className="text-xl font-bold text-rose-700">
              {rows.filter(r => r.sentiment.returnRate > 15).length} <span className="text-sm font-normal text-muted-foreground">моделей</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-amber-200 bg-amber-50/20">
          <CardHeader className="py-3">
            <CardDescription className="text-xs">Size Mismatch Risk</CardDescription>
            <CardTitle className="text-xl font-bold text-amber-700">
              {rows.filter(r => r.sentiment.overall !== 'true').length} <span className="text-sm font-normal text-muted-foreground">моделей</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Return Reason Matrix (NLP aggregated)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / Товар</TableHead>
                <TableHead className="text-right">Return Rate</TableHead>
                <TableHead className="text-center">Fit Sentiment</TableHead>
                <TableHead>Primary Issues</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.product.sku}>
                  <TableCell className="max-w-[200px]">
                    <p className="font-medium text-xs truncate">{r.product.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{r.product.sku}</p>
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs">
                    <span className={r.sentiment.returnRate > 15 ? 'text-rose-600' : ''}>
                      {r.sentiment.returnRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`text-[9px] ${
                      r.sentiment.overall === 'small' ? 'text-amber-600 border-amber-200' :
                      r.sentiment.overall === 'large' ? 'text-blue-600 border-blue-200' :
                      'text-emerald-600 border-emerald-200'
                    }`}>
                      {r.sentiment.overall}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r.sentiment.topComplaints.map(c => (
                        <span key={c} className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.sentiment.returnRate > 15 && (
                      <Button size="sm" variant="outline" className="h-7 text-[10px] text-rose-600 hover:bg-rose-50">
                        Fix Tech Pack
                      </Button>
                    )}
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
