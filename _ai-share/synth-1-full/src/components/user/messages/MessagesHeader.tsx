import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ClipboardList,
  Settings,
  Search,
  Users,
  Shield,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { ROLE_LABELS, USER_STATUSES } from './constants';

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
}

export const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  currentRole,
  setCurrentRole,
  userStatus,
  setUserStatus,
  riskLevel,
  onOpenTeam,
  onOpenRiskDetails,
  onOpenTasksHub,
  onOpenSettings,
  onOpenCreateChat,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 lg:flex-row">
      <div className="space-y-0.5">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
            Intelligence OS
          </h1>
          <Badge
            variant="outline"
            className="h-4 border-slate-100 bg-slate-50 px-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm"
          >
            v2.0 AI-CORE
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6.5 group/engine flex shrink-0 cursor-default items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2">
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-indigo-500" />
            <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest text-indigo-600">
              ENGINE: ACTIVE
            </span>
          </div>

          <div className="h-6.5 flex items-center rounded-lg border border-slate-200 bg-slate-100 px-1 shadow-inner">
            <select
              className="cursor-pointer bg-transparent px-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 outline-none transition-colors hover:text-indigo-600"
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

          <div className="h-6.5 flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 shadow-md">
            <Shield className="h-2.5 w-2.5 text-indigo-400" />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">
              SCOPED
            </span>
          </div>

          <div className="h-6.5 group/status flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 shadow-sm transition-all hover:border-indigo-200">
            <div
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                USER_STATUSES.find((s) => s.id === userStatus)?.color || 'bg-slate-300'
              )}
            />
            <select
              className="cursor-pointer bg-transparent text-[9px] font-bold uppercase tracking-widest text-slate-500 outline-none transition-colors hover:text-indigo-600"
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
            >
              {USER_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="h-6.5 group/risk hidden cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition-all hover:border-indigo-200 hover:bg-white sm:flex"
            onClick={onOpenTeam}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-colors group-hover:text-indigo-600">
                TEAM: 12
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div
              className="flex items-center gap-2"
              title="Supply Chain Risk Index"
              onClick={(e) => {
                e.stopPropagation();
                onOpenRiskDetails();
              }}
            >
              <AlertTriangle
                className={cn(
                  'h-3 w-3 transition-transform group-hover/risk:scale-110',
                  riskLevel > 50 ? 'text-rose-500' : 'text-amber-500'
                )}
              />
              <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-200 shadow-inner">
                <div
                  className={cn(
                    'h-full transition-all',
                    riskLevel > 50 ? 'bg-rose-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${riskLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          asChild
          title="Календарь"
        >
          <Link href="/brand/calendar">
            <Calendar className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          onClick={onOpenTasksHub}
          title="Задачи из чатов"
        >
          <ClipboardList className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          onClick={onOpenSettings}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg border border-slate-900 bg-slate-900 text-white shadow-lg transition-all hover:border-indigo-600 hover:bg-indigo-600"
          onClick={onOpenCreateChat}
        >
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
