'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Suspense } from 'react';
import Link from 'next/link';
import MessagesPage from '@/components/user/messages-os';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { CommunicationsOperationalStrip } from '@/components/brand/communications/CommunicationsOperationalStrip';
import { CommunicationsUpcomingStrip } from '@/components/brand/communications/CommunicationsUpcomingStrip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, CheckCircle, Radio, Star, FileText } from 'lucide-react';
import {
  dedupeEntityLinksByHref,
  finalizeRelatedModuleLinks,
  getCommLinks,
  getSynthaThreeCoresQuickLinksForBrand,
} from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { B2bPriorityWorkflowPanel } from '@/components/b2b/B2bPriorityWorkflowPanel';
import { getSynthaThreeCoresFullMatrixGroups } from '@/lib/syntha-priority-cores';
import { ROUTES } from '@/lib/routes';
import { CommunicationsEntityContextBanner } from '@/components/brand/communications/CommunicationsEntityContextBanner';

export default function BrandMessagesPage() {
  return (
    <CabinetPageContent maxWidth="full" className="w-full space-y-4 pb-16">
      <div className="border-border-subtle bg-bg-surface2/90 supports-[backdrop-filter]:bg-bg-surface2/75 sticky top-0 z-30 -mx-4 space-y-2 border-b px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <CommunicationsNavBar currentPath="/brand/messages" />
        <CommunicationsUpcomingStrip />
        <CommunicationsOperationalStrip variant="brand" className="-mx-1 mt-1" />
        <Suspense fallback={null}>
          <CommunicationsEntityContextBanner variant="brand" className="-mx-1 mt-2 rounded-lg" />
        </Suspense>
      </div>
      <SectionInfoCard
        title="Сообщения"
        description="Основной канал для команд бренда и партнёров в процессе заказа: вопросы, согласования, звонки и договорённости ведите здесь; сроки и задачи дублируются в Календаре. Рядом — реестр B2B, коллекции, матрица, материалы и обучение для ритейла — всё связано одним процессом, без разрозненных мессенджеров."
        icon={MessageSquare}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Коммуникации
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href={`${ROUTES.brand.calendar}?layers=tasks`}>
                <CheckCircle className="mr-1 h-3 w-3" /> Tasks
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.calendar}>
                <Calendar className="mr-1 h-3 w-3" /> Calendar
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={`${ROUTES.brand.calendar}?layers=events`}>Events</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.team}>Team</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.documents}>
                <FileText className="mr-1 h-3 w-3" /> Documents
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.live}>
                <Radio className="mr-1 h-3 w-3" /> Live
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.reviews}>
                <Star className="mr-1 h-3 w-3" /> Reviews
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.b2bOrders}>B2B</Link>
            </Button>
          </>
        }
      />
      <Suspense
        fallback={<div className="text-text-secondary mx-4 p-6 text-sm">Загрузка сообщений…</div>}
      >
        <MessagesPage initialRole="brand" />
      </Suspense>
      <B2bPriorityWorkflowPanel
        title="Три ядра платформы — рядом с перепиской"
        lead="Чат — надстройка: полная вертикаль и горизонталь (цех, B2B, роли) доступны одним блоком, без смены контекста."
        groups={getSynthaThreeCoresFullMatrixGroups()}
        className="mt-4"
      />
      <RelatedModulesBlock
        title="Связанные операции и быстрые ядра"
        links={finalizeRelatedModuleLinks(
          dedupeEntityLinksByHref([...getCommLinks(), ...getSynthaThreeCoresQuickLinksForBrand()])
        )}
        className="mt-6"
      />
    </CabinetPageContent>
  );
}
