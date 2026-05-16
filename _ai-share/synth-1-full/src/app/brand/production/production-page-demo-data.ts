import type { QcInspection } from '@/lib/production/qc-app';
import type { MilestoneWithVideo } from '@/lib/production/milestones-video';
import type { SubcontractOrder } from '@/lib/production/subcontractor';

/** Строка селектора коллекций (мок + локальные подмешиваются в page). */
export type BrandProductionMockCollectionRow = {
  id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'done';
  articleCount: number;
  progressPct: number;
};

/** Мок: список коллекций для провала — все, по которым велась или ведётся работа */
export const MOCK_COLLECTIONS: BrandProductionMockCollectionRow[] = [
  { id: '', name: 'По умолчанию', status: 'in_progress', articleCount: 3, progressPct: 45 },
  {
    id: 'Investor',
    name: 'Демо для инвесторов',
    status: 'in_progress',
    articleCount: 3,
    progressPct: 52,
  },
  { id: 'New', name: 'Новая (черновик)', status: 'draft', articleCount: 0, progressPct: 0 },
  {
    id: 'FW26-Main',
    name: 'FW26 Основная',
    status: 'in_progress',
    articleCount: 12,
    progressPct: 70,
  },
  { id: 'SS27', name: 'SS27', status: 'in_progress', articleCount: 3, progressPct: 48 },
  { id: 'SS26', name: 'SS26', status: 'draft', articleCount: 5, progressPct: 20 },
  {
    id: 'FW25-Archive',
    name: 'FW25 (завершена)',
    status: 'done',
    articleCount: 24,
    progressPct: 100,
  },
];

/** Mock QC для этажа: связаны с PO-201/202 из initialOrderItems (до API). */
export const MOCK_QC_INSPECTIONS_FLOOR: QcInspection[] = [
  {
    id: 'qc1',
    orderId: 'PO-201',
    aqlLevel: '2.5',
    status: 'passed',
    inspectedCount: 80,
    defectCount: 0,
    defects: [],
    inspectedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'qc2',
    orderId: 'PO-202',
    aqlLevel: '4.0',
    status: 'rework',
    inspectedCount: 120,
    defectCount: 3,
    defects: [{ id: 'd1', type: 'пятно', severity: 'major', position: 'спинка' }],
    inspectedAt: '2026-03-11T09:00:00Z',
  },
];

export const MOCK_MILESTONES_FLOOR: MilestoneWithVideo[] = [
  {
    id: 'm1',
    orderId: 'PO-201',
    milestoneType: 'cutting_done',
    milestoneLabel: 'Раскрой завершён',
    status: 'approved',
    completedAt: '2026-03-09T12:00:00Z',
    approvedAt: '2026-03-09T14:00:00Z',
  },
  {
    id: 'm2',
    orderId: 'PO-201',
    milestoneType: 'assembly_done',
    milestoneLabel: 'Сборка завершена',
    status: 'video_uploaded',
    completedAt: '2026-03-10T18:00:00Z',
  },
  {
    id: 'm3',
    orderId: 'PO-201',
    milestoneType: 'final_qc',
    milestoneLabel: 'Финальный ОК',
    status: 'pending',
  },
];

export const MOCK_SUBCONTRACT_ORDERS_FLOOR: SubcontractOrder[] = [
  {
    id: 's1',
    subcontractorId: 'sc1',
    subcontractorName: 'Ателье «Стиль»',
    orderId: 'PO-201',
    workType: 'sewing',
    workTypeLabel: 'Пошив',
    quantity: 500,
    unit: 'шт',
    status: 'in_progress',
    requestedAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 's2',
    subcontractorId: 'sc2',
    subcontractorName: 'Раскройный цех №2',
    orderId: 'PO-202',
    workType: 'cutting',
    workTypeLabel: 'Раскрой',
    quantity: 1200,
    unit: 'шт',
    status: 'completed',
    requestedAt: '2026-03-01T08:00:00Z',
    completedAt: '2026-03-08T17:00:00Z',
  },
];
