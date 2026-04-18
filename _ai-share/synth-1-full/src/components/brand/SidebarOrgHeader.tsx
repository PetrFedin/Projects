'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { organizations, partnerTeams } from '@/components/team/_fixtures/team-data';
import { ROUTES } from '@/lib/routes';

export function SidebarOrgHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const orgId = user?.activeOrganizationId;
  const [showLogo, setShowLogo] = useState(true);

  const { org, member } = useMemo(() => {
    if (!orgId) return { org: null, member: null };
    const o = organizations[orgId];
    const team = partnerTeams[orgId];
    const m = team?.find((t) => t.email === user?.email || t.nickname === user?.nickname);
    return { org: o ?? null, member: m ?? null };
  }, [orgId, user?.email, user?.nickname]);

  const memberPhoto = member?.avatar ?? (user as { photoURL?: string })?.photoURL ?? null;

  if (!org) {
    return (
      <div className="shrink-0 border-b border-slate-100 px-2 py-2">
        <Link
          href={ROUTES.brand.settings}
          className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-2 transition-colors hover:bg-slate-100"
        >
          <div className="h-8 w-8 shrink-0 rounded-md bg-slate-200" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold text-slate-600">
              {user?.displayName || 'Пользователь'}
            </p>
            <p className="truncate text-[8px] text-slate-400">Бренд-центр</p>
          </div>
        </Link>
      </div>
    );
  }

  const memberName = member
    ? `${member.firstName} ${member.lastName}`.trim() || member.nickname
    : user?.displayName || user?.identity?.firstName
      ? `${user.identity?.firstName || ''} ${user.identity?.lastName || ''}`.trim()
      : user?.displayName || 'Сотрудник';
  const memberRole = member?.role || 'Участник';

  const canToggle = org.logo && memberPhoto;

  const goToSettings = () => router.push(ROUTES.brand.settings);

  return (
    <div className="shrink-0 border-b border-slate-100 px-2 py-2">
      <div
        role="button"
        tabIndex={0}
        onClick={goToSettings}
        onKeyDown={(e) => e.key === 'Enter' && goToSettings()}
        className="group flex cursor-pointer items-start gap-2 rounded-lg bg-slate-50/80 px-2 py-2 transition-colors hover:bg-slate-100"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            if (canToggle) setShowLogo((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              if (canToggle) setShowLogo((prev) => !prev);
            }
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
          title={canToggle ? (showLogo ? 'Показать фото' : 'Показать лого') : undefined}
          aria-label={canToggle ? (showLogo ? 'Показать фото' : 'Показать лого') : undefined}
        >
          {showLogo && org.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.logo} alt="" width={36} height={36} className="h-9 w-9 object-cover" />
          ) : memberPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={memberPhoto} alt="" width={36} height={36} className="h-9 w-9 object-cover" />
          ) : org.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.logo} alt="" width={36} height={36} className="h-9 w-9 object-cover" />
          ) : (
            <span className="text-xs font-bold text-slate-400">{org.name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[10px] font-bold leading-tight text-slate-800"
            title={org.name}
          >
            {org.name}
          </p>
          <p className="mt-0.5 truncate text-[9px] font-medium text-slate-600" title={memberName}>
            {memberName}
          </p>
          <p className="truncate text-[8px] text-slate-400" title={memberRole}>
            {memberRole}
          </p>
        </div>
      </div>
    </div>
  );
}
