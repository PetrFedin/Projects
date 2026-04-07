'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import ProductCard from "../product-card";
import type { Product } from "@/lib/types";

interface BrandStylistProps {
    brandProducts: Product[];
}

export function BrandStylist({ brandProducts }: BrandStylistProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedLook, setGeneratedLook] = useState<Product[] | null>(null);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);

    const scenarios = [
        { id: "business", label: "Деловой образ" },
        { id: "date", label: "На свидание" },
        { id: "vacation", label: "В отпуск" }
    ];

    const handleGenerate = (scenarioId: string) => {
        setIsLoading(true);
        setGeneratedLook(null);
        setActiveScenario(scenarioId);

        // Simulate AI call
        setTimeout(() => {
            // Mock logic to select products for the look
            const look = brandProducts.sort(() => 0.5 - Math.random()).slice(0, 3);
            setGeneratedLook(look);
            setIsLoading(false);
        }, 1500);
    }
    
    return (
        <Card className="bg-accent/10 border-accent/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-accent"/>
                    Стилист бренда
                </CardTitle>
                <CardDescription>Выберите сценарий, и AI подберет для вас готовый образ из коллекции бренда.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {scenarios.map(scenario => (
                        <Button
                            key={scenario.id}
                            variant={activeScenario === scenario.id ? "default" : "secondary"}
                            onClick={() => handleGenerate(scenario.id)}
                            disabled={isLoading}
                        >
                             {isLoading && activeScenario === scenario.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {scenario.label}
                        </Button>
                    ))}
                </div>
                {isLoading && (
                    <div className="text-center p-4 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground"/>
                    </div>
                )}
                {generatedLook && (
                    <div className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {generatedLook.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
