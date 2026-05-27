/**
 * Wave J — Firebase PG-only opt-out, toast titles, supply/TZ banner tokens.
 */
import fs from 'fs';
import path from 'path';
import { isWorkshop2PgOnlyMode, shouldEmitFirebaseMockWarn } from '@/lib/firebase/firebase-env';
import {
  WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS,
  WORKSHOP2_SURFACE_BANNER_TZ_NOTICE_CLASS,
} from '@/lib/production/workshop2-surface-banner-tokens';
import { formatWorkshop2PersistToastTitle } from '@/lib/production/workshop2-persist-toast-messages';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

describe('workshop2 wave-j — must close', () => {
  const prevPgOnly = process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY;

  afterEach(() => {
    if (prevPgOnly === undefined) delete process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY;
    else process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY = prevPgOnly;
  });

  it('PG-only mode suppresses Firebase MOCK warn emission', () => {
    process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY = '1';
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    expect(isWorkshop2PgOnlyMode()).toBe(true);
    expect(shouldEmitFirebaseMockWarn()).toBe(false);
  });

  it('firebase config uses lazy init getters (no import-time warn block)', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/firebase/config.ts'), 'utf8');
    expect(src).toMatch(/getFirebaseDb/);
    expect(src).not.toMatch(/else if \(typeof window !== 'undefined'\)/);
  });

  it('supply/TZ use shared banner token classes', () => {
    const supply = fs.readFileSync(
      path.join(ROOT, 'workshop2-article-workspace-supply-panel.tsx'),
      'utf8'
    );
    expect(supply).toMatch(/WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS/);
    const tzNotices = fs.readFileSync(path.join(ROOT, 'workshop2-tz-section-notices.tsx'), 'utf8');
    expect(tzNotices).toMatch(/WORKSHOP2_SURFACE_BANNER_TZ_NOTICE_CLASS/);
    expect(WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS).toContain('amber');
    expect(WORKSHOP2_SURFACE_BANNER_TZ_NOTICE_CLASS).toContain('amber');
  });

  it('no user-visible toast titles with → PG in workshop2 components', () => {
    const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.tsx'));
    for (const file of files) {
      const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(src).not.toMatch(/title: res\.ok \? '[^']*→ PG/);
      expect(src).not.toMatch(/title: '[^']*→ PG'/);
    }
  });

  it('persist toast helper covers inventory fail-closed copy', () => {
    expect(
      formatWorkshop2PersistToastTitle({
        scopeLabelRu: 'Inventory',
        ok: false,
        failClosed: true,
      })
    ).toBe('PG недоступен');
  });
});
