'use client';

import Link from 'next/link';
import { BrandDashboardWidgets } from "@/components/brand/brand-dashboard-widgets";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart3, Factory, ShoppingBag } from "lucide-react";

export default function BrandDashboardPage() {
    return (
        <div className="space-y-6">
            <SectionInfoCard
                title="Главный дашборд"
                description="Сводка по бренду: KPI, алерты, каналы. Центр управления — детальная аналитика. Связь с Production, B2B, Finance."
                icon={LayoutDashboard}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                badges={<><Badge variant="outline" className="text-[9px]">KPI</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/control-center"><BarChart3 className="h-3 w-3 mr-1" /> Центр управления</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production"><Factory className="h-3 w-3 mr-1" /> Production</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/b2b-orders"><ShoppingBag className="h-3 w-3 mr-1" /> B2B</Link></Button></>}
            />
            <BrandDashboardWidgets />
        </div>
    );
}
