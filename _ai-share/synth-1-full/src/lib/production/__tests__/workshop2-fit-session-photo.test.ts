import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  isWorkshop2EphemeralPhotoUrl,
  pickWorkshop2SketchVaultDocumentId,
  resolveWorkshop2FitSessionPhotoUrls,
  resolveWorkshop2SketchSheetThumbUrl,
} from '@/lib/production/workshop2-fit-session-photo';

describe('workshop2-fit-session-photo', () => {
  it('uses sketch sheet imageDataUrl', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      sketchSheets: [{ sheetId: 's1', annotations: [], imageDataUrl: 'data:image/png;base64,abc' }],
    };
    expect(resolveWorkshop2SketchSheetThumbUrl(dossier)).toMatch(/^data:image/);
    expect(resolveWorkshop2FitSessionPhotoUrls({ dossier })).toHaveLength(1);
  });

  it('picks sketch vault document from list', () => {
    const id = pickWorkshop2SketchVaultDocumentId([
      { documentId: 'cad-1', metadata: { kind: 'cad' } },
      { documentId: 'sk-1', metadata: { kind: 'sketch' } },
    ]);
    expect(id).toBe('sk-1');
  });

  it('returns empty when no sketch sources', () => {
    expect(resolveWorkshop2FitSessionPhotoUrls({ dossier: emptyWorkshop2DossierPhase1() })).toEqual(
      []
    );
  });

  it('prefers session photoVaultDocumentId over sketch sheet', () => {
    const urls = resolveWorkshop2FitSessionPhotoUrls({
      dossier: {
        ...emptyWorkshop2DossierPhase1(),
        sketchSheets: [{ sheetId: 's1', annotations: [], imageDataUrl: 'data:image/png;base64,x' }],
      },
      collectionId: 'SS27',
      articleId: 'a1',
      sessionPhotoVaultDocumentId: 'vault-sk-1',
    });
    expect(urls[0]).toContain('/vault-sk-1');
  });

  it('ignores blob sketch URLs', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      sketchSheets: [{ sheetId: 's1', annotations: [], imageDataUrl: 'blob:https://x' }],
    };
    expect(isWorkshop2EphemeralPhotoUrl('blob:https://x')).toBe(true);
    expect(resolveWorkshop2FitSessionPhotoUrls({ dossier })).toEqual([]);
  });
});
