import type { ReactNode } from 'react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

/** Корневая оболочка legacy-экрана Production (как organization / brand profile). */
export function ProductionPageMainRoot({ children }: { children: ReactNode }) {
  return (
    <CabinetPageContent
      maxWidth="7xl"
      className="space-y-5 px-4 pb-20 md:px-0"
      role="main"
      aria-label="Production"
    >
      {children}
    </CabinetPageContent>
  );
}
