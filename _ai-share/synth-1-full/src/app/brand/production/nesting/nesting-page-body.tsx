'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionGanttBadges } from '@/components/brand/SectionBadgeCta';
import { ArrowLeft, Layers, Scissors, Save } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
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

type NestingJob = {
  id: string;
  po: string;
  fabric: string;
  markers: number;
  pieces: number;
  yield: number;
  status: 'ready' | 'optimizing' | 'draft';
};

const NESTING_DEFAULT = {
  v: 1 as const,
  jobs: [
    {
      id: 'N-01',
      po: 'PO-201',
      fabric: 'Wool melton 1,5 м',
      markers: 4,
      pieces: 892,
      yield: 94.2,
      status: 'ready' as const,
    },
    {
      id: 'N-02',
      po: 'PO-202',
      fabric: 'Cotton twill 1,45 м',
      markers: 6,
      pieces: 1240,
      yield: 88.7,
      status: 'optimizing' as const,
    },
    {
      id: 'N-03',
      po: 'PO-205',
      fabric: 'Lining viscose',
      markers: 2,
      pieces: 310,
      yield: 91.0,
      status: 'draft' as const,
    },
  ] satisfies NestingJob[],
};

export function NestingPageBody() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('nesting', NESTING_DEFAULT);

  const setJob = (index: number, patch: Partial<NestingJob>) => {
    setData((prev) => {
      const jobs = [...prev.jobs];
      jobs[index] = { ...jobs[index], ...patch };
      return { ...prev, jobs };
    });
  };

  return (
    <RegistryPageShell className="max-w-4xl space-y-6 pb-16">
      <SectionInfoCard
        title="Nesting ИИ · раскрой"
        description={
          <>
            Оптимизация раскладки лекал на рулон: после утверждённого плана{' '}
            <AcronymWithTooltip abbr="PO" /> и до запуска смен в цеху. Черновик сохраняется через
            ProductionDataPort (локальное хранилище / позже <AcronymWithTooltip abbr="API" />
            ).
          </>
        }
        icon={Scissors}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={<ProductionGanttBadges />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={ROUTES.brand.production}>
            <Button variant="ghost" size="icon" aria-label="Назад к цеху">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold uppercase tracking-tight">Nesting AI</h1>
          <Badge
            variant="outline"
            className="border-violet-200 bg-violet-50 text-[10px] font-bold uppercase text-violet-800"
=======
          <h1 className="text-2xl font-bold uppercase tracking-tight">Nesting ИИ</h1>
          <Badge
            variant="outline"
            className="border-accent-primary/25 bg-accent-primary/10 text-accent-primary text-[10px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Раскрой
          </Badge>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({
              title: 'Сохранено',
              description: 'Задания на раскрой записаны (floor-tab: nesting).',
            });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить черновик
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <Layers className="h-4 w-4" />
            Задания на раскрой
          </CardTitle>
          <CardDescription>
<<<<<<< HEAD
            Маркеры, выход деталей и статус; правки сохраняются локально до API
=======
            Маркеры, выход деталей и статус; правки сохраняются локально до{' '}
            <AcronymWithTooltip abbr="API" />
>>>>>>> recover/cabinet-wip-from-stash
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-border-default text-text-secondary border-b text-[10px] font-bold uppercase tracking-widest">
                <th className="pb-2 pr-3">Задание</th>
                <th className="pb-2 pr-3">
                  <AcronymWithTooltip abbr="PO" />
                </th>
                <th className="pb-2 pr-3">Ткань</th>
                <th className="pb-2 pr-2 text-right">Маркеры</th>
                <th className="pb-2 pr-2 text-right">Деталей</th>
                <th className="pb-2 pr-2">Выход</th>
                <th className="pb-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {data.jobs.map((row, i) => (
                <tr key={row.id} className="border-border-subtle border-b">
                  <td className="py-3 pr-3 font-mono text-[11px] font-bold">{row.id}</td>
                  <td className="py-3 pr-3 text-[11px]">{row.po}</td>
                  <td
<<<<<<< HEAD
                    className="max-w-[140px] truncate py-3 pr-3 text-[11px] text-slate-700"
=======
                    className="text-text-primary max-w-[140px] truncate py-3 pr-3 text-[11px]"
>>>>>>> recover/cabinet-wip-from-stash
                    title={row.fabric}
                  >
                    {row.fabric}
                  </td>
                  <td className="py-3 pr-2 text-right text-[11px]">{row.markers}</td>
                  <td className="py-3 pr-2 text-right text-[11px]">{row.pieces}</td>
                  <td className="w-36 py-3 pr-2">
                    <div className="flex items-center gap-2">
                      <Progress value={row.yield} className="h-1.5 flex-1" />
                      <span className="w-10 text-[10px] font-semibold tabular-nums">
                        {row.yield}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Select
                      value={row.status}
                      onValueChange={(v) => setJob(i, { status: v as NestingJob['status'] })}
                    >
                      <SelectTrigger className="h-8 w-[130px] text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Черновик</SelectItem>
                        <SelectItem value="optimizing">Оптимизация</SelectItem>
                        <SelectItem value="ready">Готово к резке</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </RegistryPageShell>
  );
}
