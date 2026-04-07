import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Users } from 'lucide-react';

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl bg-card group flex flex-col">
      <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
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
        <h3 className="text-xl font-headline font-bold leading-tight">{brand.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 flex-grow min-h-[40px]">{brand.description}</p>
        
        <div className="flex justify-around pt-4 text-sm text-muted-foreground w-full mb-4">
            <div className='flex items-center gap-2'>
                <Users className="h-4 w-4" />
                <span>{brand.followers.toLocaleString('ru-RU')}</span>
            </div>
        </div>

        <div className="mt-auto w-full space-y-2">
             <Button asChild className="w-full">
                <Link href={`/b/${brand.slug}`}>
                    В магазин <ArrowRight className="ml-2" />
                </Link>
            </Button>
            <Button variant="outline" className="w-full">
                <Plus className="mr-2" />
                Подписаться
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
