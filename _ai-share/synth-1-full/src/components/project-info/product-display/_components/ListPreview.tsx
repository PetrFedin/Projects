import React from 'react';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Scale, ShoppingCart, Star, Bot, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ListPreview = ({ settings, product }: { settings: Record<string, boolean>, product: any }) => {
    return (
    <Card className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-2xl bg-card group w-full">
        <div className="flex">
            {settings.image && (
                <div className="relative aspect-[3/4] w-1/4 bg-muted">
                    <Image src={product.image} alt="Пример товара" fill className="object-cover" sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw" />
                     <div className="absolute top-2 left-2 flex flex-col gap-2 items-start">
                        {settings.old_price && settings.discount_badge && <Badge variant="destructive">-{product.discount}</Badge>}
                        {settings.promo_badge && <Badge variant="default" className="bg-accent text-accent-foreground">Промо</Badge>}
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col p-4">
                <div className="flex justify-between items-start">
                    <div>
                        {settings.brand && <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>}
                        {settings.product_name && <h3 className="text-base font-headline leading-tight mt-1 hover:text-accent transition-colors">{product.name}</h3>}
                         {settings.rating && (
                           <div className="mt-2 flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={cn("h-4 w-4", i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />)}
                                <span className="text-xs text-muted-foreground">(124)</span>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        {settings.price && <p className="font-semibold text-sm">{product.price}</p>}
                        {settings.old_price && <p className="text-sm text-muted-foreground line-through">{product.oldPrice}</p>}
                    </div>
                </div>
                 {settings.description && <p className="text-sm text-muted-foreground mt-2 flex-grow max-w-prose line-clamp-2">{product.description}</p>}
                 {settings.ai_stylist_recommendation && <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-1.5"><Bot className="h-3 w-3" />Сочетается с джинсами и белыми кедами</p>}
                 <div className="flex flex-wrap items-center gap-2 mt-3">
                    {settings.sustainability_badge && <Badge variant="secondary" className="font-normal text-xs flex items-center gap-1"><Leaf className="h-3 w-3" />{product.sustainability}</Badge>}
                 </div>
                
                <div className="flex items-center justify-between mt-auto pt-4">
                  <div className="flex items-center gap-3">
                    {settings.color_swatches && (
                        <div className="flex items-center gap-2">
                            {product.availableColors.map((color: any) => (
                                <span key={color.hex} className="w-5 h-5 rounded-full border" style={{ backgroundColor: color.hex }} title={color.name}></span>
                            ))}
                        </div>
                    )}
                    {settings.available_sizes && (
                        <div className="border rounded-md px-2 py-1 text-xs text-muted-foreground">
                            Размеры: {product.sizes.join(', ')}
                        </div>
                    )}
                  </div>
                    <div className="flex items-center gap-2 ml-auto">
                        {settings.wishlist_button && <Button size="sm" variant="ghost"><Heart className="h-5 w-5" /></Button>}
                        {settings.compare_button && <Button size="sm" variant="ghost"><Scale className="h-5 w-5" /></Button>}
                        {settings.add_to_cart_button && <Button size="sm"><ShoppingCart className="h-4 w-4 mr-2" /> Добавить</Button>}
                    </div>
                </div>
            </div>
        </div>
    </Card>
    );
};
