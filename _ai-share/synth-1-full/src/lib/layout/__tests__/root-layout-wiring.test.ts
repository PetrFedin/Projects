import fs from 'node:fs';
import path from 'node:path';

/** Регрессия: gates бесполезны без RootClientProviders в server layout. */
describe('root layout provider wiring', () => {
  it('app/layout.tsx mounts RootClientProviders, not legacy provider stack', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
    expect(src).toContain('RootClientProviders');
    expect(src).not.toMatch(/from '@\/providers\/b2b-state'/);
    expect(src).not.toMatch(/from '@\/providers\/query-provider'/);
    expect(src).not.toMatch(/<B2BStateProvider>/);
    expect(src).not.toMatch(/<QueryProvider>/);
  });

  it('RootClientProviders includes route gates', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/layout/RootClientProviders.tsx'),
      'utf8'
    );
    expect(src).toContain('B2BStateProviderGate');
    expect(src).toContain('UIStateProviderGate');
    expect(src).toContain('QueryProviderGate');
    expect(src).toContain('NotificationsProviderGate');
    expect(src).toContain('BrandCenterProviderGate');
    expect(src).toContain('AuthProviderGate');
    expect(src).not.toMatch(/<AuthProvider>/);
  });

  it('AuthProviderGate lazy-loads auth chunk on public idle', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/layout/AuthProviderGate.tsx'),
      'utf8'
    );
    expect(src).toContain('scheduleIdleMount');
    expect(src).toContain('interactive={stubInteractive}');
    expect(src).toContain('onForceLoad={forceLoadProvider}');
  });
});
