
'use client';
import ProductCard from "./product-card";
import { Product } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductReviewsDialog } from "./product-reviews-dialog";

const RecommendedProducts = ({ productId }: { productId: string }) => {
    const [recommendedItems, setRecommendedItems] = useState<Product[]>([]);
    
    useEffect(() => {
        const fetchProducts = async () => {
             const res = await fetch('/data/products.json');
             const allProducts: Product[] = await res.json();
             // In a real app, this would be an API call to a recommendation engine
             setRecommendedItems(allProducts.slice(10, 13));
        };
        fetchProducts();
    }, [productId]);


    if(recommendedItems.length === 0) return null;

    return (
        <Card>
            <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    AI-стилист: с чем носить
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                    Наши алгоритмы подобрали товары, которые идеально дополнят ваш образ.
                </p>
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent className="-ml-2">
                        {recommendedItems.map(item => (
                            <CarouselItem key={item.id} className="basis-1/2 pl-2">
                                <div className="flex flex-col gap-2">
                                    <ProductCard product={item} viewMode="grid" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </CardContent>
        </Card>
    );
};


interface ProductListItemProps {
    product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start">
                <div className="xl:col-span-2">
                     <ProductCard product={product} viewMode="list" onReviewsClick={() => setIsReviewsOpen(true)} />
                </div>
                <div className="hidden xl:block">
                    <RecommendedProducts productId={product.id} />
                </div>
            </div>
            {isReviewsOpen && <ProductReviewsDialog product={product} isOpen={isReviewsOpen} onOpenChange={setIsReviewsOpen} />}
        </>
    )
}
