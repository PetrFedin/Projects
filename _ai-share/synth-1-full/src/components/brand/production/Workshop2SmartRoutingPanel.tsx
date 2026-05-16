'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';
import type {
  Workshop2DossierPhase1,
  Workshop2SmartRoutingOperation,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { downloadWorkshop2SmartRoutingCsv } from '@/lib/production/workshop2-smart-routing-csv';

const DEMO_SEQUENCE_APPAREL: Workshop2SmartRoutingOperation[] = [
  { id: '1', category: 'Заготовка', name: '1. Дублирование деталей полочки', equipment: 'Пресс проходной', sash: 1.2 },
  { id: '2', category: 'Заготовка', name: '2. Обработка вытачек на полочке и спинке', equipment: 'Универсальная машина', sash: 2.5 },
  { id: '3', category: 'Заготовка', name: '3. Обработка карманов в листочку', equipment: 'Универсальная машина', sash: 5.0 },
  { id: '4', category: 'Монтаж', name: '4. Стачать плечевые и боковые швы', equipment: 'Оверлок 4-ниточный', sash: 3.5 },
  { id: '5', category: 'Монтаж', name: '5. Втачать рукава в проймы', equipment: 'Оверлок 4-ниточный', sash: 4.0 },
  { id: '6', category: 'Отделка', name: '6. Подшить низ изделия и низ рукавов', equipment: 'Машина потайного стежка', sash: 2.8 },
  { id: '7', category: 'Отделка', name: '7. Окончательная ВТО', equipment: 'Утюжильный стол', sash: 3.0 },
];

const DEMO_SEQUENCE_SHOES: Workshop2SmartRoutingOperation[] = [
  { id: '1', category: 'Раскрой', name: '1. Раскрой деталей верха', equipment: 'Вырубной пресс', sash: 3.5 },
  { id: '2', category: 'Заготовка', name: '2. Спускание краев деталей', equipment: 'Машина для спускания краев', sash: 2.0 },
  { id: '3', category: 'Заготовка', name: '3. Сборка заготовки верха', equipment: 'Швейная машина колонковая', sash: 6.5 },
  { id: '4', category: 'Затяжка', name: '4. Формование пяточной части', equipment: 'Машина для формования пятки', sash: 1.5 },
  { id: '5', category: 'Затяжка', name: '5. Затяжка носочно-пучковой части', equipment: 'Затяжная машина (ЗНП)', sash: 2.5 },
  { id: '6', category: 'Сборка', name: '6. Приклеивание подошвы', equipment: 'Пресс для приклеивания подошв', sash: 3.0 },
  { id: '7', category: 'Отделка', name: '7. Чистка и финишная обработка', equipment: 'Финишная машина', sash: 4.0 },
];

const DEMO_SEQUENCE_BAGS: Workshop2SmartRoutingOperation[] = [
  { id: '1', category: 'Раскрой', name: '1. Вырубка основных деталей', equipment: 'Вырубной пресс', sash: 2.5 },
  { id: '2', category: 'Заготовка', name: '2. Шерфование краев кожи', equipment: 'Машина для спускания краев', sash: 1.8 },
  { id: '3', category: 'Сборка', name: '3. Сборка ручек', equipment: 'Швейная машина с плоской платформой', sash: 3.0 },
  { id: '4', category: 'Заготовка', name: '4. Подготовка подкладки и внутренних карманов', equipment: 'Универсальная швейная машина', sash: 4.5 },
  { id: '5', category: 'Сборка', name: '5. Соединение верха с подкладкой', equipment: 'Швейная машина рукавного типа', sash: 5.5 },
  { id: '6', category: 'Фурнитура', name: '6. Установка фурнитуры (замки, хольнитены)', equipment: 'Пресс для установки фурнитуры', sash: 2.0 },
  { id: '7', category: 'Отделка', name: '7. Покраска и полировка урезов', equipment: 'Машина для покраски урезов', sash: 3.5 },
];

export type Workshop2SmartRoutingPanelProps = {
  dossier: Workshop2DossierPhase1;
  setDossier: React.Dispatch<React.SetStateAction<Workshop2DossierPhase1>>;
  /** Имя файла CSV без расширения (коллекция, SKU). */
  csvBasename: string;
  disabled?: boolean;
  /** Сброс локального списка при смене артикула / коллекции. */
  routingHydrateKey: string;
  categoryLeafId?: string;
  currentLeaf?: any;
};

export function Workshop2SmartRoutingPanel({
  dossier,
  setDossier,
  csvBasename,
  disabled = false,
  routingHydrateKey,
  categoryLeafId,
  currentLeaf,
}: Workshop2SmartRoutingPanelProps) {
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState<Workshop2SmartRoutingOperation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setOperations(dossier.smartRoutingSequence ?? []);
  }, [routingHydrateKey, dossier.smartRoutingSequence]);

  const persistSequence = useCallback(
    (next: Workshop2SmartRoutingOperation[]) => {
      setOperations(next);
      setDossier((prev) => ({
        ...prev,
        smartRoutingSequence: next.length ? next : undefined,
      }));
    },
    [setDossier]
  );

  const handleGenerate = () => {
    setLoading(true);
    window.setTimeout(() => {
      const l1 = currentLeaf?.l1Name?.toLowerCase() || '';
      const cid = categoryLeafId?.toLowerCase() || '';
      const isShoes = cid.startsWith('catalog-shoes') || cid.includes('footwear') || l1.includes('обувь') || l1.includes('shoes') || l1.includes('footwear');
      const isBags = cid.startsWith('catalog-bags') || cid.includes('bag') || l1.includes('сумки') || l1.includes('bags');
      const targetDemo = isShoes ? DEMO_SEQUENCE_SHOES : isBags ? DEMO_SEQUENCE_BAGS : DEMO_SEQUENCE_APPAREL;
      
      const next = targetDemo.map((o) => ({ ...o }));
      persistSequence(next);
      setLoading(false);
      toast({
        title: 'Маршрутизация',
        description: `Загружен типовой шаблон (${isShoes ? 'обувь' : isBags ? 'сумки' : 'одежда'}). Адаптируйте последовательность вручную.`,
      });
    }, 500);
  };

  const handleExportCsv = useCallback(() => {
    if (!operations.length) return;
    try {
      downloadWorkshop2SmartRoutingCsv(operations, csvBasename);
      toast({
        title: 'CSV',
        description: `Экспорт: ${operations.length} операций, UTF-8 с BOM для Excel.`,
      });
    } catch {
      toast({
        title: 'CSV',
        description: 'Не удалось сформировать файл.',
        variant: 'destructive',
      });
    }
  }, [operations, csvBasename, toast]);

    const totalSash = operations.reduce((sum, op) => sum + op.sash, 0);

  const updateOpSash = useCallback(
    (id: string, newSash: number) => {
      const next = operations.map((op) => (op.id === id ? { ...op, sash: newSash } : op));
      persistSequence(next);
    },
    [operations, persistSequence]
  );

  const updateOpEquipment = useCallback(
    (id: string, newEquipment: string) => {
      const next = operations.map((op) => (op.id === id ? { ...op, equipment: newEquipment } : op));
      persistSequence(next);
    },
    [operations, persistSequence]
  );

  const removeOp = useCallback(
    (id: string) => {
      const next = operations.filter((op) => op.id !== id);
      persistSequence(next);
    },
    [operations, persistSequence]
  );

  const handleAddOperation = useCallback(() => {
    const newOp = {
      id: `op-${Date.now()}`,
      category: 'Сборка',
      name: 'Новая технологическая операция',
      equipment: 'Универсальная машина',
      sash: 1.0,
    };
    persistSequence([...operations, newOp]);
  }, [operations, persistSequence]);

  return (
    <div
      id="w2-smart-routing"
      className="border-border-default scroll-mt-24 space-y-3 rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Route className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <h2 className="text-text-primary text-base font-semibold">
                Умная маршрутизация (технологическая последовательность)
              </h2>
              <p className="text-text-secondary text-xs leading-snug pr-4">
                Генерация детальной последовательности, норматива SASH (мин) и оборудования по узлам изделия.
                Цепочка сохраняется в досье для повторного открытия и выгрузки в CSV.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOperation}
                disabled={disabled}
                className="gap-1.5 h-8 text-[11px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
              >
                <LucideIcons.Plus className="h-3.5 w-3.5" />
                Добавить операцию
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={loading || disabled}
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
              >
                {loading ? (
                  <LucideIcons.Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <LucideIcons.ListTree className="size-3.5" />
                )}
                {loading ? 'Загрузка...' : 'Загрузить типовой шаблон'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {operations.length > 0 && (
        <div className="border-border-subtle bg-bg-surface2/30 mt-3 overflow-hidden rounded-lg border">
          <div className="bg-bg-surface1 border-border-subtle flex items-center justify-between border-b px-3 py-2">
            <span className="text-text-primary text-[11px] font-semibold">
              Маршрут: {operations.length} операций · Σ {totalSash.toFixed(1)} мин
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-accent-primary h-7 gap-1 px-2 text-[10px]"
              disabled={disabled || operations.length === 0}
              onClick={() => handleExportCsv()}
            >
              <LucideIcons.Download className="h-3 w-3" /> Экспорт CSV
            </Button>
          </div>
          <div className="p-3">
            <ul className="space-y-0">
              {operations.map((op) => (
                <li
                  key={op.id}
                  className="group border-border-subtle/50 flex flex-col border-b py-2 pr-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-slate-50"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      <select
                        value={op.category}
                        disabled={disabled}
                        onChange={(e) => {
                          const next = operations.map((o) => (o.id === op.id ? { ...o, category: e.target.value } : o));
                          persistSequence(next);
                        }}
                        className="h-4 border border-border-default rounded px-1 text-[9px] bg-white outline-none disabled:opacity-50 uppercase"
                      >
                        <option value="Раскрой">Раскрой</option>
                        <option value="Заготовка">Заготовка</option>
                        <option value="Монтаж">Монтаж</option>
                        <option value="Сборка">Сборка</option>
                        <option value="Отделка">Отделка</option>
                        <option value="Упаковка">Упаковка</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={op.name}
                      disabled={disabled}
                      onChange={(e) => {
                        const next = operations.map((o) => (o.id === op.id ? { ...o, name: e.target.value } : o));
                        persistSequence(next);
                      }}
                      className="text-text-primary text-sm font-medium leading-tight break-words pt-0.5 bg-transparent outline-none border-b border-transparent focus:border-indigo-400 focus:bg-white px-1 w-full transition-colors disabled:opacity-50"
                      placeholder="Название операции..."
                    />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center justify-end gap-2 pl-10 sm:mt-0 sm:shrink-0 sm:pl-4">
                    <div className="border-border-subtle focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 flex items-center gap-1.5 rounded border bg-white px-1.5 py-0.5 transition-all">
                      <LucideIcons.Scissors className="text-text-muted h-3 w-3" />
                      <input
                        type="text"
                        value={op.equipment}
                        disabled={disabled}
                        onChange={(e) => updateOpEquipment(op.id, e.target.value)}
                        className="w-[120px] bg-transparent text-[10px] text-text-secondary outline-none placeholder:text-text-muted disabled:opacity-50"
                        placeholder="Оборудование..."
                      />
                    </div>
                    <div className="border-border-subtle focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 flex min-w-[5rem] items-center justify-end gap-1.5 rounded border bg-white px-1.5 py-0.5 transition-all">
                      <LucideIcons.Clock className="text-text-muted h-3 w-3 shrink-0" />
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={op.sash}
                        disabled={disabled}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) updateOpSash(op.id, val);
                        }}
                        className="w-10 text-right bg-transparent text-[11px] font-mono font-medium text-text-primary outline-none disabled:opacity-50"
                      />
                      <span className="text-text-muted text-[9px]">мин</span>
                    </div>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => removeOp(op.id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-0 transition-all ml-1"
                      title="Удалить операцию"
                    >
                      <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        const next = [...operations];
                        const idx = next.findIndex(o => o.id === op.id);
                        if (idx > -1) {
                          const clone = { ...next[idx], id: `op-${Date.now()}` };
                          next.splice(idx + 1, 0, clone);
                          persistSequence(next);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-0 transition-all ml-1"
                      title="Дублировать операцию"
                    >
                      <LucideIcons.Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
