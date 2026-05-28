'use client';

import { UserCabinetRouteLayout } from '@/components/layout/client-cabinet-shell';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <UserCabinetRouteLayout>{children}</UserCabinetRouteLayout>;
}
