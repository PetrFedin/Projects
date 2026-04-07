'use client';

import { useState } from 'react';
import Link from 'next/link';
import PromotionsPage from "@/app/admin/promotions/page";
import { Button } from "@/components/ui/button";
import { PromotionDialog } from "@/components/brand/promotion-dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Megaphone, Package } from "lucide-react";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";

export default function BrandPromotionsPage() {
    const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);

    return (
        <>
            <div className="space-y-4">
                <SectionInfoCard
                    title="Продвижение"
                    description="Кампании, скидки, акции. ROI и конверсия. Связь с Products, Analytics и B2C."
                    icon={Megaphone}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                    badges={<><Badge variant="outline" className="text-[9px]">Products</Badge><Badge variant="outline" className="text-[9px]">Analytics</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products"><Package className="h-3 w-3 mr-1" /> Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/analytics">Analytics</Link></Button></>}
                />
                 <div className="flex justify-between items-center">
                     <header>
                        <h1 className="text-base font-bold font-headline">Управление продвижением</h1>
                        <p className="text-muted-foreground">Создавайте кампании и отслеживайте их эффективность.</p>
                    </header>
                    <Button onClick={() => setIsPromotionDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Создать продвижение
                    </Button>
                </div>
                <PromotionsPage isBrandView={true} />
            </div>
            <PromotionDialog 
                isOpen={isPromotionDialogOpen}
                onOpenChange={setIsPromotionDialogOpen}
            />
        </>
    );
}
