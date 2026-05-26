import { shouldSkipEnterpriseBootstrap } from '@/lib/runtime/dev-bootstrap-flags';

const env = { ...process.env };

describe('dev-bootstrap-flags', () => {
  afterEach(() => {
    process.env = { ...env };
  });

  it('never skips in production even when SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1', () => {
    process.env.NODE_ENV = 'production';
    process.env.SYNTH_SKIP_ENTERPRISE_BOOTSTRAP = '1';
    expect(shouldSkipEnterpriseBootstrap()).toBe(false);
  });

  it('skips in dev when SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1', () => {
    process.env.NODE_ENV = 'development';
    process.env.SYNTH_SKIP_ENTERPRISE_BOOTSTRAP = '1';
    expect(shouldSkipEnterpriseBootstrap()).toBe(true);
  });

  it('does not skip in dev without flag', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.SYNTH_SKIP_ENTERPRISE_BOOTSTRAP;
    expect(shouldSkipEnterpriseBootstrap()).toBe(false);
  });
});
