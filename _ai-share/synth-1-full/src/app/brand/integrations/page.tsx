'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Building2,
  CheckCircle2,
  Plug,
  Zap,
  Package,
  TrendingUp,
  BarChart3,
  Globe,
  ArrowUpRight,
  Download,
  Settings,
  Activity,
  Database,
  Terminal,
  ShieldAlert,
  Edit,
  Save,
  X,
  PlusCircle,
  ShoppingBag,
  Store,
  Truck,
  CreditCard,
  Loader2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getIntegrationsLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';

/** Маркетплейсы для РФ. Shopify — в archive (blocked в РФ). */
const MARKETPLACE_INTEGRATIONS = [
  {
    id: 'wildberries',
    name: 'Wildberries',
    category: 'Маркетплейс',
    status: 'inactive',
    icon: ShoppingBag,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    description: 'Крупнейший маркетплейс РФ',
    oneClickSetup: true,
    fields: [
      { name: 'apiKey', label: 'API Ключ', type: 'text', required: true },
      { name: 'supplierId', label: 'ID Поставщика', type: 'text', required: true },
    ],
  },
  {
    id: 'ozon',
    name: 'Ozon',
    category: 'Маркетплейс',
    status: 'inactive',
    icon: Store,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    description: 'Второй по величине маркетплейс',
    oneClickSetup: true,
    fields: [
      { name: 'clientId', label: 'Client ID', type: 'text', required: true },
      { name: 'apiKey', label: 'API Key', type: 'text', required: true },
    ],
  },
  {
    id: 'lamoda',
    name: 'Lamoda',
    category: 'Маркетплейс',
    status: 'inactive',
    icon: ShoppingBag,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    description: 'Fashion маркетплейс',
    oneClickSetup: true,
    fields: [
      { name: 'partnerId', label: 'Partner ID', type: 'text', required: true },
      { name: 'apiToken', label: 'API Token', type: 'text', required: true },
    ],
  },
  {
    id: 'yandex-market',
    name: 'Яндекс.Маркет',
    category: 'Маркетплейс',
    status: 'inactive',
    icon: Store,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    description: 'Маркетплейс Яндекс',
    oneClickSetup: true,
    fields: [
      { name: 'campaignId', label: 'Campaign ID', type: 'text', required: true },
      { name: 'oauthToken', label: 'OAuth Token', type: 'text', required: true },
    ],
  },
];

/** Встроенные B2B-фичи — нативно в платформе (без интеграций с внешними сервисами) */
const NATIVE_B2B_FEATURES = [
  {
    label: 'Совместное заполнение заказа',
    href: ROUTES.shop.b2bCollaborativeOrder,
    desc: 'Collaborative order forms + approval workflow',
  },
  {
    label: 'Согласование заказов',
    href: ROUTES.brand.orderApprovalWorkflow,
    desc: 'Многошаговый workflow: байер → магазин → бренд',
  },
  {
    label: 'Smart Replenishment',
    href: ROUTES.shop.b2bSmartReplenishment,
    desc: 'Автопополнение по продажам и остаткам',
  },
  {
    label: 'Личный кабинет дилера',
    href: ROUTES.shop.b2bDealerCabinet,
    desc: 'Документы, отчёты, индивидуальные цены',
  },
  {
    label: 'Несколько корзин',
    href: ROUTES.shop.b2bMultipleCarts,
    desc: 'Несколько черновиков, совместное редактирование',
  },
  {
    label: 'Избранные товары',
    href: ROUTES.shop.b2bProductFavorites,
    desc: 'Быстрый доступ байера к избранным SKU',
  },
  {
    label: 'Volume & Pack Rules',
    href: ROUTES.shop.b2bVolumePackRules,
    desc: 'Объёмные скидки, минималки, pack rules',
  },
  {
    label: 'AI Search B2B',
    href: ROUTES.shop.b2bAiSearch,
    desc: 'Умный поиск и рекомендации для байеров',
  },
  {
    label: 'Private Invites',
    href: ROUTES.brand.b2bPrivateInvites,
    desc: 'Доступ по корпоративному email',
  },
  { label: 'Тендеры', href: ROUTES.shop.b2bTenders, desc: 'Аукционы для закупок' },
  {
    label: 'Поиск поставщиков',
    href: ROUTES.shop.b2bSupplierDiscovery,
    desc: 'Реестр по гео и категориям',
  },
];

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const returnResolved = searchParams.get('returnResolved');
  const [isEditing, setIsEditing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [integrationFormData, setIntegrationFormData] = useState<Record<string, string>>({});

  const [integrations, setIntegrations] = useState([
    {
      name: '1C:Предприятие',
      category: 'ERP',
      status: 'active',
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'СДЭК',
      category: 'Логистика',
      status: 'active',
      icon: Package,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      name: 'Яндекс.Метрика',
      category: 'Аналитика',
      status: 'active',
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      name: 'Мой Склад',
      category: 'Учет',
      status: 'inactive',
      icon: Package,
      color: 'text-slate-400',
      bg: 'bg-slate-50',
    },
    {
      name: 'VK Реклама',
      category: 'Маркетинг',
      status: 'inactive',
      icon: TrendingUp,
      color: 'text-slate-400',
      bg: 'bg-slate-50',
    },
    {
      name: 'Контур',
      category: 'Бухгалтерия',
      status: 'inactive',
      icon: Building2,
      color: 'text-slate-400',
      bg: 'bg-slate-50',
    },
  ]);

  const [webhooks, setWebhooks] = useState([
    { event: 'order.created', url: 'https://api.example.com/webhooks/orders', status: 'active' },
    { event: 'stock.low', url: 'https://api.example.com/webhooks/inventory', status: 'active' },
    { event: 'buyer.active', url: 'https://api.example.com/webhooks/buyers', status: 'inactive' },
  ]);

  const handleWebhookChange = (index: number, url: string) => {
    const newWebhooks = [...webhooks];
    newWebhooks[index].url = url;
    setWebhooks(newWebhooks);
  };

  const handleIntegrationClick = (integration: any) => {
    setSelectedIntegration(integration);
    setIntegrationFormData({});
  };

  const handleIntegrationFormChange = (fieldName: string, value: string) => {
    setIntegrationFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleConnectIntegration = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update integration status
    const updatedMarketplace = MARKETPLACE_INTEGRATIONS.map((int) =>
      int.id === selectedIntegration.id ? { ...int, status: 'active' } : int
    );

    setIsConnecting(false);
    setSelectedIntegration(null);
    setIntegrationFormData({});
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 pb-20 md:px-0">
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
          <Badge className="h-5 border-none bg-emerald-500 px-2 text-[7px] font-black uppercase text-white">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white" />{' '}
            {webhooks.filter((w) => w.status === 'active').length +
              integrations.filter((i) => i.status === 'active').length}{' '}
            активных
          </Badge>
          <div className="mx-0.5 h-4 w-px bg-slate-200" />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
          >
            <Link href="/api/docs">API Документация</Link>
          </Button>
        </div>

        <Button
          variant={isEditing ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            'h-7 rounded-lg px-4 text-[7px] font-black uppercase tracking-widest transition-all',
            isEditing
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
              : 'border-slate-200 bg-white text-slate-600'
          )}
        >
          {isEditing ? (
            <>
              <Save className="mr-1 h-3 w-3" /> Сохранить
            </>
          ) : (
            <>
              <Edit className="mr-1 h-3 w-3" /> Настроить
            </>
          )}
        </Button>
      </div>

      {/* Marketplace Integrations (One-Click Setup) */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-1 rounded-full bg-purple-600" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Маркетплейсы (One-Click Setup)
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {MARKETPLACE_INTEGRATIONS.map((mp, i) => (
            <motion.div
              key={mp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative h-full overflow-hidden rounded-2xl border border-none border-slate-100 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                        mp.bg
                      )}
                    >
                      <mp.icon className={cn('h-6 w-6', mp.color)} />
                    </div>
                    <Badge
                      className={cn(
                        'h-4 border-none px-1.5 text-[7px] font-black uppercase',
                        mp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-50 text-slate-400'
                      )}
                    >
                      {mp.status === 'active' ? 'Активно' : 'Не подключено'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                      {mp.name}
                    </h3>
                    <p className="text-[9px] font-medium leading-relaxed text-slate-500">
                      {mp.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    {mp.status === 'active' ? (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="h-9 w-full gap-2 rounded-xl border-slate-200 text-[8px] font-black uppercase hover:bg-slate-50"
                        >
                          <Settings className="h-3 w-3" /> Настройки
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 w-full text-[7px] font-black uppercase text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          Отключить
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleIntegrationClick(mp)}
                        className="h-9 w-full gap-2 rounded-xl bg-indigo-600 text-[8px] font-black uppercase hover:bg-indigo-700"
                      >
                        <Zap className="h-3 w-3" /> Подключить за 2 мин
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Встроенные B2B-фичи */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-1 rounded-full bg-indigo-600" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Встроенные B2B-фичи
          </h2>
        </div>
        <p className="-mt-1 text-[9px] text-slate-500">
          Совместные заказы, Smart Replenishment, личный кабинет дилера, несколько корзин, AI-поиск
          и другие — встроены в платформу.
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {NATIVE_B2B_FEATURES.map((f, i) => (
            <Link key={f.label} href={f.href}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group h-full rounded-xl border border-slate-100 bg-white p-3 transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-xs font-black uppercase text-slate-900 group-hover:text-indigo-600">
                    {f.label}
                  </span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-300 group-hover:text-indigo-500" />
                </div>
                <p className="text-[9px] leading-relaxed text-slate-500">{f.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Integration Marketplace */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-1 rounded-full bg-emerald-600" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Другие интеграции
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((int, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={cn(
                      'rounded-xl p-3 transition-all duration-300 group-hover:scale-110',
                      int.bg
                    )}
                  >
                    <int.icon className={cn('h-6 w-6', int.color)} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={cn(
                        'h-4 border-none px-1.5 text-[7px] font-black uppercase tracking-widest',
                        int.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-50 text-slate-400'
                      )}
                    >
                      {int.status}
                    </Badge>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 opacity-0 transition-all hover:bg-slate-900 hover:text-white group-hover:opacity-100"
                    >
                      <Link href="#">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 text-sm font-black uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                      {int.name}
                    </h3>
                    <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                      {int.category} integration for seamless data sync.
                    </p>
                  </div>

                  <div className="border-t border-slate-50 pt-4">
                    {int.status === 'active' ? (
                      <Button
                        variant="outline"
                        className="h-9 w-full gap-2 rounded-xl border-slate-200 text-[8px] font-black uppercase hover:bg-slate-50"
                      >
                        <Settings className="h-3 w-3" /> Настройки
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="h-9 w-full gap-2 rounded-xl bg-indigo-600 text-[8px] font-black uppercase hover:bg-indigo-700"
                      >
                        <Plug className="h-3 w-3" /> Подключить
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Developer & Webhooks Section */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Webhooks Configurator */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-1 rounded-full bg-blue-600" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Webhook Configurator
            </h2>
          </div>

          <Card className="h-full rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              {webhooks.map((wh, i) => (
                <div
                  key={i}
                  className="group relative flex items-center gap-3 rounded-xl bg-slate-50 p-4 transition-all hover:bg-slate-100"
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                      wh.status === 'active'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-200 text-slate-400'
                    )}
                  >
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase text-slate-900">{wh.event}</p>
                      <Badge
                        className={cn(
                          'h-3.5 border-none px-1.5 text-[6px] font-black uppercase',
                          wh.status === 'active'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-400 text-white'
                        )}
                      >
                        {wh.status}
                      </Badge>
                    </div>
                    {isEditing ? (
                      <Input
                        value={wh.url}
                        onChange={(e) => handleWebhookChange(i, e.target.value)}
                        className="h-7 border-slate-200 bg-white font-mono text-[8px]"
                      />
                    ) : (
                      <p className="truncate font-mono text-[7px] text-slate-400">{wh.url}</p>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-lg text-rose-500 hover:bg-rose-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <Button
                variant="outline"
                className="h-10 w-full gap-2 rounded-xl border-slate-200 text-[8px] font-black uppercase hover:bg-slate-50"
              >
                <PlusCircle className="h-3 w-3" /> Добавить Webhook
              </Button>
            </div>
          </Card>
        </div>

        {/* API & Developer Tools */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-1 rounded-full bg-slate-900" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Developer Tools
            </h2>
          </div>
          <Card className="group relative h-full overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-sm">
            <div className="absolute right-0 top-0 p-4 text-indigo-400 opacity-10 transition-transform group-hover:scale-110">
              <Terminal className="h-32 w-32" />
            </div>
            <div className="relative z-10 flex h-full flex-col space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase tracking-tight">API Management</h3>
                <p className="text-xs font-medium text-slate-400">
                  Управление ключами доступа и документацией.
                </p>
              </div>
              <div className="mt-auto grid grid-cols-1 gap-3">
                <Button
                  asChild
                  variant="ghost"
                  className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  <Link href="/brand/security">API Ключи доступа</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  Логи запросов (Real-time)
                </Button>
                <Button
                  variant="ghost"
                  className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  Системные события (Audit)
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <RelatedModulesBlock
        links={getIntegrationsLinks()}
        title="Связанные разделы"
        className="mt-6"
      />

      {/* One-Click Setup Dialog */}
      <Dialog
        open={!!selectedIntegration}
        onOpenChange={(open) => !open && setSelectedIntegration(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-black uppercase tracking-tight">
              Подключить {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Заполните данные для интеграции с {selectedIntegration?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedIntegration?.fields?.map((field: any) => (
              <div key={field.name} className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-700"
                >
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  value={integrationFormData[field.name] || ''}
                  onChange={(e) => handleIntegrationFormChange(field.name, e.target.value)}
                  placeholder={`Введите ${field.label.toLowerCase()}`}
                  className="h-11 rounded-xl"
                  required={field.required}
                />
              </div>
            ))}

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-slate-900">One-Click Setup</p>
                  <p className="text-[8px] leading-relaxed text-slate-600">
                    После подключения товары автоматически синхронизируются с{' '}
                    {selectedIntegration?.name}. Остатки и цены будут обновляться в реальном
                    времени.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedIntegration(null)}
              className="rounded-xl"
              disabled={isConnecting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleConnectIntegration}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
              disabled={
                isConnecting ||
                !selectedIntegration?.fields?.every(
                  (f: any) => !f.required || integrationFormData[f.name]
                )
              }
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Подключение...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Подключить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
