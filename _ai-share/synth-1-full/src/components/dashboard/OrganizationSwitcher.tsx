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
          className="hover:border-accent-primary/30 h-12 gap-2 rounded-xl border-2 px-4"
          disabled={isLoading}
        >
          <Building2 className="text-accent-primary h-5 w-5" />
          <div className="text-left">
            <div className="text-text-muted text-xs font-black uppercase leading-none">
              Organization
            </div>
            <div className="text-text-primary text-sm font-bold leading-tight">
              {currentOrg?.name || 'Select Org'}
            </div>
          </div>
          <ChevronDown className="text-text-muted h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-text-muted text-xs font-black uppercase">
          Switch Organization
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {allOrgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className={cn(
              'cursor-pointer p-4',
              org.id === currentOrg?.id && 'bg-accent-primary/10'
            )}
          >
            <div className="flex w-full items-center gap-3">
              <div className="bg-bg-surface2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                <Building2 className="text-text-secondary h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-text-primary truncate text-sm font-black uppercase">
                    {org.name}
                  </h4>
                  {org.id === currentOrg?.id && (
                    <Check className="text-accent-primary h-4 w-4 flex-shrink-0" />
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    className={cn(
                      'border-none text-[7px] font-black uppercase',
                      org.type === 'brand'
                        ? 'bg-accent-primary/15 text-accent-primary'
                        : org.type === 'shop'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-bg-surface2 text-text-primary'
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

                <p className="text-text-secondary mt-1 text-[10px]">
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
