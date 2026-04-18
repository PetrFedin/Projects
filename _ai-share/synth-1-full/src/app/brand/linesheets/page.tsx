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
    <div className="container mx-auto space-y-4 px-4 py-4 pb-24">
      <SectionInfoCard
        title="Linesheets"
        description="Оптовые каталоги для байеров. Версионность (Early Bird, VIP, Outlet). Связь с Products и B2B Showroom."
        icon={FileText}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Products
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              B2B
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/products">
                <Package className="mr-1 h-3 w-3" /> Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/showroom">
                <ShoppingBag className="mr-1 h-3 w-3" /> Showroom
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/b2b/linesheets">Список лайншитов</Link>
            </Button>
          </>
        }
      />
      <LineSheetGenerator />
    </div>
  );
}
