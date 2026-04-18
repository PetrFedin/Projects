'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Bell,
  Play,
  Camera,
  Maximize2,
  Cuboid as AR,
  PlusSquare,
  FolderHeart,
  FolderPlus,
  GitCompare,
  Truck,
  Minus,
  Plus,
  FileText,
  Sparkles,
  Check,
  Zap,
  ArrowRight,
  ArrowLeft,
  Share2,
  Library,
  Ruler,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { useToast } from '@/hooks/use-toast';
import { QuickViewDialog } from './quick-view-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { Product, SizeAvailabilityStatus } from '@/lib/types';
import { getSizeDetails } from '@/lib/size-guides';

interface SynthaProductCardProps {
  product: Product;
  forceBadge?: 'NEW' | 'BESTSELLER' | 'RECOMMENDED';
}

export function SynthaProductCard({ product, forceBadge }: SynthaProductCardProps) {
  const {
    cart,
    wishlist,
    addWishlistItem,
    removeWishlistItem,
    addCartItem,
    updateCartItemQuantity,
    wishlistCollections,
    lookboards,
    addProductToLookboard,
    comparisonList,
    toggleComparisonItem,
    savedComparisons,
    toggleCart,
    likedVideos,
    toggleLikedVideo,
    addWishlistCollection,
    addLookboard,
    saveComparison,
    setHoveredProduct,
    viewRole,
  } = useUIState();
  const { addB2bActivityLog, addToAssortmentPlan, assortmentPlan } = useB2BState();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [hoveredColorName, setHoveredColorName] = useState<string | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [cardMode, setCardMode] = useState<'gallery' | 'buy' | 'purchase'>('buy');
  const [galleryViewMode, setGalleryViewMode] = useState<'photo' | 'video'>('photo');
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [hoveredIconIndex, setHoveredIconIndex] = useState<number | null>(null);
  const [isBackorderRequested, setIsBackorderRequested] = useState(false);
  const [backorderStatus, setBackorderStatus] = useState<
    'idle' | 'requested' | 'confirmed' | 'rejected'
  >('idle');
  const [isPaid, setIsPaid] = useState(false);
  const [paidQuantities, setPaidQuantities] = useState<Record<string, number>>({});
  const [confirmedBackorderQuantities, setConfirmedBackorderQuantities] = useState<
    Record<string, number>
  >({});
  const colorScrollRef = React.useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isUserActive, setIsUserActive] = useState(false);
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
  const [isCreatingNewCollection, setIsCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Simulate brand response for backorder
  useEffect(() => {
    if (backorderStatus === 'requested') {
      const timer = setTimeout(() => {
        // 70% chance of confirmation for demo
        const isConfirmed = Math.random() > 0.3;
        setBackorderStatus(isConfirmed ? 'confirmed' : 'rejected');
        setIsPaid(false);

        if (isConfirmed && selectedSize) {
          // Симулируем частичное подтверждение (например, просили 2, подтвердили 1)
          const confirmedQty = quantity > 1 && Math.random() > 0.5 ? quantity - 1 : quantity;
          const key = `${currentColor.name}-${selectedSize}`;

          setConfirmedBackorderQuantities((prev) => ({ ...prev, [key]: confirmedQty }));

          // Обновляем количество в корзине до подтвержденного
          addCartItem({ ...product, color: currentColor.name } as any, selectedSize, confirmedQty);
          setQuantity(confirmedQty);

          if (confirmedQty < quantity) {
            toast({
              title: 'Частичное подтверждение',
              description: `Бренд подтвердил ${confirmedQty} из ${quantity} запрашиваемых единиц.`,
            });
          }
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [backorderStatus]);

  const scrollColors = (direction: 'left' | 'right') => {
    if (colorScrollRef.current) {
      const scrollAmount = direction === 'left' ? -40 : 40;
      colorScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Reset backorder state on color/size change
  useEffect(() => {
    setIsBackorderRequested(false);
    setBackorderStatus('idle');
    setIsPaid(false);
  }, [currentImageIndex, selectedSize]);

  // Auto-highlight icons every 3 seconds
  useEffect(() => {
    if (cardMode !== 'buy' || isPaused) {
      if (cardMode !== 'buy') setActiveIconIndex(-1);
      return;
    }
    const interval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % 5);
    }, 8000);
    return () => clearInterval(interval);
  }, [cardMode, isPaused]);

  // Auto-switch to Mode 2 (Buy) after 15 seconds of inactivity
  useEffect(() => {
    if (cardMode === 'buy' || isUserActive) return;

    const timer = setTimeout(() => {
      setCardMode('buy');
    }, 15000);

    return () => clearTimeout(timer);
  }, [cardMode, isUserActive]);

  // 1. Define Colors and currentColor
  const colors =
    product.availableColors ||
    (function () {
      const palettes: Record<string, { name: string; hex: string }[]> = {
        'Верхняя одежда': [
          { name: 'Бежевый', hex: '#d2b48c' },
          { name: 'Черный', hex: '#1a1a1a' },
          { name: 'Хаки', hex: '#4b5320' },
          { name: 'Темно-синий', hex: '#000080' },
        ],
        Топы: [
          { name: 'Белый', hex: '#ffffff' },
          { name: 'Голубой', hex: '#add8e6' },
          { name: 'Розовый', hex: '#ffb6c1' },
          { name: 'Черный', hex: '#1a1a1a' },
        ],
        Брюки: [
          { name: 'Серый', hex: '#808080' },
          { name: 'Черный', hex: '#1a1a1a' },
          { name: 'Темно-синий', hex: '#000080' },
          { name: 'Песочный', hex: '#c2b280' },
        ],
        Обувь: [
          { name: 'Белый', hex: '#ffffff' },
          { name: 'Черный', hex: '#1a1a1a' },
          { name: 'Коричневый', hex: '#8b4513' },
        ],
        Платья: [
          {
            name: 'Цветочный принт',
            hex: 'url(https://images.unsplash.com/photo-1585487000160-6ebcfceb08bd?w=100&q=80) center/cover',
          },
          { name: 'Черный', hex: '#1a1a1a' },
          { name: 'Красный', hex: '#8b0000' },
          { name: 'Голубой', hex: '#add8e6' },
        ],
        Аксессуары: [
          { name: 'Золотой', hex: '#ffd700' },
          { name: 'Серебряный', hex: '#c0c0c0' },
          { name: 'Мультиколор', hex: 'linear-gradient(45deg, #f06, #4a90e2)' },
        ],
      };

      const category = product.category || 'Default';
      const basePalette = palettes[category] || [
        { name: 'Черный', hex: '#000' },
        { name: 'Белый', hex: '#fff' },
        { name: 'Серый', hex: '#808080' },
        { name: 'Индиго', hex: '#4b0082' },
      ];

      const colorHexes: Record<string, string> = {
        Черный: '#000000',
        Белый: '#ffffff',
        Серый: '#808080',
        Бежевый: '#d2b48c',
        Коричневый: '#8b4513',
        Золотой: '#ffd700',
        Серебряный: '#c0c0c0',
        Синий: '#0000ff',
        Красный: '#ff0000',
        Зеленый: '#008000',
        'Пудрово-розовый': '#f8c8dc',
        'Синий деним': '#1560bd',
        'Серый меланж': '#a9a9a9',
      };

      const mainColorName = product.color || 'Черный';
      const mainColor = {
        name: mainColorName,
        hex: colorHexes[mainColorName] || basePalette[0].hex,
      };
      const otherColors = basePalette
        .filter((c) => c.name !== mainColorName)
        .map((c) => ({
          ...c,
          hex: colorHexes[c.name] || c.hex,
        }));

      const count = 2 + (product.id.length % 3);
      return [mainColor, ...otherColors].slice(0, count);
    })();

  const currentColor = colors[currentImageIndex % colors.length];

  const isOutlet =
    product.outlet || (product.originalPrice && product.originalPrice > product.price);

  // 2. Define Image Handling
  const baseImages =
    product.images && product.images.length > 0
      ? product.images
      : (product as any).image
        ? [{ url: (product as any).image, alt: product.name }]
        : (product as any).thumbnail
          ? [{ url: (product as any).thumbnail, alt: product.name }]
          : [{ url: '/placeholder.jpg', alt: product.name }];

  // Group images by current color
  const imagesForCurrentColor = useMemo(() => {
    const colorName = currentColor.name;
    // Filter images that match the current color
    const matching = baseImages.filter((img) => (img as any).color === colorName);

    if (matching.length > 0) return matching;

    // Demo fallback: if it's the first color, let's say we have 3 photos
    if (currentImageIndex === 0 && baseImages.length > 1) {
      return baseImages.slice(0, 3);
    }

    // Otherwise return just one image for this color
    return [baseImages[currentImageIndex % baseImages.length] || baseImages[0]];
  }, [baseImages, currentColor.name, currentImageIndex]);

  const currentPhoto =
    imagesForCurrentColor[currentPhotoIndex % imagesForCurrentColor.length] ||
    imagesForCurrentColor[0];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagesForCurrentColor.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % imagesForCurrentColor.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagesForCurrentColor.length > 1) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + imagesForCurrentColor.length) % imagesForCurrentColor.length
      );
    }
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const videos = product.videoUrls || [];
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsVideoPlaying(true);

      if (viewRole === 'b2b') {
        addB2bActivityLog({
          type: 'order_draft',
          actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
          target: { id: product.id, name: product.name, type: 'product' },
          details: `Added ${quantity} units of ${product.name} to draft.`,
        });
      }
    }
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const videos = product.videoUrls || [];
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
      setIsVideoPlaying(true);
    }
  };

  const getInCartQuantity = (sizeName: string) => {
    return cart
      .filter(
        (item) =>
          item.id === product.id &&
          item.selectedSize === sizeName &&
          (item.color === currentColor.name ||
            (item as any).selectedColor === currentColor.name ||
            (!item.color && product.color === currentColor.name))
      )
      .reduce((total, item) => total + item.quantity, 0);
  };

  const getProductSizes = () => {
    if (product.sizes && product.sizes.length > 0) return product.sizes;
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('обувь') || cat.includes('shoes'))
      return ['38', '39', '40', '41', '42'].map((n) => ({ name: n }));
    if (cat.includes('брюки') || cat.includes('pants'))
      return ['42', '44', '46', '48', '50'].map((n) => ({ name: n }));
    if (cat.includes('платья') || cat.includes('dress'))
      return ['40', '42', '44', '46', '48', '50'].map((n) => ({ name: n }));
    if (cat.includes('аксессуары') || cat.includes('accessories'))
      return ['One Size'].map((n) => ({ name: n }));
    return ['XS', 'S', 'M', 'L', 'XL'].map((n) => ({ name: n }));
  };

  const productSizes = getProductSizes();

  const getSizeStatus = (sizeName: string): SizeAvailabilityStatus => {
    const avail = (currentColor as any)?.sizeAvailability?.find((s: any) => s.size === sizeName);
    if (avail) return avail.status;
    const hash = (product.id.length + sizeName.length) % 10;
    if (hash === 0) return 'out_of_stock';
    if (hash === 1 || hash === 2) return 'pre_order';
    return 'in_stock';
  };

  const getMaxStock = (sizeName: string): number => {
    const avail = (currentColor as any)?.sizeAvailability?.find((s: any) => s.size === sizeName);
    if (avail && avail.quantity !== undefined) return avail.quantity;
    // Dynamic logic for demo to show varied stock
    const hash = (product.id.charCodeAt(0) + sizeName.charCodeAt(0)) % 15;
    return 2 + hash; // Will give stock from 2 to 16
  };

  // 4. Effects
  useEffect(() => {
    if (selectedSize) {
      setQuantity(getInCartQuantity(selectedSize));
    } else {
      setQuantity(0);
    }
  }, [selectedSize, currentColor.name, cart]);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInComparison = comparisonList.some((item) => item.id === product.id);
  const isOutOfStock =
    product.availability === 'out_of_stock' ||
    (product.sizes?.length === 0 && !product.availability);

  // 5. Action Handlers
  const handleCancelSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const colorToClear = currentColor.name;

    // Сбрасываем только товары в корзине, не трогая оплаченные
    productSizes.forEach((sizeObj) => {
      const sizeName = typeof sizeObj === 'string' ? sizeObj : (sizeObj as any).name;
      const key = `${colorToClear}-${sizeName}`;

      // Сбрасываем только если не оплачено
      if (!paidQuantities[key] && getInCartQuantity(sizeName) > 0) {
        addCartItem({ ...product, color: colorToClear } as any, sizeName, 0);
      }
    });

    // Если текущий размер не оплачен, сбрасываем локальное состояние
    const currentKey = `${colorToClear}-${selectedSize}`;
    if (!paidQuantities[currentKey]) {
      setSelectedSize(null);
      setQuantity(0);
      setIsBackorderRequested(false);
      setBackorderStatus('idle');
    }

    toast({
      title: 'Выбор сброшен',
      description: `Неоплаченные товары для цвета ${colorToClear} удалены из корзины.`,
    });
  };

  const hasAnySizeInCart = productSizes.some((sizeObj) => {
    const sizeName = typeof sizeObj === 'string' ? sizeObj : (sizeObj as any).name;
    return getInCartQuantity(sizeName) > 0;
  });

  // Mock helpers for visual demonstration
  const isReturned = (sizeName: string) => {
    const hash = (product.id.length + sizeName.length) % 15;
    return hash === 7; // Mock some sizes as returned
  };

  const getBrandDescription = (brandName: string) => {
    const descriptions: Record<string, string> = {
      Syntha:
        'Инновационный бренд технологичной одежды, объединяющий высокую моду и передовые материалы.',
      'Nordic Wool':
        'Премиальный трикотаж из натуральной шерсти северных регионов с акцентом на долговечность.',
      Default: 'Современный бренд, ориентированный на качество и вневременной дизайн.',
    };
    return descriptions[brandName] || descriptions['Default'];
  };

  const isAlreadyPurchased = (sizeName: string) => {
    if (isReturned(sizeName)) return false;
    const hash = (product.id.length + sizeName.length) % 7;
    return hash === 3; // Mock some sizes as already purchased
  };

  const getAwaitingDeliveryQuantity = (sizeName: string) => {
    if (isReturned(sizeName)) return 0;
    const key = `${currentColor.name}-${sizeName}`;
    // Приоритет 1: Оплаченные в этой сессии
    if (paidQuantities[key]) return paidQuantities[key];

    const hash = (product.id.length + sizeName.length) % 8;
    return hash === 5 ? 2 : 0; // Mock some sizes as awaiting delivery
  };

  return (
    <>
      <div
        className="group/pitem relative block w-[200px] flex-shrink-0 cursor-pointer snap-start md:w-[240px]"
        onMouseEnter={() => {
          setIsUserActive(true);
          setHoveredProduct(product);
        }}
        onMouseLeave={() => {
          setIsUserActive(false);
          setHoveredProduct(null);
        }}
      >
        <div className="bg-bg-surface2 border-border-subtle relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-[1.25rem] border transition-all duration-500 group-hover/pitem:shadow-2xl">
          {/* Mode 1: GALLERY */}
          {cardMode === 'gallery' && (
            <div className="group/galleryarea relative flex flex-1 flex-col overflow-hidden">
              {/* Navigation Arrow to Mode 2 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCardMode('buy');
                }}
                className="absolute right-4 top-4 z-40 p-1 text-white drop-shadow-lg transition-all hover:scale-110"
              >
                <ArrowRight className="h-6 w-6" />
              </button>

              {/* View Switcher (Photo/Video) */}
              <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/40 p-1 shadow-xl backdrop-blur-md">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setGalleryViewMode('photo');
                  }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all duration-300',
                    galleryViewMode === 'photo'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Photo</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setGalleryViewMode('video');
                  }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all duration-300',
                    galleryViewMode === 'video'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  <Play className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Video</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {galleryViewMode === 'photo' ? (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-0"
                  >
                    <img
                      src={currentPhoto.url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover/galleryarea:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Photo Navigation Arrows */}
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-3">
                      <motion.button
                        animate={
                          imagesForCurrentColor.length > 1
                            ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }
                            : { opacity: 0.2 }
                        }
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={
                          imagesForCurrentColor.length > 1
                            ? { scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }
                            : {}
                        }
                        disabled={imagesForCurrentColor.length <= 1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePrevImage(e);
                        }}
                        className={cn(
                          'pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all',
                          imagesForCurrentColor.length > 1 ? 'cursor-pointer' : 'cursor-default'
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                      </motion.button>
                      <motion.button
                        animate={
                          imagesForCurrentColor.length > 1
                            ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }
                            : { opacity: 0.2 }
                        }
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={
                          imagesForCurrentColor.length > 1
                            ? { scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }
                            : {}
                        }
                        disabled={imagesForCurrentColor.length <= 1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNextImage(e);
                        }}
                        className={cn(
                          'pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all',
                          imagesForCurrentColor.length > 1 ? 'cursor-pointer' : 'cursor-default'
                        )}
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={3} />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group/video-container absolute inset-0 z-0 overflow-hidden bg-black"
                  >
                    {/* Video Background or Actual Video */}
                    {isVideoPlaying ? (
                      <video
                        key={product.videoUrls?.[currentVideoIndex]?.url}
                        src={product.videoUrls?.[currentVideoIndex]?.url}
                        className="h-full w-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={baseImages[1]?.url || currentPhoto.url}
                        alt="Video background"
                        className="h-full w-full scale-110 object-cover opacity-60 blur-sm"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Central Controls */}
                    <div
                      className={cn(
                        'absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-500',
                        isVideoPlaying
                          ? 'bg-black/20 opacity-0 group-hover/video-container:opacity-100'
                          : 'opacity-100'
                      )}
                    >
                      <div className="relative z-20 flex w-full items-center justify-center gap-3 px-4">
                        {/* Like Button */}
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const url = product.videoUrls?.[currentVideoIndex]?.url;
                                  if (url) toggleLikedVideo(url);
                                }}
                                className={cn(
                                  'z-30 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border shadow-xl backdrop-blur-md transition-all duration-300',
                                  likedVideos.includes(
                                    product.videoUrls?.[currentVideoIndex]?.url || ''
                                  )
                                    ? 'border-rose-400 bg-rose-500 text-white'
                                    : 'border-white/10 bg-black/40 text-white hover:bg-white hover:text-black'
                                )}
                              >
                                <Heart
                                  className={cn(
                                    'h-3 w-3 transition-transform active:scale-125',
                                    likedVideos.includes(
                                      product.videoUrls?.[currentVideoIndex]?.url || ''
                                    )
                                      ? 'fill-white text-white'
                                      : 'text-white'
                                  )}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="rounded-md border-none bg-black px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white"
                            >
                              Нравится
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Play Button */}
                        <div className="group/play relative">
                          <div className="absolute inset-[-6px] scale-110 rounded-full border border-white/20 transition-transform duration-500 group-hover/play:scale-125" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsVideoPlaying(!isVideoPlaying);
                            }}
                            className="relative z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-105"
                          >
                            {isVideoPlaying ? (
                              <Minus className="h-6 w-6" />
                            ) : (
                              <Play className="ml-1 h-6 w-6 fill-current" />
                            )}
                          </button>
                        </div>

                        {/* Expand Button */}
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setIsVideoExpanded(true);
                                }}
                                className="z-30 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white hover:text-black"
                              >
                                <Maximize2 className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="rounded-md border-none bg-black px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white"
                            >
                              Развернуть
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="mt-6 flex flex-col items-center gap-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white drop-shadow-lg">
                          {isVideoPlaying
                            ? product.videoUrls?.[currentVideoIndex]?.label || 'Playing Reel'
                            : product.videoUrls?.[currentVideoIndex]?.label || 'Catwalk Preview'}
                        </p>
                        <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-2 py-0.5 backdrop-blur-md">
                          <span
                            className={cn(
                              'h-1 w-1 rounded-full shadow-sm',
                              isVideoPlaying ? 'bg-emerald-500' : 'animate-pulse bg-rose-500'
                            )}
                          />
                          <p className="text-[8px] font-bold uppercase tracking-widest text-white">
                            {isVideoPlaying
                              ? `Video ${currentVideoIndex + 1} / ${product.videoUrls?.length}`
                              : 'Live 4K'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Video Navigation Arrows */}
                    {(product.videoUrls?.length || 0) > 1 && (
                      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-between px-3">
                        <motion.button
                          animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          whileHover={{
                            scale: 1.15,
                            opacity: 1,
                            color: '#000',
                            backgroundColor: '#fff',
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePrevVideo(e);
                          }}
                          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                        </motion.button>
                        <motion.button
                          animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          whileHover={{
                            scale: 1.15,
                            opacity: 1,
                            color: '#000',
                            backgroundColor: '#fff',
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNextVideo(e);
                          }}
                          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={3} />
                        </motion.button>
                      </div>
                    )}

                    {/* Video Navigation Arrows */}
                    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-between px-3">
                      <motion.button
                        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={{
                          scale: 1.15,
                          opacity: 1,
                          color: '#000',
                          backgroundColor: '#fff',
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePrevVideo(e);
                        }}
                        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                      </motion.button>
                      <motion.button
                        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={{
                          scale: 1.15,
                          opacity: 1,
                          color: '#000',
                          backgroundColor: '#fff',
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNextVideo(e);
                        }}
                        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all"
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={3} />
                      </motion.button>
                    </div>

                    {/* Simulated Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <motion.div
                        key={currentVideoIndex + (isVideoPlaying ? 'playing' : 'paused')}
                        initial={{ width: 0 }}
                        animate={{ width: isVideoPlaying ? '100%' : '30%' }}
                        transition={{
                          duration: isVideoPlaying ? 10 : 0.5,
                          repeat: isVideoPlaying ? Infinity : 0,
                          ease: 'linear',
                        }}
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Section: Info, Price and Colors (Exact same as Mode 2) */}

              {/* Bottom Section: Info, Price and Colors (Exact same as Mode 2) */}
              <div className="relative z-10 mt-auto flex flex-col gap-3 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="text-left">
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <p className="mb-1 cursor-help text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white">
                              {product.brand}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="start"
                            className="z-[100] max-w-[200px] rounded-xl border border-white/10 bg-black/90 p-3 text-[9px] font-medium leading-relaxed text-white shadow-2xl backdrop-blur-xl"
                          >
                            <div className="space-y-1">
                              <p className="mb-1 border-b border-white/5 pb-1 text-[7px] font-black uppercase tracking-widest text-white/40">
                                О бренде
                              </p>
                              {getBrandDescription(product.brand)}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <h3 className="mb-1 text-xs font-medium uppercase leading-tight tracking-tight text-white">
                        {product.name}
                      </h3>
                      {product.composition && (
                        <p className="text-accent-primary mb-1 text-[7px] font-black uppercase leading-none tracking-widest">
                          {typeof product.composition === 'string'
                            ? product.composition
                            : product.composition
                                .map((c) => `${c.percentage}% ${c.material}`)
                                .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {isOutlet && product.originalPrice && (
                        <span className="text-[10px] tabular-nums leading-none text-rose-500 line-through">
                          {Number(product.originalPrice).toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                      <p
                        className={cn(
                          'text-sm font-medium tabular-nums leading-none tracking-tighter',
                          isOutlet ? 'text-emerald-500' : 'text-white'
                        )}
                      >
                        {Number(product.price).toLocaleString('ru-RU')}{' '}
                        <span className="text-xs font-medium">₽</span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-1 flex max-w-[100px] flex-col items-center gap-2">
                    <div className="group/color-nav relative flex items-center gap-1.5">
                      {colors.length > 4 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollColors('left');
                          }}
                          className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                        >
                          <ChevronLeft className="h-2.5 w-2.5" />
                        </button>
                      )}
                      <div
                        ref={colorScrollRef}
                        className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-0.5 py-1"
                      >
                        {colors.map((c: any, i: number) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(i);
                              setCurrentPhotoIndex(0);
                            }}
                            className={cn(
                              'relative h-5 w-5 flex-shrink-0 rounded-full border-[0.33px] border-white/20 shadow-sm transition-all duration-300',
                              currentImageIndex === i
                                ? 'z-10 scale-110 ring-[0.66px] ring-white'
                                : 'hover:scale-105'
                            )}
                            style={{
                              backgroundColor: c.hex.startsWith('url') ? 'transparent' : c.hex,
                              background: c.hex.startsWith('url') ? c.hex : c.hex,
                            }}
                          />
                        ))}
                      </div>
                      {colors.length > 4 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollColors('right');
                          }}
                          className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                        >
                          <ChevronRight className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-[6px] font-black uppercase leading-none tracking-widest text-white/60">
                      {currentColor.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: BUY (Default Link) */}
          {cardMode === 'buy' && (
            <div className="group/buyarea relative flex flex-1 flex-col overflow-hidden">
              <Link
                href={`/products/${product.sku || product.slug}`}
                className="absolute inset-0 z-0"
              >
                <img
                  src={currentPhoto.url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover/buyarea:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </Link>

              {/* Center Actions Area */}
              <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4">
                {/* Action Icons Block */}
                <div
                  className="relative mb-5 flex items-center justify-center gap-3"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {[
                    {
                      icon: Library,
                      label: 'Образы',
                      active: lookboards?.some((lb) =>
                        lb.looks?.some((look: any) =>
                          look.products?.some((p: any) => p.productId === product.id)
                        )
                      ),
                      collections: lookboards?.map((lb) => ({
                        id: lb.id,
                        name: lb.title,
                        items: lb.looks?.flatMap(
                          (look) => look.products?.map((p) => ({ id: p.productId })) || []
                        ),
                      })),
                      onAdd: (collId: string) => {
                        addProductToLookboard(product as any, collId);
                        setMenuOpenIdx(null);
                        toast({
                          title: 'Добавлено в Образы',
                          description: `Товар добавлен в подборку.`,
                        });
                      },
                      onCreate: (name: string) => {
                        addLookboard(name, '');
                      },
                    },
                    {
                      icon: Heart,
                      label: 'Избранное',
                      active: isWishlisted,
                      collections: wishlistCollections,
                      onAdd: (collId: string) => {
                        addWishlistItem(product as any, collId);
                        setMenuOpenIdx(null);
                        toast({
                          title: 'Добавлено в Избранное',
                          description: `Товар добавлен в избранное.`,
                        });
                      },
                      onCreate: (name: string) => {
                        addWishlistCollection(name);
                      },
                    },
                    ...(viewRole === 'b2b'
                      ? [
                          {
                            icon: Layers,
                            label: 'Ассортимент',
                            active: assortmentPlan?.some(
                              (item: { id: string }) => item.id === product.id
                            ),
                            action: () => {
                              addToAssortmentPlan(product as any);
                              toast({
                                title: 'Ассортимент',
                                description: 'Товар добавлен в план ассортимента.',
                              });
                            },
                          },
                        ]
                      : []),
                    {
                      icon: GitCompare,
                      label: 'Сравнить',
                      active: isInComparison,
                      collections:
                        savedComparisons?.length > 0
                          ? savedComparisons
                          : [{ id: 'default', name: 'Основное сравнение' }],
                      onAdd: (collId: string) => {
                        toggleComparisonItem(product as any);
                        setMenuOpenIdx(null);
                        toast({
                          title: isInComparison ? 'Удалено из сравнения' : 'Добавлено к сравнению',
                        });
                      },
                      onCreate: (name: string) => {
                        saveComparison(name);
                      },
                    },
                    {
                      icon: AR,
                      label: 'AR',
                      action: () =>
                        toast({
                          title: 'Запуск AR',
                          description: 'Подготовка 3D-модели для дополненной реальности...',
                        }),
                    },
                    {
                      icon: Share2,
                      label: 'Поделиться',
                      action: () => {
                        if (navigator.share) {
                          navigator
                            .share({ title: product.name, url: window.location.href })
                            .catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          toast({
                            title: 'Ссылка скопирована',
                            description: 'Ссылка на товар сохранена в буфер обмена.',
                          });
                        }
                      },
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Individual Tooltip Above Each Icon */}
                      <AnimatePresence>
                        {isPaused && hoveredIconIndex === idx && menuOpenIdx !== idx && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, x: '-50%', scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                            exit={{ opacity: 0, y: 5, x: '-50%', scale: 0.8 }}
                            className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-2 whitespace-nowrap rounded-md border-none bg-black/90 px-2 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-md"
                          >
                            {item.label}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {item.collections ? (
                        <Popover
                          open={menuOpenIdx === idx}
                          onOpenChange={(open) => {
                            setMenuOpenIdx(open ? idx : null);
                            if (!open) {
                              setIsCreatingNewCollection(false);
                              setNewCollectionName('');
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <motion.button
                              animate={{
                                scale: (
                                  isPaused ? hoveredIconIndex === idx : activeIconIndex === idx
                                )
                                  ? 1.5
                                  : 1,
                                backgroundColor:
                                  (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                                  item.active
                                    ? '#fff'
                                    : 'rgba(255,255,255,0.1)',
                                color:
                                  (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                                  item.active
                                    ? '#000'
                                    : '#fff',
                              }}
                              onMouseEnter={() => {
                                setHoveredIconIndex(idx);
                              }}
                              onMouseLeave={() => {
                                setHoveredIconIndex(null);
                              }}
                              transition={{ duration: 0.5 }}
                              className={cn(
                                'z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/10 shadow-sm backdrop-blur-md transition-all',
                                ((isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                                  item.active) &&
                                  'ring-1 ring-white/50'
                              )}
                            >
                              <item.icon className={cn('h-3 w-3', item.active && 'fill-current')} />
                            </motion.button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            align="center"
                            sideOffset={15}
                            className="bg-text-primary/95 z-[100] w-[160px] rounded-xl border border-white/10 p-0 p-1.5 shadow-2xl backdrop-blur-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-1 p-1">
                              <p className="mb-1 border-b border-white/5 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white/40">
                                {item.label}
                              </p>

                              {isCreatingNewCollection ? (
                                <div className="flex flex-col gap-2 p-2">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="Название..."
                                    className="focus:border-accent-primary/50 w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-white focus:outline-none"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && newCollectionName.trim()) {
                                        item.onCreate?.(newCollectionName.trim());
                                        toast({
                                          title: 'Создано',
                                          description: `Подборка "${newCollectionName}" создана.`,
                                        });
                                        setIsCreatingNewCollection(false);
                                        setNewCollectionName('');
                                      }
                                      if (e.key === 'Escape') {
                                        setIsCreatingNewCollection(false);
                                        setNewCollectionName('');
                                      }
                                    }}
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        if (newCollectionName.trim()) {
                                          item.onCreate?.(newCollectionName.trim());
                                          toast({
                                            title: 'Создано',
                                            description: `Подборка "${newCollectionName}" создана.`,
                                          });
                                          setIsCreatingNewCollection(false);
                                          setNewCollectionName('');
                                        }
                                      }}
                                      className="bg-accent-primary hover:bg-accent-primary flex-1 rounded-md py-1 text-[8px] font-black uppercase text-white transition-colors"
                                    >
                                      Ок
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIsCreatingNewCollection(false);
                                        setNewCollectionName('');
                                      }}
                                      className="flex-1 rounded-md bg-white/5 py-1 text-[8px] font-black uppercase text-white transition-colors hover:bg-white/10"
                                    >
                                      Отмена
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="no-scrollbar max-h-[120px] overflow-y-auto">
                                    {item.collections.map((coll: any) => (
                                      <button
                                        key={coll.id}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          item.onAdd?.(coll.id);
                                        }}
                                        className="group/item flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-white/10"
                                      >
                                        <span className="max-w-[110px] truncate text-[9px] font-bold text-white/80 group-hover/item:text-white">
                                          {coll.name}
                                        </span>
                                        {coll.items?.some((i: any) => i.id === product.id) && (
                                          <Check className="h-2 w-2 text-emerald-500" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setIsCreatingNewCollection(true);
                                    }}
                                    className="hover:bg-accent-primary/20 mt-1 flex w-full items-center gap-2 rounded-md border-t border-white/5 px-2 py-1.5 pt-2 transition-colors"
                                  >
                                    <Plus className="text-accent-primary h-2 w-2" />
                                    <span className="text-accent-primary text-[8px] font-black uppercase">
                                      Создать новую
                                    </span>
                                  </button>
                                </>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <motion.button
                          animate={{
                            scale: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx)
                              ? 1.5
                              : 1,
                            backgroundColor:
                              (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                              item.active
                                ? '#fff'
                                : 'rgba(255,255,255,0.1)',
                            color:
                              (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                              item.active
                                ? '#000'
                                : '#fff',
                          }}
                          onMouseEnter={() => {
                            setHoveredIconIndex(idx);
                          }}
                          onMouseLeave={() => {
                            setHoveredIconIndex(null);
                          }}
                          transition={{ duration: 0.5 }}
                          className={cn(
                            'z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/10 shadow-sm backdrop-blur-md transition-all',
                            ((isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                              item.active) &&
                              'ring-1 ring-white/50'
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            item.action?.();
                          }}
                        >
                          <item.icon className={cn('h-3 w-3', item.active && 'fill-current')} />
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex w-full items-center justify-center gap-1.5">
                  {/* Switch to Mode 1 (Gallery) */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCardMode('gallery');
                    }}
                    className="h-8 rounded-xl border-[0.33px] border-white/10 bg-white/5 px-2.5 text-[7px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/30 hover:shadow-lg hover:shadow-white/5"
                  >
                    <ArrowLeft className="mr-1.5 h-2 w-2" /> Медиа
                  </Button>

                  {/* Link to PDP */}
                  <Link href={`/products/${product.sku || product.slug}`}>
                    <Button className="h-8 rounded-xl border-[0.33px] border-white/10 bg-white/5 px-4 text-[7px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/30 hover:shadow-lg hover:shadow-white/5">
                      К товару
                    </Button>
                  </Link>

                  {/* Switch to Mode 3 (Purchase) */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCardMode('purchase');
                    }}
                    className="h-8 rounded-xl border-[0.33px] border-white/10 bg-white/5 px-2.5 text-[7px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/30 hover:shadow-lg hover:shadow-white/5"
                  >
                    В корзину <ArrowRight className="ml-1.5 h-2 w-2" />
                  </Button>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="relative z-10 mt-auto flex flex-col gap-3 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-1 flex-col gap-2">
                    {/* Info & Price (Left) */}
                    <div className="text-left">
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <p className="mb-1 cursor-help text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white">
                              {product.brand}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="start"
                            className="z-[100] max-w-[200px] rounded-xl border border-white/10 bg-black/90 p-3 text-[9px] font-medium leading-relaxed text-white shadow-2xl backdrop-blur-xl"
                          >
                            <div className="space-y-1">
                              <p className="mb-1 border-b border-white/5 pb-1 text-[7px] font-black uppercase tracking-widest text-white/40">
                                О бренде
                              </p>
                              {getBrandDescription(product.brand)}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <h3 className="mb-1 text-xs font-medium uppercase leading-tight tracking-tight text-white">
                        {product.name}
                      </h3>
                      {product.composition && (
                        <p className="text-accent-primary mb-1 text-[7px] font-black uppercase leading-none tracking-widest">
                          {typeof product.composition === 'string'
                            ? product.composition
                            : product.composition
                                .map((c) => `${c.percentage}% ${c.material}`)
                                .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {isOutlet && product.originalPrice && (
                        <span className="text-[10px] tabular-nums leading-none text-rose-500 line-through">
                          {Number(product.originalPrice).toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                      <p
                        className={cn(
                          'text-sm font-medium tabular-nums leading-none tracking-tighter',
                          isOutlet ? 'text-emerald-500' : 'text-white'
                        )}
                      >
                        {Number(product.price).toLocaleString('ru-RU')}{' '}
                        <span className="text-xs font-medium">₽</span>
                      </p>
                    </div>
                  </div>

                  {/* Colors (Right) */}
                  <div className="mb-1 flex max-w-[100px] flex-col items-center gap-2">
                    <div className="group/color-nav relative flex items-center gap-1.5">
                      {colors.length > 4 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollColors('left');
                          }}
                          className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                        >
                          <ChevronLeft className="h-2.5 w-2.5" />
                        </button>
                      )}
                      <div
                        ref={colorScrollRef}
                        className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-0.5 py-1"
                      >
                        {colors.map((c: any, i: number) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(i);
                              setCurrentPhotoIndex(0);
                            }}
                            className={cn(
                              'relative h-5 w-5 flex-shrink-0 rounded-full border-[0.33px] border-white/20 shadow-sm transition-all duration-300',
                              currentImageIndex === i
                                ? 'z-10 scale-110 ring-[0.66px] ring-white'
                                : 'hover:scale-105'
                            )}
                            style={{
                              backgroundColor: c.hex.startsWith('url') ? 'transparent' : c.hex,
                              background: c.hex.startsWith('url') ? c.hex : c.hex,
                            }}
                          />
                        ))}
                      </div>
                      {colors.length > 4 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollColors('right');
                          }}
                          className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                        >
                          <ChevronRight className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-[6px] font-black uppercase leading-none tracking-widest text-white/60">
                      {currentColor.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: PURCHASE (Selection) */}
          {cardMode === 'purchase' && (
            <div className="group/purchasearea relative flex flex-1 flex-col overflow-hidden">
              {/* Navigation Arrow to Mode 2 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCardMode('buy');
                }}
                className="absolute left-4 top-4 z-40 p-1 text-white drop-shadow-lg transition-all hover:scale-110"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

              <div className="absolute inset-0 z-0">
                <img
                  src={currentPhoto.url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-1 flex-col overflow-hidden p-3 text-white">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-start gap-3 pt-5">
                  {/* Color Selection */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      {colors.map((c: any, i: number) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex(i);
                            setSelectedSize(null);
                          }}
                          className={cn(
                            'relative h-6 w-6 rounded-full border-[0.33px] border-white/20 shadow-sm transition-all duration-300',
                            currentImageIndex === i
                              ? 'z-10 scale-110 ring-[0.66px] ring-white'
                              : 'hover:scale-105'
                          )}
                          style={{
                            backgroundColor: c.hex.startsWith('url') ? 'transparent' : c.hex,
                            background: c.hex.startsWith('url') ? c.hex : c.hex,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[6px] font-black uppercase leading-none tracking-widest text-white/60">
                      {currentColor.name}
                    </span>
                  </div>

                  {/* Size Grid & Dimensions */}
                  <div className="flex w-full flex-col items-center gap-3">
                    <div className="mx-auto grid w-fit grid-cols-4 gap-1.5">
                      {productSizes.map((sizeObj) => {
                        const sizeName =
                          typeof sizeObj === 'string' ? sizeObj : (sizeObj as any).name;
                        const status = getSizeStatus(sizeName);
                        const key = `${currentColor.name}-${sizeName}`;

                        const isCurrentlyPaid = isPaid && selectedSize === sizeName;
                        const isPaidSize = !!paidQuantities[key] || isCurrentlyPaid;
                        const confirmedQty = confirmedBackorderQuantities[key] || 0;
                        const isConfirmedNotPaid = confirmedQty > 0 && !isPaidSize;

                        // Зеленый кружок (корзина) только если не оплачено и не подтверждено
                        const inCart =
                          isPaidSize || isConfirmedNotPaid ? 0 : getInCartQuantity(sizeName);

                        const isBackorder = status === 'pre_order';
                        const alreadyPurchased = isAlreadyPurchased(sizeName);
                        const awaitingQty = getAwaitingDeliveryQuantity(sizeName);

                        return (
                          <TooltipProvider key={sizeName}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  disabled={status === 'out_of_stock' || isPaidSize}
                                  onClick={() => setSelectedSize(sizeName)}
                                  className={cn(
                                    'relative flex h-[26px] w-[26px] items-center justify-center rounded-md text-[9px] font-black uppercase transition-all',
                                    // Default State (Solid)
                                    'border-[0.33px] border-transparent bg-white text-black',
                                    // Purchased State (Glow)
                                    alreadyPurchased &&
                                      'border-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
                                    // Selection State
                                    selectedSize === sizeName
                                      ? 'bg-text-primary border-text-primary scale-110 border-[0.33px] text-white shadow-lg'
                                      : 'hover:bg-bg-surface2',
                                    // Already Bought State (Selection context)
                                    inCart > 0 && !selectedSize && 'ring-2 ring-emerald-500',
                                    // Backorder State
                                    isBackorder && !selectedSize && 'ring-2 ring-amber-500',
                                    // Out of Stock State
                                    status === 'out_of_stock' &&
                                      'cursor-not-allowed line-through opacity-20'
                                  )}
                                >
                                  {sizeName}

                                  {/* Badges Container (Top Right) */}
                                  <div className="pointer-events-auto absolute right-0 top-0 z-10 flex -translate-y-1/2 translate-x-1/2 flex-row-reverse gap-0.5">
                                    {/* Regular Cart (Green) */}
                                    {inCart > 0 && (
                                      <motion.div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[7px] font-black text-white shadow-lg">
                                        {inCart}
                                      </motion.div>
                                    )}

                                    {/* Confirmed Backorder (Transparent Orange Pulsating) */}
                                    {isConfirmedNotPaid && (
                                      <motion.div
                                        animate={{
                                          opacity: [0.8, 0.4, 0.8],
                                          scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                        }}
                                        className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-orange-500/60 text-[7px] font-black text-white shadow-lg backdrop-blur-sm"
                                      >
                                        {confirmedQty}
                                      </motion.div>
                                    )}

                                    {/* Paid / Awaiting Delivery (Solid Orange) */}
                                    {awaitingQty > 0 && (
                                      <motion.div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[7px] font-black text-white shadow-lg">
                                        {awaitingQty}
                                      </motion.div>
                                    )}
                                  </div>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="rounded-md border-none bg-black px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white"
                              >
                                {inCart > 0
                                  ? 'В корзине'
                                  : isPaidSize
                                    ? 'Оформлено'
                                    : alreadyPurchased
                                      ? 'Уже приобретался ранее'
                                      : status === 'out_of_stock'
                                        ? 'Нет в наличии'
                                        : isBackorder
                                          ? 'Доступен под заказ'
                                          : 'В наличии'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>

                    {/* Dimensions Display */}
                    <div className="flex h-10 flex-col items-center justify-center">
                      <AnimatePresence mode="wait">
                        {selectedSize && (
                          <motion.div
                            key={selectedSize}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <div className="flex items-center gap-1.5">
                              <Ruler className="h-2 w-2 text-white/40" />
                              <p className="text-[8px] font-black uppercase leading-none tracking-[0.1em] text-white">
                                {getSizeDetails(product.category, selectedSize).label}:{' '}
                                <span className="text-accent-primary">
                                  {getSizeDetails(product.category, selectedSize).value}
                                </span>
                              </p>
                            </div>
                            <p className="text-[7px] font-medium uppercase leading-none tracking-widest text-white/50">
                              {getSizeDetails(product.category, selectedSize).description} •{' '}
                              {getSizeDetails(product.category, selectedSize).fit}
                            </p>
                            <p className="text-accent-primary mt-1 text-[6px] font-black uppercase tracking-[0.2em]">
                              {product.composition && (
                                <span className="text-white/80">
                                  {typeof product.composition === 'string'
                                    ? product.composition
                                    : product.composition
                                        .map((c) => `${c.percentage}% ${c.material}`)
                                        .join(', ')}{' '}
                                  •{' '}
                                </span>
                              )}
                              Рост модели: 174 см • Размер на фото: M
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Area */}
                <div className="mt-auto flex flex-col gap-3">
                  <AnimatePresence mode="wait">
                    {selectedSize && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex flex-col gap-3 border-t border-white/10 pt-2"
                      >
                        <div className="flex items-center justify-between px-1">
                          <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/40">
                              Статус
                            </span>
                            <span
                              className={cn(
                                'text-[9px] font-black uppercase tracking-tight',
                                getSizeStatus(selectedSize) === 'pre_order'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              )}
                            >
                              {getSizeStatus(selectedSize) === 'pre_order'
                                ? 'Дозаказ возможен'
                                : `В наличии: ${getMaxStock(selectedSize)} шт.`}
                            </span>
                            {getSizeStatus(selectedSize) === 'pre_order' && (
                              <span className="text-[6px] font-medium text-white/60">
                                Срок: ~14-21 день
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 rounded-lg bg-white p-1">
                            <button
                              disabled={quantity === 0 || isPaid}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newQty = Math.max(0, quantity - 1);
                                setQuantity(newQty);

                                // If it was already in cart, sync the reduction
                                if (selectedSize && getInCartQuantity(selectedSize) > 0) {
                                  addCartItem(
                                    { ...product, color: currentColor.name } as any,
                                    selectedSize,
                                    newQty
                                  );
                                }

                                if (newQty === 0) {
                                  setIsBackorderRequested(false);
                                  setBackorderStatus('idle');
                                }
                              }}
                              className="hover:bg-bg-surface2 flex h-5 w-5 items-center justify-center rounded-md text-black transition-colors disabled:cursor-not-allowed disabled:opacity-20"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-4 text-center text-[10px] font-black tabular-nums text-black">
                              {quantity}
                            </span>
                            <button
                              disabled={
                                isPaid ||
                                quantity >=
                                  (getSizeStatus(selectedSize) === 'pre_order'
                                    ? 99
                                    : getMaxStock(selectedSize))
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                const max =
                                  getSizeStatus(selectedSize) === 'pre_order'
                                    ? 99
                                    : getMaxStock(selectedSize);
                                if (quantity < max) {
                                  const newQty = quantity + 1;
                                  setQuantity(newQty);

                                  // If it was already in cart, sync the increase
                                  if (selectedSize && getInCartQuantity(selectedSize) > 0) {
                                    addCartItem(
                                      { ...product, color: currentColor.name } as any,
                                      selectedSize,
                                      newQty
                                    );
                                  }
                                }
                              }}
                              className="hover:bg-bg-surface2 flex h-5 w-5 items-center justify-center rounded-md text-black transition-colors disabled:cursor-not-allowed disabled:opacity-20"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5">
                          {isPaid ? (
                            <div className="py-1 text-center">
                              <p className="text-[7px] font-black uppercase leading-tight text-white/60">
                                Отмена возможна через
                              </p>
                              <button
                                onClick={() =>
                                  toast({
                                    title: 'Чат с брендом',
                                    description:
                                      'Переход в раздел заказов для связи с представителем бренда...',
                                  })
                                }
                                className="text-accent-primary hover:text-accent-primary text-[8px] font-black uppercase underline transition-colors"
                              >
                                Личный чат в заказах
                              </button>
                            </div>
                          ) : (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (quantity === 0) {
                                    toast({
                                      title: 'Выберите количество',
                                      description: 'Укажите количество товара перед добавлением.',
                                      variant: 'destructive',
                                    });
                                    return;
                                  }
                                  if (getSizeStatus(selectedSize) === 'pre_order') {
                                    if (backorderStatus === 'idle') {
                                      setBackorderStatus('requested');
                                      setIsBackorderRequested(true);
                                      toast({
                                        title: 'Запрос отправлен',
                                        description: 'Бренд уведомлен о вашем дозаказе.',
                                      });
                                    }
                                  } else {
                                    addCartItem(
                                      { ...product, color: currentColor.name } as any,
                                      selectedSize,
                                      quantity
                                    );
                                    toast({
                                      title: 'Успешно',
                                      description: `Товар в количестве ${quantity} шт. добавлен в корзину.`,
                                    });

                                    if (viewRole === 'b2b') {
                                      addB2bActivityLog({
                                        type: 'order_draft',
                                        actor: {
                                          id: 'retailer-1',
                                          name: 'Premium Store',
                                          type: 'retailer',
                                        },
                                        target: {
                                          id: product.id,
                                          name: product.name,
                                          type: 'product',
                                        },
                                        details: `Added ${quantity} units of ${product.name} to draft.`,
                                      });
                                    }
                                  }
                                }}
                                disabled={
                                  backorderStatus === 'requested' ||
                                  (getSizeStatus(selectedSize) === 'pre_order' && quantity === 0)
                                }
                                className={cn(
                                  'h-7 w-fit rounded-xl px-5 text-[8px] font-black uppercase tracking-widest transition-all duration-500',
                                  backorderStatus === 'confirmed' && !isPaid
                                    ? 'border-none bg-emerald-500 text-white'
                                    : backorderStatus === 'rejected'
                                      ? 'border-none bg-rose-500 text-white'
                                      : 'hover:button-glimmer border-[0.33px] border-white/20 bg-transparent text-white hover:border-white hover:bg-black'
                                )}
                              >
                                {getSizeStatus(selectedSize) === 'pre_order' ? (
                                  backorderStatus === 'requested' ? (
                                    <>
                                      <Sparkles className="mr-1.5 h-3 w-3 animate-pulse" />{' '}
                                      Ожидание...
                                    </>
                                  ) : backorderStatus === 'confirmed' && !isPaid ? (
                                    <>
                                      <Check className="mr-1.5 h-3 w-3" /> Подтверждено
                                    </>
                                  ) : backorderStatus === 'rejected' ? (
                                    <>
                                      <Minus className="mr-1.5 h-3 w-3" /> Отклонено
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="mr-1.5 h-3 w-3" /> Запросить дозаказ
                                    </>
                                  )
                                ) : quantity > 0 && quantity === getInCartQuantity(selectedSize) ? (
                                  <>
                                    <Check className="mr-1.5 h-3 w-3" /> Товар в корзине
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="mr-1.5 h-3 w-3" /> Добавить в корзину
                                  </>
                                )}
                              </Button>

                              {backorderStatus === 'confirmed' && !isPaid && (
                                <div className="flex gap-1">
                                  <motion.button
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleCart();
                                      setIsPaid(true);
                                      // Store paid quantity locally
                                      if (selectedSize) {
                                        const key = `${currentColor.name}-${selectedSize}`;
                                        setPaidQuantities((prev) => ({ ...prev, [key]: quantity }));
                                        // Remove from cart (top-right badge context)
                                        addCartItem(
                                          { ...product, color: currentColor.name } as any,
                                          selectedSize,
                                          0
                                        );
                                      }
                                      setBackorderStatus('idle');
                                      toast({
                                        title: 'Оплата',
                                        description: 'Переход в корзину для завершения платежа...',
                                      });
                                    }}
                                    className="h-7 rounded-lg bg-white px-2.5 text-[7px] font-black uppercase tracking-tighter text-black shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-colors hover:bg-emerald-50"
                                  >
                                    Оплатить
                                  </motion.button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setBackorderStatus('idle');
                                      setIsBackorderRequested(false);
                                      setQuantity(0);
                                      if (selectedSize) {
                                        addCartItem(
                                          { ...product, color: currentColor.name } as any,
                                          selectedSize,
                                          0
                                        );
                                      }
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-rose-500/20"
                                  >
                                    <Plus className="h-3 w-3 rotate-45" />
                                  </button>
                                </div>
                              )}

                              {backorderStatus === 'rejected' && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBackorderStatus('idle');
                                    setIsBackorderRequested(false);
                                    setQuantity(0);
                                    if (selectedSize) {
                                      addCartItem(
                                        { ...product, color: currentColor.name } as any,
                                        selectedSize,
                                        0
                                      );
                                    }
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                                >
                                  <Plus className="h-3 w-3 rotate-45" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <div className="flex flex-col gap-0.5">
                      {isOutlet && product.originalPrice && (
                        <span className="text-[10px] tabular-nums leading-none text-rose-500 line-through">
                          {Number(product.originalPrice).toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                      <p
                        className={cn(
                          'text-base font-medium tracking-tighter',
                          isOutlet ? 'text-emerald-500' : 'text-white'
                        )}
                      >
                        {Number(product.price).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <button
                      onClick={handleCancelSelection}
                      className="text-[8px] font-black uppercase tracking-widest text-white/40 transition-colors hover:text-rose-400"
                    >
                      Сбросить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mode Switcher Dots (Bottom) */}
        <div className="mt-3 flex items-center justify-center gap-2 pb-1">
          {[
            { id: 'gallery', label: 'Просмотр фото' },
            { id: 'buy', label: 'Перейти к товару' },
            { id: 'purchase', label: 'Быстрый заказ' },
          ].map((mode) => (
            <TooltipProvider key={mode.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCardMode(mode.id as any)}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-all duration-300',
                      cardMode === mode.id
                        ? 'scale-125 bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)]'
                        : 'bg-border-subtle hover:bg-text-muted'
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-text-primary rounded-md border-none px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white"
                >
                  {mode.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <QuickViewDialog
          product={product}
          isOpen={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
        />

        {/* Expanded Video Modal */}
        <AnimatePresence>
          {isVideoExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-3"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                onClick={() => setIsVideoExpanded(false)}
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-text-primary relative z-10 flex aspect-[9/16] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl"
              >
                {/* Vertical Video Content */}
                <div className="relative flex flex-1 items-center justify-center bg-black">
                  <img
                    src={currentPhoto.url}
                    alt="Full Video Preview"
                    className="h-full w-full object-cover opacity-80"
                  />

                  {/* Video UI Overlay */}
                  <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-black/40 via-transparent to-black/80 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                          {product.brand}
                        </p>
                        <h4 className="text-sm font-black uppercase tracking-tighter text-white">
                          {product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsVideoExpanded(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
                      >
                        <Plus className="h-6 w-6 rotate-45" />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-col items-center gap-3">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-white/5"
                        />
                        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110">
                          <Play className="ml-1 h-8 w-8 fill-current" />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                          <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                            Live Catwalk 4K
                          </p>
                        </div>
                        <p className="text-[10px] font-bold uppercase italic tracking-widest text-white/40">
                          Spring-Summer 2024 Collection
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interaction Bar */}
                <div className="flex h-20 items-center justify-between border-t border-white/5 bg-zinc-950 px-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = product.videoUrls?.[currentVideoIndex]?.url;
                        if (url) toggleLikedVideo(url);
                      }}
                      className="transition-all active:scale-125"
                    >
                      <Heart
                        className={cn(
                          'h-5 w-5 cursor-pointer transition-colors',
                          likedVideos.includes(product.videoUrls?.[currentVideoIndex]?.url || '')
                            ? 'fill-current text-rose-500'
                            : 'text-white/60 hover:text-rose-500'
                        )}
                      />
                    </button>
                    <Share2 className="hover:text-accent-primary h-5 w-5 cursor-pointer text-white/60 transition-colors" />
                  </div>
                  <Button className="hover:bg-border-subtle h-10 rounded-full bg-white px-8 text-[10px] font-black uppercase tracking-widest text-black">
                    Добавить в корзину
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
