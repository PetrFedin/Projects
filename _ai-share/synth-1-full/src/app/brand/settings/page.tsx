'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Settings, Activity, Layout, MessageSquare, ShieldCheck, Bell, Globe, Key,
  DollarSign, MapPin, Calendar, Languages, Clock, Palette,
  Zap, Database, Package, Truck, BarChart3, FileText, Code, Download, ShieldAlert,
  Briefcase, Shield, CreditCard
} from "lucide-react";
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getSettingsLinks } from '@/lib/data/entity-links';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SecurityContent = dynamic(() => import('@/app/brand/security/page'), { ssr: false });
const SubscriptionContent = dynamic(() => import('@/app/brand/subscription/page'), { ssr: false });

const SETTINGS_KEY = 'syntha_brand_settings';

export default function BrandSettingsPage() {
  const { pulseMode, setPulseMode } = useUIState();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'general' | 'notifications' | 'business' | 'channels' | 'advanced' | 'security' | 'subscription'
  >('general');
  const [locale, setLocale] = useState('ru');
  const [currency, setCurrency] = useState('rub');

  useEffect(() => {
    try {
      const l = localStorage.getItem(`${SETTINGS_KEY}_locale`);
      const c = localStorage.getItem(`${SETTINGS_KEY}_currency`);
      if (l) setLocale(l);
      if (c) setCurrency(c);
    } catch (_) {}
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl animate-in fade-in duration-700 pb-24">
      {/* Control Panel: Strategic Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2.5 bg-white p-1 pr-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group cursor-default">
                  <div className="h-7 w-7 rounded-md bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-600 transition-colors">
                      <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">Узел</p>
                      <p className="text-[10px] font-bold text-slate-900 tracking-tight leading-tight">{profile?.user?.organization_id || user?.activeOrganizationId || 'Syntha HQ'}</p>
                  </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-1 pr-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group cursor-default">
                  <div className="h-7 w-7 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">Роль</p>
                      <p className="text-[10px] font-bold text-slate-900 tracking-tight leading-tight">{profile?.user?.role || user?.roles?.[0] || 'Member'}</p>
                  </div>
              </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ml-auto md:ml-0">
                  <Badge variant="outline" className="bg-white text-emerald-600 border-emerald-100 font-bold text-[8px] uppercase px-2 h-5 shadow-sm">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse mr-1.5" /> v2.4.0 Stable
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-7 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all" onClick={() => { setLocale('ru'); setCurrency('rub'); }}>
                      Сброс
                  </Button>
                  <Button variant="default" size="sm" className="h-7 px-4 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all" onClick={() => { try { localStorage.setItem(`${SETTINGS_KEY}_locale`, locale); localStorage.setItem(`${SETTINGS_KEY}_currency`, currency); } catch (_) {} }}>
                      Сохранить
                  </Button>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner w-fit">
              <TabsList className="bg-transparent h-8 p-0 gap-1">
                  <TabsTrigger value="general" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <Globe className="h-3 w-3" /> Основные
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <Bell className="h-3 w-3" /> Уведомления
                  </TabsTrigger>
                  <TabsTrigger value="business" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <BarChart3 className="h-3 w-3" /> Логика
                  </TabsTrigger>
                  <TabsTrigger value="channels" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <Zap className="h-3 w-3" /> Каналы
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <Code className="h-3 w-3" /> Dev
                  </TabsTrigger>
                  <TabsTrigger value="security" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <Shield className="h-3 w-3" /> Безопасность
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="rounded-lg h-6 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                      <CreditCard className="h-3 w-3" /> Подписка
                  </TabsTrigger>
              </TabsList>
          </div>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4 outline-none">
              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-indigo-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Localization</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <Languages className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Язык</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Интерфейс</p>
                              </div>
                          </div>
                          <Select value={locale} onValueChange={setLocale}>
                              <SelectTrigger className="h-8 rounded-lg text-[11px] font-bold uppercase border-slate-200 bg-slate-50/50 shadow-inner hover:bg-white transition-colors">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  <SelectItem value="ru" className="text-[11px] font-bold uppercase py-2">Русский</SelectItem>
                                  <SelectItem value="en" className="text-[11px] font-bold uppercase py-2">English</SelectItem>
                                  <SelectItem value="zh" className="text-[11px] font-bold uppercase py-2">中文</SelectItem>
                              </SelectContent>
                          </Select>
                      </Card>

                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <DollarSign className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Валюта</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Расчеты</p>
                              </div>
                          </div>
                          <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger className="h-8 rounded-lg text-[11px] font-bold uppercase border-slate-200 bg-slate-50/50 shadow-inner hover:bg-white transition-colors">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  <SelectItem value="rub" className="text-[11px] font-bold uppercase py-2">₽ RUB</SelectItem>
                                  <SelectItem value="usd" className="text-[11px] font-bold uppercase py-2">$ USD</SelectItem>
                                  <SelectItem value="eur" className="text-[11px] font-bold uppercase py-2">€ EUR</SelectItem>
                              </SelectContent>
                          </Select>
                      </Card>

                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <Clock className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Пояс</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Время</p>
                              </div>
                          </div>
                          <Select defaultValue="msk">
                              <SelectTrigger className="h-8 rounded-lg text-[11px] font-bold uppercase border-slate-200 bg-slate-50/50 shadow-inner hover:bg-white transition-colors">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  <SelectItem value="msk" className="text-[11px] font-bold uppercase py-2">UTC+3 MSK</SelectItem>
                                  <SelectItem value="utc" className="text-[11px] font-bold uppercase py-2">UTC+0 LON</SelectItem>
                                  <SelectItem value="est" className="text-[11px] font-bold uppercase py-2">UTC-5 NYC</SelectItem>
                              </SelectContent>
                          </Select>
                      </Card>

                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <Calendar className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Дата</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Формат</p>
                              </div>
                          </div>
                          <Select defaultValue="dd.mm.yyyy">
                              <SelectTrigger className="h-8 rounded-lg text-[11px] font-bold uppercase border-slate-200 bg-slate-50/50 shadow-inner hover:bg-white transition-colors">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  <SelectItem value="dd.mm.yyyy" className="text-[11px] font-bold uppercase py-2">ДД.ММ.ГГГГ</SelectItem>
                                  <SelectItem value="mm/dd/yyyy" className="text-[11px] font-bold uppercase py-2">ММ/ДД/ГГГГ</SelectItem>
                              </SelectContent>
                          </Select>
                      </Card>
                  </div>
              </div>

              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-emerald-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interface</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3.5 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100 shadow-inner transition-transform group-hover:scale-105">
                                      <Palette className="h-4 w-4" />
                                  </div>
                                  <div>
                                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Темная тема</Label>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Энергосбережение</p>
                                  </div>
                              </div>
                              <Switch className="scale-90" />
                          </div>
                      </Card>

                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3.5 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100 shadow-inner transition-transform group-hover:scale-105">
                                      <Layout className="h-4 w-4" />
                                  </div>
                                  <div>
                                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Компактный режим</Label>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Максимальная плотность</p>
                                  </div>
                              </div>
                              <Switch className="scale-90" />
                          </div>
                      </Card>
                  </div>
              </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4 outline-none">
              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-indigo-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Pulse Mode</h2>
                  </div>
                  <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Режим отображения</Label>
                              <p className="text-[11px] text-slate-500 font-medium max-w-md leading-relaxed">
                                  События в реальном времени: «Бегущая строка» или «Всплывающие» уведомления.
                              </p>
                          </div>
                          
                          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                              <Tabs 
                                  defaultValue={pulseMode} 
                                  value={pulseMode} 
                                  onValueChange={(val) => setPulseMode(val as any)}
                              >
                                  <TabsList className="bg-transparent h-7 p-0 gap-1">
                                      <TabsTrigger value="ticker" className="rounded-lg h-5 px-3 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                                          <Layout className="h-3 w-3" /> Тикер
                                      </TabsTrigger>
                                      <TabsTrigger value="floating" className="rounded-lg h-5 px-3 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-[9px] font-bold uppercase tracking-widest gap-1.5 transition-all">
                                          <MessageSquare className="h-3 w-3" /> Поп-ап
                                      </TabsTrigger>
                                  </TabsList>
                              </Tabs>
                          </div>
                      </div>
                  </Card>
              </div>

              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-emerald-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notification Channels</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                          { icon: Bell, title: "Email", desc: "Сводка заказов", enabled: true, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                          { icon: MessageSquare, title: "Push", desc: "Алерты", enabled: true, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                          { icon: Activity, title: "In-app", desc: "События", enabled: true, color: "bg-blue-50 text-blue-600 border-blue-100" },
                          { icon: Globe, title: "Webhook", desc: "API интеграции", enabled: false, color: "bg-slate-50 text-slate-400 border-slate-100" }
                      ].map((item, i) => (
                          <Card key={i} className="rounded-xl border border-slate-100 shadow-sm bg-white p-3.5 hover:border-indigo-100 transition-all group">
                              <div className="flex items-center justify-between mb-3">
                                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105", item.color)}>
                                      <item.icon className="h-4 w-4" />
                                  </div>
                                  <Switch className="scale-90" defaultChecked={item.enabled} />
                              </div>
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{item.title}</Label>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{item.desc}</p>
                          </Card>
                      ))}
                  </div>
              </div>
          </TabsContent>

          {/* Business Logic Settings */}
          <TabsContent value="business" className="space-y-4 outline-none">
              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-indigo-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sales Channels</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                          { label: "B2B Опт", enabled: true, color: "bg-blue-500" },
                          { label: "B2C Розница", enabled: true, color: "bg-emerald-500" },
                          { label: "Marketroom", enabled: true, color: "bg-purple-500" },
                          { label: "Outlet", enabled: true, color: "bg-amber-500" },
                          { label: "Marketplaces", enabled: false, color: "bg-slate-400" },
                          { label: "Dropship", enabled: false, color: "bg-slate-400" }
                      ].map((channel, i) => (
                          <Card key={i} className="rounded-xl border border-slate-100 shadow-sm bg-white p-2.5 hover:border-indigo-100 transition-all flex flex-col justify-between h-12 group">
                              <div className="flex items-center justify-between">
                                  <div className={cn("h-2 w-2 rounded-full shadow-sm group-hover:scale-125 transition-transform", channel.color)} />
                                  <Switch className="scale-[0.65] origin-right" defaultChecked={channel.enabled} />
                              </div>
                              <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-900 leading-none mb-0.5">{channel.label}</Label>
                          </Card>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                          <div className="h-1 w-5 bg-emerald-600 rounded-full" />
                          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Regions & Logistics</h2>
                      </div>
                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <MapPin className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Регионы продаж</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Локации</p>
                              </div>
                          </div>
                          <div className="space-y-1">
                              {['Москва', 'Санкт-Петербург', 'Регионы РФ'].map((region, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all group/item">
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-indigo-600">{region}</span>
                                      <Switch className="scale-[0.7] origin-right" defaultChecked />
                                  </div>
                              ))}
                          </div>
                      </Card>
                  </div>

                  <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                          <div className="h-1 w-5 bg-blue-600 rounded-full" />
                          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Warehousing</h2>
                      </div>
                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <Package className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Склады</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Хранение</p>
                              </div>
                          </div>
                          <div className="space-y-1">
                              {['Основной склад', 'Склад СПБ', 'Дропшип склад'].map((warehouse, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-emerald-100 transition-all group/item">
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-emerald-600">{warehouse}</span>
                                      <Switch className="scale-[0.7] origin-right" defaultChecked={i < 2} />
                                  </div>
                              ))}
                          </div>
                      </Card>
                  </div>
              </div>

              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-purple-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tax & Pricing</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-inner group-hover:scale-105 transition-transform">
                                  <DollarSign className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">НДС (VAT)</Label>
                                  <p className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">Ставка</p>
                              </div>
                          </div>
                          <Select defaultValue="20">
                              <SelectTrigger className="h-8 rounded-lg text-[11px] font-bold uppercase border-slate-200 bg-slate-50/50 shadow-inner hover:bg-white transition-colors">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  <SelectItem value="0" className="text-[11px] font-bold uppercase py-2">0% No VAT</SelectItem>
                                  <SelectItem value="10" className="text-[11px] font-bold uppercase py-2">10% Reduced</SelectItem>
                                  <SelectItem value="20" className="text-[11px] font-bold uppercase py-2">20% Standard</SelectItem>
                              </SelectContent>
                          </Select>
                      </Card>

                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3.5 hover:border-indigo-100 transition-all group">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-inner group-hover:scale-105 transition-transform">
                                      <BarChart3 className="h-4 w-4" />
                                  </div>
                                  <div>
                                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Dynamic Pricing</Label>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">AI оптимизация</p>
                                  </div>
                              </div>
                              <Switch className="scale-90" />
                          </div>
                      </Card>
                  </div>
              </div>
          </TabsContent>

          {/* Sales Channels Settings */}
          <TabsContent value="channels" className="space-y-4 outline-none">
              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-indigo-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unified Commerce Channels</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                          { id: 'b2b', label: "B2B Wholesale", desc: "Оптовые продажи", enabled: true, color: "bg-blue-500", icon: Briefcase, margin: "45%" },
                          { id: 'b2c', label: "B2C Retail", desc: "Розничные продажи", enabled: true, color: "bg-emerald-500", icon: Package, margin: "60%" },
                          { id: 'marketplaces', label: "Marketplaces", desc: "WB, Ozon, Lamoda", enabled: true, color: "bg-purple-500", icon: Globe, margin: "25%" },
                          { id: 'outlet', label: "Outlet", desc: "Распродажи", enabled: true, color: "bg-amber-500", icon: Truck, margin: "40%" },
                          { id: 'resale', label: "Resale", desc: "C2C / Second-hand", enabled: false, color: "bg-slate-400", icon: Activity, margin: "35%" },
                          { id: 'dropship', label: "Dropship", desc: "Без складских запасов", enabled: false, color: "bg-slate-400", icon: Zap, margin: "50%" }
                      ].map((channel, i) => (
                          <Card key={i} className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:border-indigo-100 transition-all group">
                              <div className="flex items-center justify-between mb-3">
                                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shadow-inner transition-transform group-hover:scale-105", 
                                      channel.enabled ? `${channel.color} text-white` : "bg-slate-50 text-slate-400 border border-slate-100"
                                  )}>
                                      <channel.icon className="h-4 w-4" />
                                  </div>
                                  <Switch className="scale-[0.7] origin-right" defaultChecked={channel.enabled} />
                              </div>
                              <h3 className="text-[11px] font-bold uppercase tracking-tight text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors">{channel.label}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{channel.desc}</p>
                              {channel.enabled && (
                                  <div className="pt-3 border-t border-slate-100 space-y-2">
                                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                                          <span>Маржа</span>
                                          <span className="text-slate-900">{channel.margin}</span>
                                      </div>
                                      <Button variant="ghost" className="w-full h-7 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                          Конфигурация
                                      </Button>
                                  </div>
                              )}
                          </Card>
                      ))}
                  </div>
              </div>

              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-emerald-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Channel Sync Settings</h2>
                  </div>
                  <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3 hover:border-indigo-100 transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-1">
                                  <div className="h-1 w-4 bg-indigo-500 rounded-full" />
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Инвентаризация</h4>
                              </div>
                              {[
                                  { label: "Real-time sync", enabled: true },
                                  { label: "Auto-reserve", enabled: true },
                                  { label: "Safety stock", enabled: false }
                              ].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all group/item">
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-indigo-600">{item.label}</span>
                                      <Switch className="scale-[0.65] origin-right" defaultChecked={item.enabled} />
                                  </div>
                              ))}
                          </div>
                          <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-1">
                                  <div className="h-1 w-4 bg-emerald-500 rounded-full" />
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Pricing Rules</h4>
                              </div>
                              {[
                                  { label: "Global MSRP", enabled: false },
                                  { label: "Margin protect", enabled: true },
                                  { label: "Promo sync", enabled: false }
                              ].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-emerald-100 transition-all group/item">
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-emerald-600">{item.label}</span>
                                      <Switch className="scale-[0.65] origin-right" defaultChecked={item.enabled} />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </Card>
              </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-4 outline-none">
              <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                      <div className="h-1 w-5 bg-indigo-600 rounded-full" />
                      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Developer Mode</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                          { icon: Code, title: "Dev Mode", desc: "Advanced tools", enabled: false },
                          { icon: Database, title: "Debug Logs", desc: "Detailed tracing", enabled: false },
                          { icon: Zap, title: "API Rate", desc: "Limit requests", enabled: true },
                          { icon: FileText, title: "Audit Trail", desc: "Action logs", enabled: true }
                      ].map((item, i) => (
                          <Card key={i} className="rounded-xl border border-slate-100 shadow-sm bg-white p-3.5 hover:border-indigo-100 transition-all group">
                              <div className="flex items-center justify-between mb-3">
                                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105",
                                      item.enabled ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                  )}>
                                      <item.icon className="h-4 w-4" />
                                  </div>
                                  <Switch className="scale-[0.7] origin-right" defaultChecked={item.enabled} />
                              </div>
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{item.title}</Label>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{item.desc}</p>
                          </Card>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Backup & Export */}
                  <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                          <div className="h-1 w-5 bg-emerald-600 rounded-full" />
                          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Management</h2>
                      </div>
                      <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3 hover:border-emerald-100 transition-all group">
                          <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform">
                                      <Database className="h-4 w-4" />
                                  </div>
                                  <div>
                                      <h3 className="text-[11px] font-bold uppercase tracking-tight text-slate-900">Backup & Export</h3>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Full Data control</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                  <Button variant="outline" className="w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:text-emerald-600 justify-between px-3 transition-all shadow-sm">
                                      <span>Full Database (JSON)</span>
                                      <Download className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="outline" className="w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:text-emerald-600 justify-between px-3 transition-all shadow-sm">
                                      <span>Document Archive (PDF)</span>
                                      <Download className="h-3.5 w-3.5" />
                                  </Button>
                              </div>
                          </div>
                      </Card>
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-1">
                          <div className="h-1 w-5 bg-rose-600 rounded-full" />
                          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Danger Zone</h2>
                      </div>
                      <Card className="rounded-xl border border-rose-100 shadow-sm bg-rose-50/30 p-3 border-2 border-dashed border-rose-100 hover:bg-rose-50/50 transition-all group">
                          <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 shadow-inner group-hover:scale-105 transition-transform">
                                      <ShieldAlert className="h-4 w-4" />
                                  </div>
                                  <div>
                                      <h3 className="text-[11px] font-bold uppercase tracking-tight text-rose-900">Critical Actions</h3>
                                      <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Irreversible operations</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                  <Button variant="outline" className="w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300 justify-start px-3 transition-all shadow-sm">
                                      Factory Reset
                                  </Button>
                                  <Button variant="outline" className="w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest border-rose-400 text-rose-900 hover:bg-rose-200 hover:border-rose-500 justify-start px-3 transition-all shadow-sm">
                                      Delete Organization
                                  </Button>
                              </div>
                          </div>
                      </Card>
                  </div>
              </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 outline-none">
              {activeTab === 'security' && <SecurityContent />}
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4 outline-none">
              {activeTab === 'subscription' && <SubscriptionContent />}
          </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getSettingsLinks()} title="Связанные разделы" className="mt-6" />
    </div>
  );
}
