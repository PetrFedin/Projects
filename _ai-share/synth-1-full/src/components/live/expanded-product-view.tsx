'use client';

import Image from 'next/image';
import type { Product, WishlistItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart, History, Bell } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ExpandedProductViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: WishlistItem[];
}

export function ExpandedProductView({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}: ExpandedProductViewProps) {
  const { toast } = useToast();
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleAction = () => {
    const availability = product.availability || 'out_of_stock';
    switch (availability) {
      case 'in_stock':
        onAddToCart(product);
        break;
      case 'pre_order':
        toast({
          title: 'Предзаказ оформлен!',
          description: `Мы сообщим, когда ${product.name} поступит в продажу.`,
        });
        break;
      case 'out_of_stock':
        toast({
          title: 'Вы подписались!',
          description: `Мы сообщим, когда ${product.name} снова будет в наличии.`,
        });
        break;
    }
  };

  const getButtonContent = () => {
    const availability = product.availability || 'out_of_stock';
    switch (availability) {
      case 'in_stock':
        return (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
          </>
        );
      case 'pre_order':
        return (
          <>
            <History className="mr-2 h-4 w-4" /> Предзаказ
          </>
        );
      case 'out_of_stock':
        return (
          <>
            <Bell className="mr-2 h-4 w-4" /> Сообщить о наличии
          </>
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к товарам
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Carousel className="mb-4 w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="250px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <h3 className="text-sm font-bold">{product.name}</h3>
          <p className="text-muted-foreground">{product.brand}</p>
          <p className="mt-2 text-sm font-bold">{product.price.toLocaleString('ru-RU')} ₽</p>
          <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>
        </div>
      </ScrollArea>

      <div className="mt-auto grid grid-cols-2 gap-2 border-t bg-background p-4">
        <Button size="lg" onClick={handleAction}>
          {getButtonContent()}
        </Button>
        <Button size="lg" variant="outline" onClick={() => onToggleWishlist(product)}>
          <Heart className={cn('mr-2 h-4 w-4', isInWishlist && 'fill-current text-red-500')} />
          {isInWishlist ? 'В избранном' : 'В избранное'}
        </Button>
      </div>
    </div>
  );
}
