import 'server-only';

import type { SupplySnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2InternalWmsMirror,
  isWorkshop2InternalWmsEnabled,
  type Workshop2WmsBalanceView,
} from '@/lib/production/workshop2-internal-wms';
import { syncWorkshop2SupplyLinesFromDossierBom } from '@/lib/production/workshop2-supply-sync-from-bom';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import {
  hasWorkshop2WmsReleaseForSampleIntake,
  hasWorkshop2WmsReserveForSampleOrder,
  listWorkshop2WmsBalancesForArticle,
  listWorkshop2WmsMovements,
  recordWorkshop2WmsMovement,
  upsertWorkshop2WmsItem,
  type Workshop2WmsBalance,
  type Workshop2WmsMovement,
} from '@/lib/server/workshop2-wms-repository';

function toBalanceView(b: Workshop2WmsBalance): Workshop2WmsBalanceView {
  return {
    itemId: b.itemId,
    sku: b.sku,
    label: b.label,
    unit: b.unit,
    locationCode: b.locationCode,
    qtyOnHand: b.qtyOnHand,
    qtyReserved: b.qtyReserved,
    qtyAvailable: b.qtyAvailable,
    supplyLineRef: b.supplyLineRef,
  };
}

export type Workshop2WmsSyncFromBomResult = {
  itemsSynced: number;
  balances: Workshop2WmsBalance[];
};

export async function syncWorkshop2WmsItemsFromSupplyBom(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  supply?: SupplySnapshot | null;
}): Promise<Workshop2WmsSyncFromBomResult> {
  const synced = syncWorkshop2SupplyLinesFromDossierBom({
    dossier: input.dossier,
    supply: input.supply,
  });
  let itemsSynced = 0;
  for (const line of synced.supply.lines) {
    const sku = line.id.trim() || `line-${line.label.trim().slice(0, 32)}`;
    await upsertWorkshop2WmsItem({
      collectionId: input.collectionId,
      sku,
      label: line.label.trim() || sku,
      unit: line.unit?.trim() || 'ед.',
      materialRef: line.sourceNote?.trim() || undefined,
    });
    itemsSynced += 1;
  }
  const balances = await listWorkshop2WmsBalancesForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  return { itemsSynced, balances };
}

export type Workshop2WmsReserveSampleResult = {
  ok: boolean;
  reservedLines: number;
  deficitLineCount: number;
  movements: Workshop2WmsMovement[];
  balances: Workshop2WmsBalance[];
  mirror: ReturnType<typeof buildWorkshop2InternalWmsMirror>;
  reason?: string;
};

export async function reserveWorkshop2WmsForSampleOrder(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  supply?: SupplySnapshot | null;
  actor?: string;
  sampleOrderId?: string;
}): Promise<Workshop2WmsReserveSampleResult> {
  if (!isWorkshop2InternalWmsEnabled()) {
    return {
      ok: false,
      reservedLines: 0,
      deficitLineCount: 0,
      movements: [],
      balances: [],
      mirror: buildWorkshop2InternalWmsMirror({
        balances: [],
        movementCount: 0,
        reserveDeficitCount: 0,
        pgBacked: false,
      }),
      reason: 'internal_wms_disabled',
    };
  }

  const sampleOrderId = input.sampleOrderId?.trim();
  if (sampleOrderId) {
    const already = await hasWorkshop2WmsReserveForSampleOrder({
      collectionId: input.collectionId,
      articleId: input.articleId,
      sampleOrderId,
    });
    if (already) {
      const balances = await listWorkshop2WmsBalancesForArticle({
        collectionId: input.collectionId,
        articleId: input.articleId,
      });
      const allMovements = await listWorkshop2WmsMovements({
        collectionId: input.collectionId,
        articleId: input.articleId,
      });
      const mirror = buildWorkshop2InternalWmsMirror({
        balances: balances.map(toBalanceView),
        movementCount: allMovements.length,
        reserveDeficitCount: input.dossier.internalWmsMirror?.reserveDeficitCount ?? 0,
        pgBacked: isWorkshop2PostgresEnabled(),
      });
      return {
        ok: true,
        reservedLines: 0,
        deficitLineCount: mirror.reserveDeficitCount,
        movements: [],
        balances,
        mirror,
        reason: 'idempotent_reserve_skip',
      };
    }
  }

  const supplySynced = syncWorkshop2SupplyLinesFromDossierBom({
    dossier: input.dossier,
    supply: input.supply,
  });

  await syncWorkshop2WmsItemsFromSupplyBom({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    supply: supplySynced.supply,
  });

  const supplyLines = supplySynced.supply.lines;

  const movements: Workshop2WmsMovement[] = [];
  let deficitLineCount = 0;
  let reservedLines = 0;

  for (const line of supplyLines) {
    const qty = Math.max(1, Number(line.qty) || 1);
    const sku = line.id.trim();
    const item = await upsertWorkshop2WmsItem({
      collectionId: input.collectionId,
      sku,
      label: line.label,
      unit: line.unit,
    });

    const balancesBefore = await listWorkshop2WmsBalancesForArticle({
      collectionId: input.collectionId,
      articleId: input.articleId,
    });
    const bal = balancesBefore.find((b) => b.itemId === item.id || b.sku === sku);
    const available = bal?.qtyAvailable ?? 0;
    if (qty > available) deficitLineCount += 1;

    const { movement } = await recordWorkshop2WmsMovement({
      collectionId: input.collectionId,
      articleId: input.articleId,
      kind: 'reserve',
      qty,
      itemId: item.id,
      supplyLineRef: line.id,
      bomLineRef: line.sourceNote,
      actor: input.actor,
      note: input.sampleOrderId ? `sample-order:${input.sampleOrderId}` : 'sample-order-reserve',
    });
    movements.push(movement);
    reservedLines += 1;
  }

  const balances = await listWorkshop2WmsBalancesForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const allMovements = await listWorkshop2WmsMovements({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });

  const mirror = buildWorkshop2InternalWmsMirror({
    balances: balances.map(toBalanceView),
    movementCount: allMovements.length,
    reserveDeficitCount: deficitLineCount,
    pgBacked: isWorkshop2PostgresEnabled(),
  });

  return {
    ok: reservedLines > 0 || supplyLines.length === 0,
    reservedLines,
    deficitLineCount,
    movements,
    balances,
    mirror,
  };
}

export type Workshop2WmsReleaseOnIntakeResult = {
  ok: boolean;
  releasedLines: number;
  movements: Workshop2WmsMovement[];
  mirror: ReturnType<typeof buildWorkshop2InternalWmsMirror>;
};

export async function releaseWorkshop2WmsOnMovementReceived(input: {
  collectionId: string;
  articleId: string;
  actor?: string;
  sampleOrderId?: string;
}): Promise<Workshop2WmsReleaseOnIntakeResult> {
  if (!isWorkshop2InternalWmsEnabled()) {
    return {
      ok: false,
      releasedLines: 0,
      movements: [],
      mirror: buildWorkshop2InternalWmsMirror({
        balances: [],
        movementCount: 0,
        reserveDeficitCount: 0,
        pgBacked: false,
      }),
    };
  }

  const sampleOrderId = input.sampleOrderId?.trim();
  if (sampleOrderId) {
    const already = await hasWorkshop2WmsReleaseForSampleIntake({
      collectionId: input.collectionId,
      articleId: input.articleId,
      sampleOrderId,
    });
    if (already) {
      const balancesAfter = await listWorkshop2WmsBalancesForArticle({
        collectionId: input.collectionId,
        articleId: input.articleId,
      });
      const allMovements = await listWorkshop2WmsMovements({
        collectionId: input.collectionId,
        articleId: input.articleId,
      });
      return {
        ok: true,
        releasedLines: 0,
        movements: [],
        mirror: buildWorkshop2InternalWmsMirror({
          balances: balancesAfter.map(toBalanceView),
          movementCount: allMovements.length,
          reserveDeficitCount: 0,
          pgBacked: isWorkshop2PostgresEnabled(),
        }),
      };
    }
  }

  const balances = await listWorkshop2WmsBalancesForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });

  const movements: Workshop2WmsMovement[] = [];
  let releasedLines = 0;

  for (const bal of balances) {
    if (bal.qtyReserved <= 0) continue;
    const { movement } = await recordWorkshop2WmsMovement({
      collectionId: input.collectionId,
      articleId: input.articleId,
      kind: 'release',
      qty: bal.qtyReserved,
      itemId: bal.itemId,
      actor: input.actor,
      note: input.sampleOrderId ? `intake-release:${input.sampleOrderId}` : 'sample-intake-release',
    });
    movements.push(movement);
    releasedLines += 1;
  }

  const allMovements = await listWorkshop2WmsMovements({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const balancesAfter = await listWorkshop2WmsBalancesForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });

  return {
    ok: releasedLines > 0,
    releasedLines,
    movements,
    mirror: buildWorkshop2InternalWmsMirror({
      balances: balancesAfter.map(toBalanceView),
      movementCount: allMovements.length,
      reserveDeficitCount: 0,
      pgBacked: isWorkshop2PostgresEnabled(),
    }),
  };
}

/** GRN-lite: приход по строке снабжения (receipt) после получения PO. */
export type Workshop2WmsGrnReceiptResult = {
  ok: boolean;
  movement?: Workshop2WmsMovement;
  balance?: Workshop2WmsBalance;
  mirror: ReturnType<typeof buildWorkshop2InternalWmsMirror>;
  messageRu?: string;
};

export async function recordWorkshop2WmsGrnReceiptForSupplyLine(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  supplyLineId: string;
  qty: number;
  supply?: SupplySnapshot | null;
  actor?: string;
  poLineRef?: string;
}): Promise<Workshop2WmsGrnReceiptResult> {
  if (!isWorkshop2InternalWmsEnabled()) {
    return {
      ok: false,
      messageRu: 'Internal WMS недоступен.',
      mirror: buildWorkshop2InternalWmsMirror({
        balances: [],
        movementCount: 0,
        reserveDeficitCount: 0,
        pgBacked: false,
      }),
    };
  }

  const lineId = input.supplyLineId.trim();
  const qty = Math.max(0, Number(input.qty) || 0);
  if (!lineId || qty <= 0) {
    return {
      ok: false,
      messageRu: 'Укажите строку снабжения и количество > 0.',
      mirror: buildWorkshop2InternalWmsMirror({
        balances: [],
        movementCount: 0,
        reserveDeficitCount: 0,
        pgBacked: isWorkshop2PostgresEnabled(),
      }),
    };
  }

  const supplySynced = syncWorkshop2SupplyLinesFromDossierBom({
    dossier: input.dossier,
    supply: input.supply,
  });
  await syncWorkshop2WmsItemsFromSupplyBom({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    supply: supplySynced.supply,
  });

  const line = supplySynced.supply.lines.find((l) => l.id === lineId);
  const item = await upsertWorkshop2WmsItem({
    collectionId: input.collectionId,
    sku: lineId,
    label: line?.label?.trim() || lineId,
    unit: line?.unit?.trim() || 'ед.',
    materialRef: line?.sourceNote?.trim() || undefined,
  });

  const { movement, balance } = await recordWorkshop2WmsMovement({
    collectionId: input.collectionId,
    articleId: input.articleId,
    kind: 'receipt',
    qty,
    itemId: item.id,
    supplyLineRef: lineId,
    actor: input.actor,
    note: input.poLineRef ? `grn-po:${input.poLineRef}` : `grn-supply:${lineId}`,
  });

  const balances = await listWorkshop2WmsBalancesForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const allMovements = await listWorkshop2WmsMovements({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });

  return {
    ok: true,
    movement,
    balance,
    mirror: buildWorkshop2InternalWmsMirror({
      balances: balances.map(toBalanceView),
      movementCount: allMovements.length,
      reserveDeficitCount: input.dossier.internalWmsMirror?.reserveDeficitCount ?? 0,
      pgBacked: isWorkshop2PostgresEnabled(),
    }),
  };
}
