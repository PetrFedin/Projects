'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { loadWaitlist, removeFromWaitlist, type WaitlistEntryV1 } from '@/lib/fashion/waitlist-store';
import { ArrowLeft, Bell, Trash2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WaitlistPage() {
  const { toast } = useToast();
  const [list, setList] = useState<WaitlistEntryV1[]>([]);

  useEffect(() => {
    setList(loadWaitlist());
  }, []);

  const handleRemove = (sku: string, size: string) => {
    const next = removeFromWaitlist(sku, size);
    setList(next);
    toast({ title: 'Удалено из списка' });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.client.home}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Лист ожидания
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Здесь собраны товары и размеры, которых нет в наличии. Мы пришлем уведомление при поступлении.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ваш список</CardTitle>
          <CardDescription>
            {list.length === 0 ? 'Список пуст' : `Ждем ${list.length} позиций`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {list.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">
                Пока ничего не добавлено. На странице товара с отсутствующим размером нажмите «Узнать о наличии».
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {list.map((item) => {
                const p = products.find(x => x.sku === item.sku);
                return (
                  <div key={`${item.sku}-${item.size}`} className="flex items-center gap-4 border rounded-lg p-3">
                    <div className="relative h-16 w-12 rounded border overflow-hidden shrink-0">
                      {p?.images[0] && (
                        <Image src={p.images[0].url} alt={item.name} fill className="object-cover" sizes="64px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:underline block truncate">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          Размер: {item.size}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          Добавлено {new Date(item.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(item.sku, item.size)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
