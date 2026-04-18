'use client';

import { useCallback, useMemo, useState } from 'react';
import { Workshop2CategoryHandbookGuidance } from '@/components/brand/production/Workshop2CategoryHandbookGuidance';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCategoryCatalogChecks } from '@/components/project-info/CategoryCatalogCheckContext';
import { CATALOG_AUDIENCE_COLUMNS } from '@/lib/project-info/category-catalog-audience-flags';
import {
  formatComplianceSummary,
  formatStockUnitRu,
  getHandbookCategoryLeaves,
  getResolvedLeafProductionProfile,
  type HandbookCategoryLeaf,
} from '@/lib/production/category-catalog';
import {
  getInfoPickAttributeGroupsForLeaf,
  type InfoPickAttributeGroups,
} from '@/lib/project-info/info-pick-attribute-keys';
import { cn } from '@/lib/utils';
import { Copy, Info } from 'lucide-react';

function displayL3(name: string): string {
  if (name === 'Базовая линия') return '—';
  return name;
}

function sortLeaves(a: HandbookCategoryLeaf, b: HandbookCategoryLeaf): number {
  const l1 = a.l1Name.localeCompare(b.l1Name, 'ru');
  if (l1 !== 0) return l1;
  const l2 = a.l2Name.localeCompare(b.l2Name, 'ru');
  if (l2 !== 0) return l2;
  return a.l3Name.localeCompare(b.l3Name, 'ru');
}

export function ProjectInfoCategoryHandbookFlatTable() {
  const { getFlags, setAudienceFlag } = useCategoryCatalogChecks();
  const [handbookDialogLeaf, setHandbookDialogLeaf] = useState<HandbookCategoryLeaf | null>(null);
  const [copiedLeafId, setCopiedLeafId] = useState<string | null>(null);

  const copyLeafId = useCallback(async (leafId: string) => {
    try {
      await navigator.clipboard.writeText(leafId);
      setCopiedLeafId(leafId);
      window.setTimeout(() => {
        setCopiedLeafId((c) => (c === leafId ? null : c));
      }, 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const rows = useMemo(() => {
    return [...getHandbookCategoryLeaves()].sort(sortLeaves);
  }, []);

  const attributeGroupsByLeafId = useMemo(() => {
    const m = new Map<string, InfoPickAttributeGroups>();
    for (const leaf of rows) {
      m.set(leaf.leafId, getInfoPickAttributeGroupsForLeaf(leaf));
    }
    return m;
  }, [rows]);

  const productionProfileByLeafId = useMemo(() => {
    const m = new Map<string, ReturnType<typeof getResolvedLeafProductionProfile>>();
    for (const leaf of rows) {
      m.set(leaf.leafId, getResolvedLeafProductionProfile(leaf));
    }
    return m;
  }, [rows]);

  return (
    <div className="border-border-default overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[1760px] border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-border-default bg-bg-surface2 border-b">
            <th
              className={cn(
                'bg-bg-surface2 text-text-primary sticky left-0 z-10 px-2 py-2 font-semibold',
                'shadow-[1px_0_0_0_rgb(226_232_240)]'
              )}
            >
              Категория 1
            </th>
            <th className="text-text-primary px-2 py-2 font-semibold">Категория 2</th>
            <th className="text-text-primary px-2 py-2 font-semibold">Категория 3</th>
            {CATALOG_AUDIENCE_COLUMNS.map((c) => (
              <th
                key={c.key}
                className="border-border-default text-text-primary w-10 min-w-10 max-w-10 border-l px-0.5 py-2 text-center font-semibold"
                title={c.label}
              >
                <span className="block text-[10px] leading-tight">{c.abbr}</span>
                <span className="text-text-secondary mt-0.5 hidden text-center text-[7px] font-normal leading-snug sm:block">
                  {c.label}
                </span>
              </th>
            ))}
            <th
              className="border-border-default text-text-primary min-w-[200px] border-l px-2 py-2 align-bottom font-semibold"
              title="Материал, стиль/повод и оси, задающие тип/класс изделия для ветки кат. 1–2"
            >
              Обязательные
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[220px] border-l px-2 py-2 align-bottom font-semibold"
              title="Остальные оси подборки (крой, отделка, фактура и т.д.) для той же ветки"
            >
              Общие
            </th>
            <th
              className="border-border-default text-text-primary min-w-[52px] border-l px-1 py-2 align-bottom font-semibold"
              title="Единица учёта по умолчанию (шт / пара / комплект / мл …)"
            >
              Ед.
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[120px] border-l px-1 py-2 align-bottom font-semibold"
              title="Теги комплаенса РФ/ЕАЭУ (ориентиры для чеклиста документов)"
            >
              Комплаенс
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[48px] border-l px-1 py-2 text-center align-bottom font-semibold"
              title="Подсказка главы ТН ВЭД ЕАЭС для оператора"
            >
              ТНВЭД
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[72px] border-l px-1 py-2 align-bottom font-semibold"
              title="Профиль размеров/параметров (production-params) или переопределение"
            >
              Размеры
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[88px] border-l px-1 py-2 align-bottom font-semibold"
              title="Шаблон маршрута / этапов производства (id)"
            >
              Маршрут
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[44px] border-l px-1 py-2 text-center align-bottom font-semibold"
              title="Количество обязательных типов вложений ТЗ"
            >
              Док.
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[52px] border-l px-1 py-2 text-center align-bottom font-semibold"
              title="Каналы сбыта (WB / Ozon / …), заданные в профиле листа"
            >
              МП
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[56px] border-l px-1 py-2 text-center align-bottom font-semibold"
              title="Языки этикетки по умолчанию"
            >
              Язык
            </th>
            <th
              className="border-border-subtle text-text-primary min-w-[72px] border-l px-1 py-2 align-bottom font-semibold"
              title="Источник осей атрибутов: info_pick_matrix | узел справочника | hybrid"
            >
              Атриб.
            </th>
            <th
              className="border-border-default bg-bg-surface2 text-text-primary sticky right-0 z-10 min-w-[88px] border-l px-1 py-2 text-center align-bottom font-semibold shadow-[-1px_0_0_0_rgb(226_232_240)]"
              title="leafId и карточка подсказок (как в Цехе 2)"
            >
              Лист
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((leaf) => {
            const flags = getFlags(leaf.leafId);
            const groups = attributeGroupsByLeafId.get(leaf.leafId) ?? {
              requiredLabels: [],
              commonLabels: [],
            };
            const prod = productionProfileByLeafId.get(leaf.leafId)!;
            const tn = prod.externalClassifiers.tnvedEaEuChapterHint ?? '—';
            const route = prod.productionRouteTemplateId ?? '—';
            const mp = prod.marketplaceRefs.length;
            const langs = prod.labelLocalesDefault.join(',') || '—';
            const bind =
              prod.attributeBinding === 'info_pick_matrix'
                ? 'IP'
                : prod.attributeBinding === 'hybrid'
                  ? 'H'
                  : 'узел';
            return (
              <tr
                key={leaf.leafId}
                className="border-border-subtle hover:bg-bg-surface2/80 group border-b"
              >
                <td
                  className={cn(
                    'text-text-primary sticky left-0 z-[1] bg-white px-2 py-1.5',
                    'group-hover:bg-bg-surface2/80 shadow-[1px_0_0_0_rgb(241_245_249)]'
                  )}
                >
                  {leaf.l1Name}
                </td>
                <td className="text-text-primary px-2 py-1.5">{leaf.l2Name}</td>
                <td className="text-text-primary px-2 py-1.5">{displayL3(leaf.l3Name)}</td>
                {CATALOG_AUDIENCE_COLUMNS.map((c) => (
                  <td
                    key={c.key}
                    className="border-border-subtle w-10 min-w-10 max-w-10 border-l px-0.5 py-1 text-center align-middle"
                  >
                    <Checkbox
                      checked={flags[c.key]}
                      onCheckedChange={(v) => setAudienceFlag(leaf.leafId, c.key, v === true)}
                      aria-label={`${c.label} · ${leaf.pathLabel}`}
                      className="mx-auto h-3.5 w-3.5"
                    />
                  </td>
                ))}
                <td
                  className="border-border-subtle text-text-primary max-w-[min(16rem,40vw)] border-l px-2 py-1.5 align-top text-[10px] leading-snug"
                  title={groups.requiredLabels.join(' · ')}
                >
                  {groups.requiredLabels.length ? (
                    <span className="line-clamp-4 sm:line-clamp-none">
                      {groups.requiredLabels.join(' · ')}
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td
                  className="border-border-subtle text-text-secondary max-w-[min(18rem,45vw)] border-l px-2 py-1.5 align-top text-[10px] leading-snug"
                  title={groups.commonLabels.join(' · ')}
                >
                  {groups.commonLabels.length ? (
                    <span className="line-clamp-4 sm:line-clamp-none">
                      {groups.commonLabels.join(' · ')}
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td
                  className="border-border-default text-text-primary border-l px-1 py-1.5 align-top text-[10px]"
                  title={prod.stockUnitNotes ?? prod.stockUnitDefault}
                >
                  {formatStockUnitRu(prod.stockUnitDefault)}
                </td>
                <td
                  className="border-border-subtle text-text-primary max-w-[7rem] border-l px-1 py-1.5 align-top text-[9px] leading-tight"
                  title={prod.complianceTags.join(', ')}
                >
                  <span className="line-clamp-3">
                    {formatComplianceSummary(prod.complianceTags)}
                  </span>
                </td>
                <td className="border-border-subtle text-text-primary border-l px-1 py-1.5 text-center align-top text-[10px]">
                  {tn}
                </td>
                <td
                  className="border-border-subtle text-text-secondary max-w-[5.5rem] border-l px-1 py-1.5 align-top text-[9px] leading-tight"
                  title={prod.sizeParameterProfileId ?? ''}
                >
                  <span className="line-clamp-2">{prod.sizeParameterProfileId ?? '—'}</span>
                </td>
                <td
                  className="border-border-subtle text-text-secondary max-w-[5.5rem] border-l px-1 py-1.5 align-top text-[9px] leading-tight"
                  title={prod.productionRouteTemplateLabel ?? route}
                >
                  <span className="line-clamp-2">{route}</span>
                </td>
                <td className="border-border-subtle text-text-primary border-l px-1 py-1.5 text-center align-top text-[10px]">
                  {prod.requiredDocuments.length}
                </td>
                <td className="border-border-subtle text-text-primary border-l px-1 py-1.5 text-center align-top text-[10px]">
                  {mp || '—'}
                </td>
                <td
                  className="border-border-subtle text-text-primary border-l px-1 py-1.5 text-center align-top text-[9px]"
                  title={prod.mandatoryLabelBlocks.join(', ')}
                >
                  {langs}
                </td>
                <td
                  className="border-border-subtle text-text-secondary border-l px-1 py-1.5 align-top text-[9px]"
                  title={prod.attributeBindingNote ?? prod.attributeBinding}
                >
                  {bind}
                </td>
                <td
                  className={cn(
                    'border-border-default sticky right-0 z-[1] border-l bg-white px-0.5 py-1 text-center align-middle',
                    'group-hover:bg-bg-surface2/80 shadow-[-1px_0_0_0_rgb(241_245_249)]'
                  )}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      title={
                        copiedLeafId === leaf.leafId ? 'Скопировано' : `Скопировать ${leaf.leafId}`
                      }
                      aria-label={`Скопировать leafId ${leaf.leafId}`}
                      onClick={() => void copyLeafId(leaf.leafId)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      title="Полная карточка: оси, вложения, МП"
                      aria-label={`Подсказки по листу ${leaf.pathLabel}`}
                      onClick={() => setHandbookDialogLeaf(leaf)}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog
        open={handbookDialogLeaf !== null}
        onOpenChange={(o) => !o && setHandbookDialogLeaf(null)}
      >
        <DialogContent className="max-h-[min(90vh,720px)] max-w-lg overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="pr-8 text-sm leading-tight">
              {handbookDialogLeaf?.pathLabel ?? 'Справочник по листу'}
            </DialogTitle>
          </DialogHeader>
          {handbookDialogLeaf ? (
            <Workshop2CategoryHandbookGuidance
              leaf={handbookDialogLeaf}
              className="border-0 bg-transparent p-0"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
