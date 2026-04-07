'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ChevronUp, ChevronDown, ExternalLink, Settings2, GanttChart, LayoutGrid, Columns3, GitBranch } from 'lucide-react';
import { getLiveProcessDefinition, getAllLiveProcessIds } from '@/lib/live-process/process-definitions';
import { getLiveProcessTeam } from '@/lib/live-process/mock-team';
import { getInstancesForProcess } from '@/lib/live-process/mock-contexts';
import { useLiveProcessRuntimeWithCalendar } from '@/lib/live-process/use-live-process-with-calendar';
import { LiveProcessSchemeGrid } from '@/components/live-process/LiveProcessSchemeGrid';
import { LiveProcessSchemeEditor } from '@/components/live-process/LiveProcessSchemeEditor';
import { LiveProcessStageCard } from '@/components/live-process/LiveProcessStageCard';
import { ProcessContextSelector } from '@/components/live-process/ProcessContextSelector';
import { LiveProcessMetrics } from '@/components/live-process/LiveProcessMetrics';
import { ProcessTriggersConfig } from '@/components/live-process/ProcessTriggersConfig';
import { ProcessGanttView } from '@/components/live-process/ProcessGanttView';
import { ProcessKanbanView } from '@/components/live-process/ProcessKanbanView';
import { ProcessGraphView } from '@/components/live-process/ProcessGraphView';
import { ProcessFilters, type ProcessFilterState } from '@/components/live-process/ProcessFilters';
import { PushNotificationBanner } from '@/components/live-process/PushNotificationBanner';
import { LiveProcessMobileQuickActions } from '@/components/live-process/LiveProcessMobileQuickActions';
import { processLiveUrl } from '@/lib/routes';
import { ROUTES } from '@/lib/routes';

type ViewMode = 'grid' | 'kanban' | 'gantt' | 'graph';

const defaultFilters: ProcessFilterState = {
  statuses: [],
  assigneeIds: [],
  dateFrom: null,
  dateTo: null,
  contextIds: [],
};

export type LiveProcessPageBodyProps = {
  processId: string;
  /** Рендер внутри вкладки «Цех»: компактная шапка и контекст из коллекции производства */
  embedded?: boolean;
  /** Совпадает с `collectionId` на `/brand/production` (контекст процесса production) */
  workshopCollectionId?: string;
  /** Смена контекста в селекторе LIVE → обновить коллекцию в URL цеха */
  onWorkshopCollectionChange?: (collectionId: string) => void;
};

export function LiveProcessPageBody({
  processId,
  embedded = false,
  workshopCollectionId = '',
  onWorkshopCollectionChange,
}: LiveProcessPageBodyProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlContext = searchParams.get('context') ?? searchParams.get('contextId') ?? '';
  const workshopCtx = workshopCollectionId.trim();
  const contextId =
    embedded && onWorkshopCollectionChange ? (workshopCtx || 'default') : (urlContext || 'default');

  const handleContextChange = (newContextId: string) => {
    if (embedded && onWorkshopCollectionChange) {
      onWorkshopCollectionChange(newContextId);
      return;
    }
    const next = new URLSearchParams(searchParams.toString());
    next.set('context', newContextId);
    router.replace(`?${next.toString()}`);
  };

  const fullPageHref = processLiveUrl(
    processId,
    contextId && contextId !== 'default' ? contextId : undefined
  );

  const definition = useMemo(() => getLiveProcessDefinition(processId), [processId]);
  const team = useMemo(() => getLiveProcessTeam(), []);
  const { runtimes, updateStageRuntime } = useLiveProcessRuntimeWithCalendar(processId, contextId || 'default');

  const completedCount = useMemo(() => {
    if (!definition) return 0;
    return definition.stages.filter((s) => runtimes[s.id]?.status === 'done').length;
  }, [definition, runtimes]);
  const progressPct = definition ? Math.round((completedCount / definition.stages.length) * 100) : 0;

  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showSchemeEditor, setShowSchemeEditor] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<ProcessFilterState>(defaultFilters);

  const instances = useMemo(() => getInstancesForProcess(processId), [processId]);
  const contextLabels = useMemo(
    () => instances.map((i) => ({ id: i.contextId, label: i.context.label })),
    [instances]
  );

  const filteredStages = useMemo(() => {
    if (
      !filters.statuses.length &&
      !filters.assigneeIds.length &&
      !filters.dateFrom &&
      !filters.dateTo
    ) {
      return definition.stages;
    }
    return definition.stages.filter((stage) => {
      const rt = runtimes[stage.id];
      if (!rt) return true;
      if (filters.statuses.length && !filters.statuses.includes(rt.status)) return false;
      if (
        filters.assigneeIds.length &&
        !rt.assigneeIds.some((id) => filters.assigneeIds.includes(id))
      ) {
        return false;
      }
      if (filters.dateFrom && rt.plannedEndAt && new Date(rt.plannedEndAt) < new Date(filters.dateFrom))
        return false;
      if (filters.dateTo && rt.plannedStartAt && new Date(rt.plannedStartAt) > new Date(filters.dateTo))
        return false;
      return true;
    });
  }, [definition, runtimes, filters]);
  const isBlocked = useMemo(() => {
    const doneIds = new Set(
      definition?.stages.filter((s) => runtimes[s.id]?.status === 'done').map((s) => s.id) ?? []
    );
    return (stageId: string) => {
      const stage = definition?.stages.find((s) => s.id === stageId);
      if (!stage?.dependsOn.length) return false;
      return stage.dependsOn.some((depId) => !doneIds.has(depId));
    };
  }, [definition, runtimes]);

  if (!processId || !definition) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>LIVE process</CardTitle>
            <CardDescription>Выберите процесс:</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {getAllLiveProcessIds().map((id) => (
              <Link key={id} href={processLiveUrl(id)}>
                <Button variant="outline" size="sm">{id}</Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={embedded ? 'max-w-6xl mx-auto px-0 py-2 pb-8 md:pb-6' : 'container max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-8'}>
      {/* Header: mobile-friendly */}
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-2 shrink-0">
          {!embedded ? (
            <Link href={ROUTES.brand.controlCenter ?? ROUTES.brand.home}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="shrink-0 h-9" asChild>
              <Link href={fullPageHref} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Отдельно</span>
              </Link>
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight truncate">
              LIVE: {definition.name}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5 line-clamp-2">
              {embedded
                ? `${definition.description} Контекст коллекции совпадает с выбором на вкладке «Коллекция», если задан.`
                : definition.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {definition.contextKey && (
            <div className="w-full md:w-auto">
              <ProcessContextSelector
                processId={processId}
                contextKey={definition.contextKey}
                contextId={contextId}
                onContextChange={handleContextChange}
              />
            </div>
          )}
          <Link href={ROUTES.brand.team}>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">Команда</Button>
          </Link>
          <Link href={ROUTES.brand.calendar}>
            <Button variant="outline" size="sm">Календарь</Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSchemeEditor(!showSchemeEditor)}
          >
            <Settings2 className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Конструктор</span>
          </Button>
        </div>
      </div>

      {/* View switcher + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex rounded-lg border p-0.5 bg-slate-50">
          {[
            { id: 'grid' as ViewMode, icon: LayoutGrid, label: 'Схема' },
            { id: 'kanban' as ViewMode, icon: Columns3, label: 'Kanban' },
            { id: 'gantt' as ViewMode, icon: GanttChart, label: 'Gantt' },
            { id: 'graph' as ViewMode, icon: GitBranch, label: 'Граф' },
          ].map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={viewMode === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode(id)}
              className="rounded-md"
            >
              <Icon className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
        <ProcessFilters
          team={team}
          contextLabels={contextLabels}
          filters={filters}
          onChange={setFilters}
        />
        <PushNotificationBanner />
      </div>

      {showSchemeEditor && (
        <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
          <h2 className="text-sm font-bold uppercase tracking-tight text-slate-700 mb-3">
            Редактор этапов — создание/редактирование без деплоя
          </h2>
          <LiveProcessSchemeEditor
            processId={processId}
            onSave={async (def) => {
              const res = await fetch(`/api/processes/${processId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(def),
              });
              if (res.ok) setShowSchemeEditor(false);
            }}
          />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-tight">Прогресс по этапам</CardTitle>
          <CardDescription>
            Ответственные, даты, доступы и обсуждения по каждому этапу. Данные сохраняются локально.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <Progress value={progressPct} className="flex-1 h-2" />
            <span className="text-sm font-medium">{completedCount} из {definition.stages.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {getAllLiveProcessIds().map((id) => (
              <Link key={id} href={processLiveUrl(id, contextId)}>
                <Button variant={id === processId ? 'default' : 'ghost'} size="sm" className="text-xs">
                  {id}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Метрики и KPI */}
      {showMetrics && (
        <div className="mb-6">
          <LiveProcessMetrics processId={processId} />
        </div>
      )}

      {/* View: Grid | Kanban | Gantt | Graph */}
      <div className="mb-6">
        {viewMode === 'grid' && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-700 mb-3">
              Поэтапная схема: {definition.name}
              {filteredStages.length !== definition.stages.length && (
                <span className="text-slate-500 font-normal ml-2">
                  (показано {filteredStages.length} из {definition.stages.length})
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Выберите ответственных, даты. Наведите на блок — подсветятся связи.
            </p>
            <div className="overflow-x-auto pb-4">
              <LiveProcessSchemeGrid
                stages={filteredStages.length ? filteredStages : definition.stages}
                runtimes={runtimes}
                team={team}
                isBlocked={isBlocked}
                onUpdateRuntime={updateStageRuntime}
                processLinks={definition.processLinks}
              />
            </div>
          </>
        )}
        {viewMode === 'kanban' && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-700 mb-3">
              Kanban: этапы — колонки, карточки — инстансы
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Карточка инстанса в колонке текущего этапа. Клик — переход к инстансу.
            </p>
            <ProcessKanbanView
              processId={processId}
              stages={definition.stages}
              team={team}
              contextId={contextId || undefined}
              refreshToken={runtimes}
              filterContextIds={filters.contextIds.length ? filters.contextIds : undefined}
            />
          </>
        )}
        {viewMode === 'gantt' && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-700 mb-3">
              Gantt: этапы по датам
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Все этапы инстансов. Даты синхронизируются с календарём.
            </p>
            <ProcessGanttView processId={processId} contextId={contextId || undefined} />
          </>
        )}
        {viewMode === 'graph' && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-700 mb-3">
              Граф: узлы — этапы, рёбра — зависимости
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Наведите на узел — подсветятся связи. Цвет: зелёный — готово, синий — в работе.
            </p>
            <ProcessGraphView
              stages={definition.stages}
              runtimes={runtimes}
            />
          </>
        )}
      </div>

      {/* Подробный вид: доступ, обсуждения, задачи */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => setShowDetailedView(!showDetailedView)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          {showDetailedView ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Подробный вид по этапам: доступ, участники обсуждения, комментарии, заметки, задачи
        </button>
        {showDetailedView && (
          <div className="space-y-4 mt-4">
            {definition.stages.map((stage, index) => {
              const runtime = runtimes[stage.id];
              if (!runtime) return null;
              return (
                <LiveProcessStageCard
                  key={stage.id}
                  stage={stage}
                  runtime={runtime}
                  team={team}
                  isBlocked={isBlocked(stage.id)}
                  onUpdateRuntime={updateStageRuntime}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Триггеры и Webhooks */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <ProcessTriggersConfig />
      </div>

      {/* Мобильный вид: быстрая смена статуса и комментарии */}
      <LiveProcessMobileQuickActions
        stages={definition.stages}
        runtimes={runtimes}
        onStatusChange={(stageId, status) => updateStageRuntime(stageId, { status })}
        onOpenChat={() => setShowDetailedView(true)}
      />
    </div>
  );
}
