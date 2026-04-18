'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Target, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

/** Геймификация для байеров (российский рынок): челленджи, бейджи, обмен очков на скидки. */
const MOCK_CHALLENGES = [
  { id: '1', title: 'Первый заказ сезона', progress: 100, reward: '50 баллов', done: true },
  {
    id: '2',
    title: 'Заказать из 3+ брендов за месяц',
    progress: 66,
    reward: '100 баллов',
    done: false,
  },
  {
    id: '3',
    title: 'Pre-order до 15 марта',
    progress: 0,
    reward: 'Скидка 5% на дроп 1',
    done: false,
  },
];
const MOCK_BADGES = [
  { id: '1', name: 'Ранняя пташка', icon: '🌅', earned: true },
  { id: '2', name: 'Мультибренд', icon: '🛒', earned: true },
  { id: '3', name: 'Топ-байер месяца', icon: '🏆', earned: false },
];

export default function GamificationPage() {
  const points = 320;

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Trophy className="h-6 w-6" /> Челленджи и бейджи
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Задания и награды для байеров. Баллы можно обменять на скидки у партнёрских брендов.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-2xl space-y-6">
      <ShopB2bContentHeader lead="Задания и награды для байеров: баллы можно обменять на скидки у партнёрских брендов." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" /> Ваши баллы
          </CardTitle>
          <CardDescription>
            Копите баллы за заказы и челленджи — обменивайте на скидки (в рублях)
          </CardDescription>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <p className="text-3xl font-bold text-indigo-600">{points} баллов</p>
=======
          <p className="text-accent-primary text-3xl font-bold">{points} баллов</p>
>>>>>>> recover/cabinet-wip-from-stash
          <Button variant="outline" size="sm" className="mt-2">
            Обменять на скидку
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Челленджи
          </CardTitle>
          <CardDescription>Выполняйте условия и получайте баллы или скидки</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_CHALLENGES.map((c) => (
            <div
              key={c.id}
<<<<<<< HEAD
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
=======
              className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-lg border p-3"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-text-secondary text-xs">{c.reward}</p>
              </div>
              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={cn('h-full bg-indigo-500 transition-all')}
=======
                <div className="bg-border-subtle h-2 w-24 overflow-hidden rounded-full">
                  <div
                    className={cn('bg-accent-primary h-full transition-all')}
>>>>>>> recover/cabinet-wip-from-stash
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                {c.done ? (
                  <Badge variant="default">Готово</Badge>
                ) : (
<<<<<<< HEAD
                  <span className="text-xs text-slate-500">{c.progress}%</span>
=======
                  <span className="text-text-secondary text-xs">{c.progress}%</span>
>>>>>>> recover/cabinet-wip-from-stash
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" /> Бейджи
          </CardTitle>
          <CardDescription>Достижения за активность</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {MOCK_BADGES.map((b) => (
              <div
                key={b.id}
<<<<<<< HEAD
                className={`flex flex-col items-center rounded-xl border p-3 ${b.earned ? 'border-amber-200 bg-amber-50' : 'border-slate-200 opacity-60'}`}
=======
                className={`flex flex-col items-center rounded-xl border p-3 ${b.earned ? 'border-amber-200 bg-amber-50' : 'border-border-default opacity-60'}`}
>>>>>>> recover/cabinet-wip-from-stash
              >
                <span className="mb-1 text-2xl">{b.icon}</span>
                <span className="text-xs font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, партнёры, выставки"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
