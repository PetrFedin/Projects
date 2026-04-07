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
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-700">
            {/* Control Panel: Executive Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Статус: Лидер отрасли (A+)
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                    <Button variant="outline" asChild className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase gap-1.5 border-slate-200">
                        <Link href="/brand/production"><Factory className="h-3.5 w-3.5" /> Production & BOM</Link>
                    </Button>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ml-auto md:ml-0">
                        <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all">
                            Сертификация SKU
                        </Button>
                        <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all gap-1.5">
                            <FileText className="h-3.5 w-3.5" /> Годовой отчёт (GRI/CDP)
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-white">
                <ESGDashboard />
            </div>

            <RelatedModulesBlock links={ESG_LINKS} className="mt-6" />
        </div>
    );
}
