'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, FileText } from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useToast } from '@/hooks/use-toast';

export function Workshop2MaterialRequisitionPanel({
  dossier,
}: {
  dossier: Workshop2DossierPhase1;
}) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(1000);
  const [scrapRate, setScrapRate] = useState<number>(5);
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brand/workshop2/phase1-dossier/requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity,
          scrapRate,
          materialLines: dossier.productionModel?.materialLines || [],
        }),
      });
      if (!res.ok) throw new Error('Failed to generate POs');
      const data = (await res.json()) as any;
      setRequisitions(data.requisitions);
      toast({
        title: 'Заявки сформированы',
        description: 'Заявки на материалы были автоматически сформированы.',
      });
    } catch (e) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сформировать заявки.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-border-default mt-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-text-primary flex items-center gap-2 text-base font-semibold">
          <Package className="text-accent-primary h-4 w-4" />
          Авто-формирование Заявок на закупку (Auto-PO)
        </h3>
        <p className="text-text-secondary mt-1 text-sm">
          Сформировать заявки на закупку (PO) на основе целевого объёма выпуска и BOM.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="max-w-[240px] flex-1 space-y-1.5">
            <Label>Целевой объём (шт.)</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="max-w-[160px] flex-1 space-y-1.5">
            <Label>Процент брака (%)</Label>
            <Input
              type="number"
              value={scrapRate}
              onChange={(e) => setScrapRate(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading} size="default">
            {loading ? 'Формирование...' : 'Сформировать заявки'}
          </Button>
        </div>

        {requisitions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-text-primary mb-3 text-sm font-medium">Сгенерированные заявки</h4>
            <div className="space-y-2">
              {requisitions.map((req, i) => (
                <div
                  key={i}
                  className="border-border-default flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{req.materialName}</span>
                    <span className="text-text-muted text-xs">
                      Поставщик: {req.supplier || 'Не указан'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-text-primary text-sm font-semibold">
                        {req.totalRequired} {req.unit}
                      </div>
                      <div className="text-text-muted text-xs">
                        Чистый расход: {req.pureRequired} {req.unit} (Брак: {req.scrapRate}%)
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      <FileText className="mr-2 h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
