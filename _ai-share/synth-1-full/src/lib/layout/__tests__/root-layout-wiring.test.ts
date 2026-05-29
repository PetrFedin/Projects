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

  it('RealtimeIntegrationsLayout skips WebSocket on light cabinets (no NotificationsProvider)', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/layout/RealtimeIntegrationsLayout.tsx'),
      'utf8'
    );
    expect(src).toContain('shouldMountB2BStateProvider');
    expect(src).toContain('usePathname');
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

  it('ClientLayout uses RouteGuardGate instead of sync RouteGuard', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/layout/client-layout.tsx'),
      'utf8'
    );
    expect(src).toContain('RouteGuardGate');
    expect(src).not.toMatch(/from '@\/components\/route-guard'/);
  });

  it('ClientLayout uses RolePanelGate (idle) instead of eager RolePanel', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/layout/client-layout.tsx'),
      'utf8'
    );
    expect(src).toContain('RolePanelGate');
    expect(src).not.toMatch(/import\(['"]\.\/role-panel['"]\)/);
    expect(src).not.toMatch(/<RolePanel\s*\/>/);
  });

  it('app/page.tsx passes RSC CMS + products baselines', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/page.tsx'), 'utf8');
    expect(src).toContain('getHomeCmsServerBaseline');
    expect(src).toContain('getHomeProductsServerBaseline');
    expect(src).toContain('initialProducts');
  });

  it('HomePageClient seeds CMS + products cache before shell prefetch', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/home/HomePageClient.tsx'),
      'utf8'
    );
    expect(src).toContain('useSeedHomeCmsConfig');
    expect(src).toContain('useSeedHomeProductsCatalog');
  });
});
