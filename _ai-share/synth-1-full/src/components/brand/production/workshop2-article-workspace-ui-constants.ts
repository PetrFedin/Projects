import type { ComponentType } from 'react';
import * as LucideIcons from 'lucide-react';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2PipelineLane } from '@/lib/production/workshop2-collection-metrics';
import type { Workshop2OverviewTab } from '@/lib/production/workshop2-overview-model';
import type { Workshop2TzSignoffStageId } from '@/lib/production/workshop2-dossier-phase1.types';

export const W2_PASSPORT_TZ_STAGE_DEFS: { id: Workshop2TzSignoffStageId; label: string }[] = [
  { id: 'tz', label: 'ТЗ' },
  { id: 'sample', label: 'Обр.' },
  { id: 'supply', label: 'Снб.' },
  { id: 'fit', label: 'Пос.' },
  { id: 'plan', label: 'Пл.' },
  { id: 'release', label: 'Вып.' },
  { id: 'qc', label: 'ОТК' },
];

export const W2_PASSPORT_TZ_STAGE_ORDER: Workshop2TzSignoffStageId[] =
  W2_PASSPORT_TZ_STAGE_DEFS.map((d) => d.id);

export const WORKSHOP2_DEFAULT_TZ_SIGNOFF_REVOKERS: readonly string[] = [
  'Генеральный директор',
  'Руководитель бренда',
  'Заместитель руководителя бренда',
  'Главный технолог',
];

export const W2_DOSSIER_SECTION_IDS: readonly DossierSection[] = [
  'general',
  'visuals',
  'material',
  'construction',
  'assignment',
  'sample_intake',
];

export function parseWorkshop2DossierSection(raw: string | null): DossierSection | null {
  if (!raw) return null;
  if (raw === 'measurements') return 'construction';
  if (raw === 'packaging') return 'material';
  if (raw === 'time-and-action' || raw === 'time_and_action') return null;
  return W2_DOSSIER_SECTION_IDS.includes(raw as DossierSection) ? (raw as DossierSection) : null;
}

export const W2_PULSE_SECTION_LABEL_RU: Record<DossierSection, string> = {
  general: 'Паспорт',
  visuals: 'Визуал',
  material: 'Материалы',
  construction: 'Конструкция',
  measurements: 'Мерки',
  packaging: 'Упаковка',
  sample_intake: 'Приёмка сэмпла',
  assignment: 'Задание',
};

export const W2_ROUTE_STAGE_TILE_ICONS: Record<
  Workshop2OverviewTab,
  ComponentType<{ className?: string }>
> = {
  overview: LucideIcons.LayoutDashboard,
  tz: LucideIcons.FileBadge2,
  supply: LucideIcons.Package,
  fit: LucideIcons.BadgeCheck,
  plan: LucideIcons.CalendarRange,
  release: LucideIcons.Factory,
  qc: LucideIcons.CheckCircle2,
  stock: LucideIcons.Warehouse,
};

export const W2_OVERVIEW_DECISION_ROW_MIN = 'min-h-[3.25rem]';
export const W2_OVERVIEW_KPI_TILE_INTERACTIVE =
  'h-full min-h-0 cursor-pointer outline-none transition-[border-color,box-shadow,background-color,transform] duration-150 hover:border-accent-primary/30 hover:bg-white hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2';
export const W2_TZ_PASSPORT_CONTINUE_BTN_CLASS = 'h-9 gap-1.5 px-3 text-xs font-medium';
export const W2_OVERVIEW_OPEN_BTN_CLASS = 'h-8 shrink-0 px-3 text-xs font-medium';

export const W2_DECISION_SNAPSHOT_ICONS: Record<
  DossierSection,
  ComponentType<{ className?: string }>
> = {
  general: LucideIcons.Users,
  visuals: LucideIcons.Sparkles,
  material: LucideIcons.Layers,
  measurements: LucideIcons.Ruler,
  construction: LucideIcons.Shirt,
  packaging: LucideIcons.Tags,
  sample_intake: LucideIcons.ClipboardCheck,
  assignment: LucideIcons.FileCheck,
};

export const W2_ROUTE_HELP_INFO_BTN_CLASS =
  'relative z-10 shrink-0 rounded-full p-0.5 text-text-muted transition-colors hover:bg-white/80 hover:text-accent-primary';

export const W2_PIPELINE_LANE_TILE_BORDER: Record<Workshop2PipelineLane, string> = {
  development: 'border-l-[3px] border-l-indigo-200',
  samples: 'border-l-[3px] border-l-teal-300',
};
