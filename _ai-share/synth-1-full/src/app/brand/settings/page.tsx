'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Settings,
  Activity,
  Layout,
  MessageSquare,
  ShieldCheck,
  Bell,
  Globe,
  Key,
  DollarSign,
  MapPin,
  Calendar,
  Languages,
  Clock,
  Palette,
  Zap,
  Database,
  Package,
  Truck,
  BarChart3,
  FileText,
  Code,
  Download,
  ShieldAlert,
  Briefcase,
  Shield,
  CreditCard,
} from 'lucide-react';
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
import { BreadcrumbsNav } from '@/components/brand';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';
import { tid } from '@/lib/ui/test-ids';
import { getSettingsLinks } from '@/lib/data/entity-links';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* Control Panel: Strategic Bar */}
      <div className="flex flex-col items-end justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="group flex cursor-default items-center gap-2.5 rounded-lg border border-slate-100 bg-white p-1 pr-3 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white shadow-lg transition-colors group-hover:bg-indigo-600">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0">
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                Узел
              </p>
              <p className="text-[10px] font-bold leading-tight tracking-tight text-slate-900">
=======
    <RegistryPageShell
      className="w-full max-w-none space-y-6 duration-700 animate-in fade-in"
      data-testid={tid.page('brand-settings')}
    >
      <BreadcrumbsNav
        items={[{ label: 'Brand OS', href: ROUTES.brand.home }, { label: 'Настройки' }]}
      />
      <RegistryPageHeader
        title="Настройки платформы"
        leadQuote="Параметры узла, уведомлений, каналов и подсистем Brand OS."
      />
      {/* Control Panel: Strategic Bar */}
      <div className="border-border-subtle flex flex-col items-end justify-between gap-3 border-b pb-3 md:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="border-border-subtle hover:border-accent-primary/20 group flex cursor-default items-center gap-2.5 rounded-lg border bg-white p-1 pr-3 shadow-sm transition-all hover:shadow-md">
            <div className="bg-text-primary group-hover:bg-accent-primary flex h-7 w-7 items-center justify-center rounded-md text-white shadow-lg transition-colors">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0">
              <p className="text-text-secondary text-xs font-medium leading-none">Узел</p>
              <p className="text-text-primary text-sm font-semibold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                {profile?.user?.organization_id || user?.activeOrganizationId || 'Syntha HQ'}
              </p>
            </div>
          </div>
<<<<<<< HEAD
          <div className="group flex cursor-default items-center gap-2.5 rounded-lg border border-slate-100 bg-white p-1 pr-3 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0">
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                Роль
              </p>
              <p className="text-[10px] font-bold leading-tight tracking-tight text-slate-900">
=======
          <div className="border-border-subtle hover:border-accent-primary/20 group flex cursor-default items-center gap-2.5 rounded-lg border bg-white p-1 pr-3 shadow-sm transition-all hover:shadow-md">
            <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 group-hover:bg-accent-primary flex h-7 w-7 items-center justify-center rounded-md border shadow-sm transition-all group-hover:text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0">
              <p className="text-text-secondary text-xs font-medium leading-none">Роль</p>
              <p className="text-text-primary text-sm font-semibold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                {profile?.user?.role || user?.roles?.[0] || 'Member'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
<<<<<<< HEAD
          <div className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner md:ml-0">
            <Badge
              variant="outline"
              className="h-5 border-emerald-100 bg-white px-2 text-[8px] font-bold uppercase text-emerald-600 shadow-sm"
=======
          <div className="bg-bg-surface2 border-border-default ml-auto flex items-center gap-1 rounded-xl border p-1 shadow-inner md:ml-0">
            <Badge
              variant="outline"
              className="h-6 border-emerald-100 bg-white px-2 text-xs font-medium text-emerald-700 shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <span className="mr-1.5 h-1 w-1 animate-pulse rounded-full bg-emerald-500" /> v2.4.0
              Stable
            </Badge>
            <Button
              variant="ghost"
              size="sm"
<<<<<<< HEAD
              className="h-7 rounded-lg px-3 text-[9px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
=======
              className="text-text-secondary hover:text-accent-primary h-8 rounded-lg px-3 text-xs font-medium transition-all hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
              onClick={() => {
                setLocale('ru');
                setCurrency('rub');
              }}
            >
              Сброс
            </Button>
            <Button
              variant="default"
              size="sm"
<<<<<<< HEAD
              className="h-7 rounded-lg bg-indigo-600 px-4 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-indigo-700"
=======
              className="bg-accent-primary hover:bg-accent-primary h-8 rounded-lg px-4 text-xs font-medium text-white shadow-lg transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              onClick={() => {
                try {
                  localStorage.setItem(`${SETTINGS_KEY}_locale`, locale);
                  localStorage.setItem(`${SETTINGS_KEY}_currency`, currency);
                } catch (_) {}
              }}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
<<<<<<< HEAD
        <div className="w-fit rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <TabsList className="h-8 gap-1 bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
        <div className="w-full">
          <TabsList className="flex h-auto min-h-10 w-full flex-wrap items-center justify-start gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger
              value="general"
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Globe className="h-3 w-3" /> Основные
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
<<<<<<< HEAD
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Bell className="h-3 w-3" /> Уведомления
            </TabsTrigger>
            <TabsTrigger
              value="business"
<<<<<<< HEAD
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <BarChart3 className="h-3 w-3" /> Логика
            </TabsTrigger>
            <TabsTrigger
              value="channels"
<<<<<<< HEAD
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Zap className="h-3 w-3" /> Каналы
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
<<<<<<< HEAD
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Code className="h-3 w-3" /> Dev
            </TabsTrigger>
            <TabsTrigger
              value="security"
<<<<<<< HEAD
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Shield className="h-3 w-3" /> Безопасность
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
<<<<<<< HEAD
              className="h-6 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
              className="gap-2 rounded-md px-3 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <CreditCard className="h-3 w-3" /> Подписка
            </TabsTrigger>
          </TabsList>
        </div>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 outline-none">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
<<<<<<< HEAD
              <div className="h-1 w-5 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Localization
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
                    <Languages className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Язык
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
              <div className="bg-accent-primary h-1 w-5 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Localization</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                    <Languages className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-text-secondary text-xs font-medium">Язык</Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Интерфейс
                    </p>
                  </div>
                </div>
                <Select value={locale} onValueChange={setLocale}>
<<<<<<< HEAD
                  <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
=======
                  <SelectTrigger className="border-border-default bg-bg-surface2/80 h-8 rounded-lg text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border-subtle rounded-xl shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <SelectItem value="ru" className="py-2 text-[11px] font-bold uppercase">
                      Русский
                    </SelectItem>
                    <SelectItem value="en" className="py-2 text-[11px] font-bold uppercase">
                      English
                    </SelectItem>
                    <SelectItem value="zh" className="py-2 text-[11px] font-bold uppercase">
                      中文
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Card>

<<<<<<< HEAD
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
=======
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
<<<<<<< HEAD
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Валюта
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
                    <Label className="text-text-secondary text-xs font-medium">Валюта</Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Расчеты
                    </p>
                  </div>
                </div>
                <Select value={currency} onValueChange={setCurrency}>
<<<<<<< HEAD
                  <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
=======
                  <SelectTrigger className="border-border-default bg-bg-surface2/80 h-8 rounded-lg text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border-subtle rounded-xl shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <SelectItem value="rub" className="py-2 text-[11px] font-bold uppercase">
                      ₽ RUB
                    </SelectItem>
                    <SelectItem value="usd" className="py-2 text-[11px] font-bold uppercase">
                      $ USD
                    </SelectItem>
                    <SelectItem value="eur" className="py-2 text-[11px] font-bold uppercase">
                      € EUR
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Card>

<<<<<<< HEAD
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
=======
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 shadow-inner transition-transform group-hover:scale-105">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
<<<<<<< HEAD
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Пояс
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
                    <Label className="text-text-secondary text-xs font-medium">Пояс</Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Время
                    </p>
                  </div>
                </div>
                <Select defaultValue="msk">
<<<<<<< HEAD
                  <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
=======
                  <SelectTrigger className="border-border-default bg-bg-surface2/80 h-8 rounded-lg text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border-subtle rounded-xl shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <SelectItem value="msk" className="py-2 text-[11px] font-bold uppercase">
                      UTC+3 MSK
                    </SelectItem>
                    <SelectItem value="utc" className="py-2 text-[11px] font-bold uppercase">
                      UTC+0 LON
                    </SelectItem>
                    <SelectItem value="est" className="py-2 text-[11px] font-bold uppercase">
                      UTC-5 NYC
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Card>

<<<<<<< HEAD
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-100 bg-purple-50 text-purple-600 shadow-inner transition-transform group-hover:scale-105">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Дата
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-text-secondary text-xs font-medium">Дата</Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Формат
                    </p>
                  </div>
                </div>
                <Select defaultValue="dd.mm.yyyy">
<<<<<<< HEAD
                  <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
=======
                  <SelectTrigger className="border-border-default bg-bg-surface2/80 h-8 rounded-lg text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border-subtle rounded-xl shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <SelectItem value="dd.mm.yyyy" className="py-2 text-[11px] font-bold uppercase">
                      ДД.ММ.ГГГГ
                    </SelectItem>
                    <SelectItem value="mm/dd/yyyy" className="py-2 text-[11px] font-bold uppercase">
                      ММ/ДД/ГГГГ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
              <div className="h-1 w-5 rounded-full bg-emerald-600" />
<<<<<<< HEAD
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Interface
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card className="group rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-600 shadow-inner transition-transform group-hover:scale-105">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                        Темная тема
                      </Label>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                        Энергосбережение
                      </p>
=======
              <h2 className="text-text-primary text-sm font-semibold">Interface</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-3.5 shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-surface2 text-text-secondary border-border-subtle flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-text-primary text-sm font-semibold">Темная тема</Label>
                      <p className="text-text-secondary mt-0.5 text-xs">Энергосбережение</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                  <Switch className="scale-90" />
                </div>
              </Card>

<<<<<<< HEAD
              <Card className="group rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-600 shadow-inner transition-transform group-hover:scale-105">
                      <Layout className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                        Компактный режим
                      </Label>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                        Максимальная плотность
                      </p>
=======
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-3.5 shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-surface2 text-text-secondary border-border-subtle flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                      <Layout className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-text-primary text-sm font-semibold">
                        Компактный режим
                      </Label>
                      <p className="text-text-secondary mt-0.5 text-xs">Максимальная плотность</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              <div className="h-1 w-5 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Live Pulse Mode
              </h2>
            </div>
            <Card className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
              <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                <div className="space-y-0.5">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                    Режим отображения
                  </Label>
                  <p className="max-w-md text-[11px] font-medium leading-relaxed text-slate-500">
=======
              <div className="bg-accent-primary h-1 w-5 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Live Pulse Mode</h2>
            </div>
            <Card className="border-border-subtle hover:border-accent-primary/20 rounded-xl border bg-white p-4 shadow-sm transition-all">
              <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                <div className="space-y-0.5">
                  <Label className="text-text-primary text-[11px] font-bold uppercase tracking-widest">
                    Режим отображения
                  </Label>
                  <p className="text-text-secondary max-w-md text-[11px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    События в реальном времени: «Бегущая строка» или «Всплывающие» уведомления.
                  </p>
                </div>

<<<<<<< HEAD
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
=======
                <div className="rounded-lg bg-muted p-1">
>>>>>>> recover/cabinet-wip-from-stash
                  <Tabs
                    defaultValue={pulseMode}
                    value={pulseMode}
                    onValueChange={(val) => setPulseMode(val as any)}
                  >
<<<<<<< HEAD
                    <TabsList className="h-7 gap-1 bg-transparent p-0">
                      <TabsTrigger
                        value="ticker"
                        className="h-5 gap-1.5 rounded-lg px-3 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
                    <TabsList className="flex h-auto min-h-9 items-center gap-1 rounded-md bg-muted p-1 text-muted-foreground">
                      <TabsTrigger
                        value="ticker"
                        className="gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        <Layout className="h-3 w-3" /> Тикер
                      </TabsTrigger>
                      <TabsTrigger
                        value="floating"
<<<<<<< HEAD
                        className="h-5 gap-1.5 rounded-lg px-3 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
=======
                        className="gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                      >
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
              <div className="h-1 w-5 rounded-full bg-emerald-600" />
<<<<<<< HEAD
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Notification Channels
              </h2>
=======
              <h2 className="text-text-primary text-sm font-semibold">Notification Channels</h2>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Bell,
                  title: 'Email',
                  desc: 'Сводка заказов',
                  enabled: true,
<<<<<<< HEAD
                  color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
=======
                  color: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
>>>>>>> recover/cabinet-wip-from-stash
                },
                {
                  icon: MessageSquare,
                  title: 'Push',
                  desc: 'Алерты',
                  enabled: true,
                  color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                },
                {
                  icon: Activity,
                  title: 'In-app',
                  desc: 'События',
                  enabled: true,
                  color: 'bg-blue-50 text-blue-600 border-blue-100',
                },
                {
                  icon: Globe,
                  title: 'Webhook',
                  desc: 'API интеграции',
                  enabled: false,
<<<<<<< HEAD
                  color: 'bg-slate-50 text-slate-400 border-slate-100',
=======
                  color: 'bg-bg-surface2 text-text-muted border-border-subtle',
>>>>>>> recover/cabinet-wip-from-stash
                },
              ].map((item, i) => (
                <Card
                  key={i}
<<<<<<< HEAD
                  className="group rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100"
=======
                  className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-3.5 shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                        item.color
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <Switch className="scale-90" defaultChecked={item.enabled} />
                  </div>
<<<<<<< HEAD
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                    {item.title}
                  </Label>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                    {item.desc}
                  </p>
=======
                  <Label className="text-text-primary text-sm font-semibold">{item.title}</Label>
                  <p className="text-text-secondary mt-0.5 text-xs">{item.desc}</p>
>>>>>>> recover/cabinet-wip-from-stash
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Business Logic Settings */}
        <TabsContent value="business" className="space-y-4 outline-none">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
<<<<<<< HEAD
              <div className="h-1 w-5 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sales Channels
              </h2>
=======
              <div className="bg-accent-primary h-1 w-5 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Sales Channels</h2>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {[
                { label: 'B2B Опт', enabled: true, color: 'bg-blue-500' },
                { label: 'B2C Розница', enabled: true, color: 'bg-emerald-500' },
<<<<<<< HEAD
                { label: 'Marketroom', enabled: true, color: 'bg-purple-500' },
                { label: 'Outlet', enabled: true, color: 'bg-amber-500' },
                { label: 'Marketplaces', enabled: false, color: 'bg-slate-400' },
                { label: 'Dropship', enabled: false, color: 'bg-slate-400' },
              ].map((channel, i) => (
                <Card
                  key={i}
                  className="group flex h-12 flex-col justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm transition-all hover:border-indigo-100"
=======
                { label: 'Marketroom', enabled: true, color: 'bg-accent-primary' },
                { label: 'Outlet', enabled: true, color: 'bg-amber-500' },
                { label: 'Marketplaces', enabled: false, color: 'bg-text-muted' },
                { label: 'Dropship', enabled: false, color: 'bg-text-muted' },
              ].map((channel, i) => (
                <Card
                  key={i}
                  className="border-border-subtle hover:border-accent-primary/20 group flex h-12 flex-col justify-between rounded-xl border bg-white p-2.5 shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full shadow-sm transition-transform group-hover:scale-125',
                        channel.color
                      )}
                    />
                    <Switch
                      className="origin-right scale-[0.65]"
                      defaultChecked={channel.enabled}
                    />
                  </div>
<<<<<<< HEAD
                  <Label className="mb-0.5 text-[9px] font-bold uppercase leading-none tracking-widest text-slate-900">
=======
                  <Label className="text-text-primary mb-0.5 text-xs font-medium leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                    {channel.label}
                  </Label>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <div className="h-1 w-5 rounded-full bg-emerald-600" />
<<<<<<< HEAD
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Regions & Logistics
                </h2>
              </div>
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Регионы продаж
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
                <h2 className="text-text-primary text-sm font-semibold">Regions & Logistics</h2>
              </div>
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-text-secondary text-xs font-medium">
                      Регионы продаж
                    </Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Локации
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {['Москва', 'Санкт-Петербург', 'Регионы РФ'].map((region, i) => (
                    <div
                      key={i}
<<<<<<< HEAD
                      className="group/item flex items-center justify-between rounded-lg border border-slate-100/50 bg-slate-50/50 p-2 transition-all hover:border-indigo-100 hover:bg-white"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-indigo-600">
=======
                      className="bg-bg-surface2/80 border-border-subtle/50 hover:border-accent-primary/20 group/item flex items-center justify-between rounded-lg border p-2 transition-all hover:bg-white"
                    >
                      <span className="text-text-secondary group-hover/item:text-accent-primary text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                        {region}
                      </span>
                      <Switch className="origin-right scale-[0.7]" defaultChecked />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <div className="h-1 w-5 rounded-full bg-blue-600" />
<<<<<<< HEAD
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Warehousing
                </h2>
              </div>
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
=======
                <h2 className="text-text-primary text-sm font-semibold">Warehousing</h2>
              </div>
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
<<<<<<< HEAD
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Склады
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
                    <Label className="text-text-secondary text-xs font-medium">Склады</Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Хранение
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {['Основной склад', 'Склад СПБ', 'Дропшип склад'].map((warehouse, i) => (
                    <div
                      key={i}
<<<<<<< HEAD
                      className="group/item flex items-center justify-between rounded-lg border border-slate-100/50 bg-slate-50/50 p-2 transition-all hover:border-emerald-100 hover:bg-white"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-emerald-600">
=======
                      className="bg-bg-surface2/80 border-border-subtle/50 group/item flex items-center justify-between rounded-lg border p-2 transition-all hover:border-emerald-100 hover:bg-white"
                    >
                      <span className="text-text-secondary text-xs font-medium group-hover/item:text-emerald-600">
>>>>>>> recover/cabinet-wip-from-stash
                        {warehouse}
                      </span>
                      <Switch className="origin-right scale-[0.7]" defaultChecked={i < 2} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
<<<<<<< HEAD
              <div className="h-1 w-5 rounded-full bg-purple-600" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tax & Pricing
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
=======
              <div className="bg-accent-primary h-1 w-5 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Tax & Pricing</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 shadow-inner transition-transform group-hover:scale-105">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
<<<<<<< HEAD
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      НДС (VAT)
                    </Label>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
=======
                    <Label className="text-text-secondary text-xs font-medium">НДС (VAT)</Label>
                    <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Ставка
                    </p>
                  </div>
                </div>
                <Select defaultValue="20">
<<<<<<< HEAD
                  <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
=======
                  <SelectTrigger className="border-border-default bg-bg-surface2/80 h-8 rounded-lg text-[11px] font-bold uppercase shadow-inner transition-colors hover:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-border-subtle rounded-xl shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <SelectItem value="0" className="py-2 text-[11px] font-bold uppercase">
                      0% No VAT
                    </SelectItem>
                    <SelectItem value="10" className="py-2 text-[11px] font-bold uppercase">
                      10% Reduced
                    </SelectItem>
                    <SelectItem value="20" className="py-2 text-[11px] font-bold uppercase">
                      20% Standard
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Card>

<<<<<<< HEAD
              <Card className="group rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-100 bg-purple-50 text-purple-600 shadow-inner transition-transform group-hover:scale-105">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                        Dynamic Pricing
                      </Label>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                        AI оптимизация
                      </p>
=======
              <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-3.5 shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-text-primary text-sm font-semibold">
                        Dynamic Pricing
                      </Label>
                      <p className="text-text-secondary mt-0.5 text-xs">AI оптимизация</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              <div className="h-1 w-5 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Unified Commerce Channels
              </h2>
=======
              <div className="bg-accent-primary h-1 w-5 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Unified Commerce Channels</h2>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 'b2b',
                  label: 'B2B Wholesale',
                  desc: 'Оптовые продажи',
                  enabled: true,
                  color: 'bg-blue-500',
                  icon: Briefcase,
                  margin: '45%',
                },
                {
                  id: 'b2c',
                  label: 'B2C Retail',
                  desc: 'Розничные продажи',
                  enabled: true,
                  color: 'bg-emerald-500',
                  icon: Package,
                  margin: '60%',
                },
                {
                  id: 'marketplaces',
                  label: 'Marketplaces',
                  desc: 'WB, Ozon, Lamoda',
                  enabled: true,
<<<<<<< HEAD
                  color: 'bg-purple-500',
=======
                  color: 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                  icon: Globe,
                  margin: '25%',
                },
                {
                  id: 'outlet',
                  label: 'Outlet',
                  desc: 'Распродажи',
                  enabled: true,
                  color: 'bg-amber-500',
                  icon: Truck,
                  margin: '40%',
                },
                {
                  id: 'resale',
                  label: 'Resale',
                  desc: 'C2C / Second-hand',
                  enabled: false,
<<<<<<< HEAD
                  color: 'bg-slate-400',
=======
                  color: 'bg-text-muted',
>>>>>>> recover/cabinet-wip-from-stash
                  icon: Activity,
                  margin: '35%',
                },
                {
                  id: 'dropship',
                  label: 'Dropship',
                  desc: 'Без складских запасов',
                  enabled: false,
<<<<<<< HEAD
                  color: 'bg-slate-400',
=======
                  color: 'bg-text-muted',
>>>>>>> recover/cabinet-wip-from-stash
                  icon: Zap,
                  margin: '50%',
                },
              ].map((channel, i) => (
                <Card
                  key={i}
<<<<<<< HEAD
                  className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100"
=======
                  className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg shadow-inner transition-transform group-hover:scale-105',
                        channel.enabled
                          ? `${channel.color} text-white`
<<<<<<< HEAD
                          : 'border border-slate-100 bg-slate-50 text-slate-400'
=======
                          : 'bg-bg-surface2 text-text-muted border-border-subtle border'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <channel.icon className="h-4 w-4" />
                    </div>
                    <Switch className="origin-right scale-[0.7]" defaultChecked={channel.enabled} />
                  </div>
<<<<<<< HEAD
                  <h3 className="mb-0.5 text-[11px] font-bold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                    {channel.label}
                  </h3>
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {channel.desc}
                  </p>
                  {channel.enabled && (
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Маржа</span>
                        <span className="text-slate-900">{channel.margin}</span>
                      </div>
                      <Button
                        variant="ghost"
                        className="h-7 w-full rounded-lg bg-slate-50 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white"
=======
                  <h3 className="text-text-primary group-hover:text-accent-primary mb-0.5 text-[11px] font-bold uppercase tracking-tight transition-colors">
                    {channel.label}
                  </h3>
                  <p className="text-text-secondary mb-4 text-xs font-medium">{channel.desc}</p>
                  {channel.enabled && (
                    <div className="border-border-subtle space-y-2 border-t pt-3">
                      <div className="text-text-secondary flex items-center justify-between px-1 text-xs font-medium">
                        <span>Маржа</span>
                        <span className="text-text-primary">{channel.margin}</span>
                      </div>
                      <Button
                        variant="ghost"
                        className="bg-bg-surface2 text-text-secondary hover:bg-accent-primary h-8 w-full rounded-lg text-xs font-medium shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                      >
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
              <div className="h-1 w-5 rounded-full bg-emerald-600" />
<<<<<<< HEAD
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Channel Sync Settings
              </h2>
            </div>
            <Card className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-indigo-100">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-1 w-4 rounded-full bg-indigo-500" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                      Инвентаризация
                    </h4>
=======
              <h2 className="text-text-primary text-sm font-semibold">Channel Sync Settings</h2>
            </div>
            <Card className="border-border-subtle hover:border-accent-primary/20 rounded-xl border bg-white p-3 shadow-sm transition-all">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="bg-accent-primary h-1 w-4 rounded-full" />
                    <h4 className="text-text-primary text-sm font-semibold">Инвентаризация</h4>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  {[
                    { label: 'Real-time sync', enabled: true },
                    { label: 'Auto-reserve', enabled: true },
                    { label: 'Safety stock', enabled: false },
                  ].map((item, i) => (
                    <div
                      key={i}
<<<<<<< HEAD
                      className="group/item flex items-center justify-between rounded-lg border border-slate-100/50 bg-slate-50/50 p-2 transition-all hover:border-indigo-100 hover:bg-white"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-indigo-600">
=======
                      className="bg-bg-surface2/80 border-border-subtle/50 hover:border-accent-primary/20 group/item flex items-center justify-between rounded-lg border p-2 transition-all hover:bg-white"
                    >
                      <span className="text-text-secondary group-hover/item:text-accent-primary text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.label}
                      </span>
                      <Switch className="origin-right scale-[0.65]" defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-1 w-4 rounded-full bg-emerald-500" />
<<<<<<< HEAD
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                      Pricing Rules
                    </h4>
=======
                    <h4 className="text-text-primary text-sm font-semibold">Pricing Rules</h4>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  {[
                    { label: 'Global MSRP', enabled: false },
                    { label: 'Margin protect', enabled: true },
                    { label: 'Promo sync', enabled: false },
                  ].map((item, i) => (
                    <div
                      key={i}
<<<<<<< HEAD
                      className="group/item flex items-center justify-between rounded-lg border border-slate-100/50 bg-slate-50/50 p-2 transition-all hover:border-emerald-100 hover:bg-white"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 group-hover/item:text-emerald-600">
=======
                      className="bg-bg-surface2/80 border-border-subtle/50 group/item flex items-center justify-between rounded-lg border p-2 transition-all hover:border-emerald-100 hover:bg-white"
                    >
                      <span className="text-text-secondary text-xs font-medium group-hover/item:text-emerald-600">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.label}
                      </span>
                      <Switch className="origin-right scale-[0.65]" defaultChecked={item.enabled} />
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
<<<<<<< HEAD
              <div className="h-1 w-5 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Developer Mode
              </h2>
=======
              <div className="bg-accent-primary h-1 w-5 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Developer Mode</h2>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Code, title: 'Dev Mode', desc: 'Advanced tools', enabled: false },
                { icon: Database, title: 'Debug Logs', desc: 'Detailed tracing', enabled: false },
                { icon: Zap, title: 'API Rate', desc: 'Limit requests', enabled: true },
                { icon: FileText, title: 'Audit Trail', desc: 'Action logs', enabled: true },
              ].map((item, i) => (
                <Card
                  key={i}
<<<<<<< HEAD
                  className="group rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100"
=======
                  className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-3.5 shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                        item.enabled
<<<<<<< HEAD
                          ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                          : 'border-slate-100 bg-slate-50 text-slate-400'
=======
                          ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                          : 'bg-bg-surface2 text-text-muted border-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <Switch className="origin-right scale-[0.7]" defaultChecked={item.enabled} />
                  </div>
<<<<<<< HEAD
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                    {item.title}
                  </Label>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-tight text-slate-400">
                    {item.desc}
                  </p>
=======
                  <Label className="text-text-primary text-sm font-semibold">{item.title}</Label>
                  <p className="text-text-secondary mt-0.5 text-xs">{item.desc}</p>
>>>>>>> recover/cabinet-wip-from-stash
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {/* Backup & Export */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <div className="h-1 w-5 rounded-full bg-emerald-600" />
<<<<<<< HEAD
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Data Management
                </h2>
              </div>
              <Card className="group rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-emerald-100">
=======
                <h2 className="text-text-primary text-sm font-semibold">Data Management</h2>
              </div>
              <Card className="border-border-subtle group rounded-xl border bg-white p-3 shadow-sm transition-all hover:border-emerald-100">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
<<<<<<< HEAD
                      <h3 className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
                        Backup & Export
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Full Data control
                      </p>
=======
                      <h3 className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
                        Backup & Export
                      </h3>
                      <p className="text-text-secondary text-xs font-medium">Full Data control</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
<<<<<<< HEAD
                      className="h-8 w-full justify-between rounded-lg border-slate-200 bg-slate-50/50 px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:border-emerald-200 hover:bg-white hover:text-emerald-600"
=======
                      className="border-border-default bg-bg-surface2/80 h-9 w-full justify-between rounded-lg px-3 text-xs font-medium shadow-sm transition-all hover:border-emerald-200 hover:bg-white hover:text-emerald-600"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <span>Full Database (JSON)</span>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
<<<<<<< HEAD
                      className="h-8 w-full justify-between rounded-lg border-slate-200 bg-slate-50/50 px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:border-emerald-200 hover:bg-white hover:text-emerald-600"
=======
                      className="border-border-default bg-bg-surface2/80 h-9 w-full justify-between rounded-lg px-3 text-xs font-medium shadow-sm transition-all hover:border-emerald-200 hover:bg-white hover:text-emerald-600"
>>>>>>> recover/cabinet-wip-from-stash
                    >
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
                <div className="h-1 w-5 rounded-full bg-rose-600" />
<<<<<<< HEAD
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Danger Zone
                </h2>
=======
                <h2 className="text-text-primary text-sm font-semibold">Danger Zone</h2>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <Card className="group rounded-xl border border-2 border-dashed border-rose-100 bg-rose-50/30 p-3 shadow-sm transition-all hover:bg-rose-50/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-100 text-rose-600 shadow-inner transition-transform group-hover:scale-105">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-tight text-rose-900">
                        Critical Actions
                      </h3>
<<<<<<< HEAD
                      <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                        Irreversible operations
                      </p>
=======
                      <p className="text-xs font-medium text-rose-500">Irreversible operations</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
<<<<<<< HEAD
                      className="h-8 w-full justify-start rounded-lg border-rose-200 px-3 text-[9px] font-bold uppercase tracking-widest text-rose-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-100"
=======
                      className="h-9 w-full justify-start rounded-lg border-rose-200 px-3 text-xs font-medium text-rose-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-100"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Factory Reset
                    </Button>
                    <Button
                      variant="outline"
<<<<<<< HEAD
                      className="h-8 w-full justify-start rounded-lg border-rose-400 px-3 text-[9px] font-bold uppercase tracking-widest text-rose-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-200"
=======
                      className="h-9 w-full justify-start rounded-lg border-rose-400 px-3 text-xs font-medium text-rose-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-200"
>>>>>>> recover/cabinet-wip-from-stash
                    >
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
    </RegistryPageShell>
  );
}
