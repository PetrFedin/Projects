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
    const synthaBrand = brands.find(b => b.slug?.includes('syntha') || b.id?.includes('syntha')) || brands[0];
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
                console.error("Failed to fetch products for collaborations page:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (isLoading) {
        return (
             <div className="space-y-4 animate-in fade-in duration-500">
                <header>
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-5 w-2/3 mt-2" />
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 space-y-4">
                         <Skeleton className="h-48 w-full rounded-xl" />
                         <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                    <div className="lg:col-span-1">
                         <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        )
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
                badges={<><Badge variant="outline" className="text-[9px]">Retailers</Badge><Badge variant="outline" className="text-[9px]">B2B</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/retailers"><Store className="h-3 w-3 mr-1" /> Retailers</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/b2b-orders"><Package className="h-3 w-3 mr-1" /> B2B</Link></Button></>}
            />
            <header>
                <h1 className="text-base font-bold font-headline uppercase tracking-tight">Коллаборации</h1>
                <p className="text-muted-foreground">Находите партнеров и создавайте уникальные проекты с помощью AI-аналитики.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 space-y-4">
                    <CollaborationInsights brand={brand} allProducts={allProducts} />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <CollaborationProjects brandId={brand.id} />
                </div>
            </div>
        </div>
    );
}
