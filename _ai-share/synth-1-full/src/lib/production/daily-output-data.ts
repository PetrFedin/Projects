/**
 * Daily Output Tracking — отчёты смен (план/факт по линиям).
 * При API — GET /production/daily-output?date=...
 */

export interface ShiftReport {
  id: string;
  date: string;
  lineId: string;
  lineName: string;
  plan: number;
  fact: number;
  comment?: string;
}

/** Мок: отчёты за дату. date в формате YYYY-MM-DD или любой; при API — фильтр по дате. */
export function getShiftReports(date?: string): ShiftReport[] {
  return [
    { id: '1', date: '2026-03-11', lineId: 'L1', lineName: 'Линия 1', plan: 120, fact: 118, comment: 'Простой 30 мин' },
    { id: '2', date: '2026-03-11', lineId: 'L2', lineName: 'Линия 2', plan: 80, fact: 82, comment: '' },
    { id: '3', date: '2026-03-11', lineId: 'L3', lineName: 'Линия 3', plan: 100, fact: 95, comment: 'Нехватка фурнитуры' },
    { id: '4', date: '2026-03-10', lineId: 'L1', lineName: 'Линия 1', plan: 120, fact: 120, comment: '' },
    { id: '5', date: '2026-03-10', lineId: 'L2', lineName: 'Линия 2', plan: 80, fact: 78, comment: '' },
  ].filter((s) => !date || s.date === date);
}

export function getShiftReportSummary(reports: ShiftReport[]): { totalPlan: number; totalFact: number; percent: number } {
  const totalPlan = reports.reduce((a, s) => a + s.plan, 0);
  const totalFact = reports.reduce((a, s) => a + s.fact, 0);
  const percent = totalPlan > 0 ? Math.round((totalFact / totalPlan) * 100) : 0;
  return { totalPlan, totalFact, percent };
}
