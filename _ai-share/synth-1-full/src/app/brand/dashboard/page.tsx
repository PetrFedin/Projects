'use client';

import Link from 'next/link';
import { BrandDashboardWidgets } from '@/components/brand/brand-dashboard-widgets';
<<<<<<< HEAD
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BarChart3, Factory, ShoppingBag } from 'lucide-react';

export default function BrandDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionInfoCard
        title="Главный дашборд"
        description="Сводка по бренду: KPI, алерты, каналы. Центр управления — детальная аналитика. Связь с Production, B2B, Finance."
        icon={LayoutDashboard}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              KPI
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/control-center">
=======
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Factory, Map, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { B2B_ORDERS_REGISTRY_LABEL } from '@/lib/ui/b2b-registry-label';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getBrandPartnerRetailCrossRoleLinks } from '@/lib/data/entity-links';
import { B2BWorkspaceModuleGrid } from '@/components/b2b/B2BWorkspaceModuleGrid';

export default function BrandDashboardPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Главный дашборд"
        leadPlain={
          <>
            Сводка по бренду: <AcronymWithTooltip abbr="KPI" />, алерты, каналы. Центр управления —
            детальная аналитика. Связь с производством, B2B, финансами.
          </>
        }
        actions={
          <>
            <Badge variant="outline" className="text-[9px]">
              <AcronymWithTooltip abbr="KPI" />
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.controlCenter}>
>>>>>>> recover/cabinet-wip-from-stash
                <BarChart3 className="mr-1 h-3 w-3" /> Центр управления
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/production">
                <Factory className="mr-1 h-3 w-3" /> Production
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/b2b-orders">
                <ShoppingBag className="mr-1 h-3 w-3" /> B2B
=======
              <Link href={ROUTES.brand.production}>
                <Factory className="mr-1 h-3 w-3" /> Производство
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.b2bOrders}>
                <ShoppingBag className="mr-1 h-3 w-3" /> {B2B_ORDERS_REGISTRY_LABEL}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.shop.b2bWorkspaceMap}>
                <Map className="mr-1 h-3 w-3" /> Карта B2B (ритейл)
>>>>>>> recover/cabinet-wip-from-stash
              </Link>
            </Button>
          </>
        }
      />
<<<<<<< HEAD
      <BrandDashboardWidgets />
    </div>
=======
      <B2BWorkspaceModuleGrid
        primaryRole="brand"
        className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
        title="Модули B2B (роль бренда)"
        lead="Матрица из общего workplace: PIM, шоурум, производство, контракты — с переходами в кабинет бренда и связанные экраны ритейла."
      />
      <BrandDashboardWidgets />
      <RelatedModulesBlock
        links={getBrandPartnerRetailCrossRoleLinks()}
        title="Партнёрский контур: ритейл и байеры"
        className="border-border-default rounded-lg border bg-white p-4 shadow-sm"
      />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
