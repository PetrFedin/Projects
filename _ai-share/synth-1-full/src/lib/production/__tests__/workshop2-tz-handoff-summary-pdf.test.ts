jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    splitTextToSize: jest.fn((text: string) => [text]),
    text: jest.fn(),
    addPage: jest.fn(),
    output: jest.fn(() => {
      const buf = Buffer.from('%PDF-1.4 tz-handoff mock');
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }),
  })),
}));

import { buildWorkshop2TzHandoffSummaryPdfBytes } from '@/lib/production/workshop2-tz-handoff-summary-pdf';
import { buildWorkshop2HandoffPdfTocLinesRu } from '@/lib/production/workshop2-handoff-pdf-section-labels-ru';

describe('buildWorkshop2TzHandoffSummaryPdfBytes', () => {
  it('returns PDF magic bytes with TOC lines', () => {
    const bytes = buildWorkshop2TzHandoffSummaryPdfBytes({
      collectionId: 'SS27',
      articleId: 'ART-001',
      articleSku: 'SKU-001',
      articleName: 'Demo jacket',
      version: 3,
      updatedAt: '2026-06-12T10:00:00.000Z',
      tzOverallPct: 72,
      preflightScore: 68,
      tocLines: buildWorkshop2HandoffPdfTocLinesRu(),
      blockingGatesRu: ['composition label missing'],
    });
    const header = String.fromCharCode(...bytes.slice(0, 4));
    expect(header).toBe('%PDF');
    expect(bytes.length).toBeGreaterThan(8);
  });
});
