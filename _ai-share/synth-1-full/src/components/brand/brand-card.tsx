'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Users, Shirt, Handshake } from 'lucide-react';

interface BrandCardProps {
  brand: Brand;
  productCount?: number;
  onRequest?: () => void;
}

export default function BrandCard({ brand, productCount, onRequest }: BrandCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden bg-card transition-shadow duration-300 ease-in-out hover:shadow-xl">
      <CardContent className="flex flex-grow flex-col items-center p-4 text-center">
        <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-border">
          <Image
            src={brand.logo.url}
            alt={brand.logo.alt}
            fill
            className="object-contain"
            data-ai-hint={brand.logo.hint}
            sizes="96px"
          />
        </div>
        <h3 className="font-headline text-base font-bold leading-tight">{brand.name}</h3>
        <p className="mt-1 min-h-[40px] flex-grow text-sm text-muted-foreground">
          {brand.description}
        </p>

        <div className="mb-4 grid w-full grid-cols-2 gap-3 pt-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-foreground">
              {brand.followers.toLocaleString('ru-RU')}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Подписчики
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-foreground">{productCount || 0}</span>
            <span className="flex items-center gap-1">
              <Shirt className="h-4 w-4" /> Товары
            </span>
          </div>
        </div>

        <div className="mt-auto w-full space-y-2">
          <Button asChild className="w-full">
            <Link href={`/b/${brand.slug}`}>
              В магазин <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {onRequest ? (
            <Button variant="secondary" className="w-full" onClick={onRequest}>
              <Handshake className="mr-2 h-4 w-4" />
              Запросить партнерство
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Подписаться
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
