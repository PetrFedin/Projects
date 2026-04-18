'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getRelatedLinks } from '@/lib/data/integration-modules';

/** JOOR, FashionGo: Market Week / Trade Show — CPM, МФН и др. события. */
export default function BrandB2BTradeShowsPage() {
  const links = getRelatedLinks('trade-show').map((l) => ({ label: l.label, href: l.href }));

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      <SectionInfoCard
        title="Market Week / Trade Show"
        description="CPM, МФН и др. события. Календарь выставок, инвайты байерам, заказы с события."
        icon={Calendar}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16 duration-700 animate-in fade-in">
      <RegistryPageHeader
        title="Market Week / Trade Show"
        leadPlain="CPM, МФН и др. события. Календарь выставок, инвайты байерам, заказы с события."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Calendar className="size-6 shrink-0 text-muted-foreground" aria-hidden />
>>>>>>> recover/cabinet-wip-from-stash
            <Badge variant="outline" className="text-[9px]">
              JOOR
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              FashionGo
            </Badge>
<<<<<<< HEAD
          </>
=======
          </div>
>>>>>>> recover/cabinet-wip-from-stash
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Ближайшие события</CardTitle>
          <CardDescription>CPM, МФН, сезонные показы.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
<<<<<<< HEAD
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <MapPin className="h-4 w-4 text-slate-400" />
=======
            <div className="border-border-subtle bg-bg-surface2 flex items-center gap-2 rounded-lg border p-3">
              <MapPin className="text-text-muted size-4" />
>>>>>>> recover/cabinet-wip-from-stash
              <span>CPM Moscow — 15–18.04.2026</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <Link href={ROUTES.shop.b2bCollaborativeOrder}>Collaborative Order</Link>
          </Button>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={links} title="Связанные модули" />
    </RegistryPageShell>
  );
}
