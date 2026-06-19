jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    splitTextToSize: jest.fn((text: string) => [text]),
    text: jest.fn(),
    addPage: jest.fn(),
    output: jest.fn(() => {
      const buf = Buffer.from('%PDF-1.4 po-bundle mock');
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }),
  })),
}));

import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { buildWorkshop2PoBundlePayload } from '@/lib/production/workshop2-po-bundle-payload';
import { buildWorkshop2PoBundlePdfBytes } from '@/lib/production/workshop2-po-bundle-pdf';

describe('workshop2-po-bundle-payload', () => {
  it('builds payload with BOM lines scaled by series qty', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        materialLines: [
          {
            materialName: 'Хлопок',
            role: 'main',
            consumption: 1.5,
            unit: 'm',
            isPrimary: true,
          },
        ],
      },
    };
    const payload = buildWorkshop2PoBundlePayload({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
      purchaseOrders: [
        {
          id: 'PO-1',
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          qty: 100,
          status: 'draft',
          mesReleaseStage: 'queued',
          payload: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      seriesQty: 100,
    });
    expect(payload.seriesQty).toBe(100);
    expect(payload.bomLines[0]?.requiredQty).toBe(150);
    expect(payload.purchaseOrders).toHaveLength(1);
  });
});

describe('workshop2-po-bundle-pdf', () => {
  it('returns %PDF bytes', () => {
    const payload = buildWorkshop2PoBundlePayload({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier: emptyWorkshop2DossierPhase1(),
      purchaseOrders: [],
      seriesQty: 0,
    });
    const bytes = buildWorkshop2PoBundlePdfBytes(payload);
    expect(bytes.byteLength).toBeGreaterThan(8);
    expect(Buffer.from(bytes.subarray(0, 4)).toString()).toBe('%PDF');
  });
});
