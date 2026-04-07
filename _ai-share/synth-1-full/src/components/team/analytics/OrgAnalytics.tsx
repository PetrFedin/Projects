'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, ShieldCheck, DollarSign } from 'lucide-react';
import { organizations } from '../_fixtures/team-data';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export function OrgAnalytics({ organizationId }: { organizationId?: string }) {
  const orgs = organizationId ? [organizations[organizationId]].filter(Boolean) : Object.values(organizations);

  const totalRevenue = orgs.reduce((acc, org) => acc + org.stats.totalRevenue, 0);
  const totalOrders = orgs.reduce((acc, org) => acc + org.stats.orderVolume, 0);
  const avgCompliance = orgs.reduce((acc, org) => acc + org.stats.complianceScore, 0) / orgs.length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black uppercase tracking-tighter">Аналитика Экосистемы</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Глобальный мониторинг показателей всех профилей</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <span className="text-[10px] font-black uppercase text-indigo-600">LIVE: ОБНОВЛЕНО 1 МИН НАЗАД</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'ВЫРУЧКА СЕТИ', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, icon: <DollarSign className="h-4 w-4" />, color: 'bg-green-50 text-green-600' },
          { label: 'ОБЪЕМ ЗАКАЗОВ', value: totalOrders.toLocaleString('ru-RU'), icon: <ShoppingBag className="h-4 w-4" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'АКТИВНЫЕ ПОЛЬЗОВАТЕЛИ', value: orgs.reduce((acc, o) => acc + o.stats.activeUsers, 0), icon: <Users className="h-4 w-4" />, color: 'bg-purple-50 text-purple-600' },
          { label: 'COMPLIANCE SCORE', value: `${avgCompliance.toFixed(1)}%`, icon: <ShieldCheck className="h-4 w-4" />, color: 'bg-amber-50 text-amber-600' }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-xl bg-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.color)}>
                  {stat.icon}
                </div>
                <div className="h-1.5 w-8 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 w-2/3" />
                </div>
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</h3>
              <p className="text-sm font-black">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 p-4 shadow-sm">
        <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Рейтинг Профилей
        </h3>
        <div className="space-y-4">
          {orgs.sort((a, b) => b.stats.totalRevenue - a.stats.totalRevenue).map((org) => (
            <div key={org.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-3">
                <img src={org.logo} alt={org.name} className="h-10 w-10 rounded-xl object-cover bg-slate-100" />
                <div>
                  <h4 className="text-sm font-black uppercase leading-none mb-1">{org.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{org.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">ВЫРУЧКА</p>
                  <p className="text-sm font-black">${(org.stats.totalRevenue / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">ЗАКАЗЫ</p>
                  <p className="text-sm font-black">{org.stats.orderVolume}</p>
                </div>
                <div className="w-24">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase text-slate-400">Score</span>
                    <span className="text-[9px] font-black uppercase text-slate-900">{org.stats.complianceScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        org.stats.complianceScore > 90 ? "bg-green-500" : "bg-amber-500"
                      )} 
                      style={{ width: `${org.stats.complianceScore}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
