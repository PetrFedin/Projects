/**
 * Wave 9–10 RU: B2B checkout — форматирование ₽, НДС optional, территории РФ.
 */
import type { Workshop2B2bMarketplaceInboundPayload } from '@/lib/production/workshop2-b2b-marketplace-inbound';
import { isWorkshop2RuMarket } from '@/lib/production/workshop2-market-profile';
import {
  calcWorkshop2VatFromGrossRub,
  formatWorkshop2RubCurrency,
} from '@/lib/production/workshop2-rub-currency';

export function formatWorkshop2RubAmount(amountRub: number, locale = 'ru-RU'): string {
  return formatWorkshop2RubCurrency(amountRub, {
    fractionDigits: 0,
    locale,
  });
}

export function resolveWorkshop2B2bVatRate(
  env: Record<string, string | undefined> = process.env
): number {
  const raw = String(env.WORKSHOP2_B2B_VAT_RATE ?? '20').trim();
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 20;
}

export function buildWorkshop2B2bOrderStubTotals(input: {
  lines?: Workshop2B2bMarketplaceInboundPayload['lines'];
  vatRatePct?: number;
  env?: Record<string, string | undefined>;
}): {
  subtotalRub: number;
  vatRub: number;
  totalRub: number;
  vatRatePct: number | null;
  formattedTotalRu: string;
  vatOptional: boolean;
} {
  const env = input.env ?? process.env;
  const vatEnabled =
    String(env.WORKSHOP2_B2B_VAT_OPTIONAL ?? 'true')
      .trim()
      .toLowerCase() !== 'false';
  const vatRatePct = vatEnabled ? (input.vatRatePct ?? resolveWorkshop2B2bVatRate(env)) : null;
  const subtotalRub = (input.lines ?? []).reduce((s, l) => {
    const price = Number(l.wholesalePrice ?? 0) || 0;
    const qty = Number(l.qty ?? 0) || 0;
    return s + price * qty;
  }, 0);
  const vatRub =
    vatRatePct != null
      ? calcWorkshop2VatFromGrossRub({ grossRub: subtotalRub, vatRatePct }).vatRub
      : 0;
  const totalRub = subtotalRub;
  return {
    subtotalRub,
    vatRub,
    totalRub,
    vatRatePct,
    formattedTotalRu: formatWorkshop2RubAmount(totalRub),
    vatOptional: vatEnabled,
  };
}

/** Территория относится к РФ (федеральный округ / код RU-*). */
export function isWorkshop2RuTerritoryId(territoryId: string): boolean {
  const id = territoryId.trim().toUpperCase();
  return id.startsWith('RU-') || id.startsWith('RU_');
}

export function filterWorkshop2TerritoriesForMarket<T extends { territoryId: string }>(
  rows: T[],
  env: Record<string, string | undefined> = process.env
): T[] {
  if (!isWorkshop2RuMarket(env)) return rows;
  const ru = rows.filter((r) => isWorkshop2RuTerritoryId(r.territoryId));
  return ru.length ? ru : rows.filter((r) => r.territoryId.startsWith('RU'));
}
