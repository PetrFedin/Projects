'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Factory,
  Video,
  Cpu,
  Activity,
  Zap,
  Box,
  Layers,
  Thermometer,
  ShieldCheck,
  Play,
  Info,
  ArrowUpRight,
  Maximize2,
  Calendar,
  Clock,
  User,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MOCK_SHOP_FLOORS = [
  {
    id: 'f1',
    name: 'Cutting Shop A',
    status: 'Active',
    load: 82,
    temp: 24,
    humidity: 45,
    items: ['Cyber Parka v2'],
    workers: 12,
  },
  {
    id: 'f2',
    name: 'Sewing Line 4',
    status: 'Active',
    load: 94,
    temp: 26,
    humidity: 42,
    items: ['Neural Cargo'],
    workers: 28,
  },
  {
    id: 'f3',
    name: 'Quality Control',
    status: 'Maintenance',
    load: 0,
    temp: 22,
    humidity: 40,
    items: [],
    workers: 0,
  },
];

export function ProductionDigitalTwin({ collectionId }: { collectionId?: string | null }) {
  const floors = useMemo(() => {
    if (!collectionId) return MOCK_SHOP_FLOORS;
    // Mock filtering by collectionId
    if (collectionId === 'SS26') return MOCK_SHOP_FLOORS.slice(0, 2);
    if (collectionId === 'DROP-UZ') return MOCK_SHOP_FLOORS.slice(1, 2);
    if (collectionId === 'BASIC') return MOCK_SHOP_FLOORS.slice(0, 1);
    return [];
  }, [collectionId]);

  const [activeFloor, setActiveFloor] = useState(floors[0] || MOCK_SHOP_FLOORS[0]);

  useEffect(() => {
    if (floors.length > 0) {
      setActiveFloor(floors[0]);
    }
  }, [floors]);

  if (!collectionId || (collectionId && floors.length === 0)) {
    return (
      <div className="space-y-4 pb-20">
        <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-900 p-2.5 text-white shadow-xl shadow-slate-200">
                <Cpu className="h-6 w-6" />
              </div>
              <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">
                Production Digital Twin
              </h1>
            </div>
            <p className="font-medium italic text-slate-500">
              Виртуальный двойник производства: живой мониторинг цехов и контроль качества в
              реальном времени.
            </p>
          </div>
        </header>
        <Card className="flex h-[500px] flex-col items-center justify-center gap-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 p-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-100 bg-white shadow-lg">
            <Factory className="h-10 w-10 text-slate-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">
              Цехи не подключены
            </h3>
            <p className="mx-auto max-w-xs text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Для этой коллекции еще не распределены производственные мощности.
            </p>
          </div>
          <Button className="h-12 rounded-xl bg-black px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-600">
            Связаться с производством
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-2.5 text-white shadow-xl shadow-slate-200">
              <Cpu className="h-6 w-6" />
            </div>
            <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">
              Production Digital Twin
            </h1>
          </div>
          <p className="font-medium italic text-slate-500">
            Виртуальный двойник производства: живой мониторинг цехов и контроль качества в реальном
            времени.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-700">
              IoT Core: Connected
            </span>
          </div>
          <Button className="h-12 rounded-2xl bg-indigo-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-100">
            <Video className="mr-2 h-4 w-4" /> Live Все камеры
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        {/* Factory Map / Floor List */}
        <div className="space-y-6 xl:col-span-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Shop Floors (Milan Hub)
            </h3>
            <Badge variant="outline" className="border-slate-200 text-[8px] font-black uppercase">
              3 Floors Online
            </Badge>
          </div>
          <div className="space-y-4">
            {floors.map((floor) => (
              <Card
                key={floor.id}
                onClick={() => setActiveFloor(floor)}
                className={cn(
                  'group cursor-pointer rounded-xl border-none shadow-sm transition-all',
                  activeFloor.id === floor.id
                    ? 'scale-[1.02] bg-slate-900 text-white shadow-2xl'
                    : 'bg-white hover:bg-slate-50'
                )}
              >
                <CardContent className="p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          activeFloor.id === floor.id ? 'bg-white/10' : 'bg-slate-100'
                        )}
                      >
                        <Factory
                          className={cn(
                            'h-5 w-5',
                            activeFloor.id === floor.id ? 'text-indigo-400' : 'text-slate-400'
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-tight">
                          {floor.name}
                        </p>
                        <p
                          className={cn(
                            'text-[9px] font-bold uppercase',
                            activeFloor.id === floor.id ? 'text-slate-400' : 'text-slate-400'
                          )}
                        >
                          {floor.status} • {floor.workers} workers
                        </p>
                      </div>
                    </div>
                    {floor.status === 'Active' && (
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="opacity-40">Floor Load</span>
                      <span>{floor.load}%</span>
                    </div>
                    <Progress
                      value={floor.load}
                      className={cn(
                        'h-1',
                        activeFloor.id === floor.id ? 'bg-white/10' : 'bg-slate-100'
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Digital Twin Viewport */}
        <div className="space-y-4 xl:col-span-8">
          <Card className="flex h-[600px] flex-col overflow-hidden rounded-xl border-none bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Badge className="h-6 border-none bg-indigo-600 px-3 text-[8px] font-black uppercase text-white">
                  Live Feed
                </Badge>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                  {activeFloor.name} - View Cam 02
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl shadow-sm hover:bg-white"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl text-rose-500 shadow-sm hover:bg-white"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden bg-slate-900">
              {/* Simulated Camera Feed */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200')] bg-cover bg-center opacity-60 mix-blend-overlay" />

              {/* Digital Overlay Labels */}
              <div className="absolute inset-0 p-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute left-40 top-20 rounded-2xl border border-indigo-400 bg-indigo-600/80 p-4 text-white shadow-2xl backdrop-blur-md"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Box className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase">Batch ID: #CYBER-26-A</span>
                  </div>
                  <p className="text-[10px] font-black uppercase">Cyber Parka v2 (Cutting)</p>
                  <p className="mt-1 text-[8px] font-bold uppercase text-white/60">Progress: 84%</p>
                </motion.div>

                <div className="absolute bottom-10 right-10 flex gap-3">
                  <div className="min-w-[120px] rounded-2xl border border-white/10 bg-black/40 p-4 text-white backdrop-blur-xl">
                    <div className="mb-2 flex items-center gap-2 opacity-40">
                      <Thermometer className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase">Temp</span>
                    </div>
                    <p className="text-base font-black">{activeFloor.temp}°C</p>
                  </div>
                  <div className="min-w-[120px] rounded-2xl border border-white/10 bg-black/40 p-4 text-white backdrop-blur-xl">
                    <div className="mb-2 flex items-center gap-2 opacity-40">
                      <Activity className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase">Humidity</span>
                    </div>
                    <p className="text-base font-black">{activeFloor.humidity}%</p>
                  </div>
                </div>
              </div>

              {/* Scanline Effect */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
            </div>
            <CardFooter className="grid grid-cols-3 gap-3 border-t border-slate-50 bg-white p-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Active Batch
                </p>
                <p className="text-sm font-black uppercase text-slate-900">Cyber Parka v2</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Est. Completion
                </p>
                <p className="text-sm font-black uppercase text-indigo-600">Today, 18:00</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Quality Check
                </p>
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-sm font-black uppercase">Passed (99.2%)</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
