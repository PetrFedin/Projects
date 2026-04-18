'use client';

import { startTransition, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { organizations } from '@/components/team/_fixtures/team-data';

export default function UserNav() {
  const { user, profile, loading, signOut, updateProfile, signIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const activeOrg = profile?.user?.organization_id || user?.activeOrganizationId;
  const partnerName = profile?.user?.full_name || user?.displayName;

  const isB2B =
    profile?.navigation?.length > 0 ||
    user?.roles?.some((r) =>
      ['admin', 'brand', 'distributor', 'supplier', 'manufacturer', 'shop'].includes(r)
    ) ||
    user?.email?.endsWith('@syntha.ai');

  const currentRole = profile?.user?.role || user?.roles?.[0];

  /** Главная страница кабинета по роли (не только brand). */
  const hubPathForRole = (role?: string): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'brand':
        return '/brand';
      case 'shop':
        return '/shop';
      case 'distributor':
        return '/distributor';
      case 'manufacturer':
      case 'supplier':
        return '/factory';
      default:
        return '/u?tab=profile';
    }
  };

  const settingsPathForRole = (role?: string): string => {
    if (role === 'brand') return '/brand/settings';
    if (!role || role === 'client') return '/u?tab=settings';
    return hubPathForRole(role);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор Syntha HQ';
      case 'brand':
        return 'Бренд';
      case 'shop':
        return 'Магазин';
      case 'distributor':
        return 'Дистрибьютор';
      case 'supplier':
        return 'Поставщик';
      case 'manufacturer':
        return 'Производство';
      default:
        return 'Клиент';
    }
  };

  const handleSwitchOrg = async (orgId: string) => {
    try {
      const org = organizations[orgId];
      await updateProfile({
        activeOrganizationId: orgId,
        partnerName: org?.name,
      });
      toast({
        title: 'Профиль переключен',
        description: `Вы перешли в ${org?.name}`,
      });
    } catch (err) {
      toast({ title: 'Ошибка переключения', variant: 'destructive' });
    }
  };

  const isOwner =
    (isB2B &&
      (user?.team?.[0]?.nickname === user?.nickname ||
        user?.team?.[0]?.name === user?.displayName ||
        `${user?.team?.[0]?.firstName} ${user?.team?.[0]?.lastName}` === user?.displayName)) ||
    (!isB2B && user?.roles?.includes('client'));

  const handleKickMember = async (member: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOwner) return;

    toast({
      title: 'Доступ аннулирован',
      description: `Участник ${member.name || `${member.firstName} ${member.lastName}`} исключен. Пароль сброшен.`,
      variant: 'destructive',
    });
  };

  const handleSwitchTeamMember = async (member: any) => {
    if (!user) return;
    try {
      console.log('Switching to team member:', member.email, member.nickname);

      const isSwitchingUser = member.email && member.email !== user.email;
      let newProfile: any;

      if (isSwitchingUser) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('syntha_profile_avatar');
        }
        newProfile = await signIn(member.email, 'password123');
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('syntha_profile_avatar');
          setProfileAvatar(null);
        }
        newProfile = await updateProfile({
          displayName: member.name || `${member.firstName} ${member.lastName}`,
          photoURL: member.avatar,
          nickname: member.nickname || member.role,
        });
      }

      // Determine where to redirect after switch
      const primaryRole = newProfile.roles?.[0] || 'client';
      const targetUrl =
        primaryRole === 'admin'
          ? '/admin'
          : primaryRole === 'brand'
            ? '/brand'
            : primaryRole === 'shop'
              ? '/shop'
              : primaryRole === 'manufacturer'
                ? '/factory?role=manufacturer'
                : primaryRole === 'supplier'
                  ? '/factory?role=supplier'
                  : primaryRole === 'distributor'
                    ? '/distributor'
                    : '/u';

      toast({
        title: 'Переключение выполнено',
        description: `Вы вошли как ${member.name || `${member.firstName} ${member.lastName}`} (${member.role})`,
      });

      startTransition(() => router.push(targetUrl));
    } catch (err) {
      toast({ title: 'Ошибка переключения', variant: 'destructive' });
    }
  };

  const handleSwitchBrand = async (brandEmail: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('syntha_profile_avatar');
        setProfileAvatar(null);
      }

      await signIn(brandEmail, 'password123');
      const brandParam = brandEmail === 'nordic@syntha.ai' ? 'nordic' : 'syntha';
      window.location.href = `/brand?brand=${brandParam}`;

      toast({
        title: 'Бренд переключен',
        description: `Вы перешли в кабинет другого бренда`,
      });
    } catch (err) {
      toast({ title: 'Ошибка переключения бренда', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readAvatar = () => {
      try {
        setProfileAvatar(localStorage.getItem('syntha_profile_avatar'));
      } catch {
        setProfileAvatar(null);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'syntha_profile_avatar') readAvatar();
    };

    readAvatar();
    window.addEventListener('syntha_profile_avatar_updated', readAvatar as EventListener);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('syntha_profile_avatar_updated', readAvatar as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Вы успешно вышли.' });
    } catch (error) {
      toast({
        title: 'Ошибка при выходе',
        variant: 'destructive',
      });
    }
  };

  const goAccountHome = () => {
    const path = isB2B ? hubPathForRole(currentRole) : '/u?tab=profile';
    startTransition(() => router.push(path));
  };

  const goAccountSettings = () => {
    const path = isB2B ? settingsPathForRole(currentRole) : '/u?tab=settings';
    startTransition(() => router.push(path));
  };

  const handleSignInGuest = async () => {
    try {
      await signIn('elena.petrova@example.com', 'password123');
      startTransition(() => router.push('/u'));
      toast({ title: 'Вы вошли', description: 'Открыт личный кабинет' });
    } catch {
      toast({ title: 'Не удалось войти', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />;
  }

  if (user) {
    return (
      <div className="flex h-9 min-w-0 max-w-[200px] items-stretch rounded-[2px] border border-slate-200 bg-white sm:max-w-[240px]">
        <Button
          type="button"
          variant="ghost"
          className="h-9 min-w-0 flex-1 shrink rounded-r-none px-2 hover:bg-slate-50"
          onClick={() => goAccountHome()}
          title={isB2B ? 'Кабинет' : 'Мой профиль'}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="relative shrink-0">
              <Avatar className="h-7 w-7 rounded-[2px] border border-white shadow-sm ring-1 ring-slate-100">
                <AvatarImage
                  src={profileAvatar ?? user.photoURL ?? ''}
                  alt={user.displayName ?? 'User'}
                />
                <AvatarFallback className="rounded-[2px] bg-slate-100 text-[9px] font-black text-slate-600">
                  {user.displayName?.[0].toUpperCase() ?? user.email?.[0].toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              {isB2B && (
                <div className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white bg-indigo-500" />
              )}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="mb-0.5 block truncate text-[7px] font-black uppercase leading-none tracking-[0.05em] text-slate-400">
                {activeOrg || user?.partnerName || getRoleLabel(currentRole)}
              </span>
              <span className="block truncate text-[10px] font-black uppercase leading-none text-slate-900">
                {partnerName || user?.displayName}
              </span>
            </div>
          </div>
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-8 shrink-0 rounded-l-none border-l border-slate-200 hover:bg-slate-50"
              aria-label="Меню профиля"
            >
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="z-[600] w-60 overflow-hidden rounded-[2px] border border-slate-200 bg-white p-0 shadow-xl"
            align="end"
            sideOffset={4}
          >
            {isB2B && user.organizations && user.organizations.length > 1 && (
              <div className="border-b border-slate-800 bg-slate-900 p-2">
                <p className="mb-2 flex items-center gap-2 px-1 text-[7px] font-black uppercase tracking-[0.2em] text-white/40">
                  <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                  ВЫБОР УЗЛА
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {user.organizations.map((org: any) => (
                    <DropdownMenuItem
                      key={org.organizationId}
                      onSelect={() => void handleSwitchOrg(org.organizationId)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-[1px] border p-2 transition-all',
                        user.activeOrganizationId === org.organizationId
                          ? 'border-white/20 bg-slate-800 text-white shadow-sm'
                          : 'border-transparent bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      )}
                    >
                      <span className="text-[9px] font-black uppercase tracking-tight">
                        {organizations[org.organizationId]?.name || org.organizationId}
                      </span>
                      {user.activeOrganizationId === org.organizationId && (
                        <Check className="h-3 w-3 stroke-[3] text-indigo-400" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            )}

            {profile?.navigation?.length > 0 && (
              <div className="border-b border-slate-100 p-1">
                <p className="mb-1 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
                  БЫСТРЫЙ ПЕРЕХОД
                </p>
                <div className="grid grid-cols-2 gap-0.5">
                  {profile.navigation.slice(0, 4).map((nav: any) => (
                    <DropdownMenuItem
                      key={nav.path}
                      className="cursor-pointer rounded-[1px] py-1.5 hover:bg-slate-50"
                      onSelect={() => router.push(nav.path)}
                    >
                      <span className="text-[8px] font-black uppercase tracking-tight text-slate-600">
                        {nav.title}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            )}

            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex flex-col space-y-0.5">
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">
                  {isB2B ? 'АКТИВНЫЙ ПРОФИЛЬ' : 'АККАУНТ B2C'}
                </p>
                <p className="text-xs font-black uppercase leading-none tracking-tight text-slate-900">
                  {user.displayName}
                </p>
                <p className="mt-1 text-[9px] font-medium leading-none text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            {isB2B && user.team && user.team.length > 0 && (
              <div className="p-1">
                <p className="mb-1 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
                  КОМАНДА ДОСТУПА
                </p>
                <div className="space-y-0.5">
                  {user.team
                    .filter((m) => m.invitationStatus !== 'pending')
                    .map((member) => {
                      const isCurrent =
                        user.nickname === member.nickname ||
                        (!user.nickname &&
                          user.displayName ===
                            (member.name || `${member.firstName} ${member.lastName}`));

                      return (
                        <DropdownMenuItem
                          key={member.id}
                          onSelect={() => void handleSwitchTeamMember(member)}
                          className={cn(
                            'flex cursor-pointer items-center justify-between rounded-[1px] border p-1.5 outline-none transition-all',
                            isCurrent
                              ? 'border-slate-200 bg-slate-50 text-slate-900'
                              : 'border-transparent bg-white text-slate-600 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex flex-1 items-center gap-2 overflow-hidden">
                            <Avatar className="h-6 w-6 flex-shrink-0 rounded-[2px] border border-white ring-1 ring-slate-100">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="rounded-[2px] text-[8px] font-black">
                                {(member.name || member.firstName)[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-[9px] font-black uppercase leading-tight text-slate-900">
                                {member.name || `${member.firstName} ${member.lastName}`}
                              </span>
                              <span className="mt-0.5 truncate text-[7px] font-bold uppercase leading-tight tracking-widest text-slate-400">
                                {member.role}
                              </span>
                            </div>
                          </div>
                          {isCurrent && (
                            <Check className="ml-2 h-2.5 w-2.5 stroke-[3] text-indigo-500" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                </div>
              </div>
            )}

            <DropdownMenuSeparator className="m-0 bg-slate-100" />
            <div className="p-1">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer rounded-[1px] py-2 hover:bg-slate-50"
                  onSelect={() => goAccountHome()}
                >
                  <UserIcon className="mr-2.5 h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-700">
                    {isB2B ? 'КАБИНЕТ БРЕНДА' : 'МОЙ ПРОФИЛЬ'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-[1px] py-2 hover:bg-slate-50"
                  onSelect={() => goAccountSettings()}
                >
                  <SettingsIcon className="mr-2.5 h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-700">
                    {isB2B ? 'НАСТРОЙКИ КАБИНЕТА' : 'НАСТРОЙКИ ПРОФИЛЯ'}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1 bg-slate-50" />
              <DropdownMenuItem
                onSelect={() => void handleSignOut()}
                className="cursor-pointer rounded-[1px] px-2 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
              >
                <LogOut className="mr-2.5 h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">ВЫЙТИ</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 text-[10px] font-black uppercase"
      onClick={() => void handleSignInGuest()}
    >
      Войти
    </Button>
  );
}
