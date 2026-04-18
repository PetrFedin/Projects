'use client';

import React from 'react';
import {
  Users,
  UserPlus,
  Archive,
  Layers,
  DollarSign,
  Search,
  X,
  Building2,
  Store,
  Factory,
  Truck,
  Globe,
  ShieldCheck,
  Activity,
  BarChart3,
  Fingerprint,
  Network,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTeamManagement } from './hooks/useTeamManagement';
import { TeamTable } from './_components/TeamTable';
import { TeamStructure } from './structure/TeamStructure';
import { FinancialHub } from '../brand/finance/FinancialHub';
import { AuditTrail } from './audit/AuditTrail';
import { OrgAnalytics } from './analytics/OrgAnalytics';
import { InviteOnboarding } from './onboarding/InviteOnboarding';
import { InteractionMatrix } from './interaction/InteractionMatrix';
import TeamNewsfeed from './TeamNewsfeed';
import EditMemberDialog from './EditMemberDialog';
import { organizations } from './_fixtures/team-data';

export function TeamManagement() {
  const state = useTeamManagement();

  return (
    <TooltipProvider>
      <div className="space-y-6 duration-700 animate-in fade-in">
<<<<<<< HEAD
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="absolute right-0 top-0 rotate-12 p-4 text-indigo-600 opacity-5">
=======
        <div className="border-border-subtle relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-accent-primary absolute right-0 top-0 rotate-12 p-4 opacity-5">
>>>>>>> recover/cabinet-wip-from-stash
            <Globe className="h-32 w-32" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                {state.isProjectAdmin ? (
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                ) : (
                  <Building2 className="h-5 w-5 text-indigo-600" />
=======
              <div className="bg-accent-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                {state.isProjectAdmin ? (
                  <ShieldCheck className="text-accent-primary h-5 w-5" />
                ) : (
                  <Building2 className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                )}
              </div>
              <div>
                <h3 className="text-text-muted text-[9px] font-black uppercase tracking-[0.2em]">
                  {state.isProjectAdmin ? 'Режим Глобального Управления' : 'Выбранный Профиль'}
                </h3>
                <p className="text-text-primary text-base font-black uppercase">
                  {organizations[state.activeOrgId]?.name || 'Unknown Profile'}
                </p>
              </div>
            </div>

            <div className="scrollbar-hide flex max-w-2xl gap-2 overflow-x-auto pb-2">
              {Object.values(organizations).map((org) => {
                if (!state.isProjectAdmin && !state.allPartnerTeams[org.id]) return null;

                const Icon =
                  org.type === 'admin'
                    ? Building2
                    : org.type === 'brand'
                      ? Store
                      : org.type === 'manufacturer'
                        ? Factory
                        : Truck;

                const isActive = state.activeOrgId === org.id;

                return (
                  <Button
                    key={org.id}
                    onClick={() => state.setActiveOrgId(org.id)}
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'h-9 gap-2 whitespace-nowrap rounded-xl text-[8px] font-black uppercase transition-all',
                      isActive
<<<<<<< HEAD
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'border border-slate-100 bg-white text-slate-400 hover:bg-slate-50'
=======
                        ? 'bg-accent-primary shadow-accent-primary/10 text-white shadow-lg'
                        : 'text-text-muted border-border-subtle hover:bg-bg-surface2 border bg-white'
>>>>>>> recover/cabinet-wip-from-stash
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

        <header className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
=======
            <div className="bg-text-primary flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <div className="h-1 w-6 rounded-full bg-indigo-600" />
                <h1 className="text-base font-black uppercase tracking-tight text-slate-900">
                  Команда
                </h1>
              </div>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                <div className="bg-accent-primary h-1 w-6 rounded-full" />
                <h1 className="text-text-primary text-base font-black uppercase tracking-tight">
                  Команда
                </h1>
              </div>
              <p className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Staff Control Center
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
=======
          <div className="border-border-subtle scrollbar-hide flex items-center gap-1.5 overflow-x-auto rounded-2xl border bg-white p-1 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            {[
              { id: 'active', label: 'Штат', icon: <Users className="h-3 w-3" /> },
              { id: 'structure', label: 'Структура', icon: <Layers className="h-3 w-3" /> },
              { id: 'analytics', label: 'Аналитика', icon: <BarChart3 className="h-3 w-3" /> },
              { id: 'audit', label: 'Аудит', icon: <Fingerprint className="h-3 w-3" /> },
              state.isProjectAdmin && {
                id: 'matrix',
                label: 'Матрица',
                icon: <Network className="h-3 w-3" />,
              },
              { id: 'finance', label: 'Экономика', icon: <DollarSign className="h-3 w-3" /> },
              { id: 'onboarding', label: 'Рост', icon: <UserPlus className="h-3 w-3" /> },
              { id: 'archive', label: 'Архив', icon: <Archive className="h-3 w-3" /> },
            ]
              .filter(Boolean)
              .map((tab) => (
                <button
                  key={(tab as any).id}
                  onClick={() => state.setActiveTab((tab as any).id as any)}
                  className={cn(
                    'flex h-9 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-[9px] font-black uppercase transition-all',
                    state.activeTab === (tab as any).id
<<<<<<< HEAD
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
=======
                      ? 'bg-text-primary text-white shadow-md'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
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
          {state.activeTab === 'audit' && (
            <AuditTrail organizationId={state.isProjectAdmin ? undefined : state.activeOrgId} />
          )}
          {state.activeTab === 'analytics' && (
            <OrgAnalytics organizationId={state.isProjectAdmin ? undefined : state.activeOrgId} />
          )}
          {state.activeTab === 'onboarding' && <InviteOnboarding />}
          {state.activeTab === 'matrix' && state.isProjectAdmin && <InteractionMatrix />}

          {(state.activeTab === 'active' || state.activeTab === 'archive') && (
            <div className="space-y-6 duration-500 animate-in fade-in">
<<<<<<< HEAD
              <TeamNewsfeed team={state.team} />
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="relative flex flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
=======
              <TeamNewsfeed
                team={state.team}
                onOpenMatrixSummary={() => state.setActiveTab('matrix')}
              />
              <div className="border-border-subtle flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
                <div className="relative flex flex-1 items-center gap-3">
                  <div className="bg-bg-surface2 text-text-muted flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder="ПОИСК ПО ВСЕМ ПРОФИЛЯМ..."
                    value={state.searchQuery}
                    onChange={(e) => state.setSearchQuery(e.target.value)}
<<<<<<< HEAD
                    className="border-none pl-0 text-sm font-black uppercase shadow-none placeholder:text-slate-300 focus-visible:ring-0"
=======
                    className="placeholder:text-text-muted border-none pl-0 text-sm font-black uppercase shadow-none focus-visible:ring-0"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
                <Button
                  onClick={() => state.setActiveTab('onboarding')}
<<<<<<< HEAD
                  className="button-glimmer h-11 rounded-xl bg-indigo-600 px-6 text-[9px] font-black uppercase text-white shadow-lg shadow-indigo-100"
=======
                  className="button-glimmer bg-accent-primary shadow-accent-primary/10 h-11 rounded-xl px-6 text-[9px] font-black uppercase text-white shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Добавить участника
                </Button>
              </div>

<<<<<<< HEAD
              <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
=======
              <Card className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                <CardContent className="p-0">
                  <TeamTable
                    members={state.filteredTeam}
                    onEdit={state.setEditingMember}
                    onArchive={state.handleArchive}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {state.editingMember && (
          <EditMemberDialog
            member={state.editingMember}
            open={!!state.editingMember}
            onOpenChange={(open) => !open && state.setEditingMember(null)}
            onSave={state.handleUpdateMember}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
