
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product, WishlistCollection } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Search, Scale, Star, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { QuickViewDialog } from './quick-view-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { PlusCircle, Package, TrendingUp, Info as InfoIcon, ShieldCheck, Sparkles, FileText as DppIcon, Glasses, Footprints } from 'lucide-react';
import { productShowsFootwear360, productShowsGlassesTryOn } from '@/lib/product-experience/resolvers';
import { ProductGlassesTryOnDialog } from '@/components/product-experience/product-glasses-try-on-dialog';
import { ProductFootwearExperienceDialog } from '@/components/product-experience/product-footwear-experience-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onReviewsClick?: () => void;
}


export default function ProductCard({ product, viewMode = 'grid', onReviewsClick }: ProductCardProps) {
  const { toast } = useToast();
  const { user, addCartItem, wishlistCollections, addWishlistCollection, toggleComparisonItem, addWishlistItem, wishlist, viewRole } = useUIState();
  const { addB2bOrderItem } = useB2BState();
  
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isGlassesTryOnOpen, setIsGlassesTryOnOpen] = useState(false);
  const [isFootwear360Open, setIsFootwear360Open] = useState(false);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const showGlassesTryOn = productShowsGlassesTryOn(product);
  const showFootwear360 = productShowsFootwear360(product);

  const isInWishlist = useMemo(() => wishlist.some(item => item.id === product.id), [product.id, wishlist]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewRole === 'b2b') {
      addB2bOrderItem(product, product.sizes?.[0].name || "One Size", 10);
      toast({
          title: "Товар добавлен в B2B заказ",
          description: `Минимальная партия (10 ед.) ${product.name} добавлена.`,
      });
    } else {
      addCartItem(product, product.sizes?.[0].name || "One Size");
      toast({
          title: "Товар добавлен в корзину",
          description: `${product.name} теперь в вашей корзине.`,
      });
    }
  };

  const handleToggleWishlist = (collectionId: string) => {
      addWishlistItem(product, collectionId);
      const collectionName = wishlistCollections.find(c => c.id === collectionId)?.name || '';
      toast({ title: "Добавлено в избранное", description: `${product.name} добавлено в "${collectionName}"` });
  };
  
  const handleCreateNewCollection = () => {
    if (newCollectionName.trim() === "") return;
    const newCollection = addWishlistCollection(newCollectionName);
    addWishlistItem(product, newCollection.id);
    toast({ title: "Подборка создана", description: `Товар добавлен в новую подборку "${newCollectionName}"` });
    setIsNewCollectionOpen(false);
    setNewCollectionName("");
  }
  
  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  // A/B test logic for a specific product
  const isTestVariant = useMemo(() => {
    // Show variant B for the cashmere sweater to users with even-length UIDs
    if (product.id === '1' && user?.uid) {
        return user.uid.length % 2 === 0;
    }
    return false;
  }, [user, product.id]);

  const displayImage = useMemo(() => {
    if (isTestVariant && product.images?.[1]) return product.images[1];
    return product.images?.[0] || { url: (product as any).image || '/placeholder.jpg', alt: product.name, hint: '' };
  }, [isTestVariant, product.images, product.image, product.name]);


  const isOutOfStock = product.sizes?.every(s => s.status === 'out_of_stock');

  if (viewMode === 'list') {
    return (
      <>
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
            {(showGlassesTryOn || showFootwear360) && (
              <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-20">
                {showGlassesTryOn && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[10px] px-2 shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsGlassesTryOnOpen(true);
                    }}
                  >
                    <Glasses className="h-3 w-3 mr-1" />
                    Примерить
                  </Button>
                )}
                {showFootwear360 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[10px] px-2 shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsFootwear360Open(true);
                    }}
                  >
                    <Footprints className="h-3 w-3 mr-1" />
                    360°
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-base font-headline leading-tight mt-1 hover:text-accent transition-colors">{product.name}</h3>
                </Link>
                 {onReviewsClick && product.rating && (
                  <button className="flex items-center gap-1 mt-2 text-sm text-muted-foreground" onClick={onReviewsClick}>
                    <Heart className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span>({product.reviewCount})</span>
                  </button>
                )}
              </div>
               <div className="text-right">
                <p className="font-semibold text-sm">{product.price.toLocaleString('ru-RU')} ₽</p>
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
                <Button size="sm" variant="ghost" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleWishlist(wishlistCollections[0]?.id || "default"); }}>
                    <Heart className={cn("h-5 w-5", isInWishlist && "fill-current text-red-500")} />
                    <span className="sr-only">Добавить в избранное</span>
                </Button>
                {isOutOfStock ? (
                  <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast({ title: "Добавлено в лист ожидания", description: "Мы сообщим вам первым, когда товар появится в наличии." }); }}>
                      Лист ожидания
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleAddToCart}>
                      <ShoppingCart className="h-4 w-4 mr-2" /> Добавить в корзину
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      {showGlassesTryOn && (
        <ProductGlassesTryOnDialog product={product} open={isGlassesTryOnOpen} onOpenChange={setIsGlassesTryOnOpen} />
      )}
      {showFootwear360 && (
        <ProductFootwearExperienceDialog product={product} open={isFootwear360Open} onOpenChange={setIsFootwear360Open} />
      )}
      </>
    );
  }

  const b2bPriceMultiplier = useMemo(() => {
    if (!user?.activeOrganizationId) return 0.55; // Default 45% discount for B2B
    if (user.activeOrganizationId.includes('hq')) return 0.45; // 55% discount for HQ
    if (user.activeOrganizationId.includes('brand')) return 0.50; // 50% discount for Brands
    if (user.activeOrganizationId.includes('shop')) return 0.55; // 45% discount for Shops
    if (user.activeOrganizationId.includes('dist')) return 0.60; // 40% discount for Distributors
    return 0.55;
  }, [user?.activeOrganizationId]);

  const b2bTierName = useMemo(() => {
    if (!user?.activeOrganizationId) return 'Standard';
    if (user.activeOrganizationId.includes('hq')) return 'Strategic Partner';
    if (user.activeOrganizationId.includes('brand')) return 'VIP Brand';
    if (user.activeOrganizationId.includes('shop')) return 'Premium Retailer';
    return 'Standard Partner';
  }, [user?.activeOrganizationId]);

  return (
    <>
      <Card className="overflow-hidden flex flex-col transition-shadow duration-300 ease-in-out hover:shadow-xl bg-card group h-full">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Link href={`/products/${product.slug}`} className="block w-full h-full">
              <Image
              src={displayImage.url}
              alt={displayImage.alt}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={displayImage.hint}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </Link>
            {product.outlet && discountPercent > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">-{discountPercent}%</Badge>
            )}
            
            {product.outlet && discountPercent > 0 && (
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <Badge variant="destructive" className="text-[8px] font-black uppercase px-1.5 py-0.5 shadow-sm">-{discountPercent}%</Badge>
                </div>
            )}
            
            {/* Availability Status Badge */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 pointer-events-none items-end">
                {product.availability === 'in_stock' && (
                    <Badge className="bg-green-500 hover:bg-green-500 text-white border-none w-fit text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 shadow-sm">В наличии</Badge>
                )}
                {product.availability === 'pre_order' && (
                    <Badge className="bg-orange-500 hover:bg-orange-500 text-white border-none w-fit text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 shadow-sm">Предзаказ</Badge>
                )}
                {(product.isPromoted || (parseInt(product.id) % 3 === 0)) && (
                    <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white border-none w-fit text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 shadow-md flex items-center gap-1">
                        <Sparkles className="h-2 w-2" />
                        AI Recommended
                    </Badge>
                )}
                <Link href={`/dpp/${product.id}`} className="pointer-events-auto">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-slate-200 w-fit text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 shadow-sm flex items-center gap-1 hover:bg-white transition-colors">
                        <DppIcon className="h-2 w-2 text-indigo-600" />
                        Digital Passport
                    </Badge>
                </Link>
                <Link href={`/try-on/${product.id}`} className="pointer-events-auto">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-slate-200 w-fit text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 shadow-sm flex items-center gap-1 hover:bg-white transition-colors">
                        <Maximize2 className="h-2 w-2 text-rose-500" />
                        Virtual Try-On
                    </Badge>
                </Link>
            </div>

            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button id={`wishlist-popover-trigger-${product.id}`} size="icon" variant="ghost" className="h-8 w-8 bg-background/50 backdrop-blur-sm"><Star className={cn("h-4 w-4", isInWishlist && "fill-amber-500 text-amber-500")} /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-1">
                       <div className="space-y-1">
                            <p className="font-semibold text-sm p-2">Добавить в избранное</p>
                            {wishlistCollections.map(c => (
                                <Button key={c.id} variant="ghost" className="w-full justify-start" onClick={() => handleToggleWishlist(c.id)}>{c.name}</Button>
                            ))}
                            <Button variant="secondary" className="w-full justify-start mt-1" onClick={() => setIsNewCollectionOpen(true)}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Новая подборка
                            </Button>
                       </div>
                    </PopoverContent>
                </Popover>
                 <Button size="icon" variant="ghost" className="h-8 w-8 bg-background/50 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleComparisonItem(product); }}>
                  <Scale className="h-4 w-4" />
                </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-wrap gap-1">
                  {showGlassesTryOn && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="bg-background/90 text-foreground shadow-md backdrop-blur-sm h-8 text-[10px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsGlassesTryOnOpen(true);
                      }}
                    >
                      <Glasses className="h-3.5 w-3.5 mr-1" />
                      Примерить
                    </Button>
                  )}
                  {showFootwear360 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="bg-background/90 text-foreground shadow-md backdrop-blur-sm h-8 text-[10px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFootwear360Open(true);
                      }}
                    >
                      <Footprints className="h-3.5 w-3.5 mr-1" />
                      360°
                    </Button>
                  )}
                </div>
                <Button size="sm" className="bg-background/80 text-foreground hover:bg-background shadow-md backdrop-blur-sm shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true);}}>
                    <Search className="h-4 w-4 mr-2"/>
                    Быстрый просмотр
                </Button>
            </div>
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{product.brand}</p>
                {viewRole === 'b2b' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldCheck className="h-3 w-3 text-emerald-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 text-white border-none text-[7px] font-black uppercase tracking-widest p-2 rounded-lg">
                        Верифицированный партнер
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-base font-semibold leading-tight mt-1 hover:text-accent transition-colors">{product.name}</h3>
              </Link>
              {viewRole === 'b2b' && (
                <div className="mt-2 flex items-center gap-2">
                   <Badge className="bg-indigo-50 text-indigo-600 border-none text-[7px] font-black uppercase">
                     ATS: {((parseInt(product.id) || 1) * 123) % 400 + 100} ед.
                   </Badge>
                   <Badge className="bg-amber-50 text-amber-600 border-none text-[7px] font-black uppercase">MOQ: 10</Badge>
                   <Badge className="bg-slate-900 text-white border-none text-[7px] font-black uppercase">{b2bTierName}</Badge>
                </div>
              )}
              {viewRole === 'b2b' && (
                <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between group/pulse">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-rose-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black uppercase tracking-widest text-rose-500 leading-none">AI Stock Pulse</span>
                      <span className="text-[9px] font-bold text-rose-900 mt-0.5 leading-none">Out of Stock through 7d</span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-400 hover:text-rose-600 hover:bg-white rounded-lg">
                          <PlusCircle className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 text-white border-none text-[8px] font-black uppercase tracking-widest p-2 rounded-xl">
                        Создать дозаказ (Replenishment)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
          </div>
          <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-sm">
                    {viewRole === 'b2b' ? (product.price * b2bPriceMultiplier).toLocaleString('ru-RU') : product.price.toLocaleString('ru-RU')} ₽
                  </p>
                  {viewRole === 'b2b' ? (
                    <p className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter">Оптовая цена (-{Math.round((1 - b2bPriceMultiplier) * 100)}%)</p>
                  ) : product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString('ru-RU')} ₽</p>
                  )}
              </div>
              {isOutOfStock ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-[9px] font-black uppercase tracking-widest border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast({
                      title: "Добавлено в лист ожидания",
                      description: "Мы сообщим вам первым, когда товар появится в наличии.",
                    });
                  }}
                >
                  Лист ожидания
                </Button>
              ) : (
                <Button size="icon" className="h-8 w-8 rounded-full bg-black hover:bg-accent transition-colors" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
          </div>
        </CardContent>
      </Card>

      <QuickViewDialog 
          product={product}
          isOpen={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
      />
      {showGlassesTryOn && (
        <ProductGlassesTryOnDialog product={product} open={isGlassesTryOnOpen} onOpenChange={setIsGlassesTryOnOpen} />
      )}
      {showFootwear360 && (
        <ProductFootwearExperienceDialog product={product} open={isFootwear360Open} onOpenChange={setIsFootwear360Open} />
      )}
      <Dialog open={isNewCollectionOpen} onOpenChange={setIsNewCollectionOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Создать новую подборку</DialogTitle>
                <DialogDescription>Введите название для вашей новой подборки в избранном.</DialogDescription>
            </DialogHeader>
            <Input value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} placeholder="Например, 'Летние образы'"/>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewCollectionOpen(false)}>Отмена</Button>
                <Button onClick={handleCreateNewCollection}>Создать и добавить</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
