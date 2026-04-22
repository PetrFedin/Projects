import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { ROLE_LABELS } from './constants';
import { ROUTES } from '@/lib/routes';

interface MessagesHeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userStatus: string;
  setUserStatus: (status: string) => void;
  riskLevel: number;
  onOpenTeam: () => void;
  onOpenRiskDetails: () => void;
  onOpenTasksHub: () => void;
  onOpenSettings: () => void;
  onOpenCreateChat: () => void;
  variant?: 'default' | 'communicationHub';
  hubTab?: 'messages' | 'tasks';
  onHubTabChange?: (tab: 'messages' | 'tasks') => void;
}

export const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  currentRole,
  setCurrentRole,
  onOpenTasksHub,
  onOpenCreateChat,
  variant = 'default',
  hubTab = 'messages',
  onHubTabChange,
}) => {
  if (variant === 'communicationHub') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 shrink-0">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
          <button
            type="button"
            onClick={() => onHubTabChange?.('messages')}
            className={cn(
              'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors',
              hubTab === 'messages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <MessageSquare className="h-3 w-3" />
            Чаты
          </button>
          <button
            type="button"
            onClick={() => {
              onHubTabChange?.('tasks');
              onOpenTasksHub();
            }}
            className={cn(
              'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors',
              hubTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <ClipboardList className="h-3 w-3" />
            Задачи
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <select
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-700 outline-none"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            aria-label="Роль"
          >
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <option key={role} value={role}>
                {label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" className="h-8 gap-1 px-2 text-xs" asChild>
            <Link href={ROUTES.brand.calendar}>
              <Calendar className="h-3.5 w-3.5" />
              Календарь
            </Link>
          </Button>
          <Button size="sm" className="h-8 gap-1 px-2.5 text-xs" onClick={onOpenCreateChat}>
            <Plus className="h-3.5 w-3.5" />
            Чат
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-3 pb-4 border-b border-slate-100">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-base font-bold font-headline tracking-tighter text-slate-900 uppercase leading-none">Intelligence OS</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg h-6.5 px-1 shadow-inner">
            <select
              className="bg-transparent px-1.5 text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            >
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <option key={role} value={role}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900" asChild title="Календарь">
          <Link href={ROUTES.brand.calendar}>
            <Calendar className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900" onClick={onOpenTasksHub} title="Задачи из чатов">
          <ClipboardList className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-900 text-white border border-slate-900 shadow-lg transition-all hover:bg-indigo-600 hover:border-indigo-600" onClick={onOpenCreateChat}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
