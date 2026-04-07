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

export default function BrandMessagesPage() {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 space-y-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-slate-50/75">
        <CommunicationsNavBar currentPath="/brand/messages" />
        <CommunicationsUpcomingStrip />
      </div>
      <SectionInfoCard
        title="Сообщения"
        description="Чаты: команда (роли), B2B-байеры, производство, коллекции. Согласование заказов, PO, сэмплов. Задачи из чатов → в Календаре (слой Tasks). Calendar, Live, Reviews."
        icon={MessageSquare}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<><Badge variant="outline" className="text-[9px]">Коммуникации</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/calendar?layers=tasks"><CheckCircle className="h-3 w-3 mr-1" /> Tasks</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/calendar"><Calendar className="h-3 w-3 mr-1" /> Calendar</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/calendar?layers=events">Events</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/team">Team</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/documents"><FileText className="h-3 w-3 mr-1" /> Documents</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/live"><Radio className="h-3 w-3 mr-1" /> Live</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/reviews"><Star className="h-3 w-3 mr-1" /> Reviews</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/b2b-orders">B2B</Link></Button></>}
      />
      <Suspense fallback={<div className="mx-4 p-6 text-sm text-slate-500">Загрузка сообщений…</div>}>
        <MessagesPage initialRole="brand" />
      </Suspense>
      <RelatedModulesBlock links={getCommLinks()} className="mt-6 mx-4" />
    </div>
  );
}
