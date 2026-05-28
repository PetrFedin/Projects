/** Сводный «есть риски» для индикаторов этажа (QC / вехи / просроченный cancel по дропу). */
export function computeHasProductionFloorRisks(
  qcWithIssues: number,
  milestonesPending: number,
  dropsWithMeta: Array<{ daysToCancel?: number }>
): boolean {
  return (
    qcWithIssues > 0 ||
    milestonesPending > 0 ||
    dropsWithMeta.some((d) => d.daysToCancel !== undefined && d.daysToCancel < 0)
  );
}
