'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, User, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserContext } from '@/hooks/useUserContext';

interface RoleContextCardProps {
  context: UserContext;
}

export function RoleContextCard({ context }: RoleContextCardProps) {
  const {
    user,
    currentOrg,
    isOrgAdmin,
    isPlatformAdmin,
    isRetailer,
    isBrand,
    isBuyer,
    isSalesRep,
  } = context;

  if (!user) return null;

  const getRoleLabel = () => {
    if (isPlatformAdmin) return 'Platform Admin';
    if (isOrgAdmin && isBrand) return 'Brand Manager';
    if (isOrgAdmin && isRetailer) return 'Store Owner';
    if (isBuyer) return 'Buyer';
    if (isSalesRep) return 'Sales Rep';
    return 'Team Member';
  };

  const getRoleIcon = () => {
    if (isPlatformAdmin) return Crown;
    if (isOrgAdmin) return Shield;
    return User;
  };

  const getRoleColor = () => {
    if (isPlatformAdmin) return 'bg-accent-primary/15 text-accent-primary border-accent-primary/25';
    if (isOrgAdmin) return 'bg-accent-primary/15 text-accent-primary border-accent-primary/30';
    if (isBuyer) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (isSalesRep) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-bg-surface2 text-text-primary border-border-default';
  };

  const Icon = getRoleIcon();

  return (
    <Card className={cn('rounded-xl border-2 shadow-sm', getRoleColor())}>
      <CardContent className="flex items-center gap-3 p-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            isPlatformAdmin
              ? 'bg-accent-primary/25'
              : isOrgAdmin
                ? 'bg-accent-primary/25'
                : 'bg-border-subtle'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-black uppercase leading-none">{getRoleLabel()}</p>
          <p className="mt-1 text-[10px] font-medium opacity-80">
            {currentOrg?.name || user.displayName}
          </p>
        </div>

        {isPlatformAdmin && (
          <Badge className="bg-accent-primary ml-auto border-none text-[7px] font-black uppercase text-white">
            ADMIN
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
