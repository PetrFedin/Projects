'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getRelatedLinks } from '@/lib/data/integration-modules';

/** JOOR, FashionGo: Market Week / Trade Show — CPM, МФН и др. события. */
export default function BrandB2BTradeShowsPage() {
  const links = getRelatedLinks('trade-show').map((l) => ({ label: l.label, href: l.href }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl animate-in fade-in duration-700">
      <SectionInfoCard
        title="Market Week / Trade Show"
        description="CPM, МФН и др. события. Календарь выставок, инвайты байерам, заказы с события."
        icon={Calendar}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">JOOR</Badge>
            <Badge variant="outline" className="text-[9px]">FashionGo</Badge>
          </>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Ближайшие события</CardTitle>
          <CardDescription>CPM, МФН, сезонные показы.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>CPM Moscow — 15–18.04.2026</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <Link href={ROUTES.shop.b2bCollaborativeOrder}>Collaborative Order</Link>
          </Button>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={links} title="Связанные модули" />
    </div>
  );
}
