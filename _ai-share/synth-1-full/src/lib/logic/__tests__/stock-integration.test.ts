import { shopStockFileIngestIntegrationPreview } from '@/lib/logic/stock-integration';

describe('stock-integration', () => {
  it('shopStockFileIngestIntegrationPreview links ingest to external sync pipeline', () => {
    const p = shopStockFileIngestIntegrationPreview({ acceptedAt: '2020-01-01T00:00:00.000Z' });
    expect(p.ingestKind).toBe('retailer_stock_spreadsheet');
    expect(p.pipelineStage).toBe('accepted_file');
    expect(String(p.nextStage)).toContain('prepareExternalStockSync');
  });
});
