'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, BarChart3, Smartphone } from 'lucide-react';
import { B2BModulePage } from '@/components/shop/B2BModulePage';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/** Sellty/Compo: личный кабинет дилера — документы, отчёты, аналитика. */
export default function B2BDealerCabinetPage() {
  return (
    <B2BModulePage
      title="Личный кабинет дилера"
      description="Документы, отчёты, аналитика для партнёра (Sellty, Compo)"
      moduleId="dealer-cabinet"
      icon={LayoutDashboard}
      phase={4}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Документы</CardTitle>
            <CardDescription>Счета, накладные, акты, договоры.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Открыть</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Аналитика</CardTitle>
            <CardDescription>Продажи по брендам, топ SKU, sell-through.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">Открыть</Button>
          </CardContent>
        </Card>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={ROUTES.shop.b2bScanner}><Smartphone className="h-3 w-3 mr-1" /> Sales App (мобильное)</Link>
      </Button>
    </B2BModulePage>
  );
}
