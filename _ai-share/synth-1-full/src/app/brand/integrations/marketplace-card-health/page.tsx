'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PartnerDemoExportBar } from '@/components/brand/partner-demo-export-bar';
import { ROUTES } from '@/lib/routes';
import { PARTNER_MARKETPLACE_ISSUES } from '@/lib/platform/partner-demo-data';
import { ArrowLeft, Store, Boxes } from 'lucide-react';

export default function MarketplaceCardHealthPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.integrations}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6" />
              Здоровье карточек на МП
            </h1>
            <p className="text-sm text-muted-foreground">
              Ошибки атрибутов по регионам. Тип: <code className="text-[10px] bg-muted px-1 rounded">PartnerMarketplaceIssue</code>.
            </p>
          </div>
        </div>
        <PartnerDemoExportBar />
      </div>

      <Button variant="secondary" size="sm" asChild>
        <Link href={ROUTES.brand.products}>
          <Boxes className="h-3.5 w-3.5 mr-2" />
          PIM / товары
        </Link>
      </Button>

      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-base">Очередь исправлений</CardTitle>
          <CardDescription>Сверка с PIM и DAM; в проде — очередь задач и SLA.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>МП</TableHead>
                <TableHead>Регион</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Серьёзность</TableHead>
                <TableHead>Проблема</TableHead>
                <TableHead>Подсказка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PARTNER_MARKETPLACE_ISSUES.map((x) => (
                <TableRow key={`${x.marketplace}-${x.sku}-${x.region}`}>
                  <TableCell className="font-medium text-sm">{x.marketplace}</TableCell>
                  <TableCell className="text-xs">{x.region}</TableCell>
                  <TableCell className="font-mono text-xs">{x.sku}</TableCell>
                  <TableCell>
                    <Badge variant={x.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {x.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px]">{x.problem}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[220px]">{x.fixHint ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-3 md:hidden">
        {PARTNER_MARKETPLACE_ISSUES.map((x) => (
          <Card key={`${x.sku}-${x.region}`}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap justify-between gap-2">
                <CardTitle className="text-sm">
                  {x.marketplace} · {x.region}
                </CardTitle>
                <Badge variant={x.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                  {x.severity}
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs">{x.sku}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{x.problem}</p>
              {x.fixHint && <p className="text-xs text-muted-foreground">{x.fixHint}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
