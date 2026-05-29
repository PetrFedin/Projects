'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { shouldMountRouteGuard } from '@/lib/auth/route-guard-route';

const RouteGuard = dynamic(
  () => import('@/components/route-guard').then((module) => ({ default: module.RouteGuard })),
  { ssr: false }
);

/** Lazy RouteGuard — public shell skips sync auth/RBAC chunk until cabinet navigation. */
export function RouteGuardGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (!shouldMountRouteGuard(pathname)) {
    return <>{children}</>;
  }
  return <RouteGuard>{children}</RouteGuard>;
}
