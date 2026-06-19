/**
 * Wave 9–10 RU: ТТН / УПД — JSON шаблон; PDF в workshop2-rf-logistics-pdf.ts (без fake ФНС ACK).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export type Workshop2RfLogisticsDocKind = 'ttn' | 'upd';

export type Workshop2RfLogisticsDocTemplate = {
  kind: Workshop2RfLogisticsDocKind;
  titleRu: string;
  generatedAt: string;
  collectionId: string;
  articleId: string;
  /** Связь с sample movement / shipments mirror */
  linkedMovementId: string | null;
  seller: { name: string; inn: string };
  buyer: { name: string; inn: string };
  lines: Array<{ name: string; qty: number; unit: string; priceRub?: number }>;
  vatRatePct: number;
  totalRub: number;
  noteRu: string;
};

export function buildWorkshop2RfLogisticsDocTemplate(input: {
  kind: Workshop2RfLogisticsDocKind;
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  vatRatePct?: number;
}): Workshop2RfLogisticsDocTemplate {
  const vat = input.vatRatePct ?? 20;
  const linkedMovementId =
    workshop2PgMirrorStr(input.dossier.logisticsShipmentMirror, 'currentStep') || null;

  const matAssignments = (input.dossier.assignments ?? []).filter(
    (a) => a.attributeId === 'mat' || a.values.some((v) => v.displayLabel)
  );
  const lines = matAssignments.slice(0, 8).map((a, idx) => ({
    name: a.values[0]?.displayLabel ?? a.attributeId ?? `line-${idx}`,
    qty: 1,
    unit: 'шт',
    priceRub: input.dossier.passportProductionBrief?.targetFob,
  }));
  if (!lines.length) {
    lines.push({
      name: input.dossier.sku ?? input.articleId,
      qty: 1,
      unit: 'шт',
      priceRub: input.dossier.passportProductionBrief?.targetFob,
    });
  }
  const totalRub = lines.reduce((s, l) => s + (l.priceRub ?? 0) * l.qty, 0);

  const titleRu =
    input.kind === 'ttn'
      ? 'ТТН (товарно-транспортная накладная)'
      : 'УПД (универсальный передаточный документ)';

  return {
    kind: input.kind,
    titleRu,
    generatedAt: new Date().toISOString(),
    collectionId: input.collectionId,
    articleId: input.articleId,
    linkedMovementId,
    seller: { name: 'ООО «Бренд демо»', inn: '7700000000' },
    buyer: { name: 'ООО «Ритейл демо»', inn: '7700000001' },
    lines,
    vatRatePct: vat,
    totalRub,
    noteRu:
      input.kind === 'ttn'
        ? 'Шаблон ТТН для печати/PDF на клиенте — без отправки в ФНС из stub.'
        : 'Шаблон УПД (JSON) — сверьте с ЭДО Контур/СБИС перед подписью.',
  };
}

export function listWorkshop2RfLogisticsDocKinds(): Array<{
  kind: Workshop2RfLogisticsDocKind;
  labelRu: string;
}> {
  return [
    { kind: 'ttn', labelRu: 'ТТН' },
    { kind: 'upd', labelRu: 'УПД' },
  ];
}

export function workshop2RfLogisticsPdfFileName(
  kind: Workshop2RfLogisticsDocKind,
  articleId: string
): string {
  return `workshop2-${kind}-${articleId.replace(/[^\w-]+/g, '_')}.pdf`;
}
