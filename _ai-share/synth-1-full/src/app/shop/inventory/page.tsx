'use client';

<<<<<<< HEAD
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
=======
import { RegistryPageShell } from '@/components/design-system';
import { SectionHeader } from '@/components/ui/section-header';
import { Package } from 'lucide-react';
import { InventoryPageContent } from '@/components/shop/inventory-page-content';

export default function InventoryPage() {
  return (
    <RegistryPageShell className="max-w-6xl space-y-6" data-testid="shop-inventory-page">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionHeader
        icon={Package}
        title="Управление ассортиментом"
        description="Управляйте каталогом, запрашивайте доступ к товарам брендов и обновляйте остатки."
      />
<<<<<<< HEAD
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <InventoryPageContent />
      </div>
    </div>
=======
      <div className="border-border-subtle bg-bg-surface2 overflow-hidden rounded-xl border shadow-sm">
        <InventoryPageContent />
      </div>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
