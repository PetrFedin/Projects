'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { CollaborativeBuy } from '@/components/brand/CollaborativeBuy';

export default function CollaborativeBuyPage() {
  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
      <CollaborativeBuy />
    </CabinetPageContent>
  );
}
