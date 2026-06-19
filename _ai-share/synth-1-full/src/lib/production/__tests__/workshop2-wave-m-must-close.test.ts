/**
 * Wave M — (w2-enterprise) import audit, PG-disabled honest hints, no staging-mock in prod UI.
 */
import fs from 'fs';
import path from 'path';
import {
  resolveWorkshop2BackendStatusFromHealth,
  workshop2BackendStatusHintRu,
} from '@/components/brand/production/use-workshop2-backend-status-hint';
import { summarizeWorkshop2FactoryErpPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

const W2_APP = path.join(process.cwd(), 'src/app/brand/production/workshop2');
const W2_ENTERPRISE = path.join(W2_APP, '(w2-enterprise)');
const W2_COMPONENTS = path.join(process.cwd(), 'src/components/brand/production');

function listTsxTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listTsxTsFiles(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function relativeImportTargets(src: string, fileDir: string): string[] {
  const targets: string[] = [];
  const re = /from ['"](\.\.?\/[^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const rel = m[1];
    const base = rel.startsWith('../') ? path.resolve(fileDir, rel) : path.join(fileDir, rel);
    targets.push(base);
  }
  return targets;
}

describe('workshop2 wave-m — must close', () => {
  describe('(w2-enterprise) route import audit', () => {
    const enterpriseFiles = listTsxTsFiles(W2_ENTERPRISE);

    it('all enterprise route files exist', () => {
      expect(enterpriseFiles.length).toBeGreaterThanOrEqual(7);
    });

    it('no broken ./workshop2-local-state-provider inside route group', () => {
      for (const file of enterpriseFiles) {
        const src = fs.readFileSync(file, 'utf8');
        expect(src).not.toMatch(/from ['"]\.\/workshop2-local-state-provider['"]/);
      }
    });

    it('local-state provider uses absolute import when referenced', () => {
      for (const file of enterpriseFiles) {
        const src = fs.readFileSync(file, 'utf8');
        if (!src.includes('workshop2-local-state-provider')) continue;
        expect(src).toMatch(/@\/app\/brand\/production\/workshop2\/workshop2-local-state-provider/);
      }
    });

    it('relative imports resolve to existing modules (Wave M hub-style regression)', () => {
      const extensions = ['', '.tsx', '.ts', '.jsx', '.js'];
      for (const file of enterpriseFiles) {
        const src = fs.readFileSync(file, 'utf8');
        const dir = path.dirname(file);
        for (const base of relativeImportTargets(src, dir)) {
          const exists = extensions.some((ext) => fs.existsSync(base + ext));
          expect(exists).toBe(true);
        }
      }
    });

    it('enterprise routes have no staging-mock / investor demo imports', () => {
      for (const file of enterpriseFiles) {
        const src = fs.readFileSync(file, 'utf8');
        expect(src).not.toMatch(/staging-mock|WORKSHOP2_STAGING|workshop2-investor-demo-env/);
      }
    });

    it('layout keeps parent-relative pg-only shell import (valid ../ pattern)', () => {
      const src = fs.readFileSync(path.join(W2_ENTERPRISE, 'layout.tsx'), 'utf8');
      expect(src).toMatch(/from ['"]\.\.\/workshop2-pg-only-enterprise-shell['"]/);
      expect(fs.existsSync(path.join(W2_APP, 'workshop2-pg-only-enterprise-shell.tsx'))).toBe(true);
    });

    it('pg-only shell avoids SSR script (Wave M hydration guard)', () => {
      const src = fs.readFileSync(
        path.join(W2_APP, 'workshop2-pg-only-enterprise-shell.tsx'),
        'utf8'
      );
      expect(src).not.toMatch(/dangerouslySetInnerHTML/);
      expect(src).toMatch(/useEffect/);
    });
  });

  describe('production UI — no demo/staging dead-ends', () => {
    it('W2 production components avoid staging-mock imports', () => {
      const files = fs.readdirSync(W2_COMPONENTS).filter((f) => f.endsWith('.tsx'));
      for (const file of files) {
        const src = fs.readFileSync(path.join(W2_COMPONENTS, file), 'utf8');
        expect(src).not.toMatch(/from ['"]@\/.*staging-mock/);
        expect(src).not.toMatch(/workshop2:staging-mock/);
      }
    });
  });

  describe('PG-disabled honest backend hints (Wave M #6)', () => {
    it('server_file_persist → pg_disabled (not silent offline cache)', () => {
      expect(
        resolveWorkshop2BackendStatusFromHealth({
          ok: true,
          postgres: 'disabled',
          storeMode: 'server_file_persist',
        })
      ).toBe('pg_disabled');
    });

    it('pg_disabled hint is honest file fallback (no fake online)', () => {
      const hint = workshop2BackendStatusHintRu('pg_disabled');
      expect(hint).toMatch(/PG недоступен/);
      expect(hint).toMatch(/файловом/);
    });

    it('postgres ok → server', () => {
      expect(
        resolveWorkshop2BackendStatusFromHealth({
          ok: true,
          postgres: 'ok',
          storeMode: 'server_postgres',
        })
      ).toBe('server');
    });
  });

  describe('ERP live — honest error copy (Wave M #4)', () => {
    it('not_configured chip is Russian with fail-closed title', () => {
      const chip = summarizeWorkshop2FactoryErpPgMirror({
        dossier: emptyWorkshop2DossierPhase1(),
        syncStatus: 'not_configured',
      });
      expect(chip.label).toBe('ERP: не настроен');
      expect(chip.title).toMatch(/fail-closed/i);
      expect(chip.title).toMatch(/WORKSHOP2_FACTORY_ERP_BASE_URL/);
    });
  });
});
