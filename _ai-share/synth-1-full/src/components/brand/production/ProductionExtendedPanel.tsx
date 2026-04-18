'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Scissors,
  Layers,
  ClipboardCheck,
  AlertCircle,
  FileCheck,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import {
  createCuttingMarker,
  getCuttingMarkers,
  createCuttingReport,
  addMaterialAllowance,
  recordInlineQC,
  getDefectTypes,
  registerDefectType,
  createPPSSample,
} from '@/lib/production/plm-extended';

interface ProductionExtendedPanelProps {
  batchId?: number;
  skuId?: string;
}

export function ProductionExtendedPanel({ batchId, skuId }: ProductionExtendedPanelProps) {
  const [markers, setMarkers] = useState<
    { id: number; marker_number: string; efficiency_percent: number; status: string }[]
  >([]);
  const [defectTypes, setDefectTypes] = useState<
    { code: string; name_ru: string; category: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const loadMarkers = async () => {
    if (!batchId) return;
    try {
      const data = await getCuttingMarkers(batchId);
      setMarkers(Array.isArray(data) ? data : []);
    } catch {
      setMarkers([]);
    }
  };

  const loadDefectTypes = async () => {
    try {
      const data = await getDefectTypes();
      setDefectTypes(Array.isArray(data) ? data : []);
    } catch {
      setDefectTypes([]);
    }
  };

  useEffect(() => {
    if (batchId) loadMarkers();
    loadDefectTypes();
  }, [batchId]);

  const handleCreateMarker = async () => {
    if (!batchId || !skuId) {
      setMsg({ ok: false, text: 'Укажите партию и артикул' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await createCuttingMarker({
        batch_id: batchId,
        sku_id: skuId,
        marker_number: `M-${Date.now().toString(36).toUpperCase()}`,
        planned_length_m: 50,
        efficiency_percent: 78,
      });
      setMsg({ ok: true, text: 'Маркер создан' });
      loadMarkers();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDefectType = async () => {
    setLoading(true);
    setMsg(null);
    try {
      await registerDefectType({
        code: `DEF-${Date.now().toString(36).slice(-4).toUpperCase()}`,
        name_ru: 'Неровный шов',
        category: 'major',
      });
      setMsg({ ok: true, text: 'Тип дефекта добавлен' });
      loadDefectTypes();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Раскрой и маркеры */}
      <Card className="border-border-default overflow-hidden rounded-2xl border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <Scissors className="text-accent-primary h-4 w-4" />
            Раскрой и маркеры
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {batchId && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleCreateMarker}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-1">Создать маркер</span>
              </Button>
              {markers.length > 0 && (
                <div className="space-y-1">
                  {markers.map((m) => (
                    <div
                      key={m.id}
                      className="bg-bg-surface2 flex items-center justify-between rounded-xl p-2 text-[10px]"
                    >
                      <span className="font-bold">{m.marker_number}</span>
                      <Badge variant="secondary" className="text-[9px]">
                        {m.efficiency_percent}% eff
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {!batchId && (
            <p className="text-text-secondary text-[10px]">
              Выберите партию для управления маркерами
            </p>
          )}
        </CardContent>
      </Card>

      {/* 2. Сырьё — allowance */}
      <Card className="border-border-default overflow-hidden rounded-2xl border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <Layers className="h-4 w-4 text-emerald-500" />
            Нормы списания
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary mb-2 text-[10px]">
            Нормы списания по операциям: ткань, нитки, подкладка. <AcronymWithTooltip abbr="API" />:
            POST /plm/materials/allowance
          </p>
          {skuId && (
            <Button size="sm" variant="ghost" className="text-[10px]" disabled>
              Для <AcronymWithTooltip abbr="SKU" /> {skuId}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 3. Межоперационный QC */}
      <Card className="border-border-default overflow-hidden rounded-2xl border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <ClipboardCheck className="h-4 w-4 text-amber-500" />
            Межоперационный <AcronymWithTooltip abbr="QC" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-[10px]">
            Межоперационный контроль. <AcronymWithTooltip abbr="API" />: POST /plm/qc/inline
          </p>
        </CardContent>
      </Card>

      {/* 4. Реестр дефектов */}
      <Card className="border-border-default overflow-hidden rounded-2xl border md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            Реестр типов дефектов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-wrap gap-2">
            {defectTypes.map((d) => (
              <Badge key={d.code} variant="outline" className="text-[9px]">
                {d.code}: {d.name_ru}
              </Badge>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={handleAddDefectType} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span className="ml-1">Добавить тип</span>
          </Button>
        </CardContent>
      </Card>

      {/* 5. PPS */}
      <Card className="border-border-default overflow-hidden rounded-2xl border">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <FileCheck className="h-4 w-4 text-blue-500" />
            Предотгрузочный образец (PPS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-[10px]">
            PPS — статус и привязка к этапу. <AcronymWithTooltip abbr="API" />: POST
            /plm/production/batches/:id/pps
          </p>
        </CardContent>
      </Card>

      {msg && (
        <div
          className={`fixed bottom-4 right-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            msg.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}
        >
          {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {msg.text}
        </div>
      )}
    </div>
  );
}
