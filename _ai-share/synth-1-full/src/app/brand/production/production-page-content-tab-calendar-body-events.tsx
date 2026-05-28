'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProductionPageContentTabCalendarBodyEvents({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { setActiveTab, filteredEvents } = px;

  return (
    <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-tight">
          События и дедлайны
        </CardTitle>
        <CardDescription className="text-text-secondary text-[10px]">
          Календарь с блоками действий
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(filteredEvents || []).length === 0 ? (
            <p className="text-text-muted py-8 text-center text-[10px]">
              Нет запланированных событий. Выберите коллекцию для фильтрации.
            </p>
          ) : (
            (filteredEvents || []).slice(0, 15).map((ev: any) => {
              const dateStr = ev.date
                ? typeof ev.date === 'string' && ev.date.length >= 10
                  ? ev.date.slice(0, 10)
                  : ev.date
                : ev.time || '—';
              const typeLabel =
                ev.type === 'logistics'
                  ? 'Логистика'
                  : ev.type === 'milestone'
                    ? 'Этап'
                    : ev.type === 'finance'
                      ? 'Финансы'
                      : ev.type || 'Событие';
              return (
                <div
                  key={ev.id}
                  className="border-border-subtle bg-bg-surface2/80 hover:border-accent-primary/20 flex flex-col gap-3 rounded-xl border p-4 transition-all hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-text-primary block text-[11px] font-bold">
                      {ev.title}
                    </span>
                    {ev.description && (
                      <span className="text-text-secondary mt-0.5 block text-[10px]">
                        {ev.description}
                      </span>
                    )}
                    {ev.responsible && (
                      <span className="text-text-muted mt-1 block text-[9px]">
                        Ответственный: {ev.responsible}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-border-default text-text-secondary text-[8px] font-bold uppercase"
                    >
                      {typeLabel}
                    </Badge>
                    <span className="text-text-secondary text-[10px] font-medium tabular-nums">
                      {dateStr}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[9px]"
                      onClick={() =>
                        setActiveTab?.(
                          ev.type === 'logistics'
                            ? 'logistics'
                            : ev.type === 'finance'
                              ? 'finance'
                              : 'samples'
                        )
                      }
                    >
                      Действие
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
