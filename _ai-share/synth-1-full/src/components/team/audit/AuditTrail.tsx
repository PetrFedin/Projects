'use client';

import React from 'react';
import { Activity, Clock, User, Building, Database, ArrowRight } from 'lucide-react';
import { activityLogs, organizations } from '../_fixtures/team-data';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PROCESS_FLOWS } from '@/lib/interaction-policy';

export function AuditTrail({ organizationId }: { organizationId?: string }) {
  const [selectedFlow, setSelectedFlow] = React.useState<string>('all');

  const filteredLogs = React.useMemo(() => {
    let logs = organizationId
      ? activityLogs.filter((log) => log.organizationId === organizationId)
      : activityLogs;

    if (selectedFlow !== 'all') {
      const flow = PROCESS_FLOWS.find((f) => f.id === selectedFlow);
      if (flow) {
        // Simple mapping: if organization's type is in participants of the flow
        logs = logs.filter((log) => {
          const org = organizations[log.organizationId];
          return org && flow.participants.includes(org.type);
        });
      }
    }
    return logs;
  }, [organizationId, selectedFlow]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-700';
      case 'update':
        return 'bg-blue-100 text-blue-700';
      case 'delete':
        return 'bg-rose-100 text-rose-700';
      case 'export':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-bg-surface2 text-text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-tight">Журнал действий</h2>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              Аудит всех транзакций и изменений
            </p>
          </div>
        </div>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFlow('all')}
          className={cn(
            'whitespace-nowrap rounded-xl border-2 px-4 py-2 text-[9px] font-black uppercase transition-all',
            selectedFlow === 'all'
              ? 'border-black bg-black text-white'
              : 'text-text-muted border-border-subtle hover:border-border-default bg-white'
          )}
        >
          Все процессы
        </button>
        {PROCESS_FLOWS.map((flow) => (
          <button
            key={flow.id}
            onClick={() => setSelectedFlow(flow.id)}
            className={cn(
              'whitespace-nowrap rounded-xl border-2 px-4 py-2 text-[9px] font-black uppercase transition-all',
              selectedFlow === flow.id
                ? 'bg-accent-primary border-accent-primary text-white shadow-md'
                : 'text-text-muted border-border-subtle hover:border-border-default bg-white'
            )}
          >
            {flow.name}
          </button>
        ))}
      </div>

      <div className="border-border-subtle overflow-hidden rounded-xl border bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-border-subtle bg-bg-surface2/80 border-b">
                <th className="text-text-muted px-6 py-4 text-[10px] font-black uppercase">
                  ВРЕМЯ
                </th>
                <th className="text-text-muted px-6 py-4 text-[10px] font-black uppercase">
                  ПОЛЬЗОВАТЕЛЬ
                </th>
                <th className="text-text-muted px-6 py-4 text-[10px] font-black uppercase">
                  ПРОФИЛЬ
                </th>
                <th className="text-text-muted px-6 py-4 text-[10px] font-black uppercase">
                  ДЕЙСТВИЕ
                </th>
                <th className="text-text-muted px-6 py-4 text-[10px] font-black uppercase">
                  ОПИСАНИЕ
                </th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-surface2/80 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-text-secondary flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] font-bold">
                        {format(new Date(log.timestamp), 'HH:mm:ss', { locale: ru })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-bg-surface2 flex h-6 w-6 items-center justify-center rounded-full">
                        <User className="text-text-muted h-3 w-3" />
                      </div>
                      <span className="text-text-primary text-xs font-bold">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building className="text-text-muted h-3 w-3" />
                      <span className="text-text-secondary text-[10px] font-black uppercase">
                        {organizations[log.organizationId]?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'rounded-lg px-2 py-1 text-[9px] font-black uppercase',
                        getActionColor(log.action)
                      )}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-text-secondary text-[11px] font-medium">
                        {log.description}
                      </span>
                      <button className="hover:border-border-default rounded-lg border border-transparent p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100">
                        <ArrowRight className="text-text-muted h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
