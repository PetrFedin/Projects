'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { cn } from '@/lib/utils';
import {
  DailyOutputContent,
  FitCommentsContent,
  GanttContent,
  GoldSampleContent,
  MaterialReservationContent,
  MilestonesVideoContent,
  NestingContent,
  ProductionLiveContent,
  QcAppContent,
  QualityLiveContent,
  ReadyMadeContent,
  SubcontractorContent,
  VmiContent,
  WorkerSkillsContent,
} from '@/app/brand/production/production-page-floor-lazy';

export function BrandProductionSuppliesFloorPanel(props: {
  isActive: boolean;
  suppliesSub: 'vmi' | 'reservation';
  onSuppliesSubChange: (v: 'vmi' | 'reservation') => void;
}) {
  if (!props.isActive) return null;
  return (
    <Tabs
      value={props.suppliesSub}
      onValueChange={(v) => props.onSuppliesSubChange(v as 'vmi' | 'reservation')}
      className="w-full"
    >
      <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
        <TabsTrigger value="vmi" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Запасы (VMI)
        </TabsTrigger>
        <TabsTrigger value="reservation" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Бронирование
        </TabsTrigger>
      </TabsList>
      <TabsContent value="vmi" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.suppliesSub === 'vmi' ? <VmiContent /> : null}
      </TabsContent>
      <TabsContent value="reservation" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.suppliesSub === 'reservation' ? <MaterialReservationContent /> : null}
      </TabsContent>
    </Tabs>
  );
}

export function BrandProductionSampleFloorPanel(props: {
  isActive: boolean;
  sampleSub: 'gold' | 'fit';
  onSampleSubChange: (v: 'gold' | 'fit') => void;
}) {
  if (!props.isActive) return null;
  return (
    <Tabs
      value={props.sampleSub}
      onValueChange={(v) => props.onSampleSubChange(v as 'gold' | 'fit')}
      className="w-full"
    >
      <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
        <TabsTrigger value="gold" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Утверждение эталона
        </TabsTrigger>
        <TabsTrigger value="fit" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Fit comments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="gold" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.sampleSub === 'gold' ? <GoldSampleContent /> : null}
      </TabsContent>
      <TabsContent value="fit" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.sampleSub === 'fit' ? <FitCommentsContent /> : null}
      </TabsContent>
    </Tabs>
  );
}

export function BrandProductionPlanFloorPanel(props: { isActive: boolean }) {
  return props.isActive ? <GanttContent /> : null;
}

export function BrandProductionNestingFloorPanel(props: { isActive: boolean }) {
  return props.isActive ? <NestingContent /> : null;
}

export function BrandProductionLaunchFloorPanel(props: {
  isActive: boolean;
  launchSub: 'daily' | 'skills' | 'video' | 'sub';
  onLaunchSubChange: (v: 'daily' | 'skills' | 'video' | 'sub') => void;
}) {
  if (!props.isActive) return null;
  return (
    <Tabs
      value={props.launchSub}
      onValueChange={(v) => props.onLaunchSubChange(v as 'daily' | 'skills' | 'video' | 'sub')}
      className="w-full"
    >
      <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
        <TabsTrigger value="daily" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Ежедневный выпуск
        </TabsTrigger>
        <TabsTrigger value="skills" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Матрица навыков
        </TabsTrigger>
        <TabsTrigger value="video" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Видеоэтапы
        </TabsTrigger>
        <TabsTrigger value="sub" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Субподрядчики
        </TabsTrigger>
      </TabsList>
      <TabsContent value="daily" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.launchSub === 'daily' ? <DailyOutputContent /> : null}
      </TabsContent>
      <TabsContent value="skills" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.launchSub === 'skills' ? <WorkerSkillsContent /> : null}
      </TabsContent>
      <TabsContent value="video" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.launchSub === 'video' ? <MilestonesVideoContent /> : null}
      </TabsContent>
      <TabsContent value="sub" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.launchSub === 'sub' ? <SubcontractorContent /> : null}
      </TabsContent>
    </Tabs>
  );
}

export function BrandProductionQualityFloorPanel(props: {
  isActive: boolean;
  qualitySub: 'mobile' | 'desk';
  onQualitySubChange: (v: 'mobile' | 'desk') => void;
}) {
  if (!props.isActive) return null;
  return (
    <Tabs
      value={props.qualitySub}
      onValueChange={(v) => props.onQualitySubChange(v as 'mobile' | 'desk')}
      className="w-full"
    >
      <TabsList className={cn(cabinetSurface.tabsList, 'mb-2 flex-wrap')}>
        <TabsTrigger value="mobile" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Мобильный ОТК
        </TabsTrigger>
        <TabsTrigger value="desk" className={cn(cabinetSurface.tabsTrigger, 'h-7')}>
          Рабочее место QC
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mobile" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.qualitySub === 'mobile' ? <QcAppContent /> : null}
      </TabsContent>
      <TabsContent value="desk" className={cabinetSurface.cabinetProfileTabPanel}>
        {props.qualitySub === 'desk' ? <QualityLiveContent /> : null}
      </TabsContent>
    </Tabs>
  );
}

export function BrandProductionReceiptFloorPanel(props: { isActive: boolean }) {
  return props.isActive ? <ReadyMadeContent /> : null;
}

export function BrandProductionOpsFloorPanel(props: { isActive: boolean }) {
  return props.isActive ? <ProductionLiveContent /> : null;
}
