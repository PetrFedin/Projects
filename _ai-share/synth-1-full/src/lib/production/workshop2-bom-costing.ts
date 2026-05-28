/**
 * Enterprise-калькуляция BOM: расход × цена, rollup FOB, сравнение с targetFob паспорта.
 */

import type {
  Workshop2DossierPhase1,
  Workshop2ProductionMaterialLine,
  Workshop2ProductionModel,
  Workshop2ProductionOperation,
  Workshop2ProductionTrimLine,
} from './workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from './workshop2-production-model-from-dossier';
import {
  importWorkshop2ErpLandedCostLines,
  type Workshop2ErpLandedCostImport,
} from './workshop2-bom-costing-erp-landed';

export type Workshop2BomLineCost = {
  lineId: string;
  kind: 'material' | 'trim' | 'operation';
  label: string;
  yieldQty: number;
  unitPrice: number;
  lineCost: number;
  currency: string;
};

export type Workshop2BomCostingRollup = {
  materialsTotal: number;
  trimsTotal: number;
  operationsTotal: number;
  estimatedFob: number;
  currency: string;
  lineCosts: Workshop2BomLineCost[];
  targetFob?: number;
  targetMarginPct?: number;
  /** on_target | over | under | no_target */
  deltaBand: 'on_target' | 'over' | 'under' | 'no_target';
  deltaAbs?: number;
  deltaPct?: number;
  /** Wave 2 #7: optional ERP landed cost overlay (honest — только erpExternalId). */
  erpLanded?: Workshop2ErpLandedCostImport;
  logisticsStubTotal?: number;
  cmtFromErpTotal?: number;
};

function materialUnitPrice(m: Workshop2ProductionMaterialLine): number {
  return m.landedCost ?? m.unitCostNet ?? 0;
}

function materialLineCost(m: Workshop2ProductionMaterialLine): number {
  const qty = m.yieldPerUnit ?? m.consumption ?? 0;
  return qty * materialUnitPrice(m);
}

function trimLineCost(t: Workshop2ProductionTrimLine): number {
  return (t.quantity ?? 0) * (t.unitCostNet ?? 0);
}

function operationLineCost(o: Workshop2ProductionOperation): number {
  return o.costPerUnit ?? 0;
}

export function computeWorkshop2BomCostingRollup(
  dossier: Workshop2DossierPhase1,
  model?: Workshop2ProductionModel,
  erpPurchaseOrders?: Parameters<typeof importWorkshop2ErpLandedCostLines>[0]['purchaseOrders']
): Workshop2BomCostingRollup {
  const pm = model ?? ensureWorkshop2ProductionModel(dossier);
  const lineCosts: Workshop2BomLineCost[] = [];

  let materialsTotal = 0;
  for (const m of pm.materialLines) {
    const lc = materialLineCost(m);
    materialsTotal += lc;
    lineCosts.push({
      lineId: m.id,
      kind: 'material',
      label: m.materialName || 'Материал',
      yieldQty: m.yieldPerUnit ?? m.consumption ?? 0,
      unitPrice: materialUnitPrice(m),
      lineCost: lc,
      currency: m.currency ?? 'RUB',
    });
  }

  let trimsTotal = 0;
  for (const t of pm.trimLines) {
    const lc = trimLineCost(t);
    trimsTotal += lc;
    lineCosts.push({
      lineId: t.id,
      kind: 'trim',
      label: t.name || 'Фурнитура',
      yieldQty: t.quantity ?? 0,
      unitPrice: t.unitCostNet ?? 0,
      lineCost: lc,
      currency: 'RUB',
    });
  }

  let operationsTotal = 0;
  for (const o of pm.operations ?? []) {
    const lc = operationLineCost(o);
    operationsTotal += lc;
    lineCosts.push({
      lineId: o.id,
      kind: 'operation',
      label: o.name || o.operationType,
      yieldQty: 1,
      unitPrice: lc,
      lineCost: lc,
      currency: 'RUB',
    });
  }

  const erpLanded = importWorkshop2ErpLandedCostLines({
    dossier,
    purchaseOrders: erpPurchaseOrders,
  });

  let materialsTotalAdj = materialsTotal;
  let trimsTotalAdj = trimsTotal;
  let operationsTotalAdj = operationsTotal;
  let logisticsStubTotal: number | undefined;
  let cmtFromErpTotal: number | undefined;

  if (erpLanded.applied) {
    materialsTotalAdj = erpLanded.fabricTotal > 0 ? erpLanded.fabricTotal : materialsTotal;
    trimsTotalAdj = erpLanded.trimTotal > 0 ? erpLanded.trimTotal : trimsTotal;
    cmtFromErpTotal = erpLanded.cmtTotal;
    operationsTotalAdj = erpLanded.cmtTotal > 0 ? erpLanded.cmtTotal : operationsTotal;
    logisticsStubTotal = erpLanded.logisticsStubTotal;
  }

  const estimatedFob =
    materialsTotalAdj + trimsTotalAdj + operationsTotalAdj + (logisticsStubTotal ?? 0);
  const targetFob = dossier.passportProductionBrief?.targetFob;
  const targetMarginPct = dossier.passportProductionBrief?.targetMarginPct;

  let deltaBand: Workshop2BomCostingRollup['deltaBand'] = 'no_target';
  let deltaAbs: number | undefined;
  let deltaPct: number | undefined;

  if (targetFob != null && targetFob > 0) {
    deltaAbs = estimatedFob - targetFob;
    deltaPct = Math.round((deltaAbs / targetFob) * 100);
    const tolerancePct = 3;
    if (Math.abs(deltaPct) <= tolerancePct) deltaBand = 'on_target';
    else if (deltaAbs > 0) deltaBand = 'over';
    else deltaBand = 'under';
  }

  return {
    materialsTotal: materialsTotalAdj,
    trimsTotal: trimsTotalAdj,
    operationsTotal: operationsTotalAdj,
    estimatedFob,
    currency: 'RUB',
    lineCosts,
    targetFob,
    targetMarginPct,
    deltaBand,
    deltaAbs,
    deltaPct,
    erpLanded,
    logisticsStubTotal,
    cmtFromErpTotal,
  };
}

export function bomCostDeltaBadgeLabel(rollup: Workshop2BomCostingRollup): string {
  switch (rollup.deltaBand) {
    case 'on_target':
      return 'В цели';
    case 'over':
      return `Выше цели +${rollup.deltaPct ?? 0}%`;
    case 'under':
      return `Ниже цели ${rollup.deltaPct ?? 0}%`;
    default:
      return 'Цель FOB не задана';
  }
}
