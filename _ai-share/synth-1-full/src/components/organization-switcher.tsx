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
  DropdownMenuTrigger 
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
        partnerName: org?.name
      });
      toast({
        title: "Организация переключена",
        description: `Вы вошли в кабинет ${org?.name}`
      });
    } catch (err) {
      toast({ title: "Ошибка переключения", variant: 'destructive' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-3 transition-all group"
        >
          <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <Layers className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Активный профиль</p>
            <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter truncate max-w-[120px]">
              {activeOrg?.name || 'Выберите профиль'}
            </p>
          </div>
          <ChevronDown className="h-3 w-3 text-slate-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-xl p-2 border-none shadow-2xl bg-white" align="start">
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ваши команды</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50" />
        <div className="space-y-1 mt-1">
          {user.organizations.map((tenant) => {
            const org = organizations[tenant.organizationId];
            const isActive = user.activeOrganizationId === tenant.organizationId;
            
            return (
              <DropdownMenuItem 
                key={tenant.organizationId}
                onClick={() => handleSwitchOrg(tenant.organizationId)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 border outline-none",
                  isActive 
                    ? "bg-slate-900 text-white border-slate-800 shadow-xl" 
                    : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[10px] uppercase italic",
                    isActive ? "bg-white text-black" : "bg-slate-100 text-slate-400"
                  )}>
                    {org?.name?.[0] || 'O'}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[11px] font-black uppercase tracking-tight truncate">
                      {org?.name || tenant.organizationId}
                    </span>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest",
                      isActive ? "text-white/40" : "text-slate-400"
                    )}>
                      {org?.type === 'brand' ? 'Brand Entity' : 'Partner Node'}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white stroke-[3]" />
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
