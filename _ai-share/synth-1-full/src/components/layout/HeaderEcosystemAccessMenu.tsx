'use client';

import {
  Shield,
  Store,
  Factory,
  Briefcase,
  Warehouse,
  ShoppingCart,
  User,
  Sparkles,
  ChevronRight,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { organizations, partnerTeams } from '@/components/team/_fixtures/team-data';
import { useAuth } from '@/providers/auth-provider';
import { useIdentitySwitch } from '@/hooks/use-identity-switch';
import { cn } from '@/lib/utils';

/** «Пульт управления доступом» — грузится только при открытии dropdown в header. */
export function HeaderEcosystemAccessMenu() {
  const { user } = useAuth();
  const { handleIdentitySwitch } = useIdentitySwitch();

  const handleLogin = async (email: string, roleKey: string, organizationId?: string) => {
    await handleIdentitySwitch(email, roleKey, organizationId);
  };

  return (
    <>
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div className="mb-0.5 flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span className="text-[8px] font-black uppercase leading-none tracking-[0.2em] text-white/40">
            Syntha Ecosystem Access
          </span>
        </div>
        <h3 className="text-[11px] font-black uppercase leading-none tracking-tight text-white">
          Пульт управления доступом
        </h3>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 p-2">
          {[
            { id: 'admin', label: 'Управление Syntha HQ', icon: Shield, type: 'admin' },
            { id: 'brand', label: 'Бренды & Дизайнеры', icon: Store, type: 'brand' },
            {
              id: 'manufacturer',
              label: 'Производство & Цеха',
              icon: Factory,
              type: 'manufacturer',
            },
            {
              id: 'distributor',
              label: 'Логистика & Хабы',
              icon: Briefcase,
              type: 'distributor',
            },
            {
              id: 'supplier',
              label: 'Поставщики сырья',
              icon: Warehouse,
              type: 'supplier',
            },
            { id: 'shop', label: 'Ритейл-партнеры', icon: ShoppingCart, type: 'shop' },
            { id: 'client', label: 'Частные клиенты (B2C)', icon: User, type: 'client' },
          ].map((role) => (
            <div key={role.id} className="space-y-0.5 border-b border-slate-50 pb-2 last:border-0">
              <div className="flex items-center gap-2 rounded-[2px] bg-slate-50/50 px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
                <role.icon className="h-2.5 w-2.5" />
                {role.label}
              </div>

              {role.id === 'client' ? (
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleLogin('elena.petrova@example.com', 'client');
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
                >
                  <Avatar className="h-7 w-7 rounded-[2px]">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
                    <AvatarFallback className="rounded-[2px] text-[10px]">ЕП</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[10px] font-black leading-tight text-slate-900">
                      Елена Петрова
                    </span>
                    <span className="truncate text-[8px] font-bold uppercase tracking-tighter text-slate-400">
                      Premium B2C Profile
                    </span>
                  </div>
                  {user?.email === 'elena.petrova@example.com' && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  )}
                </DropdownMenuItem>
              ) : role.id === 'admin' ? (
                partnerTeams['org-hq-001']?.map((member: any) => (
                  <DropdownMenuItem
                    key={member.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleLogin(member.email, 'admin', 'org-hq-001');
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
                  >
                    <Avatar className="h-7 w-7 rounded-[2px]">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="rounded-[2px] text-[10px]">
                        {member.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[10px] font-black leading-tight text-slate-900">
                        {member.firstName} {member.lastName}
                      </span>
                      <span className="truncate text-[8px] font-bold uppercase tracking-tighter text-slate-400">
                        {member.role}
                      </span>
                    </div>
                    {user?.email === member.email && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                Object.values(organizations)
                  .filter((org) => org.type === role.type)
                  .map((org) => (
                    <Collapsible key={org.id} className="group/collapsible">
                      <div className="group flex w-full items-center justify-between rounded-[2px] transition-all hover:bg-slate-50">
                        <CollapsibleTrigger asChild>
                          <div className="flex flex-1 cursor-pointer items-center gap-2.5 overflow-hidden p-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-slate-200 bg-slate-100 text-[9px] font-black uppercase text-slate-400 transition-all group-hover:bg-white group-hover:text-indigo-600">
                              {org.name[0]}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-[10px] font-black uppercase leading-tight tracking-tight text-slate-900">
                                  {org.name}
                                </span>
                                <ChevronRight className="h-2 w-2 text-slate-300 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                              </div>
                              <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                {partnerTeams[org.id]?.length || 1} USERS
                              </span>
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        {user?.organizations?.some((o) => o.organizationId === org.id) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1 h-6 w-6 rounded-[2px] text-slate-300 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogin(user!.email, role.id, org.id);
                            }}
                            title="Войти как организация"
                          >
                            <RefreshCw
                              className={cn(
                                'h-3 w-3',
                                user?.activeOrganizationId === org.id &&
                                  'animate-spin-slow text-indigo-600'
                              )}
                            />
                          </Button>
                        )}
                      </div>
                      <CollapsibleContent className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-100 pb-1 pl-9 pr-1">
                        {(
                          partnerTeams[org.id] || [
                            {
                              email: org.ownerId + '@syntha.ai',
                              firstName: org.name.split(' ')[0],
                              lastName: '',
                              avatar: org.logo,
                              role: 'Owner',
                              id: org.ownerId,
                            },
                          ]
                        ).map((member: any) => (
                          <DropdownMenuItem
                            key={member.id || member.email}
                            onSelect={(e) => {
                              e.preventDefault();
                              handleLogin(member.email, role.id, org.id);
                            }}
                            className="group/member flex cursor-pointer items-center gap-2 rounded-[2px] p-1.5 outline-none transition-all hover:bg-indigo-50"
                          >
                            <Avatar className="h-5 w-5 rounded-[2px] border border-white shadow-sm ring-1 ring-slate-100">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="rounded-[2px] text-[7px]">
                                {(member.firstName || member.name)[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-[9px] font-black leading-none text-slate-700 transition-colors group-hover/member:text-indigo-600">
                                {member.firstName} {member.lastName}
                              </span>
                              <span className="mt-0.5 truncate text-[7px] font-bold uppercase tracking-tighter text-slate-400">
                                {member.role}
                              </span>
                            </div>
                            <LogIn className="h-2 w-2 text-slate-200 opacity-0 transition-colors group-hover/member:text-indigo-400 group-hover/member:opacity-100" />
                            {user?.email === member.email &&
                              user?.activeOrganizationId === org.id && (
                                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                              )}
                          </DropdownMenuItem>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-col">
          <span className="mb-1 text-[7px] font-black uppercase leading-none tracking-widest text-slate-400">
            Session Node
          </span>
          <span className="max-w-[120px] truncate text-[9px] font-black uppercase leading-none text-slate-900">
            {user?.displayName || 'Guest'}
          </span>
          <span className="mt-1 truncate text-[7px] text-slate-400">{user?.email}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className="rounded-[2px] border-slate-200 bg-white px-1.5 py-0 text-[8px] font-black text-indigo-600">
            {user?.activeOrganizationId
              ? organizations[user.activeOrganizationId]?.name
              : 'B2C_ROOT'}
          </Badge>
          <span className="text-[7px] font-bold uppercase text-slate-300">
            ID: {user?.activeOrganizationId || 'NULL'}
          </span>
        </div>
      </div>
    </>
  );
}
