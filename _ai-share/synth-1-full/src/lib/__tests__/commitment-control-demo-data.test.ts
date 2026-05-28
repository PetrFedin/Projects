/**
 * @jest-environment node
 */
import { buildCommitmentControlOutput } from '@/lib/control-adapters/commitment-control-output';
import { controlSignalSurfaceVisible } from '@/lib/control-adapters/control-signal-present';
import { buildCommitmentDemoInputs, shiftCommittedYmd } from '@/lib/commitment-control-demo-data';

describe('commitment-control-demo-data', () => {
  it('shiftCommittedYmd moves calendar days', () => {
    expect(shiftCommittedYmd('2026-04-09', -1)).toBe('2026-04-08');
    expect(shiftCommittedYmd('2026-04-09', 1)).toBe('2026-04-10');
  });

  it('demo inputs produce at least one visible control row', () => {
    const asOf = '2026-04-09T12:00:00.000Z';
    const inputs = buildCommitmentDemoInputs(asOf);
    expect(inputs.length).toBeGreaterThan(0);
    let visible = 0;
    for (const input of inputs) {
      const out = buildCommitmentControlOutput(input);
      if (controlSignalSurfaceVisible(out)) visible += 1;
    }
    expect(visible).toBeGreaterThan(0);
  });
});
