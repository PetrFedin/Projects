'use client';

import ClientLayout from '@/components/layout/client-layout';
import { BrandCenterProviderGate } from '@/components/layout/BrandCenterProviderGate';
import { DevOnlyChromeGate } from '@/components/layout/DevOnlyChromeGate';
import { RealtimeIntegrationsLayout } from '@/components/layout/RealtimeIntegrationsLayout';
import { QueryProviderGate } from '@/components/layout/QueryProviderGate';
import { UIStateProviderGate } from '@/components/layout/UIStateProviderGate';
import { B2BStateProviderGate } from '@/components/layout/B2BStateProviderGate';
import { AuthProviderGate } from '@/components/layout/AuthProviderGate';
import { NotificationsProviderGate } from '@/components/layout/NotificationsProviderGate';

/** Единая client-граница root layout — server layout остаётся лёгким. */
export function RootClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DevOnlyChromeGate />
      <QueryProviderGate>
        <AuthProviderGate>
          <BrandCenterProviderGate>
            <UIStateProviderGate>
              <B2BStateProviderGate>
                <NotificationsProviderGate>
                  <RealtimeIntegrationsLayout>
                    <ClientLayout>{children}</ClientLayout>
                  </RealtimeIntegrationsLayout>
                </NotificationsProviderGate>
              </B2BStateProviderGate>
            </UIStateProviderGate>
          </BrandCenterProviderGate>
        </AuthProviderGate>
      </QueryProviderGate>
    </>
  );
}
