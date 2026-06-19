import type { BrandCentricRfqQuoteCard } from '@/lib/fashion/brand-centric-rfq-quotes';

export type BrandCentricRfqQuotesResponse = {
  ok: boolean;
  rfqId: string | null;
  quotes: BrandCentricRfqQuoteCard[];
  storageMode?: 'pg' | 'file' | 'memory' | 'demo';
};

export async function fetchBrandCentricRfqQuotes(input: {
  rfqId?: string;
  collectionId?: string;
  articleId?: string;
}): Promise<BrandCentricRfqQuotesResponse> {
  const params = new URLSearchParams();
  if (input.rfqId?.trim()) params.set('rfqId', input.rfqId.trim());
  if (input.collectionId?.trim()) params.set('collectionId', input.collectionId.trim());
  if (input.articleId?.trim()) params.set('articleId', input.articleId.trim());
  const res = await fetch(`/api/brand/b2b/centric-rfq/quotes?${params.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as BrandCentricRfqQuotesResponse;
  if (!res.ok || !json.ok) {
    return { ok: false, rfqId: null, quotes: [] };
  }
  return json;
}

export async function awardBrandCentricRfqQuote(input: {
  rfqId: string;
  quoteId: string;
}): Promise<BrandCentricRfqQuotesResponse> {
  const res = await fetch('/api/brand/b2b/centric-rfq/quotes', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as BrandCentricRfqQuotesResponse;
  if (!res.ok || !json.ok) {
    return { ok: false, rfqId: input.rfqId, quotes: [] };
  }
  return json;
}
