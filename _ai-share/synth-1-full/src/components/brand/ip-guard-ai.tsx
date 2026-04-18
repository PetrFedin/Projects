'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  ShieldAlert,
  Eye,
  Search,
  ExternalLink,
  FileText,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  Globe,
  Scale,
  Camera,
  Zap,
  Fingerprint,
  Lock,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DETECTIONS = [
  {
    id: 'd1',
    marketplace: 'AliExpress',
    title: 'High Tech Urban Jacket (Replica)',
    price: '3,200 ₽',
    match: 94,
    status: 'risk',
    date: 'Сегодня',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
  },
  {
    id: 'd2',
    marketplace: 'Wildberries',
    title: 'Куртка мужская демисезонная (Design Copy)',
    price: '4,500 ₽',
    match: 82,
    status: 'warning',
    date: 'Вчера',
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200',
  },
  {
    id: 'd3',
    marketplace: 'Ozon',
    title: 'Брюки в стиле Syntha Lab',
    price: '2,800 ₽',
    match: 75,
    status: 'ignored',
    date: '2 дня назад',
    image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=200',
  },
];

export function IpGuardAi() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(true);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="bg-rose-600 p-3 pb-4 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-200">
                Brand Protection Engine
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              IP Guard AI
            </CardTitle>
            <CardDescription className="font-medium italic text-rose-100">
              Автоматический поиск копий вашего дизайна на маркетплейсах и защита авторских прав.
            </CardDescription>
          </div>
          <Button
            onClick={startScan}
            disabled={isScanning}
            className="h-12 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-rose-600 shadow-xl hover:bg-rose-50"
          >
            {isScanning ? (
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Запустить сканер IP
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Main Status Feed */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
                Обнаруженные совпадения
              </h4>
              <div className="flex gap-2">
                <Badge className="bg-bg-surface2 text-text-secondary border-none text-[8px] font-black uppercase">
                  Marketplaces: 12
                </Badge>
                <Badge className="bg-bg-surface2 text-text-secondary border-none text-[8px] font-black uppercase">
                  Social Media: 42
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-bg-surface2 flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-rose-200 p-4 text-center"
                  >
                    <RefreshCcw className="h-10 w-10 animate-spin text-rose-500" />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tighter">
                        Нейронное сравнение визуальных кодов...
                      </p>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Проверка WB, OZON, Ali, Lamoda, Instagram
                      </p>
                    </div>
                    <div className="w-full max-w-sm">
                      <Progress value={scanProgress} className="bg-border-subtle h-1.5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isScanning &&
                MOCK_DETECTIONS.map((det) => (
                  <motion.div
                    key={det.id}
                    layoutId={det.id}
                    className="border-border-subtle group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-rose-100 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="border-border-subtle relative h-20 w-12 overflow-hidden rounded-2xl border shadow-sm">
                        <Image src={det.image} alt="Detection" fill className="object-cover" />
                        <div className="absolute inset-0 bg-rose-600/20 opacity-0 mix-blend-multiply transition-opacity group-hover:opacity-100" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-rose-600">
                            {det.marketplace}
                          </span>
                          <Badge
                            className={cn(
                              'h-4 px-1.5 text-[7px] font-black uppercase',
                              det.status === 'risk'
                                ? 'bg-rose-500 text-white'
                                : det.status === 'warning'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-bg-surface2 text-text-muted'
                            )}
                          >
                            {det.match}% Match
                          </Badge>
                        </div>
                        <h5 className="text-text-primary text-sm font-black uppercase tracking-tight">
                          {det.title}
                        </h5>
                        <p className="text-text-muted text-[10px] font-bold uppercase">
                          {det.price} • {det.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-border-subtle hover:bg-bg-surface2 h-12 w-12 rounded-2xl p-0"
                      >
                        <Eye className="text-text-muted h-5 w-5" />
                      </Button>
                      <Button className="bg-text-primary h-12 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-rose-600">
                        <FileText className="mr-2 h-4 w-4" /> Сформировать претензию
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* IP Stats Sidebar */}
          <div className="space-y-4 lg:col-span-4">
            <div className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl p-4 text-white">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Fingerprint className="h-32 w-32" />
              </div>

              <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                  Design Assets Protected
                </p>
                <h3 className="text-sm font-black tabular-nums">
                  142 <span className="text-sm text-white/40">SKU</span>
                </h3>
              </div>

              <div className="relative z-10 space-y-4 pt-4">
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-white/60">
                      Успешных блокировок
                    </span>
                    <span className="text-[9px] font-black text-emerald-400">12 в этом мес.</span>
                  </div>
                  <Progress value={85} className="h-1 bg-white/10" />
                </div>
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-white/60">
                      Сохраненная маржа
                    </span>
                    <span className="text-[9px] font-black text-rose-400">4.2M ₽</span>
                  </div>
                  <Progress value={45} className="h-1 bg-white/10" />
                </div>
              </div>

              <Button className="relative z-10 h-10 w-full rounded-2xl bg-rose-600 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-colors hover:bg-rose-500">
                <Scale className="mr-2 h-4 w-4" /> Юридический пакет PRO
              </Button>
            </div>

            <div className="bg-accent-primary/10 border-accent-primary/20 flex items-start gap-3 rounded-xl border p-4">
              <div className="bg-accent-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-accent-primary text-[11px] font-black uppercase leading-none">
                  Smart Watermark
                </p>
                <p className="text-accent-primary/80 text-[10px] font-medium leading-relaxed">
                  Все ваши лекала и 3D-модели промаркированы невидимым цифровым кодом Syntha IP. Это
                  упрощает победу в судах на 100%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
