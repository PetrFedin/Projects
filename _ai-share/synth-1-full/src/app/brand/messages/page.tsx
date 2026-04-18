'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import MessagesPage from '@/components/user/messages-os';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { CommunicationsUpcomingStrip } from '@/components/brand/communications/CommunicationsUpcomingStrip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, CheckCircle, Radio, Star, FileText } from 'lucide-react';
import { getCommLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

export default function BrandMessagesPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <div className="border-border-subtle bg-bg-surface2/90 supports-[backdrop-filter]:bg-bg-surface2/75 sticky top-0 z-30 -mx-4 space-y-2 border-b px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <CommunicationsNavBar currentPath="/brand/messages" />
        <CommunicationsUpcomingStrip />
      </div>
      <SectionInfoCard
        title="Сообщения"
        description="Чаты: команда (роли), B2B-байеры, производство, коллекции. Согласование заказов, PO, сэмплов. Задачи из чатов → в Календаре (слой Tasks). Calendar, Live, Reviews."
        icon={MessageSquare}
<<<<<<< HEAD
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
=======
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
>>>>>>> recover/cabinet-wip-from-stash
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Коммуникации
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/calendar?layers=tasks">
=======
              <Link href={`${ROUTES.brand.calendar}?layers=tasks`}>
>>>>>>> recover/cabinet-wip-from-stash
                <CheckCircle className="mr-1 h-3 w-3" /> Tasks
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/calendar">
=======
              <Link href={ROUTES.brand.calendar}>
>>>>>>> recover/cabinet-wip-from-stash
                <Calendar className="mr-1 h-3 w-3" /> Calendar
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/calendar?layers=events">Events</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/team">Team</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/documents">
=======
              <Link href={`${ROUTES.brand.calendar}?layers=events`}>Events</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.team}>Team</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.documents}>
>>>>>>> recover/cabinet-wip-from-stash
                <FileText className="mr-1 h-3 w-3" /> Documents
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/live">
=======
              <Link href={ROUTES.brand.live}>
>>>>>>> recover/cabinet-wip-from-stash
                <Radio className="mr-1 h-3 w-3" /> Live
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/reviews">
=======
              <Link href={ROUTES.brand.reviews}>
>>>>>>> recover/cabinet-wip-from-stash
                <Star className="mr-1 h-3 w-3" /> Reviews
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/b2b-orders">B2B</Link>
=======
              <Link href={ROUTES.brand.b2bOrders}>B2B</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </>
        }
      />
      <Suspense
<<<<<<< HEAD
        fallback={<div className="mx-4 p-6 text-sm text-slate-500">Загрузка сообщений…</div>}
      >
        <MessagesPage initialRole="brand" />
      </Suspense>
      <RelatedModulesBlock links={getCommLinks()} className="mx-4 mt-6" />
    </div>
=======
        fallback={<div className="text-text-secondary mx-4 p-6 text-sm">Загрузка сообщений…</div>}
      >
        <MessagesPage initialRole="brand" />
      </Suspense>
      <RelatedModulesBlock links={getCommLinks()} className="mt-6" />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
