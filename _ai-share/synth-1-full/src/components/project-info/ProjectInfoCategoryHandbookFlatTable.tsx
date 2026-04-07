'use client';

import { useCallback, useMemo, useState } from 'react';
import { Workshop2CategoryHandbookGuidance } from '@/components/brand/production/Workshop2CategoryHandbookGuidance';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[1760px] border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th
              className={cn(
                'sticky left-0 z-10 bg-slate-50 px-2 py-2 font-semibold text-slate-800',
                'shadow-[1px_0_0_0_rgb(226_232_240)]'
              )}
            >
              Категория 1
            </th>
            <th className="px-2 py-2 font-semibold text-slate-800">Категория 2</th>
            <th className="px-2 py-2 font-semibold text-slate-800">Категория 3</th>
            {CATALOG_AUDIENCE_COLUMNS.map((c) => (
              <th
                key={c.key}
                className="w-10 min-w-10 max-w-10 border-l border-slate-200 px-0.5 py-2 text-center font-semibold text-slate-800"
                title={c.label}
              >
                <span className="block text-[10px] leading-tight">{c.abbr}</span>
                <span className="mt-0.5 hidden text-center text-[7px] font-normal leading-snug text-slate-500 sm:block">
                  {c.label}
                </span>
              </th>
            ))}
            <th
              className="min-w-[200px] border-l border-slate-200 px-2 py-2 align-bottom font-semibold text-slate-800"
              title="Материал, стиль/повод и оси, задающие тип/класс изделия для ветки кат. 1–2"
            >
              Обязательные
            </th>
            <th
              className="min-w-[220px] border-l border-slate-100 px-2 py-2 align-bottom font-semibold text-slate-800"
              title="Остальные оси подборки (крой, отделка, фактура и т.д.) для той же ветки"
            >
              Общие
            </th>
            <th
              className="min-w-[52px] border-l border-slate-200 px-1 py-2 align-bottom font-semibold text-slate-800"
              title="Единица учёта по умолчанию (шт / пара / комплект / мл …)"
            >
              Ед.
            </th>
            <th
              className="min-w-[120px] border-l border-slate-100 px-1 py-2 align-bottom font-semibold text-slate-800"
              title="Теги комплаенса РФ/ЕАЭУ (ориентиры для чеклиста документов)"
            >
              Комплаенс
            </th>
            <th
              className="min-w-[48px] border-l border-slate-100 px-1 py-2 text-center align-bottom font-semibold text-slate-800"
              title="Подсказка главы ТН ВЭД ЕАЭС для оператора"
            >
              ТНВЭД
            </th>
            <th
              className="min-w-[72px] border-l border-slate-100 px-1 py-2 align-bottom font-semibold text-slate-800"
              title="Профиль размеров/параметров (production-params) или переопределение"
            >
              Размеры
            </th>
            <th
              className="min-w-[88px] border-l border-slate-100 px-1 py-2 align-bottom font-semibold text-slate-800"
              title="Шаблон маршрута / этапов производства (id)"
            >
              Маршрут
            </th>
            <th
              className="min-w-[44px] border-l border-slate-100 px-1 py-2 text-center align-bottom font-semibold text-slate-800"
              title="Количество обязательных типов вложений ТЗ"
            >
              Док.
            </th>
            <th
              className="min-w-[52px] border-l border-slate-100 px-1 py-2 text-center align-bottom font-semibold text-slate-800"
              title="Каналы сбыта (WB / Ozon / …), заданные в профиле листа"
            >
              МП
            </th>
            <th
              className="min-w-[56px] border-l border-slate-100 px-1 py-2 text-center align-bottom font-semibold text-slate-800"
              title="Языки этикетки по умолчанию"
            >
              Язык
            </th>
            <th
              className="min-w-[72px] border-l border-slate-100 px-1 py-2 align-bottom font-semibold text-slate-800"
              title="Источник осей атрибутов: info_pick_matrix | узел справочника | hybrid"
            >
              Атриб.
            </th>
            <th
              className="sticky right-0 z-10 min-w-[88px] border-l border-slate-200 bg-slate-50 px-1 py-2 text-center align-bottom font-semibold text-slate-800 shadow-[-1px_0_0_0_rgb(226_232_240)]"
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
            const bind = prod.attributeBinding === 'info_pick_matrix' ? 'IP' : prod.attributeBinding === 'hybrid' ? 'H' : 'узел';
            return (
              <tr key={leaf.leafId} className="group border-b border-slate-100 hover:bg-slate-50/80">
                <td
                  className={cn(
                    'sticky left-0 z-[1] bg-white px-2 py-1.5 text-slate-900',
                    'shadow-[1px_0_0_0_rgb(241_245_249)] group-hover:bg-slate-50/80'
                  )}
                >
                  {leaf.l1Name}
                </td>
                <td className="px-2 py-1.5 text-slate-800">{leaf.l2Name}</td>
                <td className="px-2 py-1.5 text-slate-700">{displayL3(leaf.l3Name)}</td>
                {CATALOG_AUDIENCE_COLUMNS.map((c) => (
                  <td
                    key={c.key}
                    className="w-10 min-w-10 max-w-10 border-l border-slate-100 px-0.5 py-1 text-center align-middle"
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
                  className="max-w-[min(16rem,40vw)] border-l border-slate-100 px-2 py-1.5 align-top text-[10px] leading-snug text-slate-700"
                  title={groups.requiredLabels.join(' · ')}
                >
                  {groups.requiredLabels.length ? (
                    <span className="line-clamp-4 sm:line-clamp-none">{groups.requiredLabels.join(' · ')}</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td
                  className="max-w-[min(18rem,45vw)] border-l border-slate-100 px-2 py-1.5 align-top text-[10px] leading-snug text-slate-600"
                  title={groups.commonLabels.join(' · ')}
                >
                  {groups.commonLabels.length ? (
                    <span className="line-clamp-4 sm:line-clamp-none">{groups.commonLabels.join(' · ')}</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td
                  className="border-l border-slate-200 px-1 py-1.5 align-top text-[10px] text-slate-700"
                  title={prod.stockUnitNotes ?? prod.stockUnitDefault}
                >
                  {formatStockUnitRu(prod.stockUnitDefault)}
                </td>
                <td
                  className="max-w-[7rem] border-l border-slate-100 px-1 py-1.5 align-top text-[9px] leading-tight text-slate-700"
                  title={prod.complianceTags.join(', ')}
                >
                  <span className="line-clamp-3">{formatComplianceSummary(prod.complianceTags)}</span>
                </td>
                <td className="border-l border-slate-100 px-1 py-1.5 text-center align-top text-[10px] text-slate-700">
                  {tn}
                </td>
                <td
                  className="max-w-[5.5rem] border-l border-slate-100 px-1 py-1.5 align-top text-[9px] leading-tight text-slate-600"
                  title={prod.sizeParameterProfileId ?? ''}
                >
                  <span className="line-clamp-2">{prod.sizeParameterProfileId ?? '—'}</span>
                </td>
                <td
                  className="max-w-[5.5rem] border-l border-slate-100 px-1 py-1.5 align-top text-[9px] leading-tight text-slate-600"
                  title={prod.productionRouteTemplateLabel ?? route}
                >
                  <span className="line-clamp-2">{route}</span>
                </td>
                <td className="border-l border-slate-100 px-1 py-1.5 text-center align-top text-[10px] text-slate-700">
                  {prod.requiredDocuments.length}
                </td>
                <td className="border-l border-slate-100 px-1 py-1.5 text-center align-top text-[10px] text-slate-700">
                  {mp || '—'}
                </td>
                <td
                  className="border-l border-slate-100 px-1 py-1.5 text-center align-top text-[9px] text-slate-700"
                  title={prod.mandatoryLabelBlocks.join(', ')}
                >
                  {langs}
                </td>
                <td
                  className="border-l border-slate-100 px-1 py-1.5 align-top text-[9px] text-slate-600"
                  title={prod.attributeBindingNote ?? prod.attributeBinding}
                >
                  {bind}
                </td>
                <td
                  className={cn(
                    'sticky right-0 z-[1] border-l border-slate-200 bg-white px-0.5 py-1 text-center align-middle',
                    'shadow-[-1px_0_0_0_rgb(241_245_249)] group-hover:bg-slate-50/80'
                  )}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      title={
                        copiedLeafId === leaf.leafId
                          ? 'Скопировано'
                          : `Скопировать ${leaf.leafId}`
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

      <Dialog open={handbookDialogLeaf !== null} onOpenChange={(o) => !o && setHandbookDialogLeaf(null)}>
        <DialogContent className="max-h-[min(90vh,720px)] max-w-lg overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-sm leading-tight pr-8">
              {handbookDialogLeaf?.pathLabel ?? 'Справочник по листу'}
            </DialogTitle>
          </DialogHeader>
          {handbookDialogLeaf ? (
            <Workshop2CategoryHandbookGuidance leaf={handbookDialogLeaf} className="border-0 bg-transparent p-0" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
