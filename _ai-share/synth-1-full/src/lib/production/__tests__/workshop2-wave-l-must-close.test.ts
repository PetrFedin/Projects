/**
 * Wave L — route group D3, investor demo env, user-visible PG copy, staging mock paths.
 */
import fs from 'fs';
import path from 'path';
import { isWorkshop2PgOnlyMode } from '@/lib/firebase/firebase-env';
import {
  buildWorkshop2InvestorStagingDemoEnv,
  WORKSHOP2_INVESTOR_DEMO_NOTE_RU,
  WORKSHOP2_INVESTOR_DEMO_PRIMARY_CEILING_CATALOG_ID,
} from '@/lib/production/workshop2-investor-demo-env';
import { buildWorkshop2FitPanelMeta } from '@/lib/production/workshop2-ux-phase1-helpers';
import { attemptWorkshop2FactoryErpStaging } from '@/lib/production/workshop2-factory-erp-staging';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import { WORKSHOP2_STAGING_MOCK_DEFAULT_BASE } from '@/lib/production/workshop2-staging-contract-mode';

const W2_APP = path.join(process.cwd(), 'src/app/brand/production/workshop2');
const W2_COMPONENTS = path.join(process.cwd(), 'src/components/brand/production');
const W2_LIB = path.join(process.cwd(), 'src/lib/production');

describe('workshop2 wave-l — must close', () => {
  describe('D3 — (w2-enterprise) route group skips Firebase init', () => {
    it('route group layout wraps Workshop2PgOnlyEnterpriseShell', () => {
      const src = fs.readFileSync(path.join(W2_APP, '(w2-enterprise)', 'layout.tsx'), 'utf8');
      expect(src).toMatch(/Workshop2PgOnlyEnterpriseShell/);
      expect(src).toMatch(/w2-enterprise/);
    });

    it('firebase config early-returns when PG_ONLY (stronger than lazy init)', () => {
      process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY = '1';
      const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/firebase/config.ts'), 'utf8');
      expect(src).toMatch(/isWorkshop2PgOnlyMode\(\)\) return/);
      expect(isWorkshop2PgOnlyMode()).toBe(true);
    });

    it('enterprise pages live under (w2-enterprise) route group', () => {
      expect(fs.existsSync(path.join(W2_APP, '(w2-enterprise)', 'page.tsx'))).toBe(true);
      expect(fs.existsSync(path.join(W2_APP, '(w2-enterprise)', 'c'))).toBe(true);
      expect(fs.existsSync(path.join(W2_APP, 'page.tsx'))).toBe(false);
    });

    it('hub page imports local-state provider via absolute path (not ./ inside route group)', () => {
      const src = fs.readFileSync(path.join(W2_APP, '(w2-enterprise)', 'page.tsx'), 'utf8');
      expect(src).toMatch(/@\/app\/brand\/production\/workshop2\/workshop2-local-state-provider/);
      expect(src).not.toMatch(/from '\.\/workshop2-local-state-provider'/);
    });
  });

  describe('investor demo — staging contract ONE green ceiling path', () => {
    it('buildWorkshop2InvestorStagingDemoEnv sets contract mode + ERP base', () => {
      const env = buildWorkshop2InvestorStagingDemoEnv();
      expect(env.WORKSHOP2_STAGING_CONTRACT_MODE).toBe('true');
      expect(env.WORKSHOP2_FACTORY_ERP_BASE_URL).toBe(WORKSHOP2_STAGING_MOCK_DEFAULT_BASE);
      expect(env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY).toBe('1');
      expect(WORKSHOP2_INVESTOR_DEMO_NOTE_RU).toMatch(/не prod live/i);
      expect(WORKSHOP2_INVESTOR_DEMO_PRIMARY_CEILING_CATALOG_ID).toBe(66);
    });

    it('staging mock server exposes /purchase-orders for live ERP POST path', () => {
      const src = fs.readFileSync(
        path.join(process.cwd(), 'scripts/workshop2-staging-mock-server.ts'),
        'utf8'
      );
      expect(src).toMatch(/case '\/purchase-orders'/);
      expect(src).toMatch(/case '\/webhook'/);
    });

    it('ERP staging contract ACK via mocked fetch (investor green path)', async () => {
      const env = buildWorkshop2InvestorStagingDemoEnv();
      const res = await attemptWorkshop2FactoryErpStaging({
        dossier: emptyWorkshop2DossierPhase1(),
        purchaseOrders: [],
        erpConfigured: true,
        actor: 'wave-l-investor',
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        env,
        fetchImpl: (async () =>
          ({
            ok: true,
            status: 200,
            json: async () => ({ erpOrderId: 'ERP-INVESTOR-DEMO-1' }),
          }) as Response) as Parameters<typeof attemptWorkshop2FactoryErpStaging>[0]['fetchImpl'],
      });
      expect(res.ok).toBe(true);
      expect(res.dossier.factoryErpStagingMirror?.erpOrderIdAckInPg).toBe(true);
      expect(res.dossier.factoryErpStagingMirror?.partnerAckId).toBe('ERP-INVESTOR-DEMO-1');
    });
  });

  describe('stretch 8.5 — user-visible copy without → PG', () => {
    it('fit panel meta nextAction has no → PG', () => {
      const meta = buildWorkshop2FitPanelMeta({
        fitSessions: { state: 'ready', hintRu: 'ok' },
        floorChipLabelRu: 'Floor: synced',
      });
      expect(meta.nextAction ?? '').not.toMatch(/→ PG/);
    });

    it('floor bridge gate messageRu has no → PG', () => {
      const src = fs.readFileSync(
        path.join(W2_LIB, 'workshop2-floor-bridge-dossier-persist.ts'),
        'utf8'
      );
      expect(src).not.toMatch(/С пола → PG/);
      expect(src).toMatch(/Сохранить с пола в досье/);
    });

    it('supply nextAction helper has no → PG', () => {
      const src = fs.readFileSync(path.join(W2_LIB, 'workshop2-ux-phase1-helpers.ts'), 'utf8');
      expect(src).not.toMatch(/lab dip → PG/);
    });

    it('component mirror buttons: → PG only in title attr (tooltip)', () => {
      const files = fs.readdirSync(W2_COMPONENTS).filter((f) => f.endsWith('.tsx'));
      for (const file of files) {
        const src = fs.readFileSync(path.join(W2_COMPONENTS, file), 'utf8');
        if (!src.includes('→ PG')) continue;
        expect(src).toMatch(/title="[^"]*→ PG"/);
        expect(src).not.toMatch(/>\s*['"`][^'"`]*→ PG/);
      }
    });
  });
});
