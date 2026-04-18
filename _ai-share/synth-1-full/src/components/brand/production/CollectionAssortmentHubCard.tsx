'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, LayoutPanelLeft, UserCircle } from 'lucide-react';
import type { MatrixStepStatus } from '@/lib/production/unified-sku-flow-store';
import {
  BRAND_COLLECTION_STAGE_MODULES_SAVED,
  getStepModule,
  loadCollectionStageModules,
  patchStepModuleFields,
  saveCollectionStageModules,
} from '@/lib/production/collection-stage-modules-store';
import {
  getFormFieldsForStep,
  hasSubstantiveModuleContent,
} from '@/lib/production/collection-step-form-fields';
import type { CollectionModuleSaveEvent } from '@/components/brand/production/CollectionStepModuleDialog';
import type { HubModuleLink } from '@/components/brand/production/CollectionStageModuleHubCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

const STEP_ID = 'assortment-map';
const GENERIC_FIELD_KEYS = new Set(['objectives', 'keyDecisions', 'risksBlockers', 'linksRefs']);

const STATUS_RU: Record<MatrixStepStatus, string> = {
  not_started: 'матрица: не начато',
  in_progress: 'матрица: в работе',
  done: 'матрица: готово',
};

type Props = {
  collectionFlowKey: string;
  collectionLabel: string;
  /** `/brand/products` с `collectionId` в query, если есть */
  pimHref: string;
  matrixAssortmentStatus?: MatrixStepStatus;
  onAfterModuleSave?: (e: CollectionModuleSaveEvent) => void;
  onOpenFullDialog: () => void;
  outlineLinks?: HubModuleLink[];
};

/**
 * Карта ассортимента в хабе «Коллекция»: те же поля, что модуль этапа `assortment-map` в диалоге.
 */
export function CollectionAssortmentHubCard({
  collectionFlowKey,
  collectionLabel,
  pimHref,
  matrixAssortmentStatus,
  onAfterModuleSave,
  onOpenFullDialog,
  outlineLinks,
}: Props) {
  const fieldDefs = useMemo(() => getFormFieldsForStep(STEP_ID), []);
  const [doc, setDoc] = useState<ReturnType<typeof loadCollectionStageModules>>(() => ({
    v: 1,
    steps: {},
  }));
  const [draftFields, setDraftFields] = useState<Record<string, string>>({});
  const [actorLabel, setActorLabel] = useState('Демо-пользователь');

  const refresh = useCallback(() => {
    const d = loadCollectionStageModules(collectionFlowKey);
    setDoc(d);
    const m = getStepModule(d, STEP_ID);
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
    return () =>
      window.removeEventListener(BRAND_COLLECTION_STAGE_MODULES_SAVED, h as EventListener);
  }, [collectionFlowKey, refresh]);

  const handleSave = () => {
    const actor = actorLabel.trim() || 'Не указано';
    const prevMod = getStepModule(doc, STEP_ID);
    const hadSubstantive = hasSubstantiveModuleContent(prevMod.fields, fieldDefs);
    const willSubstantive = hasSubstantiveModuleContent(draftFields, fieldDefs);
    const next = patchStepModuleFields(doc, STEP_ID, draftFields, actor);
    saveCollectionStageModules(collectionFlowKey, next);
    setDoc(next);
    onAfterModuleSave?.({
      stepId: STEP_ID,
      firstSubstantiveSave: !hadSubstantive && willSubstantive,
    });
  };

  const previewLine = useMemo(() => {
    const range = draftFields.rangeStructure?.trim();
    const cat = draftFields.categoryFocus?.trim();
    const bits = [range?.slice(0, 80), cat?.slice(0, 60)].filter(Boolean);
    return bits.length ? bits.join(' · ') : null;
  }, [draftFields.rangeStructure, draftFields.categoryFocus]);

  const substantive = hasSubstantiveModuleContent(draftFields, fieldDefs);

  const firstGenericIndex = useMemo(
    () => fieldDefs.findIndex((d) => GENERIC_FIELD_KEYS.has(d.key)),
    [fieldDefs]
  );

  return (
    <Card className="border-accent-primary/30 from-accent-primary/10 bg-gradient-to-r via-white to-sky-50/25 shadow-sm">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <LayoutGrid className="text-accent-primary h-4 w-4 shrink-0" aria-hidden />
          <CardTitle className="text-sm uppercase tracking-tight">
            Карта ассортимента (этап 2)
          </CardTitle>
          {matrixAssortmentStatus ? (
            <Badge
              variant="outline"
              className="border-border-default h-5 text-[7px] font-bold uppercase"
            >
              {STATUS_RU[matrixAssortmentStatus]}
            </Badge>
          ) : null}
          {substantive ? (
            <Badge className="h-5 bg-emerald-600/90 text-[7px] font-bold uppercase">
              Черновик заполнен
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-text-secondary h-5 text-[7px] font-semibold">
              Дропы, сетка, категории — здесь и в модуле этапа
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs leading-relaxed">
          Коллекция: <strong className="text-text-primary">{collectionLabel}</strong>. Данные =
          модуль «Карта ассортимента (SKU / категории)» в ленте; хранилище то же, что у брифа.
          Первое содержательное сохранение переводит этап{' '}
          <span className="font-mono text-[10px]">assortment-map</span> у всех SKU в «в работе» в
          матрице.
        </CardDescription>
        {previewLine ? (
          <p className="text-text-primary line-clamp-2 pt-0.5 text-[11px] font-medium">
            Кратко: <span className="text-accent-primary">{previewLine}</span>
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-border-subtle flex flex-wrap items-end gap-2 rounded-lg border bg-white/80 p-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2">
            <UserCircle className="text-text-muted h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-text-muted text-[9px] font-bold uppercase">Кто вносит изменения</p>
              <Input
                className="mt-0.5 h-8 text-xs"
                value={actorLabel}
                onChange={(e) => setActorLabel(e.target.value)}
                placeholder="ФИО или роль"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fieldDefs.map((def, idx) => {
            const isGeneric = GENERIC_FIELD_KEYS.has(def.key);
            return (
              <div key={def.key}>
                {firstGenericIndex === idx ? (
                  <div className="border-border-default border-t pt-3">
                    <p className="text-text-muted text-[8px] font-black uppercase tracking-wider">
                      Дополнительно: цели, решения, риски, ссылки
                    </p>
                  </div>
                ) : null}
                <div
                  className={cn(
                    isGeneric
                      ? 'border-border-default/80 bg-bg-surface2/40 rounded-lg border border-dashed p-2'
                      : ''
                  )}
                >
                  <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">{def.label}</p>
                  {def.type === 'textarea' ? (
                    <Textarea
                      className="min-h-[64px] text-xs"
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
              </div>
            );
          })}
        </div>

        <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-3">
          <Button type="button" size="sm" className="h-9 text-xs" onClick={handleSave}>
            Сохранить карту ассортимента
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-[10px]"
            onClick={onOpenFullDialog}
          >
            <LayoutPanelLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Вложения, история, согласование
          </Button>
          <Button type="button" variant="secondary" size="sm" className="h-9 text-[10px]" asChild>
            <Link href={pimHref} className="inline-flex items-center gap-1">
              Каталог товаров (<AcronymWithTooltip abbr="PIM" />) →
            </Link>
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
