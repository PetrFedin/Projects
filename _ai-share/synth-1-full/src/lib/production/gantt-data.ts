/**
 * GANTT Production Scheduler — данные загрузки линий.
 * Линии, PO по неделям. При API — из планировщика/производственных заказов.
 */

export interface GanttLineAssignment {
  lineId: string;
  lineName: string;
  orderIds: string[];
  /** По неделям: 1 = загружена, 0 = свободна (или доля 0–1) */
  weeks: number[];
}

export interface GanttWeekLabel {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
}

const DEFAULT_WEEKS: GanttWeekLabel[] = [
  { key: 'w1', label: 'Неделя 1', startDate: '2026-03-10', endDate: '2026-03-16' },
  { key: 'w2', label: 'Неделя 2', startDate: '2026-03-17', endDate: '2026-03-23' },
  { key: 'w3', label: 'Неделя 3', startDate: '2026-03-24', endDate: '2026-03-30' },
  { key: 'w4', label: 'Неделя 4', startDate: '2026-03-31', endDate: '2026-04-06' },
  { key: 'w5', label: 'Неделя 5', startDate: '2026-04-07', endDate: '2026-04-13' },
];

/** Мок: загрузка линий по неделям. При API — GET /production/gantt?period=... */
export function getGanttLines(periodKey?: string): GanttLineAssignment[] {
  return [
    {
      lineId: 'L1',
      lineName: 'Линия 1 (Раскрой + Пошив)',
      orderIds: ['PO-101', 'PO-102'],
      weeks: [1, 1, 1, 0, 0],
    },
    { lineId: 'L2', lineName: 'Линия 2', orderIds: ['PO-103'], weeks: [0, 1, 1, 1, 0] },
    { lineId: 'L3', lineName: 'Линия 3', orderIds: ['PO-104', 'PO-105'], weeks: [0, 0, 1, 1, 1] },
    { lineId: 'L4', lineName: 'Линия 4 (Упаковка)', orderIds: [], weeks: [0, 1, 1, 1, 1] },
  ];
}

export function getGanttWeekLabels(periodKey?: string): GanttWeekLabel[] {
  return DEFAULT_WEEKS;
}
