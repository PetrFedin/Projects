import 'server-only';

import { randomUUID } from 'node:crypto';
import {
  decodeWorkshop2LogisticsMeta,
  mergeWorkshop2LogisticsJournalMeta,
  WORKSHOP2_LOGISTICS_META_STEP_ID,
  type Workshop2LogisticsActorRole,
  type Workshop2LogisticsShipmentMeta,
} from '@/lib/production/workshop2-logistics-flow';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2LogisticsSyncSource = 'manual' | 'tms' | 'partner_portal';

export type Workshop2LogisticsJournalEntry = {
  stepId: string;
  title: string;
  desc?: string;
  at: string;
  actorRole?: Workshop2LogisticsActorRole;
  actorName?: string;
  reason?: string;
  syncSource?: Workshop2LogisticsSyncSource;
  originAddress?: string;
  destinationAddress?: string;
  contactName?: string;
  contactPhone?: string;
  companyName?: string;
  attachmentNote?: string;
};

export type Workshop2LogisticsShipment = {
  id: string;
  collectionId: string;
  articleId: string;
  sampleOrderId?: string;
  trackingNumber?: string;
  carrier?: string;
  originLabel?: string;
  destinationLabel?: string;
  currentStep: string;
  status: 'draft' | 'in_transit' | 'delivered' | 'cancelled';
  journal: Workshop2LogisticsJournalEntry[];
  createdAt: string;
  updatedAt: string;
};

const memoryShipments = new Map<string, Workshop2LogisticsShipment[]>();

const DEFAULT_JOURNAL: Workshop2LogisticsJournalEntry[] = [
  {
    stepId: 'factory',
    title: 'Заказ в производстве',
    desc: 'Фабрика',
    at: new Date().toISOString(),
  },
];

function mapPgRow(r: {
  id: string;
  collection_id: string;
  article_id: string;
  sample_order_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  origin_label: string | null;
  destination_label: string | null;
  current_step: string;
  status: string;
  journal: Workshop2LogisticsJournalEntry[];
  created_at: Date;
  updated_at: Date;
}): Workshop2LogisticsShipment {
  return {
    id: r.id,
    collectionId: r.collection_id,
    articleId: r.article_id,
    sampleOrderId: r.sample_order_id ?? undefined,
    trackingNumber: r.tracking_number ?? undefined,
    carrier: r.carrier ?? undefined,
    originLabel: r.origin_label ?? undefined,
    destinationLabel: r.destination_label ?? undefined,
    currentStep: r.current_step,
    status: r.status as Workshop2LogisticsShipment['status'],
    journal: Array.isArray(r.journal) ? r.journal : [],
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
  };
}

export async function listWorkshop2LogisticsShipments(input: {
  collectionId: string;
  articleId: string;
}): Promise<Workshop2LogisticsShipment[]> {
  if (!isWorkshop2PostgresEnabled()) {
    return memoryShipments.get(`${input.collectionId}::${input.articleId}`) ?? [];
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `SELECT * FROM workshop2_logistics_shipments
     WHERE collection_id = $1 AND article_id = $2
     ORDER BY updated_at DESC`,
    [input.collectionId, input.articleId]
  );
  return res.rows.map((r) => mapPgRow(r as Parameters<typeof mapPgRow>[0]));
}

export async function upsertWorkshop2LogisticsShipment(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId?: string;
  trackingNumber?: string;
  carrier?: string;
  originLabel?: string;
  destinationLabel?: string;
  currentStep?: string;
  status?: Workshop2LogisticsShipment['status'];
  /** Комментарий к смене этапа или сохранению реквизитов */
  reason?: string;
  actorRole?: Workshop2LogisticsActorRole;
  actorName?: string;
  syncSource?: Workshop2LogisticsSyncSource;
  meta?: Workshop2LogisticsShipmentMeta;
}): Promise<Workshop2LogisticsShipment | { error: 'sample_order_id_required' }> {
  if (!input.sampleOrderId?.trim()) {
    return { error: 'sample_order_id_required' };
  }

  const now = new Date().toISOString();
  const sampleOrderId = input.sampleOrderId.trim();
  const actorRole = input.actorRole ?? 'brand_logist';
  const syncSource = input.syncSource ?? 'manual';
  const buildJournalEntry = (
    stepId: string,
    title: string,
    desc?: string
  ): Workshop2LogisticsJournalEntry => ({
    stepId,
    title,
    desc,
    at: now,
    actorRole,
    actorName: input.actorName,
    reason: input.reason,
    syncSource,
    originAddress: input.originLabel,
    destinationAddress: input.destinationLabel,
    companyName: input.carrier,
  });

  const shipment: Workshop2LogisticsShipment = {
    id: randomUUID(),
    collectionId: input.collectionId,
    articleId: input.articleId,
    sampleOrderId,
    trackingNumber:
      input.trackingNumber ?? `GFL-${Date.now().toString(36).slice(-6).toUpperCase()}`,
    carrier: input.carrier ?? 'Global Freight Logistics',
    originLabel: input.originLabel ?? 'Бишкек, КР',
    destinationLabel: input.destinationLabel ?? 'Москва, РФ',
    currentStep: input.currentStep ?? 'transit',
    status: input.status ?? 'in_transit',
    journal: mergeWorkshop2LogisticsJournalMeta(
      [
        ...DEFAULT_JOURNAL,
        buildJournalEntry(
          input.currentStep ?? 'transit',
          'Отгрузка зарегистрирована',
          input.reason?.trim() || `Заказ образца ${sampleOrderId}`
        ),
      ],
      input.meta ?? {}
    ),
    createdAt: now,
    updatedAt: now,
  };

  if (!isWorkshop2PostgresEnabled()) {
    const key = `${input.collectionId}::${input.articleId}`;
    const list = memoryShipments.get(key) ?? [];
    const existing = list.find((s) => s.sampleOrderId === sampleOrderId);
    if (existing) {
      const stepId = input.currentStep ?? existing.currentStep;
      const prevMeta = decodeWorkshop2LogisticsMeta(existing.journal);
      const nextMeta = { ...prevMeta, ...(input.meta ?? {}) };
      const stepChanged = Boolean(input.currentStep && input.currentStep !== existing.currentStep);
      const detailsChanged =
        Boolean(input.trackingNumber && input.trackingNumber !== existing.trackingNumber) ||
        Boolean(input.carrier && input.carrier !== existing.carrier) ||
        Boolean(input.originLabel && input.originLabel !== existing.originLabel) ||
        Boolean(input.destinationLabel && input.destinationLabel !== existing.destinationLabel) ||
        Boolean(input.meta);

      const journalAppend: Workshop2LogisticsJournalEntry[] = [];
      if (stepChanged) {
        journalAppend.push(
          buildJournalEntry(
            stepId,
            `Этап: ${stepId}`,
            input.reason?.trim() || existing.trackingNumber
          )
        );
      } else if (detailsChanged) {
        journalAppend.push(
          buildJournalEntry(
            existing.currentStep,
            'Реквизиты обновлены',
            input.reason?.trim() || 'Сохранение карточки отгрузки'
          )
        );
      }

      const baseJournal = existing.journal.filter(
        (e) => e.stepId !== WORKSHOP2_LOGISTICS_META_STEP_ID
      );
      Object.assign(existing, {
        ...shipment,
        id: existing.id,
        createdAt: existing.createdAt,
        trackingNumber: input.trackingNumber ?? existing.trackingNumber,
        carrier: input.carrier ?? existing.carrier,
        originLabel: input.originLabel ?? existing.originLabel,
        destinationLabel: input.destinationLabel ?? existing.destinationLabel,
        status: input.status ?? existing.status,
        journal: mergeWorkshop2LogisticsJournalMeta([...baseJournal, ...journalAppend], nextMeta),
        currentStep: stepId,
        updatedAt: now,
      });
      return existing;
    }
    list.unshift(shipment);
    memoryShipments.set(key, list);
    return shipment;
  }

  await ensureWorkshop2PgSchema();
  if (input.sampleOrderId) {
    const found = await getWorkshop2PgPool().query(
      `SELECT id, journal, current_step, tracking_number FROM workshop2_logistics_shipments
       WHERE collection_id = $1 AND article_id = $2 AND sample_order_id = $3 LIMIT 1`,
      [input.collectionId, input.articleId, sampleOrderId]
    );
    if (found.rows[0]) {
      const row = found.rows[0] as {
        id: string;
        journal: Workshop2LogisticsJournalEntry[];
        current_step: string;
        tracking_number: string | null;
      };
      shipment.id = row.id;
      const prevStep = row.current_step;
      const nextStep = input.currentStep ?? prevStep;
      const prevJournal = Array.isArray(row.journal) ? row.journal : [];
      const prevMeta = decodeWorkshop2LogisticsMeta(prevJournal);
      const nextMeta = { ...prevMeta, ...(input.meta ?? {}) };
      const baseJournal = prevJournal.filter((e) => e.stepId !== WORKSHOP2_LOGISTICS_META_STEP_ID);
      const stepChanged = Boolean(input.currentStep && input.currentStep !== prevStep);
      const detailsChanged =
        Boolean(input.trackingNumber) ||
        Boolean(input.carrier) ||
        Boolean(input.originLabel) ||
        Boolean(input.destinationLabel) ||
        Boolean(input.meta);

      const journalAppend: Workshop2LogisticsJournalEntry[] = [];
      if (stepChanged) {
        journalAppend.push(
          buildJournalEntry(
            nextStep,
            `Этап: ${nextStep}`,
            input.reason?.trim() || row.tracking_number || undefined
          )
        );
        shipment.currentStep = nextStep;
      } else if (detailsChanged) {
        journalAppend.push(
          buildJournalEntry(
            prevStep,
            'Реквизиты обновлены',
            input.reason?.trim() || 'Сохранение карточки отгрузки'
          )
        );
      }

      shipment.journal = mergeWorkshop2LogisticsJournalMeta(
        [...baseJournal, ...journalAppend],
        nextMeta
      );
      if (!stepChanged) {
        shipment.currentStep = prevStep;
      }
    }
  }

  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_logistics_shipments
      (id, collection_id, article_id, sample_order_id, tracking_number, carrier,
       origin_label, destination_label, current_step, status, journal, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::timestamptz, $12::timestamptz)
     ON CONFLICT (id) DO UPDATE SET
       tracking_number = EXCLUDED.tracking_number,
       carrier = EXCLUDED.carrier,
       current_step = EXCLUDED.current_step,
       status = EXCLUDED.status,
       journal = EXCLUDED.journal,
       updated_at = NOW()`,
    [
      shipment.id,
      shipment.collectionId,
      shipment.articleId,
      shipment.sampleOrderId ?? null,
      shipment.trackingNumber ?? null,
      shipment.carrier ?? null,
      shipment.originLabel ?? null,
      shipment.destinationLabel ?? null,
      shipment.currentStep,
      shipment.status,
      JSON.stringify(shipment.journal),
      shipment.createdAt,
    ]
  );
  return shipment;
}

/** Ключи `collectionId::articleId` с отгрузкой in_transit (badge хаба). */
export async function listWorkshop2LogisticsInTransitArticleKeys(): Promise<string[]> {
  if (!isWorkshop2PostgresEnabled()) {
    const keys: string[] = [];
    for (const [key, list] of memoryShipments) {
      if (list.some((s) => s.status === 'in_transit')) keys.push(key);
    }
    return keys;
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    collection_id: string;
    article_id: string;
  }>(
    `SELECT DISTINCT collection_id, article_id FROM workshop2_logistics_shipments
     WHERE status = 'in_transit'`
  );
  return res.rows.map((r) => `${r.collection_id}::${r.article_id}`);
}

export function clearWorkshop2LogisticsMemoryForTests(): void {
  memoryShipments.clear();
}

/** Отгрузка, привязанная к B2B/sample order id (для cross-role tracking). */
export async function findWorkshop2LogisticsShipmentBySampleOrderId(
  sampleOrderId: string
): Promise<Workshop2LogisticsShipment | null> {
  const id = sampleOrderId.trim();
  if (!id) return null;

  if (!isWorkshop2PostgresEnabled()) {
    for (const list of memoryShipments.values()) {
      const hit = list.find((s) => s.sampleOrderId?.trim() === id);
      if (hit) return hit;
    }
    return null;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `SELECT * FROM workshop2_logistics_shipments
     WHERE sample_order_id = $1
     ORDER BY updated_at DESC
     LIMIT 1`,
    [id]
  );
  const row = res.rows[0];
  return row ? mapPgRow(row as Parameters<typeof mapPgRow>[0]) : null;
}
