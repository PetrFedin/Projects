'use client';

import { useMemo } from 'react';
import { getLiveProcessDefinition } from '@/lib/live-process/process-definitions';
import { getEventsForProcess, getAllCalendarEvents } from '@/lib/live-process/calendar-sync';
import { getInstancesForProcess } from '@/lib/live-process/mock-contexts';
import { useLiveProcessRuntime } from '@/lib/live-process/use-live-process-runtime';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface ProcessGanttViewProps {
  processId: string;
  contextId?: string;
}

export function ProcessGanttView({ processId, contextId }: ProcessGanttViewProps) {
  const definition = getLiveProcessDefinition(processId);
  const instances = getInstancesForProcess(processId);

  const events = useMemo(() => {
    return contextId
      ? getEventsForProcess(processId, contextId)
      : getAllCalendarEvents().filter((e) => e.processId === processId);
  }, [processId, contextId]);

  const ctxIds = contextId ? [contextId] : instances.map((i) => i.contextId);
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const bars = useMemo(() => {
    const result: { stageId: string; stageTitle: string; contextId: string; contextLabel: string; start: Date; end: Date }[] = [];
    ctxIds.forEach((cid) => {
      const inst = instances.find((i) => i.contextId === cid);
      definition?.stages.forEach((stage) => {
        const ev = events.find((e) => e.stageId === stage.id && e.contextId === cid);
        if (ev?.startAt && ev?.endAt) {
          result.push({
            stageId: stage.id,
            stageTitle: stage.title,
            contextId: cid,
            contextLabel: inst?.context.label ?? cid,
            start: parseISO(ev.startAt),
            end: parseISO(ev.endAt),
          });
        }
      });
    });
    return result;
  }, [definition, events, ctxIds, instances]);

  const totalDays = days.length;
  const dayWidth = 24;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <div className="min-w-max">
        {/* Header */}
        <div className="flex border-b bg-slate-50">
          <div className="w-48 shrink-0 p-2 text-xs font-bold border-r">Этап / Контекст</div>
          <div className="flex" style={{ width: totalDays * dayWidth }}>
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className="shrink-0 border-r text-center text-[10px] py-1"
                style={{ width: dayWidth }}
              >
                {format(d, 'd')}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {ctxIds.map((cid) => {
          const inst = instances.find((i) => i.contextId === cid);
          return (
            definition?.stages.map((stage) => {
              const bar = bars.find((b) => b.stageId === stage.id && b.contextId === cid);
              return (
                <div key={`${cid}-${stage.id}`} className="flex border-b hover:bg-slate-50/50">
                  <div className="w-48 shrink-0 p-2 text-xs border-r">
                    <span className="font-medium">{stage.title}</span>
                    <span className="text-slate-500 block text-[10px]">{inst?.context.label ?? cid}</span>
                  </div>
                  <div
                    className="relative h-8"
                    style={{ width: totalDays * dayWidth }}
                  >
                    {bar && (() => {
                      const startIdx = Math.max(0, Math.floor((bar.start.getTime() - monthStart.getTime()) / 86400000));
                      const endIdx = Math.min(totalDays - 1, Math.ceil((bar.end.getTime() - monthStart.getTime()) / 86400000));
                      const left = startIdx * dayWidth;
                      const width = Math.max(dayWidth, (endIdx - startIdx + 1) * dayWidth);
                      return (
                        <div
                          className="absolute top-1 h-6 rounded bg-indigo-500/80 text-white text-[10px] flex items-center px-1 truncate"
                          style={{ left, width, minWidth: 40 }}
                          title={`${format(bar.start, 'dd.MM')} — ${format(bar.end, 'dd.MM')}`}
                        >
                          {format(bar.start, 'dd.MM')}–{format(bar.end, 'dd.MM')}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            }) ?? null
          );
        })}
      </div>
    </div>
  );
}
