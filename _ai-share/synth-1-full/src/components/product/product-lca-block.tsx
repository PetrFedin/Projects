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
        <CardTitle className="text-sm flex items-center justify-between">
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
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Droplets className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Вода</p>
              <p className="text-xs font-bold">{lca.waterLiters} л</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Wind className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">CO₂</p>
              <p className="text-xs font-bold">{lca.co2Kg} кг</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t flex items-start gap-2">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground leading-tight italic">
            Данные рассчитаны по средним индустриальным показателям для {lca.breakdown.map(b => b.label).join(', ')}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
