import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ProductCard from '@/components/product-card';
import { products } from '@/lib/products';

export const RecommendedProducts = ({ productId }: { productId: string }) => {
  const [recommendedItems, setRecommendedItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    // In a real app, this would be an API call to a recommendation engine
    setRecommendedItems(products.slice(10, 13));
  }, [productId]);

  if (recommendedItems.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-accent" />
          AI-стилист: с чем носить
        </h4>
        <p className="mb-4 text-xs text-muted-foreground">
          Наши алгоритмы подобрали товары, которые идеально дополнят ваш образ.
        </p>
        <Carousel opts={{ align: 'start' }} className="w-full">
          <CarouselContent className="-ml-2">
            {recommendedItems.map((item) => (
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
