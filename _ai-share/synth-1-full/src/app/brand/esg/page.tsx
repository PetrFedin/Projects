'use client';

import React from 'react';
import ESGDashboard from '@/components/brand/esg/ESGDashboard';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Factory, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

const ESG_LINKS = [
  { label: 'Production & BOM', href: ROUTES.brand.production },
  { label: 'ЭДО и Compliance', href: ROUTES.brand.compliance },
  { label: 'Поставщики', href: ROUTES.brand.suppliers },
  { label: 'Фабрики', href: ROUTES.brand.factories },
  { label: 'Materials', href: ROUTES.brand.materials },
  { label: 'Gold Sample', href: ROUTES.brand.productionGoldSample },
  { label: 'Академия', href: ROUTES.brand.academy },
  { label: 'Документы', href: ROUTES.brand.documents },
  { label: 'Команда', href: ROUTES.brand.team },
];

export default function BrandESGPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      {/* Control Panel: Executive Style */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Статус: Лидер
            отрасли (A+)
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <Button
            variant="outline"
            asChild
            className="h-8 gap-1.5 rounded-lg border-slate-200 px-3 text-[10px] font-bold uppercase"
          >
            <Link href="/brand/production">
              <Factory className="h-3.5 w-3.5" /> Production & BOM
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner md:ml-0">
            <Button
              variant="ghost"
              className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
            >
              Сертификация SKU
            </Button>
            <Button
              variant="ghost"
              className="h-8 gap-1.5 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Годовой отчёт (GRI/CDP)
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-20">
      <RegistryPageHeader
        title="ESG-мониторинг"
        leadPlain="Сертификаты, углеродный след и отчётность: статус A+ (демо)."
        actions={
          <>
            <Badge
              variant="outline"
              className="hidden shrink-0 border-emerald-200 bg-emerald-50 text-[9px] font-bold uppercase text-emerald-700 sm:inline-flex"
            >
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" /> A+
            </Badge>
            <Button
              variant="outline"
              asChild
              size="sm"
              className="h-8 text-[10px] font-bold uppercase"
            >
              <Link href={ROUTES.brand.production}>
                <Factory className="mr-1 h-3.5 w-3.5" /> Production
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="sm"
              className="h-8 text-[10px] font-bold uppercase"
            >
              <Link href={ROUTES.brand.compliance}>Compliance</Link>
            </Button>
          </>
        }
      />

      <div
        className={cn(
          cabinetSurface.groupTabList,
          'flex h-auto min-h-9 flex-wrap items-center gap-1'
        )}
      >
        <Button
          variant="ghost"
          className="text-text-secondary hover:text-accent-primary h-8 rounded-lg px-3 text-[10px] font-bold uppercase"
        >
          Сертификация SKU
        </Button>
        <Button
          variant="ghost"
          className="text-text-secondary hover:text-accent-primary h-8 gap-1.5 rounded-lg px-3 text-[10px] font-bold uppercase"
        >
          <FileText className="h-3.5 w-3.5" /> GRI/CDP
        </Button>
      </div>

      <div className="border-border-subtle overflow-hidden rounded-2xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <ESGDashboard />
      </div>

      <RelatedModulesBlock links={ESG_LINKS} className="mt-6" />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
