'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Shield,
  Store,
  ShoppingCart,
  User,
  Briefcase,
  Factory,
  Warehouse,
  Scan,
  FileCheck,
  Share2,
  Gavel,
  Newspaper,
  Monitor,
  Zap,
  Globe,
  RefreshCcw,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';
import { useIdentitySwitch } from '@/hooks/use-identity-switch';
import { ROUTES } from '@/lib/routes';

const roles = [
  {
<<<<<<< HEAD
    href: '/admin',
=======
    href: ROUTES.admin.home,
>>>>>>> recover/cabinet-wip-from-stash
    icon: Shield,
    label: 'Администратор',
    email: 'admin@syntha.ai',
    roleKey: 'admin',
    orgId: 'org-hq-001',
  },
  {
<<<<<<< HEAD
    href: '/brand',
=======
    href: ROUTES.brand.home,
>>>>>>> recover/cabinet-wip-from-stash
    icon: Store,
    label: 'Бренд',
    email: 'brand@syntha.ai',
    roleKey: 'brand',
    orgId: 'org-brand-001',
  },
  {
<<<<<<< HEAD
    href: '/shop',
=======
    href: ROUTES.shop.home,
>>>>>>> recover/cabinet-wip-from-stash
    icon: ShoppingCart,
    label: 'Магазин',
    email: 'shop@syntha.ai',
    roleKey: 'shop',
    orgId: 'org-shop-001',
  },
  {
<<<<<<< HEAD
    href: '/distributor',
=======
    href: ROUTES.distributor.home,
>>>>>>> recover/cabinet-wip-from-stash
    icon: Briefcase,
    label: 'Дистрибьютор',
    email: 'dist@syntha.ai',
    roleKey: 'distributor',
    orgId: 'org-dist-001',
  },
  {
<<<<<<< HEAD
    href: '/factory?role=manufacturer',
=======
    href: ROUTES.factory.production,
>>>>>>> recover/cabinet-wip-from-stash
    icon: Factory,
    label: 'Производство',
    roleKey: 'manufacturer',
    email: 'factory@syntha.ai',
    orgId: 'org-factory-001',
  },
  {
<<<<<<< HEAD
    href: '/factory?role=supplier',
=======
    href: ROUTES.factory.supplier,
>>>>>>> recover/cabinet-wip-from-stash
    icon: Warehouse,
    label: 'Поставщик',
    roleKey: 'supplier',
    email: 'supplier@syntha.ai',
    orgId: 'org-supplier-001',
  },
  {
<<<<<<< HEAD
    href: '/client',
=======
    href: ROUTES.client.home,
>>>>>>> recover/cabinet-wip-from-stash
    icon: User,
    label: 'Клиент',
    email: 'elena.petrova@example.com',
    roleKey: 'client',
  },
];

export default function RolePanel() {
  return (
    <Suspense fallback={null}>
      <RolePanelContent />
    </Suspense>
  );
}

function RolePanelContent() {
  const pathname = usePathname();
<<<<<<< HEAD
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentRole = searchParams.get('role');
=======
  const router = useRouter();
>>>>>>> recover/cabinet-wip-from-stash
  const { user } = useAuth();
  const { handleIdentitySwitch } = useIdentitySwitch();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const { isFlowMapOpen } = useUIState();

  const handleRoleSwitch = async (e: React.MouseEvent, role: (typeof roles)[0]) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(
      'RolePanel: Switch triggered for',
      role.roleKey,
      'Current flow map state:',
      isFlowMapOpen
    );

    if (loadingRole) {
      console.log('RolePanel: Already loading', loadingRole);
      return;
    }

    try {
      setLoadingRole(role.roleKey);

      if (role.email) {
        console.log('RolePanel: Calling handleIdentitySwitch for', role.email);
        await handleIdentitySwitch(role.email, role.roleKey, role.orgId);
      } else {
        console.log('RolePanel: No email, redirecting to', role.href);
        router.push(role.href);
      }
    } catch (err) {
      console.error('RolePanel: Switch failed:', err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed right-4 top-1/2 z-[100] -translate-y-1/2 transition-opacity duration-300',
          isFlowMapOpen && 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-2xl backdrop-blur-xl">
          {roles.map((role) => {
            const isActive =
<<<<<<< HEAD
              role.roleKey === 'manufacturer' || role.roleKey === 'supplier'
                ? pathname.startsWith('/factory') && currentRole === role.roleKey
                : pathname === role.href || (pathname.startsWith(role.href) && role.href !== '/');
=======
              role.roleKey === 'manufacturer'
                ? pathname.startsWith(ROUTES.factory.production)
                : role.roleKey === 'supplier'
                  ? pathname.startsWith(ROUTES.factory.supplier)
                  : pathname === role.href || (pathname.startsWith(role.href) && role.href !== '/');
>>>>>>> recover/cabinet-wip-from-stash

            const isLoading = loadingRole === role.roleKey;

            return (
              <Tooltip key={role.roleKey}>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => handleRoleSwitch(e, role)}
                    disabled={!!loadingRole}
                    style={{ cursor: loadingRole ? 'not-allowed' : 'pointer' }}
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl transition-all duration-300',
                      isActive
<<<<<<< HEAD
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900',
=======
                        ? 'bg-text-primary text-white shadow-lg'
                        : 'text-text-muted hover:bg-bg-surface2 hover:text-text-primary',
>>>>>>> recover/cabinet-wip-from-stash
                      loadingRole && !isLoading && 'opacity-50 grayscale'
                    )}
                  >
                    {isLoading ? (
<<<<<<< HEAD
                      <RefreshCcw className="h-4 w-4 animate-spin text-indigo-500" />
=======
                      <RefreshCcw className="text-accent-primary h-4 w-4 animate-spin" />
>>>>>>> recover/cabinet-wip-from-stash
                    ) : (
                      <role.icon className="h-5 w-5" />
                    )}
                    <span className="sr-only">{role.label}</span>
                    {isLoading && <div className="absolute inset-0 animate-pulse bg-white/10" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="rounded-lg text-[10px] font-bold uppercase tracking-widest"
                >
                  <p>{isLoading ? 'Загрузка...' : role.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
