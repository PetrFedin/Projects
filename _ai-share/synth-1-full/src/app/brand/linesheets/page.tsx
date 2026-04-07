'use client';

import React from 'react';
import Link from 'next/link';
import LineSheetGenerator from '@/components/brand/linesheet/LineSheetGenerator';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Package, ShoppingBag } from 'lucide-react';

export default function BrandLineSheetsPage() {
    return (
        <div className="container mx-auto px-4 py-4 space-y-4 pb-24">
            <SectionInfoCard
                title="Linesheets"
                description="Оптовые каталоги для байеров. Версионность (Early Bird, VIP, Outlet). Связь с Products и B2B Showroom."
                icon={FileText}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                badges={<><Badge variant="outline" className="text-[9px]">Products</Badge><Badge variant="outline" className="text-[9px]">B2B</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products"><Package className="h-3 w-3 mr-1" /> Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/showroom"><ShoppingBag className="h-3 w-3 mr-1" /> Showroom</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/b2b/linesheets">Список лайншитов</Link></Button></>}
            />
            <LineSheetGenerator />
        </div>
    );
}
