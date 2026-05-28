'use client';

import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { ApprovalWorkflow } from '@/components/brand/ApprovalWorkflow';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabApproval() {
  return (
    <TabsContent value="approval" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Утверждения" barColor="bg-emerald-600" />
      <SectionInfoCard
        title="Утверждения"
        description="Принятие сэмплов перед созданием PO. Статусы: ожидает, на проверке, утверждён/отклонён. Маршрут согласования, комментарии и причина отклонения — для прозрачности решений."
        icon={ShieldCheck}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Сэмплы → PO
            </Badge>
          </>
        }
      />
      <ApprovalWorkflow />
    </TabsContent>
  );
}
