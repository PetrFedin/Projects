'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Users,
  Brain,
  Award,
  Zap,
  ChevronRight,
  History,
  Crown,
  Medal,
  Timer,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MOCK_ACHIEVEMENTS,
  MOCK_LEADERBOARD,
  MOCK_CHALLENGES,
  MOCK_STAFF_GAMIFICATION,
} from '@/lib/logic/gamification-utils';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
import Link from 'next/link';
=======
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fastApiService } from '@/lib/fastapi-service';

const iconMap: Record<string, any> = {
  Trophy,
  Star,
  Brain,
  Users,
  TrendingUp,
  Target,
  Award,
  Zap,
};

export default function StaffGamificationPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'achievements'>(
    'leaderboard'
  );
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fastApiService.getLeaderboard('BRAND-XYZ');
        if (data && data.length > 0) {
          setLeaderboardData(data);
        } else {
          setLeaderboardData(MOCK_LEADERBOARD);
        }
      } catch (e) {
        console.error('Failed to load leaderboard from FastAPI:', e);
        setLeaderboardData(MOCK_LEADERBOARD);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
<<<<<<< HEAD
    <>
      <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
        <header className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Link href="/shop" className="transition-colors hover:text-indigo-600">
                Магазин
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-indigo-600">Staff Gamification</span>
            </div>
            <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900">
              Мотивация & Награды
            </h1>
            <p className="text-[13px] font-medium text-slate-500">
              Система геймификации персонала Syntha Retail.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase leading-none tracking-wider text-indigo-400">
                  Ваш Баланс
                </p>
                <p className="text-[13px] font-bold text-indigo-900">
                  {MOCK_STAFF_GAMIFICATION.totalPoints} <span className="text-[10px]">SP</span>
                </p>
              </div>
            </Card>
            <Button className="h-8 rounded-lg bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-indigo-600">
              Магазин Бонусов
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Left Column: Personal Profile & Achievements */}
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
              <CardHeader className="group relative overflow-hidden bg-slate-900 p-4 text-white">
                <div className="absolute right-0 top-0 p-4 opacity-[0.05] transition-transform duration-700 group-hover:scale-110">
                  <Trophy className="h-24 w-24" />
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white/20 shadow-xl">
                    <AvatarImage src={MOCK_LEADERBOARD[0].avatar} />
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold tracking-tight">Анна Кузнецова</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Уровень {MOCK_STAFF_GAMIFICATION.level}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 mt-5 space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                    <span>До уровня {MOCK_STAFF_GAMIFICATION.level + 1}</span>
                    <span>{MOCK_STAFF_GAMIFICATION.nextLevelProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                    <div
                      className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                      style={{ width: `${MOCK_STAFF_GAMIFICATION.nextLevelProgress}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="group/stat rounded-xl border border-slate-100 bg-slate-50 p-3.5 shadow-inner">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover/stat:text-slate-500">
                      Рейтинг
                    </p>
                    <p className="text-base font-bold tracking-tight text-slate-900">
                      #1 <span className="ml-1 text-[10px] uppercase text-emerald-600">Top</span>
                    </p>
                  </div>
                  <div className="group/stat rounded-xl border border-slate-100 bg-slate-50 p-3.5 shadow-inner">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover/stat:text-slate-500">
                      Сделок
                    </p>
                    <p className="text-base font-bold tracking-tight text-slate-900">
                      124 <span className="ml-1 text-[10px] uppercase text-indigo-600">Units</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Award className="h-3.5 w-3.5" /> Последние Награды
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {MOCK_STAFF_GAMIFICATION.achievements.map((ach) => {
                      const Icon = iconMap[ach.icon] || Trophy;
                      return (
                        <div
                          key={ach.id}
                          className="group relative flex aspect-square cursor-help items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:border-indigo-100 hover:bg-indigo-50"
                          title={ach.title}
                        >
                          <Icon className="h-6 w-6 text-slate-400 transition-transform group-hover:scale-110 group-hover:text-indigo-600" />
                          <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-4">
                  <h4 className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <History className="h-3.5 w-3.5" /> История Активности
                  </h4>
                  <div className="space-y-3">
                    {MOCK_STAFF_GAMIFICATION.history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition-all hover:bg-white hover:shadow-sm"
                      >
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold leading-tight text-slate-700">
                            {h.action}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            {h.date}
                          </p>
                        </div>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600">
                          +{h.points} SP
                        </span>
=======
    <RegistryPageShell className="max-w-6xl space-y-6 duration-700 animate-in fade-in">
      <header className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="text-text-muted flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
            <Link href={ROUTES.shop.home} className="hover:text-accent-primary transition-colors">
              Магазин
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-primary">Staff Gamification</span>
          </div>
          <h1 className="text-text-primary text-sm font-bold uppercase tracking-tight">
            Мотивация & Награды
          </h1>
          <p className="text-text-secondary text-[13px] font-medium">
            Система геймификации персонала Syntha Retail.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="border-accent-primary/20 bg-accent-primary/10 flex items-center gap-3 rounded-xl border px-3 py-1.5 shadow-sm">
            <div className="bg-accent-primary flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-md">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-accent-primary text-[8px] font-bold uppercase leading-none tracking-wider">
                Ваш Баланс
              </p>
              <p className="text-accent-primary text-[13px] font-bold">
                {MOCK_STAFF_GAMIFICATION.totalPoints} <span className="text-[10px]">SP</span>
              </p>
            </div>
          </Card>
          <Button className="bg-text-primary hover:bg-accent-primary h-8 rounded-lg px-4 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-all">
            Магазин Бонусов
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Left Column: Personal Profile & Achievements */}
        <div className="space-y-6">
          <Card className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="bg-text-primary group relative overflow-hidden p-4 text-white">
              <div className="absolute right-0 top-0 p-4 opacity-[0.05] transition-transform duration-700 group-hover:scale-110">
                <Trophy className="h-24 w-24" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/20 shadow-xl">
                  <AvatarImage src={MOCK_LEADERBOARD[0].avatar} />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold tracking-tight">Анна Кузнецова</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Уровень {MOCK_STAFF_GAMIFICATION.level}
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-5 space-y-2">
                <div className="text-accent-primary flex justify-between text-[9px] font-bold uppercase tracking-wider">
                  <span>До уровня {MOCK_STAFF_GAMIFICATION.level + 1}</span>
                  <span>{MOCK_STAFF_GAMIFICATION.nextLevelProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                  <div
                    className="bg-accent-primary h-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    style={{ width: `${MOCK_STAFF_GAMIFICATION.nextLevelProgress}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-surface2 border-border-subtle group/stat rounded-xl border p-3.5 shadow-inner">
                  <p className="text-text-muted group-hover/stat:text-text-secondary mb-1 text-[9px] font-bold uppercase tracking-wider transition-colors">
                    Рейтинг
                  </p>
                  <p className="text-text-primary text-base font-bold tracking-tight">
                    #1 <span className="ml-1 text-[10px] uppercase text-emerald-600">Top</span>
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle group/stat rounded-xl border p-3.5 shadow-inner">
                  <p className="text-text-muted group-hover/stat:text-text-secondary mb-1 text-[9px] font-bold uppercase tracking-wider transition-colors">
                    Сделок
                  </p>
                  <p className="text-text-primary text-base font-bold tracking-tight">
                    124{' '}
                    <span className="text-accent-primary ml-1 text-[10px] uppercase">Units</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-text-muted flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider">
                  <Award className="h-3.5 w-3.5" /> Последние Награды
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_STAFF_GAMIFICATION.achievements.map((ach) => {
                    const Icon = iconMap[ach.icon] || Trophy;
                    return (
                      <div
                        key={ach.id}
                        className="bg-bg-surface2 border-border-subtle hover:bg-accent-primary/10 hover:border-accent-primary/20 group relative flex aspect-square cursor-help items-center justify-center rounded-xl border shadow-sm transition-all"
                        title={ach.title}
                      >
                        <Icon className="text-text-muted group-hover:text-accent-primary h-6 w-6 transition-transform group-hover:scale-110" />
                        <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center & Right Column: Leaderboard, Challenges */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="w-full"
            >
              <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
                <TabsList className="h-8 gap-1 bg-transparent p-0">
                  <TabsTrigger
                    value="leaderboard"
                    className="h-7 rounded-lg px-6 text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                  >
                    Рейтинг
                  </TabsTrigger>
                  <TabsTrigger
                    value="challenges"
                    className="h-7 rounded-lg px-6 text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                  >
                    Челленджи
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="h-7 rounded-lg px-6 text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                  >
                    Награды
                  </TabsTrigger>
                </TabsList>
                <div className="hidden items-center gap-2 px-3 text-[9px] font-bold uppercase text-slate-400 md:flex">
                  <Timer className="h-3 w-3" /> Сезон:{' '}
                  <span className="text-rose-500">14 дней</span>
                </div>
              </div>

              <TabsContent value="leaderboard">
                <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-500 animate-in fade-in hover:shadow-md">
                  <div className="divide-y divide-slate-50">
                    {leaderboardData.map((entry, i) => (
                      <div
                        key={entry.id || entry.staff_id}
                        className="group flex items-center gap-3 p-4 transition-colors hover:bg-slate-50/50"
                      >
                        <div className="flex w-8 flex-col items-center justify-center">
                          {i === 0 ? (
                            <Crown className="h-4.5 w-4.5 mb-0.5 text-amber-500" />
                          ) : (
                            <span className="text-[15px] font-bold uppercase tracking-tight text-slate-300">
                              #{i + 1}
                            </span>
                          )}
                          <div
                            className={cn(
                              'mt-1 h-1.5 w-1.5 rounded-full',
                              entry.trend === 'up' || entry.points > 1000
                                ? 'animate-pulse bg-emerald-500'
                                : entry.trend === 'down'
                                  ? 'bg-rose-500'
                                  : 'bg-slate-300'
                            )}
                          />
                        </div>

                        <Avatar className="h-10 w-10 border-2 border-white shadow-md transition-transform group-hover:scale-105">
                          <AvatarImage
                            src={entry.avatar || `https://i.pravatar.cc/150?u=${entry.staff_id}`}
                          />
                          <AvatarFallback className="text-[10px] font-bold">
                            {(entry.name || entry.staff_id).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-[13px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                            {entry.name || entry.staff_id}
                          </h4>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {entry.position || entry.rank_title}
                          </p>
                        </div>

                        <div className="hidden border-x border-slate-50 px-5 text-right md:block">
                          <p className="mb-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Продажи
                          </p>
                          <p className="text-[13px] font-bold tabular-nums text-slate-700">
                            {(entry.salesVolume || entry.sales_count * 12000).toLocaleString(
                              'ru-RU'
                            )}{' '}
                            ₽
                          </p>
                        </div>

                        <div className="min-w-[90px] text-right">
                          <p className="mb-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-400">
                            Syntha Points
                          </p>
                          <p className="text-sm font-bold tabular-nums text-indigo-600">
                            {entry.points}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="challenges">
                <div className="grid grid-cols-1 gap-3 duration-500 animate-in fade-in slide-in-from-bottom-2 md:grid-cols-2">
                  {MOCK_CHALLENGES.map((challenge) => (
                    <Card
                      key={challenge.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="absolute -bottom-4 -right-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
                        <Target className="h-20 w-20 text-slate-900" />
                      </div>
                      <div className="relative z-10 mb-4 flex items-start justify-between">
                        <Badge
                          className={cn(
                            'h-5 rounded-md border-none px-2 text-[9px] font-bold uppercase tracking-wider shadow-sm',
                            challenge.category === 'personal'
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-emerald-50 text-emerald-600'
                          )}
                        >
                          {challenge.category}
                        </Badge>
                        <div className="text-right">
                          <p className="mb-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Награда
                          </p>
                          <p className="text-[13px] font-bold text-emerald-600">
                            +{challenge.rewardPoints} SP
                          </p>
                        </div>
                      </div>
                      <h4 className="mb-1.5 text-[15px] font-bold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                        {challenge.title}
                      </h4>
                      <p className="mb-5 line-clamp-2 text-[11px] font-medium leading-relaxed text-slate-500">
                        {challenge.description}
                      </p>

                      <div className="relative z-10 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Прогресс</span>
                          <span className="text-slate-600">
                            {challenge.current} / {challenge.target}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                          <div
                            className="h-full bg-indigo-600 transition-all duration-1000"
                            style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-500">
                          <Timer className="h-3 w-3" /> {challenge.endsAt}
                        </div>
                        <Button
                          variant="ghost"
                          className="h-7 rounded-md px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                        >
                          Детали <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <div className="grid grid-cols-2 gap-3 duration-500 animate-in fade-in md:grid-cols-3">
                  {MOCK_ACHIEVEMENTS.map((ach) => {
                    const Icon = iconMap[ach.icon] || Trophy;
                    const isUnlocked = !!ach.unlockedAt;
                    return (
                      <Card
                        key={ach.id}
                        className={cn(
                          'group rounded-xl border p-3 text-center shadow-sm transition-all',
                          isUnlocked
                            ? 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                            : 'border-transparent bg-slate-50 opacity-50 grayscale'
                        )}
                      >
                        <div
                          className={cn(
                            'mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-lg shadow-md transition-transform group-hover:scale-110',
                            isUnlocked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <h5 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 transition-colors group-hover:text-indigo-600">
                          {ach.title}
                        </h5>
                        <p className="mb-4 line-clamp-2 text-[10px] font-medium leading-tight text-slate-400">
                          {ach.description}
                        </p>
                        {isUnlocked ? (
                          <div className="border-t border-slate-50 pt-3">
                            <p className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                              {ach.unlockedAt}
                            </p>
                          </div>
                        ) : (
                          <div className="border-t border-slate-100 pt-3">
                            <p className="text-[9px] font-bold uppercase text-slate-400">
                              Награда: {ach.points} SP
                            </p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
<<<<<<< HEAD
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
=======
              </div>

              <div className="border-border-subtle space-y-4 border-t pt-4">
                <h4 className="text-text-muted flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider">
                  <History className="h-3.5 w-3.5" /> История Активности
                </h4>
                <div className="space-y-3">
                  {MOCK_STAFF_GAMIFICATION.history.map((h) => (
                    <div
                      key={h.id}
                      className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between rounded-lg border p-2.5 transition-all hover:bg-white hover:shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <p className="text-text-primary text-[11px] font-bold leading-tight">
                          {h.action}
                        </p>
                        <p className="text-text-muted text-[9px] font-bold uppercase tracking-wider">
                          {h.date}
                        </p>
                      </div>
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600">
                        +{h.points} SP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right Column: Leaderboard, Challenges */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            {/* cabinetSurface v1 */}
            <div
              className={cn(
                cabinetSurface.groupTabList,
                'mb-6 flex h-auto min-h-10 w-full flex-wrap items-center justify-between gap-2'
              )}
            >
              <TabsList
                className={cn(
                  cabinetSurface.tabsList,
                  'h-auto min-h-8 border-0 bg-transparent p-0 shadow-none'
                )}
              >
                <TabsTrigger
                  value="leaderboard"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:text-accent-primary h-7 px-4 tracking-wider'
                  )}
                >
                  Рейтинг
                </TabsTrigger>
                <TabsTrigger
                  value="challenges"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:text-accent-primary h-7 px-4 tracking-wider'
                  )}
                >
                  Челленджи
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:text-accent-primary h-7 px-4 tracking-wider'
                  )}
                >
                  Награды
                </TabsTrigger>
              </TabsList>
              <div className="text-text-muted hidden items-center gap-2 px-3 text-[9px] font-bold uppercase md:flex">
                <Timer className="h-3 w-3" /> Сезон: <span className="text-rose-500">14 дней</span>
              </div>
            </div>

            <TabsContent value="leaderboard">
              <Card className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-500 animate-in fade-in hover:shadow-md">
                <div className="divide-border-subtle divide-y">
                  {leaderboardData.map((entry, i) => (
                    <div
                      key={entry.id || entry.staff_id}
                      className="hover:bg-bg-surface2/80 group flex items-center gap-3 p-4 transition-colors"
                    >
                      <div className="flex w-8 flex-col items-center justify-center">
                        {i === 0 ? (
                          <Crown className="h-4.5 w-4.5 mb-0.5 text-amber-500" />
                        ) : (
                          <span className="text-text-muted text-[15px] font-bold uppercase tracking-tight">
                            #{i + 1}
                          </span>
                        )}
                        <div
                          className={cn(
                            'mt-1 h-1.5 w-1.5 rounded-full',
                            entry.trend === 'up' || entry.points > 1000
                              ? 'animate-pulse bg-emerald-500'
                              : entry.trend === 'down'
                                ? 'bg-rose-500'
                                : 'bg-border-default'
                          )}
                        />
                      </div>

                      <Avatar className="h-10 w-10 border-2 border-white shadow-md transition-transform group-hover:scale-105">
                        <AvatarImage
                          src={entry.avatar || `https://i.pravatar.cc/150?u=${entry.staff_id}`}
                        />
                        <AvatarFallback className="text-[10px] font-bold">
                          {(entry.name || entry.staff_id).slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-text-primary group-hover:text-accent-primary truncate text-[13px] font-bold tracking-tight transition-colors">
                          {entry.name || entry.staff_id}
                        </h4>
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                          {entry.position || entry.rank_title}
                        </p>
                      </div>

                      <div className="border-border-subtle hidden border-x px-5 text-right md:block">
                        <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase tracking-wider">
                          Продажи
                        </p>
                        <p className="text-text-primary text-[13px] font-bold tabular-nums">
                          {(entry.salesVolume || entry.sales_count * 12000).toLocaleString('ru-RU')}{' '}
                          ₽
                        </p>
                      </div>

                      <div className="min-w-[90px] text-right">
                        <p className="text-accent-primary mb-0.5 text-[8px] font-bold uppercase tracking-wider">
                          Syntha Points
                        </p>
                        <p className="text-accent-primary text-sm font-bold tabular-nums">
                          {entry.points}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="challenges">
              <div className="grid grid-cols-1 gap-3 duration-500 animate-in fade-in slide-in-from-bottom-2 md:grid-cols-2">
                {MOCK_CHALLENGES.map((challenge) => (
                  <Card
                    key={challenge.id}
                    className="border-border-subtle hover:border-accent-primary/30 group relative overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
                      <Target className="text-text-primary h-20 w-20" />
                    </div>
                    <div className="relative z-10 mb-4 flex items-start justify-between">
                      <Badge
                        className={cn(
                          'h-5 rounded-md border-none px-2 text-[9px] font-bold uppercase tracking-wider shadow-sm',
                          challenge.category === 'personal'
                            ? 'bg-accent-primary/10 text-accent-primary'
                            : 'bg-emerald-50 text-emerald-600'
                        )}
                      >
                        {challenge.category}
                      </Badge>
                      <div className="text-right">
                        <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase tracking-wider">
                          Награда
                        </p>
                        <p className="text-[13px] font-bold text-emerald-600">
                          +{challenge.rewardPoints} SP
                        </p>
                      </div>
                    </div>
                    <h4 className="text-text-primary group-hover:text-accent-primary mb-1.5 text-[15px] font-bold uppercase tracking-tight transition-colors">
                      {challenge.title}
                    </h4>
                    <p className="text-text-secondary mb-5 line-clamp-2 text-[11px] font-medium leading-relaxed">
                      {challenge.description}
                    </p>

                    <div className="relative z-10 space-y-2">
                      <div className="text-text-muted flex justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>Прогресс</span>
                        <span className="text-text-secondary">
                          {challenge.current} / {challenge.target}
                        </span>
                      </div>
                      <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full shadow-inner">
                        <div
                          className="bg-accent-primary h-full transition-all duration-1000"
                          style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="border-border-subtle relative z-10 mt-5 flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-500">
                        <Timer className="h-3 w-3" /> {challenge.endsAt}
                      </div>
                      <Button
                        variant="ghost"
                        className="text-text-muted hover:text-accent-primary h-7 rounded-md px-2.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white hover:shadow-sm"
                      >
                        Детали <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid grid-cols-2 gap-3 duration-500 animate-in fade-in md:grid-cols-3">
                {MOCK_ACHIEVEMENTS.map((ach) => {
                  const Icon = iconMap[ach.icon] || Trophy;
                  const isUnlocked = !!ach.unlockedAt;
                  return (
                    <Card
                      key={ach.id}
                      className={cn(
                        'group rounded-xl border p-3 text-center shadow-sm transition-all',
                        isUnlocked
                          ? 'border-border-subtle hover:border-accent-primary/30 bg-white hover:shadow-md'
                          : 'bg-bg-surface2 border-transparent opacity-50 grayscale'
                      )}
                    >
                      <div
                        className={cn(
                          'mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-lg shadow-md transition-transform group-hover:scale-110',
                          isUnlocked
                            ? 'bg-accent-primary text-white'
                            : 'bg-border-subtle text-text-muted'
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h5 className="text-text-primary group-hover:text-accent-primary mb-1 text-[11px] font-bold uppercase tracking-wider transition-colors">
                        {ach.title}
                      </h5>
                      <p className="text-text-muted mb-4 line-clamp-2 text-[10px] font-medium leading-tight">
                        {ach.description}
                      </p>
                      {isUnlocked ? (
                        <div className="border-border-subtle border-t pt-3">
                          <p className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                            {ach.unlockedAt}
                          </p>
                        </div>
                      ) : (
                        <div className="border-border-subtle border-t pt-3">
                          <p className="text-text-muted text-[9px] font-bold uppercase">
                            Награда: {ach.points} SP
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
