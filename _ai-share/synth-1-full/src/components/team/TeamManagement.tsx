'use client';

import React from 'react';
import { Users, UserPlus, Archive, Layers, DollarSign, Search, X, Building2, Store, Factory, Truck, Globe, ShieldCheck, Activity, BarChart3, Fingerprint, Network } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTeamManagement } from './hooks/useTeamManagement';
import { TeamTable } from './_components/TeamTable';
import { TeamStructure } from './structure/TeamStructure';
import { FinancialHub } from '../brand/finance/FinancialHub';
import { AuditTrail } from './audit/AuditTrail';
import { OrgAnalytics } from './analytics/OrgAnalytics';
import { InviteOnboarding } from './onboarding/InviteOnboarding';
import { InteractionMatrix } from './interaction/InteractionMatrix';
import TeamNewsfeed from "./TeamNewsfeed";
import EditMemberDialog from "./EditMemberDialog";
import { organizations } from './_fixtures/team-data';

export function TeamManagement() {
  const state = useTeamManagement();

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 text-indigo-600"><Globe className="h-32 w-32" /></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                {state.isProjectAdmin ? <ShieldCheck className="h-5 w-5 text-indigo-600" /> : <Building2 className="h-5 w-5 text-indigo-600" />}
              </div>
              <div>
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {state.isProjectAdmin ? 'Режим Глобального Управления' : 'Выбранный Профиль'}
                </h3>
                <p className="text-base font-black uppercase text-slate-900">
                  {organizations[state.activeOrgId]?.name || 'Unknown Profile'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 max-w-2xl scrollbar-hide">
              {Object.values(organizations).map(org => {
                if (!state.isProjectAdmin && !state.allPartnerTeams[org.id]) return null;
                
                const Icon = org.type === 'admin' ? Building2 : 
                            org.type === 'brand' ? Store :
                            org.type === 'manufacturer' ? Factory : Truck;

                const isActive = state.activeOrgId === org.id;

                return (
                  <Button 
                    key={org.id} 
                    onClick={() => state.setActiveOrgId(org.id)} 
                    variant={isActive ? 'default' : 'ghost'} 
                    className={cn(
                      "h-9 rounded-xl font-black uppercase text-[8px] gap-2 whitespace-nowrap transition-all",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "text-slate-400 border border-slate-100 bg-white hover:bg-slate-50"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {org.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg"><Users className="h-6 w-6 text-white" /></div>
            <div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                <h1 className="text-base font-black uppercase tracking-tight text-slate-900">Команда</h1>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Staff Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
            {[
              { id: 'active', label: 'Штат', icon: <Users className="h-3 w-3" /> },
              { id: 'structure', label: 'Структура', icon: <Layers className="h-3 w-3" /> },
              { id: 'analytics', label: 'Аналитика', icon: <BarChart3 className="h-3 w-3" /> },
              { id: 'audit', label: 'Аудит', icon: <Fingerprint className="h-3 w-3" /> },
              state.isProjectAdmin && { id: 'matrix', label: 'Матрица', icon: <Network className="h-3 w-3" /> },
              { id: 'finance', label: 'Экономика', icon: <DollarSign className="h-3 w-3" /> },
              { id: 'onboarding', label: 'Рост', icon: <UserPlus className="h-3 w-3" /> },
              { id: 'archive', label: 'Архив', icon: <Archive className="h-3 w-3" /> }
            ].filter(Boolean).map(tab => (
              <button 
                key={(tab as any).id}
                onClick={() => state.setActiveTab((tab as any).id as any)} 
                className={cn(
                  "px-4 h-9 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap", 
                  state.activeTab === (tab as any).id 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {(tab as any).icon}
                {(tab as any).label}
              </button>
            ))}
          </div>
        </header>

        <main className="min-h-[500px]">
          {state.activeTab === 'structure' && <TeamStructure />}
          {state.activeTab === 'finance' && <FinancialHub />}
          {state.activeTab === 'audit' && <AuditTrail organizationId={state.isProjectAdmin ? undefined : state.activeOrgId} />}
          {state.activeTab === 'analytics' && <OrgAnalytics organizationId={state.isProjectAdmin ? undefined : state.activeOrgId} />}
          {state.activeTab === 'onboarding' && <InviteOnboarding />}
          {state.activeTab === 'matrix' && state.isProjectAdmin && <InteractionMatrix />}
          
          {(state.activeTab === 'active' || state.activeTab === 'archive') && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <TeamNewsfeed team={state.team} />
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative flex-1 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input placeholder="ПОИСК ПО ВСЕМ ПРОФИЛЯМ..." value={state.searchQuery} onChange={(e) => state.setSearchQuery(e.target.value)} className="pl-0 border-none shadow-none focus-visible:ring-0 text-sm font-black uppercase placeholder:text-slate-300" />
                </div>
                <Button onClick={() => state.setActiveTab('onboarding')} className="button-glimmer bg-indigo-600 text-white rounded-xl uppercase text-[9px] font-black h-11 px-6 shadow-lg shadow-indigo-100">
                  <UserPlus className="mr-2 h-4 w-4" /> Добавить участника
                </Button>
              </div>

              <Card className="border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <TeamTable members={state.filteredTeam} onEdit={state.setEditingMember} onArchive={state.handleArchive} />
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {state.editingMember && (
          <EditMemberDialog member={state.editingMember} open={!!state.editingMember} onOpenChange={(open) => !open && state.setEditingMember(null)} onSave={state.handleUpdateMember} />
        )}
      </div>
    </TooltipProvider>
  );
}
