import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, Scale, Search, ShoppingCart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const GridPreview = ({ settings, product, onQuickViewClick }: { settings: Record<string, boolean>, product: any, onQuickViewClick: () => void }) => {
    const { toast } = useToast();
    const [activeColor, setActiveColor] = useState(product.availableColors[0]);
    const [selectedSize, setSelectedSize] = useState<string | undefined>();
    const [isLiked, setIsLiked] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        const colorImage = product.images.find((img: any) => img.colorName === activeColor.name);
        setActiveImage(colorImage?.url || product.image || null);
        setSelectedSize(undefined);
    }, [activeColor, product.image, product.images]);

    const handleAddToCart = () => {
        if (selectedSize) {
            toast({
                title: "Добавлено в корзину (симуляция)",
                description: `${product.name} (${activeColor.name}, ${selectedSize})`,
            });
        }
    };
    
    return (
        <TooltipProvider>
            <Card className="overflow-hidden flex flex-col transition-shadow duration-300 ease-in-out shadow-xl bg-card group h-full">
                {settings.image && (
                <div className="bg-muted overflow-hidden relative aspect-[4/5]">
                    {activeImage && <Image src={activeImage} alt="Пример товара" fill className="object-cover" sizes="300px" />}
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {settings.wishlist_button && (
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 bg-background/50 backdrop-blur-sm" onClick={() => setIsLiked(!isLiked)}><Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>В избранное</p></TooltipContent>
                        </Tooltip>
                    )}
                    {settings.compare_button && (
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 bg-background/50 backdrop-blur-sm"><Scale className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Сравнить</p></TooltipContent>
                        </Tooltip>
                    )}
                    {settings.share_button && (
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 bg-background/50 backdrop-blur-sm"><Share2 className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Поделиться</p></TooltipContent>
                        </Tooltip>
                    )}
                    </div>
                    <div className="absolute top-2 left-2 flex flex-col gap-2 items-start">
                        {settings.old_price && settings.discount_badge && <Badge variant="destructive">-{product.discount}</Badge>}
                        {settings.promo_badge && <Badge variant="default" className="bg-accent text-accent-foreground">Промо</Badge>}
                    </div>
                    <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {settings.quick_view_button && (
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" className="h-8 bg-background/80 text-foreground hover:bg-background shadow-md backdrop-blur-sm" onClick={onQuickViewClick}><Search className="h-4 w-4 mr-2" /> Быстрый просмотр</Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Быстрый просмотр</p></TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
                )}
            <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex-grow min-h-[60px]">
                    {settings.brand && <p className="text-xs font-medium text-muted-foreground">{product.brand}</p>}
                    {settings.product_name && <h3 className="text-base font-semibold leading-tight mt-1">{product.name}</h3>}
                </div>
                 {settings.color_swatches && (
                    <div className="flex items-center gap-2 mt-2">
                        {product.availableColors.map((color: any) => (
                             <Tooltip key={color.hex}>
                                <TooltipTrigger asChild>
                                    <button 
                                        className={cn("h-5 w-5 rounded-full border-2", activeColor.hex === color.hex ? 'border-primary ring-2 ring-offset-1 ring-primary' : 'border-border/50')}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => {setActiveColor(color);}}
                                    />
                                </TooltipTrigger>
                                <TooltipContent><p>{color.name}</p></TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                )}
                {settings.size_selector && (
                     <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size: string) => {
                                const sizeInfo = activeColor.sizeAvailability.find((s: any) => s.size === size);
                                const isAvailable = sizeInfo && sizeInfo.status === 'in_stock' && sizeInfo.quantity > 0;
                                const isSelected = selectedSize === size;
                                return (
                                    <Button key={size} size="sm" variant={isSelected ? 'default' : 'outline'} className={cn('h-8 w-12', !isAvailable && 'text-muted-foreground line-through')} onClick={() => isAvailable && setSelectedSize(s => s === size ? undefined : size)} disabled={!isAvailable}>
                                        {size}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )}
                {settings.price && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-sm">{product.price}</p>
                            {settings.old_price && <p className="text-sm text-muted-foreground line-through">{product.oldPrice}</p>}
                        </div>
                    </div>
                )}
            </CardContent>
             {settings.add_to_cart_button && (
                <CardFooter className="p-4 pt-0">
                    <Button className="w-full" disabled={!selectedSize} onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Добавить в корзину
                    </Button>
                </CardFooter>
            )}
            </Card>
        </TooltipProvider>
    );
};
