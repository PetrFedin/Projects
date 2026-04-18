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
    if (isPlatformAdmin) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (isOrgAdmin) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (isBuyer) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (isSalesRep) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const Icon = getRoleIcon();

  return (
    <Card className={cn('rounded-xl border-2 shadow-sm', getRoleColor())}>
      <CardContent className="flex items-center gap-3 p-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            isPlatformAdmin ? 'bg-purple-200' : isOrgAdmin ? 'bg-indigo-200' : 'bg-slate-200'
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
          <Badge className="ml-auto border-none bg-purple-600 text-[7px] font-black uppercase text-white">
            ADMIN
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
