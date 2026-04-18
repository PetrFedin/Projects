'use client';

import dynamic from 'next/dynamic';
import type { LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { WidgetCard } from '@/components/ui/widget-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Mail,
  MapPin,
  Store,
  TrendingUp,
  Users,
  Globe,
  Download,
  Filter,
  ChevronRight,
  Bot,
  Sparkles,
  ArrowUpRight,
  Target,
  ShieldCheck,
  Heart,
  AlertTriangle,
  CreditCard,
  Activity,
  Landmark,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fmtMoney, fmtNumber } from '@/lib/format';
import { Progress } from '@/components/ui/progress';

const DistributorsContent = dynamic(() => import('@/app/brand/distributors/page'), { ssr: false });
const EngagementContent = dynamic(
  () => import('@/app/brand/b2b/engagement/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const PreOrdersContent = dynamic(
  () => import('@/app/brand/pre-orders/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const CompanyAccountsContent = dynamic(
  () => import('@/app/brand/b2b/company-accounts/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const TerritoryContent = dynamic(
  () => import('@/app/brand/distributor/territory/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const PreOrderQuotaContent = dynamic(
  () => import('@/app/brand/distributor/pre-order-quota/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const CommissionsContent = dynamic(
  () => import('@/app/brand/distributor/commissions/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const LastCallContent = dynamic(() => import('@/app/brand/last-call/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div>,
});
const BopisContent = dynamic(() => import('@/app/brand/bopis/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div>,
});
const InvestingContent = dynamic(
  () => import('@/app/brand/investing/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const DealerCabinetContent = dynamic(
  () => import('@/app/brand/retailers/dealer-cabinet/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const SmartReplenishmentContent = dynamic(
  () => import('@/app/brand/retailers/smart-replenishment/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const OrderListsContent = dynamic(
  () => import('@/app/brand/retailers/order-lists/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const MultiCartContent = dynamic(
  () => import('@/app/brand/retailers/multi-cart/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const RetailersFavoritesContent = dynamic(
  () => import('@/app/brand/retailers/favorites/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const VolumeRulesContent = dynamic(
  () => import('@/app/brand/retailers/volume-rules/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);

/** Вкладки хаба: краткая подпись + расшифровка аббревиатур и контекст при наведении */
const RETAILER_HUB_TABS: { value: string; label: string; hint: string; icon?: LucideIcon }[] = [
  {
    value: 'retailers',
    label: 'Ритейлеры',
    hint: 'Магазины и сети, которые продают ваш бренд конечному покупателю.',
    icon: Store,
  },
  {
    value: 'distributors',
    label: 'Дистрибьюторы',
    hint: 'Оптовые партнёры: закупка крупными партиями и поставка в торговые точки.',
    icon: Share2,
  },
  {
    value: 'engagement',
    label: 'Вовлечённость',
    hint: 'Активность партнёров: визиты шоурума, открытия лайншитов, отклики по кампаниям.',
  },
  {
    value: 'pre-orders',
    label: 'Предзаказ',
    hint: 'Pre-order: заказ коллекции или партии до официальной отгрузки; ранний доступ к ассортименту.',
  },
  {
    value: 'company-accounts',
    label: 'Корп. счета',
    hint: 'Company accounts: единые договор и лимиты для группы юрлиц одной сети.',
  },
  {
    value: 'territory',
    label: 'Территории',
    hint: 'Регионы и эксклюзивы: где партнёр может продавать, без пересечений с другими.',
  },
  {
    value: 'quotas',
    label: 'Квоты',
    hint: 'Лимиты закупки по партнёру, сезону или категории (минимум/максимум объёма).',
  },
  {
    value: 'commissions',
    label: 'Комиссии',
    hint: 'Вознаграждения агентам и дистрибьюторам с продаж или выполнения плана.',
  },
  {
    value: 'last-call',
    label: 'Последний шанс',
    hint: 'Last call: финальная фаза распродажи остатков коллекции до закрытия дропа.',
  },
  {
    value: 'bopis',
    label: 'BOPIS',
    hint: 'Buy Online, Pick Up In Store — клиент заказывает онлайн, забирает заказ в выбранном магазине. Здесь: выдача и возвраты в точке.',
  },
  {
    value: 'investing',
    label: 'Инвестиции',
    hint: 'Инструменты финансирования партнёров или совместных закупок (в т.ч. склад/оборот).',
  },
  {
    value: 'dealer-cabinet',
    label: 'Кабинет дилера',
    hint: 'Личный кабинет дилера: заказы, документы, статусы без доступа к полному бренд-админу.',
  },
  {
    value: 'smart-replenishment',
    label: 'Умное пополнение',
    hint: 'Автоматические рекомендации по дозаказу на основе продаж и остатков.',
  },
  {
    value: 'order-lists',
    label: 'Списки заказов',
    hint: 'Рабочие списки SKU для согласования и переноса в заказ (как черновики закупки).',
  },
  {
    value: 'multi-cart',
    label: 'Несколько корзин',
    hint: 'Multi-cart: отдельные корзины по магазинам, проектам или закупщикам в одном аккаунте.',
  },
  {
    value: 'favorites',
    label: 'Избранное',
    hint: 'Сохранённые бренды и позиции для быстрого доступа партнёра.',
  },
  {
    value: 'volume-rules',
    label: 'Объём и цены',
    hint: 'Правила ценообразования по объёму закупки (ступени скидок, мелкий/крупный опт).',
  },
];

function HubTabTrigger({
  value,
  label,
  hint,
  icon: Icon,
}: {
  value: string;
  label: string;
  hint: string;
  icon?: LucideIcon;
}) {
  const cnTrigger =
    'text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5';
  return (
    <Tooltip delayDuration={350}>
      <TooltipTrigger asChild>
        <TabsTrigger value={value} className={cnTrigger}>
          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
          <span className="max-w-[9rem] truncate sm:max-w-none">{label}</span>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="max-w-[min(320px,92vw)] border-slate-200 bg-white text-left text-[11px] leading-snug shadow-lg"
      >
        <p className="font-bold text-slate-900">{label}</p>
        <p className="mt-1.5 font-normal normal-case tracking-normal text-slate-600">{hint}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function riskLevelRu(level: string): string {
  if (level === 'Low') return 'Низкий риск';
  if (level === 'Medium') return 'Средний риск';
  if (level === 'High') return 'Высокий риск';
  return level;
}

const PARTNER_TYPE_FILTERS = [
  { id: 'ALL', label: 'Все' },
  { id: 'BOUTIQUE', label: 'Бутик' },
  { id: 'DEPT STORE', label: 'Универмаг' },
  { id: 'ONLINE', label: 'Онлайн' },
] as const;

const mockRetailers = [
  {
    id: 'shop1',
    name: 'Podium',
    city: 'Москва',
    type: 'Мультибренд',
    orders: 3,
    totalValue: 2400000,
    logoUrl: 'https://picsum.photos/seed/podium-logo/40/40',
    contractStatus: 'active',
    health: 98,
    creditLimit: 5000000,
    creditUsed: 1200000,
    riskLevel: 'Low',
  },
  {
    id: 'shop2',
    name: 'ЦУМ',
    city: 'Москва',
    type: 'Универмаг',
    orders: 1,
    totalValue: 1200000,
    logoUrl: 'https://i.imgur.com/JMgcWwL.png',
    contractStatus: 'active',
    health: 85,
    creditLimit: 10000000,
    creditUsed: 4500000,
    riskLevel: 'Medium',
  },
  {
    id: 'shop3',
    name: 'Boutique No.7',
    city: 'Санкт-Петербург',
    type: 'Бутик',
    orders: 5,
    totalValue: 3100000,
    logoUrl: 'https://picsum.photos/seed/boutique7-logo/40/40',
    contractStatus: 'pending',
    health: 42,
    creditLimit: 1000000,
    creditUsed: 950000,
    riskLevel: 'High',
  },
];

export default function RetailersPage() {
  const [tab, setTab] = useState('retailers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRetailers = useMemo(() => {
    return mockRetailers.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <TooltipProvider delayDuration={350}>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="h-auto min-h-9 flex-wrap gap-0.5 border border-slate-200 bg-slate-100/80 px-1 py-1">
          {RETAILER_HUB_TABS.map((t) => (
            <HubTabTrigger
              key={t.value}
              value={t.value}
              label={t.label}
              hint={t.hint}
              icon={t.icon}
            />
          ))}
        </TabsList>
        <TabsContent value="retailers" className="mt-4">
          <div className="space-y-6 pb-24">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help border-dashed text-[9px]">
                      B2B
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-[11px] leading-snug">
                    <span className="font-bold">B2B</span> — business-to-business: оптовые продажи и
                    работа с партнёрами, не с конечными покупателями в этом контексте.
                  </TooltipContent>
                </Tooltip>
                <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
                  <Link href={ROUTES.brand.b2bOrders}>Заказы B2B</Link>
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
                  <Link href={ROUTES.brand.production}>Производство</Link>
                </Button>
              </div>

              <div className="flex w-full items-center gap-2 md:w-auto">
                <div className="mr-2 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-slate-300 text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                          Партнёры
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="text-[11px]">
                        Количество подключённых торговых партнёров в этой выборке.
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-[11px] font-bold leading-none text-slate-900">
                      {mockRetailers.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-slate-300 text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                          Охват
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-[11px]">
                        Совокупный объём продаж или закупок партнёрской сети в выбранном периоде
                        (демо-значение).
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-[11px] font-bold leading-none text-rose-600">
                      6.65M ₽
                    </span>
                  </div>
                </div>
                <div className="mx-0.5 h-5 w-[1px] bg-slate-200" />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:bg-slate-50"
                >
                  <Landmark className="h-3 w-3" /> Кредитный портал
                </Button>
                <Button className="h-7 gap-1.5 rounded-lg bg-slate-900 px-3 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-indigo-600">
                  <PlusCircle className="h-3 w-3" /> Пригласить
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* --- ANALYTICAL GRID --- */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  {
                    label: 'Стоимость сети',
                    val: '6.7M ₽',
                    sub: '+8.2%',
                    trend: 'up',
                    icon: Users,
                    bg: 'bg-indigo-50/50',
                    hint: 'Совокупный объём бизнеса с подключёнными ритейлерами (демо).',
                  },
                  {
                    label: 'Средний LTV',
                    val: '2.2M ₽',
                    sub: 'рост',
                    trend: 'up',
                    icon: TrendingUp,
                    bg: 'bg-emerald-50/50',
                    hint: 'LTV (Lifetime Value) — средняя пожизненная ценность партнёра для бренда.',
                  },
                  {
                    label: 'Активные рынки',
                    val: '12',
                    sub: 'мир',
                    trend: 'up',
                    icon: Target,
                    bg: 'bg-blue-50/50',
                    hint: 'Количество географий или сегментов, где сеть активна.',
                  },
                  {
                    label: 'Здоровье сети',
                    val: '84/100',
                    sub: 'норма',
                    trend: 'up',
                    icon: Activity,
                    bg: 'bg-emerald-50/50',
                    hint: 'Индекс платежей, выполнения планов и рисков по партнёрам.',
                  },
                ].map((m, i) => (
                  <Card
                    key={i}
                    className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100"
                  >
                    <div className="mb-2.5 flex items-center justify-between">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-slate-300 text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
                            {m.label}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-[11px] leading-snug">
                          {m.hint}
                        </TooltipContent>
                      </Tooltip>
                      <div
                        className={cn(
                          'rounded-lg border border-slate-200/50 p-1.5 shadow-inner',
                          m.bg
                        )}
                      >
                        <m.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black uppercase tabular-nums leading-none tracking-tighter text-slate-900">
                        {m.val}
                      </span>
                      <span
                        className={cn(
                          'mt-1 flex h-4 items-center rounded px-1.5 text-[9px] font-bold uppercase tracking-widest',
                          m.trend === 'up'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        )}
                      >
                        {m.sub}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
                <div className="mx-auto w-full max-w-4xl space-y-3 xl:col-span-9 xl:max-w-none">
                  {/* --- TOOLBAR --- */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
                    <div className="flex items-center gap-1.5">
                      <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                        <button
                          type="button"
                          className="h-6.5 rounded-md bg-slate-900 px-3 text-[9px] font-bold uppercase text-white shadow-sm transition-all"
                        >
                          Активные
                        </button>
                        <button
                          type="button"
                          className="h-6.5 rounded-md px-3 text-[9px] font-bold uppercase text-slate-400 transition-all hover:bg-slate-50"
                        >
                          Потенциальные
                        </button>
                      </div>
                      <div className="mx-0.5 h-4 w-[1px] bg-slate-200" />
                      <div className="no-scrollbar flex max-w-[300px] overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm md:max-w-none">
                        {PARTNER_TYPE_FILTERS.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            title={
                              t.id === 'ALL'
                                ? 'Все типы точек'
                                : t.id === 'BOUTIQUE'
                                  ? 'Бутики'
                                  : t.id === 'DEPT STORE'
                                    ? 'Department store — крупный универмаг'
                                    : 'Интернет-канал'
                            }
                            className="h-6.5 whitespace-nowrap px-2.5 text-[8px] font-bold uppercase text-slate-400 transition-all hover:text-slate-900"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="Поиск партнёра…"
                          className="h-7 w-32 rounded-lg border-slate-200 bg-white pl-8 text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500 md:w-44"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50"
                      >
                        <Filter className="h-3 w-3 text-slate-400" />
                      </Button>
                    </div>
                  </div>

                  {/* --- PARTNERS TABLE --- */}
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="sticky left-0 z-10 h-9 w-[30%] bg-slate-50/50 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Партнёр
                          </th>
                          <th className="h-9 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help border-b border-dotted border-slate-300">
                                  Риск / индекс
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-[11px]">
                                Оценка риска по кредиту и выполнению обязательств; полоса — условный
                                индекс здоровья связи.
                              </TooltipContent>
                            </Tooltip>
                          </th>
                          <th className="h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Кредитный лимит
                          </th>
                          <th className="h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help border-b border-dotted border-slate-300">
                                  LTV
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-[11px]">
                                LTV (Lifetime Value) — накопленная ценность партнёра: оборот или
                                маржа за период (в таблице — демо).
                              </TooltipContent>
                            </Tooltip>
                          </th>
                          <th className="h-9 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Статус
                          </th>
                          <th
                            className="h-9 w-12 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400"
                            aria-label="Действия"
                          />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredRetailers.map((retailer) => (
                          <tr
                            key={retailer.id}
                            className="group h-12 transition-all hover:bg-slate-50/50"
                          >
                            <td className="sticky left-0 z-10 bg-white px-4 py-2 transition-colors group-hover:bg-slate-50">
                              <Link
                                href={`/brand/retailers/${retailer.id}`}
                                className="block flex items-center gap-2.5"
                              >
                                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200/50 bg-slate-50 p-1 shadow-inner transition-transform group-hover:scale-105">
                                  <Image
                                    src={retailer.logoUrl}
                                    alt={retailer.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                                    {retailer.name}
                                  </p>
                                  <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                    {retailer.type}
                                  </span>
                                </div>
                              </Link>
                            </td>
                            <td className="px-4 py-2">
                              <div className="w-28 space-y-1.5">
                                <div className="flex items-center justify-between text-[7px] font-bold uppercase leading-none tracking-widest">
                                  <span
                                    className={cn(
                                      retailer.riskLevel === 'Low'
                                        ? 'text-emerald-600'
                                        : retailer.riskLevel === 'Medium'
                                          ? 'text-amber-600'
                                          : 'text-rose-600'
                                    )}
                                  >
                                    {riskLevelRu(retailer.riskLevel)}
                                  </span>
                                  <span className="text-slate-900">{retailer.health}%</span>
                                </div>
                                <Progress
                                  value={retailer.health}
                                  className="h-1 border border-slate-200/30 bg-slate-50"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-[11px] font-bold uppercase tabular-nums leading-none tracking-tighter text-slate-900">
                                  {fmtMoney(retailer.creditLimit)}
                                </span>
                                <span className="mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 opacity-60">
                                  Использовано: {fmtMoney(retailer.creditUsed)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <span className="text-[11px] font-bold uppercase tabular-nums leading-none tracking-tighter text-slate-900">
                                {fmtMoney(retailer.totalValue)}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                                  retailer.contractStatus === 'active'
                                    ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                )}
                              >
                                {retailer.contractStatus === 'active'
                                  ? 'По договору'
                                  : 'На согласовании'}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex items-center justify-end opacity-0 transition-all group-hover:opacity-100">
                                <button
                                  type="button"
                                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-slate-100 hover:text-indigo-600"
                                  title="Связаться с партнёром"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
                                  aria-label="Ещё"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                        Показано партнёров: {filteredRetailers.length}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                          disabled
                        >
                          Назад
                        </button>
                        <button
                          type="button"
                          className="h-6 rounded-md border border-slate-200 bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                        >
                          Далее
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 xl:col-span-3">
                  {/* --- CREDIT ALERTS --- */}
                  <Card className="group space-y-3 rounded-xl border border-rose-100 bg-rose-50/30 p-4 transition-all hover:bg-rose-50">
                    <div className="flex items-center gap-2 px-1 text-rose-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <h3 className="text-[10px] font-bold uppercase tracking-widest">
                        Кредитные алерты
                      </h3>
                    </div>
                    <div className="space-y-1.5">
                      <div className="rounded-xl border border-rose-100 bg-white p-2.5 shadow-sm transition-all group-hover:border-rose-200">
                        <p className="text-[9px] font-bold uppercase tracking-tight text-slate-900">
                          Boutique No.7
                        </p>
                        <p className="mt-1 text-[8px] font-bold uppercase leading-none tracking-widest text-rose-600">
                          Достигнуто 95% лимита
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-7 w-full rounded-lg border-rose-200 bg-white text-[9px] font-bold uppercase tracking-widest text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                    >
                      Лимиты
                    </Button>
                  </Card>

                  {/* --- MATCHMAKING AI --- */}
                  <Card className="group relative space-y-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500 bg-blue-600 text-white shadow-lg transition-transform group-hover:scale-105">
                          <Heart className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-blue-300">
                            Подбор партнёров (AI)
                          </span>
                          <p className="text-[11px] font-bold uppercase tracking-tight">
                            Идеи для экспансии
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/10">
                          <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
                            «Найдено 3 ритейлера в Токио. Совпадение с курацией бренда — 94%
                            (демо).»
                          </p>
                        </div>
                        <div className="flex items-center gap-3 px-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 text-[9px] font-bold text-emerald-500 shadow-lg">
                            94%
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                            Индекс совпадения · Япония
                          </span>
                        </div>
                      </div>

                      <Button className="mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-indigo-50 hover:text-indigo-600">
                        Связаться с топом
                      </Button>
                    </div>
                    <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-blue-600 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20" />
                  </Card>

                  {/* --- RELATIONSHIP HEALTH --- */}
                  <Card className="group space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
                    <div className="flex items-center justify-between border-b border-slate-50 px-1 pb-2.5">
                      <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                        <Activity className="h-3.5 w-3.5 text-blue-600" /> Состояние счетов
                      </h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="h-3.5 cursor-help rounded border-dashed border-slate-100 bg-slate-50 px-1.5 text-[7px] font-bold tracking-widest text-slate-400 shadow-sm"
                          >
                            LIVE
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-[11px]">
                          LIVE — потоковые данные (демо): показатели обновляются как при работе в
                          реальном времени.
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        {
                          name: 'Podium',
                          score: 98,
                          status: 'VIP',
                          statusRu: 'VIP',
                          hint: 'VIP — ключевой партнёр с приоритетной поддержкой и объёмами.',
                        },
                        {
                          name: 'ЦУМ',
                          score: 85,
                          status: 'Stable',
                          statusRu: 'Стабильно',
                          hint: 'Стабильный партнёр: платежи и план в норме.',
                        },
                        {
                          name: 'Boutique No.7',
                          score: 42,
                          status: 'At Risk',
                          statusRu: 'Риск',
                          hint: 'Повышенный риск: просрочки, лимит или выполнение плана.',
                        },
                      ].map((account, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-900">
                              {account.name}
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className={cn(
                                    'flex h-3.5 cursor-help items-center rounded border border-transparent px-1 text-[7px] font-bold uppercase tracking-widest',
                                    account.status === 'VIP'
                                      ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                                      : account.status === 'Stable'
                                        ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                        : 'border-rose-100 bg-rose-50 text-rose-600'
                                  )}
                                >
                                  {account.statusRu}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-[11px]">
                                {account.hint}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full border border-slate-200/30 bg-slate-50 shadow-inner">
                            <div
                              className={cn(
                                'h-full transition-all duration-1000',
                                account.score < 50 ? 'bg-rose-500' : 'bg-emerald-500'
                              )}
                              style={{ width: `${account.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                    >
                      Здоровье сети <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="distributors" className="mt-4">
          {tab === 'distributors' && <DistributorsContent />}
        </TabsContent>
        <TabsContent value="engagement" className="mt-4">
          {tab === 'engagement' && <EngagementContent />}
        </TabsContent>
        <TabsContent value="pre-orders" className="mt-4">
          {tab === 'pre-orders' && <PreOrdersContent />}
        </TabsContent>
        <TabsContent value="company-accounts" className="mt-4">
          {tab === 'company-accounts' && <CompanyAccountsContent />}
        </TabsContent>
        <TabsContent value="territory" className="mt-4">
          {tab === 'territory' && <TerritoryContent />}
        </TabsContent>
        <TabsContent value="quotas" className="mt-4">
          {tab === 'quotas' && <PreOrderQuotaContent />}
        </TabsContent>
        <TabsContent value="commissions" className="mt-4">
          {tab === 'commissions' && <CommissionsContent />}
        </TabsContent>
        <TabsContent value="last-call" className="mt-4">
          {tab === 'last-call' && <LastCallContent />}
        </TabsContent>
        <TabsContent value="bopis" className="mt-4">
          {tab === 'bopis' && <BopisContent />}
        </TabsContent>
        <TabsContent value="investing" className="mt-4">
          {tab === 'investing' && <InvestingContent />}
        </TabsContent>
        <TabsContent value="dealer-cabinet" className="mt-4">
          {tab === 'dealer-cabinet' && <DealerCabinetContent />}
        </TabsContent>
        <TabsContent value="smart-replenishment" className="mt-4">
          {tab === 'smart-replenishment' && <SmartReplenishmentContent />}
        </TabsContent>
        <TabsContent value="order-lists" className="mt-4">
          {tab === 'order-lists' && <OrderListsContent />}
        </TabsContent>
        <TabsContent value="multi-cart" className="mt-4">
          {tab === 'multi-cart' && <MultiCartContent />}
        </TabsContent>
        <TabsContent value="favorites" className="mt-4">
          {tab === 'favorites' && <RetailersFavoritesContent />}
        </TabsContent>
        <TabsContent value="volume-rules" className="mt-4">
          {tab === 'volume-rules' && <VolumeRulesContent />}
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
}
