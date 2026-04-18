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
import { tid } from '@/lib/ui/test-ids';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

/** Le New Black: Le Privé / VIP-шоурум — приватный showroom с отдельным URL */
export default function VipShowroomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const room = getVipShowroomBySlug(slug);

  if (!room) {
    return (
      <div
        className="bg-text-primary flex min-h-screen items-center justify-center p-4"
        data-testid={tid.page('vip-showroom')}
      >
        <Card className="border-text-primary/25 bg-text-primary/90 max-w-md text-white">
          <CardHeader>
            <CardTitle>Шоурум не найден</CardTitle>
            <CardDescription className="text-text-muted">
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
      <div
        className="bg-text-primary flex min-h-screen items-center justify-center p-4"
        data-testid={tid.page('vip-showroom')}
      >
        <Card className="border-text-primary/25 bg-text-primary/90 max-w-md text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="size-5" />
              <CardTitle>Le Privé</CardTitle>
            </div>
            <CardDescription className="text-text-muted">{room.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Пароль"
              className="border-text-secondary bg-text-primary/75 placeholder:text-text-muted w-full rounded-lg border px-4 py-2 text-white"
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

  const validLabel = format(new Date(room.validUntil), 'd MMMM yyyy, HH:mm', { locale: ru });
  const matrixHref =
    products.length > 0
      ? `${ROUTES.shop.b2bMatrix}?${products.map((p) => `add=${encodeURIComponent(p.id)}`).join('&')}`
      : ROUTES.shop.b2bMatrix;

  return (
    <div className="bg-text-primary min-h-screen text-white" data-testid={tid.page('vip-showroom')}>
      <RegistryPageShell className="max-w-5xl space-y-6 py-8">
        <RegistryPageHeader
          className="border-text-primary/25 [&_p]:!text-text-muted pb-4 text-white [&_h1]:!text-white"
          eyebrow={
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge className="border-emerald-500/40 bg-emerald-500/15 text-emerald-200">
                Доступ открыт
              </Badge>
              <Badge className="border-amber-500/30 bg-amber-500/20 text-amber-400">Le Privé</Badge>
            </div>
          }
          title={room.name}
          leadPlain={`Приватный шоурум · ${room.brandName} · ссылка действует до ${validLabel}`}
          actions={
            <>
              <Button
                size="sm"
                className="text-text-primary h-8 bg-amber-500 hover:bg-amber-400"
                asChild
              >
                <Link href={matrixHref}>Добавить всё в черновик B2B</Link>
              </Button>
              <Button size="sm" variant="outline" className="border-text-secondary h-8" asChild>
                <Link href={ROUTES.shop.b2bPartners}>Открыть B2B</Link>
              </Button>
            </>
          }
        />
        {room.description && (
          <p className="text-text-muted -mt-2 text-center text-sm">{room.description}</p>
        )}
        <div className="border-text-primary/25 bg-text-primary/90 text-text-muted rounded-lg border px-4 py-3 text-sm">
          <p>
            <span className="text-text-muted font-medium">Владелец подборки:</span> {room.brandName}{' '}
            · <span className="text-text-muted font-medium">Обновлено:</span> демо-данные (статично)
            · <span className="text-text-muted font-medium">Срок ссылки:</span> до {validLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="border-text-primary/25 bg-text-primary/90 overflow-hidden">
              <div className="bg-text-primary/75 relative aspect-[4/5]">
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
                <p className="text-text-muted text-xs uppercase">{p.brand}</p>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 font-medium text-amber-400">
                  {p.price.toLocaleString('ru-RU')} ₽
                </p>
                <Button size="sm" className="mt-3 w-full" asChild>
                  <Link href={`${ROUTES.shop.b2bMatrix}?add=${encodeURIComponent(p.id)}`}>
                    <ShoppingBag className="mr-2 size-4" /> В заказ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button className="text-text-primary bg-amber-500 hover:bg-amber-400" asChild>
            <Link href={matrixHref}>
              Ускорить закупку: вся подборка в матрицу <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" className="border-text-secondary" asChild>
            <Link href={ROUTES.shop.b2bPartners}>Перейти в B2B</Link>
          </Button>
        </div>
      </RegistryPageShell>
    </div>
  );
}
