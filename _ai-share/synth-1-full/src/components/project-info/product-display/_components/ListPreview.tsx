import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Scale, ShoppingCart, Star, Bot, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ListPreview = ({
  settings,
  product,
}: {
  settings: Record<string, boolean>;
  product: any;
}) => {
  return (
    <Card className="group w-full overflow-hidden bg-card transition-shadow duration-300 ease-in-out hover:shadow-2xl">
      <div className="flex">
        {settings.image && (
          <div className="relative aspect-[3/4] w-1/4 bg-muted">
            <Image
              src={product.image}
              alt="Пример товара"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
            />
            <div className="absolute left-2 top-2 flex flex-col items-start gap-2">
              {settings.old_price && settings.discount_badge && (
                <Badge variant="destructive">-{product.discount}</Badge>
              )}
              {settings.promo_badge && (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  Промо
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              {settings.brand && (
                <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
              )}
              {settings.product_name && (
                <h3 className="mt-1 font-headline text-base leading-tight transition-colors hover:text-accent">
                  {product.name}
                </h3>
              )}
              {settings.rating && (
                <div className="mt-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                      )}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground">(124)</span>
                </div>
              )}
            </div>
            <div className="text-right">
              {settings.price && <p className="text-sm font-semibold">{product.price}</p>}
              {settings.old_price && (
                <p className="text-sm text-muted-foreground line-through">{product.oldPrice}</p>
              )}
            </div>
          </div>
          {settings.description && (
            <p className="mt-2 line-clamp-2 max-w-prose flex-grow text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
          {settings.ai_stylist_recommendation && (
            <p className="mt-2 flex items-center gap-1.5 text-xs italic text-muted-foreground">
              <Bot className="h-3 w-3" />
              Сочетается с джинсами и белыми кедами
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {settings.sustainability_badge && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs font-normal">
                <Leaf className="h-3 w-3" />
                {product.sustainability}
              </Badge>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              {settings.color_swatches && (
                <div className="flex items-center gap-2">
                  {product.availableColors.map((color: any) => (
                    <span
                      key={color.hex}
                      className="h-5 w-5 rounded-full border"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    ></span>
                  ))}
                </div>
              )}
              {settings.available_sizes && (
                <div className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                  Размеры: {product.sizes.join(', ')}
                </div>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {settings.wishlist_button && (
                <Button size="sm" variant="ghost">
                  <Heart className="h-5 w-5" />
                </Button>
              )}
              {settings.compare_button && (
                <Button size="sm" variant="ghost">
                  <Scale className="h-5 w-5" />
                </Button>
              )}
              {settings.add_to_cart_button && (
                <Button size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Добавить
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
