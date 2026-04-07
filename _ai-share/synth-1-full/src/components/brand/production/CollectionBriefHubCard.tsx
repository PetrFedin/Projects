'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, LayoutPanelLeft, UserCircle } from 'lucide-react';
import type { MatrixStepStatus } from '@/lib/production/unified-sku-flow-store';
import {
  BRAND_COLLECTION_STAGE_MODULES_SAVED,
  getStepModule,
  loadCollectionStageModules,
  patchStepModuleFields,
  saveCollectionStageModules,
} from '@/lib/production/collection-stage-modules-store';
import { getFormFieldsForStep, hasSubstantiveModuleContent } from '@/lib/production/collection-step-form-fields';
import type { CollectionModuleSaveEvent } from '@/components/brand/production/CollectionStepModuleDialog';
import type { HubModuleLink } from '@/components/brand/production/CollectionStageModuleHubCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const BRIEF_STEP_ID = 'brief';

const STATUS_RU: Record<MatrixStepStatus, string> = {
  not_started: 'матрица: не начато',
  in_progress: 'матрица: в работе',
  done: 'матрица: готово',
};

type Props = {
  collectionFlowKey: string;
  collectionLabel: string;
  matrixBriefStatus?: MatrixStepStatus;
  onAfterModuleSave?: (e: CollectionModuleSaveEvent) => void;
  onOpenFullDialog: () => void;
  outlineLinks?: HubModuleLink[];
};

/**
 * Бриф коллекции на вкладке «Коллекция»: те же поля и хранилище, что модуль этапа `brief` в диалоге.
 * Закрывает пробел «данные только в модалке»: правки здесь видны в модуле и наоборот.
 */
export function CollectionBriefHubCard({
  collectionFlowKey,
  collectionLabel,
  matrixBriefStatus,
  onAfterModuleSave,
  onOpenFullDialog,
  outlineLinks,
}: Props) {
  const fieldDefs = useMemo(() => getFormFieldsForStep(BRIEF_STEP_ID), []);
  const [doc, setDoc] = useState<ReturnType<typeof loadCollectionStageModules>>(() => ({
    v: 1,
    steps: {},
  }));
  const [draftFields, setDraftFields] = useState<Record<string, string>>({});
  const [actorLabel, setActorLabel] = useState('Демо-пользователь');

  const refresh = useCallback(() => {
    const d = loadCollectionStageModules(collectionFlowKey);
    setDoc(d);
    const m = getStepModule(d, BRIEF_STEP_ID);
    const merged: Record<string, string> = {};
    for (const def of fieldDefs) merged[def.key] = m.fields[def.key] ?? '';
    setDraftFields(merged);
  }, [collectionFlowKey, fieldDefs]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const h = (e: Event) => {
      const k = (e as CustomEvent<{ collectionKey?: string }>).detail?.collectionKey;
      if (k === collectionFlowKey) refresh();
    };
    window.addEventListener(BRAND_COLLECTION_STAGE_MODULES_SAVED, h as EventListener);
    return () => window.removeEventListener(BRAND_COLLECTION_STAGE_MODULES_SAVED, h as EventListener);
  }, [collectionFlowKey, refresh]);

  const handleSave = () => {
    const actor = actorLabel.trim() || 'Не указано';
    const prevMod = getStepModule(doc, BRIEF_STEP_ID);
    const hadSubstantive = hasSubstantiveModuleContent(prevMod.fields, fieldDefs);
    const willSubstantive = hasSubstantiveModuleContent(draftFields, fieldDefs);
    const next = patchStepModuleFields(doc, BRIEF_STEP_ID, draftFields, actor);
    saveCollectionStageModules(collectionFlowKey, next);
    setDoc(next);
    onAfterModuleSave?.({
      stepId: BRIEF_STEP_ID,
      firstSubstantiveSave: !hadSubstantive && willSubstantive,
    });
  };

  const previewLine = useMemo(() => {
    const season = draftFields.season?.trim();
    const rev = draftFields.revenueTarget?.trim();
    const margin = draftFields.marginTarget?.trim();
    const bits = [season, rev, margin].filter(Boolean);
    return bits.length ? bits.join(' · ') : null;
  }, [draftFields.season, draftFields.revenueTarget, draftFields.marginTarget]);

  const substantive = hasSubstantiveModuleContent(draftFields, fieldDefs);

  return (
    <Card className="border-amber-200/90 bg-gradient-to-r from-amber-50/40 via-white to-indigo-50/20 shadow-sm">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="h-4 w-4 text-amber-700 shrink-0" aria-hidden />
          <CardTitle className="text-sm uppercase tracking-tight">Бриф коллекции (этап 1)</CardTitle>
          {matrixBriefStatus ? (
            <Badge variant="outline" className="h-5 border-slate-200 text-[7px] font-bold uppercase">
              {STATUS_RU[matrixBriefStatus]}
            </Badge>
          ) : null}
          {substantive ? (
            <Badge className="h-5 bg-emerald-600/90 text-[7px] font-bold uppercase">Черновик заполнен</Badge>
          ) : (
            <Badge variant="secondary" className="h-5 text-[7px] font-semibold text-slate-600">
              Заполните бриф — тот же объект, что в модуле этапа
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs leading-relaxed">
          Коллекция: <strong className="text-slate-800">{collectionLabel}</strong>. Поля совпадают с модулем «Бриф коллекции и цели» в цепочке этапов ниже; сохранение —{' '}
          <span className="font-mono text-[10px]">brand_collection_stage_modules</span> (демо). После первого содержательного сохранения этап{' '}
          <span className="font-mono text-[10px]">brief</span> у всех SKU коллекции переходит в «в работе» в матрице.
        </CardDescription>
        {previewLine ? (
          <p className="text-[11px] font-medium text-slate-700 pt-0.5">
            Кратко: <span className="text-indigo-900">{previewLine}</span>
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-100 bg-white/80 p-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2">
            <UserCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase text-slate-400">Кто вносит изменения</p>
              <Input
                className="mt-0.5 h-8 text-xs"
                value={actorLabel}
                onChange={(e) => setActorLabel(e.target.value)}
                placeholder="ФИО или роль"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {fieldDefs.map((def) => (
            <div
              key={def.key}
              className={cn(def.type === 'textarea' && (def.key === 'audience' || def.key === 'mood') ? 'md:col-span-2' : '')}
            >
              <p className="mb-1 text-[9px] font-bold uppercase text-slate-400">{def.label}</p>
              {def.type === 'textarea' ? (
                <Textarea
                  className="min-h-[72px] text-xs"
                  placeholder={def.placeholder}
                  value={draftFields[def.key] ?? ''}
                  onChange={(e) => setDraftFields((p) => ({ ...p, [def.key]: e.target.value }))}
                />
              ) : (
                <Input
                  className="h-9 text-xs"
                  type={def.type === 'number' ? 'number' : 'text'}
                  placeholder={def.placeholder}
                  value={draftFields[def.key] ?? ''}
                  onChange={(e) => setDraftFields((p) => ({ ...p, [def.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <Button type="button" size="sm" className="h-9 text-xs" onClick={handleSave}>
            Сохранить бриф
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5 text-[10px]" onClick={onOpenFullDialog}>
            <LayoutPanelLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Вложения, история, согласование
          </Button>
          {(outlineLinks ?? []).map((link, i) => (
            <Button
              key={`${link.href}-${i}`}
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-[10px]"
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
