'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/hooks/useUserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrganizationSwitcher() {
  const { currentOrg, allOrgs, canSwitchOrg, switchOrganization } = useUserContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!canSwitchOrg) return null;

  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrg?.id) return;

    setIsLoading(true);
    try {
      await switchOrganization(orgId);
      router.refresh();
    } catch (error) {
      console.error('Failed to switch organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-12 gap-2 rounded-xl border-2 px-4 hover:border-indigo-300"
          disabled={isLoading}
        >
          <Building2 className="h-5 w-5 text-indigo-600" />
          <div className="text-left">
            <div className="text-xs font-black uppercase leading-none text-slate-400">
              Organization
            </div>
            <div className="text-sm font-bold leading-tight text-slate-900">
              {currentOrg?.name || 'Select Org'}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-xs font-black uppercase text-slate-400">
          Switch Organization
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {allOrgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className={cn('cursor-pointer p-4', org.id === currentOrg?.id && 'bg-indigo-50')}
          >
            <div className="flex w-full items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-black uppercase text-slate-900">
                    {org.name}
                  </h4>
                  {org.id === currentOrg?.id && (
                    <Check className="h-4 w-4 flex-shrink-0 text-indigo-600" />
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    className={cn(
                      'border-none text-[7px] font-black uppercase',
                      org.type === 'brand'
                        ? 'bg-purple-100 text-purple-700'
                        : org.type === 'shop'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {org.type}
                  </Badge>

                  {org.isVerified && (
                    <Badge className="border-none bg-emerald-100 text-[7px] font-black uppercase text-emerald-700">
                      Verified
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  {org.stats.activeUsers} members • {org.stats.orderVolume} orders
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
