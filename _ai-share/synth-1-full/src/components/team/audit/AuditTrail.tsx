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
        return 'bg-slate-100 text-slate-700';
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
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
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
            )}
          >
            {flow.name}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">ВРЕМЯ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  ПОЛЬЗОВАТЕЛЬ
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  ПРОФИЛЬ
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  ДЕЙСТВИЕ
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  ОПИСАНИЕ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] font-bold">
                        {format(new Date(log.timestamp), 'HH:mm:ss', { locale: ru })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-3 w-3 text-slate-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black uppercase text-slate-500">
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
                      <span className="text-[11px] font-medium text-slate-600">
                        {log.description}
                      </span>
                      <button className="rounded-lg border border-transparent p-1.5 opacity-0 transition-opacity hover:border-slate-200 hover:bg-white group-hover:opacity-100">
                        <ArrowRight className="h-3 w-3 text-slate-400" />
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
