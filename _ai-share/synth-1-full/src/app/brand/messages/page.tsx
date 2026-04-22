'use client';

import { Suspense } from 'react';
import MessagesPage from '@/components/user/messages-os';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { CommunicationsNavBar } from '@/components/brand/communications/CommunicationsNavBar';
import { CommunicationsUpcomingStrip } from '@/components/brand/communications/CommunicationsUpcomingStrip';
import { MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function BrandMessagesPage() {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 space-y-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-slate-50/75">
        <CommunicationsNavBar currentPath={ROUTES.brand.messages} />
        <CommunicationsUpcomingStrip />
      </div>
      <div className="px-4">
        <SectionInfoCard
          title="Сообщения"
          description="Чаты команды и партнёров. Задачи с дедлайном можно вывести в календарь при сохранении."
          icon={MessageSquare}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
      </div>
      <Suspense fallback={<div className="mx-4 p-6 text-sm text-slate-500">Загрузка сообщений…</div>}>
        <MessagesPage initialRole="brand" />
      </Suspense>
    </div>
  );
}
