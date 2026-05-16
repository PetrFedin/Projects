'use client';

import { BookOpen, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import CollaborationProjects from '@/components/brand/collaboration-projects';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { CATEGORY_HANDBOOK } from '@/lib/data/category-handbook';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabHandbooks({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setHandbookView, handbookView } = px;

  return (
<TabsContent value="handbooks" className={cabinetSurface.cabinetProfileTabPanel}>
  <ProductionSectionHeader title="Справочники (Партнёры)" barColor="bg-accent-primary" />
  <SectionInfoCard
    title="Партнёры и справочники"
    description="Категории товаров, поставщики, размеры, материалы, фурнитура, коллаборации. Категории — для артикулов, поставщики — для снабжения."
    icon={BookOpen}
    iconBg="bg-accent-primary/15"
    iconColor="text-accent-primary"
    badges={
      <>
        <Badge variant="outline" className="text-[9px]">
          Категории → артикулы
        </Badge>
      </>
    }
  />
  <Card className="border-border-subtle overflow-hidden rounded-2xl border p-5 shadow-sm">
    <div className="mb-4 flex items-center gap-4">
      <div className="bg-accent-primary/15 text-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
        <BookOpen className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase">Партнёры и справочники</h3>
        <p className="text-text-secondary text-[11px]">
          Категории, размеры, материалы, поставщики, коллаборации
        </p>
      </div>
    </div>
    <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1.5">
      {(['categories', 'suppliers', 'collabs', 'sizes'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setHandbookView?.(v)}
          className={cn(
            'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
            handbookView === v
              ? 'text-accent-primary bg-white shadow-sm'
              : 'text-text-secondary'
          )}
        >
          {v === 'categories' && 'Категории'}
          {v === 'suppliers' && 'Поставщики'}
          {v === 'collabs' && 'Коллаборации'}
          {v === 'sizes' && 'Размеры'}
        </button>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="border-border-subtle rounded-2xl border p-5 transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-accent-primary/15 text-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[12px] font-black uppercase">Категории</p>
            <p className="text-text-secondary text-[10px]">
              {CATEGORY_HANDBOOK?.length || 0} категорий
            </p>
          </div>
        </div>
      </Card>
      <Card className="border-border-subtle rounded-2xl border p-5 transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[12px] font-black uppercase">Поставщики</p>
            <p className="text-text-secondary text-[10px]">Реестр партнёров</p>
          </div>
        </div>
      </Card>
    </div>
    {handbookView === 'collabs' && <CollaborationProjects brandId="brand-syntha" />}
  </Card>
</TabsContent>

  );
}
