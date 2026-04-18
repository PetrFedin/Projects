'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Apple,
  ArrowRight,
  Camera,
  Chrome,
  Gift,
  Shirt,
  Sparkles,
  Star,
  Zap,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMemo, useState } from 'react';
import { DateRange } from '@/components/ui/DateRange';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const loyaltyPlans = {
  base: { name: 'Базовый', icon: Star, color: 'text-gray-600', bg: 'bg-gray-100', next: 'start' },
  start: { name: 'Старт', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100', next: 'comfort' },
  comfort: {
    name: 'Комфорт',
    icon: Gift,
<<<<<<< HEAD
    color: 'text-purple-600',
    bg: 'bg-purple-100',
=======
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/15',
>>>>>>> recover/cabinet-wip-from-stash
    next: 'premium',
  },
  premium: {
    name: 'Premium',
    icon: Crown,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    next: null,
  },
};

const planTheme = {
  base: {
    border: 'border-gray-200/80',
    gradient: 'from-gray-50 via-background to-background',
    orb: 'bg-gray-200/40',
    accentText: 'text-gray-700',
    accentTextSoft: 'text-gray-600',
  },
  start: {
    border: 'border-blue-200/80',
    gradient: 'from-blue-50 via-background to-background',
    orb: 'bg-blue-200/40',
    accentText: 'text-blue-700',
    accentTextSoft: 'text-blue-600',
  },
  comfort: {
    border: 'border-accent-primary/25',
    gradient: 'from-accent-primary/10 via-background to-background',
    orb: 'bg-accent-primary/25',
    accentText: 'text-accent-primary',
    accentTextSoft: 'text-accent-primary',
  },
  premium: {
    border: 'border-yellow-200/80',
    gradient: 'from-amber-50 via-background to-background',
    orb: 'bg-yellow-200/40',
    accentText: 'text-amber-800',
    accentTextSoft: 'text-yellow-700',
  },
} as const;

const planBenefits = {
  base: { cashback: '2%', pointsRate: '1:1', validity: '12 мес' },
  start: { cashback: '3%', pointsRate: '1:1', validity: '12 мес' },
  comfort: { cashback: '4%', pointsRate: '1:1', validity: '12 мес' },
  premium: { cashback: '5%', pointsRate: '1:1', validity: '∞' },
} as const;

type LoyaltyTx = {
  id: string;
  date: string; // ISO
  title: string;
  amount: number; // + начисление, - списание
  bucket: 'qualifying' | 'nonQualifying' | 'mixed';
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function cardNumberFromIssuedAt(d: Date) {
  const year = String(d.getFullYear()).padStart(4, '0');
  const monthDay = `${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
  const hourMin = `${pad2(d.getHours())}${pad2(d.getMinutes())}`;
  return { raw: `${year}${monthDay}${hourMin}`, parts: [year, monthDay, hourMin] as const };
}

export default function LoyaltyCard() {
  const { user } = useAuth();
  const currentPlan = user?.loyaltyPlan || 'base';
  const breakdown = user?.loyaltyPointsBreakdown;
  const qualifying = breakdown?.qualifying ?? null;
  const nonQualifying = breakdown?.nonQualifying ?? null;
  const totalPoints =
    qualifying !== null && nonQualifying !== null
      ? qualifying + nonQualifying
      : user?.loyaltyPoints || 0;
  const planInfo = loyaltyPlans[currentPlan];
  const PlanIcon = planInfo.icon;
  const theme = planTheme[currentPlan];
  const displayName = user?.displayName || 'Пользователь';
  const endDateRaw: string | undefined = user?.subscription?.endDate;
  const endDateFormatted = endDateRaw
    ? format(new Date(endDateRaw), 'd MMMM yyyy', { locale: ru })
    : '—';
  const benefits = planBenefits[currentPlan];
  const hasArAccess = currentPlan === 'comfort' || currentPlan === 'premium';
  const hasWithWhatToWear = currentPlan === 'comfort' || currentPlan === 'premium';

  const [txOpen, setTxOpen] = useState(false);
  const [txRange, setTxRange] = useState<{ from?: string; to?: string }>({});

  const issuedAt = user?.loyaltyCardIssuedAt
    ? new Date(user.loyaltyCardIssuedAt)
    : user?.subscription?.startDate
      ? new Date(`${user.subscription.startDate}T09:00:00`)
      : new Date();
  const cardNumber = cardNumberFromIssuedAt(issuedAt);

<<<<<<< HEAD
  const transactions: LoyaltyTx[] = [
    // Qualifying (purchases)
    {
      id: 'q1',
      date: '2025-12-18T10:30:00Z',
      title: 'Кэшбэк за покупку (заказ #1042)',
      amount: 3800,
      bucket: 'qualifying',
    },
    {
      id: 'q2',
      date: '2025-11-29T15:10:00Z',
      title: 'Кэшбэк за покупку (заказ #1011)',
      amount: 5200,
      bucket: 'qualifying',
    },
    {
      id: 'q3',
      date: '2025-10-03T09:05:00Z',
      title: 'Кэшбэк за покупку (заказ #998)',
      amount: 4450,
      bucket: 'qualifying',
    },
    // Non-qualifying (activity)
    {
      id: 'n1',
      date: '2025-12-25T08:00:00Z',
      title: 'Ежедневная активность',
      amount: 400,
      bucket: 'nonQualifying',
    },
    {
      id: 'n2',
      date: '2025-12-12T12:10:00Z',
      title: 'Создание лукборда',
      amount: 700,
      bucket: 'nonQualifying',
    },
    {
      id: 'n3',
      date: '2025-11-20T13:20:00Z',
      title: 'Отзывы и лайки',
      amount: 900,
      bucket: 'nonQualifying',
    },
    // Spend / expiration examples
    // Spend is always split 75/25, qualifying first
    {
      id: 's1',
      date: '2025-12-28T17:40:00Z',
      title: 'Списание при оплате части заказа бонусами',
      amount: -1200,
      bucket: 'mixed',
    },
    {
      id: 'e1',
      date: '2025-11-30T00:00:00Z',
      title: 'Сгорание неквалификационных баллов (истёк срок)',
      amount: -600,
      bucket: 'nonQualifying',
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
=======
  const transactions: LoyaltyTx[] = (
    [
      // Qualifying (purchases)
      {
        id: 'q1',
        date: '2025-12-18T10:30:00Z',
        title: 'Кэшбэк за покупку (заказ #1042)',
        amount: 3800,
        bucket: 'qualifying' as const,
      },
      {
        id: 'q2',
        date: '2025-11-29T15:10:00Z',
        title: 'Кэшбэк за покупку (заказ #1011)',
        amount: 5200,
        bucket: 'qualifying' as const,
      },
      {
        id: 'q3',
        date: '2025-10-03T09:05:00Z',
        title: 'Кэшбэк за покупку (заказ #998)',
        amount: 4450,
        bucket: 'qualifying' as const,
      },
      // Non-qualifying (activity)
      {
        id: 'n1',
        date: '2025-12-25T08:00:00Z',
        title: 'Ежедневная активность',
        amount: 400,
        bucket: 'nonQualifying' as const,
      },
      {
        id: 'n2',
        date: '2025-12-12T12:10:00Z',
        title: 'Создание лукборда',
        amount: 700,
        bucket: 'nonQualifying' as const,
      },
      {
        id: 'n3',
        date: '2025-11-20T13:20:00Z',
        title: 'Отзывы и лайки',
        amount: 900,
        bucket: 'nonQualifying' as const,
      },
      // Spend / expiration examples
      {
        id: 's1',
        date: '2025-12-28T17:40:00Z',
        title: 'Списание при оплате части заказа бонусами',
        amount: -1200,
        bucket: 'mixed' as const,
      },
      {
        id: 'e1',
        date: '2025-11-30T00:00:00Z',
        title: 'Сгорание неквалификационных баллов (истёк срок)',
        amount: -600,
        bucket: 'nonQualifying' as const,
      },
    ] satisfies LoyaltyTx[]
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
>>>>>>> recover/cabinet-wip-from-stash

  const splitSpend = (total: number) => {
    const abs = Math.abs(total);
    const qual = Math.round(abs * 0.75);
    const non = abs - qual;
    // priority: qualify first, then non-qual
    return { qualifying: -qual, nonQualifying: -non };
  };

  const expandedTransactions = transactions.flatMap((t) => {
    if (t.bucket !== 'mixed') return [t];
    const parts = splitSpend(t.amount);
    return [
      {
        ...t,
        id: `${t.id}-q`,
        amount: parts.qualifying,
        bucket: 'qualifying' as const,
        title: `${t.title} (75% квалиф.)`,
      },
      {
        ...t,
        id: `${t.id}-n`,
        amount: parts.nonQualifying,
        bucket: 'nonQualifying' as const,
        title: `${t.title} (25% неквалиф.)`,
      },
    ] as LoyaltyTx[];
  });

  const inRange = (iso: string) => {
    const d = new Date(iso);
    // Use UTC bounds to match transaction ISO timestamps (ending with Z)
    const from = txRange.from ? new Date(`${txRange.from}T00:00:00Z`) : null;
    const to = txRange.to ? new Date(`${txRange.to}T23:59:59Z`) : null;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  };
  const filteredTransactions = useMemo(
    () => expandedTransactions.filter((t) => inRange(t.date)),
    [expandedTransactions, txRange.from, txRange.to]
  );
  const periodTotals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.bucket === 'qualifying') acc.qual += t.amount;
        if (t.bucket === 'nonQualifying') acc.non += t.amount;
        acc.net += t.amount;
        return acc;
      },
      { qual: 0, non: 0, net: 0 }
    );
  }, [filteredTransactions]);

  // Calculate progress to next level
  const pointsInCurrentLevel = totalPoints % 2000;
  const progress = (pointsInCurrentLevel / 2000) * 100;
  const pointsToNext = 2000 - pointsInCurrentLevel;
  const nextPlan = planInfo.next ? loyaltyPlans[planInfo.next as keyof typeof loyaltyPlans] : null;

  return (
    <Card className={cn('relative overflow-hidden border', 'border-border/60', 'bg-background')}>
      <CardContent className="relative p-4">
        <div className="flex flex-col items-stretch gap-3 md:flex-row">
          {/* Left: physical card + wallet buttons */}
          {/* Make card closer to credit-card proportions and ~20% wider on desktop */}
          <div className="w-full shrink-0 space-y-2 md:w-[552px]">
            <Link
              href="/loyalty"
              className={cn(
                'relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'border-border/60',
                theme.gradient,
                currentPlan === 'premium' && 'syntha-premium-wave'
              )}
              aria-label="Открыть лояльность"
              title="Лояльность"
              style={{ aspectRatio: '1.586 / 1' }}
            >
              <div
                className={cn(
                  'absolute right-0 top-0 -mr-14 -mt-14 h-28 w-28 rounded-full blur-2xl',
                  theme.orb
                )}
              />
              <div
                className={cn(
                  'absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full blur-xl',
                  theme.orb
                )}
              />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Syntha
                    </div>
                    <div className={cn('mt-1 text-sm font-semibold', theme.accentText)}>
                      Bonus Card
                    </div>
                  </div>
                  <div
                    className={cn(
                      'rounded-xl border bg-background/60 p-2 backdrop-blur',
                      'border-border/60'
                    )}
                  >
                    {/* Rotate 360° around its axis on hover */}
                    <PlanIcon
                      className={cn(
                        'h-5 w-5 transition-transform duration-700 ease-in-out hover:rotate-[360deg]',
                        planInfo.color
                      )}
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Владелец
                  </div>
                  <div
                    className={cn(
                      'truncate font-headline text-sm font-bold md:text-base',
                      theme.accentText
                    )}
                  >
                    {displayName}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className={cn('bg-background/60', theme.accentTextSoft, 'border-border/60')}
                    >
                      {planInfo.name}
                    </Badge>
                    <div className={cn('font-mono text-sm font-semibold', theme.accentTextSoft)}>
                      {cardNumber.parts.join(' ')}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => alert('MVP: добавление в Apple Pay будет реализовано позже')}
                className="justify-center"
              >
                <Apple className="mr-2 h-4 w-4" />
                Добавить в Apple Pay
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => alert('MVP: добавление в Google Pay будет реализовано позже')}
                className="justify-center"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Добавить в Google Pay
              </Button>
            </div>
          </div>

          {/* Right: info panel */}
          {/* Fill remaining width to avoid empty right edge */}
          <div className="flex w-full min-w-0 flex-1 flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Подписка</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge className={cn('border', 'border-border/60')} variant="secondary">
                      <PlanIcon className="mr-1.5 h-3.5 w-3.5" />
                      {planInfo.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Активна до:{' '}
                      <span className="font-medium text-foreground">{endDateFormatted}</span>
                    </span>
                  </div>
                </div>
                <Link
                  href="/loyalty?renew=1"
                  className="mt-[22px] inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="relative after:pointer-events-none after:absolute after:inset-[-6px] after:animate-pulse after:rounded-lg after:ring-2 after:ring-accent/15 after:content-['']" />
                  Продлить <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Баллы</div>
                <Dialog open={txOpen} onOpenChange={setTxOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'group -mx-1 w-full rounded-md px-1 py-1 text-left transition-colors hover:bg-muted/40',
                        'focus:outline-none focus:ring-1 focus:ring-border/60 focus:ring-offset-2'
                      )}
                      aria-label="Открыть историю начислений и списаний"
                    >
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn('text-base font-bold leading-tight', theme.accentText)}
                            >
                              {totalPoints.toLocaleString('ru-RU')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-left">
                            <div className="text-sm">
                              Всего = квалиф. + неквалиф. (нажмите, чтобы посмотреть историю)
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>История баллов</DialogTitle>
                      <DialogDescription>
                        Начисления и списания. Неквалификационные баллы могут сгорать согласно
                        правилам программы.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">Всего</div>
                        <div className="text-sm font-bold">
                          {totalPoints.toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">Квалификационные</div>
                        <div className="text-sm font-bold">
                          {qualifying === null ? '—' : qualifying.toLocaleString('ru-RU')}
                        </div>
                        <div className="mt-1 text-[11px] font-medium text-green-600">
                          Не сгорают
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">Неквалификационные</div>
                        <div className="text-sm font-bold">
                          {nonQualifying === null ? '—' : nonQualifying.toLocaleString('ru-RU')}
                        </div>
                        <div className="mt-1 text-[11px] font-medium text-red-600">
                          Могут сгорать
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="text-sm font-medium">Период</div>
                      <DateRange from={txRange.from} to={txRange.to} onChange={setTxRange} />
                      {(txRange.from || txRange.to) && (
                        <Button variant="outline" size="sm" onClick={() => setTxRange({})}>
                          Сбросить
                        </Button>
                      )}
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto overscroll-contain rounded-lg border">
                      <div className="grid grid-cols-[140px,1fr,120px] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">
                        <div>Дата</div>
                        <div>Статья</div>
                        <div className="text-right">Баллы</div>
                      </div>
                      <div className="divide-y">
                        {filteredTransactions.map((t) => {
                          const isPlus = t.amount >= 0;
                          const amountText = `${isPlus ? '+' : ''}${t.amount.toLocaleString('ru-RU')}`;
                          return (
                            <div
                              key={t.id}
                              className="grid grid-cols-[140px,1fr,120px] gap-3 px-4 py-3 text-sm"
                            >
                              <div className="text-muted-foreground">
                                {format(new Date(t.date), 'd MMM yyyy', { locale: ru })}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-medium">{t.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {t.bucket === 'qualifying'
                                    ? 'Квалификационные'
                                    : 'Неквалификационные'}
                                </div>
                              </div>
                              <div
                                className={cn(
                                  'text-right font-semibold',
                                  isPlus ? 'text-green-600' : 'text-red-600'
                                )}
                              >
                                {amountText}
                              </div>
                            </div>
                          );
                        })}
                        {filteredTransactions.length === 0 && (
                          <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                            За выбранный период операций нет.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">За период • итого</div>
                        <div
                          className={cn(
                            'text-base font-bold',
                            periodTotals.net >= 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {periodTotals.net >= 0 ? '+' : ''}
                          {periodTotals.net.toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">За период • квалиф.</div>
                        <div
                          className={cn(
                            'text-base font-bold',
                            periodTotals.qual >= 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {periodTotals.qual >= 0 ? '+' : ''}
                          {periodTotals.qual.toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">За период • неквалиф.</div>
                        <div
                          className={cn(
                            'text-base font-bold',
                            periodTotals.non >= 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {periodTotals.non >= 0 ? '+' : ''}
                          {periodTotals.non.toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {nextPlan && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">До уровня “{nextPlan.name}”</span>
                    <span className="font-semibold">{pointsToNext} баллов</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="cursor-help rounded-lg border border-border/60 p-3 text-center">
                      <div className="text-xs text-muted-foreground">Кэшбэк</div>
                      <div className={cn('text-base font-bold', theme.accentTextSoft)}>
                        {benefits.cashback}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-left">
                    Процент бонусов, который возвращается от суммы покупок. Начисляется после
                    подтверждения заказа.
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="cursor-help rounded-lg border border-border/60 p-3 text-center">
                      <div className="text-xs text-muted-foreground">Балл</div>
                      <div className={cn('text-base font-bold', theme.accentTextSoft)}>
                        {benefits.pointsRate}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-left">
                    Соотношение начисления баллов: 1:1 — условно 1 бонусный балл за 1 ₽ покупок.
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="cursor-help rounded-lg border border-border/60 p-3 text-center">
                      <div className="text-xs text-muted-foreground">Срок</div>
                      <div className={cn('text-base font-bold', theme.accentTextSoft)}>
                        {benefits.validity}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-left">
                    Срок действия преимуществ тарифа. Квалификационные баллы не сгорают,
                    неквалификационные могут сгорать по правилам программы.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {qualifying !== null && nonQualifying !== null && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/60 p-4">
                  <div className="text-xs text-muted-foreground">Квалификационные</div>
                  <div className={cn('mt-1 text-sm font-bold', theme.accentText)}>
                    {qualifying.toLocaleString('ru-RU')}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">за покупки •</div>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <div className="text-xs text-muted-foreground">Неквалификационные</div>
                  <div className={cn('mt-1 text-sm font-bold', theme.accentText)}>
                    {nonQualifying.toLocaleString('ru-RU')}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">за активности •</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <TooltipProvider>
                <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-muted-foreground">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center">
                        <Sparkles className={cn('h-4 w-4', theme.accentTextSoft)} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">AI активен</TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn('inline-flex items-center', hasArAccess ? '' : 'opacity-40')}
                      >
                        <Camera
                          className={cn(
                            'h-4 w-4',
                            hasArAccess ? theme.accentTextSoft : 'text-muted-foreground'
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      AR-примерка {hasArAccess ? 'активен' : 'недоступно'}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'inline-flex items-center',
                          hasWithWhatToWear ? '' : 'opacity-40'
                        )}
                      >
                        <Shirt
                          className={cn(
                            'h-4 w-4',
                            hasWithWhatToWear ? theme.accentTextSoft : 'text-muted-foreground'
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      С чем носить? {hasWithWhatToWear ? 'активен' : 'недоступно'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <Link
                href="/loyalty"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Подробнее</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
