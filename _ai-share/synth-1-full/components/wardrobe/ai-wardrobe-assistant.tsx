
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Lightbulb } from 'lucide-react';
import type { Product } from '@/lib/types';
import { products } from '@/lib/products';
import ProductCard from '../product-card';
import { Separator } from '../ui/separator';

interface AiWardrobeAssistantProps {
    wardrobe: Product[];
}

// Mock recommended products
const recommendedProducts = products.filter(p => ['2', '7'].includes(p.id));

export default function AiWardrobeAssistant({ wardrobe }: AiWardrobeAssistantProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Product[] | null>(null);

    const handleAnalyze = () => {
        setIsLoading(true);
        setRecommendations(null);

        // Simulate AI analysis
        setTimeout(() => {
            setRecommendations(recommendedProducts);
            setIsLoading(false);
        }, 2000);
    }

    return (
        <Card className="bg-accent/10 border-accent/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI-ассистент</CardTitle>
                <CardDescription>Проанализируйте свой гардероб, чтобы получить персональные рекомендации.</CardDescription>
            </CardHeader>
            <CardContent>
                {recommendations ? (
                    <div className="space-y-4">
                        <div className="flex items-start gap-2 text-sm text-accent-foreground/80 bg-accent/20 p-3 rounded-md">
                            <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>
                                <span className="font-semibold">Рекомендация:</span> Чтобы расширить количество образов, мы предлагаем добавить в ваш гардероб эти вещи. Они отлично сочетаются с тем, что у вас уже есть.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {recommendations.map(product => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <Button onClick={handleAnalyze} className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Bot className="mr-2 h-4 w-4" />
                            )}
                            Проанализировать снова
                        </Button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">Нажмите, чтобы AI подобрал вещи, которые идеально дополнят ваш стиль.</p>
                        <Button onClick={handleAnalyze} className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Bot className="mr-2 h-4 w-4" />
                            )}
                            Анализировать гардероб
                        </Button>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
