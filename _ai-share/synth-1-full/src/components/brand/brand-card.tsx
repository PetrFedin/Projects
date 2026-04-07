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
    <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl bg-card group flex flex-col h-full">
      <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
        <div className="relative w-24 h-24 rounded-full mb-4 overflow-hidden border-2 border-border">
            <Image
                src={brand.logo.url}
                alt={brand.logo.alt}
                fill
                className="object-contain"
                data-ai-hint={brand.logo.hint}
                sizes="96px"
            />
        </div>
        <h3 className="text-base font-headline font-bold leading-tight">{brand.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 flex-grow min-h-[40px]">{brand.description}</p>
        
        <div className="grid grid-cols-2 gap-3 pt-4 text-sm text-muted-foreground w-full mb-4">
            <div className='flex flex-col items-center gap-1'>
                <span className="font-semibold text-foreground">{brand.followers.toLocaleString('ru-RU')}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Подписчики</span>
            </div>
             <div className='flex flex-col items-center gap-1'>
                <span className="font-semibold text-foreground">{productCount || 0}</span>
                <span className="flex items-center gap-1"><Shirt className="h-4 w-4" /> Товары</span>
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
