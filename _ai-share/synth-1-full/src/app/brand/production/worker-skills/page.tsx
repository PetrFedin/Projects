'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionGanttBadges } from '@/components/brand/SectionBadgeCta';
import { Users, Layers, Save } from 'lucide-react';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { RegistryPageShell } from '@/components/design-system';

type WorkerRow = { id: string; name: string; operations: string[]; level: number };

const WORKER_DEFAULT = {
  v: 1 as const,
  workers: [
    { id: '1', name: 'Анна К.', operations: ['Оверлок', 'Прямая строчка'], level: 4 },
    { id: '2', name: 'Олег П.', operations: ['Прямая строчка', 'Утюжка'], level: 3 },
  ] satisfies WorkerRow[],
};

export default function WorkerSkillsPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('worker-skills', WORKER_DEFAULT);

  const setLevel = (index: number, level: number) => {
    setData((prev) => {
      const workers = [...prev.workers];
      workers[index] = { ...workers[index], level: Math.min(5, Math.max(1, level)) };
      return { ...prev, workers };
    });
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
=======
    <RegistryPageShell className="max-w-4xl space-y-6 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Матрица навыков сотрудников"
        description={
          <>
            Уровни компетенций — floor-tab: worker-skills. Используется для производственных{' '}
            <AcronymWithTooltip abbr="KPI" /> по сменам.
          </>
        }
        icon={Users}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={<ProductionGanttBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold uppercase">Матрица навыков сотрудников</h1>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Матрица навыков записана.' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить
        </Button>
      </div>

      <Card className="border-border-default rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Layers className="h-4 w-4" /> Сотрудники и компетенции
          </CardTitle>
          <CardDescription>Уровень 1–5 по операциям</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.workers.map((w, i) => (
              <li
                key={w.id}
<<<<<<< HEAD
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
=======
                className="bg-bg-surface2 border-border-default flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div>
                  <p className="font-bold">{w.name}</p>
                  <p className="text-text-secondary text-[11px]">{w.operations.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-[10px]">Уровень</span>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    className="h-8 w-16 text-sm"
                    value={w.level}
                    onChange={(e) => setLevel(i, Number(e.target.value) || 1)}
                  />
                  <Badge variant="secondary">1–5</Badge>
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
