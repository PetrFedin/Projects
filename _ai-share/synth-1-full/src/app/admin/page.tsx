'use client';

import Link from 'next/link';
import { Activity, Store, Users, DollarSign, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';

const quickLinks = [
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/brands', label: 'Бренды', icon: Store },
  { href: '/admin/activity', label: 'Логи', icon: Activity },
  { href: '/admin/integrations', label: 'Интеграции', icon: Zap },
  { href: '/admin/billing', label: 'Биллинг', icon: DollarSign },
  { href: '/admin/settings', label: 'Настройки', icon: Shield },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Дашборд HQ</h3>
        <p className="text-slate-500 text-sm mt-1">Панель управления платформой Synth-1</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickLinks.map(item => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:border-amber-300 hover:shadow-md transition-all cursor-pointer h-full">
              <CardHeader className="pb-2">
                <item.icon className="h-8 w-8 text-amber-600" />
                <CardTitle className="text-xs font-bold uppercase">{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="outline" className="text-[9px] border-slate-200">Открыть</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Переход к хабам</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href={ROUTES.brand.home} className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100">
            Brand Hub
          </Link>
          <Link href={ROUTES.shop.home} className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 text-sm font-bold hover:bg-rose-100">
            Shop Hub
          </Link>
          <Link href="/factory" className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100">
            Factory Hub
          </Link>
          <Link href="/distributor" className="px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-bold hover:bg-amber-100">
            Distributor Hub
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
