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

export type OrganizationHubHeaderProps = {
  healthLoading: boolean;
  orgProfile: any;
  participantsCount: number;
  onlineCount: number;
  activityPeriod: ActivityPeriod;
  setActivityPeriod: (p: ActivityPeriod) => void;
  customRange: { from?: Date; to?: Date };
  setCustomRange: (r: { from?: Date; to?: Date }) => void;
};

export function OrganizationHubHeader({
  healthLoading,
  orgProfile,
  participantsCount,
  onlineCount,
  activityPeriod,
  setActivityPeriod,
  customRange,
  setCustomRange,
}: OrganizationHubHeaderProps) {
  return (
    <div className="border-border-subtle from-bg-surface2/50 rounded-2xl border bg-gradient-to-br to-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent-primary/15 text-accent-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[9px]">
              Organization Hub
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {healthLoading ? (
              <>
                <div className="bg-bg-surface2 h-6 w-32 animate-pulse rounded" aria-hidden />
                <span className="text-text-muted hidden sm:inline">•</span>
                <div className="bg-bg-surface2 h-6 w-16 animate-pulse rounded" aria-hidden />
                <span className="text-text-muted hidden sm:inline">•</span>
                <div className="bg-bg-surface2 h-6 w-24 animate-pulse rounded" aria-hidden />
                <span className="text-text-muted hidden sm:inline">•</span>
                <div className="bg-bg-surface2 h-6 w-20 animate-pulse rounded" aria-hidden />
              </>
            ) : (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 -mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black transition-colors"
                      aria-label="Профиль организации"
                    >
                      <Building2 className="h-3 w-3" />
                      {orgProfile?.brand?.name ?? 'Syntha HQ'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-accent-primary/15 flex h-8 w-8 items-center justify-center rounded-lg">
                          <Building2 className="text-accent-primary h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-text-primary text-[10px] font-black uppercase">
                            {orgProfile?.brand?.name ?? 'Syntha HQ'}
                          </h4>
                          <p className="text-text-secondary text-[8px]">Организация</p>
                        </div>
                      </div>
                      <div className="text-text-secondary space-y-1.5 text-[9px]">
                        <p>
                          <span className="text-text-secondary font-bold">Юр. лицо:</span>{' '}
                          {orgProfile?.legal?.legal_name ?? 'ООО «Синта Фэшн»'}
                        </p>
                        <p>
                          <span className="text-text-secondary font-bold">ИНН:</span>{' '}
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
                          Профиль бренда <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="text-text-muted hidden sm:inline">•</span>
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
                    className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <h4 className="text-text-primary text-[10px] font-black uppercase">
                        Elite Plan
                      </h4>
                      <p className="text-text-secondary text-[8px]">Подписка</p>
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
                          Подписка и биллинг <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="text-text-muted hidden sm:inline">•</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 -mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black"
                      aria-label={`Команда: ${participantsCount} участников`}
                    >
                      <Users className="h-3 w-3" /> {participantsCount} участников
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                  >
                    <h4 className="text-text-primary text-[10px] font-black uppercase">Команда</h4>
                    <p className="text-text-secondary text-[8px]">{participantsCount} участников</p>
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
                        Команда и активность <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </PopoverContent>
                </Popover>
                <span className="text-text-muted hidden sm:inline">•</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      aria-label={`Сейчас онлайн: ${onlineCount} из ${participantsCount}`}
                    >
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                      {onlineCount} онлайн
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                  >
                    <h4 className="text-text-primary text-[10px] font-black uppercase">
                      Сейчас онлайн
                    </h4>
                    <p className="text-text-secondary text-[8px]">
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
              <div className="bg-accent-primary h-3.5 w-1 shrink-0 rounded-full" />
              <h2 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Организация
              </h2>
            </div>
            <h3 className="text-text-primary text-sm font-black uppercase">Центр управления</h3>
            <div className="text-text-muted flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
              <Link
                href={ROUTES.brand.strategyOverview}
                className="hover:text-accent-primary transition-colors"
              >
                Обзор
              </Link>
              <span className="text-text-muted">›</span>
              <span className="text-accent-primary">Центр управления</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="text-text-muted text-[9px] font-bold uppercase">
              Период:
              {typeof activityPeriod === 'object' && (
                <span className="text-text-secondary ml-1 font-normal normal-case">
                  {formatActivityPeriod(activityPeriod)}
                </span>
              )}
            </span>
            <div className="bg-bg-surface2 border-border-default flex h-[26px] items-center gap-1 rounded-[4px] border p-0.5 shadow-sm">
              {(['7d', '30d'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivityPeriod(p)}
                  aria-label={p === '7d' ? 'Период: 7 дней' : 'Период: 30 дней'}
                  aria-pressed={activityPeriod === p}
                  className={cn(
                    'flex h-[20px] min-h-[20px] items-center rounded-[2px] px-2.5 text-[9px] font-black uppercase tracking-widest transition-all',
                    activityPeriod === p
                      ? 'text-text-primary ring-border-default bg-white shadow-sm ring-1'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/50'
                  )}
                >
                  {p === '7d' ? '7 дней' : '30 дней'}
                </button>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Выбрать период по календарю"
                    aria-expanded={typeof activityPeriod === 'object'}
                    className={cn(
                      'flex h-[20px] min-h-[20px] items-center gap-1 rounded-[2px] px-2.5 text-[9px] font-black uppercase tracking-widest transition-all',
                      typeof activityPeriod === 'object'
                        ? 'text-text-primary ring-border-default bg-white shadow-sm ring-1'
                        : 'text-text-muted hover:text-text-secondary hover:bg-white/50'
                    )}
                  >
                    <CalendarIcon className="h-3 w-3" /> Календарь
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="border-border-default w-auto rounded-xl p-0 shadow-xl"
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
