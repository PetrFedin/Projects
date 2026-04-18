'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { MOCK_STAGE_METRICS, MOCK_PROCESS_KPI } from '@/lib/live-process/mock-metrics';
import { getLiveProcessDefinition } from '@/lib/live-process/process-definitions';
import type { StageMetrics, ProcessKpi } from '@/lib/live-process/types';

interface LiveProcessMetricsProps {
  processId: string;
}

export function LiveProcessMetrics({ processId }: LiveProcessMetricsProps) {
  const definition = getLiveProcessDefinition(processId);
  const stageMetrics = MOCK_STAGE_METRICS[processId] ?? [];
  const kpi = MOCK_PROCESS_KPI[processId];

  if (!definition || (!stageMetrics.length && !kpi)) return null;

  return (
    <div className="space-y-4">
      {/* KPI */}
      {kpi && (
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-bold">KPI процесса</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase text-slate-500">% вовремя</p>
              <p className="text-lg font-bold text-emerald-600">{kpi.onTimePct}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500">Средний цикл (дн.)</p>
              <p className="text-lg font-bold">{kpi.avgCycleDays}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500">Просрочки</p>
              <p className="text-lg font-bold text-amber-600">{kpi.overdueInstances}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500">Без ответственного</p>
              <p className="text-lg font-bold text-red-600">{kpi.stagesWithoutAssignee}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Воронка: среднее время по этапам */}
      {stageMetrics.length > 0 && definition && (
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-bold">Воронка: среднее время по этапам</h3>
            <p className="text-xs text-slate-500">Узкие места — этапы с высоким % просрочек</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stageMetrics.map((m) => {
                const stage = definition.stages.find((s) => s.id === m.stageId);
                const isBottleneck = m.overduePct >= 20;
                return (
                  <div key={m.stageId} className="flex items-center gap-3">
                    <span className="w-32 truncate text-xs">{stage?.title ?? m.stageId}</span>
                    <div className="flex-1">
                      <Progress
                        value={100 - m.overduePct}
                        className={`h-2 ${isBottleneck ? '[&>div]:bg-amber-500' : ''}`}
                      />
                    </div>
                    <span className="w-16 text-xs text-slate-600">{m.avgDays} дн.</span>
                    {m.overduePct > 0 && (
                      <span
                        className={`text-[10px] ${isBottleneck ? 'font-medium text-amber-600' : 'text-slate-500'}`}
                      >
                        {m.overduePct}% проср.
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
