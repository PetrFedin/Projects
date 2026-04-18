import React, { useState, forwardRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Star,
  Repeat,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Scale,
  Share2,
  View,
  Sparkles,
  PlusCircle,
  Bell,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product, ProductImage } from '@/lib/types';
import { CommunityLooksPreview } from '@/components/community-looks-preview';
import PriceComparisonTable from '@/components/price-comparison-table';
import { ProductReviewsDialog } from '@/components/product-reviews-dialog';
import { SizeGuideDialog } from '@/components/size-guide-dialog';
import { SimilarProductsDialog } from '@/components/similar-products-dialog';
import { WardrobeCompatibilityDialog } from '@/components/wardrobe/wardrobe-compatibility-dialog';
import { BestsellerRankingDialog } from '@/components/bestseller-ranking-dialog';
import Product3dViewer from '@/components/product-3d-viewer';
import { ArViewerDialog } from '@/components/ar-viewer';
import { ProductImageViewer } from '@/components/product-image-viewer';
import { NotifyMeDialog } from '@/components/notify-me-dialog';
import { ManageCartItemDialog } from '@/components/manage-cart-item-dialog';
import { UnsubscribeDialog } from '@/components/unsubscribe-dialog';
import { RecommendedProducts } from './RecommendedProducts';

function parseComposition(composition: any): { material: string; percentage: number }[] {
  if (Array.isArray(composition)) {
    return composition;
  }
  if (typeof composition === 'string') {
    const parts = composition.match(/(\d+%)\s*([^,]+)/g);
    if (parts) {
      return parts
        .map((part) => {
          const match = part.match(/(\d+)%\s*(.*)/);
          if (match) {
            return { percentage: parseInt(match[1], 10), material: match[2].trim() };
          }
          return { material: part, percentage: 0 };
        })
        .filter((p) => p.material);
    }
    return [{ material: composition, percentage: 100 }];
  }
  return [];
}

export const DetailPreview = forwardRef<
  HTMLDivElement,
  { settings: Record<string, boolean>; product: any }
>(({ settings, product: mockProduct }, ref) => {
  // This is a stripped-down version of the actual ProductPageContent for preview purposes.
  // It uses the same mock data and logic where possible.
  const { toast } = useToast();
  const {
    user,
    addCartItem,
    getCartItem,
    wishlist,
    wishlistCollections,
    addWishlistCollection,
    addWishlistItem,
    subscribedSizes,
    addSubscribedSize,
    removeSubscribedSize,
    availableSubscriptions,
    removeAvailableSubscription,
    newlyAvailableSizes,
    toggleComparisonItem,
    updateCartItemQuantity,
    getProductAvailability,
    activeColorSelection,
    setActiveColorSelection,
  } = useUIState();

  const product: Product = {
    id: '1',
    slug: 'mock-product',
    name: mockProduct.name,
    brand: mockProduct.brand,
    price: 24500,
    originalPrice: 35000,
    outlet: true,
    description: mockProduct.description,
    images: mockProduct.images,
    category: 'Трикотаж',
    subcategory: 'Свитера',
    sku: mockProduct.sku,
    color: 'mock',
    season: 'mock',
    sustainability: ['Переработанные материалы'],
    wardrobeCompatibility: { score: 75, comment: '' },
    sizes: mockProduct.sizes.map((s: string) => ({ name: s })),
    availableColors: mockProduct.availableColors,
    rating: 4.5,
    reviewCount: 124,
    bestsellerRank: 3,
    hasAR: true,
    composition: '80% Кашемир, 20% Шелк',
  };

  const activeColor = React.useMemo(() => {
    const selection =
      activeColorSelection?.productId === product.id ? activeColorSelection.colorName : undefined;
    const color = product.availableColors?.find((c) => c.name === selection);
    return color || product.availableColors?.[0];
  }, [product, activeColorSelection]);

  const imagesForCurrentColor = React.useMemo((): ProductImage[] => {
    if (!activeColor || !product.images) return product.images ?? [];
    const colorImages = mockProduct.images.filter(
      (img: ProductImage) => img.colorName === activeColor.name
    );
    return colorImages.length > 0
      ? colorImages.map((img: ProductImage) => ({ ...img, url: img.url, alt: img.alt }))
      : mockProduct.images.map((img: ProductImage) => ({ ...img, url: img.url, alt: img.alt }));
  }, [activeColor, mockProduct.images, product.images]);

  const [activeImage, setActiveImage] = useState(imagesForCurrentColor[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSimilarProductsOpen, setIsSimilarProductsOpen] = useState(false);
  const [isCompatibilityOpen, setIsCompatibilityOpen] = useState(false);
  const [isBestsellerOpen, setIsBestsellerOpen] = useState(false);
  const [is3dOpen, setIs3dOpen] = useState(false);
  const [isArOpen, setIsArOpen] = useState(false);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [priceDisplayMode, setPriceDisplayMode] = useState<'plan' | 'bonus'>('plan');
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerStartIndex, setImageViewerStartIndex] = useState(0);

  const [notifyDialogSize, setNotifyDialogSize] = useState<string | null>(null);
  const [manageCartItem, setManageCartItem] = useState<ReturnType<typeof getCartItem>>(undefined);
  const [unsubscribeDialogSize, setUnsubscribeDialogSize] = useState<string | null>(null);
  const [notifyDialogMode, setNotifyDialogMode] = useState<'subscribe' | 'pre_order'>('subscribe');
  const [notifyDialogPreOrderDate, setNotifyDialogPreOrderDate] = useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    setActiveImage(imagesForCurrentColor[0]);
    setSelectedSize(undefined); // Reset size on color change
  }, [imagesForCurrentColor]);

  const isInWishlist = React.useMemo(
    () => wishlist.some((item) => item.id === product.id),
    [product.id, wishlist]
  );

  const handleAddToCart = () => {
    const allSizes = product.sizes?.map((s) => s.name) || [];
    const sizeToAdd = allSizes.length > 0 ? selectedSize : 'One Size';

    if (!sizeToAdd) {
      toast({
        variant: 'destructive',
        title: 'Размер не выбран',
        description: 'Пожалуйста, выберите размер.',
      });
      return;
    }

    addCartItem(product, sizeToAdd, quantity);
    toast({
      title: 'Товар добавлен в корзину',
      description: `${product.name} (Размер: ${sizeToAdd}, ${quantity} шт.) теперь в вашей корзине.`,
    });
  };

  const handleSelectSize = (sizeName: string) => {
    const allSizes = product.sizes?.map((s) => s.name) || [];
    if (allSizes.length === 0) return;

    const isNowAvailable = availableSubscriptions.some(
      (s) => s.productId === product.id && s.size === sizeName
    );
    if (isNowAvailable) {
      removeAvailableSubscription(product.id, sizeName);
      toast({
        title: 'Уведомление просмотрено',
        description: `Размер ${sizeName} снова в наличии!`,
      });
    }

    const isNewlyAvailable = newlyAvailableSizes.some(
      (s) => s.productId === product.id && s.size === sizeName
    );
    const sizeInfo = activeColor?.sizeAvailability?.find((s) => s.size === sizeName);
    const isAvailable =
      (sizeInfo?.status === 'in_stock' && (sizeInfo.quantity || 0) > 0) || isNewlyAvailable;
    const isPreOrder = sizeInfo?.status === 'pre_order';

    const cartItem = getCartItem(product.id, sizeName);
    if (cartItem) {
      setManageCartItem(cartItem);
      return;
    }

    const isSubscribed = subscribedSizes.some(
      (s) => s.productId === product.id && s.size === sizeName
    );
    if (isSubscribed) {
      setUnsubscribeDialogSize(sizeName);
      return;
    }

    if (!isAvailable) {
      setNotifyDialogSize(sizeName);
      if (isPreOrder) {
        setNotifyDialogMode('pre_order');
        setNotifyDialogPreOrderDate(sizeInfo?.preOrderDate);
      } else {
        setNotifyDialogMode('subscribe');
        setNotifyDialogPreOrderDate(undefined);
      }
      return;
    }

    setSelectedSize((current) => {
      const newSize = current === sizeName ? undefined : sizeName;
      if (newSize) {
        setQuantity(1);
      }
      return newSize;
    });
  };

  const colorInfo = activeColor;
  const sizeInfo = colorInfo?.sizeAvailability?.find((s) => s.size === selectedSize);
  const maxQuantity = sizeInfo?.status === 'in_stock' ? sizeInfo.quantity : undefined;

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) {
        setSelectedSize(undefined); // Unselect size if quantity is 0
        return 1;
      }
      if (maxQuantity !== undefined && newQuantity > maxQuantity) return maxQuantity;
      return newQuantity;
    });
  };

  const handleToggleWishlist = (collectionId: string) => {
    addWishlistItem(product, collectionId);
    const collectionName = wishlistCollections.find((c) => c.id === collectionId)?.name || '';
    toast({
      title: 'Добавлено в избранное',
      description: `${product.name} добавлено в "${collectionName}"`,
    });
  };

  const handleCreateNewCollection = async () => {
    if (newCollectionName.trim() === '') return;
    const newCollection = await addWishlistCollection(newCollectionName);
    addWishlistItem(product, newCollection.id);
    toast({
      title: 'Подборка создана',
      description: `Товар добавлен в новую подборку "${newCollectionName}"`,
    });
    setIsNewCollectionOpen(false);
    setNewCollectionName('');
  };

  const handleTogglePriceDisplay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPriceDisplayMode((prev) => (prev === 'plan' ? 'bonus' : 'plan'));
  };

  const allSizes = mockProduct.sizes;

  const { cashbackAmount, priceWithBonuses, bonusToUse } = React.useMemo(() => {
    if (!user || product.outlet) {
      return { cashbackAmount: 0, priceWithBonuses: null, bonusToUse: 0 };
    }

    const planDetails = {
      base: { cashback: 0, bonusLimit: 0.1 },
      start: { cashback: 0.03, bonusLimit: 0.2 },
      comfort: { cashback: 0.07, bonusLimit: 0.3 },
      premium: { cashback: 0.1, bonusLimit: 0.4 },
    };

    const plan = user.loyaltyPlan || 'base';
    const cashback = product.price * planDetails[plan].cashback;
    const maxBonusToUse = product.price * planDetails[plan].bonusLimit;
    const bonusToUse = Math.min(user.loyaltyPoints || 0, maxBonusToUse);
    const finalPrice = product.price - bonusToUse;

    return {
      cashbackAmount: Math.round(cashback),
      priceWithBonuses: Math.round(finalPrice),
      bonusToUse: Math.round(bonusToUse),
    };
  }, [user, product, priceDisplayMode]);

  const availability = getProductAvailability(product, activeColor);

  const handleOpenImageViewer = (index: number) => {
    setImageViewerStartIndex(index);
    setIsImageViewerOpen(true);
  };

  const composition = React.useMemo(
    () => parseComposition(product.composition),
    [product.composition]
  );

  const details = [
    { label: 'Артикул', value: product.sku, condition: settings.sku },
    { label: 'Сезон', value: product.season, condition: true },
    {
      label: 'Состав',
      value: composition.map((c) => `${c.material} ${c.percentage}%`).join(', ') || 'не указан',
      condition: settings.composition,
    },
    { label: 'Уход', value: 'Только ручная стирка', condition: settings.care_info },
  ];

  const handleConfirmSubscription = () => {
    if (notifyDialogSize) {
      if (notifyDialogMode === 'subscribe') {
        addSubscribedSize(product.id, notifyDialogSize);
        toast({
          title: `Вы подписались на размер ${notifyDialogSize}`,
          description: 'Мы сообщим, когда он появится в наличии.',
        });
      } else {
        // pre_order
        toast({
          title: 'Предзаказ оформлен',
          description: `Мы сообщим, когда ${product.name} размера ${notifyDialogSize} поступит в продажу.`,
        });
      }
      setNotifyDialogSize(null);
    }
  };

  const handleConfirmUnsubscribe = () => {
    if (unsubscribeDialogSize) {
      removeSubscribedSize(product.id, unsubscribeDialogSize);
      toast({
        title: 'Подписка отменена',
        description: `Вы больше не будете получать уведомления о поступлении размера ${unsubscribeDialogSize}.`,
      });
      setUnsubscribeDialogSize(null);
    }
  };

  return (
    <>
      <div className="grid gap-3 p-4 md:grid-cols-2 md:p-4 lg:gap-3" ref={ref}>
        {/* Image Gallery */}
        {settings.image && (
          <div className="flex flex-col gap-3">
            <div
              className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-lg border"
              onClick={() =>
                handleOpenImageViewer(
                  imagesForCurrentColor.findIndex((img: ProductImage) => img.id === activeImage.id)
                )
              }
            >
              <Image
                src={activeImage?.url || imagesForCurrentColor[0].url}
                alt={activeImage?.alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                {settings.promo_badge && product.isPromoted && (
                  <Badge variant="default" className="bg-accent text-sm text-accent-foreground">
                    Промо
                  </Badge>
                )}
                {settings.discount_badge && product.outlet && product.originalPrice && (
                  <Badge variant="destructive">
                    -
                    {(
                      ((product.originalPrice - product.price) / product.originalPrice) *
                      100
                    ).toFixed(0)}
                    %
                  </Badge>
                )}
              </div>
              {settings.bestseller_rank && product.bestsellerRank && (
                <Badge
                  variant="destructive"
                  className="absolute right-3 top-3 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBestsellerOpen(true);
                  }}
                >
                  #{product.bestsellerRank} в категории
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {imagesForCurrentColor.map((image: ProductImage) => (
                <div
                  key={image.id}
                  className={cn(
                    'relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2',
                    activeImage.id === image.id ? 'border-primary' : 'border-transparent'
                  )}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Product Info */}
        <div className="py-4">
          {settings.brand && <p className="font-medium text-muted-foreground">{product.brand}</p>}
          {settings.product_name && (
            <h1 className="mt-1 font-headline text-base font-bold lg:text-sm">{product.name}</h1>
          )}

          {settings.rating && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
              <button
                className="text-sm text-muted-foreground underline hover:text-primary"
                onClick={() => setIsReviewsOpen(true)}
              >
                ({product.reviewCount} отзывов)
              </button>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              {settings.price && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-pointer text-base font-bold text-primary">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </TooltipTrigger>
                    {cashbackAmount > 0 && (
                      <TooltipContent>
                        <p>Начислим {cashbackAmount.toLocaleString('ru-RU')} кэшбэк-бонусов</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
              {settings.old_price && product.outlet && product.originalPrice && (
                <p className="text-base text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString('ru-RU')} ₽
                </p>
              )}
            </div>

            {priceWithBonuses !== null && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-green-600">
                      <span>
                        {priceDisplayMode === 'plan'
                          ? `+ ${cashbackAmount.toLocaleString('ru-RU')} Б`
                          : `${priceWithBonuses.toLocaleString('ru-RU')} ₽`}
                      </span>
                      <button
                        onClick={handleTogglePriceDisplay}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Repeat className="h-4 w-4" />
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {priceDisplayMode === 'plan'
                        ? `Начислим ${cashbackAmount.toLocaleString('ru-RU')} кэшбэк-бонусов по вашему тарифу "${user?.loyaltyPlan}"`
                        : `Цена при списании ${bonusToUse.toLocaleString('ru-RU')} бонусов.`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {settings.availability_status && (
              <div className="flex items-center gap-2">
                <availability.icon className={cn('h-4 w-4', availability.className)} />
                <span className="text-sm font-medium">{availability.text}</span>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {settings.color_swatches &&
            product.availableColors &&
            product.availableColors.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Цвет: <span className="font-semibold text-foreground">{activeColor?.name}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((color) => (
                    <TooltipProvider key={color.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              'h-8 w-8 rounded-full border-2',
                              activeColor?.id === color.id
                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                : 'border-border/50'
                            )}
                            style={{ backgroundColor: color.hex }}
                            onClick={() =>
                              setActiveColorSelection({
                                productId: product.id,
                                colorName: color.name,
                              })
                            }
                            aria-label={`Выбрать цвет ${color.name}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}

          {settings.size_selector && allSizes.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Выберите размер</h3>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  AI Гид по размерам
                </Button>
              </div>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((sizeName: string) => {
                    const isNewlyAvailable = newlyAvailableSizes.some(
                      (s) => s.productId === product.id && s.size === sizeName
                    );
                    const isNowAvailable = availableSubscriptions.some(
                      (s) => s.productId === product.id && s.size === sizeName
                    );
                    const sizeInfo = activeColor?.sizeAvailability?.find(
                      (s) => s.size === sizeName
                    );
                    const isAvailable =
                      (sizeInfo?.status === 'in_stock' && (sizeInfo.quantity || 0) > 0) ||
                      isNewlyAvailable;
                    const isPreOrder = sizeInfo?.status === 'pre_order';

                    const isSelected = selectedSize === sizeName;
                    const cartItem = getCartItem(product.id, sizeName);
                    const isSubscribed = subscribedSizes.some(
                      (s) => s.productId === product.id && s.size === sizeName
                    );

                    return (
                      <Tooltip key={sizeName}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSelected || !!cartItem ? 'default' : 'outline'}
                            className={cn(
                              'relative h-10 w-12',
                              !isAvailable &&
                                !cartItem &&
                                !isNowAvailable &&
                                !isPreOrder &&
                                product.availability !== 'coming_soon' &&
                                'text-muted-foreground/50 line-through decoration-muted-foreground/50',
                              isSubscribed &&
                                'border-green-300 bg-green-100 text-green-800 hover:bg-green-200',
                              isNowAvailable &&
                                !isSelected &&
                                'animate-pulse border-blue-300 bg-blue-100 text-blue-800'
                            )}
                            onClick={() => handleSelectSize(sizeName)}
                            disabled={
                              !isAvailable &&
                              !cartItem &&
                              !isNowAvailable &&
                              !isPreOrder &&
                              product.availability !== 'coming_soon'
                            }
                          >
                            {cartItem && (
                              <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {cartItem.quantity}
                              </div>
                            )}
                            {isSubscribed && (
                              <Bell className="absolute -right-1.5 -top-1.5 h-4 w-4 text-green-700" />
                            )}
                            {isNowAvailable && !isSelected && (
                              <Check className="absolute -right-1.5 -top-1.5 h-4 w-4 text-blue-700" />
                            )}
                            {sizeName}
                          </Button>
                        </TooltipTrigger>
                        {!isAvailable && !cartItem && !isPreOrder && (
                          <TooltipContent>
                            <p>Сообщить о поступлении</p>
                          </TooltipContent>
                        )}
                        {isPreOrder && !cartItem && (
                          <TooltipContent>
                            <p>Оформить предзаказ</p>
                          </TooltipContent>
                        )}
                        {isSubscribed && (
                          <TooltipContent>
                            <p>Отказаться от ожидания</p>
                          </TooltipContent>
                        )}
                        {isNowAvailable && (
                          <TooltipContent>
                            <p>Товар снова в наличии!</p>
                          </TooltipContent>
                        )}
                        {cartItem && (
                          <TooltipContent>
                            <p>Изменить количество в корзине</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          )}

          <div className="mt-6 space-y-4 border-t pt-6 text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {details
                .filter((d) => d.condition && d.value)
                .map((detail) => (
                  <React.Fragment key={detail.label}>
                    <div className="font-medium text-foreground">{detail.label}</div>
                    <div>{detail.value}</div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          {settings.wardrobe_compatibility && product.wardrobeCompatibility && (
            <Button
              variant="link"
              className="mt-2 text-muted-foreground"
              onClick={() => setIsCompatibilityOpen(true)}
            >
              Совместимость с гардеробом: {product.wardrobeCompatibility.score}%
            </Button>
          )}

          {settings.add_to_cart_button && (
            <div className="mt-8 flex items-center gap-2">
              {selectedSize ? (
                <>
                  <div className="flex items-center gap-1 rounded-md border p-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      readOnly
                      value={quantity}
                      className="h-9 w-12 border-none p-0 text-center font-bold focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleQuantityChange(1)}
                      disabled={maxQuantity !== undefined && quantity >= maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Добавить
                  </Button>
                </>
              ) : (
                <Button size="lg" className="flex-1" disabled={allSizes.length > 0}>
                  Выберите размер
                </Button>
              )}
              {settings.wishlist_button && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-11 w-11"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <Heart
                        className={cn('h-5 w-5', isInWishlist && 'fill-current text-red-500')}
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
              )}
              {settings.compare_button && (
                <Button
                  size="icon"
                  variant="outline"
                  className="h-11 w-11"
                  onClick={() => toggleComparisonItem(product)}
                >
                  <Scale className="h-5 w-5" />
                </Button>
              )}
              {settings.share_button && (
                <Button size="icon" variant="outline" className="h-11 w-11">
                  <Share2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {settings['3d_viewer_button'] && product.hasAR && (
              <Button size="lg" variant="outline" onClick={() => setIs3dOpen(true)}>
                <View className="mr-2 h-5 w-5 text-accent" /> Просмотр в 3D
              </Button>
            )}
            {settings.ar_button && product.hasAR && (
              <Button size="lg" variant="outline" onClick={() => setIsArOpen(true)}>
                <Sparkles className="mr-2 h-5 w-5 text-accent" /> Digital-Примерка
              </Button>
            )}
          </div>
        </div>
      </div>

      {settings.community_looks && <CommunityLooksPreview productId={product.id} />}
      {settings.price_comparison && (
        <div className="my-16">
          <PriceComparisonTable productId={product.id} />
        </div>
      )}
      {settings.recommendations && <RecommendedProducts productId={product.id} />}
      {settings.reviews_block && (
        <div className="mt-16">
          <ProductReviewsDialog
            product={product}
            isOpen={isReviewsOpen}
            onOpenChange={setIsReviewsOpen}
          />
        </div>
      )}

      {isReviewsOpen && (
        <ProductReviewsDialog
          product={product}
          isOpen={isReviewsOpen}
          onOpenChange={setIsReviewsOpen}
        />
      )}
      {isSizeGuideOpen && (
        <SizeGuideDialog
          product={product}
          isOpen={isSizeGuideOpen}
          onOpenChange={setIsSizeGuideOpen}
        />
      )}
      {isSimilarProductsOpen && (
        <SimilarProductsDialog
          product={product}
          isOpen={isSimilarProductsOpen}
          onOpenChange={setIsSimilarProductsOpen}
        />
      )}
      {isCompatibilityOpen && (
        <WardrobeCompatibilityDialog
          product={product}
          isOpen={isCompatibilityOpen}
          onOpenChange={setIsCompatibilityOpen}
        />
      )}
      {isBestsellerOpen && (
        <BestsellerRankingDialog
          product={product}
          isOpen={isBestsellerOpen}
          onOpenChange={setIsBestsellerOpen}
        />
      )}
      {product.hasAR && is3dOpen && (
        <Product3dViewer product={product} isOpen={is3dOpen} onOpenChange={setIs3dOpen} />
      )}
      {product.hasAR && isArOpen && (
        <ArViewerDialog product={product} isOpen={isArOpen} onOpenChange={setIsArOpen} />
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
      <ProductImageViewer
        productName={product.name}
        images={imagesForCurrentColor}
        isOpen={isImageViewerOpen}
        onOpenChange={setIsImageViewerOpen}
        startIndex={imageViewerStartIndex}
      />
      {notifyDialogSize && (
        <NotifyMeDialog
          product={product}
          size={notifyDialogSize}
          mode={notifyDialogMode}
          preOrderDate={notifyDialogPreOrderDate}
          isOpen={!!notifyDialogSize}
          onOpenChange={(open) => !open && setNotifyDialogSize(null)}
          onConfirm={handleConfirmSubscription}
        />
      )}
      {manageCartItem && (
        <ManageCartItemDialog
          product={product}
          cartItem={manageCartItem}
          isOpen={!!manageCartItem}
          onOpenChange={(open) => !open && setManageCartItem(undefined)}
          onUpdate={(quantity) => {
            if (manageCartItem) {
              updateCartItemQuantity(manageCartItem.id, quantity, manageCartItem.selectedSize);
            }
          }}
          onRemove={() => {
            // In a real app, you'd call a remove function here.
          }}
        />
      )}
      {unsubscribeDialogSize && (
        <UnsubscribeDialog
          product={product}
          size={unsubscribeDialogSize}
          isOpen={!!unsubscribeDialogSize}
          onOpenChange={(open) => !open && setUnsubscribeDialogSize(null)}
          onConfirm={handleConfirmUnsubscribe}
        />
      )}
    </>
  );
});
DetailPreview.displayName = 'DetailPreview';
