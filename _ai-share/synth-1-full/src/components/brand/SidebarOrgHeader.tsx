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
    const m = team?.find(
      (t) => t.email === user?.email || t.nickname === user?.nickname
    );
    return { org: o ?? null, member: m ?? null };
  }, [orgId, user?.email, user?.nickname]);

  const memberPhoto = member?.avatar ?? (user as { photoURL?: string })?.photoURL ?? null;

  if (!org) {
    return (
      <div className="px-2 py-2 border-b border-slate-100 shrink-0">
        <Link
          href={ROUTES.brand.settings}
          className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="h-8 w-8 rounded-md bg-slate-200 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-600 truncate">
              {user?.displayName || 'Пользователь'}
            </p>
            <p className="text-[8px] text-slate-400 truncate">Бренд-центр</p>
          </div>
        </Link>
      </div>
    );
  }

  const memberName =
    member
      ? `${member.firstName} ${member.lastName}`.trim() || member.nickname
      : user?.displayName || user?.identity?.firstName
        ? `${user.identity?.firstName || ''} ${user.identity?.lastName || ''}`.trim()
        : user?.displayName || 'Сотрудник';
  const memberRole = member?.role || 'Участник';

  const canToggle = org.logo && memberPhoto;

  const goToSettings = () => router.push(ROUTES.brand.settings);

  return (
    <div className="px-2 py-2 border-b border-slate-100 shrink-0">
      <div
        role="button"
        tabIndex={0}
        onClick={goToSettings}
        onKeyDown={(e) => e.key === 'Enter' && goToSettings()}
        className="flex items-start gap-2 px-2 py-2 rounded-lg bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer group"
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
          className="h-9 w-9 rounded-md overflow-hidden bg-white border border-slate-100 shrink-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-200"
          title={canToggle ? (showLogo ? 'Показать фото' : 'Показать лого') : undefined}
          aria-label={canToggle ? (showLogo ? 'Показать фото' : 'Показать лого') : undefined}
        >
          {showLogo && org.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={org.logo}
              alt=""
              width={36}
              height={36}
              className="object-cover w-9 h-9"
            />
          ) : memberPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={memberPhoto}
              alt=""
              width={36}
              height={36}
              className="object-cover w-9 h-9"
            />
          ) : org.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={org.logo}
              alt=""
              width={36}
              height={36}
              className="object-cover w-9 h-9"
            />
          ) : (
            <span className="text-slate-400 text-xs font-bold">
              {org.name?.charAt(0) || '?'}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-bold text-slate-800 truncate leading-tight"
            title={org.name}
          >
            {org.name}
          </p>
          <p
            className="text-[9px] font-medium text-slate-600 truncate mt-0.5"
            title={memberName}
          >
            {memberName}
          </p>
          <p
            className="text-[8px] text-slate-400 truncate"
            title={memberRole}
          >
            {memberRole}
          </p>
        </div>
      </div>
    </div>
  );
}
