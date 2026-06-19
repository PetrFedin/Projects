import type { BrandProductionCutTicketPgRow } from '@/lib/production/brand-production-cut-ticket-spine';
import type { BrandProductionCutTicketStatus } from '@/lib/brand-production/cut-tickets';

export async function fetchBrandProductionCutTickets(input: {
  collectionId: string;
  orderId?: string;
}): Promise<{
  ok: boolean;
  rows: BrandProductionCutTicketPgRow[];
  storageMode: 'pg' | 'file' | 'empty';
}> {
  const qs = new URLSearchParams({ collectionId: input.collectionId.trim() });
  if (input.orderId?.trim()) qs.set('orderId', input.orderId.trim());
  const res = await fetch(`/api/brand/production/cut-tickets?${qs.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as {
    ok?: boolean;
    rows?: BrandProductionCutTicketPgRow[];
    storageMode?: 'pg' | 'file' | 'empty';
  };
  if (!res.ok || !json.ok) return { ok: false, rows: [], storageMode: 'empty' };
  return {
    ok: true,
    rows: json.rows ?? [],
    storageMode: json.storageMode ?? 'empty',
  };
}

export async function advanceBrandProductionCutTicket(input: {
  ticketId: string;
  nextStatus: BrandProductionCutTicketStatus;
}): Promise<{ ok: boolean; row?: BrandProductionCutTicketPgRow }> {
  const res = await fetch('/api/brand/production/cut-tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'advance',
      ticketId: input.ticketId,
      nextStatus: input.nextStatus,
    }),
  });
  const json = (await res.json()) as { ok?: boolean; row?: BrandProductionCutTicketPgRow };
  if (!res.ok || !json.ok) return { ok: false };
  return { ok: true, row: json.row };
}
