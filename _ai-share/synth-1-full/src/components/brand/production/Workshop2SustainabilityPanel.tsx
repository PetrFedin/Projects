'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, QrCode } from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useToast } from '@/hooks/use-toast';

export function Workshop2SustainabilityPanel({ dossier }: { dossier: Workshop2DossierPhase1 }) {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const lines = [
        ...(dossier.productionModel?.materialLines || []).map((m: any) => ({
          label: m.materialName || 'Материал без названия',
          qty: m.yieldPerUnit,
          unit: m.yieldUnit || 'ед.',
        })),
        ...(dossier.productionModel?.trimLines || []).map((t: any) => ({
          label: t.name || 'Фурнитура без названия',
          qty: t.quantity,
          unit: 'шт',
        })),
      ];

      const res = await fetch('/api/brand/workshop2/dpp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setMetrics(data);
      toast({
        title: 'DPP сформирован',
        description:
          'Для этого сэмпла паспортизация включена. В реальном пайплайне здесь формируется DPP.',
      });
    } catch (e) {
      if (typeof window !== 'undefined') {
        const toast = (window as any).__toast__;
        if (toast) {
          toast({
            title: 'Ошибка',
            description: 'Не удалось сгенерировать DPP.',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-border-default mt-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">
            <Leaf className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">
              Цифровой паспорт продукта (DPP)
            </h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Формирование цифрового паспорта (Digital Product Passport) с расчётом экологического
              следа на основе выбранных материалов из BOM.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {!metrics ? (
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              variant="outline"
              size="sm"
              className="h-8 border-emerald-200 text-[11px] text-emerald-700 hover:bg-emerald-50"
            >
              {loading ? 'Формирование...' : 'Сгенерировать DPP и Эко-след'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="border-border-subtle bg-bg-surface2/40 flex w-full items-center justify-center rounded-lg border border-dashed p-6 md:w-1/3">
              <div className="flex flex-col items-center gap-2 text-center">
                <QrCode className="text-text-primary mb-2 h-16 w-16" />
                <span className="text-text-secondary text-[11px] font-medium">
                  Отсканируйте QR для просмотра
                </span>
                <span className="text-text-muted border-border-subtle rounded border bg-white px-2 py-0.5 font-mono text-[10px]">
                  ID: {metrics.passportId}
                </span>
                <a
                  href={`https://dpp.brand.com/article/${metrics.passportId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-primary mt-1 break-all text-[10px] font-medium hover:underline"
                >
                  https://dpp.brand.com/article/{metrics.passportId}
                </a>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h4 className="text-text-primary text-[11px] font-semibold uppercase tracking-wider">
                Сводка экологических показателей
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border-border-subtle flex flex-col justify-between rounded-lg border bg-white p-3 shadow-sm">
                  <div className="text-text-muted mb-1 text-[10px] font-semibold">
                    Углеродный след (Carbon)
                  </div>
                  <div className="text-text-primary text-base font-bold">
                    {metrics.carbonFootprint} kg CO₂e
                  </div>
                </div>
                <div className="border-border-subtle flex flex-col justify-between rounded-lg border bg-white p-3 shadow-sm">
                  <div className="text-text-muted mb-1 text-[10px] font-semibold">
                    Расход воды (Water)
                  </div>
                  <div className="text-text-primary text-base font-bold">
                    {metrics.waterUsage} L
                  </div>
                </div>
                <div className="border-border-subtle flex flex-col justify-between rounded-lg border bg-white p-3 shadow-sm">
                  <div className="text-text-muted mb-1 text-[10px] font-semibold">
                    Вторсырьё (Recycled)
                  </div>
                  <div className="text-text-primary text-base font-bold">
                    {metrics.recycledContentPct}%
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3 shadow-sm">
                  <div className="mb-1 text-[10px] font-semibold text-emerald-800">
                    Эко-рейтинг (Eco Score)
                  </div>
                  <div className="text-base font-bold text-emerald-700">
                    {metrics.ecoScore} / 100
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
