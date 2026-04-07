'use client';

import { type ReactNode } from 'react';
import { useRbac } from '@/hooks/useRbac';
import type { Resource, Action } from '@/lib/rbac';

/** Скрывает children, если у пользователя нет can(resource, action). */
export function FeatureGate({
  resource,
  action = 'view',
  children,
  fallback = null,
}: {
  resource: Resource;
  action?: Action;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useRbac();
  if (!can(resource, action)) return <>{fallback}</>;
  return <>{children}</>;
}
