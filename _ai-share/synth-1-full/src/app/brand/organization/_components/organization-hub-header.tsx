'use client';

import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ExternalLink,
  LayoutDashboard,
  Building2,
  Users,
} from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { ActivityPeriod } from './organization-overview-lib';
import { formatActivityPeriod } from './organization-overview-lib';
import type { OrgOverviewProfileView } from '@/lib/brand/organization-types';

export type OrganizationHubHeaderProps = {
  healthLoading: boolean;
  healthError?: Error | null;
  partialLoadWarning?: string | null;
  onRetryHealth?: () => void;
  orgProfile: OrgOverviewProfileView | null;
  participantsCount: number;
  onlineCount: number;
  activityPeriod: ActivityPeriod;
  setActivityPeriod: (p: ActivityPeriod) => void;
  customRange: { from?: Date; to?: Date };
  setCustomRange: (r: { from?: Date; to?: Date }) => void;
};

export function OrganizationHubHeader({
  healthLoading,
  healthError,
  partialLoadWarning,
  onRetryHealth,
  orgProfile,
  participantsCount,
  onlineCount,
  activityPeriod,
  setActivityPeriod,
  customRange,
  setCustomRange,
}: OrganizationHubHeaderProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface2/50 to-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        {!healthLoading && healthError && onRetryHealth ? (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50/90 px-3 py-2"
          >
            <p className="text-xs font-medium leading-snug text-rose-900">
              {healthError.message || 'Не удалось загрузить данные организации'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 border-rose-300 text-[9px] font-bold text-rose-900 hover:bg-rose-100"
              onClick={onRetryHealth}
            >
              Повторить
            </Button>
          </div>
        ) : null}
        {!healthLoading && !healthError && partialLoadWarning && onRetryHealth ? (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2"
          >
            <p className="text-xs font-medium leading-snug text-amber-950">{partialLoadWarning}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 border-amber-300 text-[9px] font-bold text-amber-950 hover:bg-amber-100"
              onClick={onRetryHealth}
            >
              Повторить
            </Button>
          </div>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
              <LayoutDashboard className="size-5" />
            </div>
            <Badge variant="outline" className="text-[9px]">
              Organization Hub
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {healthLoading ? (
              <>
                <div className="h-6 w-32 animate-pulse rounded bg-bg-surface2" aria-hidden />
                <span className="hidden text-text-muted sm:inline">•</span>
                <div className="h-6 w-16 animate-pulse rounded bg-bg-surface2" aria-hidden />
                <span className="hidden text-text-muted sm:inline">•</span>
                <div className="h-6 w-24 animate-pulse rounded bg-bg-surface2" aria-hidden />
                <span className="hidden text-text-muted sm:inline">•</span>
                <div className="h-6 w-20 animate-pulse rounded bg-bg-surface2" aria-hidden />
              </>
            ) : (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-xs font-black text-text-secondary transition-colors hover:bg-accent-primary/10 hover:text-accent-primary"
                      aria-label="Профиль организации"
                    >
                      <Building2 className="size-3" />
                      {orgProfile?.brand?.name ?? 'Syntha HQ'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-72 rounded-xl border-border-default p-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-accent-primary/15">
                          <Building2 className="size-4 text-accent-primary" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-text-primary">
                            {orgProfile?.brand?.name ?? 'Syntha HQ'}
                          </h4>
                          <p className="text-[8px] text-text-secondary">Организация</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[9px] text-text-secondary">
                        <p>
                          <span className="font-bold text-text-secondary">Юр. лицо:</span>{' '}
                          {orgProfile?.legal?.legal_name ?? 'ООО «Синта Фэшн»'}
                        </p>
                        <p>
                          <span className="font-bold text-text-secondary">ИНН:</span>{' '}
                          {orgProfile?.legal?.inn ?? '7701234567'}
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 w-full text-[9px] font-black uppercase"
                      >
                        <Link
                          href={ROUTES.brand.home}
                          className="flex items-center justify-center gap-1.5"
                        >
                          Профиль бренда <ExternalLink className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="hidden text-text-muted sm:inline">•</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="-mx-1.5 rounded-lg px-1.5 py-0.5 transition-colors hover:bg-emerald-50"
                      aria-label="Подписка Elite"
                    >
                      <Badge
                        variant="outline"
                        className="cursor-pointer border-emerald-200 text-[9px] font-bold text-emerald-600 hover:border-emerald-400"
                      >
                        Elite
                      </Badge>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-72 rounded-xl border-border-default p-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-text-primary">
                        Elite Plan
                      </h4>
                      <p className="text-[8px] text-text-secondary">Подписка</p>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 w-full text-[9px] font-black uppercase"
                      >
                        <Link
                          href={ROUTES.brand.subscription}
                          className="flex items-center justify-center gap-1.5"
                        >
                          Подписка и биллинг <ExternalLink className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="hidden text-text-muted sm:inline">•</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-xs font-black text-text-secondary hover:bg-accent-primary/10 hover:text-accent-primary"
                      aria-label={`Команда: ${participantsCount} участников`}
                    >
                      <Users className="size-3" /> {participantsCount} участников
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-72 rounded-xl border-border-default p-4 shadow-xl"
                  >
                    <h4 className="text-xs font-black uppercase text-text-primary">Команда</h4>
                    <p className="text-[8px] text-text-secondary">{participantsCount} участников</p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-2 h-7 w-full text-[9px] font-black uppercase"
                    >
                      <Link
                        href={ROUTES.brand.team}
                        className="flex items-center justify-center gap-1.5"
                      >
                        Команда и активность <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </PopoverContent>
                </Popover>
                <span className="hidden text-text-muted sm:inline">•</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-xs font-black text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      aria-label={`Сейчас онлайн: ${onlineCount} из ${participantsCount}`}
                    >
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                      {onlineCount} онлайн
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-72 rounded-xl border-border-default p-4 shadow-xl"
                  >
                    <h4 className="text-xs font-black uppercase text-text-primary">
                      Сейчас онлайн
                    </h4>
                    <p className="text-[8px] text-text-secondary">
                      {onlineCount} из {participantsCount} в системе
                    </p>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 shrink-0 rounded-full bg-accent-primary" />
              <h2 className="text-xs font-black uppercase tracking-widest text-text-muted">
                Организация
              </h2>
            </div>
            <h3 className="text-sm font-black uppercase text-text-primary">Центр управления</h3>
            <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-text-muted">
              <Link
                href={ROUTES.brand.strategyOverview}
                className="transition-colors hover:text-accent-primary"
              >
                Обзор
              </Link>
              <span className="text-text-muted">›</span>
              <span className="text-accent-primary">Центр управления</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span
              id="org-hub-period-heading"
              className="text-[9px] font-bold uppercase text-text-muted"
            >
              Период:
              {typeof activityPeriod === 'object' && (
                <span className="ml-1 font-normal normal-case text-text-secondary">
                  {formatActivityPeriod(activityPeriod)}
                </span>
              )}
            </span>
            <div className="flex h-[26px] items-center gap-1 rounded-md border border-border-default bg-bg-surface2 p-0.5 shadow-sm">
              <div
                role="radiogroup"
                aria-labelledby="org-hub-period-heading"
                className="flex items-center gap-1"
              >
                {(['7d', '30d'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={activityPeriod === p}
                    onClick={() => setActivityPeriod(p)}
                    aria-label={p === '7d' ? 'Период: 7 дней' : 'Период: 30 дней'}
                    className={cn(
                      'flex h-[20px] min-h-[20px] items-center rounded-sm px-2.5 text-[9px] font-black uppercase tracking-widest transition-all',
                      activityPeriod === p
                        ? 'bg-white text-text-primary shadow-sm ring-1 ring-border-default'
                        : 'text-text-muted hover:bg-white/50 hover:text-text-secondary'
                    )}
                  >
                    {p === '7d' ? '7 дней' : '30 дней'}
                  </button>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Произвольный период: открыть календарь"
                    className={cn(
                      'flex h-[20px] min-h-[20px] items-center gap-1 rounded-sm px-2.5 text-[9px] font-black uppercase tracking-widest transition-all',
                      typeof activityPeriod === 'object'
                        ? 'bg-white text-text-primary shadow-sm ring-1 ring-border-default'
                        : 'text-text-muted hover:bg-white/50 hover:text-text-secondary'
                    )}
                  >
                    <CalendarIcon className="size-3" aria-hidden /> Календарь
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  aria-label="Календарь: выбор диапазона дат для активности и модулей"
                  className="w-auto rounded-xl border-border-default p-0 shadow-xl"
                >
                  <CalendarComponent
                    mode="range"
                    selected={
                      (typeof activityPeriod === 'object'
                        ? { from: activityPeriod.from, to: activityPeriod.to }
                        : customRange.from
                          ? { from: customRange.from, to: customRange.to ?? customRange.from }
                          : undefined) as DateRange | undefined
                    }
                    onSelect={(range) => {
                      if (range?.from) {
                        setCustomRange(range);
                        const to = range.to ?? range.from;
                        setActivityPeriod({ from: range.from, to });
                      }
                    }}
                    defaultMonth={
                      typeof activityPeriod === 'object' ? activityPeriod.from : new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
