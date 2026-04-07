'use client';

import Link from 'next/link';
import { VisualMerchandiser } from "@/components/brand/VisualMerchandiser";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Package, ShoppingBag, Target } from "lucide-react";

export default function MerchandisingPage() {
    return (
        <div className="container mx-auto px-4 py-4 space-y-4 pb-24">
            <SectionInfoCard
                title="Digital Rack Planner"
                description="Визуальный мерчандайзинг для шоурума и байеров. Связь с Products (каталог), B2B (линии) и Showroom."
                icon={LayoutGrid}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                badges={<><Badge variant="outline" className="text-[9px]">Products</Badge><Badge variant="outline" className="text-[9px]">Showroom</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/range-planner"><Target className="h-3 w-3 mr-1" /> Range Planner</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/products"><Package className="h-3 w-3 mr-1" /> Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/showroom"><ShoppingBag className="h-3 w-3 mr-1" /> Showroom</Link></Button></>}
            />
            <VisualMerchandiser />
        </div>
    );
}
