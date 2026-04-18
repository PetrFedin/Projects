'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import { getVipShowroomBySlug } from '@/lib/ux/vip-showroom';
import allProducts from '@/lib/products';

/** Le New Black: Le Privé / VIP-шоурум — приватный showroom с отдельным URL */
export default function VipShowroomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const room = getVipShowroomBySlug(slug);

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <Card className="max-w-md border-slate-700 bg-slate-800 text-white">
          <CardHeader>
            <CardTitle>Шоурум не найден</CardTitle>
            <CardDescription className="text-slate-400">
              Ссылка истекла или некорректна.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/">На главную</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const needsPassword = !!room.password && !unlocked;
  const products = room.productIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as typeof allProducts;

  if (needsPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <Card className="max-w-md border-slate-700 bg-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Le Privé</CardTitle>
            </div>
            <CardDescription className="text-slate-400">{room.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Пароль"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={() => setUnlocked(true)}>
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 text-center">
          <Badge className="mb-2 border-amber-500/30 bg-amber-500/20 text-amber-400">
            Le Privé
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
          {room.description && <p className="mt-2 text-slate-400">{room.description}</p>}
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden border-slate-700 bg-slate-800">
              <div className="relative aspect-[4/5] bg-slate-700">
                {p.images?.[0]?.url && (
                  <Image
                    src={p.images[0].url}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-xs uppercase text-slate-400">{p.brand}</p>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 font-medium text-amber-400">
                  {p.price.toLocaleString('ru-RU')} ₽
                </p>
                <Button size="sm" className="mt-3 w-full" asChild>
                  <Link href={`/shop/b2b/matrix?add=${p.id}`}>
                    <ShoppingBag className="mr-2 h-4 w-4" /> В заказ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="border-slate-600" asChild>
            <Link href="/shop/b2b">
              Перейти в B2B <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
