'use client';

import UserCabinetRouteLayout from '@/app/client/me/layout';

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <UserCabinetRouteLayout>{children}</UserCabinetRouteLayout>;
}
