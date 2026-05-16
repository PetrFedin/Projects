'use client';

import dynamic from 'next/dynamic';

export const LiveProcessPageBody = dynamic(
  () => import('@/components/live-process/LiveProcessPageBody').then((m) => m.LiveProcessPageBody),
  {
    ssr: false,
    loading: () => <div className="text-text-muted p-8 text-center text-sm">Загрузка LIVE…</div>,
  }
);

export const GoldSampleContent = dynamic(() => import('@/app/brand/production/gold-sample/page'), {
  ssr: false,
});

export const QcAppContent = dynamic(() => import('@/app/brand/production/qc-app/page'), {
  ssr: false,
});

export const ReadyMadeContent = dynamic(
  () => import('@/app/brand/production/ready-made/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const FitCommentsContent = dynamic(
  () => import('@/app/brand/production/fit-comments/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const GanttContent = dynamic(
  () => import('@/app/brand/production/gantt/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const DailyOutputContent = dynamic(
  () => import('@/app/brand/production/daily-output/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const WorkerSkillsContent = dynamic(
  () => import('@/app/brand/production/worker-skills/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const MilestonesVideoContent = dynamic(
  () => import('@/app/brand/production/milestones-video/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const SubcontractorContent = dynamic(
  () => import('@/app/brand/production/subcontractor/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const VmiContent = dynamic(() => import('@/app/brand/vmi/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div>,
});

export const MaterialReservationContent = dynamic(
  () => import('@/app/brand/materials/reservation/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const ProductionLiveContent = dynamic(
  () => import('@/app/brand/production/operations/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const QualityLiveContent = dynamic(
  () =>
    import('@/components/brand/quality/BrandQualityDeskBody').then((m) => m.BrandQualityDeskBody),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export const NestingContent = dynamic(
  () => import('@/app/brand/production/nesting/nesting-page-body').then((m) => m.NestingPageBody),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
