'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
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
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { ROUTES } from '@/lib/routes';

const STAGES = ['Прототип 1', 'Прототип 2', 'PP / Gold'] as const;

type FitSample = {
  id: string;
  sku: string;
  name: string;
  stage: (typeof STAGES)[number];
  comments: string;
  hasPhoto: boolean;
};

type FitCommentsDraft = { v: 1; samples: FitSample[]; selectedId: string };

const FIT_DEFAULT: FitCommentsDraft = {
  v: 1,
  samples: [
    {
      id: 'S-101',
      sku: 'CP-001',
      name: 'Cyber Parka',
      stage: 'Прототип 2',
      comments: 'Укоротить рукав на 2 см',
      hasPhoto: true,
    },
    {
      id: 'S-102',
      sku: 'CR-002',
      name: 'Cargo Pants',
      stage: 'PP / Gold',
      comments: 'Готово к утверждению',
      hasPhoto: true,
    },
    {
      id: 'S-103',
      sku: 'OS-003',
      name: 'Overshirt',
      stage: 'Прототип 1',
      comments: '',
      hasPhoto: false,
    },
  ],
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
    <CabinetPageContent maxWidth="5xl" className="space-y-6 pb-16">
      <SectionInfoCard
        title="Журнал комментариев по примеркам"
        description={
          <>
            Образцы и комментарии — floor-tab: fit-comments. Загрузка фото — после{' '}
            <AcronymWithTooltip abbr="API" />.
          </>
        }
        icon={ClipboardCheck}
        iconBg="bg-teal-100"
        iconColor="text-teal-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Прототип → эталон
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.production}>Производство</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.productionGoldSample}>Эталонный образец</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.marketingSamples}>Промо-образцы</Link>
            </Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold uppercase">Журнал комментариев по примеркам</h1>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border-default rounded-xl border shadow-sm md:col-span-1">
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
                      'w-full rounded-xl border p-3 text-left transition-all',
                      data.selectedId === s.id
                        ? 'border-teal-200 bg-teal-50'
                        : 'bg-bg-surface2 border-border-default hover:border-teal-200'
                    )}
                  >
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-text-secondary text-[10px]">
                      {s.sku} · {s.stage}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border-default rounded-xl border shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
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
                          samples: prev.samples.map((x) =>
                            x.id === sample.id ? { ...x, stage: st } : x
                          ),
                        }))
                      }
                      className={cn(
                        'rounded-xl border p-3 text-center',
                        sample.stage === st
                          ? 'border-teal-200 bg-teal-50'
                          : 'bg-bg-surface2 border-border-default'
                      )}
                    >
                      <p className="text-text-secondary text-[10px] font-bold uppercase">{st}</p>
                      {sample.stage === st && (
                        <CheckCircle2 className="mx-auto mt-1 h-5 w-5 text-teal-600" />
                      )}
                    </button>
                  ))}
                </div>
                {sample.comments && (
                  <div className="bg-bg-surface2 border-border-default rounded-lg border p-3">
                    <p className="text-text-secondary text-[10px] font-bold uppercase">
                      Комментарии
                    </p>
                    <p className="whitespace-pre-wrap text-sm">{sample.comments}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Input
                    placeholder="Добавить комментарий по посадке..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-w-[200px] flex-1 rounded-lg"
                  />
                  <Button
                    size="sm"
                    className="shrink-0 rounded-lg"
                    type="button"
                    onClick={appendComment}
                  >
                    Добавить в журнал
                  </Button>
                  <Button size="sm" variant="outline" className="shrink-0 rounded-lg" type="button">
                    <Upload className="mr-1 h-4 w-4" /> Загрузить фото
                  </Button>
                </div>
                <div className="border-border-default text-text-muted flex h-24 items-center justify-center rounded-xl border border-dashed text-sm">
                  {sample.hasPhoto
                    ? 'Фото образца (плейсхолдер)'
                    : 'Перетащите фото или нажмите «Загрузить фото»'}
                </div>
              </>
            ) : (
              <p className="text-text-secondary text-sm">Выберите образец слева</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.productionGoldSample}>Утвердить эталонный образец</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.marketingHeritageTimeline}>Heritage Timeline</Link>
        </Button>
      </div>

      <RelatedModulesBlock links={getProductionLinks()} />
    </CabinetPageContent>
  );
}
