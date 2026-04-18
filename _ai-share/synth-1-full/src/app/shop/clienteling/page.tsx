'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash
import {
  UserCircle,
  ShoppingCart,
  Heart,
  Star,
  Clock,
  MapPin,
  History,
  Zap,
  BrainCircuit,
  Info,
  MessageSquare,
  Plus,
  Search,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Scale,
  Package,
  Layers,
  Sparkles,
  UserCheck,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CustomerProfile, RecommendationEngineResult } from '@/lib/types/clienteling';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Clienteling 2.0 Dash — Shop OS
 * Планшет продавца с глубоким профилем клиента и AI-рекомендациями.
 */

export default function ClientelingDashPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'recommendations'>('profile');
  const [customer, setCustomer] = useState<CustomerProfile>({
    id: 'C-8812',
    name: 'Alexandra Romanova',
    email: 'alexandra.r@example.com',
    phone: '+7 900 123-45-67',
    avatarUrl: '/avatars/alexandra.jpg',
    totalSpent: 4250,
    lastVisit: '2026-03-05T14:00:00Z',
    loyaltyTier: 'gold',
    loyaltyPoints: 1250,
    measurements: {
      id: 'm-1',
      userId: 'C-8812',
      unit: 'cm',
      height: 172,
      weight: 60,
      chest: 88,
      waist: 65,
      hips: 92,
      shoulderWidth: 40,
      armLength: 58,
<<<<<<< HEAD
      legLength: 102,
      scanMethod: 'photo_ai',
      lastUpdated: '2026-02-15T10:00:00Z',
=======
      insideLeg: 102,
      scannedAt: '2026-02-15T10:00:00Z',
      scanMethod: 'ai_vision',
>>>>>>> recover/cabinet-wip-from-stash
    },
    stylePreferences: ['Oversized', 'Minimalism', 'Natural Fabrics'],
    favoriteCategories: ['Knitwear', 'Dresses', 'Outerwear'],
    dislikedMaterials: ['Polyester', 'Synthetic fur'],
    wishlist: ['P-101', 'P-102'],
    purchaseHistory: [
      {
        orderId: 'ORD-1',
        date: '2026-02-15',
        amount: 850,
        items: [{ productId: 'p-1', name: 'Silk Blouse', size: 'S', color: 'White' }],
        storeId: 'Moscow City',
      },
      {
        orderId: 'ORD-2',
        date: '2025-12-20',
        amount: 1200,
        items: [{ productId: 'p-2', name: 'Wool Coat', size: 'S', color: 'Camel' }],
        storeId: 'Online',
      },
    ],
    staffNotes: [
      {
        id: 'n-1',
        staffId: 'S-42',
        staffName: 'Elena K.',
        text: 'Предпочитает примерку в отдельной кабине. Любит кофе без молока.',
        createdAt: '2026-02-15',
      },
    ],
  });

  const recommendations: RecommendationEngineResult = {
    customerId: 'C-8812',
    suggestedProducts: [
      {
        productId: 'p-1',
        name: 'Silk Trousers',
        reason: 'Matches previous purchase of Silk Blouse',
        score: 98,
      },
      {
        productId: 'p-2',
        name: 'Cashmere Sweater',
        reason: 'Fits preference for Minimalism & Natural Fabrics',
        score: 92,
      },
      {
        productId: 'p-3',
        name: 'Leather Belt',
        reason: 'Perfect accessory for the Oversized look',
        score: 85,
      },
<<<<<<< HEAD
    ] as any,
=======
    ],
>>>>>>> recover/cabinet-wip-from-stash
    styleInsight: 'Клиент ценит тактильность и качество швов. Фокус на материалах.',
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-10 px-4 py-4">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
=======
    <RegistryPageShell className="max-w-5xl space-y-10">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <UserCheck className="h-3 w-3" />
            Clienteling 2.0 Intelligence
          </div>
          <h1 className="font-headline text-sm font-black uppercase tracking-tighter">
            Customer Tablet
          </h1>
          <p className="font-medium text-muted-foreground">
            Инструмент продавца: глубокий профиль клиента и AI-ассистент продаж.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
<<<<<<< HEAD
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <Input
              placeholder="Поиск клиента (Имя/Телефон)"
              className="h-11 w-64 rounded-xl border-slate-100 pl-9 text-xs shadow-sm"
            />
          </div>
          <Button className="h-11 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-slate-200">
=======
            <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск клиента (Имя/Телефон)"
              className="border-border-subtle h-11 w-64 rounded-xl pl-9 text-xs shadow-sm"
            />
          </div>
          <Button className="bg-text-primary h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-4 w-4" /> Новый клиент
          </Button>
        </div>
      </header>

      {/* Profile Header Card */}
<<<<<<< HEAD
      <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-xl shadow-slate-200/50">
        <div className="absolute right-0 top-0 h-96 w-96 -translate-y-32 translate-x-32 rounded-full bg-indigo-50 opacity-30" />

        <div className="relative z-10 flex flex-col items-start gap-3 md:flex-row">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-slate-100 shadow-xl">
            <UserCircle className="h-24 w-24 text-slate-300" />
=======
      <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-md shadow-xl">
        <div className="bg-accent-primary/10 absolute right-0 top-0 h-96 w-96 -translate-y-32 translate-x-32 rounded-full opacity-30" />

        <div className="relative z-10 flex flex-col items-start gap-3 md:flex-row">
          <div className="bg-bg-surface2 flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-4 border-white shadow-xl">
            <UserCircle className="text-text-muted h-24 w-24" />
>>>>>>> recover/cabinet-wip-from-stash
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-black uppercase tracking-tighter">{customer.name}</h2>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-6 px-3 text-[10px] font-black uppercase',
                    customer.loyaltyTier === 'gold'
                      ? 'border-amber-100 bg-amber-50 text-amber-600'
<<<<<<< HEAD
                      : 'border-slate-100 bg-slate-50 text-slate-400'
=======
                      : 'bg-bg-surface2 text-text-muted border-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {customer.loyaltyTier.toUpperCase()} MEMBER
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3">
<<<<<<< HEAD
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Phone className="h-3 w-3" /> {customer.phone}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Mail className="h-3 w-3" /> {customer.email}
                </div>
                <div className="flex items-center gap-1.5 rounded bg-indigo-50 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-indigo-600">
                  <Star className="h-3 w-3 fill-indigo-600" /> {customer.loyaltyPoints} POINTS
=======
                <div className="text-text-muted flex items-center gap-1.5 text-xs font-bold">
                  <Phone className="h-3 w-3" /> {customer.phone}
                </div>
                <div className="text-text-muted flex items-center gap-1.5 text-xs font-bold">
                  <Mail className="h-3 w-3" /> {customer.email}
                </div>
                <div className="text-accent-primary bg-accent-primary/10 flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-black uppercase tracking-widest">
                  <Star className="fill-accent-primary h-3 w-3" /> {customer.loyaltyPoints} POINTS
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-6 md:grid-cols-4">
=======
            <div className="border-border-subtle grid grid-cols-2 gap-3 border-t pt-6 md:grid-cols-4">
>>>>>>> recover/cabinet-wip-from-stash
              {[
                {
                  label: 'Total Spent',
                  value: `$${customer.totalSpent.toLocaleString()}`,
                  icon: DollarSign,
<<<<<<< HEAD
                  color: 'text-slate-900',
=======
                  color: 'text-text-primary',
>>>>>>> recover/cabinet-wip-from-stash
                },
                {
                  label: 'Last Visit',
                  value: '2 дня назад',
                  icon: Clock,
<<<<<<< HEAD
                  color: 'text-indigo-600',
=======
                  color: 'text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                },
                {
                  label: 'Items in Wishlist',
                  value: customer.wishlist.length,
                  icon: Heart,
                  color: 'text-rose-500',
                },
                { label: 'Purchased Items', value: '12', icon: Package, color: 'text-emerald-600' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
<<<<<<< HEAD
                  <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                  <p className="text-text-muted flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    <stat.icon className="h-2.5 w-2.5" /> {stat.label}
                  </p>
                  <p className={cn('text-base font-black', stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
<<<<<<< HEAD
            <Button className="h-12 rounded-xl bg-slate-900 px-8 text-[10px] font-black uppercase text-white shadow-xl shadow-slate-200">
=======
            <Button className="bg-text-primary h-12 rounded-xl px-8 text-[10px] font-black uppercase text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
              Оформить продажу
            </Button>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-12 rounded-xl border-slate-100 px-8 text-[10px] font-black uppercase hover:bg-slate-50"
=======
              className="border-border-subtle hover:bg-bg-surface2 h-12 rounded-xl px-8 text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Добавить замер (AI Scan)
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-12">
        {/* AI Style Assistant Panel */}
        <div className="space-y-6 lg:col-span-4">
<<<<<<< HEAD
          <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl shadow-indigo-100">
=======
          <Card className="shadow-accent-primary/10 bg-accent-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight">AI Sales Stylist</h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-medium leading-relaxed text-white/70">
                  "{recommendations.styleInsight}"
                </p>

                <div className="space-y-3 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Suggested for today
                  </p>
                  {recommendations.suggestedProducts.map((rec, i) => (
                    <div
                      key={i}
                      className="group flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                    >
<<<<<<< HEAD
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-indigo-200">
=======
                      <div className="text-accent-primary/40 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-black">
>>>>>>> recover/cabinet-wip-from-stash
                        {rec.score}%
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black uppercase tracking-tight">{rec.name}</p>
                        <p className="text-[9px] font-medium leading-tight text-white/40">
                          {rec.reason}
                        </p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 self-center text-white/20 transition-colors group-hover:text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
<<<<<<< HEAD
            <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-16 translate-y-16 rounded-full bg-indigo-400/20 blur-3xl" />
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="bg-accent-primary/20 absolute bottom-0 right-0 h-32 w-32 translate-x-16 translate-y-16 rounded-full blur-3xl" />
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-sm">
            <h3 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Staff Notes
            </h3>
            <div className="space-y-4">
              {customer.staffNotes.map((note) => (
<<<<<<< HEAD
                <div key={note.id} className="space-y-2 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium leading-relaxed text-slate-700">
                    "{note.text}"
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-[9px] font-black uppercase text-slate-400">
                      {note.staffName}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">{note.createdAt}</span>
=======
                <div key={note.id} className="bg-bg-surface2 space-y-2 rounded-2xl p-4">
                  <p className="text-text-primary text-xs font-medium leading-relaxed">
                    "{note.text}"
                  </p>
                  <div className="border-border-subtle flex items-center justify-between border-t pt-2">
                    <span className="text-text-muted text-[9px] font-black uppercase">
                      {note.staffName}
                    </span>
                    <span className="text-text-muted text-[9px] font-bold">{note.createdAt}</span>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
<<<<<<< HEAD
                className="h-10 w-full gap-2 rounded-xl text-[9px] font-black uppercase text-indigo-600 hover:bg-indigo-50"
=======
                className="text-accent-primary hover:bg-accent-primary/10 h-10 w-full gap-2 rounded-xl text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Plus className="h-3 w-3" /> Добавить заметку
              </Button>
            </div>
          </Card>
        </div>

        {/* Deep Profile Details */}
        <div className="space-y-6 lg:col-span-8">
<<<<<<< HEAD
          <div className="flex w-fit gap-2 rounded-2xl bg-slate-100/50 p-1">
=======
          <div className="bg-bg-surface2/50 flex w-fit gap-2 rounded-2xl p-1">
>>>>>>> recover/cabinet-wip-from-stash
            {[
              { id: 'profile', label: 'Style & Fit', icon: Layers },
              { id: 'history', label: 'Purchase History', icon: History },
              { id: 'recommendations', label: 'Full Catalog Match', icon: Sparkles },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  'h-10 gap-2 rounded-xl px-6 text-[9px] font-black uppercase transition-all',
<<<<<<< HEAD
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
=======
                  activeTab === tab.id ? 'text-text-primary bg-white shadow-sm' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            ))}
          </div>

<<<<<<< HEAD
          <Card className="min-h-[500px] overflow-hidden rounded-xl border-none bg-white p-3 shadow-xl shadow-slate-200/50">
=======
          <Card className="min-h-[500px] overflow-hidden rounded-xl border-none bg-white p-3 shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            {activeTab === 'profile' && (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-4">
<<<<<<< HEAD
                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">
=======
                    <h4 className="text-text-primary flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em]">
>>>>>>> recover/cabinet-wip-from-stash
                      <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Style DNA
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {customer.stylePreferences.map((pref) => (
                        <Badge
                          key={pref}
<<<<<<< HEAD
                          className="h-8 rounded-full border-none bg-slate-900 px-4 text-[8px] font-black uppercase text-white"
=======
                          className="bg-text-primary h-8 rounded-full border-none px-4 text-[8px] font-black uppercase text-white"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="space-y-4 border-t border-slate-50 pt-8">
                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">
=======
                  <div className="border-border-subtle space-y-4 border-t pt-8">
                    <h4 className="text-text-primary flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em]">
>>>>>>> recover/cabinet-wip-from-stash
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> Favorite
                      Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {customer.favoriteCategories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="outline"
<<<<<<< HEAD
                          className="h-8 rounded-full border-slate-200 px-4 text-[8px] font-black uppercase text-slate-500"
=======
                          className="text-text-secondary border-border-default h-8 rounded-full px-4 text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="space-y-4 border-t border-slate-50 pt-8">
=======
                  <div className="border-border-subtle space-y-4 border-t pt-8">
>>>>>>> recover/cabinet-wip-from-stash
                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-rose-600">
                      <AlertTriangle className="h-3.5 w-3.5" /> Restrictions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {customer.dislikedMaterials.map((mat) => (
                        <Badge
                          key={mat}
<<<<<<< HEAD
                          variant="ghost"
                          className="h-8 rounded-full bg-rose-50 px-4 text-[8px] font-black uppercase text-rose-600"
=======
                          variant="outline"
                          className="h-8 rounded-full border-rose-100 bg-rose-50 px-4 text-[8px] font-black uppercase text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {mat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="space-y-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">
=======
                <div className="bg-bg-surface2 space-y-4 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-text-primary text-[11px] font-black uppercase tracking-[0.1em]">
>>>>>>> recover/cabinet-wip-from-stash
                      Digital Twin (Body Metrics)
                    </h4>
                    <Badge
                      variant="outline"
                      className="h-5 border-emerald-100 bg-white px-2 text-[8px] font-black uppercase text-emerald-600"
                    >
                      Verified
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6">
                    {[
                      { label: 'Рост', value: `${customer.measurements?.height} cm` },
                      { label: 'Грудь', value: `${customer.measurements?.chest} cm` },
                      { label: 'Талия', value: `${customer.measurements?.waist} cm` },
                      { label: 'Бедра', value: `${customer.measurements?.hips} cm` },
<<<<<<< HEAD
                      { label: 'Shoulders', value: `${customer.measurements?.shoulders} cm` },
                      { label: 'Leg Length', value: `${customer.measurements?.legLength} cm` },
                    ].map((m, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-slate-400">{m.label}</p>
                        <p className="text-sm font-black text-slate-900">{m.value}</p>
=======
                      {
                        label: 'Ширина плеч',
                        value: `${customer.measurements?.shoulderWidth ?? '—'} cm`,
                      },
                      {
                        label: 'Длина шага',
                        value: `${customer.measurements?.insideLeg ?? '—'} cm`,
                      },
                    ].map((m, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-text-muted text-[9px] font-black uppercase">{m.label}</p>
                        <p className="text-text-primary text-sm font-black">{m.value}</p>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    ))}
                  </div>

<<<<<<< HEAD
                  <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                    <span className="text-[9px] font-black uppercase text-slate-400">
                      Last updated:{' '}
                      {new Date(customer.measurements?.lastUpdated!).toLocaleDateString()}
=======
                  <div className="border-border-default flex items-center justify-between border-t pt-6">
                    <span className="text-text-muted text-[9px] font-black uppercase">
                      Last updated:{' '}
                      {customer.measurements?.scannedAt
                        ? new Date(customer.measurements.scannedAt).toLocaleDateString()
                        : '—'}
>>>>>>> recover/cabinet-wip-from-stash
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
<<<<<<< HEAD
                      className="h-7 gap-1 rounded-lg p-0 text-[9px] font-black uppercase text-indigo-600"
=======
                      className="text-accent-primary h-7 gap-1 rounded-lg p-0 text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Update Scan <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                {customer.purchaseHistory.map((record, i) => (
                  <div
                    key={record.orderId}
<<<<<<< HEAD
                    className="group cursor-pointer rounded-3xl bg-slate-50 p-4 transition-all hover:bg-slate-100"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          {record.date}
                        </p>
                        <h5 className="text-sm font-black uppercase tracking-tighter text-slate-900">
=======
                    className="bg-bg-surface2 hover:bg-bg-surface2 group cursor-pointer rounded-3xl p-4 transition-all"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-text-muted text-[10px] font-black uppercase">
                          {record.date}
                        </p>
                        <h5 className="text-text-primary text-sm font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                          {record.orderId}
                        </h5>
                      </div>
                      <div className="text-right">
<<<<<<< HEAD
                        <p className="text-base font-black text-slate-900">${record.amount}</p>
                        <p className="text-[9px] font-black uppercase text-indigo-600">
=======
                        <p className="text-text-primary text-base font-black">${record.amount}</p>
                        <p className="text-accent-primary text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          {record.storeId}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {record.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
<<<<<<< HEAD
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
                            <Package className="h-5 w-5 text-slate-300" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-black uppercase tracking-tight text-slate-700">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
=======
                          <div className="border-border-default flex h-10 w-10 items-center justify-center rounded-xl border bg-white">
                            <Package className="text-text-muted h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-text-primary text-xs font-black uppercase tracking-tight">
                              {item.name}
                            </p>
                            <p className="text-text-muted text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                              {item.size} • {item.color}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="mx-auto max-w-sm space-y-6 py-10 text-center">
<<<<<<< HEAD
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                  <Sparkles className="h-10 w-10 animate-pulse text-indigo-600" />
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                  AI Catalog Integration
                </h3>
                <p className="text-sm font-medium leading-relaxed text-slate-400">
                  Анализ всего глобального стока (3000+ SKU) для подбора идеальных луков под ДНК
                  клиента.
                </p>
                <Button className="h-12 rounded-xl bg-slate-900 px-8 text-[10px] font-black uppercase text-white shadow-xl">
=======
                <div className="bg-accent-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                  <Sparkles className="text-accent-primary h-10 w-10 animate-pulse" />
                </div>
                <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                  AI Catalog Integration
                </h3>
                <p className="text-text-muted text-sm font-medium leading-relaxed">
                  Анализ всего глобального стока (3000+ SKU) для подбора идеальных луков под ДНК
                  клиента.
                </p>
                <Button className="bg-text-primary h-12 rounded-xl px-8 text-[10px] font-black uppercase text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                  Запустить полный подбор
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
