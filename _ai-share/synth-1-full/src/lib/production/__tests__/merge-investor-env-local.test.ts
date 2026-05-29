/**
 * Unit: merge .env.e2e.investor.example → .env.local (dev-e2e-investor prep path).
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('mergeInvestorEnvLocal', () => {
  it('overlays example keys and preserves unrelated .env.local lines', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-env-'));
    fs.writeFileSync(
      path.join(tmp, '.env.e2e.investor.example'),
      'WORKSHOP2_INVESTOR_DEMO_MODE=true\nFOO=from-example\n'
    );
    fs.writeFileSync(path.join(tmp, '.env.local'), 'FOO=old\nBAZ=keep\n');

    const { mergeInvestorEnvLocal } = await import(
      path.join(process.cwd(), 'scripts/merge-investor-env-local.mjs')
    );
    mergeInvestorEnvLocal({ root: tmp });

    const local = fs.readFileSync(path.join(tmp, '.env.local'), 'utf8');
    expect(local).toMatch(/WORKSHOP2_INVESTOR_DEMO_MODE=true/);
    expect(local).toMatch(/FOO=from-example/);
    expect(local).toMatch(/BAZ=keep/);
  });

  it('throws when example env file is missing', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-env-'));
    const { mergeInvestorEnvLocal } = await import(
      path.join(process.cwd(), 'scripts/merge-investor-env-local.mjs')
    );
    expect(() => mergeInvestorEnvLocal({ root: tmp })).toThrow(/missing/);
  });
});
