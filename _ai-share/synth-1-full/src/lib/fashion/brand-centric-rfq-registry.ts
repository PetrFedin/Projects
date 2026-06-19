import type { CentricRfqRecord } from '@/lib/integrations/spine/centric-rfq-persistence.file';

export type BrandCentricRfqRegistryRow = {
  rfqId: string;
  articleId: string;
  collectionId: string;
  status: CentricRfqRecord['status'];
  lineCount: number;
  b2bOrderId?: string;
  importedAt: string;
};

export function mapCentricRfqRecordsToRegistryRows(
  records: readonly CentricRfqRecord[]
): BrandCentricRfqRegistryRow[] {
  return [...records]
    .sort((a, b) => b.importedAt.localeCompare(a.importedAt))
    .map((r) => ({
      rfqId: r.rfqId,
      articleId: r.articleId,
      collectionId: r.collectionId,
      status: r.status,
      lineCount: r.lines.length,
      b2bOrderId: r.b2bOrderId,
      importedAt: r.importedAt,
    }));
}

export function summarizeBrandCentricRfqRegistry(rows: BrandCentricRfqRegistryRow[]): {
  total: number;
  open: number;
  awarded: number;
} {
  return {
    total: rows.length,
    open: rows.filter((r) => r.status === 'open' || r.status === 'quoted').length,
    awarded: rows.filter((r) => r.status === 'awarded').length,
  };
}
