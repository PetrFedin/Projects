
'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import AiWardrobeAssistant from '@/components/wardrobe/ai-wardrobe-assistant';
import { AiPersonalLookbook } from '@/components/u/ai-personal-lookbook';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Shirt } from 'lucide-react';
import { useUIState } from '@/providers/ui-state';
import type { Product } from '@/lib/types';
import { OmniChannelBridge } from '@/components/loyalty/omni-bridge';
import { CircularHub } from '@/components/loyalty/circular-hub';


export default function WardrobePage() {
    const { manualWardrobe } = useUIState();
    const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/data/products.json');
                const allProducts: Product[] = await response.json();
                // Mock data for purchased items
                setPurchasedProducts(allProducts.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch products for wardrobe", error);
            }
        }
        fetchProducts();
    }, []);


    return (
        <div className="container mx-auto px-4 py-4">
            <header className="mb-8">
                <h1 className="text-sm md:text-sm font-headline font-bold">Мой гардероб</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Все ваши вещи в одном месте. Добавляйте одежду, чтобы AI-ассистент мог создавать для вас новые образы.
                </p>
            </header>

            <div className="mb-12">
                <AiPersonalLookbook />
            </div>

            <div className="mb-12">
                <OmniChannelBridge />
            </div>

            <div className="mb-12">
                <CircularHub />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <main className="lg:col-span-3">
                     <Tabs defaultValue="purchased">
                        <TabsList className="mb-6">
                            <TabsTrigger value="purchased">Покупки на Syntha ({purchasedProducts.length})</TabsTrigger>
                            <TabsTrigger value="added">Добавленные вручную ({manualWardrobe.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="purchased">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {purchasedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="added">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {manualWardrobe.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                                <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-muted/50 hover:border-primary transition-colors min-h-[400px]">
                                    <CardContent className="flex flex-col items-center justify-center text-center p-4">
                                        <Shirt className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="font-semibold mb-2">Добавить вещь</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Загрузите фото вашей одежды, чтобы AI мог давать более точные рекомендации.</p>
                                        <Button variant="outline">
                                            <PlusCircle className="mr-2 h-4 w-4"/>
                                            Загрузить фото
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
                <aside className="lg:col-span-1">
                    <div className="sticky top-24">
                       <AiWardrobeAssistant wardrobe={[...purchasedProducts, ...manualWardrobe]} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
