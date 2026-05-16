'use client';

import { Fragment, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import {
  Workshop2DossierAttributeCard,
  type Workshop2DossierAttributeCardContextProps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-attribute-card';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import { Workshop2GradingMatrixPanel } from '@/components/brand/production/Workshop2GradingMatrixPanel';
import { W2_VISUAL_QUAD_ATTR_IDS, W2_VISUAL_QUAD_ATTR_ORDER } from '@/components/brand/production/workshop2-phase1-dossier-panel-w2-tz-labels';

export type Workshop2ConstructionPhase1ExtraRow = {
  attribute: AttributeCatalogAttribute;
  groupLabel: string;
};

function constructionL2Hint(l2: string): string {
  if (l2 === 'Верхняя одежда') {
    return 'Заполните базовые параметры лекала: ключевые узлы, длины и конструктивные точки для запуска образца.';
  }
  if (l2 === 'Платья и сарафаны') {
    return 'Ключевое: силуэт, вырез, талия, молния/застежка, шлица, длина. Зафиксируйте прилегание.';
  }
  if (l2 === 'Брюки' || l2 === 'Джинсы') {
    return 'Ключевое: пояс, посадка (слонка), карманы, шаговый шов, низ брючин.';
  }
  if (l2 === 'Рубашки и блузы') {
    return 'Ключевое: воротник, манжеты, планка, вытачки, тип застежки.';
  }
  if (l2 === 'Юбки') {
    return 'Ключевое: пояс, силуэт, застежка, длина, шлица.';
  }
  if (l2 === 'Трикотаж') {
    return 'Ключевое: тип вязки, горловина, манжеты, резинка, плотность полотна.';
  }
  return 'Конструктив, узлы и технический замысел без устных пояснений.';
}

type SilhouetteQuadCell =
  | { kind: 'base'; row: ResolvedPhase1AttributeRow }
  | { kind: 'extra'; ex: Workshop2ConstructionPhase1ExtraRow };

function buildSilhouetteQuadCells(
  sectionRows: ResolvedPhase1AttributeRow[],
  extraRows: Workshop2ConstructionPhase1ExtraRow[]
): SilhouetteQuadCell[] {
  const silhouetteQuadRows = sectionRows.filter((r) =>
    W2_VISUAL_QUAD_ATTR_IDS.has(r.attribute.attributeId)
  );
  const silhouetteQuadExtras = extraRows.filter((e) =>
    W2_VISUAL_QUAD_ATTR_IDS.has(e.attribute.attributeId)
  );
  const cells: SilhouetteQuadCell[] = [];
  const quadBaseById = new Map(
    silhouetteQuadRows.map((r) => [r.attribute.attributeId, r] as const)
  );
  for (const id of W2_VISUAL_QUAD_ATTR_ORDER) {
    const row = quadBaseById.get(id);
    if (row) cells.push({ kind: 'base', row });
    else {
      const ex = silhouetteQuadExtras.find((e) => e.attribute.attributeId === id);
      if (ex) cells.push({ kind: 'extra', ex });
    }
  }
  return cells;
}

export function Workshop2DossierConstructionBasicParamsBlock({
  l2Name,
  categoryLeafId,
  currentLeaf,
  sectionRows,
  extraRows,
  currentPhase,
  renderPhaseRow,
  dossierAttrCardCtx,
  sectionRowsShared,
}: {
  l2Name: string;
  categoryLeafId: string;
  currentLeaf?: any;
  sectionRows: ResolvedPhase1AttributeRow[];
  extraRows: Workshop2ConstructionPhase1ExtraRow[];
  currentPhase: '1' | '2' | '3';
  renderPhaseRow: (
    row: ResolvedPhase1AttributeRow,
    phase: '1' | '2' | '3',
    showAttributeNameHintIcon?: boolean,
    strictAttributeFillLabelColors?: boolean
  ) => ReactNode;
  dossierAttrCardCtx: Workshop2DossierAttributeCardContextProps;
  sectionRowsShared: Workshop2DossierSectionRowsSharedBundle;
}) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [tolerancesOpen, setTolerancesOpen] = useState(false);
  const [tolerancesLoading, setTolerancesLoading] = useState(false);
  const [cadParserOpen, setCadParserOpen] = useState(false);
  const [cadParserLoading, setCadParserLoading] = useState(false);
  const [cadResult, setCadResult] = useState<import('@/lib/production/cad-parser').CadParseResult | null>(null);

  const hint = constructionL2Hint(l2Name);
  const silhouetteQuadCells = buildSilhouetteQuadCells(sectionRows, extraRows);
  const constructionRowsGrid = sectionRows.filter(
    (r) =>
      r.attribute.attributeId !== 'sampleBaseSize' &&
      !W2_VISUAL_QUAD_ATTR_IDS.has(r.attribute.attributeId)
  );
  const constructionExtrasGrid = extraRows.filter(
    (e) =>
      e.attribute.attributeId !== 'sampleBaseSize' &&
      !W2_VISUAL_QUAD_ATTR_IDS.has(e.attribute.attributeId)
  );

  return (
    <div className="border-border-default scroll-mt-4 space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.LayoutList className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">
              Базовые параметры сэмпла / лекало
            </h2>
            <p className="text-text-secondary text-xs leading-snug">{hint}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 text-[11px] gap-1.5"
            onClick={() => setAvatarOpen(true)}
          >
            <LucideIcons.Box className="size-3.5" />
            3D-аватар (Скан)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-[11px] gap-1.5 border-teal-200 bg-teal-50/30 text-teal-800 hover:bg-teal-100 hover:text-teal-900"
            onClick={() => setTolerancesOpen(true)}
          >
            <LucideIcons.Sparkles className="size-3.5" />
            AI-допуски ГОСТ/ISO
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-[11px] gap-1.5 border-blue-200 bg-blue-50/30 text-blue-800 hover:bg-blue-100 hover:text-blue-900"
            onClick={() => setCadParserOpen(true)}
          >
            <LucideIcons.FileCode2 className="size-3.5" />
            Загрузить САПР (.zprj)
          </Button>
        </div>
        {silhouetteQuadCells.length > 0 ? (
          <div className="space-y-2">
            <ul className="grid gap-2 sm:grid-cols-2 *:min-w-0">
              {silhouetteQuadCells.map((cell) =>
                cell.kind === 'base' ? (
                  <Fragment key={cell.row.attribute.attributeId}>
                    {renderPhaseRow(cell.row, currentPhase)}
                  </Fragment>
                ) : (
                  <Fragment key={cell.ex.attribute.attributeId}>
                    <Workshop2DossierAttributeCard
                      {...dossierAttrCardCtx}
                      attribute={cell.ex.attribute}
                      groupLabel={cell.ex.groupLabel}
                      variant="extra"
                      frame="card"
                      workshopPhase={currentPhase}
                    />
                  </Fragment>
                )
              )}
            </ul>
          </div>
        ) : null}
        <Workshop2DossierSectionRows
          {...sectionRowsShared}
          rows={constructionRowsGrid}
          phase={currentPhase}
          extras={constructionExtrasGrid}
          opts={{ fieldLayout: 'grid2', flatCatalogGroups: true }}
        />
      </div>

      <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
        <DialogContent className="max-h-[min(90vh,600px)] w-[min(96vw,500px)] max-w-none gap-0 overflow-hidden p-0 sm:rounded-xl">
          <DialogHeader className="border-border-subtle border-b p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 text-slate-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.Box className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-base text-slate-900">3D-аватар (Скан)</DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Загрузите 3D-скан фигуры (.obj, .fbx) или укажите параметры аватара для виртуальной примерки лекал.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center justify-center space-y-4 bg-slate-50 min-h-[300px]">
            <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center animate-pulse">
              <LucideIcons.ScanFace className="w-10 h-10 text-slate-400" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">Модуль 3D-примерочной</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Эта функция требует интеграции с Clo3D или Browzwear. Поддержка просмотра .zprj и .ZPAC файлов будет добавлена в следующих релизах.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setAvatarOpen(false)}>Понятно</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={tolerancesOpen} onOpenChange={setTolerancesOpen}>
        <DialogContent className="max-h-[min(90vh,600px)] w-[min(96vw,500px)] max-w-none gap-0 overflow-hidden p-0 sm:rounded-xl">
          <DialogHeader className="border-border-subtle border-b p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100/50 text-teal-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-base text-teal-900">AI-расчет допусков ГОСТ/ISO</DialogTitle>
                <DialogDescription className="text-xs text-teal-700/80">
                  Автоматический расчет допустимых отклонений (+/- см) для ключевых измерений табеля мер на основе ткани и силуэта.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center justify-center space-y-4 bg-slate-50 min-h-[300px]">
            {tolerancesLoading ? (
              <>
                <LucideIcons.Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                <p className="text-xs font-medium text-teal-700">Анализ ткани и силуэта...</p>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Умные допуски</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Нейросеть проанализирует выбранные материалы (эластичность, усадку) и силуэт, чтобы предложить оптимальные допуски для каждой точки измерения в табеле мер.
                  </p>
                </div>
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 text-white" 
                  onClick={async () => {
                    setTolerancesLoading(true);
                    try {
                      const res = await fetch('/api/brand/workshop2/ai/tolerances', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pattern: 'Лекало' }),
                      });
                      const data = await res.json();
                      if (typeof window !== 'undefined') {
                        const toast = (window as any).__toast__;
                        if (toast) {
                          toast({ title: 'Допуски обновлены', description: 'Табель мер заполнен рекомендованными значениями ГОСТ.' });
                        }
                      }
                    } catch (error) {
                      console.error('Failed to calculate tolerances', error);
                    } finally {
                      setTolerancesLoading(false);
                      setTolerancesOpen(false);
                    }
                  }}
                >
                  Запустить расчет
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cadParserOpen} onOpenChange={(open) => {
        setCadParserOpen(open);
        if (!open) {
          setTimeout(() => setCadResult(null), 200);
        }
      }}>
        <DialogContent className="max-h-[min(90vh,600px)] w-[min(96vw,500px)] max-w-none gap-0 overflow-hidden p-0 sm:rounded-xl">
          <DialogHeader className="border-border-subtle border-b p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100/50 text-blue-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.FileCode2 className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-base text-blue-900">Парсинг САПР файла</DialogTitle>
                <DialogDescription className="text-xs text-blue-700/80">
                  Загрузите файл Clo3D (.zprj) или Browzwear (.zpac) для автоматического расчета расхода.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center justify-center space-y-4 bg-slate-50 min-h-[300px]">
            {cadParserLoading ? (
              <>
                <LucideIcons.Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-sm font-medium text-blue-700">Анализ файла...</p>
                <p className="text-xs text-blue-500 max-w-xs text-center">Извлекаем площадь лекал и рассчитываем длину швов для черновых узлов BOM...</p>
              </>
            ) : cadResult ? (
              <div className="w-full space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
                    <span className="text-sm font-semibold text-blue-900">Результаты анализа</span>
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {cadResult.patterns.length} лекал
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-blue-600/80">Суммарная площадь</span>
                      <p className="text-sm font-medium text-blue-900">
                        {cadResult.patterns.reduce((sum: number, p: any) => sum + p.areaM2, 0).toFixed(2)} м²
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-blue-600/80">Длина швов</span>
                      <p className="text-sm font-medium text-blue-900">{cadResult.seamLengthsTotalMeters} м</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs text-blue-600/80 mb-2 block">Будут добавлены материалы:</span>
                    <ul className="space-y-1.5">
                      {cadResult.mockMaterialLines.map((line: any) => (
                        <li key={line.id} className="text-xs text-blue-800 flex justify-between bg-white/60 px-2 py-1.5 rounded">
                          <span className="font-medium truncate mr-2">{line.materialName}</span>
                          <span className="shrink-0 text-blue-600">{line.consumption} {line.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCadParserOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      dossierAttrCardCtx.setDossier((prev: any) => {
                        const existingModel = prev.productionModel || { version: 1, nodes: [], materialLines: [], trimLines: [], operations: [], measurements: [] };
                        return {
                          ...prev,
                          productionModel: {
                            ...existingModel,
                            materialLines: [
                              ...existingModel.materialLines,
                              ...cadResult.mockMaterialLines
                            ]
                          }
                        };
                      });
                      if (typeof window !== 'undefined') {
                        const toast = (window as any).__toast__;
                        if (toast) {
                          toast({
                            title: 'BOM обновлен',
                            description: `Добавлено ${cadResult.mockMaterialLines.length} строк в спецификацию материалов.`,
                          });
                        }
                      }
                      setCadParserOpen(false);
                    }}
                  >
                    Сгенерировать BOM
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-slate-300 shadow-sm flex items-center justify-center border-dashed">
                  <LucideIcons.UploadCloud className="w-10 h-10 text-slate-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Перетащите .zprj или .zpac файл</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Система автоматически извлечет список деталей и сгенерирует черновые узлы в BOM (Материалы), сокращая ручной ввод.
                  </p>
                </div>
                
                <div className="relative w-full max-w-xs group mt-2">
                  <input
                    type="file"
                    accept=".zprj,.zpac"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      setCadParserLoading(true);
                      try {
                        const { parseCadFile } = await import('@/lib/production/cad-parser');
                        const result = await parseCadFile(file);
                        setCadResult(result);
                      } catch (error) {
                        console.error('Failed to parse CAD file', error);
                      } finally {
                        setCadParserLoading(false);
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    className="w-full bg-blue-600 group-hover:bg-blue-700 text-white pointer-events-none" 
                  >
                    Выбрать файл на компьютере
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
