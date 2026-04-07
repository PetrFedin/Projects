'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";

interface ContextualSearchProps {
    context: string;
    setContext: (context: string) => void;
}

export default function ContextualSearch({ context, setContext }: ContextualSearchProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLook, setGeneratedLook] = useState<Product[] | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/data/products.json');
                const productsData: Product[] = await res.json();
                setAllProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch products for contextual search", error);
            }
        };
        fetchProducts();
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setGeneratedLook(allProducts.slice(2, 5));
            setIsGenerating(false);
        }, 1500);
    }
    
    return (
        <Card className="bg-secondary/30 border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Контекстный поиск</CardTitle>
                <CardDescription>Подбор образов с помощью AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <p className="text-sm font-medium">Готовые сценарии</p>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant={context === 'weather_moscow' ? "default" : "secondary"} onClick={() => setContext('weather_moscow')}>Погода в Москве</Button>
                        <Button size="sm" variant={context === 'trip_dubai' ? "default" : "secondary"} onClick={() => setContext('trip_dubai')}>Поездка в Дубай</Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <p className="text-sm font-medium">AI-генератор луков</p>
                    <div className="flex gap-2">
                        <Input placeholder="Например, свидание в парке..." />
                        <Button onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                {isGenerating && <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground"/></div>}
                {generatedLook && (
                    <div className="pt-4">
                        <h4 className="text-sm font-semibold mb-2">AI подобрал для вас:</h4>
                         <Carousel opts={{ align: "start" }} className="w-full">
                            <CarouselContent>
                            {generatedLook.map((product, index) => (
                                <CarouselItem key={index} className="basis-1/2">
                                <div className="p-1 h-full">
                                    <ProductCard product={product} />
                                </div>
                                </CarouselItem>
                            ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden lg:flex" />
                            <CarouselNext className="hidden lg:flex" />
                        </Carousel>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
