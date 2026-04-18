'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Box, Truck, Zap, Filter, Search, ShieldCheck, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bToolTitle } from '@/components/shop/ShopB2bToolHeader';

export default function StockMapPage() {
  const warehouses = [
    {
      id: 'w1',
      name: 'Milan Central Hub',
      location: 'Milan, IT',
      stock: 12450,
      status: 'Optimal',
      type: 'Production',
      lat: '45.4642',
      lng: '9.1899',
    },
    {
      id: 'w2',
      name: 'Moscow North',
      location: 'Moscow, RU',
      stock: 8200,
      status: 'Low Stock',
      type: 'Distribution',
      lat: '55.7558',
      lng: '37.6173',
    },
    {
      id: 'w3',
      name: 'Dubai Logistics',
      location: 'Dubai, UAE',
      stock: 15900,
      status: 'Optimal',
      type: 'Regional Hub',
      lat: '25.2048',
      lng: '55.2708',
    },
    {
      id: 'w4',
      name: 'Shanghai Factory',
      location: 'Shanghai, CN',
      stock: 45000,
      status: 'High Stock',
      type: 'Manufacturing',
      lat: '31.2304',
      lng: '121.4737',
    },
  ];

  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);

  return (
    <RegistryPageShell className="!mx-0 flex h-[calc(100vh-64px)] max-w-none flex-col overflow-hidden !rounded-none bg-[#F8F9FB] !p-0">
      {/* Left Sidebar - Inventory List */}
      <aside className="z-10 flex w-96 flex-col border-r bg-white shadow-2xl">
        <div className="space-y-6 border-b p-4">
          <div className="flex items-center justify-between">
            <ShopB2bToolTitle visual="sm" className="tracking-tighter">
              Global Stock
            </ShopB2bToolTitle>
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <Box className="h-4 w-4" />
            </div>
          </div>
          <div className="relative">
            <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по складу или SKU..."
              className="border-border-default focus:ring-accent-primary h-11 w-full rounded-xl pl-10 pr-4 text-sm outline-none transition-all focus:ring-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border-default h-10 flex-1 rounded-xl text-[10px] font-black uppercase"
            >
              <Filter className="mr-2 h-3.5 w-3.5" /> Фильтры
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border-default h-10 flex-1 rounded-xl text-[10px] font-black uppercase"
            >
              <Truck className="mr-2 h-3.5 w-3.5" /> В пути
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 p-4">
            {warehouses.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWarehouse(w)}
                className={cn(
                  'group cursor-pointer rounded-xl border-2 p-3 transition-all',
                  selectedWarehouse.id === w.id
                    ? 'border-accent-primary bg-accent-primary/10 shadow-accent-primary/10 shadow-xl'
                    : 'border-border-subtle hover:border-border-default bg-white'
                )}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-text-muted text-[10px] font-black uppercase leading-none tracking-widest">
                      {w.type}
                    </p>
                    <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                      {w.name}
                    </h3>
                  </div>
                  <Badge
                    className={cn(
                      'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                      w.status === 'Optimal'
                        ? 'bg-emerald-100 text-emerald-600'
                        : w.status === 'Low Stock'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-accent-primary/15 text-accent-primary'
                    )}
                  >
                    {w.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                      Available
                    </p>
                    <p className="text-text-primary text-sm font-black tabular-nums">
                      {w.stock.toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                      Last Sync
                    </p>
                    <p className="text-text-secondary text-xs font-bold">2 min ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content - Map Visualization */}
      <main className="bg-bg-surface2 relative flex-1 overflow-hidden">
        {/* Background Map Simulation */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#E5E9EC]">
          <div className="relative h-full w-full opacity-40 grayscale transition-all duration-1000 group-hover:grayscale-0">
            <img
              src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2000"
              className="h-full w-full object-cover"
              alt="World map"
            />
          </div>

          {/* Map Pins */}
          {warehouses.map((w) => (
            <div
              key={w.id}
              className="absolute transition-all duration-500"
              style={{
                top: `${30 + parseInt(w.id.slice(1)) * 15}%`,
                left: `${20 + parseInt(w.id.slice(1)) * 20}%`,
              }}
            >
              <div
                className={cn(
                  'relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 border-white shadow-2xl transition-transform hover:scale-125',
                  selectedWarehouse.id === w.id
                    ? 'bg-accent-primary z-10 scale-125'
                    : 'bg-text-muted opacity-60'
                )}
              >
                <MapPin className="h-5 w-5 text-white" />
                {selectedWarehouse.id === w.id && (
                  <div className="bg-accent-primary absolute inset-0 animate-ping rounded-full opacity-25" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Detail Panel */}
        <div className="absolute bottom-10 left-10 right-10">
          <Card className="rounded-xl border-none bg-white/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-text-primary text-sm font-black uppercase tracking-tighter">
                      {selectedWarehouse.name}
                    </h2>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      {selectedWarehouse.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase">Верифицированный узел</span>
                </div>
              </div>

              <div className="border-border-default space-y-2 border-x px-8">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Пропускная способность
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-base font-black tabular-nums">85%</span>
                  <div className="bg-bg-surface2 mb-2 h-2 w-full overflow-hidden rounded-full">
                    <div className="bg-accent-primary h-full w-[85%]" />
                  </div>
                </div>
                <p className="text-text-secondary text-[9px] italic">
                  На 15% выше среднего по региону
                </p>
              </div>

              <div className="border-border-default space-y-4 border-r px-8">
                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                    Средняя отгрузка
                  </p>
                  <Clock className="text-text-muted h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black tabular-nums">2.4 дня</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                    Express Priority
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <Button className="bg-text-primary group h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
                  Просмотр SKU на складе{' '}
                  <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
                </Button>
                <Button
                  variant="outline"
                  className="border-border-default h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Связаться с логистом
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Controls */}
        <div className="absolute right-10 top-3 flex flex-col gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="text-text-secondary h-12 w-12 rounded-2xl border-none bg-white shadow-xl"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="text-text-secondary h-12 w-12 rounded-2xl border-none bg-white shadow-xl"
          >
            <MinusIcon className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </RegistryPageShell>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function MinusIcon(props: any) {
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
      <path d="M5 12h14" />
    </svg>
  );
}
