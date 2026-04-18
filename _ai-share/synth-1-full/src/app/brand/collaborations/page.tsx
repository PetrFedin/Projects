'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Brand, Product } from '@/lib/types';
import { brands } from '@/lib/placeholder-data';
import CollaborationInsights from '@/components/brand/collaboration-insights';
import CollaborationProjects from '@/components/brand/collaboration-projects';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Store, Package } from 'lucide-react';

export default function CollaborationsPage() {
  const synthaBrand =
    brands.find((b) => b.slug?.includes('syntha') || b.id?.includes('syntha')) || brands[0];
  const [brand] = useState<Brand>(synthaBrand!);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/data/products.json');
        const products: Product[] = await response.json();
        setAllProducts(products);
      } catch (error) {
        console.error('Failed to fetch products for collaborations page:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 duration-500 animate-in fade-in">
        <header>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="mt-2 h-5 w-2/3" />
        </header>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!brand) return <div className="p-4 text-center">Бренд не найден.</div>;

  return (
    <div className="space-y-4 pb-20">
      <SectionInfoCard
        title="Коллаборации"
        description="Партнёрства с брендами, совместные коллекции. AI-аналитика синергии. Связь с Retailers и B2B заказами."
        icon={Users}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Retailers
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              B2B
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/retailers">
                <Store className="mr-1 h-3 w-3" /> Retailers
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/b2b-orders">
                <Package className="mr-1 h-3 w-3" /> B2B
              </Link>
            </Button>
          </>
        }
      />
      <header>
        <h1 className="font-headline text-base font-bold uppercase tracking-tight">Коллаборации</h1>
        <p className="text-muted-foreground">
          Находите партнеров и создавайте уникальные проекты с помощью AI-аналитики.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <CollaborationInsights brand={brand} allProducts={allProducts} />
        </div>
        <div className="space-y-4 lg:col-span-1">
          <CollaborationProjects brandId={brand.id} />
        </div>
      </div>
    </div>
  );
}
