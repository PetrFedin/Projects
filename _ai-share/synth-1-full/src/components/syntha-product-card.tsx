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
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';
import { useToast } from '@/hooks/use-toast';
import { QuickViewDialog } from './quick-view-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
    saveComparison, setHoveredProduct,
    viewRole,
    addB2bActivityLog,
    addToAssortmentPlan,
    assortmentPlan
  } = useUIState();
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
  const [backorderStatus, setBackorderStatus] = useState<'idle' | 'requested' | 'confirmed' | 'rejected'>('idle');
  const [isPaid, setIsPaid] = useState(false);
  const [paidQuantities, setPaidQuantities] = useState<Record<string, number>>({});
  const [confirmedBackorderQuantities, setConfirmedBackorderQuantities] = useState<Record<string, number>>({});
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
          const confirmedQty = (quantity > 1 && Math.random() > 0.5) ? quantity - 1 : quantity;
          const key = `${currentColor.name}-${selectedSize}`;
          
          setConfirmedBackorderQuantities(prev => ({ ...prev, [key]: confirmedQty }));
          
          // Обновляем количество в корзине до подтвержденного
          addCartItem({ ...product, color: currentColor.name } as any, selectedSize, confirmedQty);
          setQuantity(confirmedQty);
          
          if (confirmedQty < quantity) {
            toast({ 
              title: "Частичное подтверждение", 
              description: `Бренд подтвердил ${confirmedQty} из ${quantity} запрашиваемых единиц.`
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
  const colors = product.availableColors || (function() {
    const palettes: Record<string, {name: string, hex: string}[]> = {
      'Верхняя одежда': [
        { name: 'Бежевый', hex: '#d2b48c' },
        { name: 'Черный', hex: '#1a1a1a' },
        { name: 'Хаки', hex: '#4b5320' },
        { name: 'Темно-синий', hex: '#000080' }
      ],
      'Топы': [
        { name: 'Белый', hex: '#ffffff' },
        { name: 'Голубой', hex: '#add8e6' },
        { name: 'Розовый', hex: '#ffb6c1' },
        { name: 'Черный', hex: '#1a1a1a' }
      ],
      'Брюки': [
        { name: 'Серый', hex: '#808080' },
        { name: 'Черный', hex: '#1a1a1a' },
        { name: 'Темно-синий', hex: '#000080' },
        { name: 'Песочный', hex: '#c2b280' }
      ],
      'Обувь': [
        { name: 'Белый', hex: '#ffffff' },
        { name: 'Черный', hex: '#1a1a1a' },
        { name: 'Коричневый', hex: '#8b4513' }
      ],
      'Платья': [
        { name: 'Цветочный принт', hex: 'url(https://images.unsplash.com/photo-1585487000160-6ebcfceb08bd?w=100&q=80) center/cover' },
        { name: 'Черный', hex: '#1a1a1a' },
        { name: 'Красный', hex: '#8b0000' },
        { name: 'Голубой', hex: '#add8e6' }
      ],
      'Аксессуары': [
        { name: 'Золотой', hex: '#ffd700' },
        { name: 'Серебряный', hex: '#c0c0c0' },
        { name: 'Мультиколор', hex: 'linear-gradient(45deg, #f06, #4a90e2)' }
      ]
    };

    const category = product.category || 'Default';
    const basePalette = palettes[category] || [
      { name: 'Черный', hex: '#000' },
      { name: 'Белый', hex: '#fff' },
      { name: 'Серый', hex: '#808080' },
      { name: 'Индиго', hex: '#4b0082' }
    ];
    
    const colorHexes: Record<string, string> = {
      'Черный': '#000000', 'Белый': '#ffffff', 'Серый': '#808080', 'Бежевый': '#d2b48c',
      'Коричневый': '#8b4513', 'Золотой': '#ffd700', 'Серебряный': '#c0c0c0',
      'Синий': '#0000ff', 'Красный': '#ff0000', 'Зеленый': '#008000',
      'Пудрово-розовый': '#f8c8dc', 'Синий деним': '#1560bd', 'Серый меланж': '#a9a9a9'
    };
    
    const mainColorName = product.color || 'Черный';
    const mainColor = { name: mainColorName, hex: colorHexes[mainColorName] || basePalette[0].hex };
    const otherColors = basePalette.filter(c => c.name !== mainColorName).map(c => ({
      ...c,
      hex: colorHexes[c.name] || c.hex
    }));
    
    const count = 2 + (product.id.length % 3);
    return [mainColor, ...otherColors].slice(0, count);
  })();

  const currentColor = colors[currentImageIndex % colors.length];

  const isOutlet = product.outlet || (product.originalPrice && product.originalPrice > product.price);

  // 2. Define Image Handling
  const baseImages = (product.images && product.images.length > 0) 
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
    const matching = baseImages.filter(img => (img as any).color === colorName);
    
    if (matching.length > 0) return matching;
    
    // Demo fallback: if it's the first color, let's say we have 3 photos
    if (currentImageIndex === 0 && baseImages.length > 1) {
      return baseImages.slice(0, 3);
    }
    
    // Otherwise return just one image for this color
    return [baseImages[currentImageIndex % baseImages.length] || baseImages[0]];
  }, [baseImages, currentColor.name, currentImageIndex]);

  const currentPhoto = imagesForCurrentColor[currentPhotoIndex % imagesForCurrentColor.length] || imagesForCurrentColor[0];

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
      setCurrentPhotoIndex((prev) => (prev - 1 + imagesForCurrentColor.length) % imagesForCurrentColor.length);
    }
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const videos = product.videoUrls || [];
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsVideoPlaying(true);

      if (viewRole === 'b2b') {
        addB2bActivityLog({
          type: 'order_draft',
          actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
          target: { id: product.id, name: product.name, type: 'product' },
          details: `Added ${quantity} units of ${product.name} to draft.`
        });
      }
    }
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const videos = product.videoUrls || [];
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
      setIsVideoPlaying(true);
    }
  };

  const getInCartQuantity = (sizeName: string) => {
    return cart
      .filter(item => 
        item.id === product.id && 
        item.selectedSize === sizeName && 
        (item.color === currentColor.name || (item as any).selectedColor === currentColor.name || (!item.color && product.color === currentColor.name))
      )
      .reduce((total, item) => total + item.quantity, 0);
  };

  const getProductSizes = () => {
    if (product.sizes && product.sizes.length > 0) return product.sizes;
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('обувь') || cat.includes('shoes')) return ['38', '39', '40', '41', '42'].map(n => ({ name: n }));
    if (cat.includes('брюки') || cat.includes('pants')) return ['42', '44', '46', '48', '50'].map(n => ({ name: n }));
    if (cat.includes('платья') || cat.includes('dress')) return ['40', '42', '44', '46', '48', '50'].map(n => ({ name: n }));
    if (cat.includes('аксессуары') || cat.includes('accessories')) return ['One Size'].map(n => ({ name: n }));
    return ['XS', 'S', 'M', 'L', 'XL'].map(n => ({ name: n }));
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
  
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const isInComparison = comparisonList.some(item => item.id === product.id);
  const isOutOfStock = product.availability === 'out_of_stock' || (product.sizes?.length === 0 && !product.availability);

  // 5. Action Handlers
  const handleCancelSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const colorToClear = currentColor.name;

    // Сбрасываем только товары в корзине, не трогая оплаченные
    productSizes.forEach(sizeObj => {
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
      title: "Выбор сброшен", 
      description: `Неоплаченные товары для цвета ${colorToClear} удалены из корзины.` 
    });
  };

  const hasAnySizeInCart = productSizes.some(sizeObj => {
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
      'Syntha': 'Инновационный бренд технологичной одежды, объединяющий высокую моду и передовые материалы.',
      'Nordic Wool': 'Премиальный трикотаж из натуральной шерсти северных регионов с акцентом на долговечность.',
      'Default': 'Современный бренд, ориентированный на качество и вневременной дизайн.'
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
      <div className="w-[200px] md:w-[240px] flex-shrink-0 snap-start group/pitem cursor-pointer block relative" onMouseEnter={() => { setIsUserActive(true); setHoveredProduct(product); }} onMouseLeave={() => { setIsUserActive(false); setHoveredProduct(null); }}>
      <div className="relative aspect-[3/4] w-full bg-slate-100 border border-slate-100 transition-all duration-500 rounded-[1.25rem] group-hover/pitem:shadow-2xl overflow-hidden flex flex-col">
        {/* Mode 1: GALLERY */}
        {cardMode === 'gallery' && (
          <div className="relative flex-1 flex flex-col group/galleryarea overflow-hidden">
            {/* Navigation Arrow to Mode 2 */}
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardMode('buy'); }}
              className="absolute top-4 right-4 z-40 text-white hover:scale-110 transition-all drop-shadow-lg p-1"
            >
              <ArrowRight className="h-6 w-6" />
            </button>

            {/* View Switcher (Photo/Video) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-xl">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGalleryViewMode('photo'); }}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-300",
                  galleryViewMode === 'photo' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
                )}
              >
                <Camera className="h-3.5 w-3.5" />
                <span className="text-[8px] font-black uppercase tracking-widest">Photo</span>
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGalleryViewMode('video'); }}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-300",
                  galleryViewMode === 'video' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
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
                  <img src={currentPhoto.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover/galleryarea:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Photo Navigation Arrows */}
                  <div className="absolute inset-0 z-20 flex items-center justify-between px-3 pointer-events-none">
                    <motion.button 
                      animate={imagesForCurrentColor.length > 1 ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      whileHover={imagesForCurrentColor.length > 1 ? { scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' } : {}}
                      disabled={imagesForCurrentColor.length <= 1}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrevImage(e); }} 
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-white bg-black/30 backdrop-blur-md border border-white/10 transition-all shadow-xl pointer-events-auto",
                        imagesForCurrentColor.length > 1 ? "cursor-pointer" : "cursor-default"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                    </motion.button>
                    <motion.button 
                      animate={imagesForCurrentColor.length > 1 ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      whileHover={imagesForCurrentColor.length > 1 ? { scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' } : {}}
                      disabled={imagesForCurrentColor.length <= 1}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNextImage(e); }} 
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-white bg-black/30 backdrop-blur-md border border-white/10 transition-all shadow-xl pointer-events-auto",
                        imagesForCurrentColor.length > 1 ? "cursor-pointer" : "cursor-default"
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
                  className="absolute inset-0 z-0 bg-black overflow-hidden group/video-container"
                >
                  {/* Video Background or Actual Video */}
                  {isVideoPlaying ? (
                    <video 
                      key={product.videoUrls?.[currentVideoIndex]?.url}
                      src={product.videoUrls?.[currentVideoIndex]?.url}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={baseImages[1]?.url || currentPhoto.url} 
                      alt="Video background" 
                      className="w-full h-full object-cover opacity-60 scale-110 blur-sm"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  
                  {/* Central Controls */}
                  <div className={cn(
                    "absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-500",
                    isVideoPlaying ? "opacity-0 group-hover/video-container:opacity-100 bg-black/20" : "opacity-100"
                  )}>
                    <div className="flex items-center justify-center gap-3 w-full px-4 relative z-20">
                      {/* Like Button */}
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={(e) => { 
                                e.preventDefault(); e.stopPropagation(); 
                                const url = product.videoUrls?.[currentVideoIndex]?.url;
                                if (url) toggleLikedVideo(url);
                              }}
                              className={cn(
                                "h-6 w-6 rounded-lg backdrop-blur-md border transition-all duration-300 shadow-xl flex items-center justify-center cursor-pointer z-30",
                                likedVideos.includes(product.videoUrls?.[currentVideoIndex]?.url || '') 
                                  ? "bg-rose-500 border-rose-400 text-white" 
                                  : "bg-black/40 border-white/10 text-white hover:bg-white hover:text-black"
                              )}
                            >
                              <Heart className={cn("h-3 w-3 transition-transform active:scale-125", likedVideos.includes(product.videoUrls?.[currentVideoIndex]?.url || '') ? "fill-white text-white" : "text-white")} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-black text-white border-none text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                            Нравится
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Play Button */}
                      <div className="relative group/play">
                        <div className="absolute inset-[-6px] rounded-full border border-white/20 scale-110 group-hover/play:scale-125 transition-transform duration-500" />
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVideoPlaying(!isVideoPlaying); }}
                          className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center relative shadow-2xl hover:scale-105 transition-transform cursor-pointer z-30"
                        >
                          {isVideoPlaying ? <Minus className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current ml-1" />}
                        </button>
                      </div>

                      {/* Expand Button */}
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVideoExpanded(true); }}
                              className="h-6 w-6 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-xl cursor-pointer z-30"
                            >
                              <Maximize2 className="h-3 w-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-black text-white border-none text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                            Развернуть
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex flex-col items-center gap-1 mt-6">
                      <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-lg">
                        {isVideoPlaying ? (product.videoUrls?.[currentVideoIndex]?.label || 'Playing Reel') : (product.videoUrls?.[currentVideoIndex]?.label || 'Catwalk Preview')}
                      </p>
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/5">
                        <span className={cn("h-1 w-1 rounded-full shadow-sm", isVideoPlaying ? "bg-emerald-500" : "bg-rose-500 animate-pulse")} />
                        <p className="text-[8px] font-bold text-white uppercase tracking-widest">
                          {isVideoPlaying ? `Video ${currentVideoIndex + 1} / ${product.videoUrls?.length}` : 'Live 4K'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Video Navigation Arrows */}
                  {((product.videoUrls?.length || 0) > 1) && (
                    <div className="absolute inset-0 z-40 flex items-center justify-between px-3 pointer-events-none">
                      <motion.button 
                        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={{ scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrevVideo(e); }}
                        className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-xl pointer-events-auto"
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                      </motion.button>
                      <motion.button 
                        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={{ scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNextVideo(e); }}
                        className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-xl pointer-events-auto"
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={3} />
                      </motion.button>
                    </div>
                  )}

                  {/* Video Navigation Arrows */}
                  <div className="absolute inset-0 z-40 flex items-center justify-between px-3 pointer-events-none">
                    <motion.button 
                      animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      whileHover={{ scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrevVideo(e); }}
                      className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-xl pointer-events-auto"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                    </motion.button>
                    <motion.button 
                      animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      whileHover={{ scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNextVideo(e); }}
                      className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-xl pointer-events-auto"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={3} />
                    </motion.button>
                  </div>

                  {/* Simulated Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <motion.div 
                      key={currentVideoIndex + (isVideoPlaying ? 'playing' : 'paused')}
                      initial={{ width: 0 }}
                      animate={{ width: isVideoPlaying ? "100%" : "30%" }}
                      transition={{ duration: isVideoPlaying ? 10 : 0.5, repeat: isVideoPlaying ? Infinity : 0, ease: "linear" }}
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Section: Info, Price and Colors (Exact same as Mode 2) */}

            {/* Bottom Section: Info, Price and Colors (Exact same as Mode 2) */}
            <div className="relative z-10 p-3 mt-auto flex flex-col gap-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-between items-end gap-3">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="text-left">
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1 cursor-help hover:text-white transition-colors">{product.brand}</p>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="bg-black/90 backdrop-blur-xl text-white border border-white/10 text-[9px] font-medium leading-relaxed p-3 rounded-xl max-w-[200px] shadow-2xl z-[100]">
                          <div className="space-y-1">
                            <p className="font-black uppercase tracking-widest text-[7px] text-white/40 border-b border-white/5 pb-1 mb-1">О бренде</p>
                            {getBrandDescription(product.brand)}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <h3 className="text-xs font-medium uppercase tracking-tight text-white leading-tight mb-1">{product.name}</h3>
                    {product.composition && (
                      <p className="text-[7px] font-black text-indigo-300 uppercase tracking-widest leading-none mb-1">
                        {typeof product.composition === 'string' ? product.composition : 
                          product.composition.map(c => `${c.percentage}% ${c.material}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {isOutlet && product.originalPrice && (
                      <span className="text-[10px] text-rose-500 line-through tabular-nums leading-none">
                        {Number(product.originalPrice).toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                    <p className={cn(
                      "text-sm font-medium tabular-nums tracking-tighter leading-none",
                      isOutlet ? "text-emerald-500" : "text-white"
                    )}>
                      {Number(product.price).toLocaleString("ru-RU")} <span className="text-xs font-medium">₽</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 mb-1 max-w-[100px]">
                  <div className="flex items-center gap-1.5 relative group/color-nav">
                    {colors.length > 4 && (
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollColors('left'); }}
                        className="h-4 w-4 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                      >
                        <ChevronLeft className="h-2.5 w-2.5" />
                      </button>
                    )}
                    <div ref={colorScrollRef} className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth">
                      {colors.map((c: any, i: number) => (
                        <button 
                          key={i} 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(i); setCurrentPhotoIndex(0); }} 
                          className={cn(
                            "h-5 w-5 rounded-full transition-all duration-300 relative border-[0.33px] border-white/20 shadow-sm flex-shrink-0", 
                            currentImageIndex === i ? "scale-110 z-10 ring-[0.66px] ring-white" : "hover:scale-105"
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
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollColors('right'); }}
                        className="h-4 w-4 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                      >
                        <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[6px] font-black uppercase tracking-widest text-white/60 leading-none whitespace-nowrap">{currentColor.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: BUY (Default Link) */}
        {cardMode === 'buy' && (
          <div className="relative flex-1 flex flex-col group/buyarea overflow-hidden">
            <Link href={`/products/${product.sku || product.slug}`} className="absolute inset-0 z-0">
              <img src={currentPhoto.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover/buyarea:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </Link>
            
            {/* Center Actions Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
              {/* Action Icons Block */}
              <div 
                className="flex items-center justify-center gap-3 mb-5 relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {[
                  { 
                    icon: Library, 
                    label: "Образы", 
                    active: lookboards?.some(lb => lb.looks?.some((look: any) => look.products?.some((p: any) => p.productId === product.id))),
                    collections: lookboards?.map(lb => ({ 
                      id: lb.id, 
                      name: lb.title, 
                      items: lb.looks?.flatMap(look => look.products?.map(p => ({ id: p.productId })) || []) 
                    })),
                    onAdd: (collId: string) => {
                      addProductToLookboard(product as any, collId);
                      setMenuOpenIdx(null);
                      toast({ title: "Добавлено в Образы", description: `Товар добавлен в подборку.` });
                    },
                    onCreate: (name: string) => {
                      addLookboard(name, "");
                    }
                  },
                  { 
                    icon: Heart, 
                    label: "Избранное", 
                    active: isWishlisted,
                    collections: wishlistCollections,
                    onAdd: (collId: string) => {
                      addWishlistItem(product as any, collId);
                      setMenuOpenIdx(null);
                      toast({ title: "Добавлено в Избранное", description: `Товар добавлен в избранное.` });
                    },
                    onCreate: (name: string) => {
                      addWishlistCollection(name);
                    }
                  },
                  ...(viewRole === 'b2b' ? [{
                    icon: Layers,
                    label: "Ассортимент",
                    active: assortmentPlan?.some(item => item.id === product.id),
                    action: () => {
                      addToAssortmentPlan(product as any);
                      toast({ title: "Ассортимент", description: "Товар добавлен в план ассортимента." });
                    }
                  }] : []),
                  { 
                    icon: GitCompare, 
                    label: "Сравнить", 
                    active: isInComparison,
                    collections: savedComparisons?.length > 0 ? savedComparisons : [{ id: 'default', name: 'Основное сравнение' }],
                    onAdd: (collId: string) => {
                      toggleComparisonItem(product as any);
                      setMenuOpenIdx(null);
                      toast({ title: isInComparison ? "Удалено из сравнения" : "Добавлено к сравнению" });
                    },
                    onCreate: (name: string) => {
                      saveComparison(name);
                    }
                  },
                  { icon: AR, label: "AR", action: () => toast({ title: "Запуск AR", description: "Подготовка 3D-модели для дополненной реальности..." }) },
                  { icon: Share2, label: "Поделиться", action: () => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast({ title: "Ссылка скопирована", description: "Ссылка на товар сохранена в буфер обмена." });
                    }
                  }}
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Individual Tooltip Above Each Icon */}
                    <AnimatePresence>
                      {isPaused && hoveredIconIndex === idx && menuOpenIdx !== idx && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                          exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                          className="absolute bottom-full mb-2 left-1/2 bg-black/90 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border-none shadow-2xl whitespace-nowrap z-[60] pointer-events-none"
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {item.collections ? (
                    <Popover open={menuOpenIdx === idx} onOpenChange={(open) => {
                      setMenuOpenIdx(open ? idx : null);
                      if (!open) {
                        setIsCreatingNewCollection(false);
                        setNewCollectionName('');
                      }
                    }}>
                      <PopoverTrigger asChild>
                        <motion.button
                          animate={{ 
                            scale: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ? 1.5 : 1,
                            backgroundColor: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active ? '#fff' : 'rgba(255,255,255,0.1)',
                            color: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active ? '#000' : '#fff'
                          }}
                          onMouseEnter={() => {
                            setHoveredIconIndex(idx);
                          }}
                          onMouseLeave={() => {
                            setHoveredIconIndex(null);
                          }}
                          transition={{ duration: 0.5 }}
                          className={cn(
                            "h-6 w-6 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all shadow-sm cursor-pointer z-20",
                            ((isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active) && "ring-1 ring-white/50"
                          )}
                        >
                          <item.icon className={cn("h-3 w-3", item.active && "fill-current")} />
                        </motion.button>
                      </PopoverTrigger>
                      <PopoverContent 
                        side="top" 
                        align="center" 
                        sideOffset={15}
                        className="w-[160px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-2xl z-[100] p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1 p-1">
                          <p className="text-[7px] font-black uppercase tracking-widest text-white/40 px-2 py-1 border-b border-white/5 mb-1">
                            {item.label}
                          </p>
                          
                          {isCreatingNewCollection ? (
                            <div className="p-2 flex flex-col gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="Название..."
                                className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[9px] text-white focus:outline-none focus:border-indigo-500/50"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newCollectionName.trim()) {
                                    item.onCreate?.(newCollectionName.trim());
                                    toast({ title: "Создано", description: `Подборка "${newCollectionName}" создана.` });
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
                                      toast({ title: "Создано", description: `Подборка "${newCollectionName}" создана.` });
                                      setIsCreatingNewCollection(false);
                                      setNewCollectionName('');
                                    }
                                  }}
                                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[8px] font-black uppercase py-1 rounded-md transition-colors"
                                >
                                  Ок
                                </button>
                                <button
                                  onClick={() => {
                                    setIsCreatingNewCollection(false);
                                    setNewCollectionName('');
                                  }}
                                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[8px] font-black uppercase py-1 rounded-md transition-colors"
                                >
                                  Отмена
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="max-h-[120px] overflow-y-auto no-scrollbar">
                                {item.collections.map((coll: any) => (
                                  <button
                                    key={coll.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      item.onAdd?.(coll.id);
                                    }}
                                    className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/10 rounded-md transition-colors group/item"
                                  >
                                    <span className="text-[9px] font-bold text-white/80 group-hover/item:text-white truncate max-w-[110px]">{coll.name}</span>
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
                                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-indigo-500/20 rounded-md transition-colors mt-1 border-t border-white/5 pt-2"
                              >
                                <Plus className="h-2 w-2 text-indigo-400" />
                                <span className="text-[8px] font-black uppercase text-indigo-400">Создать новую</span>
                              </button>
                            </>
                          )}
                        </div>
                      </PopoverContent>
                      </Popover>
                    ) : (
                      <motion.button
                        animate={{ 
                          scale: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ? 1.5 : 1,
                          backgroundColor: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active ? '#fff' : 'rgba(255,255,255,0.1)',
                          color: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active ? '#000' : '#fff'
                        }}
                        onMouseEnter={() => {
                          setHoveredIconIndex(idx);
                        }}
                        onMouseLeave={() => {
                          setHoveredIconIndex(null);
                        }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "h-6 w-6 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all shadow-sm cursor-pointer z-20",
                          ((isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active) && "ring-1 ring-white/50"
                        )}
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          item.action?.();
                        }}
                      >
                        <item.icon className={cn("h-3 w-3", item.active && "fill-current")} />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 w-full justify-center">
                {/* Switch to Mode 1 (Gallery) */}
                <Button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardMode('gallery'); }}
                  className="px-2.5 h-8 rounded-xl bg-white/5 hover:bg-white/30 hover:shadow-lg hover:shadow-white/5 text-white border-[0.33px] border-white/10 font-black uppercase text-[7px] tracking-widest transition-all"
                >
                  <ArrowLeft className="h-2 w-2 mr-1.5" /> Медиа
                </Button>
                
                {/* Link to PDP */}
                <Link href={`/products/${product.sku || product.slug}`}>
                  <Button className="px-4 h-8 rounded-xl bg-white/5 hover:bg-white/30 hover:shadow-lg hover:shadow-white/5 text-white border-[0.33px] border-white/10 font-black uppercase text-[7px] tracking-widest transition-all">
                    К товару
                  </Button>
                </Link>

                {/* Switch to Mode 3 (Purchase) */}
                <Button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardMode('purchase'); }}
                  className="px-2.5 h-8 rounded-xl bg-white/5 hover:bg-white/30 hover:shadow-lg hover:shadow-white/5 text-white border-[0.33px] border-white/10 font-black uppercase text-[7px] tracking-widest transition-all"
                >
                  В корзину <ArrowRight className="h-2 w-2 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 p-3 mt-auto flex flex-col gap-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-between items-end gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  {/* Info & Price (Left) */}
                  <div className="text-left">
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1 cursor-help hover:text-white transition-colors">{product.brand}</p>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="bg-black/90 backdrop-blur-xl text-white border border-white/10 text-[9px] font-medium leading-relaxed p-3 rounded-xl max-w-[200px] shadow-2xl z-[100]">
                          <div className="space-y-1">
                            <p className="font-black uppercase tracking-widest text-[7px] text-white/40 border-b border-white/5 pb-1 mb-1">О бренде</p>
                            {getBrandDescription(product.brand)}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <h3 className="text-xs font-medium uppercase tracking-tight text-white leading-tight mb-1">{product.name}</h3>
                    {product.composition && (
                      <p className="text-[7px] font-black text-indigo-300 uppercase tracking-widest leading-none mb-1">
                        {typeof product.composition === 'string' ? product.composition : 
                          product.composition.map(c => `${c.percentage}% ${c.material}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {isOutlet && product.originalPrice && (
                      <span className="text-[10px] text-rose-500 line-through tabular-nums leading-none">
                        {Number(product.originalPrice).toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                    <p className={cn(
                      "text-sm font-medium tabular-nums tracking-tighter leading-none",
                      isOutlet ? "text-emerald-500" : "text-white"
                    )}>
                      {Number(product.price).toLocaleString("ru-RU")} <span className="text-xs font-medium">₽</span>
                    </p>
                  </div>
                </div>

                {/* Colors (Right) */}
                <div className="flex flex-col items-center gap-2 mb-1 max-w-[100px]">
                  <div className="flex items-center gap-1.5 relative group/color-nav">
                    {colors.length > 4 && (
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollColors('left'); }}
                        className="h-4 w-4 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                      >
                        <ChevronLeft className="h-2.5 w-2.5" />
                      </button>
                    )}
                    <div ref={colorScrollRef} className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth">
                      {colors.map((c: any, i: number) => (
                        <button 
                          key={i} 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(i); setCurrentPhotoIndex(0); }} 
                          className={cn(
                            "h-5 w-5 rounded-full transition-all duration-300 relative border-[0.33px] border-white/20 shadow-sm flex-shrink-0", 
                            currentImageIndex === i ? "scale-110 z-10 ring-[0.66px] ring-white" : "hover:scale-105"
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
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollColors('right'); }}
                        className="h-4 w-4 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                      >
                        <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[6px] font-black uppercase tracking-widest text-white/60 leading-none whitespace-nowrap">{currentColor.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: PURCHASE (Selection) */}
        {cardMode === 'purchase' && (
          <div className="relative flex-1 flex flex-col group/purchasearea overflow-hidden">
            {/* Navigation Arrow to Mode 2 */}
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardMode('buy'); }}
              className="absolute top-4 left-4 z-40 text-white hover:scale-110 transition-all drop-shadow-lg p-1"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="absolute inset-0 z-0">
              <img src={currentPhoto.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col p-3 text-white overflow-hidden">
              <div className="flex-1 flex flex-col justify-start items-center gap-3 pt-5 min-h-0">
                {/* Color Selection */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    {colors.map((c: any, i: number) => (
                      <button 
                        key={i} 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(i); setSelectedSize(null); }} 
                        className={cn(
                          "h-6 w-6 rounded-full transition-all duration-300 relative border-[0.33px] border-white/20 shadow-sm", 
                          currentImageIndex === i ? "scale-110 z-10 ring-[0.66px] ring-white" : "hover:scale-105"
                        )} 
                        style={{ 
                          backgroundColor: c.hex.startsWith('url') ? 'transparent' : c.hex, 
                          background: c.hex.startsWith('url') ? c.hex : c.hex,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[6px] font-black uppercase tracking-widest text-white/60 leading-none">{currentColor.name}</span>
                </div>

                {/* Size Grid & Dimensions */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="grid grid-cols-4 gap-1.5 w-fit mx-auto">
                    {productSizes.map(sizeObj => {
                      const sizeName = typeof sizeObj === 'string' ? sizeObj : (sizeObj as any).name;
                      const status = getSizeStatus(sizeName);
                      const key = `${currentColor.name}-${sizeName}`;
                      
                      const isCurrentlyPaid = isPaid && selectedSize === sizeName;
                      const isPaidSize = !!paidQuantities[key] || isCurrentlyPaid;
                      const confirmedQty = confirmedBackorderQuantities[key] || 0;
                      const isConfirmedNotPaid = confirmedQty > 0 && !isPaidSize;
                      
                      // Зеленый кружок (корзина) только если не оплачено и не подтверждено
                      const inCart = (isPaidSize || isConfirmedNotPaid) ? 0 : getInCartQuantity(sizeName);
                      
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
                                  "h-[26px] w-[26px] flex items-center justify-center text-[9px] font-black uppercase transition-all rounded-md relative",
                                  // Default State (Solid)
                                  "bg-white text-black border-[0.33px] border-transparent",
                                  // Purchased State (Glow)
                                  alreadyPurchased && "shadow-[0_0_8px_rgba(52,211,153,0.5)] border-emerald-400/40",
                                  // Selection State
                                  selectedSize === sizeName ? "bg-slate-900 text-white shadow-lg scale-110 border-[0.33px] border-slate-900" : "hover:bg-slate-100",
                                  // Already Bought State (Selection context)
                                  inCart > 0 && !selectedSize && "ring-2 ring-emerald-500",
                                  // Backorder State
                                  isBackorder && !selectedSize && "ring-2 ring-amber-500",
                                  // Out of Stock State
                                  status === 'out_of_stock' && "opacity-20 cursor-not-allowed line-through"
                                )}
                              >
                                {sizeName}
                                
                                {/* Badges Container (Top Right) */}
                                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex flex-row-reverse gap-0.5 z-10 pointer-events-auto">
                                  {/* Regular Cart (Green) */}
                                  {inCart > 0 && (
                                    <motion.div className="h-3.5 w-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[7px] font-black shadow-lg shrink-0">
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
                                        ease: "easeInOut"
                                      }}
                                      className="h-3.5 w-3.5 bg-orange-500/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-[7px] font-black shadow-lg shrink-0"
                                    >
                                      {confirmedQty}
                                    </motion.div>
                                  )}

                                  {/* Paid / Awaiting Delivery (Solid Orange) */}
                                  {awaitingQty > 0 && (
                                    <motion.div className="h-3.5 w-3.5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[7px] font-black shadow-lg shrink-0">
                                      {awaitingQty}
                                    </motion.div>
                                  )}
                                </div>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-black text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                              {inCart > 0 ? 'В корзине' : isPaidSize ? 'Оформлено' : alreadyPurchased ? 'Уже приобретался ранее' : status === 'out_of_stock' ? 'Нет в наличии' : isBackorder ? 'Доступен под заказ' : 'В наличии'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>

                  {/* Dimensions Display */}
                  <div className="h-10 flex flex-col items-center justify-center">
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
                            <p className="text-[8px] font-black text-white uppercase tracking-[0.1em] leading-none">
                              {getSizeDetails(product.category, selectedSize).label}: <span className="text-indigo-400">{getSizeDetails(product.category, selectedSize).value}</span>
                            </p>
                          </div>
                          <p className="text-[7px] font-medium text-white/50 uppercase tracking-widest leading-none">
                            {getSizeDetails(product.category, selectedSize).description} • {getSizeDetails(product.category, selectedSize).fit}
                          </p>
                          <p className="text-[6px] font-black text-indigo-300 uppercase tracking-[0.2em] mt-1">
                            {product.composition && (
                              <span className="text-white/80">{typeof product.composition === 'string' ? product.composition : product.composition.map(c => `${c.percentage}% ${c.material}`).join(', ')} • </span>
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
                      className="flex flex-col gap-3 pt-2 border-t border-white/10"
                    >
                      <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Статус</span>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-tight",
                            getSizeStatus(selectedSize) === 'pre_order' ? "text-amber-400" : "text-emerald-400"
                          )}>
                            {getSizeStatus(selectedSize) === 'pre_order' ? 'Дозаказ возможен' : `В наличии: ${getMaxStock(selectedSize)} шт.`}
                          </span>
                          {getSizeStatus(selectedSize) === 'pre_order' && (
                            <span className="text-[6px] text-white/60 font-medium">Срок: ~14-21 день</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                          <button 
                            disabled={quantity === 0 || isPaid}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              const newQty = Math.max(0, quantity - 1);
                              setQuantity(newQty);
                              
                              // If it was already in cart, sync the reduction
                              if (selectedSize && getInCartQuantity(selectedSize) > 0) {
                                addCartItem({ ...product, color: currentColor.name } as any, selectedSize, newQty);
                              }

                              if (newQty === 0) {
                                setIsBackorderRequested(false);
                                setBackorderStatus('idle');
                              }
                            }}
                            className="h-5 w-5 rounded-md hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-black"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="text-[10px] font-black w-4 text-center tabular-nums text-black">{quantity}</span>
                          <button 
                            disabled={isPaid || quantity >= (getSizeStatus(selectedSize) === 'pre_order' ? 99 : getMaxStock(selectedSize))}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              const max = getSizeStatus(selectedSize) === 'pre_order' ? 99 : getMaxStock(selectedSize);
                              if (quantity < max) {
                                const newQty = quantity + 1;
                                setQuantity(newQty);
                                
                                // If it was already in cart, sync the increase
                                if (selectedSize && getInCartQuantity(selectedSize) > 0) {
                                  addCartItem({ ...product, color: currentColor.name } as any, selectedSize, newQty);
                                }
                              }
                            }}
                            className="h-5 w-5 rounded-md hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-black"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 justify-center">
                        {isPaid ? (
                          <div className="text-center py-1">
                            <p className="text-[7px] text-white/60 uppercase font-black leading-tight">Отмена возможна через</p>
                            <button 
                              onClick={() => toast({ title: "Чат с брендом", description: "Переход в раздел заказов для связи с представителем бренда..." })}
                              className="text-[8px] text-indigo-400 font-black uppercase underline hover:text-indigo-300 transition-colors"
                            >
                              Личный чат в заказах
                            </button>
                          </div>
                        ) : (
                          <>
                            <Button 
                              onClick={(e) => { 
                                e.preventDefault(); e.stopPropagation(); 
                                if (quantity === 0) {
                                  toast({ title: "Выберите количество", description: "Укажите количество товара перед добавлением.", variant: "destructive" });
                                  return;
                                }
                                if (getSizeStatus(selectedSize) === 'pre_order') {
                                  if (backorderStatus === 'idle') {
                                    setBackorderStatus('requested');
                                    setIsBackorderRequested(true);
                                    toast({ title: "Запрос отправлен", description: "Бренд уведомлен о вашем дозаказе." });
                                  }
                                } else {
                                  addCartItem({ ...product, color: currentColor.name } as any, selectedSize, quantity);
                                  toast({ title: "Успешно", description: `Товар в количестве ${quantity} шт. добавлен в корзину.` });

                                  if (viewRole === 'b2b') {
                                    addB2bActivityLog({
                                      type: 'order_draft',
                                      actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                                      target: { id: product.id, name: product.name, type: 'product' },
                                      details: `Added ${quantity} units of ${product.name} to draft.`
                                    });
                                  }
                                }
                              }}
                              disabled={backorderStatus === 'requested' || (getSizeStatus(selectedSize) === 'pre_order' && quantity === 0)}
                              className={cn(
                                "w-fit px-5 h-7 rounded-xl font-black uppercase text-[8px] tracking-widest transition-all duration-500",
                                (backorderStatus === 'confirmed' && !isPaid) ? "bg-emerald-500 text-white border-none" : 
                                backorderStatus === 'rejected' ? "bg-rose-500 text-white border-none" :
                                "bg-transparent text-white border-[0.33px] border-white/20 hover:bg-black hover:border-white hover:button-glimmer"
                              )}
                            >
                              {getSizeStatus(selectedSize) === 'pre_order' ? (
                                backorderStatus === 'requested' ? <><Sparkles className="h-3 w-3 mr-1.5 animate-pulse" /> Ожидание...</> :
                                (backorderStatus === 'confirmed' && !isPaid) ? <><Check className="h-3 w-3 mr-1.5" /> Подтверждено</> :
                                backorderStatus === 'rejected' ? <><Minus className="h-3 w-3 mr-1.5" /> Отклонено</> :
                                <><Zap className="h-3 w-3 mr-1.5" /> Запросить дозаказ</>
                              ) : (
                                (quantity > 0 && quantity === getInCartQuantity(selectedSize)) ? <><Check className="h-3 w-3 mr-1.5" /> Товар в корзине</> : <><ShoppingBag className="h-3 w-3 mr-1.5" /> Добавить в корзину</>
                              )}
                            </Button>

                            {backorderStatus === 'confirmed' && !isPaid && (
                              <div className="flex gap-1">
                                <motion.button 
                                  animate={{ opacity: [1, 0.4, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                  onClick={(e) => {
                                    e.preventDefault(); e.stopPropagation();
                                    toggleCart();
                                    setIsPaid(true);
                                    // Store paid quantity locally
                                    if (selectedSize) {
                                      const key = `${currentColor.name}-${selectedSize}`;
                                      setPaidQuantities(prev => ({ ...prev, [key]: quantity }));
                                      // Remove from cart (top-right badge context)
                                      addCartItem({ ...product, color: currentColor.name } as any, selectedSize, 0);
                                    }
                                    setBackorderStatus('idle');
                                    toast({ title: "Оплата", description: "Переход в корзину для завершения платежа..." });
                                  }}
                                  className="h-7 px-2.5 rounded-lg bg-white text-black text-[7px] font-black uppercase tracking-tighter hover:bg-emerald-50 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                >
                                  Оплатить
                                </motion.button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault(); e.stopPropagation();
                                    setBackorderStatus('idle');
                                    setIsBackorderRequested(false);
                                    setQuantity(0);
                                    if (selectedSize) {
                                      addCartItem({ ...product, color: currentColor.name } as any, selectedSize, 0);
                                    }
                                  }}
                                  className="h-7 w-7 rounded-lg bg-white/10 hover:bg-rose-500/20 text-white flex items-center justify-center transition-colors"
                                >
                                  <Plus className="h-3 w-3 rotate-45" />
                                </button>
                              </div>
                            )}

                            {backorderStatus === 'rejected' && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault(); e.stopPropagation();
                                  setBackorderStatus('idle');
                                  setIsBackorderRequested(false);
                                  setQuantity(0);
                                  if (selectedSize) {
                                    addCartItem({ ...product, color: currentColor.name } as any, selectedSize, 0);
                                  }
                                }}
                                className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
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

                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    {isOutlet && product.originalPrice && (
                      <span className="text-[10px] text-rose-500 line-through tabular-nums leading-none">
                        {Number(product.originalPrice).toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                    <p className={cn(
                      "text-base font-medium tracking-tighter",
                      isOutlet ? "text-emerald-500" : "text-white"
                    )}>{Number(product.price).toLocaleString("ru-RU")} ₽</p>
                  </div>
                  <button 
                    onClick={handleCancelSelection}
                    className="text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-rose-400 transition-colors"
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
      <div className="flex justify-center items-center gap-2 mt-3 pb-1">
        {[
          { id: 'gallery', label: 'Просмотр фото' },
          { id: 'buy', label: 'Перейти к товару' },
          { id: 'purchase', label: 'Быстрый заказ' }
        ].map((mode) => (
          <TooltipProvider key={mode.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCardMode(mode.id as any)}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    cardMode === mode.id ? "bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)] scale-125" : "bg-slate-200 hover:bg-slate-400"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                {mode.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <QuickViewDialog product={product} isOpen={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />

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
              className="relative z-10 w-full max-w-lg aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            >
              {/* Vertical Video Content */}
              <div className="relative flex-1 bg-black flex items-center justify-center">
                <img 
                  src={currentPhoto.url} 
                  alt="Full Video Preview" 
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Video UI Overlay */}
                <div className="absolute inset-0 flex flex-col p-4 bg-gradient-to-b from-black/40 via-transparent to-black/80">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{product.brand}</p>
                      <h4 className="text-sm font-black text-white uppercase tracking-tighter">{product.name}</h4>
                    </div>
                    <button 
                      onClick={() => setIsVideoExpanded(false)}
                      className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                      <Plus className="h-6 w-6 rotate-45" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-col items-center gap-3">
                    <div className="h-24 w-24 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-white/5"
                      />
                      <div className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 fill-current ml-1" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        <p className="text-xs font-black text-white uppercase tracking-[0.4em]">Live Catwalk 4K</p>
                      </div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic">Spring-Summer 2024 Collection</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="h-20 bg-zinc-950 border-t border-white/5 flex items-center justify-between px-10">
                <div className="flex items-center gap-3">
                   <button 
                     onClick={(e) => {
                       e.preventDefault(); e.stopPropagation();
                       const url = product.videoUrls?.[currentVideoIndex]?.url;
                       if (url) toggleLikedVideo(url);
                     }}
                     className="transition-all active:scale-125"
                   >
                     <Heart className={cn(
                       "h-5 w-5 transition-colors cursor-pointer",
                       likedVideos.includes(product.videoUrls?.[currentVideoIndex]?.url || '') 
                         ? "text-rose-500 fill-current" 
                         : "text-white/60 hover:text-rose-500"
                     )} />
                   </button>
                   <Share2 className="h-5 w-5 text-white/60 hover:text-indigo-400 transition-colors cursor-pointer" />
                </div>
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-10 font-black uppercase text-[10px] tracking-widest">
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
