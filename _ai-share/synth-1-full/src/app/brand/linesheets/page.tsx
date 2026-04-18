'use client';

import React from 'react';
import Link from 'next/link';
import LineSheetGenerator from '@/components/brand/linesheet/LineSheetGenerator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Package, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function BrandLineSheetsPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-4 px-4 py-4 pb-24">
      <SectionInfoCard
        title="Linesheets"
        description="Оптовые каталоги для байеров. Версионность (Early Bird, VIP, Outlet). Связь с Products и B2B Showroom."
        icon={FileText}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Linesheets"
        leadPlain="Оптовые каталоги для байеров. Версионность (Early Bird, VIP, Outlet). Связь с каталогом Products и B2B Showroom."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <FileText className="size-6 shrink-0 text-muted-foreground" aria-hidden />
>>>>>>> recover/cabinet-wip-from-stash
            <Badge variant="outline" className="text-[9px]">
              Products
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              B2B
            </Badge>
<<<<<<< HEAD
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/products">
=======
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.products}>
>>>>>>> recover/cabinet-wip-from-stash
                <Package className="mr-1 h-3 w-3" /> Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/showroom">
=======
              <Link href={ROUTES.brand.showroom}>
>>>>>>> recover/cabinet-wip-from-stash
                <ShoppingBag className="mr-1 h-3 w-3" /> Showroom
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/b2b/linesheets">Список лайншитов</Link>
            </Button>
          </>
        }
      />
      <LineSheetGenerator />
    </div>
=======
              <Link href={ROUTES.brand.b2bLinesheets}>Список лайншитов</Link>
            </Button>
          </div>
        }
      />
      <LineSheetGenerator />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
