'use client';

import type { ReactNode } from 'react';
import { useIsLgUp } from '@/hooks/use-lg-up';

/** Не монтирует children ниже `lg` — desktop sidebar скрыт CSS, но без лишних chunks на mobile. */
export function CabinetDesktopOnly({ children }: { children: ReactNode }) {
  const isLgUp = useIsLgUp();
  if (!isLgUp) return null;
  return children;
}
