'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { calculateLcaScore } from '@/lib/fashion/lca-logic';
import { Leaf, Droplets, Wind, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = { product: Product };

export function ProductLcaBlock({ product }: Props) {
  const lca = calculateLcaScore(product);

  const gradeColors: Record<string, string> = {
    A: 'bg-emerald-500',
    B: 'bg-lime-500',
    C: 'bg-yellow-500',
    D: 'bg-orange-500',
    E: 'bg-rose-500',
  };

  return (
    <Card className="mt-4 border-emerald-500/20 bg-emerald-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            Экологический след (LCA)
          </div>
          <Badge className={gradeColors[lca.grade]}>Grade {lca.grade}</Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Оценка на основе состава материалов. В проде — сертификаты Higg / LCA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium">
            <span>Sustainability Score</span>
            <span>{lca.totalScore}/100</span>
          </div>
          <Progress value={lca.totalScore} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Droplets className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Вода</p>
              <p className="text-xs font-bold">{lca.waterLiters} л</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <Wind className="h-4 w-4 text-slate-600" />
=======
            <div className="bg-bg-surface2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <Wind className="text-text-secondary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">CO₂</p>
              <p className="text-xs font-bold">{lca.co2Kg} кг</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 border-t pt-2">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <p className="text-[9px] italic leading-tight text-muted-foreground">
            Данные рассчитаны по средним индустриальным показателям для{' '}
            {lca.breakdown.map((b) => b.label).join(', ')}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
