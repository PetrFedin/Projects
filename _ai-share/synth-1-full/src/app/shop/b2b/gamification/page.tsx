'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, ArrowLeft, Star, Target, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** Геймификация для байеров (российский рынок): челленджи, бейджи, обмен очков на скидки. */
const MOCK_CHALLENGES = [
  { id: '1', title: 'Первый заказ сезона', progress: 100, reward: '50 баллов', done: true },
  { id: '2', title: 'Заказать из 3+ брендов за месяц', progress: 66, reward: '100 баллов', done: false },
  { id: '3', title: 'Pre-order до 15 марта', progress: 0, reward: 'Скидка 5% на дроп 1', done: false },
];
const MOCK_BADGES = [
  { id: '1', name: 'Ранняя пташка', icon: '🌅', earned: true },
  { id: '2', name: 'Мультибренд', icon: '🛒', earned: true },
  { id: '3', name: 'Топ-байер месяца', icon: '🏆', earned: false },
];

export default function GamificationPage() {
  const points = 320;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Trophy className="h-6 w-6" /> Челленджи и бейджи</h1>
          <p className="text-slate-500 text-sm mt-0.5">Задания и награды для байеров. Баллы можно обменять на скидки у партнёрских брендов.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Ваши баллы</CardTitle>
          <CardDescription>Копите баллы за заказы и челленджи — обменивайте на скидки (в рублях)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-indigo-600">{points} баллов</p>
          <Button variant="outline" size="sm" className="mt-2">Обменять на скидку</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Челленджи</CardTitle>
          <CardDescription>Выполняйте условия и получайте баллы или скидки</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_CHALLENGES.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-slate-500">{c.reward}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className={cn("h-full bg-indigo-500 transition-all")} style={{ width: `${c.progress}%` }} />
                </div>
                {c.done ? <Badge variant="default">Готово</Badge> : <span className="text-xs text-slate-500">{c.progress}%</span>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5" /> Бейджи</CardTitle>
          <CardDescription>Достижения за активность</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {MOCK_BADGES.map((b) => (
              <div key={b.id} className={`flex flex-col items-center p-3 rounded-xl border ${b.earned ? 'border-amber-200 bg-amber-50' : 'border-slate-200 opacity-60'}`}>
                <span className="text-2xl mb-1">{b.icon}</span>
                <span className="text-xs font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Заказы, партнёры, выставки" className="mt-6" />
    </div>
  );
}
