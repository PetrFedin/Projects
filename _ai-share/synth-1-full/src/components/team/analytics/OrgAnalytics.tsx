'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, ShieldCheck, DollarSign } from 'lucide-react';
import { organizations } from '../_fixtures/team-data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function OrgAnalytics({ organizationId }: { organizationId?: string }) {
  const orgs = organizationId
    ? [organizations[organizationId]].filter(Boolean)
    : Object.values(organizations);

  const totalRevenue = orgs.reduce((acc, org) => acc + org.stats.totalRevenue, 0);
  const totalOrders = orgs.reduce((acc, org) => acc + org.stats.orderVolume, 0);
  const avgCompliance = orgs.reduce((acc, org) => acc + org.stats.complianceScore, 0) / orgs.length;

  return (
    <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black uppercase tracking-tighter">Аналитика Экосистемы</h2>
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest">
            Глобальный мониторинг показателей всех профилей
          </p>
        </div>
        <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center gap-2 rounded-2xl border px-4 py-2">
          <TrendingUp className="text-accent-primary h-4 w-4" />
          <span className="text-accent-primary text-[10px] font-black uppercase">
            LIVE: ОБНОВЛЕНО 1 МИН НАЗАД
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'ВЫРУЧКА СЕТИ',
            value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
            icon: <DollarSign className="h-4 w-4" />,
            color: 'bg-green-50 text-green-600',
          },
          {
            label: 'ОБЪЕМ ЗАКАЗОВ',
            value: totalOrders.toLocaleString('ru-RU'),
            icon: <ShoppingBag className="h-4 w-4" />,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'АКТИВНЫЕ ПОЛЬЗОВАТЕЛИ',
            value: orgs.reduce((acc, o) => acc + o.stats.activeUsers, 0),
            icon: <Users className="h-4 w-4" />,
            color: 'bg-accent-primary/10 text-accent-primary',
          },
          {
            label: 'COMPLIANCE SCORE',
            value: `${avgCompliance.toFixed(1)}%`,
            icon: <ShieldCheck className="h-4 w-4" />,
            color: 'bg-amber-50 text-amber-600',
          },
        ].map((stat, i) => (
          <Card key={i} className="overflow-hidden rounded-xl border-none bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    stat.color
                  )}
                >
                  {stat.icon}
                </div>
                <div className="bg-bg-surface2 h-1.5 w-8 overflow-hidden rounded-full">
                  <div className="bg-border-default h-full w-2/3" />
                </div>
              </div>
              <h3 className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
                {stat.label}
              </h3>
              <p className="text-sm font-black">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-border-subtle rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase">
          <BarChart3 className="text-accent-primary h-5 w-5" />
          Рейтинг Профилей
        </h3>
        <div className="space-y-4">
          {orgs
            .sort((a, b) => b.stats.totalRevenue - a.stats.totalRevenue)
            .map((org) => (
              <div
                key={org.id}
                className="hover:bg-bg-surface2 hover:border-border-subtle flex items-center justify-between rounded-2xl border border-transparent p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="bg-bg-surface2 h-10 w-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="mb-1 text-sm font-black uppercase leading-none">{org.name}</h4>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      {org.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-text-muted mb-1 text-[10px] font-bold uppercase tracking-widest">
                      ВЫРУЧКА
                    </p>
                    <p className="text-sm font-black">
                      ${(org.stats.totalRevenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted mb-1 text-[10px] font-bold uppercase tracking-widest">
                      ЗАКАЗЫ
                    </p>
                    <p className="text-sm font-black">{org.stats.orderVolume}</p>
                  </div>
                  <div className="w-24">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-text-muted text-[9px] font-black uppercase">Score</span>
                      <span className="text-text-primary text-[9px] font-black uppercase">
                        {org.stats.complianceScore}%
                      </span>
                    </div>
                    <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-1000',
                          org.stats.complianceScore > 90 ? 'bg-green-500' : 'bg-amber-500'
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
