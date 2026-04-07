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
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl pb-24">
      <SectionInfoCard
        title="Worker Skill Matrix"
        description="Уровни компетенций — floor-tab: worker-skills."
        icon={Users}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={<ProductionGanttBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold uppercase">Worker Skill Matrix</h1>
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

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="h-4 w-4" /> Сотрудники и компетенции
          </CardTitle>
          <CardDescription>Уровень 1–5 по операциям</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.workers.map((w, i) => (
              <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold">{w.name}</p>
                  <p className="text-[11px] text-slate-500">{w.operations.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Уровень</span>
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
    </div>
  );
}
