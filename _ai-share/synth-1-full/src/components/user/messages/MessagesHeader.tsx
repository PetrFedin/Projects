import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, ClipboardList, Settings, Search, Users, Shield, Calendar
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
  onOpenCreateChat
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-3 pb-4 border-b border-slate-100">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-base font-bold font-headline tracking-tighter text-slate-900 uppercase leading-none">Intelligence OS</h1>
          <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 font-bold text-[8px] uppercase tracking-[0.2em] px-1.5 h-4 shadow-sm">v2.0 AI-CORE</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 h-6.5 bg-indigo-50 border border-indigo-100 rounded-lg cursor-default group/engine shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest whitespace-nowrap">ENGINE: ACTIVE</span>
          </div>
          
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg h-6.5 px-1 shadow-inner">
            <select 
              className="bg-transparent px-1.5 text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            >
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <option key={role} value={role}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-1 px-2 h-6.5 bg-slate-900 rounded-lg shadow-md border border-slate-800">
            <Shield className="h-2.5 w-2.5 text-indigo-400" />
            <span className="text-[8px] font-bold text-white uppercase tracking-[0.2em]">SCOPED</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg h-6.5 px-2 group/status shrink-0 shadow-sm transition-all hover:border-indigo-200">
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", USER_STATUSES.find(s => s.id === userStatus)?.color || 'bg-slate-300')} />
            <select 
              className="bg-transparent text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
            >
              {USER_STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-3 px-3 h-6.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group/risk" onClick={onOpenTeam}>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">TEAM: 12</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-2" title="Supply Chain Risk Index" onClick={(e) => { e.stopPropagation(); onOpenRiskDetails(); }}>
              <AlertTriangle className={cn("h-3 w-3 transition-transform group-hover/risk:scale-110", riskLevel > 50 ? "text-rose-500" : "text-amber-500")} />
              <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div className={cn("h-full transition-all", riskLevel > 50 ? "bg-rose-500" : "bg-amber-500")} style={{ width: `${riskLevel}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900" asChild title="Календарь">
          <Link href="/brand/calendar">
            <Calendar className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900" onClick={onOpenTasksHub} title="Задачи из чатов">
          <ClipboardList className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900" onClick={onOpenSettings}>
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-900 text-white border border-slate-900 shadow-lg transition-all hover:bg-indigo-600 hover:border-indigo-600" onClick={onOpenCreateChat}>
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
