'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import React from 'react';
import Link from 'next/link';
import LineSheetGenerator from '@/components/brand/linesheet/LineSheetGenerator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Package, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader } from '@/components/design-system';

export default function BrandLineSheetsPage() {
  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
      <RegistryPageHeader
        title="Linesheets"
        leadPlain="Оптовые каталоги для байеров. Версионность (Early Bird, VIP, Outlet). Связь с каталогом Products и B2B Showroom."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <FileText className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <Badge variant="outline" className="text-[9px]">
              Products
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              B2B
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.products}>
                <Package className="mr-1 h-3 w-3" /> Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.showroom}>
                <ShoppingBag className="mr-1 h-3 w-3" /> Showroom
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.b2bLinesheets}>Список лайншитов</Link>
            </Button>
          </div>
        }
      />
      <LineSheetGenerator />
    </CabinetPageContent>
  );
}
