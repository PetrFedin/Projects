'use client';

import { QrCode, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { MarketplaceLabelStatus } from '@/components/brand/MarketplaceLabelStatus';
import { SustainabilityAudit } from '@/components/brand/SustainabilityAudit';
import { DefectHeatmap } from '@/components/brand/DefectHeatmap';
import {
  AQLCalculator,
  CertExpiryReminder,
} from '@/components/brand/production/ProductionEnhancementsHub';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCompliance({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setComplianceView, complianceView, setIsLabellingWizardOpen } = px;

  return (
    <TabsContent value="compliance" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Закон / QC" barColor="bg-emerald-600" />
      <SectionInfoCard
        title="Закон / QC"
        description="Маркировка, QC-отчёты, паспорта, сертификаты, эко и дефекты. QC привязан к PO. Маркировка — к артикулам и коллекциям. AQL-калькулятор, напоминания о сертификатах."
        icon={ShieldCheck}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              QC → PO
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Маркировка
            </Badge>
          </>
        }
      />
      <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1">
        {(['marking', 'qc', 'passport', 'certs', 'eco', 'defects'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setComplianceView?.(v)}
            className={cn(
              'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
              complianceView === v
                ? 'text-accent-primary bg-white shadow-sm'
                : 'text-text-secondary'
            )}
          >
            {v === 'marking' && 'Маркировка'}
            {v === 'qc' && 'QC'}
            {v === 'passport' && 'Паспорт'}
            {v === 'certs' && 'Сертификаты'}
            {v === 'eco' && 'Эко-аудит'}
            {v === 'defects' && 'Дефекты'}
          </button>
        ))}
      </div>
      {complianceView === 'eco' && <SustainabilityAudit />}
      {complianceView === 'defects' && <DefectHeatmap />}
      {complianceView === 'qc' && (
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <AQLCalculator />
          <CertExpiryReminder />
        </div>
      )}
      {!['eco', 'defects', 'qc'].includes(complianceView || '') && (
        <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
              <ShieldCheck className="h-4 w-4" /> Маркировка и соответствие
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarketplaceLabelStatus />
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsLabellingWizardOpen?.(true)}
            >
              <QrCode className="mr-1 h-3.5 w-3.5" /> Маркировка
            </Button>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
