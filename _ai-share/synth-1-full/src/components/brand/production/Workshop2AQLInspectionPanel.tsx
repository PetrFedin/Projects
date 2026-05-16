'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAqlPlan, AqlLevel } from '@/lib/production/aql-standards';

import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2AQLInspectionPanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { bundle, mergeBundle } = useArticleWorkspace();
  const qc = bundle?.qc;
  const batches = qc?.batches || [];

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  
  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const [fallbackOrderQty, setFallbackOrderQty] = useState<number>(1000);
  const [aqlLevel, setAqlLevel] = useState<string>('2.5');
  const [criticalFound, setCriticalFound] = useState<number>(0);
  const [fallbackMajorFound, setFallbackMajorFound] = useState<number>(0);
  const [minorFound, setMinorFound] = useState<number>(0);

  const orderQty = activeBatch ? (activeBatch.batchSize || 0) : fallbackOrderQty;
  const majorFound = activeBatch ? (activeBatch.majorDefects || 0) : fallbackMajorFound;

  const handleOrderQtyChange = (val: number) => {
    if (activeBatch && qc) {
      void mergeBundle({
        qc: {
          ...qc,
          batches: qc.batches.map(b => 
            b.id === activeBatch.id ? { ...b, batchSize: val } : b
          )
        }
      });
    } else {
      setFallbackOrderQty(val);
    }
  };

  const handleMajorFoundChange = (val: number) => {
    if (activeBatch && qc) {
      void mergeBundle({
        qc: {
          ...qc,
          batches: qc.batches.map(b => 
            b.id === activeBatch.id ? { ...b, majorDefects: val } : b
          )
        }
      });
    } else {
      setFallbackMajorFound(val);
    }
  };

  const aqlLevelTyped = aqlLevel as AqlLevel;
  const majorAqlPlan = getAqlPlan(orderQty, aqlLevelTyped);
  // For minor defects, ISO usually suggests a more relaxed AQL level by shifting index.
  const minorAqlLevel = aqlLevelTyped === '1.5' ? '2.5' : aqlLevelTyped === '2.5' ? '4.0' : '4.0';
  const minorAqlPlan = getAqlPlan(orderQty, minorAqlLevel as AqlLevel);

  const sampleSize = majorAqlPlan.sampleSize;

  const isFail =
    criticalFound > 0 || majorFound >= majorAqlPlan.rejectLimit || minorFound >= minorAqlPlan.rejectLimit;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Калькулятор инспекции (AQL)</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Расчет объема выборки и порогов брака по стандарту ISO 2859-1 (AQL).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {batches.length > 0 && (
            <Select value={activeBatch?.id || ''} onValueChange={setSelectedBatchId}>
              <SelectTrigger className="w-[180px] h-8 text-xs bg-white">
                <SelectValue placeholder="Выберите партию" />
              </SelectTrigger>
              <SelectContent>
                {batches.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5 mt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Объём выборки: {sampleSize}
          </span>
          <span className="text-text-primary max-w-full rounded border border-border-subtle bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {isFail ? 'Брак превышает норму' : 'Инспекция в норме'}
          </span>
          <span className={cn("text-text-primary max-w-full rounded border px-2 py-1 text-[10px] font-semibold leading-snug", isFail ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
            <span className="font-bold opacity-80">Итог</span> · {isFail ? 'БРАК' : 'ПРИНЯТО'}
          </span>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute right-4 top-0 z-10 hidden opacity-90 md:block">
          <div
            className={cn(
              'rotate-12 rounded-lg border-4 px-6 py-2 text-4xl font-bold uppercase tracking-widest',
              isFail
                ? 'border-red-500 bg-red-50/50 text-red-500'
                : 'border-emerald-500 bg-emerald-50/50 text-emerald-500'
            )}
          >
            {isFail ? 'БРАК' : 'ПРИНЯТО'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-6">
          <div className="space-y-2">
            <Label className="text-text-secondary">Размер партии (шт.)</Label>
            <Input
              type="number"
              value={orderQty}
              onChange={(e) => handleOrderQtyChange(Number(e.target.value))}
              min={1}
              className="font-mono text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">Уровень AQL</Label>
            <Select value={aqlLevel} onValueChange={setAqlLevel}>
              <SelectTrigger className="font-mono text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5 (жёсткий)</SelectItem>
                <SelectItem value="2.5">2.5 (стандарт)</SelectItem>
                <SelectItem value="4.0">4.0 (смягчённый)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">Объём выборки</Label>
            <div className="font-mono text-3xl font-bold text-text-primary">{sampleSize}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">Итог</Label>
            <div className="mt-1 flex items-center gap-2">
              {isFail ? (
                <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
                  <XCircle className="h-6 w-6" /> Не принято
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lg font-semibold text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" /> Принято
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border-subtle">
          <Table>
            <TableHeader className="bg-bg-surface2">
              <TableRow>
                <TableHead className="w-[200px]">Тип дефекта</TableHead>
                <TableHead>Пороги (принять / отклонить)</TableHead>
                <TableHead>Найдено</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-red-600">Критический</TableCell>
                <TableCell className="font-mono">0 / 1</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={criticalFound}
                    onChange={(e) => setCriticalFound(Number(e.target.value))}
                    min={0}
                    className="w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  {criticalFound > 0 ? (
                    <Badge variant="destructive">Брак</Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Норма
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-amber-600">Значительный</TableCell>
                <TableCell className="font-mono">
                  {majorAqlPlan.acceptLimit} / {majorAqlPlan.rejectLimit}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={majorFound}
                    onChange={(e) => handleMajorFoundChange(Number(e.target.value))}
                    min={0}
                    className="w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  {majorFound >= majorAqlPlan.rejectLimit ? (
                    <Badge variant="destructive">Брак</Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Норма
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-blue-600">Незначительный</TableCell>
                <TableCell className="font-mono">
                  {minorAqlPlan.acceptLimit} / {minorAqlPlan.rejectLimit}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={minorFound}
                    onChange={(e) => setMinorFound(Number(e.target.value))}
                    min={0}
                    className="w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  {minorFound >= minorAqlPlan.rejectLimit ? (
                    <Badge variant="destructive">Брак</Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Норма
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
