import type { ExecutionPartner } from '@/lib/execution-linkage/execution-partner-schemas';

export interface SupplierBid {
  factoryId: string;
  leadTimeDays: number;
  unitPrice: number;
  moq?: number;
}

/**
 * [Phase 17 — Procurement / tender selection]
 * Выбор поставщика по ставкам и MOQ (демо).
 */
export class ProcurementEngine {
  static selectBestSupplier(
    request: { targetQuantity: number },
    bids: SupplierBid[],
    _partners: ExecutionPartner[]
  ): { selectedFactoryId: string; winningBid: SupplierBid; reasoning: string } | null {
    const suitable = bids.filter((b) => !b.moq || request.targetQuantity >= b.moq);
    if (suitable.length === 0) return null;

    const winning = [...suitable].sort((a, b) => a.unitPrice - b.unitPrice)[0]!;

    return {
      selectedFactoryId: winning.factoryId,
      winningBid: winning,
      reasoning: `Selected lowest unit price among ${suitable.length} suitable bid(s).`,
    };
  }
}
