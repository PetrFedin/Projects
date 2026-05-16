'use client';

import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { CreatePOFromSamples } from '@/components/brand/production/CreatePOFromSamples';
import { SampleCommentsAndTracking } from '@/components/brand/production/SampleCommentsAndTracking';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ProductionPageContentTabSamplesBody } from '@/app/brand/production/production-page-content-tab-samples-body';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabSamples({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const {
    displaySampleStatuses,
    selectedSkuId,
    sampleComments,
    setSampleComments,
    filteredSampleStatuses,
    filteredMaterials,
    setIsAutoPOOpen,
    handleAction,
  } = px;

  return (
    <TabsContent value="samples" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Сэмплы" barColor="bg-amber-600" />
      <SectionInfoCard
        title="Сэмплы"
        description="Сэмпл связан с артикулом, коллекцией и фабрикой. Этапы: Proto1, Proto2, PP, Size Set. Утверждённые сэмплы позволяют создавать PO. Здесь вы отслеживаете сроки (SLA), статусы доставки и утверждения."
        icon={ClipboardCheck}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Этапы Proto → PP
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Утверждённые → PO
            </Badge>
          </>
        }
      />
      {selectedSkuId && (
        <SampleCommentsAndTracking
          skuId={selectedSkuId}
          skuName={displaySampleStatuses?.find((s: any) => s.skuId === selectedSkuId)?.skuName}
          comments={(sampleComments || {})[selectedSkuId]?.map(
            (c: { id: string; author: string; text: string; time: string }) => ({
              id: c.id,
              skuId: selectedSkuId,
              author: c.author,
              text: c.text,
              time: c.time,
            })
          )}
          tracking={
            displaySampleStatuses?.find((s: any) => s.skuId === selectedSkuId)?.tracking
          }
          onAddComment={(text) =>
            setSampleComments?.((prev: any) => ({
              ...prev,
              [selectedSkuId]: [
                ...(prev[selectedSkuId] || []),
                { id: String(Date.now()), author: 'Вы', text, time: 'Сейчас' },
              ],
            }))
          }
          onRemind={() => handleAction?.('Напоминание', 'Напоминание отправлено фабрике')}
        />
      )}
      <CreatePOFromSamples
        approvedSamples={(filteredSampleStatuses || [])
          .filter((s: any) => s.status === 'approved')
          .map((s: any) => ({
            skuId: s.skuId,
            skuName: s.skuName,
            collection: s.collection,
            status: s.status,
            stage: s.stage,
            approved: true,
          }))}
        materialsOk={(filteredMaterials || []).length > 0}
        onCreatePO={() => setIsAutoPOOpen?.(true)}
      />
      <ProductionPageContentTabSamplesBody p={p} cn={cn} />
    </TabsContent>
  );
}
