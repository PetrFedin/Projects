'use client';

import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/ui/section-header";
import { Package } from "lucide-react";

const InventoryPageContent = dynamic(
  () => import("@/components/shop/inventory-page-content").then(mod => mod.InventoryPageContent),
  { ssr: false }
);

export default function InventoryPage() {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
            <SectionHeader
                icon={Package}
                title="Управление ассортиментом"
                description="Управляйте каталогом, запрашивайте доступ к товарам брендов и обновляйте остатки."
            />
            <div className="rounded-xl border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                <InventoryPageContent />
            </div>
        </div>
    );
}
