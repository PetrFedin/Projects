'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { organizations } from '@/components/team/_fixtures/team-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Layers, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function OrganizationSwitcher() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  if (!user || !user.organizations || user.organizations.length <= 1) return null;

  const activeOrg = user.activeOrganizationId ? organizations[user.activeOrganizationId] : null;

  const handleSwitchOrg = async (orgId: string) => {
    try {
      const org = organizations[orgId];
      await updateProfile({
        activeOrganizationId: orgId,
        partnerName: org?.name,
      });
      toast({
        title: 'Организация переключена',
        description: `Вы вошли в кабинет ${org?.name}`,
      });
    } catch (err) {
      toast({ title: 'Ошибка переключения', variant: 'destructive' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
<<<<<<< HEAD
          className="group flex h-10 items-center gap-3 rounded-xl border-slate-200 bg-white px-4 transition-all hover:bg-slate-50"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110">
            <Layers className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <p className="mb-1 text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
              Активный профиль
            </p>
            <p className="max-w-[120px] truncate text-[11px] font-black uppercase leading-none tracking-tighter text-slate-900">
=======
          className="border-border-subtle bg-bg-surface hover:bg-bg-surface2 group flex h-10 items-center gap-3 rounded-xl px-4 transition-all"
        >
          <div className="bg-accent-primary shadow-accent-primary/25 flex h-6 w-6 items-center justify-center rounded-lg shadow-lg transition-transform group-hover:scale-110">
            <Layers className="text-text-inverse h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-text-muted mb-1 text-[8px] font-black uppercase leading-none tracking-widest">
              Активный профиль
            </p>
            <p className="text-text-primary max-w-[120px] truncate text-[11px] font-black uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              {activeOrg?.name || 'Выберите профиль'}
            </p>
          </div>
          <ChevronDown className="text-text-muted h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
<<<<<<< HEAD
        className="w-64 rounded-xl border-none bg-white p-2 shadow-2xl"
=======
        className="border-border-subtle bg-bg-surface w-64 rounded-xl border p-2 shadow-2xl"
>>>>>>> recover/cabinet-wip-from-stash
        align="start"
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="text-accent-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ваши команды</span>
          </div>
        </DropdownMenuLabel>
<<<<<<< HEAD
        <DropdownMenuSeparator className="bg-slate-50" />
=======
        <DropdownMenuSeparator className="bg-border-subtle" />
>>>>>>> recover/cabinet-wip-from-stash
        <div className="mt-1 space-y-1">
          {user.organizations.map((tenant) => {
            const org = organizations[tenant.organizationId];
            const isActive = user.activeOrganizationId === tenant.organizationId;

            return (
              <DropdownMenuItem
                key={tenant.organizationId}
                onClick={() => handleSwitchOrg(tenant.organizationId)}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-2xl border p-3 outline-none transition-all duration-300',
                  isActive
<<<<<<< HEAD
                    ? 'border-slate-800 bg-slate-900 text-white shadow-xl'
                    : 'border-transparent bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
=======
                    ? 'border-border-subtle bg-text-primary text-text-inverse shadow-xl'
                    : 'bg-bg-surface text-text-secondary hover:bg-bg-surface2 hover:text-text-primary border-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[10px] font-black uppercase italic',
<<<<<<< HEAD
                      isActive ? 'bg-white text-black' : 'bg-slate-100 text-slate-400'
=======
                      isActive
                        ? 'bg-bg-surface text-text-primary'
                        : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {org?.name?.[0] || 'O'}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-[11px] font-black uppercase tracking-tight">
                      {org?.name || tenant.organizationId}
                    </span>
                    <span
                      className={cn(
                        'text-[8px] font-bold uppercase tracking-widest',
<<<<<<< HEAD
                        isActive ? 'text-white/40' : 'text-slate-400'
=======
                        isActive ? 'text-text-inverse/50' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {org?.type === 'brand' ? 'Brand Entity' : 'Partner Node'}
                    </span>
                  </div>
                </div>
                {isActive && (
<<<<<<< HEAD
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                    <Check className="h-3 w-3 stroke-[3] text-white" />
=======
                  <div className="bg-accent-primary flex h-5 w-5 items-center justify-center rounded-full">
                    <Check className="text-text-inverse h-3 w-3 stroke-[3]" />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
