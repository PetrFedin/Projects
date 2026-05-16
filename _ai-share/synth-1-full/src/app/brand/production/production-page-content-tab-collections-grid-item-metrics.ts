export type CollectionGridItemMetrics = {
  isSelected: boolean;
  statusColor: string;
  collSkuCount: number;
  collPoCount: number;
  collSamplePending: number;
  collFactories: string[];
  stageStatus: {
    design: 'completed';
    tz: 'completed';
    bom: 'completed' | 'active';
    sample: 'active' | 'completed' | 'locked';
    approval: 'active' | 'locked';
    po: 'completed' | 'locked';
    production: 'active' | 'completed' | 'locked';
  };
};

export function computeCollectionGridItemMetrics(
  px: Record<string, any>,
  c: any
): CollectionGridItemMetrics {
  const {
    selectedCollectionIds,
    filteredSkus,
    filteredProductionOrders,
    filteredSampleStatuses,
  } = px;

  const ordersForColl = (filteredProductionOrders || []).filter((o: any) => o.collection === c.id);
  const samplesForColl = (filteredSampleStatuses || []).filter((s: any) => s.collection === c.id);

  const isSelected = selectedCollectionIds?.includes(c.id);
  const statusColor =
    c.status === 'Production'
      ? 'from-accent-primary/10 to-accent-primary/5'
      : c.status === 'Development'
        ? 'from-amber-500/10 to-amber-600/5'
        : 'from-emerald-500/10 to-emerald-600/5';
  const collSkuCount = (filteredSkus || []).filter((s: any) => s.collection === c.id).length;
  const collPoCount = ordersForColl.length;
  const collSamplePending = samplesForColl.filter(
    (s: any) => s.status === 'in_review' || s.status === 'waiting'
  ).length;
  const collFactories = [
    ...new Set(
      ordersForColl
        .map((o: any) => o.factory)
    ),
  ].filter(Boolean) as string[];
  const stageStatus = {
    design: 'completed' as const,
    tz: 'completed' as const,
    bom: collSkuCount > 0 ? ('completed' as const) : ('active' as const),
    sample:
      collSamplePending > 0
        ? ('active' as const)
        : collSkuCount > 0
          ? ('completed' as const)
          : ('locked' as const),
    approval: collSamplePending > 0 ? ('active' as const) : ('locked' as const),
    po: collPoCount > 0 ? ('completed' as const) : ('locked' as const),
    production: ordersForColl.some((o: any) => o.status === 'In Production')
      ? ('active' as const)
      : collPoCount > 0
        ? ('completed' as const)
        : ('locked' as const),
  };

  return {
    isSelected,
    statusColor,
    collSkuCount,
    collPoCount,
    collSamplePending,
    collFactories,
    stageStatus,
  };
}
