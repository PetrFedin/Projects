/**
 * Wave 7 P1 #10: vendor bids mirror в dossier PG + heuristic winner (без fake ML).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2VendorBid,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function listWorkshop2VendorBidsFromDossier(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2VendorBid[] {
  return dossier?.bids ?? [];
}

export function compareWorkshop2VendorBidsLowestCmt(
  bids: Workshop2VendorBid[]
): Workshop2VendorBid | null {
  const pending = bids.filter((b) => b.status === 'pending' || b.status === 'accepted');
  if (!pending.length) return null;
  return [...pending].sort((a, b) => a.cmtPrice - b.cmtPrice)[0] ?? null;
}

export function appendWorkshop2VendorBidToDossier(input: {
  dossier: Workshop2DossierPhase1;
  bid: Omit<Workshop2VendorBid, 'id' | 'submittedAt' | 'status'> & {
    id?: string;
    status?: Workshop2VendorBid['status'];
    submittedAt?: string;
  };
}): { dossier: Workshop2DossierPhase1; bid: Workshop2VendorBid } {
  const bid: Workshop2VendorBid = {
    id: input.bid.id ?? `vb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    vendorId: input.bid.vendorId.trim(),
    vendorName: input.bid.vendorName.trim(),
    cmtPrice: input.bid.cmtPrice,
    currency: input.bid.currency.trim() || 'RUB',
    leadTimeDays: input.bid.leadTimeDays,
    moq: input.bid.moq,
    status: input.bid.status ?? 'pending',
    submittedAt: input.bid.submittedAt ?? new Date().toISOString(),
  };
  const bids = [...(input.dossier.bids ?? []), bid];
  const lowest = compareWorkshop2VendorBidsLowestCmt(bids);
  return {
    bid,
    dossier: {
      ...input.dossier,
      bids,
      vendorBidsMirror: {
        mirroredAt: new Date().toISOString(),
        bidCount: bids.length,
        lowestCmtPrice: lowest?.cmtPrice ?? null,
        lowestVendorId: lowest?.vendorId ?? null,
        heuristicWinnerNoteRu: lowest
          ? `Heuristic winner: ${lowest.vendorName} (мин. CMT ${lowest.cmtPrice} ${lowest.currency}) — без ML.`
          : 'Ставок для сравнения пока нет.',
      },
    },
  };
}

export function acceptWorkshop2VendorBidHeuristicWinner(input: {
  dossier: Workshop2DossierPhase1;
}): Workshop2DossierPhase1 {
  const lowest = compareWorkshop2VendorBidsLowestCmt(input.dossier.bids ?? []);
  if (!lowest) return input.dossier;
  const bids = (input.dossier.bids ?? []).map((b) => ({
    ...b,
    status:
      b.id === lowest.id
        ? ('accepted' as const)
        : b.status === 'accepted'
          ? ('rejected' as const)
          : b.status,
  }));
  return {
    ...input.dossier,
    bids,
    vendorBidsMirror: {
      mirroredAt: new Date().toISOString(),
      bidCount: bids.length,
      lowestCmtPrice: lowest.cmtPrice,
      lowestVendorId: lowest.vendorId,
      heuristicWinnerNoteRu: `Принята ставка ${lowest.vendorName} (heuristic min CMT).`,
    },
  };
}
