'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRbac } from '@/hooks/useRbac';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export type HubSidebarProfile = {
  name: string;
  initials: string;
  photoURL?: string;
  /** Необязательно: логин / uid под именем (подпись задаётся в `clientIdLabel`). */
  clientId?: string;
  /**
   * Подпись к `clientId` (например «ID клиента»). Пустая строка — только значение.
   * Если не задано и `clientId` начинается с `@`, подпись не показывается.
   */
  clientIdLabel?: string;
  /** Доп. блок под логином (например индекс академии) */
  profileFooter?: ReactNode;
};

export function HubSidebarHeader({
  href,
  icon: Icon,
  title,
  badge,
  badgeClass = 'bg-bg-surface2 text-text-secondary',
  iconBgClass = 'bg-text-primary',
  /** Подпись роли из RBAC под заголовком — по умолчанию включена; отключите для более спокойного вида. */
  showRole = true,
  /** Профиль: квадратное фото как у плитки хаба (36×36), имя и при необходимости строка идентификатора */
  profile,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  badge?: string;
  badgeClass?: string;
  iconBgClass?: string;
  showRole?: boolean;
  profile?: HubSidebarProfile;
}) {
  const { role } = useRbac();
  const subline = badge || showRole;

  return (
    <div className="border-border-subtle shrink-0 border-b px-3 py-1">
      <Link
        href={href}
        className={cn(
          'hover:bg-bg-surface2 group flex gap-2.5 rounded-lg px-2 py-1 transition-colors',
          profile ? 'items-start' : 'items-center'
        )}
      >
        {profile ? (
          <>
            <Avatar className="h-9 w-9 shrink-0 rounded-[4px] border border-border-subtle shadow-sm">
              {profile.photoURL ? (
                <AvatarImage src={profile.photoURL} alt="" className="object-cover" />
              ) : null}
              <AvatarFallback className="rounded-[4px] text-[11px] font-bold">{profile.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-text-primary truncate text-[13px] font-semibold leading-tight tracking-tight">
                {profile.name}
              </p>
              {profile.clientId ? (
                <p className="text-text-secondary mt-0 truncate font-mono text-[10px] font-medium leading-tight tracking-normal">
                  {profile.clientIdLabel === '' ||
                  (profile.clientIdLabel === undefined && profile.clientId.startsWith('@')) ? (
                    profile.clientId
                  ) : (
                    <>
                      <span className="text-text-muted font-bold uppercase tracking-wide">
                        {profile.clientIdLabel ?? 'ID клиента'}
                      </span>
                      <span className="ml-1 normal-case">{profile.clientId}</span>
                    </>
                  )}
                </p>
              ) : null}
              {profile.profileFooter ? (
                <div className="mt-2 border-t border-border-subtle/70 pt-2">{profile.profileFooter}</div>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] text-white transition-opacity group-hover:opacity-90',
                iconBgClass
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary truncate text-[10px] font-black uppercase leading-tight tracking-tight">
                {title}
              </p>
              {subline ? (
                <div className="mt-0.5 flex items-center gap-1.5">
                  {badge ? (
                    <Badge className={cn(badgeClass, 'h-4 border-none px-1 py-0 text-[7px] font-black')}>
                      {badge}
                    </Badge>
                  ) : null}
                  {showRole ? (
                    <span className="text-text-muted text-[8px] font-bold capitalize">{role}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
