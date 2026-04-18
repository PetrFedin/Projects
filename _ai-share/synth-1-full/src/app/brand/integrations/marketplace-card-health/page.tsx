'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PartnerDemoExportBar } from '@/components/brand/partner-demo-export-bar';
import { ROUTES } from '@/lib/routes';
import { PARTNER_MARKETPLACE_ISSUES } from '@/lib/platform/partner-demo-data';
import { ArrowLeft, Store, Boxes } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

export default function MarketplaceCardHealthPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Здоровье карточек на МП"
        leadPlain="Ошибки атрибутов по регионам. Тип: PartnerMarketplaceIssue."
        eyebrow={
>>>>>>> recover/cabinet-wip-from-stash
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.integrations} aria-label="Назад к интеграциям">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
<<<<<<< HEAD
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <Store className="h-6 w-6" />
              Здоровье карточек на МП
            </h1>
            <p className="text-sm text-muted-foreground">
              Ошибки атрибутов по регионам. Тип:{' '}
              <code className="rounded bg-muted px-1 text-[10px]">PartnerMarketplaceIssue</code>.
            </p>
=======
        }
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Store className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <PartnerDemoExportBar />
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        }
      />

      <Button variant="secondary" size="sm" asChild>
        <Link href={ROUTES.brand.products}>
          <Boxes className="mr-2 h-3.5 w-3.5" />
<<<<<<< HEAD
          PIM / товары
=======
          <AcronymWithTooltip abbr="PIM" /> / товары
>>>>>>> recover/cabinet-wip-from-stash
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
                <TableHead>
                  <AcronymWithTooltip abbr="SKU" />
                </TableHead>
                <TableHead>Серьёзность</TableHead>
                <TableHead>Проблема</TableHead>
                <TableHead>Подсказка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PARTNER_MARKETPLACE_ISSUES.map((x) => (
                <TableRow key={`${x.marketplace}-${x.sku}-${x.region}`}>
                  <TableCell className="text-sm font-medium">{x.marketplace}</TableCell>
                  <TableCell className="text-xs">{x.region}</TableCell>
                  <TableCell className="font-mono text-xs">{x.sku}</TableCell>
                  <TableCell>
                    <Badge
                      variant={x.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-[10px]"
                    >
                      {x.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] text-sm">{x.problem}</TableCell>
                  <TableCell className="max-w-[220px] text-xs text-muted-foreground">
                    {x.fixHint ?? '—'}
                  </TableCell>
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
                <Badge
                  variant={x.severity === 'high' ? 'destructive' : 'secondary'}
                  className="text-[10px]"
                >
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
    </RegistryPageShell>
  );
}
