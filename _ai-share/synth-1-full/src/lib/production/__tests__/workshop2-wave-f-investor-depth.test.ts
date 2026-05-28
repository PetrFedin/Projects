/**
 * Wave F — remaining P0/P1: PG-only inventory, live ceilings honesty, ERP 503.
 */
import {
  evaluateWorkshop2HubInventoryMirrorPersistOutcome,
  summarizeWorkshop2HubInventoryDriftBatch,
} from '@/lib/production/workshop2-hub-pg-only-policy';
import { evaluateWorkshop2DppRegistryWriteHonesty } from '@/lib/production/workshop2-dpp-registry-write-honesty';
import {
  buildWorkshop2PlmWebhookPartnerAckShape,
  evaluateWorkshop2PlmUiFailClosed,
} from '@/lib/production/workshop2-live-plm-webhook-contract';
import { recordWorkshop2PlmWebhookReceipt } from '@/lib/production/workshop2-plm-transport-journal';
import { resolveWorkshop2Fit3dModel } from '@/lib/production/workshop2-fit-3d-model-resolve';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { stampWorkshop2HubPgOverlayOnDossier } from '@/lib/production/workshop2-hub-inventory-pg-overlay';
import { workshop2Phase1DossierStorageKey } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 wave F — investor depth', () => {
  describe('hub inventory PG-only (#10)', () => {
    it('server + failed API → no silent LS success', () => {
      const out = evaluateWorkshop2HubInventoryMirrorPersistOutcome({
        backendStatus: 'server',
        apiOk: false,
        apiReason: 'postgres_disabled',
      });
      expect(out.ok).toBe(false);
      expect(out.silentLocalSuccess).toBe(false);
      expect(out.httpStatusHint).toBe(503);
    });

    it('drift batch unchanged', () => {
      const key = workshop2Phase1DossierStorageKey('SS27', 'a1');
      const local = stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1(), {
        hubPgOverlayAt: '2026-05-20T10:00:00.000Z',
      } as never);
      const merged = stampWorkshop2HubPgOverlayOnDossier(emptyWorkshop2DossierPhase1(), {
        hubPgOverlayAt: '2026-05-21T12:00:00.000Z',
      } as never);
      const batch = summarizeWorkshop2HubInventoryDriftBatch({
        localMap: { [key]: { ...local, hubPgOverlayAt: '2026-05-20T10:00:00.000Z' } },
        mergedMap: { [key]: { ...merged, hubPgOverlayAt: '2026-05-21T12:00:00.000Z' } },
        articles: [{ collectionId: 'SS27', articleId: 'a1' }],
      });
      expect(batch.driftCount).toBe(1);
    });
  });

  describe('PLM webhook partnerAck shape (#78)', () => {
    it('webhook receipt → partnerAckRecorded false', () => {
      const dossier = recordWorkshop2PlmWebhookReceipt({
        dossier: emptyWorkshop2DossierPhase1(),
        actor: 'wave-f',
        eventId: 'evt-1',
      });
      const shape = buildWorkshop2PlmWebhookPartnerAckShape({
        dossier,
        eventId: 'evt-1',
      });
      expect(shape.partnerAckRecorded).toBe(false);
      expect(shape.partnerAckId).toBeNull();
      expect(shape.webhookReceiptRecorded).toBe(true);
    });

    it('UI fail-closed without live transport', () => {
      const ui = evaluateWorkshop2PlmUiFailClosed({ plmTransportLive: false });
      expect(ui.allowProcess).toBe(false);
    });
  });

  describe('DPP registry honesty (#50)', () => {
    it('registryStub without live URL → no green UI', () => {
      const h = evaluateWorkshop2DppRegistryWriteHonesty({
        dossier: emptyWorkshop2DossierPhase1(),
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        env: {},
      });
      expect(h.registryStubOnly).toBe(true);
      expect(h.allowStagingSuccessUi).toBe(false);
      expect(h.httpStatusHint).toBe(503);
    });
  });

  describe('Fit3D placeholder (#55)', () => {
    const prev = process.env.NODE_ENV;
    afterEach(() => {
      process.env.NODE_ENV = prev;
      delete process.env.WORKSHOP2_FIT3D_ALLOW_PLACEHOLDER;
      delete process.env.NEXT_PUBLIC_W2_FIT3D_ENABLE;
    });

    it('production rejects placeholder without allow flag', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_W2_FIT3D_ENABLE = '1';
      const r = resolveWorkshop2Fit3dModel({ forceEnable: true });
      expect(r.placeholderBlockedInProd).toBe(true);
      expect(r.modelUrl).toBe('');
    });
  });
});
