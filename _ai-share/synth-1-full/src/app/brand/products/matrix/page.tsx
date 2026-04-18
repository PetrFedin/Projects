'use client';

import Link from 'next/link';
import { VariantMatrixEditor } from '@/components/brand/VariantMatrixEditor';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
<<<<<<< HEAD

export default function VariantMatrixPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24">
=======
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

export default function VariantMatrixPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Variant Matrix"
        description="Размерные сетки, цвета и вариации SKU. Связи: Products (PIM), Production (Assortment), Inventory, Linesheets."
        icon={Layers}
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
              SKU Variants
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/products">Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/production">Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/inventory">Inventory</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/b2b/linesheets">Linesheets</Link>
=======
              <Link href={ROUTES.brand.products}>Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.production}>Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.inventory}>Inventory</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.b2bLinesheets}>Linesheets</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </>
        }
      />
<<<<<<< HEAD
      <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            Fashion OS — Product Intelligence
          </div>
          <h1 className="text-sm font-bold uppercase leading-tight tracking-tight text-slate-900">
            Variant Matrix
          </h1>
          <p className="text-[11px] font-medium text-slate-500">
=======
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
            <Layers className="text-accent-primary h-3.5 w-3.5" />
            Fashion OS — Product Intelligence
          </div>
          <h1 className="text-text-primary text-sm font-bold uppercase leading-tight tracking-tight">
            Variant Matrix
          </h1>
          <p className="text-text-secondary text-[11px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Управление размерными сетками, цветами и SKU в едином интерфейсе.
          </p>
        </div>
      </header>
      <div className="bg-transparent">
        <VariantMatrixEditor />
      </div>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
