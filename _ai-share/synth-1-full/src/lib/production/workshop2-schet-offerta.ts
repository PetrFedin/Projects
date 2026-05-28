/**
 * Wave 10 RU: счёт-оферта (JSON для client PDF / печать) — без fake банковского ACK.
 */
import {
  calcWorkshop2VatOnNetRub,
  formatWorkshop2RubCurrency,
} from '@/lib/production/workshop2-rub-currency';
import { resolveWorkshop2B2bVatRate } from '@/lib/production/workshop2-b2b-checkout-rub';

export type Workshop2SchetOffertaPayload = {
  schemaVersion: 1;
  documentType: 'schet-offerta';
  orderId: string;
  generatedAt: string;
  seller: { name: string; inn: string; addressRu: string };
  buyer: { name: string; inn: string };
  lines: Array<{
    name: string;
    qty: number;
    unit: string;
    priceRub: number;
    sumRub: number;
    lineNote?: string;
  }>;
  vatRatePct: number;
  subtotalRub: number;
  vatRub: number;
  totalRub: number;
  totalFormattedRu: string;
  legalNoteRu: string;
};

export function buildWorkshop2SchetOffertaPayload(input: {
  orderId: string;
  buyerName?: string;
  buyerInn?: string;
  lines: Array<{ name: string; qty: number; unit?: string; priceRub: number; lineNote?: string }>;
  env?: Record<string, string | undefined>;
}): Workshop2SchetOffertaPayload {
  const env = input.env ?? process.env;
  const vatRatePct = resolveWorkshop2B2bVatRate(env);
  const mapped = input.lines.map((l) => {
    const sumRub = Math.round(l.qty * l.priceRub);
    const noteSuffix = l.lineNote?.trim() ? ` (${l.lineNote.trim()})` : '';
    return {
      name: `${l.name}${noteSuffix}`,
      qty: l.qty,
      unit: l.unit ?? 'шт',
      priceRub: l.priceRub,
      sumRub,
      lineNote: l.lineNote?.trim() || undefined,
    };
  });
  const subtotalRub = mapped.reduce((s, l) => s + l.sumRub, 0);
  const vat = calcWorkshop2VatOnNetRub({ netRub: subtotalRub, vatRatePct });
  return {
    schemaVersion: 1,
    documentType: 'schet-offerta',
    orderId: input.orderId,
    generatedAt: new Date().toISOString(),
    seller: {
      name: 'ООО «Бренд (демо)»',
      inn: '7700000000',
      addressRu: 'г. Москва, ул. Примерная, д. 1',
    },
    buyer: {
      name: input.buyerName?.trim() || 'ООО «Покупатель (демо)»',
      inn: input.buyerInn?.trim() || '7700000001',
    },
    lines: mapped,
    vatRatePct,
    subtotalRub,
    vatRub: vat.vatRub,
    totalRub: vat.grossRub,
    totalFormattedRu: formatWorkshop2RubCurrency(vat.grossRub),
    legalNoteRu:
      'Счёт-оферта (stub): не является фискальным чеком; оплата через ЮKassa после настройки ключей.',
  };
}
