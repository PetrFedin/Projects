'use client';

import { TabsContent } from '@/components/ui/tabs';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabChatBody } from '@/app/brand/production/production-page-content-tab-chat-body';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabChat({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <TabsContent value="chat" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Обсуждения по коллекциям" barColor="bg-accent-primary" />
      <ProductionPageContentTabChatBody p={p} cn={cn} />
    </TabsContent>
  );
}
