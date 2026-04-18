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
<<<<<<< HEAD
    <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 lg:flex-row">
      <div className="space-y-0.5">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
    <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-4 lg:flex-row">
      <div className="space-y-0.5">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
            Intelligence OS
          </h1>
          <Badge
            variant="outline"
<<<<<<< HEAD
            className="h-4 border-slate-100 bg-slate-50 px-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm"
=======
            className="bg-bg-surface2 text-text-muted border-border-subtle h-4 px-1.5 text-[8px] font-bold uppercase tracking-[0.2em] shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
          >
            v2.0 AI-CORE
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
<<<<<<< HEAD
          <div className="h-6.5 group/engine flex shrink-0 cursor-default items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2">
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-indigo-500" />
            <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-widest text-indigo-600">
=======
          <div className="h-6.5 bg-accent-primary/10 border-accent-primary/20 group/engine flex shrink-0 cursor-default items-center gap-1.5 rounded-lg border px-2">
            <div className="bg-accent-primary h-1.5 w-1.5 shrink-0 animate-pulse rounded-full" />
            <span className="text-accent-primary whitespace-nowrap text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              ENGINE: ACTIVE
            </span>
          </div>

<<<<<<< HEAD
          <div className="h-6.5 flex items-center rounded-lg border border-slate-200 bg-slate-100 px-1 shadow-inner">
            <select
              className="cursor-pointer bg-transparent px-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 outline-none transition-colors hover:text-indigo-600"
=======
          <div className="bg-bg-surface2 border-border-default h-6.5 flex items-center rounded-lg border px-1 shadow-inner">
            <select
              className="text-text-secondary hover:text-accent-primary cursor-pointer bg-transparent px-1.5 text-[9px] font-bold uppercase tracking-widest outline-none transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
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

<<<<<<< HEAD
          <div className="h-6.5 flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 shadow-md">
            <Shield className="h-2.5 w-2.5 text-indigo-400" />
=======
          <div className="h-6.5 bg-text-primary border-text-primary/30 flex items-center gap-1 rounded-lg border px-2 shadow-md">
            <Shield className="text-accent-primary h-2.5 w-2.5" />
>>>>>>> recover/cabinet-wip-from-stash
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">
              SCOPED
            </span>
          </div>

<<<<<<< HEAD
          <div className="h-6.5 group/status flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 shadow-sm transition-all hover:border-indigo-200">
            <div
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                USER_STATUSES.find((s) => s.id === userStatus)?.color || 'bg-slate-300'
              )}
            />
            <select
              className="cursor-pointer bg-transparent text-[9px] font-bold uppercase tracking-widest text-slate-500 outline-none transition-colors hover:text-indigo-600"
=======
          <div className="border-border-default h-6.5 group/status hover:border-accent-primary/30 flex shrink-0 items-center gap-1.5 rounded-lg border bg-white px-2 shadow-sm transition-all">
            <div
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                USER_STATUSES.find((s) => s.id === userStatus)?.color || 'bg-border-default'
              )}
            />
            <select
              className="text-text-secondary hover:text-accent-primary cursor-pointer bg-transparent text-[9px] font-bold uppercase tracking-widest outline-none transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            className="h-6.5 group/risk hidden cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 transition-all hover:border-indigo-200 hover:bg-white sm:flex"
=======
            className="h-6.5 bg-bg-surface2 border-border-default hover:border-accent-primary/30 group/risk hidden cursor-pointer items-center gap-3 rounded-lg border px-3 transition-all hover:bg-white sm:flex"
>>>>>>> recover/cabinet-wip-from-stash
            onClick={onOpenTeam}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
<<<<<<< HEAD
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-colors group-hover:text-indigo-600">
                TEAM: 12
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
=======
              <span className="text-text-muted group-hover:text-accent-primary text-[9px] font-bold uppercase tracking-widest transition-colors">
                TEAM: 12
              </span>
            </div>
            <div className="bg-border-subtle h-3 w-px" />
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-200 shadow-inner">
=======
              <div className="bg-border-subtle h-1 w-12 overflow-hidden rounded-full shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
          asChild
          title="Календарь"
        >
          <Link href="/brand/calendar">
=======
          className="border-border-default hover:bg-text-primary/90 hover:border-text-primary h-8 w-8 rounded-lg border bg-white shadow-sm transition-all hover:text-white"
          asChild
          title="Календарь"
        >
          <Link href={ROUTES.brand.calendar}>
>>>>>>> recover/cabinet-wip-from-stash
            <Calendar className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
<<<<<<< HEAD
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
=======
          className="border-border-default hover:bg-text-primary/90 hover:border-text-primary h-8 w-8 rounded-lg border bg-white shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
          onClick={onOpenTasksHub}
          title="Задачи из чатов"
        >
          <ClipboardList className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
<<<<<<< HEAD
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
=======
          className="border-border-default hover:bg-text-primary/90 hover:border-text-primary h-8 w-8 rounded-lg border bg-white shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
          onClick={onOpenSettings}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
<<<<<<< HEAD
          className="h-8 w-8 rounded-lg border border-slate-900 bg-slate-900 text-white shadow-lg transition-all hover:border-indigo-600 hover:bg-indigo-600"
=======
          className="bg-text-primary border-text-primary hover:bg-accent-primary hover:border-accent-primary h-8 w-8 rounded-lg border text-white shadow-lg transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          onClick={onOpenCreateChat}
        >
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
