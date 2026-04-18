'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import type { ImagePlaceholder, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Send,
  ShoppingCart,
  PanelLeftClose,
  PanelRightClose,
  Eye,
  Users,
  Clock,
  Share2,
  Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';
import { useState, useRef, useEffect, useMemo } from 'react';
import { ExpandedProductView } from './live/expanded-product-view';
import { cn } from '@/lib/utils';
import { StreamDateDisplay } from './live/stream-date-display';

interface LivePlayerProps {
  event: ImagePlaceholder;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isLive: boolean;
  showChat?: boolean;
  showReactions?: boolean;
  showSponsors?: boolean;
  showBanners?: boolean;
}

const initialComments = [
  { user: 'Елена', text: 'Какая красивая вещь! 😍' },
  { user: 'Максим', text: 'Это из новой коллекции?' },
  { user: 'Анна', text: 'Очень нравится цвет!' },
  { user: 'Иван', text: 'А какой состав ткани?' },
  { user: 'София', text: 'Уже хочу это купить!' },
  { user: 'Дмитрий', text: 'Идеально для лета!' },
  { user: 'Катерина', text: 'Есть другие цвета?' },
  { user: 'Марина', text: 'Подскажите, пожалуйста, замеры для размера S.' },
  { user: 'Виктор', text: 'Очень стильно!' },
  { user: 'Ольга', text: 'Доставка быстрая?' },
];

const timelineChapters = [
  { time: '00:10', title: 'Начало' },
  { time: '05:30', title: 'Обзор товаров' },
  { time: '15:45', title: 'Ответы на вопросы' },
  { time: '25:00', title: 'Финальные образы' },
];

export default function LivePlayer({
  event,
  isOpen,
  onOpenChange,
  isLive,
  showChat = true,
  showReactions = true,
  showSponsors = false,
  showBanners = true,
}: LivePlayerProps) {
  const { toast } = useToast();
  const { addCartItem, addWishlistItem, removeWishlistItem, wishlist, user } = useUIState();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<Product | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(showChat);
  const [isProductsVisible, setIsProductsVisible] = useState(true);
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/data/products.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const allProducts: Product[] = await res.json();
        if (Array.isArray(allProducts)) {
          setFeaturedProducts(allProducts.slice(8, 12));
        }
      } catch (error) {
        console.warn(
          'Failed to fetch products for live player, using fallback or empty list:',
          error
        );
        // Fallback to empty or mocked products if needed
        setFeaturedProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsChatVisible(showChat);
  }, [showChat, isOpen]);

  const handleAddToCart = (product: Product) => {
    addCartItem(product, product.sizes?.[0].name || 'One Size');
    toast({
      title: 'Товар добавлен в корзину',
      description: `${product.name} теперь в вашей корзине.`,
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      removeWishlistItem(product, 'default');
      toast({ title: 'Товар удален из избранного' });
    } else {
      addWishlistItem(product, 'default');
      toast({ title: 'Добавлено в избранное' });
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments((prev) => [...prev, { user: user?.displayName || 'Гость', text: newComment }]);
      setNewComment('');
    }
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset state on close
      setTimeout(() => {
        setExpandedProduct(null);
        setIsProductsVisible(true);
      }, 300);
    }
  };

  const FloatingHeart = ({ id, onEnd }: { id: number; onEnd: (id: number) => void }) => {
    const style = {
      left: `${Math.random() * 30 + 35}%`,
      animationDuration: `${Math.random() * 2 + 3}s`,
    };

    return (
      <Heart
        className="absolute bottom-0 animate-float fill-red-500 text-red-500"
        style={style}
        onAnimationEnd={() => onEnd(id)}
      />
    );
  };

  if (!event) return null;

  const addFloatingHeart = () => {
    const newHeart = { id: Date.now() };
    setFloatingHearts((currentHearts) => [...currentHearts, newHeart]);
  };
  const removeFloatingHeart = (id: number) => {
    setFloatingHearts((currentHearts) => currentHearts.filter((heart) => heart.id !== id));
  };

  const getGridCols = () => {
    if (isChatVisible && isProductsVisible) return 'grid-cols-[1fr_2fr_1fr]';
    if (isChatVisible && !isProductsVisible) return 'grid-cols-[1fr_3fr]';
    if (!isChatVisible && isProductsVisible) return 'grid-cols-[3fr_1fr]';
    return 'grid-cols-1';
  };

  // Simulate the host pinning a product. We'll just highlight the first one.
  const pinnedProductId = featuredProducts[0]?.id;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'grid h-full max-h-[90vh] w-full max-w-7xl gap-0 overflow-hidden border-0 p-0',
          getGridCols()
        )}
      >
        <VisuallyHidden>
          <DialogTitle>Прямой эфир: {event.description}</DialogTitle>
        </VisuallyHidden>

        {/* Chat Column */}
        <div
          className={cn(
            'flex h-full flex-col overflow-hidden bg-background transition-all duration-300',
            isChatVisible ? 'w-full' : 'hidden w-0'
          )}
        >
          <DialogHeader className="border-b p-4">
            <DialogTitle>Обсуждение</DialogTitle>
          </DialogHeader>
          <div className="border-b p-4 text-sm">
            <p className="font-semibold">{event.description}</p>
            <p className="text-muted-foreground">Ведущая: София, стилист Syntha</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">{comment.user}</span>
                    <p className="-mt-1 text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="z-10 mt-auto border-t bg-background p-4">
            <form onSubmit={handleSendComment} className="flex gap-2">
              <Input
                placeholder="Ваш комментарий..."
                className="flex-1"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon">
                <Send className="h-5 w-5" />
              </Button>
              {showReactions && (
                <Button
                  type="button"
                  variant={isHoveringHeart ? 'destructive' : 'ghost'}
                  size="icon"
                  onClick={addFloatingHeart}
                  onMouseEnter={() => setIsHoveringHeart(true)}
                  onMouseLeave={() => setIsHoveringHeart(false)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}
            </form>
          </div>
        </div>

        {/* Video Column */}
        <div
          className={cn(
            'relative flex h-full w-full flex-col bg-black',
            !isChatVisible && 'col-start-1'
          )}
        >
          <div className="relative flex-grow">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
              poster={event.imageUrl}
            >
              <source
                src="https://storage.googleapis.com/studio-hosting-assets/DLS_ALL_06_18_24.mp4"
                type="video/mp4"
              />
            </video>

            <div className="absolute left-4 top-4 z-10 flex gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-background/30 p-2 text-white backdrop-blur-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/seed/host/40/40" />
                  <AvatarFallback>С</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">София</p>
                  <p className="text-xs">Стилист</p>
                </div>
              </div>
              {isLive && (
                <div className="h-fit animate-pulse-live rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  LIVE
                </div>
              )}
              <div className="flex h-fit items-center gap-1.5 rounded-lg bg-background/30 p-2 text-white backdrop-blur-sm">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">2,458</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/30 text-white hover:bg-background/70 hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {showSponsors && (
              <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 gap-3 rounded-lg bg-background/30 p-2 backdrop-blur-sm">
                <p className="text-xs text-white">Спонсор:</p>
                <Image
                  src="https://picsum.photos/seed/syntha-lab/80/40"
                  alt="Syntha Lab"
                  width={40}
                  height={20}
                  className="object-contain"
                />
              </div>
            )}

            <div className="absolute right-4 top-4 z-10 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/30 text-white hover:bg-background/70 hover:text-foreground"
                onClick={() => setIsChatVisible(!isChatVisible)}
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/30 text-white hover:bg-background/70 hover:text-foreground"
                onClick={() => setIsProductsVisible(!isProductsVisible)}
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>

            {showReactions &&
              floatingHearts.map((heart) => (
                <FloatingHeart key={heart.id} id={heart.id} onEnd={removeFloatingHeart} />
              ))}
          </div>
          {!isLive && (
            <div className="bg-background/80 p-2 backdrop-blur-sm">
              <div className="flex items-center justify-around">
                {timelineChapters.map((chapter) => (
                  <Button
                    key={chapter.time}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs text-white"
                  >
                    <Clock className="mr-1.5 h-3 w-3" />
                    {chapter.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Column */}
        <div
          className={cn(
            'flex h-full flex-col overflow-hidden bg-background transition-all duration-300',
            isProductsVisible ? 'w-full' : 'hidden w-0'
          )}
        >
          <DialogHeader className="flex-row items-center justify-between border-b p-4">
            <DialogTitle>{expandedProduct ? 'Детали товара' : 'Товары в эфире'}</DialogTitle>
          </DialogHeader>
          {expandedProduct ? (
            <ExpandedProductView
              product={expandedProduct}
              onBack={() => setExpandedProduct(null)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
            />
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {featuredProducts.map((product) => {
                    const isInWishlist = wishlist.some((item) => item.id === product.id);
                    const isPinned = product.id === pinnedProductId;
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          'flex h-full w-full flex-col rounded-lg border p-3 text-left transition-all hover:border-primary',
                          isPinned ? 'border-primary shadow-lg' : 'border-border'
                        )}
                      >
                        <button
                          className="w-full text-left"
                          onClick={() => setExpandedProduct(product)}
                        >
                          <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-md">
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              fill
                              className="object-cover"
                              sizes="150px"
                            />
                          </div>
                          <p className="flex-grow text-sm font-semibold leading-tight">
                            {product.name}
                          </p>
                          <div className="mt-1 flex items-baseline justify-between">
                            <p className="text-sm font-bold text-muted-foreground">
                              {product.price.toLocaleString('ru-RU')} ₽
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              <span>{Math.floor(Math.random() * 500) + 50}</span>
                            </div>
                          </div>
                        </button>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-8 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Добавить
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(product);
                            }}
                          >
                            <Star
                              className={cn(
                                'h-4 w-4',
                                isInWishlist && 'fill-amber-500 text-amber-500'
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              {showBanners && (
                <div className="mt-auto border-t p-4">
                  <div className="flex aspect-[16/5] items-center justify-center rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Рекламный баннер</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
