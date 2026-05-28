'use client';

import React, { useState } from 'react';
import { Clock, ShieldAlert, PlayCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  calculatePreliminaryCogs,
  calculateActualCogs,
} from '@/lib/production/workshop2-sample-economics';

interface CapacityPrediction {
  predictedDays: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  rationale: string;
}

export function Workshop2PredictiveRiskPanel({
  dossier,
  articleId,
}: {
  dossier?: Workshop2DossierPhase1;
  articleId?: string;
}) {
  const cogs = dossier ? calculateActualCogs(dossier) : null;
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<CapacityPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!dossier) return;

    setLoading(true);
    setError(null);

    try {
      const techPackNotes = dossier.optionalNote || 'Standard basic garment.';
      const sampleRoomLoad = 'Medium'; // Mock load for now

      const res = await fetch('/api/brand/workshop2/ai/capacity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techPackNotes, sampleRoomLoad, articleId }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = (await res.json()) as CapacityPrediction;
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'Low':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="border-border-default mt-4 w-full rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-sm">
            <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">
              Прогноз рисков поставки (AI) и Предварительная себестоимость
            </h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Интеграция с предиктивной моделью задержек и T&A календарем.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePredict}
            disabled={loading || !dossier}
            className="h-8 gap-1.5 border-indigo-200 text-[11px] text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            {loading ? (
              <PlayCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <PlayCircle className="h-3.5 w-3.5" />
            )}
            {loading ? 'Анализ...' : 'Оценить риски производства сэмпла'}
          </Button>
        </div>
      </div>

      {cogs && (
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="border-border-subtle rounded-lg border bg-slate-50 p-4">
              <div className="text-text-secondary mb-1 text-xs">Сырье и материалы</div>
              <div className="text-text-primary text-lg font-semibold">
                {cogs.materialCost.toFixed(2)} ₽
              </div>
            </div>
            <div className="border-border-subtle rounded-lg border bg-slate-50 p-4">
              <div className="text-text-secondary mb-1 text-xs">Пошив (SASH × ставка)</div>
              <div className="text-text-primary text-lg font-semibold">
                {cogs.laborCost.toFixed(2)} ₽
              </div>
            </div>
            <div className="border-border-default rounded-lg border bg-blue-50 p-4">
              <div className="mb-1 text-xs font-medium text-blue-600">Предварительная COGS</div>
              <div className="text-xl font-bold text-blue-700">{cogs.totalCogs.toFixed(2)} ₽</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-border-subtle rounded-lg border bg-slate-50 p-4">
              <div className="text-text-secondary mb-1 text-xs">Фактическая логистика</div>
              <div className="text-text-primary text-lg font-semibold">
                {cogs.logisticsCost.toFixed(2)} ₽
              </div>
            </div>
            <div className="border-border-default rounded-lg border bg-emerald-50 p-4">
              <div className="mb-1 text-xs font-medium text-emerald-600">
                Фактическая COGS (Actual)
              </div>
              <div className="text-xl font-bold text-emerald-700">
                {cogs.actualCogs.toFixed(2)} ₽
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Ошибка при оценке рисков: {error}
        </div>
      )}

      {prediction ? (
        <div
          className={cn(
            'flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center',
            getRiskColor(prediction.riskLevel)
          )}
        >
          <div className="flex-shrink-0 rounded-full bg-white p-2 shadow-sm">
            {getRiskIcon(prediction.riskLevel)}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-sm font-semibold">
                Оценка AI: {prediction.predictedDays} дней на пошив
              </h3>
              <Badge
                variant={
                  prediction.riskLevel === 'High'
                    ? 'destructive'
                    : prediction.riskLevel === 'Medium'
                      ? 'secondary'
                      : 'default'
                }
                className="text-[10px]"
              >
                Риск: {prediction.riskLevel}
              </Badge>
            </div>
            <p className="text-xs opacity-90">{prediction.rationale}</p>
          </div>
        </div>
      ) : (
        <div className="border-border-subtle bg-bg-surface2 flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
          <Clock className="mb-3 h-8 w-8 text-slate-300" />
          <h3 className="text-text-primary mb-1 text-sm font-semibold">Сбор данных для модели</h3>
          <p className="text-text-secondary max-w-xs text-xs">
            Нажмите "Оценить риски производства сэмпла" для AI-анализа сложности ТЗ и текущей
            нагрузки цеха.
          </p>
        </div>
      )}
    </div>
  );
}
