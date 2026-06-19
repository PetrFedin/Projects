'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import React from 'react';
import Link from 'next/link';
import LineSheetGenerator from '@/components/brand/linesheet/LineSheetGenerator';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader } from '@/components/design-system';
export function BrandLineSheetsLegacyPage() {
  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
      <RegistryPageHeader
        title="Linesheets"
        leadPlain="Оптовые каталоги для байеров. Версионность (Early Bird, VIP, Outlet). Связь с каталогом Products и B2B Showroom."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.showroom}>
                <ShoppingBag className="mr-1 h-3 w-3" /> Showroom
              </Link>
            </Button>
          </div>
        }
      />
      <LineSheetGenerator />
    </CabinetPageContent>
  );
}
