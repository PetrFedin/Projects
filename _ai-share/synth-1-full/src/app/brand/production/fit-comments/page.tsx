'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ClipboardCheck, CheckCircle2, Upload, Save } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { cn } from '@/lib/utils';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';

const STAGES = ['Proto 1', 'Proto 2', 'PP / Gold'] as const;

type FitSample = {
  id: string;
  sku: string;
  name: string;
  stage: (typeof STAGES)[number];
  comments: string;
  hasPhoto: boolean;
};

const FIT_DEFAULT = {
  v: 1 as const,
  samples: [
    { id: 'S-101', sku: 'CP-001', name: 'Cyber Parka', stage: 'Proto 2' as const, comments: 'Укоротить рукав на 2 см', hasPhoto: true },
    { id: 'S-102', sku: 'CR-002', name: 'Cargo Pants', stage: 'PP / Gold' as const, comments: 'Готово к утверждению', hasPhoto: true },
    { id: 'S-103', sku: 'OS-003', name: 'Overshirt', stage: 'Proto 1' as const, comments: '', hasPhoto: false },
  ] satisfies FitSample[],
  selectedId: 'S-101',
};

export default function FitCommentsPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('fit-comments', FIT_DEFAULT);
  const [comment, setComment] = useState('');

  const sample = data.samples.find((s) => s.id === data.selectedId);

  const appendComment = () => {
    const t = comment.trim();
    if (!t || !data.selectedId) return;
    setData((prev) => ({
      ...prev,
      samples: prev.samples.map((s) =>
        s.id === prev.selectedId ? { ...s, comments: s.comments ? `${s.comments}\n${t}` : t } : s
      ),
    }));
    setComment('');
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Fit Comments Log"
        description="Образцы и комментарии — floor-tab: fit-comments. Загрузка фото — после API."
        icon={ClipboardCheck}
        iconBg="bg-teal-100"
        iconColor="text-teal-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Proto → Gold</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production/gold-sample">Gold Sample</Link></Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/marketing/samples">PR Samples</Link></Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold uppercase">Fit Comments Log</h1>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Журнал примерок записан.' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить всё
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Образцы</CardTitle>
            <CardDescription>Выберите образец</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.samples.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setData((prev) => ({ ...prev, selectedId: s.id }))}
                    className={cn(
                      'w-full text-left p-3 rounded-xl border transition-all',
                      data.selectedId === s.id ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200 hover:border-teal-200'
                    )}
                  >
                    <p className="font-bold text-sm">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.sku} · {s.stage}</p>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              {sample ? `${sample.name} (${sample.stage})` : 'Журнал примерок'}
            </CardTitle>
            <CardDescription>Аннотации на фото/видео: посадка, изменения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sample ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {STAGES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          samples: prev.samples.map((x) => (x.id === sample.id ? { ...x, stage: st } : x)),
                        }))
                      }
                      className={cn(
                        'p-3 rounded-xl border text-center',
                        sample.stage === st ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <p className="text-[10px] font-bold uppercase text-slate-500">{st}</p>
                      {sample.stage === st && <CheckCircle2 className="h-5 w-5 mx-auto mt-1 text-teal-600" />}
                    </button>
                  ))}
                </div>
                {sample.comments && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Комментарии</p>
                    <p className="text-sm whitespace-pre-wrap">{sample.comments}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Input placeholder="Добавить комментарий по посадке..." value={comment} onChange={(e) => setComment(e.target.value)} className="rounded-lg flex-1 min-w-[200px]" />
                  <Button size="sm" className="rounded-lg shrink-0" type="button" onClick={appendComment}>
                    Добавить в журнал
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg shrink-0" type="button">
                    <Upload className="h-4 w-4 mr-1" /> Загрузить фото
                  </Button>
                </div>
                <div className="h-24 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                  {sample.hasPhoto ? 'Фото образца (плейсхолдер)' : 'Перетащите фото или нажмите «Загрузить фото»'}
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm">Выберите образец слева</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/brand/production/gold-sample">Утвердить Gold Sample</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/brand/marketing/heritage-timeline">Heritage Timeline</Link>
        </Button>
      </div>

      <RelatedModulesBlock links={getProductionLinks()} />
    </div>
  );
}
