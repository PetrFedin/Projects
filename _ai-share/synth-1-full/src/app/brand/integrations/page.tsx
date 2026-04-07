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
  Building2, CheckCircle2, Plug, Zap, Package, 
  TrendingUp, BarChart3, Globe, 
  ArrowUpRight, Download, Settings, Activity,
  Database, Terminal, ShieldAlert, Edit, Save, X, PlusCircle,
  ShoppingBag, Store, Truck, CreditCard, Loader2, FileText, ShieldCheck
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
      { name: 'supplierId', label: 'ID Поставщика', type: 'text', required: true }
    ]
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
      { name: 'apiKey', label: 'API Key', type: 'text', required: true }
    ]
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
      { name: 'apiToken', label: 'API Token', type: 'text', required: true }
    ]
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
      { name: 'oauthToken', label: 'OAuth Token', type: 'text', required: true }
    ]
  }
];

/** Встроенные B2B-фичи — нативно в платформе (без интеграций с внешними сервисами) */
const NATIVE_B2B_FEATURES = [
  { label: 'Совместное заполнение заказа', href: ROUTES.shop.b2bCollaborativeOrder, desc: 'Collaborative order forms + approval workflow' },
  { label: 'Согласование заказов', href: ROUTES.brand.orderApprovalWorkflow, desc: 'Многошаговый workflow: байер → магазин → бренд' },
  { label: 'Smart Replenishment', href: ROUTES.shop.b2bSmartReplenishment, desc: 'Автопополнение по продажам и остаткам' },
  { label: 'Личный кабинет дилера', href: ROUTES.shop.b2bDealerCabinet, desc: 'Документы, отчёты, индивидуальные цены' },
  { label: 'Несколько корзин', href: ROUTES.shop.b2bMultipleCarts, desc: 'Несколько черновиков, совместное редактирование' },
  { label: 'Избранные товары', href: ROUTES.shop.b2bProductFavorites, desc: 'Быстрый доступ байера к избранным SKU' },
  { label: 'Volume & Pack Rules', href: ROUTES.shop.b2bVolumePackRules, desc: 'Объёмные скидки, минималки, pack rules' },
  { label: 'AI Search B2B', href: ROUTES.shop.b2bAiSearch, desc: 'Умный поиск и рекомендации для байеров' },
  { label: 'Private Invites', href: ROUTES.brand.b2bPrivateInvites, desc: 'Доступ по корпоративному email' },
  { label: 'Тендеры', href: ROUTES.shop.b2bTenders, desc: 'Аукционы для закупок' },
  { label: 'Поиск поставщиков', href: ROUTES.shop.b2bSupplierDiscovery, desc: 'Реестр по гео и категориям' },
];

export default function IntegrationsPage() {
    const searchParams = useSearchParams();
    const returnResolved = searchParams.get('returnResolved');
    const [isEditing, setIsEditing] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
    const [integrationFormData, setIntegrationFormData] = useState<Record<string, string>>({});
    
    const [integrations, setIntegrations] = useState([
        { name: '1C:Предприятие', category: 'ERP', status: 'active', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'СДЭК', category: 'Логистика', status: 'active', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Яндекс.Метрика', category: 'Аналитика', status: 'active', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Мой Склад', category: 'Учет', status: 'inactive', icon: Package, color: 'text-slate-400', bg: 'bg-slate-50' },
        { name: 'VK Реклама', category: 'Маркетинг', status: 'inactive', icon: TrendingUp, color: 'text-slate-400', bg: 'bg-slate-50' },
        { name: 'Контур', category: 'Бухгалтерия', status: 'inactive', icon: Building2, color: 'text-slate-400', bg: 'bg-slate-50' },
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
        setIntegrationFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleConnectIntegration = async () => {
        setIsConnecting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update integration status
        const updatedMarketplace = MARKETPLACE_INTEGRATIONS.map(int => 
            int.id === selectedIntegration.id ? { ...int, status: 'active' } : int
        );
        
        setIsConnecting(false);
        setSelectedIntegration(null);
        setIntegrationFormData({});
    };

    return (
        <div className="space-y-5 max-w-5xl mx-auto pb-20 px-4 md:px-0">
            {returnResolved && (
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 mb-4">
                <Link href={`/brand/organization?resolved=${encodeURIComponent(returnResolved)}`} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  ← Вернуться в Центр управления
                </Link>
              </div>
            )}
            {/* Control Panel */}
            <div className="flex justify-end items-center mb-4 gap-3">
                <div className="flex items-center gap-1.5">
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[7px] uppercase px-2 h-5">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse mr-1.5" /> {webhooks.filter(w => w.status === 'active').length + integrations.filter(i => i.status === 'active').length} активных
                    </Badge>
                    <div className="h-4 w-px bg-slate-200 mx-0.5" />
                    <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
                        <Link href="/api/docs">API Документация</Link>
                    </Button>
                </div>

                <Button 
                    variant={isEditing ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                        "h-7 px-4 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all",
                        isEditing ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-slate-200 text-slate-600"
                    )}
                >
                    {isEditing ? (
                        <><Save className="h-3 w-3 mr-1" /> Сохранить</>
                    ) : (
                        <><Edit className="h-3 w-3 mr-1" /> Настроить</>
                    )}
                </Button>
            </div>

            {/* Marketplace Integrations (One-Click Setup) */}
            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                    <div className="h-3.5 w-1 bg-purple-600 rounded-full" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Маркетплейсы (One-Click Setup)</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {MARKETPLACE_INTEGRATIONS.map((mp, i) => (
                        <motion.div
                            key={mp.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="h-full rounded-2xl border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white border border-slate-100 relative p-3">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-all", mp.bg)}>
                                            <mp.icon className={cn("h-6 w-6", mp.color)} />
                                        </div>
                                        <Badge className={cn("border-none font-black text-[7px] uppercase px-1.5 h-4",
                                            mp.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                        )}>
                                            {mp.status === 'active' ? 'Активно' : 'Не подключено'}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {mp.name}
                                        </h3>
                                        <p className="text-[9px] font-medium text-slate-500 leading-relaxed">
                                            {mp.description}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        {mp.status === 'active' ? (
                                            <div className="space-y-2">
                                                <Button variant="outline" className="w-full h-9 rounded-xl text-[8px] font-black uppercase border-slate-200 hover:bg-slate-50 gap-2">
                                                    <Settings className="h-3 w-3" /> Настройки
                                                </Button>
                                                <Button variant="ghost" className="w-full h-8 text-[7px] font-black uppercase text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                                                    Отключить
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                onClick={() => handleIntegrationClick(mp)}
                                                className="w-full h-9 rounded-xl text-[8px] font-black uppercase bg-indigo-600 hover:bg-indigo-700 gap-2"
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
            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                    <div className="h-3.5 w-1 bg-indigo-600 rounded-full" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Встроенные B2B-фичи</h2>
                </div>
                <p className="text-[9px] text-slate-500 -mt-1">Совместные заказы, Smart Replenishment, личный кабинет дилера, несколько корзин, AI-поиск и другие — встроены в платформу.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {NATIVE_B2B_FEATURES.map((f, i) => (
                        <Link key={f.label} href={f.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="h-full rounded-xl border border-slate-100 bg-white p-3 hover:border-indigo-200 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-black uppercase text-slate-900 group-hover:text-indigo-600">{f.label}</span>
                                    <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-500 shrink-0" />
                                </div>
                                <p className="text-[9px] text-slate-500 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Integration Marketplace */}
            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                    <div className="h-3.5 w-1 bg-emerald-600 rounded-full" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Другие интеграции</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {integrations.map((int, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full rounded-xl border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white border border-slate-100 relative p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", int.bg)}>
                                        <int.icon className={cn("h-6 w-6", int.color)} />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge className={cn("border-none font-black text-[7px] uppercase px-1.5 h-4 tracking-widest",
                                            int.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                        )}>
                                            {int.status}
                                        </Badge>
                                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                            <Link href="#"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                                            {int.name}
                                        </h3>
                                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                                            {int.category} integration for seamless data sync.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50">
                                        {int.status === 'active' ? (
                                            <Button variant="outline" className="w-full h-9 rounded-xl text-[8px] font-black uppercase border-slate-200 hover:bg-slate-50 gap-2">
                                                <Settings className="h-3 w-3" /> Настройки
                                            </Button>
                                        ) : (
                                            <Button variant="default" className="w-full h-9 rounded-xl text-[8px] font-black uppercase bg-indigo-600 hover:bg-indigo-700 gap-2">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Webhooks Configurator */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-3.5 w-1 bg-blue-600 rounded-full" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Webhook Configurator</h2>
                    </div>
                    
                    <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100 h-full">
                        <div className="space-y-3">
                            {webhooks.map((wh, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all group relative">
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                        wh.status === 'active' ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"
                                    )}>
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[9px] font-black text-slate-900 uppercase">{wh.event}</p>
                                            <Badge className={cn("border-none font-black text-[6px] uppercase px-1.5 h-3.5",
                                                wh.status === 'active' ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                                            )}>
                                                {wh.status}
                                            </Badge>
                                        </div>
                                        {isEditing ? (
                                            <Input 
                                                value={wh.url} 
                                                onChange={(e) => handleWebhookChange(i, e.target.value)} 
                                                className="h-7 text-[8px] font-mono bg-white border-slate-200"
                                            />
                                        ) : (
                                            <p className="text-[7px] text-slate-400 font-mono truncate">{wh.url}</p>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-rose-500 hover:bg-rose-50 rounded-lg">
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <Button variant="outline" className="w-full h-10 rounded-xl text-[8px] font-black uppercase border-slate-200 hover:bg-slate-50 gap-2">
                                <PlusCircle className="h-3 w-3" /> Добавить Webhook
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* API & Developer Tools */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-3.5 w-1 bg-slate-900 rounded-full" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Developer Tools</h2>
                    </div>
                    <Card className="rounded-xl border-none shadow-sm bg-slate-900 text-white p-4 overflow-hidden relative group h-full">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-indigo-400">
                            <Terminal className="h-32 w-32" />
                        </div>
                        <div className="relative z-10 space-y-6 flex flex-col h-full">
                            <div className="space-y-1">
                                <h3 className="text-base font-black uppercase tracking-tight">API Management</h3>
                                <p className="text-xs font-medium text-slate-400">Управление ключами доступа и документацией.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 mt-auto">
                                <Button asChild variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                                    <Link href="/brand/security">API Ключи доступа</Link>
                                </Button>
                                <Button variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                                    Логи запросов (Real-time)
                                </Button>
                                <Button variant="ghost" className="justify-start h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 border border-white/5 transition-all">
                                    Системные события (Audit)
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <RelatedModulesBlock links={getIntegrationsLinks()} title="Связанные разделы" className="mt-6" />

            {/* One-Click Setup Dialog */}
            <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
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
                                <Label htmlFor={field.name} className="text-[10px] font-black uppercase tracking-widest text-slate-700">
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

                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <Zap className="h-4 w-4 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-slate-900">One-Click Setup</p>
                                    <p className="text-[8px] text-slate-600 leading-relaxed">
                                        После подключения товары автоматически синхронизируются с {selectedIntegration?.name}. 
                                        Остатки и цены будут обновляться в реальном времени.
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
                            disabled={isConnecting || !selectedIntegration?.fields?.every((f: any) => 
                                !f.required || integrationFormData[f.name]
                            )}
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Подключение...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
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
