'use client';

import Link from 'next/link';
import { VisualMerchandiser } from '@/components/brand/VisualMerchandiser';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Package, ShoppingBag, Target } from 'lucide-react';
<<<<<<< HEAD

export default function MerchandisingPage() {
  return (
    <div className="container mx-auto space-y-4 px-4 py-4 pb-24">
=======
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

export default function MerchandisingPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Digital Rack Planner"
        description="Визуальный мерчандайзинг для шоурума и байеров. Связь с Products (каталог), B2B (линии) и Showroom."
        icon={LayoutGrid}
<<<<<<< HEAD
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
=======
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
>>>>>>> recover/cabinet-wip-from-stash
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Products
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Showroom
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/range-planner">
=======
              <Link href={ROUTES.brand.rangePlanner}>
>>>>>>> recover/cabinet-wip-from-stash
                <Target className="mr-1 h-3 w-3" /> Range Planner
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/products">
=======
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
          </>
        }
      />
      <VisualMerchandiser />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
