export type BrandCentricRfqQuoteStatus = 'pending' | 'accepted' | 'rejected';

export type BrandCentricRfqQuoteCard = {
  quoteId: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  amountRub: number;
  leadTimeDays: number;
  currency: 'RUB';
  status: BrandCentricRfqQuoteStatus;
  validUntil?: string;
  updatedAt: string;
};

export function summarizeBrandCentricRfqQuotes(quotes: readonly BrandCentricRfqQuoteCard[]): {
  total: number;
  pending: number;
  accepted: number;
} {
  return {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
  };
}

export function pickAcceptedBrandCentricRfqQuote(
  quotes: readonly BrandCentricRfqQuoteCard[]
): BrandCentricRfqQuoteCard | undefined {
  return quotes.find((q) => q.status === 'accepted');
}

export function sortBrandCentricRfqQuotesByAmount(
  quotes: readonly BrandCentricRfqQuoteCard[]
): BrandCentricRfqQuoteCard[] {
  return [...quotes].sort((a, b) => a.amountRub - b.amountRub);
}
