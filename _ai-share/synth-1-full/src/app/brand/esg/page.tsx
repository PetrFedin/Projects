'use client';

import React from 'react';
import ESGDashboard from '@/components/brand/esg/ESGDashboard';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Factory, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';

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
        <ESGDashboard />
      </div>

      <RelatedModulesBlock links={ESG_LINKS} className="mt-6" />
    </div>
  );
}
