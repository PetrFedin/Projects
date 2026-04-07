'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ShieldCheck, FileCheck, Save } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';

const GOLD_DEFAULT = {
  v: 1 as const,
  notes: '',
  designerOk: false,
  technologistOk: false,
  buyerOk: false,
  edoSigned: false,
};

export default function GoldSamplePage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('gold-sample', GOLD_DEFAULT);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Gold Sample Approval"
        description="Маршрут и заметки сохраняются локально (floor-tab: gold-sample). После API — ЭДО и подписи в HttpProductionDataPort."
        icon={ShieldCheck}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={<><Badge variant="outline" className="text-[9px]">ЭДО</Badge><Badge variant="outline" className="text-[9px]">ЭЦП</Badge><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/compliance">Compliance</Link></Button></>}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold uppercase">Gold Sample Approval</h1>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Черновик маршрута Gold Sample записан.' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить
        </Button>
      </div>
      <Card className="rounded-xl border border-emerald-100 bg-emerald-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" /> Утверждение эталона
          </CardTitle>
          <CardDescription>Отметьте шаги маршрута и комментарии до подключения ЭЦП</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              [
                ['designerOk', 'Дизайнер согласовал'] as const,
                ['technologistOk', 'Технолог согласовал'] as const,
                ['buyerOk', 'Заказчик / бренд'] as const,
                ['edoSigned', 'ЭДО / ЭЦП (плейсхолдер)'] as const,
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={Boolean(data[key])}
                  onCheckedChange={(c) => setData((prev) => ({ ...prev, [key]: Boolean(c) }))}
                />
                {label}
              </label>
            ))}
          </div>
          <div>
            <Label className="text-xs">Заметки</Label>
            <Textarea
              className="mt-1 min-h-[88px]"
              value={data.notes}
              onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Условия утверждения, отклонения, ссылки на акты…"
            />
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getProductionLinks()} />
    </div>
  );
}
