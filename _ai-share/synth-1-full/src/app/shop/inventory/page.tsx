'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { SectionHeader } from '@/components/ui/section-header';
import { Package } from 'lucide-react';
import { InventoryPageContent } from '@/components/shop/inventory-page-content';

export default function InventoryPage() {
  return (
    <CabinetPageContent maxWidth="6xl" className="space-y-6" data-testid="shop-inventory-page">
      <SectionHeader
        icon={Package}
        title="Управление ассортиментом"
        description="Управляйте каталогом, запрашивайте доступ к товарам брендов и обновляйте остатки."
      />
      <div className="border-border-subtle bg-bg-surface2 overflow-hidden rounded-xl border shadow-sm">
        <InventoryPageContent />
      </div>
    </CabinetPageContent>
  );
}
