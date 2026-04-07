'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Navigation, 
  ChevronRight, 
  MapPin, 
  Scan, 
  Smartphone, 
  Compass, 
  Search, 
  X, 
  Camera, 
  Box, 
  Info, 
  Zap, 
  ShoppingCart,
  Map as MapIcon,
  Maximize2
} from "lucide-react";
import { MOCK_WAYPOINTS, MOCK_ITEMS, MOCK_ROUTES } from "@/lib/logic/ar-navigation-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ARNavigationPage() {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative flex flex-col">
      {/* Top Header */}
      <header className="p-4 flex items-center justify-between relative z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <Link href="/client" className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
            <X className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight italic">Syntha AR Navigator</h1>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-indigo-400" /> Tverskaya St. Store 12
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 h-6 flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-white animate-ping" /> AR Live
          </Badge>
          <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
            <Smartphone className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Experience View */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {!isARActive ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4 animate-in fade-in duration-700">
            <div className="relative">
              <div className="h-32 w-32 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 animate-pulse">
                <Box className="h-12 w-12 text-indigo-400" />
              </div>
              <div className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-2xl rotate-12">
                <Smartphone className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-3 max-w-sm">
              <h2 className="text-sm font-black uppercase tracking-tight">Погрузитесь в <span className="text-indigo-400 italic">AR Шоппинг</span></h2>
              <p className="text-sm text-white/60 font-medium leading-relaxed">
                Используйте камеру для навигации, поиска товаров и открытия скрытых предложений прямо в зале.
              </p>
            </div>
            
            <div className="w-full max-w-md grid grid-cols-1 gap-3">
              <Button 
                onClick={() => setIsARActive(true)}
                className="h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest transition-all shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 group"
              >
                <Scan className="h-6 w-6 group-hover:scale-110 transition-transform" /> Запустить AR
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white font-black uppercase text-[9px]">
                  <MapIcon className="h-4 w-4 mr-2" /> 2D Карта
                </Button>
                <Button variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white font-black uppercase text-[9px]">
                  <Compass className="h-4 w-4 mr-2" /> Маршруты
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            {/* Simulated Camera Feed */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale blur-[2px] opacity-40"
                alt="AR Feed"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              
              {/* Scan Reticle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/10 rounded-xl flex items-center justify-center">
                <div className="w-full h-1 bg-indigo-500/40 absolute top-1/2 -translate-y-1/2 animate-scan" />
              </div>

              {/* AR Waypoints Floating */}
              <div 
                className="absolute top-1/4 left-1/3 p-4 rounded-3xl bg-indigo-600/90 backdrop-blur-xl border border-white/20 shadow-2xl animate-bounce cursor-pointer group"
                onClick={() => setActiveWaypoint('w2')}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/60">Локация</p>
                    <p className="text-xs font-black uppercase">Новинки Сезона</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4 p-4 rounded-3xl bg-emerald-600/90 backdrop-blur-xl border border-white/20 shadow-2xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden">
                    <img src={MOCK_ITEMS[0].image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/60">Discovery</p>
                    <p className="text-xs font-black uppercase">Костюм "Tech Noir"</p>
                  </div>
                  <Badge className="bg-white text-emerald-600 font-black h-5 text-[8px]">-15%</Badge>
                </div>
              </div>
            </div>

            {/* AR Overlay Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-6 z-10">
              {/* Route Indicator */}
              <div className="p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 mb-0.5">Маршрут: Новинки</p>
                    <p className="text-sm font-black uppercase italic tracking-tight">Следуйте за стрелкой (20м)</p>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full border-2 border-white/20 flex items-center justify-center animate-spin-slow">
                   <div className="w-1.5 h-6 bg-indigo-500 rounded-full origin-bottom rotate-45" />
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="grid grid-cols-4 gap-3">
                <Button variant="outline" className="h-12 rounded-3xl border-white/10 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-1 group">
                   <Search className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                   <span className="text-[8px] font-black uppercase">Поиск</span>
                </Button>
                <Button variant="outline" className="h-12 rounded-3xl border-white/10 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-1 group">
                   <ShoppingCart className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                   <span className="text-[8px] font-black uppercase">Корзина</span>
                </Button>
                <Button variant="outline" className="h-12 rounded-3xl border-white/10 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-1 group">
                   <Info className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                   <span className="text-[8px] font-black uppercase">Гид</span>
                </Button>
                <Button 
                   onClick={() => setIsARActive(false)}
                   className="h-12 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white flex flex-col items-center justify-center gap-1"
                >
                   <Maximize2 className="h-5 w-5" />
                   <span className="text-[8px] font-black uppercase">Выход</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-32px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(32px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
