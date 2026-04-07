'use client';

import Link from 'next/link';
import { VariantMatrixEditor } from "@/components/brand/VariantMatrixEditor";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

export default function VariantMatrixPage() {
    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24">
            <SectionInfoCard
                title="Variant Matrix"
                description="Размерные сетки, цвета и вариации SKU. Связи: Products (PIM), Production (Assortment), Inventory, Linesheets."
                icon={Layers}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                badges={<><Badge variant="outline" className="text-[9px]">SKU Variants</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products">Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/inventory">Inventory</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/b2b/linesheets">Linesheets</Link></Button></>}
            />
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        <Layers className="h-3.5 w-3.5 text-indigo-500" />
                        Fashion OS — Product Intelligence
                    </div>
                    <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight uppercase">Variant Matrix</h1>
                    <p className="text-[11px] text-slate-500 font-medium">Управление размерными сетками, цветами и SKU в едином интерфейсе.</p>
                </div>
            </header>
            <div className="bg-transparent">
                <VariantMatrixEditor />
            </div>
        </div>
    );
}
