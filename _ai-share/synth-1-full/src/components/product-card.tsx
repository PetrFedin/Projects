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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import {
  PlusCircle,
  Package,
  TrendingUp,
  Info as InfoIcon,
  ShieldCheck,
  Sparkles,
  FileText as DppIcon,
  Glasses,
  Footprints,
} from 'lucide-react';
import {
  productShowsFootwear360,
  productShowsGlassesTryOn,
} from '@/lib/product-experience/resolvers';
import { ProductGlassesTryOnDialog } from '@/components/product-experience/product-glasses-try-on-dialog';
import { ProductFootwearExperienceDialog } from '@/components/product-experience/product-footwear-experience-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onReviewsClick?: () => void;
}

export default function ProductCard({
  product,
  viewMode = 'grid',
  onReviewsClick,
}: ProductCardProps) {
  const { toast } = useToast();
  const {
    user,
    addCartItem,
    wishlistCollections,
    addWishlistCollection,
    toggleComparisonItem,
    addWishlistItem,
    wishlist,
    viewRole,
  } = useUIState();
  const { addB2bOrderItem } = useB2BState();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isGlassesTryOnOpen, setIsGlassesTryOnOpen] = useState(false);
  const [isFootwear360Open, setIsFootwear360Open] = useState(false);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const showGlassesTryOn = productShowsGlassesTryOn(product);
  const showFootwear360 = productShowsFootwear360(product);

  const isInWishlist = useMemo(
    () => wishlist.some((item) => item.id === product.id),
    [product.id, wishlist]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewRole === 'b2b') {
      addB2bOrderItem(product, product.sizes?.[0].name || 'One Size', 10);
      toast({
        title: 'Товар добавлен в B2B заказ',
        description: `Минимальная партия (10 ед.) ${product.name} добавлена.`,
      });
    } else {
      addCartItem(product, product.sizes?.[0].name || 'One Size');
      toast({
        title: 'Товар добавлен в корзину',
        description: `${product.name} теперь в вашей корзине.`,
      });
    }
  };

  const handleToggleWishlist = (collectionId: string) => {
    addWishlistItem(product, collectionId);
    const collectionName = wishlistCollections.find((c) => c.id === collectionId)?.name || '';
    toast({
      title: 'Добавлено в избранное',
      description: `${product.name} добавлено в "${collectionName}"`,
    });
  };

<<<<<<< HEAD
  const handleCreateNewCollection = () => {
    if (newCollectionName.trim() === '') return;
    const newCollection = addWishlistCollection(newCollectionName);
=======
  const handleCreateNewCollection = async () => {
    if (newCollectionName.trim() === '') return;
    const newCollection = await addWishlistCollection(newCollectionName);
>>>>>>> recover/cabinet-wip-from-stash
    addWishlistItem(product, newCollection.id);
    toast({
      title: 'Подборка создана',
      description: `Товар добавлен в новую подборку "${newCollectionName}"`,
    });
    setIsNewCollectionOpen(false);
    setNewCollectionName('');
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
<<<<<<< HEAD
    return (
      product.images?.[0] || {
        url: (product as any).image || '/placeholder.jpg',
        alt: product.name,
        hint: '',
      }
    );
  }, [isTestVariant, product.images, product.image, product.name]);

  const isOutOfStock = product.sizes?.every((s) => s.status === 'out_of_stock');

  if (viewMode === 'list') {
    return (
      <>
        <Card className="group w-full overflow-hidden bg-card transition-shadow duration-300 ease-in-out hover:shadow-2xl">
          <div className="flex">
            <div className="relative aspect-[3/4] w-1/4">
              <Link href={`/products/${product.slug}`} className="block h-full w-full">
                <Image
                  src={displayImage.url}
                  alt={displayImage.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={displayImage.hint}
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                />
                {product.outlet && discountPercent > 0 && (
                  <Badge variant="destructive" className="absolute left-2 top-2">
                    -{discountPercent}%
                  </Badge>
                )}
              </Link>
              {(showGlassesTryOn || showFootwear360) && (
                <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-1">
                  {showGlassesTryOn && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-[10px] shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsGlassesTryOnOpen(true);
                      }}
                    >
                      <Glasses className="mr-1 h-3 w-3" />
                      Примерить
                    </Button>
                  )}
                  {showFootwear360 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-[10px] shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFootwear360Open(true);
                      }}
                    >
                      <Footprints className="mr-1 h-3 w-3" />
                      360°
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1 font-headline text-base leading-tight transition-colors hover:text-accent">
                      {product.name}
                    </h3>
                  </Link>
                  {onReviewsClick && product.rating && (
                    <button
                      className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"
                      onClick={onReviewsClick}
                    >
                      <Heart className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span>({product.reviewCount})</span>
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{product.price.toLocaleString('ru-RU')} ₽</p>
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString('ru-RU')} ₽
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-2 max-w-prose flex-grow text-sm text-muted-foreground">
                {product.description.substring(0, 120)}...
              </p>
              {product.sustainability && product.sustainability.length > 0 && (
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {product.sustainability[0]}
                  </Badge>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded-full border-2 border-card-foreground/10 bg-black"
                    title="Черный"
                  ></span>
                  <span
                    className="h-5 w-5 rounded-full border-2 border-card-foreground/10 bg-gray-300"
                    title="Серый"
                  ></span>
                  <span
                    className="h-5 w-5 rounded-full border-2 border-card-foreground/10 bg-blue-900"
                    title="Темно-синий"
                  ></span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleWishlist(wishlistCollections[0]?.id || 'default');
                    }}
                  >
                    <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current text-red-500')} />
                    <span className="sr-only">Добавить в избранное</span>
                  </Button>
                  {isOutOfStock ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toast({
                          title: 'Добавлено в лист ожидания',
                          description: 'Мы сообщим вам первым, когда товар появится в наличии.',
                        });
                      }}
                    >
                      Лист ожидания
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleAddToCart}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Добавить в корзину
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
        {showGlassesTryOn && (
          <ProductGlassesTryOnDialog
            product={product}
            open={isGlassesTryOnOpen}
            onOpenChange={setIsGlassesTryOnOpen}
          />
        )}
        {showFootwear360 && (
          <ProductFootwearExperienceDialog
            product={product}
            open={isFootwear360Open}
            onOpenChange={setIsFootwear360Open}
          />
        )}
      </>
=======
    return (
      product.images?.[0] || {
        url: (product as any).image || '/placeholder.jpg',
        alt: product.name,
        hint: '',
      }
>>>>>>> recover/cabinet-wip-from-stash
    );
  }, [isTestVariant, product.images, product.name]);

  const isOutOfStock = product.sizes?.every(
    (s) => (s as { status?: string }).status === 'out_of_stock'
  );

  const b2bPriceMultiplier = useMemo(() => {
    if (!user?.activeOrganizationId) return 0.55; // Default 45% discount for B2B
    if (user.activeOrganizationId.includes('hq')) return 0.45; // 55% discount for HQ
    if (user.activeOrganizationId.includes('brand')) return 0.5; // 50% discount for Brands
    if (user.activeOrganizationId.includes('shop')) return 0.55; // 45% discount for Shops
    if (user.activeOrganizationId.includes('dist')) return 0.6; // 40% discount for Distributors
    return 0.55;
  }, [user?.activeOrganizationId]);

  const b2bTierName = useMemo(() => {
    if (!user?.activeOrganizationId) return 'Standard';
    if (user.activeOrganizationId.includes('hq')) return 'Strategic Partner';
    if (user.activeOrganizationId.includes('brand')) return 'VIP Brand';
    if (user.activeOrganizationId.includes('shop')) return 'Premium Retailer';
    return 'Standard Partner';
  }, [user?.activeOrganizationId]);

<<<<<<< HEAD
=======
  if (viewMode === 'list') {
    return (
      <>
        <Card className="group w-full overflow-hidden bg-card transition-shadow duration-300 ease-in-out hover:shadow-2xl">
          <div className="flex">
            <div className="relative aspect-[3/4] w-1/4">
              <Link href={`/products/${product.slug}`} className="block h-full w-full">
                <Image
                  src={displayImage.url}
                  alt={displayImage.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={displayImage.hint}
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                />
                {product.outlet && discountPercent > 0 && (
                  <Badge variant="destructive" className="absolute left-2 top-2">
                    -{discountPercent}%
                  </Badge>
                )}
              </Link>
              {(showGlassesTryOn || showFootwear360) && (
                <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-1">
                  {showGlassesTryOn && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-[10px] shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsGlassesTryOnOpen(true);
                      }}
                    >
                      <Glasses className="mr-1 h-3 w-3" />
                      Примерить
                    </Button>
                  )}
                  {showFootwear360 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-[10px] shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFootwear360Open(true);
                      }}
                    >
                      <Footprints className="mr-1 h-3 w-3" />
                      360°
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1 font-headline text-base leading-tight transition-colors hover:text-accent">
                      {product.name}
                    </h3>
                  </Link>
                  {onReviewsClick && product.rating && (
                    <button
                      className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"
                      onClick={onReviewsClick}
                    >
                      <Heart className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span>({product.reviewCount})</span>
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{product.price.toLocaleString('ru-RU')} ₽</p>
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString('ru-RU')} ₽
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-2 max-w-prose flex-grow text-sm text-muted-foreground">
                {product.description.substring(0, 120)}...
              </p>
              {product.sustainability && product.sustainability.length > 0 && (
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {product.sustainability[0]}
                  </Badge>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded-full border-2 border-card-foreground/10 bg-black"
                    title="Черный"
                  ></span>
                  <span
                    className="h-5 w-5 rounded-full border-2 border-card-foreground/10 bg-gray-300"
                    title="Серый"
                  ></span>
                  <span
                    className="h-5 w-5 rounded-full border-2 border-card-foreground/10 bg-blue-900"
                    title="Темно-синий"
                  ></span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleWishlist(wishlistCollections[0]?.id || 'default');
                    }}
                  >
                    <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current text-red-500')} />
                    <span className="sr-only">Добавить в избранное</span>
                  </Button>
                  {isOutOfStock ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toast({
                          title: 'Добавлено в лист ожидания',
                          description: 'Мы сообщим вам первым, когда товар появится в наличии.',
                        });
                      }}
                    >
                      Лист ожидания
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleAddToCart}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Добавить в корзину
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
        {showGlassesTryOn && (
          <ProductGlassesTryOnDialog
            product={product}
            open={isGlassesTryOnOpen}
            onOpenChange={setIsGlassesTryOnOpen}
          />
        )}
        {showFootwear360 && (
          <ProductFootwearExperienceDialog
            product={product}
            open={isFootwear360Open}
            onOpenChange={setIsFootwear360Open}
          />
        )}
      </>
    );
  }

>>>>>>> recover/cabinet-wip-from-stash
  return (
    <>
      <Card className="group flex h-full flex-col overflow-hidden bg-card transition-shadow duration-300 ease-in-out hover:shadow-xl">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
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
            <Badge variant="destructive" className="absolute left-2 top-2">
              -{discountPercent}%
            </Badge>
          )}

          {product.outlet && discountPercent > 0 && (
            <div className="pointer-events-none absolute left-2 top-2 z-10">
              <Badge
                variant="destructive"
                className="px-1.5 py-0.5 text-[8px] font-black uppercase shadow-sm"
              >
                -{discountPercent}%
              </Badge>
            </div>
          )}

          {/* Availability Status Badge */}
          <div className="pointer-events-none absolute right-2 top-2 z-10 flex flex-col items-end gap-1.5">
            {product.availability === 'in_stock' && (
              <Badge className="w-fit border-none bg-green-500 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter text-white shadow-sm hover:bg-green-500">
                В наличии
              </Badge>
            )}
            {product.availability === 'pre_order' && (
              <Badge className="w-fit border-none bg-orange-500 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter text-white shadow-sm hover:bg-orange-500">
                Предзаказ
              </Badge>
            )}
            {(product.isPromoted || parseInt(product.id) % 3 === 0) && (
<<<<<<< HEAD
              <Badge className="flex w-fit items-center gap-1 border-none bg-indigo-600 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter text-white shadow-md hover:bg-indigo-600">
=======
              <Badge className="bg-accent-primary text-text-inverse hover:bg-accent-primary flex w-fit items-center gap-1 border-none px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
                <Sparkles className="h-2 w-2" />
                AI Recommended
              </Badge>
            )}
            <Link href={`/dpp/${product.id}`} className="pointer-events-auto">
<<<<<<< HEAD
              <Badge className="flex w-fit items-center gap-1 border-slate-200 bg-white/90 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter text-slate-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
                <DppIcon className="h-2 w-2 text-indigo-600" />
=======
              <Badge className="border-border-subtle bg-bg-surface/90 text-text-primary hover:bg-bg-surface flex w-fit items-center gap-1 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter shadow-sm backdrop-blur-sm transition-colors">
                <DppIcon className="text-accent-primary h-2 w-2" />
>>>>>>> recover/cabinet-wip-from-stash
                Digital Passport
              </Badge>
            </Link>
            <Link href={`/try-on/${product.id}`} className="pointer-events-auto">
<<<<<<< HEAD
              <Badge className="flex w-fit items-center gap-1 border-slate-200 bg-white/90 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter text-slate-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
=======
              <Badge className="border-border-subtle bg-bg-surface/90 text-text-primary hover:bg-bg-surface flex w-fit items-center gap-1 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tighter shadow-sm backdrop-blur-sm transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                <Maximize2 className="h-2 w-2 text-rose-500" />
                Virtual Try-On
              </Badge>
            </Link>
          </div>

          <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={`wishlist-popover-trigger-${product.id}`}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-background/50 backdrop-blur-sm"
                >
                  <Star
                    className={cn('h-4 w-4', isInWishlist && 'fill-amber-500 text-amber-500')}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-1">
                <div className="space-y-1">
                  <p className="p-2 text-sm font-semibold">Добавить в избранное</p>
                  {wishlistCollections.map((c) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleToggleWishlist(c.id)}
                    >
                      {c.name}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    className="mt-1 w-full justify-start"
                    onClick={() => setIsNewCollectionOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Новая подборка
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleComparisonItem(product);
              }}
            >
              <Scale className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex flex-wrap gap-1">
              {showGlassesTryOn && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 bg-background/90 text-[10px] text-foreground shadow-md backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsGlassesTryOnOpen(true);
                  }}
                >
                  <Glasses className="mr-1 h-3.5 w-3.5" />
                  Примерить
                </Button>
              )}
              {showFootwear360 && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 bg-background/90 text-[10px] text-foreground shadow-md backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsFootwear360Open(true);
                  }}
                >
                  <Footprints className="mr-1 h-3.5 w-3.5" />
                  360°
                </Button>
              )}
            </div>
            <Button
              size="sm"
              className="shrink-0 bg-background/80 text-foreground shadow-md backdrop-blur-sm hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Быстрый просмотр
            </Button>
          </div>
        </div>
        <CardContent className="flex flex-grow flex-col p-4">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{product.brand}</p>
              {viewRole === 'b2b' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldCheck className="h-3 w-3 cursor-help text-emerald-500" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
<<<<<<< HEAD
                      className="rounded-lg border-none bg-slate-900 p-2 text-[7px] font-black uppercase tracking-widest text-white"
=======
                      className="bg-text-primary text-text-inverse rounded-lg border-none p-2 text-[7px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Верифицированный партнер
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-1 text-base font-semibold leading-tight transition-colors hover:text-accent">
                {product.name}
              </h3>
            </Link>
            {viewRole === 'b2b' && (
              <div className="mt-2 flex items-center gap-2">
<<<<<<< HEAD
                <Badge className="border-none bg-indigo-50 text-[7px] font-black uppercase text-indigo-600">
=======
                <Badge className="bg-accent-primary/10 text-accent-primary border-none text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  ATS: {(((parseInt(product.id) || 1) * 123) % 400) + 100} ед.
                </Badge>
                <Badge className="border-none bg-amber-50 text-[7px] font-black uppercase text-amber-600">
                  MOQ: 10
                </Badge>
<<<<<<< HEAD
                <Badge className="border-none bg-slate-900 text-[7px] font-black uppercase text-white">
=======
                <Badge className="bg-text-primary text-text-inverse border-none text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  {b2bTierName}
                </Badge>
              </div>
            )}
            {viewRole === 'b2b' && (
              <div className="group/pulse mt-2.5 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 p-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 animate-pulse text-rose-500" />
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase leading-none tracking-widest text-rose-500">
                      AI Stock Pulse
                    </span>
                    <span className="mt-0.5 text-[9px] font-bold leading-none text-rose-900">
                      Out of Stock through 7d
                    </span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-lg text-rose-400 hover:bg-white hover:text-rose-600"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
<<<<<<< HEAD
                      className="rounded-xl border-none bg-slate-900 p-2 text-[8px] font-black uppercase tracking-widest text-white"
=======
                      className="bg-text-primary text-text-inverse rounded-xl border-none p-2 text-[8px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Создать дозаказ (Replenishment)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">
                {viewRole === 'b2b'
                  ? (product.price * b2bPriceMultiplier).toLocaleString('ru-RU')
                  : product.price.toLocaleString('ru-RU')}{' '}
                ₽
              </p>
              {viewRole === 'b2b' ? (
<<<<<<< HEAD
                <p className="text-[8px] font-black uppercase tracking-tighter text-indigo-600">
=======
                <p className="text-accent-primary text-[8px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                  Оптовая цена (-{Math.round((1 - b2bPriceMultiplier) * 100)}%)
                </p>
              ) : (
                product.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString('ru-RU')} ₽
                  </p>
                )
              )}
            </div>
            {isOutOfStock ? (
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-orange-500 text-[9px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toast({
                    title: 'Добавлено в лист ожидания',
                    description: 'Мы сообщим вам первым, когда товар появится в наличии.',
                  });
                }}
              >
                Лист ожидания
              </Button>
            ) : (
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-black transition-colors hover:bg-accent"
                onClick={handleAddToCart}
              >
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
        <ProductGlassesTryOnDialog
          product={product}
          open={isGlassesTryOnOpen}
          onOpenChange={setIsGlassesTryOnOpen}
        />
      )}
      {showFootwear360 && (
        <ProductFootwearExperienceDialog
          product={product}
          open={isFootwear360Open}
          onOpenChange={setIsFootwear360Open}
        />
      )}
      <Dialog open={isNewCollectionOpen} onOpenChange={setIsNewCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новую подборку</DialogTitle>
            <DialogDescription>
              Введите название для вашей новой подборки в избранном.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Например, 'Летние образы'"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCollectionOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateNewCollection}>Создать и добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
