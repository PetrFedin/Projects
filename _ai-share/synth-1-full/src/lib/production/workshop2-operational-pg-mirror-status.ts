/**
 * Wave E: единый chip «PG mirror» для operational panels — реальный статус, не amber-success.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2OperationalPgMirrorTone = 'emerald' | 'amber' | 'slate' | 'rose';

export type Workshop2OperationalPgMirrorChip = {
  label: string;
  tone: Workshop2OperationalPgMirrorTone;
  title?: string;
};

function toneFromSynced(
  synced: boolean,
  drift?: boolean,
  offline?: boolean
): Workshop2OperationalPgMirrorTone {
  if (offline) return 'rose';
  if (drift) return 'amber';
  return synced ? 'emerald' : 'slate';
}

/** Hub onboarding mirror (#4). */
export function summarizeWorkshop2HubOnboardingPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.hubOnboardingMirror;
  if (!mirror) {
    return {
      label: 'Онбординг: не в PG',
      tone: 'slate',
      title: 'Откройте workspace после онбординга для PUT hub_onboarding_mirror.',
    };
  }
  if (mirror.driftDetected) {
    return {
      label: 'Онбординг: drift local↔PG',
      tone: 'amber',
      title: mirror.hintRu,
    };
  }
  if (mirror.pgPrimary && mirror.done) {
    return {
      label: 'Онбординг: PG',
      tone: 'emerald',
      title: mirror.hintRu,
    };
  }
  return {
    label: mirror.source === 'browser_storage' ? 'Онбординг: LS cache' : 'Онбординг: pending PG',
    tone: 'amber',
    title: mirror.hintRu ?? 'Завершите онбординг и сохраните mirror в PG.',
  };
}

/** Inspector report mirror (#68). */
export function summarizeWorkshop2InspectorPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.inspectorReportMirror;
  if (!mirror) {
    return {
      label: 'Инспектор: не в PG',
      tone: 'slate',
      title: 'Сохраните отчёт инспектора (PWA или кнопка в workspace).',
    };
  }
  if (mirror.offlineOnly || !mirror.pgSynced) {
    return {
      label: 'Инспектор: offline/queue',
      tone: 'rose',
      title: mirror.hintRu,
    };
  }
  return {
    label: `Инспектор: PG · ${mirror.checkedCount}/${mirror.totalItems}`,
    tone: toneFromSynced(true),
    title: mirror.hintRu,
  };
}

/** Factory ERP sync + staging journal (#66). */
export function summarizeWorkshop2FactoryErpPgMirror(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
  syncStatus?: string;
  erpOrderId?: string | null;
}): Workshop2OperationalPgMirrorChip {
  const staging = input.dossier?.factoryErpStagingMirror;
  const sync = input.dossier?.factoryErpSync;
  const erpId = input.erpOrderId ?? sync?.erpOrderId;

  if (erpId?.trim()) {
    return {
      label: `ERP: ${erpId.trim()}`,
      tone: 'emerald',
      title: sync?.hintRu ?? 'erpOrderId подтверждён в PG (live POST или manual ack).',
    };
  }

  if (staging?.partnerAckRecorded && staging.partnerAckId) {
    return {
      label: `ERP staging: ${staging.partnerAckId}`,
      tone: 'amber',
      title: staging.hintRu ?? 'Staging contract ACK — prod live POST отдельно.',
    };
  }

  if (input.syncStatus === 'not_configured' || (!staging && !sync)) {
    return {
      label: 'ERP: не настроен',
      tone: 'slate',
      title:
        'WORKSHOP2_FACTORY_ERP_BASE_URL не задан — live POST /purchase-orders недоступен (fail-closed, без fake ACK).',
    };
  }

  if (input.syncStatus === 'error') {
    return {
      label: 'ERP: error',
      tone: 'rose',
      title: sync?.lastError ?? sync?.hintRu ?? 'POST /purchase-orders без erpOrderId.',
    };
  }

  return {
    label: 'ERP: configured (no ACK)',
    tone: 'amber',
    title: 'URL задан — erpOrderId только после POST /purchase-orders.',
  };
}

/** AQL qcAqlMirror (#69). */
export function summarizeWorkshop2AqlPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.qcAqlMirror;
  if (!mirror?.recordedAt) {
    return {
      label: 'AQL: не в PG',
      tone: 'slate',
      title: 'Сохраните расчёт AQL — «AQL → PG» на вкладке ОТК.',
    };
  }
  if (mirror.isFail) {
    return {
      label: 'AQL: брак в PG',
      tone: 'rose',
      title: mirror.hintRu ?? 'AQL fail — sample/handoff gates заблокированы.',
    };
  }
  return {
    label: `AQL: PG · n=${mirror.sampleSize}`,
    tone: 'emerald',
    title: mirror.hintRu ?? `Запись ${mirror.recordedAt} · qty ${mirror.orderQty}.`,
  };
}

/** Grading apply mirror (#39). */
export function summarizeWorkshop2GradingApplyPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.gradingApplyMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'Градация: не в PG',
      tone: 'slate',
      title: '«Градация → PG» после apply smart grading.',
    };
  }
  if (mirror.blockerExport || mirror.state === 'partial') {
    return {
      label: `Градация: ${mirror.state}`,
      tone: 'amber',
      title: mirror.hintRu ?? 'Градация частична — export/handoff gates.',
    };
  }
  if (mirror.state === 'empty') {
    return {
      label: 'Градация: пусто',
      tone: 'slate',
      title: mirror.hintRu ?? 'Нет правил градации в mirror.',
    };
  }
  return {
    label: `Градация: PG · ${mirror.ruleCount}×${mirror.sizeCount}`,
    tone: 'emerald',
    title: mirror.hintRu ?? `Apply ${mirror.lastAppliedAt ?? mirror.mirroredAt}.`,
  };
}

/** BOM nodes mirror (#36). */
export function summarizeWorkshop2BomNodesPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.bomNodesMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'BOM: не в PG',
      tone: 'slate',
      title: '«BOM → PG» после синхронизации mat → BOM.',
    };
  }
  if (mirror.blockerSampleOrder || mirror.state !== 'ready') {
    return {
      label: `BOM: ${mirror.state}`,
      tone: mirror.state === 'empty' ? 'slate' : 'amber',
      title:
        mirror.hintRu ??
        `Узлов ${mirror.nodeCount} · мат. ${mirror.materialLineCount} — дозаполните BOM.`,
    };
  }
  return {
    label: `BOM: PG · ${mirror.nodeCount}/${mirror.materialLineCount}`,
    tone: 'emerald',
    title: mirror.hintRu ?? `FOB ~${mirror.estimatedFob?.toFixed(2) ?? '—'}.`,
  };
}

/** Change requests mirror (#28). */
export function summarizeWorkshop2ChangeRequestPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.changeRequestMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'CR: не в PG',
      tone: 'slate',
      title: '«CR → PG» — mirror для sample-order gate.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      label: `CR: pending ${mirror.pendingCount}`,
      tone: 'rose',
      title: mirror.hintRu ?? 'Открытые CR блокируют sample-order.',
    };
  }
  return {
    label: mirror.totalRequests > 0 ? `CR: PG · ${mirror.totalRequests}` : 'CR: PG · 0',
    tone: 'emerald',
    title: mirror.hintRu ?? 'Все CR закрыты.',
  };
}

/** Stock WMS ledger + internal reserve mirror (#71). */
export function summarizeWorkshop2StockWmsPgMirror(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
  wmsFailClosed?: boolean;
}): Workshop2OperationalPgMirrorChip {
  const internal = input.dossier?.internalWmsMirror;
  const ledger = input.dossier?.stockWmsLedger;

  if (input.wmsFailClosed) {
    return {
      label: 'WMS: fail-closed',
      tone: 'rose',
      title: 'Internal WMS API недоступен — 503 без fake reserve.',
    };
  }

  if (internal?.mirroredAt) {
    const deficit = internal.reserveDeficitCount ?? 0;
    return {
      label: deficit > 0 ? `WMS: дефицит ${deficit}` : `WMS: резерв ${internal.reservedQty ?? 0}`,
      tone: deficit > 0 ? 'amber' : 'emerald',
      title:
        internal.hintRu ?? `Позиций ${internal.itemCount} · on-hand ${internal.onHandQty ?? '—'}.`,
    };
  }

  if (ledger?.ledgerAt) {
    return {
      label: ledger.negativeBalance ? 'WMS: ledger −' : 'WMS: ledger draft',
      tone: ledger.negativeBalance
        ? 'rose'
        : ledger.wmsSyncStatus === 'internal_pg'
          ? 'emerald'
          : 'amber',
      title: ledger.hintRu ?? `Движений ${ledger.movementCount} · остаток ${ledger.qtyOnHand}.`,
    };
  }

  return {
    label: 'WMS: не в PG',
    tone: 'slate',
    title: '«WMS ledger → PG» или резерв под образец на Снабжении.',
  };
}

/** Supplier QC scorecard mirror (#70, Wave V). */
export function summarizeWorkshop2SupplierQcPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const snap = dossier?.supplierQcSnapshot;
  if (!snap?.snapshotAt) {
    return {
      label: 'Scorecard: не в PG',
      tone: 'slate',
      title: 'Снимок PO scorecard не записан — «Сохранить в досье» на панели ОТК.',
    };
  }
  if (snap.passRate != null && snap.passRate < 85) {
    return {
      label: `Scorecard: ${snap.passRate.toFixed(0)}% pass`,
      tone: 'amber',
      title: snap.hintRu ?? 'Pass rate ниже порога handoff — проверьте PO.',
    };
  }
  return {
    label: `Scorecard: PG · ${snap.passRate?.toFixed(0) ?? '—'}%`,
    tone: 'emerald',
    title:
      snap.hintRu ??
      `Партий ${snap.totalBatches ?? 0} · source ${snap.source ?? 'purchase_orders'}.`,
  };
}

/** TZ general — InfoPick matrix mirror (Wave V dossier section honesty). */
export function summarizeWorkshop2TzGeneralPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.infopickMatrixMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'InfoPick: не в PG',
      tone: 'slate',
      title: 'Матрица InfoPick — сохраните mirror в досье с вкладки «Паспорт».',
    };
  }
  const gaps = mirror.missingCount ?? mirror.missingMatrixCount ?? 0;
  return {
    label: gaps ? `InfoPick: PG · ${gaps} gap` : 'InfoPick: PG',
    tone: gaps ? 'amber' : 'emerald',
    title: mirror.hintRu,
  };
}

/** TZ construction — CAD vault mirror (Wave V). */
export function summarizeWorkshop2TzConstructionPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.cadVaultLinkMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'CAD: не в PG',
      tone: 'slate',
      title: 'cadVaultLinkMirror отсутствует — загрузите CAD и сохраните mirror.',
    };
  }
  if (!mirror.vaultReady || mirror.proprietaryDemoOnly) {
    return {
      label: mirror.proprietaryDemoOnly ? 'CAD: demo only' : 'CAD: partial',
      tone: 'amber',
      title: mirror.hintRu ?? 'Production .glb ingest не завершён.',
    };
  }
  return {
    label: mirror.vaultCadCount ? `CAD: PG · ${mirror.vaultCadCount} doc` : 'CAD: PG',
    tone: 'emerald',
    title: mirror.hintRu,
  };
}

/** TZ assignment — factory handoff bundle mirror (Wave V). */
export function summarizeWorkshop2TzAssignmentPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.factoryHandoffBundleMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'Handoff: не в PG',
      tone: 'slate',
      title: 'factoryHandoffBundleMirror — commit gate + «Сохранить в досье» на вкладке «Задание».',
    };
  }
  if (mirror.bundleState === 'draft' || mirror.pendingAckCount > 0) {
    return {
      label: 'Handoff: partial PG',
      tone: 'amber',
      title: mirror.hintRu ?? 'Пакет передачи неполный — проверьте gate checks.',
    };
  }
  return {
    label: 'Handoff: PG',
    tone: 'emerald',
    title: mirror.hintRu,
  };
}

/** T&A plan mirror — обёртка над taMilestonesMirror (Wave V TZ section). */
export function summarizeWorkshop2TzTimeAndActionPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.taMilestonesMirror;
  if (!mirror?.mirroredAt) {
    return {
      label: 'T&A: не в PG',
      tone: 'slate',
      title: 'taMilestonesMirror — сохраните milestones на вкладке «План заказа».',
    };
  }
  return {
    label: `T&A: PG · ${mirror.milestoneCount ?? 0} вех`,
    tone: 'emerald',
    title: mirror.hintRu,
  };
}

/** Matchmaker mirror (#28 wave). */
export function summarizeWorkshop2MatchmakerPgMirror(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2OperationalPgMirrorChip {
  const mirror = dossier?.matchmakerMirror;
  const hasResult = Boolean(dossier?.matchmakerResult?.syncedAt);
  if (!hasResult) {
    return {
      label: 'Matchmaker: не запускали',
      tone: 'slate',
      title: 'Подбор подрядчика ещё не выполнялся.',
    };
  }
  if (!mirror?.mirroredAt) {
    return {
      label: 'Matchmaker: не в PG',
      tone: 'amber',
      title: 'Результат в досье · mirror не записан — «Matchmaker → PG».',
    };
  }
  return {
    label: mirror.recommendedContractorId
      ? `Matchmaker: PG · ${mirror.recommendedContractorId}`
      : 'Matchmaker: PG',
    tone: 'emerald',
    title: dossier?.matchmakerResult?.syncedAt
      ? `Sync ${dossier.matchmakerResult.syncedAt}`
      : undefined,
  };
}
