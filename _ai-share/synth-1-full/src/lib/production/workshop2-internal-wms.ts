/**
 * In-platform WMS MVP (client-safe): mirror, gates, dossier persist.
 * PG reserve/sync — workshop2-internal-wms-server.ts
 */
import type { StockSnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { buildWorkshop2StockWmsLedgerFromBundle } from '@/lib/production/workshop2-stock-wms-ledger-persist';

export type Workshop2ProcessEnvLike = Record<string, string | undefined>;

function envTrim(env: Workshop2ProcessEnvLike, key: string): string {
  return String(env[key] ?? '').trim();
}

function isPgConfigured(env: Workshop2ProcessEnvLike): boolean {
  return Boolean(
    envTrim(env, 'WORKSHOP2_DATABASE_URL') ||
    envTrim(env, 'WORKSHOP2_DOSSIER_DATABASE_URL') ||
    envTrim(env, 'DATABASE_URL')
  );
}

/** По умолчанию при PG URL; явно: true/false через WORKSHOP2_INTERNAL_WMS. */
export function isWorkshop2InternalWmsEnabled(env: Workshop2ProcessEnvLike = process.env): boolean {
  const flag = envTrim(env, 'WORKSHOP2_INTERNAL_WMS').toLowerCase();
  if (flag === 'false') return false;
  if (flag === 'true') return true;
  return isPgConfigured(env);
}

export type Workshop2InternalWmsMirror = {
  mirroredAt: string;
  itemCount: number;
  onHandQty: number;
  reservedQty: number;
  movementCount: number;
  reserveDeficitCount: number;
  wmsSyncStatus: 'internal_pg' | 'memory_fallback';
  locationCode: string;
  hintRu?: string;
};

export type Workshop2WmsBalanceView = {
  itemId: string;
  sku: string;
  label: string;
  unit: string;
  locationCode: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
  supplyLineRef?: string;
};

export function buildWorkshop2InternalWmsMirror(input: {
  balances: Workshop2WmsBalanceView[];
  movementCount: number;
  reserveDeficitCount: number;
  pgBacked: boolean;
  locationCode?: string;
}): Workshop2InternalWmsMirror {
  const reservedQty = input.balances.reduce((a, b) => a + b.qtyReserved, 0);
  const onHandQty = input.balances.reduce((a, b) => a + b.qtyOnHand, 0);
  let hintRu: string | undefined;
  if (input.reserveDeficitCount > 0) {
    hintRu = `${input.reserveDeficitCount} поз. с дефицитом под резерв образца — проверьте остатки.`;
  } else if (input.balances.length === 0) {
    hintRu = 'WMS позиции не созданы — синхронизируйте BOM/снабжение.';
  }
  return {
    mirroredAt: new Date().toISOString(),
    itemCount: input.balances.length,
    onHandQty,
    reservedQty,
    movementCount: input.movementCount,
    reserveDeficitCount: input.reserveDeficitCount,
    wmsSyncStatus: input.pgBacked ? 'internal_pg' : 'memory_fallback',
    locationCode: input.locationCode ?? 'WORKSHOP2-WH',
    hintRu,
  };
}

export function persistWorkshop2InternalWmsToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    mirror: Workshop2InternalWmsMirror;
    stock?: StockSnapshot | null;
  }
): Workshop2DossierPhase1 {
  const ledger = buildWorkshop2StockWmsLedgerFromBundle({
    stock: input.stock,
    dossier,
  });
  return {
    ...dossier,
    internalWmsMirror: {
      ...input.mirror,
      ...(dossier.internalWmsMirror?.memoryJournal?.length
        ? { memoryJournal: dossier.internalWmsMirror.memoryJournal }
        : {}),
    },
    stockWmsLedger: {
      ...ledger,
      wmsSyncStatus:
        input.mirror.wmsSyncStatus === 'internal_pg'
          ? 'internal_pg'
          : input.mirror.wmsSyncStatus === 'memory_fallback' &&
              ledger.wmsSyncStatus === 'draft_local'
            ? 'internal_pg'
            : ledger.wmsSyncStatus,
      movementCount: Math.max(ledger.movementCount, input.mirror.movementCount),
      hintRu: input.mirror.hintRu ?? ledger.hintRu,
    },
  };
}

/** Warning handoff: образец / handoff без снимка internal WMS в досье. */
export function evaluateWorkshop2InternalWmsReserveSnapshotHandoffGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  if (!isWorkshop2InternalWmsEnabled()) return null;
  const mirror = input.dossier.internalWmsMirror;
  const handoffStarted = Boolean(input.dossier.factoryHandoffBundleMirror?.mirroredAt);
  if (!handoffStarted) return null;
  if (!mirror?.mirroredAt) {
    return {
      id: 'stock.wms.reserve_snapshot_missing',
      severity: 'warning',
      messageRu:
        'В досье нет снимка internal WMS — выполните «Синхр. WMS» и резерв на Снабжении или создайте заказ образца (auto-reserve).',
    };
  }
  if (mirror.itemCount === 0 && mirror.reservedQty === 0) {
    return {
      id: 'stock.wms.reserve_snapshot_empty',
      severity: 'warning',
      messageRu: 'Internal WMS без позиций/резерва — синхронизируйте BOM → WMS перед handoff.',
    };
  }
  return null;
}

/** Warning: дефицит при резерве под образец (не blocker, не MoySklad). */
export function evaluateWorkshop2StockWmsDeficitReserveGate(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2HandoffReadinessCheck | null {
  const mirror = input.dossier.internalWmsMirror;
  if (!mirror) return null;
  if ((mirror.reserveDeficitCount ?? 0) <= 0) return null;
  return {
    id: 'stock.wms.deficit_reserve',
    severity: 'warning',
    messageRu:
      mirror.hintRu ??
      `Дефицит резерва на ${mirror.reserveDeficitCount} поз. — пополните склад или уточните BOM.`,
  };
}

/** Wave 18 RU: подписи kind internal WMS для stock panel (reserve/release/grn/receipt/issue). */
export const WORKSHOP2_WMS_MOVEMENT_KIND_LABELS_RU: Record<string, string> = {
  reserve: 'Резерв под образец',
  release: 'Снятие резерва',
  receipt: 'Приход (GRN)',
  grn: 'Приход (GRN)',
  issue: 'Списание',
  in: 'Приход',
  out: 'Расход',
  sync: 'Синхронизация WMS',
};

export function labelWorkshop2WmsMovementKindRu(kind: string): string {
  const key = kind.trim().toLowerCase();
  return WORKSHOP2_WMS_MOVEMENT_KIND_LABELS_RU[key] ?? kind;
}

export function labelWorkshop2WmsSyncStatusRu(
  status:
    | 'internal_pg'
    | 'memory_fallback'
    | 'draft_local'
    | 'pending_external'
    | string
    | undefined
): string {
  switch (status) {
    case 'internal_pg':
      return 'внутренний PG';
    case 'memory_fallback':
      return 'симуляция (память)';
    case 'draft_local':
      return 'черновик локально';
    case 'pending_external':
      return 'ожидает внешний WMS';
    default:
      return status ?? '—';
  }
}
