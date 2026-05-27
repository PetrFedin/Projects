/**
 * Wave 33 — CI harness + multi-brand cart split (+8).
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  clearWorkshop2B2bCartMemoryForTests,
  evaluateWorkshop2B2bCartMixedBrandGate,
  getWorkshop2B2bCartSession,
  splitWorkshop2B2bCartByBrand,
  summarizeWorkshop2B2bMixedBrandCheckoutRu,
  upsertWorkshop2B2bCartLine,
} from '@/lib/production/workshop2-b2b-wave23-parity';
import { buildWorkshop2Wave33CiReadyProbe } from '@/lib/production/workshop2-live-integration-probes';

const root = process.cwd();

describe('wave33 — GitHub Actions workshop2-ci.yml', () => {
  it('declares required unit job', () => {
    const src = fs.readFileSync(path.join(root, '.github/workflows/workshop2-ci.yml'), 'utf8');
    expect(src).toMatch(/npm run test:workshop2:unit/);
    expect(src).toMatch(/node-version: ['"]20['"]/);
    expect(src).toMatch(/cache: npm/);
  });

  it('optional MES job; PG gate continue-on-error when WORKSHOP2_PG_GATE_REQUIRED=false', () => {
    const src = fs.readFileSync(path.join(root, '.github/workflows/workshop2-ci.yml'), 'utf8');
    expect(src).toMatch(/test:workshop2:mes-e2e/);
    expect(src).toMatch(/ci-workshop2-pg-only-gate\.sh/);
    expect(src).toMatch(/WORKSHOP2_PG_GATE_REQUIRED/);
    expect(src).toMatch(/continue-on-error: \$\{\{ env\.WORKSHOP2_PG_GATE_REQUIRED != 'true' \}\}/);
  });

  it('e2e-ru-signoff job uses CI env and ru-signoff script', () => {
    const src = fs.readFileSync(path.join(root, '.github/workflows/workshop2-ci.yml'), 'utf8');
    expect(src).toMatch(/e2e-ru-signoff/);
    expect(src).toMatch(/CI: ['"]true['"]/);
    expect(src).toMatch(/test:e2e:ru-signoff/);
    expect(src).toMatch(/PLAYWRIGHT_BASE_URL/);
  });
});

describe('wave33 — staging live env template', () => {
  it('live RU example documents Kontur and marking URLs', () => {
    const src = fs.readFileSync(path.join(root, '.env.staging.live.ru.example'), 'utf8');
    expect(src).toMatch(/WORKSHOP2_KONTUR_DIADOC_URL/);
    expect(src).toMatch(/WORKSHOP2_MARKING_API_URL/);
    expect(src).toMatch(/заполнить в кабинете/i);
  });
});

describe('wave33 — multi-brand split API + checkout copy', () => {
  beforeEach(() => clearWorkshop2B2bCartMemoryForTests());

  it('split-by-brand route module exists', () => {
    expect(
      fs.existsSync(path.join(root, 'src/app/api/shop/b2b/cart/split-by-brand/route.ts'))
    ).toBe(true);
  });

  it('checkout banner component exists', () => {
    expect(
      fs.existsSync(path.join(root, 'src/components/shop/b2b/B2bMultiBrandSplitCheckoutBanner.tsx'))
    ).toBe(true);
  });

  it('splitWorkshop2B2bCartByBrand returns one session per brand', () => {
    const sid = 'split-test-1';
    upsertWorkshop2B2bCartLine({
      sessionId: sid,
      line: {
        collectionId: 'SS27',
        articleId: 'a1',
        brandId: 'brand-a',
        colorCode: 'BLK',
        size: 'M',
        qty: 2,
        wholesalePriceRub: 1000,
      },
    });
    upsertWorkshop2B2bCartLine({
      sessionId: sid,
      line: {
        collectionId: 'SS27',
        articleId: 'a2',
        brandId: 'brand-b',
        colorCode: 'WHT',
        size: 'L',
        qty: 1,
        wholesalePriceRub: 2000,
      },
    });
    const session = getWorkshop2B2bCartSession(sid)!;
    const split = splitWorkshop2B2bCartByBrand({ session });
    expect(split.sessions).toHaveLength(2);
    expect(split.sessions.map((s) => s.brandId).sort()).toEqual(['brand-a', 'brand-b']);
    expect(getWorkshop2B2bCartSession(split.sessions[0]!.sessionId)?.lines).toHaveLength(1);
  });

  it('headlineRu for two brands matches checkout copy', () => {
    const summary = summarizeWorkshop2B2bMixedBrandCheckoutRu({
      lines: [
        { brandId: 'x', collectionId: 'SS27' },
        { brandId: 'y', collectionId: 'SS27' },
      ],
    });
    expect(summary.mixed).toBe(true);
    expect(summary.headlineRu).toMatch(/2 бренда — оформите отдельно/);
  });

  it('mixed brand gate message references split-by-brand', () => {
    const sid = 'gate-msg';
    upsertWorkshop2B2bCartLine({
      sessionId: sid,
      line: {
        collectionId: 'SS27',
        articleId: 'a1',
        brandId: 'b1',
        colorCode: 'BLK',
        size: 'M',
        qty: 1,
        wholesalePriceRub: 100,
      },
    });
    upsertWorkshop2B2bCartLine({
      sessionId: sid,
      line: {
        collectionId: 'SS27',
        articleId: 'a2',
        brandId: 'b2',
        colorCode: 'WHT',
        size: 'L',
        qty: 1,
        wholesalePriceRub: 200,
      },
    });
    const gate = evaluateWorkshop2B2bCartMixedBrandGate({
      session: getWorkshop2B2bCartSession(sid)!,
    });
    expect(gate.allowed).toBe(false);
    if (!gate.allowed) {
      expect(gate.messageRu).toMatch(/оформите отдельно/i);
      expect(gate.messageRu).toMatch(/split-by-brand/i);
    }
  });
});

describe('wave33 — wave33CiReady probe', () => {
  it('probe aggregates wave33 CI checks', () => {
    const probe = buildWorkshop2Wave33CiReadyProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(typeof probe.wave33CiReady).toBe('number');
    expect(probe.checks.some((c) => c.id === 'github_workshop2_ci_yml')).toBe(true);
    expect(probe.wave33CiReady).toBeGreaterThanOrEqual(6);
  });
});
