/**
 * Wave H — hooks regression, sample-order 409 UX, gate checks partition.
 */
import fs from 'fs';
import path from 'path';
import {
  partitionWorkshop2GateChecksForUi,
  formatWorkshop2GateChecksForUi,
} from '@/lib/production/workshop2-api-gate-messages';

const ROOT = path.join(process.cwd(), 'src/components/brand/production');

function readPanel(name: string): string {
  return fs.readFileSync(path.join(ROOT, name), 'utf8');
}

/** useCallback/useMemo must not appear after early `if (loading || !bundle) return`. */
function assertHooksBeforeEarlyReturn(file: string) {
  const src = readPanel(file);
  const earlyIdx = src.search(/if \(loading[\s\S]*?return/);
  expect(earlyIdx).toBeGreaterThan(-1);
  const beforeEarly = src.slice(0, earlyIdx);
  const afterEarly = src.slice(earlyIdx);
  expect(beforeEarly).toMatch(/use(Callback|Memo|Effect|State)/);
  expect(afterEarly).not.toMatch(/\n\s*const \w+ = use(Callback|Memo)\(/);
}

describe('workshop2 wave-h — development depth', () => {
  it('partitionWorkshop2GateChecksForUi orders blockers before warnings', () => {
    const out = partitionWorkshop2GateChecksForUi([
      { id: 'w1', severity: 'warning', messageRu: 'warn' },
      { id: 'b1', severity: 'blocker', messageRu: 'block' },
    ]);
    expect(out.blockers).toHaveLength(1);
    expect(out.warnings).toHaveLength(1);
    expect(out.ordered[0]?.messageRu).toBe('block');
    expect(out.ordered[1]?.messageRu).toBe('warn');
  });

  it('formatWorkshop2GateChecksForUi still truncates toast to 4 lines', () => {
    const checks = Array.from({ length: 8 }, (_, i) => ({
      id: `b${i}`,
      severity: 'blocker' as const,
      messageRu: `blocker-${i}`,
    }));
    const text = formatWorkshop2GateChecksForUi(checks);
    expect(text.split(' · ')).toHaveLength(4);
  });

  it('sample panel renders full gate checks block + probe button', () => {
    const src = readPanel('Workshop2ArticleSamplePanel.tsx');
    expect(src).toMatch(/Workshop2GateChecksBlock/);
    expect(src).toMatch(/workshop2-sample-probe-gate/);
    expect(src).toMatch(/lastGateChecks/);
  });

  it.each([
    'workshop2-article-workspace-plan-po-panel.tsx',
    'workshop2-article-workspace-release-panel.tsx',
    'workshop2-article-workspace-stock-panel.tsx',
    'workshop2-article-workspace-fit-gold-panel.tsx',
  ])('%s — hooks before loading early return', (file) => {
    assertHooksBeforeEarlyReturn(file);
  });

  it('firebase config lazy init + session warn flag', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/firebase/config.ts'), 'utf8');
    expect(src).toMatch(/__synthFirebaseMockWarned/);
    expect(src).toMatch(/getFirebaseDb/);
  });
});
