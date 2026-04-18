'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, ArrowLeft, AlertTriangle, Save } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import type { QcInspection } from '@/lib/production/qc-app';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { RegistryPageShell } from '@/components/design-system';

const QC_DEFAULT: { v: 1; inspections: QcInspection[] } = {
  v: 1,
  inspections: [
    {
      id: 'qc1',
      orderId: 'PO-201',
      aqlLevel: '2.5',
      status: 'passed',
      inspectedCount: 80,
      defectCount: 0,
      defects: [],
      inspectedAt: '2026-03-10T14:00:00Z',
    },
    {
      id: 'qc2',
      orderId: 'PO-202',
      aqlLevel: '4.0',
      status: 'rework',
      inspectedCount: 120,
      defectCount: 3,
      defects: [{ id: 'd1', type: 'пятно', severity: 'major', position: 'спинка' }],
      inspectedAt: '2026-03-11T09:00:00Z',
    },
  ],
};

const statusLabels: Record<QcInspection['status'], string> = {
  draft: 'Черновик',
  in_progress: 'В работе',
  passed: 'Принято',
  rejected: 'Брак',
  rework: 'На доработку',
};

export default function QcAppPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('qc-app', QC_DEFAULT);

  const setInspection = (index: number, patch: Partial<QcInspection>) => {
    setData((prev) => {
      const inspections = [...prev.inspections];
      inspections[index] = { ...inspections[index], ...patch };
      return { ...prev, inspections };
    });
  };

  return (
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16">
      <SectionInfoCard
        title="Мобильный QC-модуль"
        description={
          <>
            Инспекции и статусы сохраняются в floor-tab: qc-app. Фото дефектов — после{' '}
            <AcronymWithTooltip abbr="API" /> (хранилище).
          </>
        }
        icon={Camera}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              <AcronymWithTooltip abbr="QC" /> • AQL 2.5/4.0
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.productionGoldSample}>Эталонный образец</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.returnsClaims}>Претензии</Link>
            </Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.production}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold uppercase">
            Мобильный <AcronymWithTooltip abbr="QC" />
            -модуль
          </h1>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Инспекции записаны (qc-app).' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" /> Инспекции
          </CardTitle>
          <CardDescription>
            Изменение статуса — локально до подключения серверного <AcronymWithTooltip abbr="API" />
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.inspections.map((q, i) => (
              <li
                key={q.id}
                className="bg-bg-surface2 border-border-subtle flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div>
                  <p className="font-mono font-medium">{q.orderId}</p>
                  <p className="text-text-secondary text-xs">
                    AQL {q.aqlLevel} · {q.inspectedCount} шт · {statusLabels[q.status]}
                  </p>
                  {q.defectCount > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle className="h-3 w-3" /> {q.defectCount} дефект(ов)
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={q.status}
                    onValueChange={(v) => setInspection(i, { status: v as QcInspection['status'] })}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusLabels) as QcInspection['status'][]).map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {statusLabels[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getProductionLinks()} />
    </RegistryPageShell>
  );
}
