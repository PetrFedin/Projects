'use client';

import dynamic from 'next/dynamic';
import { SectionHeader } from '@/components/ui/section-header';
import { Package } from 'lucide-react';

const InventoryPageContent = dynamic(
  () => import('@/components/shop/inventory-page-content').then((mod) => mod.InventoryPageContent),
  { ssr: false }
);

export default function InventoryPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6">
      <SectionHeader
        icon={Package}
        title="Управление ассортиментом"
        description="Управляйте каталогом, запрашивайте доступ к товарам брендов и обновляйте остатки."
      />
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <InventoryPageContent />
      </div>
    </div>
  );
}
