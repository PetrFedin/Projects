'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Leaf,
  Factory,
  Globe,
  Database,
  QrCode,
  Fingerprint,
  Info,
  Share2,
  ArrowLeft,
  Lock,
  History,
  CheckCircle2,
  Zap,
  Truck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function DigitalProductPassport() {
  const [activeTab, setActiveTab] = useState<'origin' | 'eco' | 'verify'>('origin');

  return (
    <div className="mx-auto max-w-2xl space-y-4 duration-1000 animate-in fade-in">
      {/* Mobile-Style Header */}
      <header className="border-border-subtle sticky top-4 z-50 flex items-center justify-between rounded-xl border bg-white/80 p-4 shadow-xl backdrop-blur-md">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
            Digital Passport v2.0
          </p>
          <h1 className="text-sm font-black uppercase tracking-tighter">Urban Tech Parka #001</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Product visual */}
      <div className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"
          alt="Product"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-6 top-4 flex flex-col gap-2">
          <Badge className="border-none bg-emerald-500 px-3 py-1 text-[9px] font-black uppercase text-white">
            Verified Authentic
          </Badge>
          <Badge className="border-none bg-black/50 px-3 py-1 text-[9px] font-black uppercase text-white backdrop-blur-md">
            Blockchain ID: 0x82...f42
          </Badge>
        </div>
        <div className="absolute bottom-6 right-6">
          <div className="h-12 w-12 rounded-2xl bg-white p-2 shadow-2xl">
            <QrCode className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="bg-bg-surface2 border-border-default flex rounded-3xl border p-1.5">
        {['origin', 'eco', 'verify'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              'flex-1 rounded-2xl py-3 text-[10px] font-black uppercase transition-all',
              activeTab === tab ? 'text-text-primary bg-white shadow-sm' : 'text-text-muted'
            )}
          >
            {tab === 'origin' ? 'История' : tab === 'eco' ? 'Экология' : 'Подлинность'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'origin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-border-subtle space-y-4 rounded-xl p-4 shadow-sm">
              <div className="border-border-subtle flex items-center gap-3 border-b pb-6">
                <div className="bg-accent-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <History className="text-accent-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight">Путь изделия</h3>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    От фермы до ваших рук
                  </p>
                </div>
              </div>

              <div className="before:bg-bg-surface2 relative space-y-4 before:absolute before:bottom-2 before:left-6 before:top-2 before:w-0.5">
                {[
                  {
                    stage: 'Ферма (Сырье)',
                    location: 'Tasmania, AU',
                    date: 'Сен 2025',
                    icon: Leaf,
                    desc: 'Шерсть мериноса высшей категории.',
                  },
                  {
                    stage: 'Производство ткани',
                    location: 'Biella, IT',
                    date: 'Окт 2025',
                    icon: Factory,
                    desc: 'Ткачество и финишная обработка.',
                  },
                  {
                    stage: 'Пошив коллекции',
                    location: 'Moscow, RU',
                    date: 'Дек 2025',
                    icon: Scissors,
                    desc: 'Финальная сборка в Syntha Factory.',
                  },
                  {
                    stage: 'Ваша покупка',
                    location: 'Syntha Store',
                    date: 'Янв 2026',
                    icon: ShoppingBag,
                    desc: 'Продано и верифицировано.',
                  },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex gap-3">
                    <div className="border-border-subtle flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 bg-white shadow-sm">
                      <step.icon className="text-text-muted h-5 w-5" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between">
                        <p className="text-text-primary text-[11px] font-black uppercase">
                          {step.stage}
                        </p>
                        <span className="text-text-muted text-[9px] font-bold uppercase">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-accent-primary text-[10px] font-bold uppercase tracking-tighter">
                        {step.location}
                      </p>
                      <p className="text-text-secondary text-xs font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'eco' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="relative space-y-4 overflow-hidden rounded-xl border-none bg-emerald-900 p-4 text-white">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Leaf className="h-40 w-40" />
              </div>
              <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                  Sustainability Score
                </p>
                <h3 className="text-sm font-black uppercase tracking-tighter">Elite Grade</h3>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-emerald-300">
                    Carbon Footprint
                  </p>
                  <h4 className="text-sm font-black tabular-nums">
                    4.2 <span className="text-xs text-emerald-500">kg CO2</span>
                  </h4>
                  <Progress value={20} className="h-1 bg-emerald-800" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-emerald-300">Water Saved</p>
                  <h4 className="text-sm font-black tabular-nums">
                    1.2k <span className="text-xs text-emerald-500">liters</span>
                  </h4>
                  <Progress value={85} className="h-1 bg-emerald-800" />
                </div>
              </div>
              <div className="relative z-10 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[10px] font-medium italic leading-relaxed">
                  «Это изделие на 88% состоит из переработанных материалов. Произведено с
                  использованием солнечной энергии на фабрике Syntha.»
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-border-subtle space-y-4 rounded-xl p-3 text-center shadow-xl">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-tighter">
                  Authenticity Verified
                </h3>
                <p className="text-text-secondary text-sm font-medium">
                  Это изделие является оригинальным продуктом бренда Syntha Lab.
                </p>
              </div>
              <div className="space-y-4 pt-4">
                <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="text-accent-primary h-5 w-5" />
                    <span className="text-text-primary text-[10px] font-black uppercase">
                      NFC Chip Status
                    </span>
                  </div>
                  <Badge className="border-none bg-emerald-500 text-[8px] font-black uppercase text-white">
                    Active
                  </Badge>
                </div>
                <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="text-accent-primary h-5 w-5" />
                    <span className="text-text-primary text-[10px] font-black uppercase">
                      Blockchain Record
                    </span>
                  </div>
                  <span className="text-text-muted text-[10px] font-bold">View on Etherscan</span>
                </div>
              </div>
              <div className="bg-bg-surface2 text-text-primary border-border-default rounded-xl border p-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest">
                  Владение изделием
                </p>
                <p className="mb-6 text-xs opacity-70">
                  Ваш цифровой паспорт подтверждает право собственности и подлинность изделия на
                  протяжении всего жизненного цикла.
                </p>
                <Button className="text-text-primary border-border-default h-12 w-full rounded-2xl border bg-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                  История обслуживания
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <footer className="pb-20 text-center">
        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
          © 2026 Syntha Ecosystem • All rights reserved
        </p>
      </footer>
    </div>
  );
}

function Scissors(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <path d="M8.12 8.12 12 12" />
      <path d="M20 4 8.12 15.88" />
      <circle cx="6" cy="18" r="3" />
      <path d="M14.8 14.8 20 20" />
    </svg>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
