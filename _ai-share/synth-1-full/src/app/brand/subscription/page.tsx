'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  ChevronRight,
  Check,
  Zap,
  TrendingUp,
  Download,
  FileText,
  Calendar,
  AlertCircle,
  Crown,
  Activity,
  Database,
  Users,
  Globe,
  Shield,
  Sparkles,
  Calculator,
  Plus,
  Minus,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CollapsibleSection } from '@/components/brand/CollapsibleSection';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getSubscriptionLinks } from '@/lib/data/entity-links';
import {
  SUBSCRIPTION_PLANS,
  getPlanById,
  formatPrice,
  type PlanId,
} from '@/lib/data/subscription-plans';

const CURRENT_PLAN_ID: PlanId = 'elite';
const currentPlan =
  getPlanById(CURRENT_PLAN_ID) ?? SUBSCRIPTION_PLANS[SUBSCRIPTION_PLANS.length - 1];

const USAGE_STATS = [
  { label: 'API Calls', used: 24500, limit: 100000, unit: 'calls', color: 'bg-blue-500' },
  { label: 'Storage', used: 142, limit: 500, unit: 'GB', color: 'bg-emerald-500' },
  { label: 'Team Members', used: 24, limit: null, unit: 'users', color: 'bg-indigo-500' },
  { label: 'B2B Orders', used: 1247, limit: null, unit: 'orders', color: 'bg-amber-500' },
];

const BILLING_HISTORY = [
  {
    date: '01.02.2026',
    amount: currentPlan.priceMonthly,
    status: 'paid',
    invoice: 'INV-2026-02',
    period: 'Февраль 2026',
  },
  {
    date: '01.01.2026',
    amount: currentPlan.priceMonthly,
    status: 'paid',
    invoice: 'INV-2026-01',
    period: 'Январь 2026',
  },
  {
    date: '01.12.2025',
    amount: currentPlan.priceMonthly,
    status: 'paid',
    invoice: 'INV-2025-12',
    period: 'Декабрь 2025',
  },
  {
    date: '01.11.2025',
    amount: currentPlan.priceMonthly,
    status: 'paid',
    invoice: 'INV-2025-11',
    period: 'Ноябрь 2025',
  },
];

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const returnResolved = searchParams.get('returnResolved');
  const [calcApiCalls, setCalcApiCalls] = useState(100);
  const [calcStorage, setCalcStorage] = useState(500);
  const [calcUsers, setCalcUsers] = useState(50);

  const calculatePrice = (): { price: number; plan: typeof currentPlan } => {
    let plan = SUBSCRIPTION_PLANS[0]; // Starter

    if (calcApiCalls > 100 || calcStorage > 500 || calcUsers > 50) {
      plan = getPlanById('elite')!; // Brand ELITE
    } else if (calcApiCalls > 50 || calcStorage > 200 || calcUsers > 20) {
      plan = getPlanById('advanced')!; // Advanced
    } else if (calcApiCalls > 5 || calcStorage > 50 || calcUsers > 5) {
      plan = getPlanById('professional')!; // Professional
    }

    let additional = 0;
    const limits = plan.limits;
    if (limits?.apiCalls && calcApiCalls > limits.apiCalls / 1000) {
      additional += Math.ceil((calcApiCalls - limits.apiCalls / 1000) / 10) * 2000;
    }
    if (limits?.storageGb && calcStorage > limits.storageGb) {
      additional += Math.ceil((calcStorage - limits.storageGb) / 100) * 2000;
    }
    if (limits?.teamMembers && calcUsers > limits.teamMembers) {
      additional += (calcUsers - limits.teamMembers) * 500;
    }

    return { price: plan.priceMonthly + additional, plan };
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 pb-20 md:px-0">
      {returnResolved && (
        <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-2">
          <Link
            href={`/brand/organization?resolved=${encodeURIComponent(returnResolved)}`}
            className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700"
          >
            ← Вернуться в Центр управления
          </Link>
        </div>
      )}
      {/* Control Panel */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
          >
            <Link href="/api/export/billing?format=csv">Экспорт</Link>
          </Button>
          <div className="mx-0.5 h-4 w-px bg-slate-200" />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
          >
            <Link href="/brand/settings">Настройки</Link>
          </Button>
        </div>

        <Button
          variant="default"
          size="sm"
          className="h-7 rounded-lg bg-indigo-600 px-4 text-[7px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
        >
          Изменить план
        </Button>
      </div>

      {/* Current Plan & Quick Actions — одна высота */}
      <div className="mb-6 grid grid-cols-1 items-stretch gap-2 lg:grid-cols-3">
        <div className="flex h-full min-h-0 flex-col lg:col-span-2">
          <CollapsibleSection
            id="subscription-current-plan"
            title="Current Plan"
            barColor="bg-indigo-600"
            className="mb-0 h-full"
            fillHeight
          >
            <Card className="relative mt-2 flex h-full min-h-[160px] flex-col overflow-hidden rounded-xl border-none bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 text-white shadow-sm">
              <div className="absolute right-0 top-0 p-2 opacity-10">
                <Crown className="h-20 w-20" />
              </div>
              <div className="relative z-10 flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <Badge className="h-4 border-none bg-white/20 px-1.5 text-[6px] font-black uppercase text-white">
                      <Sparkles className="mr-1 h-2.5 w-2.5" /> Premium
                    </Badge>
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      {currentPlan.name}
                    </h3>
                    <p className="line-clamp-2 text-[9px] font-medium text-indigo-200">
                      {currentPlan.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-black">
                      {formatPrice(currentPlan.priceMonthly)}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-200">
                      / мес
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
                    <div>
                      <div className="text-[7px] font-black uppercase text-indigo-200">API</div>
                      <div className="text-[10px] font-black">100K/мес</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
                    <div>
                      <div className="text-[7px] font-black uppercase text-indigo-200">Storage</div>
                      <div className="text-[10px] font-black">500 GB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
                    <div>
                      <div className="text-[7px] font-black uppercase text-indigo-200">Team</div>
                      <div className="text-[10px] font-black">Unlimited</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                  <Calendar className="h-4 w-4 shrink-0 text-indigo-300" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[8px] font-black uppercase text-indigo-200">
                      След. списание
                    </div>
                    <div className="text-[11px] font-black">01 марта 2026</div>
                  </div>
                  <Badge className="shrink-0 border-none bg-emerald-500 text-[6px] font-black uppercase text-white">
                    Auto
                  </Badge>
                </div>
              </div>
            </Card>
          </CollapsibleSection>
        </div>

        <div className="flex h-full min-h-0 flex-col">
          <CollapsibleSection
            id="subscription-quick-actions"
            title="Quick Actions"
            barColor="bg-slate-900"
            className="mb-0 h-full"
            fillHeight
          >
            <Card className="group relative mt-2 flex h-full min-h-[160px] flex-col overflow-hidden rounded-xl border-none bg-slate-900 p-3 text-white shadow-sm">
              <div className="absolute right-0 top-0 p-2 opacity-10">
                <CreditCard className="h-16 w-16 text-indigo-400" />
              </div>
              <div className="relative z-10 flex flex-1 flex-col gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-tight">Billing Portal</h3>
                  <p className="text-[9px] font-medium text-slate-400">Счета и оплата</p>
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <Button className="h-6 w-fit min-w-0 justify-start rounded-md border border-white/5 bg-white/5 px-2 text-[7px] font-black uppercase tracking-widest text-white hover:bg-white/10">
                    Сменить карту
                  </Button>
                  <Button className="h-6 w-fit min-w-0 justify-start rounded-md border border-white/5 bg-white/5 px-2 text-[7px] font-black uppercase tracking-widest text-white hover:bg-white/10">
                    Инвойсы (ZIP)
                  </Button>
                  <Button className="h-6 w-fit min-w-0 justify-start rounded-md bg-indigo-600 px-2 text-[7px] font-black uppercase tracking-widest text-white hover:bg-indigo-700">
                    Повысить план
                  </Button>
                </div>
              </div>
            </Card>
          </CollapsibleSection>
        </div>
      </div>

      {/* Usage Statistics */}
      <CollapsibleSection
        id="subscription-usage-stats"
        title="Usage Statistics"
        barColor="bg-emerald-600"
        className="mb-6"
      >
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {USAGE_STATS.map((stat, i) => (
            <Card
              key={i}
              className="rounded-xl border border-none border-slate-100 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {stat.label}
                </h4>
                <Badge
                  variant="outline"
                  className="border-slate-200 text-[7px] font-black text-slate-400"
                >
                  {stat.unit}
                </Badge>
              </div>

              {stat.limit ? (
                <>
                  <div className="mb-2 flex items-end gap-2">
                    <span className="text-sm font-black text-slate-900">
                      {stat.used.toLocaleString('ru-RU')}
                    </span>
                    <span className="mb-1 text-sm font-black text-slate-400">
                      / {stat.limit.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <Progress value={(stat.used / stat.limit) * 100} className="h-2" />
                  <div className="mt-2 text-[8px] font-medium text-slate-400">
                    {Math.round((stat.used / stat.limit) * 100)}% использовано
                  </div>
                </>
              ) : (
                <div className="flex items-end gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {stat.used.toLocaleString('ru-RU')}
                  </span>
                  <span className="mb-1 text-sm font-black text-emerald-600">Безлимит</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      {/* Plan Features */}
      <CollapsibleSection
        id="subscription-plan-features"
        title="Plan Features"
        barColor="bg-blue-600"
        className="mb-6"
      >
        <Card className="mt-2 rounded-xl border border-none border-slate-100 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {currentPlan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-emerald-100">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </CollapsibleSection>

      {/* Pricing Calculator */}
      <CollapsibleSection
        id="subscription-calculator"
        title="Калькулятор стоимости"
        barColor="bg-purple-600"
        className="mb-6"
      >
        <Card className="mt-2 rounded-xl border border-none border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-[9px] font-black uppercase tracking-widest text-slate-700">
                  API Calls
                </Label>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCalcApiCalls(Math.max(0, calcApiCalls - 10))}
                    className="h-8 w-8 rounded-lg"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={calcApiCalls}
                    onChange={(e) => setCalcApiCalls(Number(e.target.value))}
                    className="h-8 w-16 text-center text-xs font-black"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCalcApiCalls(calcApiCalls + 10)}
                    className="h-8 w-8 rounded-lg"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-[9px] font-black uppercase tracking-widest text-slate-700">
                  Storage GB
                </Label>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCalcStorage(Math.max(0, calcStorage - 50))}
                    className="h-8 w-8 rounded-lg"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={calcStorage}
                    onChange={(e) => setCalcStorage(Number(e.target.value))}
                    className="h-8 w-16 text-center text-xs font-black"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCalcStorage(calcStorage + 50)}
                    className="h-8 w-8 rounded-lg"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-20 shrink-0 text-[9px] font-black uppercase tracking-widest text-slate-700">
                  Team
                </Label>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCalcUsers(Math.max(1, calcUsers - 5))}
                    className="h-8 w-8 rounded-lg"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={calcUsers}
                    onChange={(e) => setCalcUsers(Number(e.target.value))}
                    className="h-8 w-16 text-center text-xs font-black"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setCalcUsers(calcUsers + 5)}
                    className="h-8 w-8 rounded-lg"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="rounded-xl border-none bg-white p-3 shadow-lg">
              <div className="mb-2 flex items-start gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <Calculator className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900">
                    {formatPrice(calculatePrice().price)}
                  </div>
                  <p className="text-[9px] font-black uppercase text-purple-600">
                    {calculatePrice().plan.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-[8px] font-bold uppercase text-slate-600">
                {['B2B/B2C безлимит', 'Поддержка 24/7', 'AI-аналитика', 'Маркетплейсы'].map(
                  (f, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-600" />
                      {f}
                    </span>
                  )
                )}
              </div>
              <Button className="mt-2 h-8 w-fit rounded-lg bg-purple-600 px-3 text-[9px] font-black uppercase hover:bg-purple-700">
                Перейти на план
              </Button>
            </Card>
          </div>
        </Card>
      </CollapsibleSection>

      {/* Billing History */}
      <CollapsibleSection
        id="subscription-billing-history"
        title="Billing History"
        barColor="bg-slate-900"
        className="mb-0"
      >
        <Card className="mt-2 rounded-xl border border-none border-slate-100 bg-white p-3 shadow-sm">
          <div className="space-y-1.5">
            {BILLING_HISTORY.map((bill, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 transition-all hover:bg-slate-100"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-900">
                      {bill.period}
                    </span>
                    <Badge className="h-3 border-none bg-emerald-500 px-1 text-[6px] font-black uppercase text-white">
                      Оплачено
                    </Badge>
                    <span className="font-mono text-[8px] text-slate-500">{bill.invoice}</span>
                  </div>
                  <span className="text-[8px] text-slate-500">{bill.date}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-black text-slate-900">
                    {bill.amount.toLocaleString('ru-RU')} ₽
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[7px] font-black uppercase text-slate-400 hover:text-indigo-600"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[8px] font-medium text-slate-400">4 из 12 платежей</span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-fit rounded-lg border-slate-200 px-2 text-[8px] font-black uppercase hover:bg-slate-50"
            >
              Показать все
            </Button>
          </div>
        </Card>
      </CollapsibleSection>

      <RelatedModulesBlock
        links={getSubscriptionLinks()}
        title="Связанные разделы"
        className="mt-6"
      />
    </div>
  );
}
