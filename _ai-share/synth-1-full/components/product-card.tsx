'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';


interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}


export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const { user, toggleCart, addCartItem, addWishlistItem, removeWishlistItem, wishlist } = useUIState();
  
  const isInWishlist = useMemo(() => wishlist.some(item => item.id === product.id), [product.id, wishlist]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCartItem(product);
    toast({
        title: "Товар добавлен в корзину",
        description: `${product.name} теперь в вашей корзине.`,
    });
    setTimeout(() => toggleCart(), 100);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeWishlistItem(product.id);
      toast({ title: "Товар удален из избранного" });
    } else {
      addWishlistItem(product);
      toast({ title: "Товар добавлен в избранное" });
    }
  };
  
  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  // A/B test logic for a specific product
  const isTestVariant = useMemo(() => {
    // Show variant B for the cashmere sweater to users with even-length UIDs
    if (product.id === '1' && user?.uid) {
        return user.uid.length % 2 === 0;
    }
    return false;
  }, [user, product.id]);

  const displayImage = isTestVariant ? product.images[1] : product.images[0];


  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-2xl bg-card group w-full">
        <div className="flex">
          <div className="relative aspect-[3/4] w-1/4">
            <Link href={`/products/${product.slug}`} className="block w-full h-full">
              <Image
                src={displayImage.url}
                alt={displayImage.alt}
                fill
                className="object-cover"
                data-ai-hint={displayImage.hint}
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
              />
               {product.outlet && discountPercent > 0 && (
                <Badge variant="destructive" className="absolute top-2 left-2">-{discountPercent}%</Badge>
              )}
            </Link>
          </div>
          <div className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-xl font-headline leading-tight mt-1 hover:text-accent transition-colors">{product.name}</h3>
                </Link>
              </div>
               <div className="text-right">
                <p className="font-semibold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString('ru-RU')} ₽</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 flex-grow max-w-prose">{product.description.substring(0, 120)}...</p>
            {product.sustainability && product.sustainability.length > 0 && (
              <div className="mt-3">
                <Badge variant="secondary" className="font-normal text-xs">{product.sustainability[0]}</Badge>
              </div>
            )}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex gap-2 items-center">
                  <span className="w-5 h-5 rounded-full bg-black border-2 border-card-foreground/10" title="Черный"></span>
                  <span className="w-5 h-5 rounded-full bg-gray-300 border-2 border-card-foreground/10" title="Серый"></span>
                  <span className="w-5 h-5 rounded-full bg-blue-900 border-2 border-card-foreground/10" title="Темно-синий"></span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={handleToggleWishlist}>
                    <Heart className={cn("h-5 w-5", isInWishlist && "fill-current text-red-500")} />
                    <span className="sr-only">Добавить в избранное</span>
                </Button>
                <Button size="sm" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Добавить в корзину
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col transition-shadow duration-300 ease-in-out hover:shadow-xl bg-card group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-w-4 aspect-h-5 w-full overflow-hidden">
            <Image
            src={displayImage.url}
            alt={displayImage.alt}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={displayImage.hint}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {product.outlet && discountPercent > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">-{discountPercent}%</Badge>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="sm" className="bg-background/80 text-foreground hover:bg-background shadow-md backdrop-blur-sm" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2"/>
                    В корзину
                </Button>
            </div>
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
            <p className="text-xs font-medium text-muted-foreground">{product.brand}</p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base font-semibold leading-tight mt-1 hover:text-accent transition-colors">{product.name}</h3>
            </Link>
        </div>
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
                <p className="font-semibold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString('ru-RU')} ₽</p>
                )}
            </div>
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-accent" onClick={handleToggleWishlist}>
                <Heart className={cn("h-5 w-5", isInWishlist && "fill-current text-red-500")} />
                <span className="sr-only">Добавить в избранное</span>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
