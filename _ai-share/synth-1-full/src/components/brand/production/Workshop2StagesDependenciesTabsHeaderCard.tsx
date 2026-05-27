'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getCollectionBrandGuideTitles,
  getCollectionBrandNarrativeTitles,
} from '@/lib/production/collection-steps-catalog';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import {
  StagesHelpHover,
  StagesHelpIconTrigger,
  StagesHelpWhyBlock,
} from '@/components/brand/production/stages-dependencies-tab-content-stages-help';
import { StagesContextFilterPulseIcon } from '@/components/brand/production/stages-dependencies-tab-panel-chrome';
import type { StagesSubTab } from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import { LayoutGrid, ListTree, Package } from 'lucide-react';

export type Workshop2StagesDependenciesTabsHeaderCardProps = {
  contextFilterActive: boolean;
  filterBadgeSub: StagesSubTab | null;
};

export function Workshop2StagesDependenciesTabsHeaderCard(
  props: Workshop2StagesDependenciesTabsHeaderCardProps
) {
  const { contextFilterActive, filterBadgeSub } = props;

  return (
    <Card className="border-border-default bg-bg-surface2/60">
      <CardHeader className="space-y-0 pb-3">
        <div className="flex flex-row flex-wrap items-start gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <CardTitle className="text-text-primary text-xs uppercase tracking-tight">
              Контроль коллекции: этапы и зависимости
            </CardTitle>
            <p className="text-text-secondary text-xs leading-relaxed">
              Срез и перечень SKU, доска по текущим этапам, схема зависимостей и агрегированная
              матрица статусов — один контекст коллекции без прыжков по модулям.
            </p>
          </div>
          <StagesHelpHover
            wide
            title="Контроль коллекции: этапы и зависимости"
            trigger={
              <StagesHelpIconTrigger
                aria-label="Справка: контроль коллекции, срез, URL и схема"
                className="shrink-0"
              />
            }
          >
            <StagesHelpWhyBlock title="Зачем">
              <p>
                Один экран связывает срез артикулов, перечень для расчётов, схему этапов и матрицу
                статусов — чтобы не прыгать между модулями без контекста.
              </p>
            </StagesHelpWhyBlock>
            <StagesHelpWhyBlock title="Контур коллекции в каталоге">
              <p className="text-text-secondary mb-2 text-[10px] leading-snug">
                Полный путь «от идеи к полке» — тот же порядок, что в{' '}
                <strong className="text-text-primary">матрице этапов</strong> и в графе{' '}
                <code className="bg-bg-surface2 rounded px-1">dependsOn</code> (блокировки
                следующего шага считаются по зависимостям, а не по номеру в списке ниже).
              </p>
              <ol className="text-text-secondary border-border-subtle bg-bg-surface2/80 max-h-52 list-decimal space-y-0.5 overflow-y-auto rounded-md border p-2 pl-4 text-[10px]">
                {getCollectionBrandNarrativeTitles().map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            </StagesHelpWhyBlock>
            <StagesHelpWhyBlock title="Гайд бренда (дорожная карта)">
              <p className="text-text-secondary mb-2 text-[10px] leading-snug">
                Тот же набор этапов в логике{' '}
                <strong className="text-text-primary">презентаций и планирования с командой</strong>{' '}
                (семплы и закупка до формального согласования образа и ТЗ; комплектация B2B в
                повестке рядом со складом). Для{' '}
                <strong className="text-text-primary">статусов и «что блокирует что»</strong>{' '}
                ориентируйтесь на список выше и матрицу — там порядок строк = исполнение и{' '}
                <code className="bg-bg-surface2 rounded px-1">dependsOn</code> (например семплы
                после Tech Pack и поставки в цех; на серии — nesting → выпуск → ОТК → склад →
                комплектация → отгрузка).
              </p>
              <ol className="text-text-secondary border-accent-primary/20 bg-accent-primary/10 max-h-52 list-decimal space-y-0.5 overflow-y-auto rounded-md border p-2 pl-4 text-[10px]">
                {getCollectionBrandGuideTitles().map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            </StagesHelpWhyBlock>
            <p>
              <strong className="text-text-primary">Категории</strong> — из{' '}
              <strong className="text-text-primary">CATEGORY_HANDBOOK</strong>: сначала аудитория,
              затем три уровня L1–L3 под корнями аудитории.
            </p>
            <p>
              <strong className="text-text-primary">Схема зависимостей</strong> (5 узлов в строке,
              змейка, без горизонтального скролла): числа — по пулу среза; клик по узлу сужает доску
              и матрицу до SKU с этапом на этом узле (повторный клик — сброс).
            </p>
            <div>
              <p className="text-text-primary mb-1.5 font-semibold">Параметры в URL</p>
              <ul className="text-text-secondary list-disc space-y-1 pl-4 text-[10px]">
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesAudience
                  </code>
                  ,{' '}
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesSeason
                  </code>
                  ,{' '}
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesL1
                  </code>
                  –<code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">L3</code>,{' '}
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesFab
                  </code>{' '}
                  — срез (несколько значений через запятую, OR внутри оси; между осями — AND).
                  Значения в URL кодируются через{' '}
                  <code className="text-[10px]">encodeURIComponent</code>.
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesSku
                  </code>{' '}
                  — один артикул в рабочем контексте (id в коллекции)
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesChainFocus
                  </code>{' '}
                  — фильтр узла схемы
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesMatrixSku
                  </code>{' '}
                  — устаревший deep link: при открытии переносит на вкладку «По артикулам» с
                  выбранным SKU и удаляется из URL
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesSub
                  </code>{' '}
                  — внутренняя вкладка (оперативка / процесс / по артикулам)
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesFilterSub
                  </code>{' '}
                  — вкладка, где последний раз меняли срез (пульсирующая иконка фильтра)
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesMatrixPhase
                  </code>{' '}
                  — фильтр матрицы по фазе каталога (точное имя группы этапа); сбрасывается вместе с
                  «Сбросить срез»
                </li>
                <li>
                  <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                    stagesMatrixQ
                  </code>{' '}
                  — текстовый фильтр строк матрицы (подстрока в названии, фазе, id или зоне); до
                  ~120 символов
                </li>
              </ul>
            </div>
          </StagesHelpHover>
        </div>
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'mt-4 flex-wrap')}>
          <TabsTrigger
            value="ops"
            title="Доска этапов и срез коллекции (без перезагрузки страницы — меняется блок ниже)"
            className={cn(cabinetSurface.tabsTrigger, 'h-auto gap-1.5 px-2.5 py-2 tracking-wider')}
          >
            <LayoutGrid
              className="pointer-events-none h-3.5 w-3.5 shrink-0 opacity-70"
              aria-hidden
            />
            <span className="whitespace-nowrap">Оперативка</span>
            {contextFilterActive && filterBadgeSub === 'ops' ? (
              <StagesContextFilterPulseIcon />
            ) : null}
          </TabsTrigger>
          <TabsTrigger
            value="process"
            title="Схема зависимостей и матрица статусов по этапам"
            className={cn(cabinetSurface.tabsTrigger, 'h-auto gap-1.5 px-2.5 py-2 tracking-wider')}
          >
            <ListTree className="pointer-events-none h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            <span className="max-w-[10rem] leading-tight sm:whitespace-nowrap">
              Процесс и правила
            </span>
            {contextFilterActive && filterBadgeSub === 'process' ? (
              <StagesContextFilterPulseIcon />
            ) : null}
          </TabsTrigger>
          <TabsTrigger
            value="sku"
            title="Карточка одного SKU: чеклисты этапов и кнопки «в модуль»"
            className={cn(cabinetSurface.tabsTrigger, 'h-auto gap-1.5 px-2.5 py-2 tracking-wider')}
          >
            <Package className="pointer-events-none h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            <span className="whitespace-nowrap">По артикулам</span>
            {contextFilterActive && filterBadgeSub === 'sku' ? (
              <StagesContextFilterPulseIcon />
            ) : null}
          </TabsTrigger>
        </TabsList>
        <p className="text-text-secondary mt-2 text-[10px] leading-snug">
          Это три <strong className="text-text-primary font-semibold">секции одного экрана</strong>{' '}
          (адрес в браузере чуть меняется — так удобнее делиться ссылкой). Не обновление страницы:
          переключается только содержимое ниже. Матрица этапов — на вкладке «Процесс и правила».
        </p>
      </CardHeader>
    </Card>
  );
}
