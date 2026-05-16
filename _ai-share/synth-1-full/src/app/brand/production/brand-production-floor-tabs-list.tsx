'use client';

import { TabsList } from '@/components/ui/tabs';
import { ProductionFloorTabWithHint } from '@/components/brand/production/ProductionFloorTabWithHint';
import { StagesContextFilterPulseIcon } from '@/components/brand/production/StagesDependenciesTabContent';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT } from '@/app/brand/production/use-brand-production-floor-navigation';
import {
  Activity,
  BarChart3,
  Camera,
  ClipboardCheck,
  Factory,
  ListTree,
  Package,
  Play,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const floorTabTriggerClass = cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5');

export function BrandProductionFloorTabsList(props: {
  articleContextValid: boolean;
  stagesFilterOn: boolean;
}) {
  const { articleContextValid, stagesFilterOn } = props;
  const articleTabDisabled = !articleContextValid;

  return (
    <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap overflow-x-auto')}>
      <ProductionFloorTabWithHint
        tab="stages"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <ListTree className="h-3.5 w-3.5 shrink-0" />
        <span className="max-w-[9rem] leading-tight sm:whitespace-nowrap">Этапы и зависимости</span>
        {stagesFilterOn ? <StagesContextFilterPulseIcon /> : null}
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint tab="live" className={floorTabTriggerClass}>
        <Activity className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">LIVE · схема</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint tab="workshop" className={floorTabTriggerClass}>
        <Factory className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Коллекция</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="supplies"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <Package className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Снабжение</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="sample"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Эталон · fit</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="plan"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <BarChart3 className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">План · PO</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="nesting"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <Ruler className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Nesting AI</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="launch"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <Play className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Выпуск</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="quality"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <Camera className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">ОТК</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="receipt"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <Truck className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Склад</span>
      </ProductionFloorTabWithHint>
      <ProductionFloorTabWithHint
        tab="ops"
        disabled={articleTabDisabled}
        disabledHint={BRAND_PRODUCTION_ARTICLE_CONTEXT_REQUIRED_HINT}
        className={floorTabTriggerClass}
      >
        <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Операции</span>
      </ProductionFloorTabWithHint>
    </TabsList>
  );
}
