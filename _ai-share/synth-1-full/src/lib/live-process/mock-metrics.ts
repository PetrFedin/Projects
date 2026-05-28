import type { StageMetrics, ProcessKpi, ProcessReminder } from './types';

/** Мок: метрики этапов (воронка, среднее время, узкие места) */
export const MOCK_STAGE_METRICS: Record<string, StageMetrics[]> = {
  production: [
    { stageId: 'brief', avgDays: 5, totalCompleted: 12, overdueCount: 1, overduePct: 8 },
    { stageId: 'assortment-map', avgDays: 7, totalCompleted: 12, overdueCount: 2, overduePct: 17 },
    { stageId: 'tech-pack', avgDays: 12, totalCompleted: 11, overdueCount: 3, overduePct: 27 },
    { stageId: 'samples', avgDays: 21, totalCompleted: 10, overdueCount: 4, overduePct: 40 },
    { stageId: 'po', avgDays: 5, totalCompleted: 10, overdueCount: 0, overduePct: 0 },
    { stageId: 'qc', avgDays: 4, totalCompleted: 9, overdueCount: 1, overduePct: 11 },
    { stageId: 'ready-made', avgDays: 3, totalCompleted: 9, overdueCount: 0, overduePct: 0 },
  ],
  b2b: [
    { stageId: 'application', avgDays: 2, totalCompleted: 45, overdueCount: 0, overduePct: 0 },
    {
      stageId: 'approval-workflow',
      avgDays: 5,
      totalCompleted: 42,
      overdueCount: 3,
      overduePct: 7,
    },
    { stageId: 'payment', avgDays: 3, totalCompleted: 40, overdueCount: 1, overduePct: 3 },
    {
      stageId: 'allocation-shipment',
      avgDays: 7,
      totalCompleted: 38,
      overdueCount: 2,
      overduePct: 5,
    },
  ],
};

/** Мок: KPI процесса */
export const MOCK_PROCESS_KPI: Record<string, ProcessKpi> = {
  production: {
    onTimePct: 73,
    avgCycleDays: 57,
    overdueInstances: 2,
    stagesWithoutAssignee: 1,
  },
  b2b: {
    onTimePct: 89,
    avgCycleDays: 17,
    overdueInstances: 0,
    stagesWithoutAssignee: 0,
  },
};

/** Мок: напоминания */
export const MOCK_REMINDERS: ProcessReminder[] = [
  {
    id: 'rem-1',
    type: 'overdue',
    processId: 'production',
    contextId: 'col-fw26',
    stageId: 'samples',
    message: 'Этап «Сэмплы» просрочен на 3 дня',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rem-2',
    type: 'no_assignee',
    processId: 'production',
    contextId: 'col-ss27',
    stageId: 'tech-pack',
    message: 'Ответственный не назначен на этап «Tech Pack»',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rem-3',
    type: 'approval_pending',
    processId: 'b2b',
    contextId: 'ord-1001',
    stageId: 'approval-workflow',
    message: 'Заказ #1001 ожидает согласования',
    createdAt: new Date().toISOString(),
  },
];
