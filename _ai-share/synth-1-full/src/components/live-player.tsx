'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import Image from 'next/image';
import type { ImagePlaceholder, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Heart, Send, ShoppingCart, PanelLeftClose, PanelRightClose, Eye, Users, Clock, Share2, Star } from 'lucide-react';
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
    { user: "Елена", text: "Какая красивая вещь! 😍" },
    { user: "Максим", text: "Это из новой коллекции?" },
    { user: "Анна", text: "Очень нравится цвет!" },
    { user: "Иван", text: "А какой состав ткани?" },
    { user: "София", text: "Уже хочу это купить!" },
    { user: "Дмитрий", text: "Идеально для лета!"},
    { user: "Катерина", text: "Есть другие цвета?"},
    { user: "Марина", text: "Подскажите, пожалуйста, замеры для размера S."},
    { user: "Виктор", text: "Очень стильно!"},
    { user: "Ольга", text: "Доставка быстрая?"},

];

const timelineChapters = [
    { time: '00:10', title: 'Начало' },
    { time: '05:30', title: 'Обзор товаров' },
    { time: '15:45', title: 'Ответы на вопросы' },
    { time: '25:00', title: 'Финальные образы' },
];


export default function LivePlayer({ event, isOpen, onOpenChange, isLive, showChat = true, showReactions = true, showSponsors = false, showBanners = true }: LivePlayerProps) {
    const { toast } = useToast();
    const { addCartItem, addWishlistItem, removeWishlistItem, wishlist, user } = useUIState();
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [expandedProduct, setExpandedProduct] = useState<Product | null>(null);
    const [isChatVisible, setIsChatVisible] = useState(showChat);
    const [isProductsVisible, setIsProductsVisible] = useState(true);
    const [isHoveringHeart, setIsHoveringHeart] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

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
                console.warn("Failed to fetch products for live player, using fallback or empty list:", error);
                // Fallback to empty or mocked products if needed
                setFeaturedProducts([]);
            }
        };
        fetchProducts();
    }, []);
    
    useEffect(() => {
        setIsChatVisible(showChat);
    }, [showChat, isOpen]);
    
    if (!event) return null;

    const handleAddToCart = (product: Product) => {
        addCartItem(product, product.sizes?.[0].name || 'One Size');
        toast({
            title: "Товар добавлен в корзину",
            description: `${product.name} теперь в вашей корзине.`,
        });
    };
    
    const handleToggleWishlist = (product: Product) => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        if (isInWishlist) {
          removeWishlistItem(product, 'default');
          toast({ title: "Товар удален из избранного" });
        } else {
          addWishlistItem(product, 'default');
          toast({ title: "Добавлено в избранное" });
        }
    };
    
    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments(prev => [...prev, { user: user?.displayName || 'Гость', text: newComment }]);
            setNewComment("");
        }
    }

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
    
    const FloatingHeart = ({ id, onEnd }: { id: number, onEnd: (id: number) => void }) => {
        const style = {
            left: `${Math.random() * 30 + 35}%`,
            animationDuration: `${Math.random() * 2 + 3}s`,
        };

        return (
            <Heart
                className="absolute bottom-0 text-red-500 fill-red-500 animate-float"
                style={style}
                onAnimationEnd={() => onEnd(id)}
            />
        );
    };

    const [floatingHearts, setFloatingHearts] = useState<{ id: number }[]>([]);

    const addFloatingHeart = () => {
        const newHeart = { id: Date.now() };
        setFloatingHearts(currentHearts => [...currentHearts, newHeart]);
    };
     const removeFloatingHeart = (id: number) => {
        setFloatingHearts(currentHearts => currentHearts.filter(heart => heart.id !== id));
    };
    
    const getGridCols = () => {
        if (isChatVisible && isProductsVisible) return 'grid-cols-[1fr_2fr_1fr]';
        if (isChatVisible && !isProductsVisible) return 'grid-cols-[1fr_3fr]';
        if (!isChatVisible && isProductsVisible) return 'grid-cols-[3fr_1fr]';
        return 'grid-cols-1';
    }
    
    // Simulate the host pinning a product. We'll just highlight the first one.
    const pinnedProductId = featuredProducts[0]?.id;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className={cn(
              "max-w-7xl w-full p-0 gap-0 border-0 grid h-full max-h-[90vh] overflow-hidden",
              getGridCols()
            )}>
                <VisuallyHidden>
                    <DialogTitle>Прямой эфир: {event.description}</DialogTitle>
                </VisuallyHidden>
                
                {/* Chat Column */}
                <div className={cn("flex flex-col bg-background h-full transition-all duration-300 overflow-hidden", isChatVisible ? 'w-full' : 'w-0 hidden')}>
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Обсуждение</DialogTitle>
                    </DialogHeader>
                     <div className="p-4 border-b text-sm">
                        <p className="font-semibold">{event.description}</p>
                        <p className="text-muted-foreground">Ведущая: София, стилист Syntha</p>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {comments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span className="font-semibold">{comment.user}</span>
                                        <p className="text-muted-foreground -mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t mt-auto bg-background z-10">
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
                                <Button type="button" variant={isHoveringHeart ? "destructive" : "ghost"} size="icon" onClick={addFloatingHeart} onMouseEnter={() => setIsHoveringHeart(true)} onMouseLeave={() => setIsHoveringHeart(false)}>
                                    <Heart className="h-5 w-5" />
                                </Button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Video Column */}
                 <div className={cn("h-full w-full relative bg-black flex flex-col", !isChatVisible && "col-start-1")}>
                     <div className="flex-grow relative">
                        <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-contain"
                            poster={event.imageUrl}
                        >
                            <source src="https://storage.googleapis.com/studio-hosting-assets/DLS_ALL_06_18_24.mp4" type="video/mp4" />
                        </video>
                        
                        <div className="absolute top-4 left-4 z-10 flex gap-3">
                            <div className="flex items-center gap-2 bg-background/30 text-white p-2 rounded-lg backdrop-blur-sm">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://picsum.photos/seed/host/40/40" />
                                    <AvatarFallback>С</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">София</p>
                                    <p className="text-xs">Стилист</p>
                                </div>
                            </div>
                            {isLive && <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md h-fit animate-pulse-live">LIVE</div>}
                            <div className="flex items-center gap-1.5 bg-background/30 text-white p-2 rounded-lg backdrop-blur-sm h-fit">
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-semibold">2,458</span>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 z-10">
                            <Button variant="ghost" size="icon" className="bg-background/30 hover:bg-background/70 text-white hover:text-foreground h-8 w-8">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {showSponsors && (
                             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-3 bg-background/30 p-2 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-white">Спонсор:</p>
                                <Image src="https://i.imgur.com/JMgcWwL.png" alt="TSUM" width={40} height={20} className="object-contain" />
                             </div>
                        )}

                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <Button variant="ghost" size="icon" className="bg-background/30 hover:bg-background/70 text-white hover:text-foreground h-8 w-8" onClick={() => setIsChatVisible(!isChatVisible)}>
                                <PanelLeftClose className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="bg-background/30 hover:bg-background/70 text-white hover:text-foreground h-8 w-8" onClick={() => setIsProductsVisible(!isProductsVisible)}>
                                <PanelRightClose className="h-4 w-4"/>
                            </Button>
                        </div>

                        {showReactions && floatingHearts.map(heart => (
                            <FloatingHeart key={heart.id} id={heart.id} onEnd={removeFloatingHeart} />
                        ))}
                     </div>
                     {!isLive && (
                        <div className="bg-background/80 p-2 backdrop-blur-sm">
                            <div className="flex justify-around items-center">
                                {timelineChapters.map(chapter => (
                                    <Button key={chapter.time} variant="ghost" size="sm" className="text-xs text-white h-auto p-1">
                                        <Clock className="h-3 w-3 mr-1.5" />
                                        {chapter.title}
                                    </Button>
                                ))}
                            </div>
                        </div>
                     )}
                 </div>

                {/* Products Column */}
                 <div className={cn("flex flex-col bg-background h-full transition-all duration-300 overflow-hidden", isProductsVisible ? 'w-full' : 'w-0 hidden')}>
                    <DialogHeader className="p-4 border-b flex-row justify-between items-center">
                        <DialogTitle>{expandedProduct ? "Детали товара" : "Товары в эфире"}</DialogTitle>
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
                                        const isInWishlist = wishlist.some(item => item.id === product.id);
                                        const isPinned = product.id === pinnedProductId;
                                        return (
                                            <div key={product.id} className={cn(
                                                "border rounded-lg p-3 flex flex-col h-full w-full text-left hover:border-primary transition-all",
                                                isPinned ? "border-primary shadow-lg" : "border-border"
                                            )}>
                                                <button className="w-full text-left" onClick={() => setExpandedProduct(product)}>
                                                    <div className="relative aspect-[4/5] w-full mb-2 overflow-hidden rounded-md">
                                                        <Image 
                                                            src={product.images[0].url} 
                                                            alt={product.images[0].alt} 
                                                            fill 
                                                            className="object-cover" 
                                                            sizes="150px"
                                                            />
                                                    </div>
                                                    <p className="font-semibold leading-tight text-sm flex-grow">{product.name}</p>
                                                    <div className="flex items-baseline justify-between mt-1">
                                                        <p className="text-muted-foreground text-sm font-bold">{product.price.toLocaleString('ru-RU')} ₽</p>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Eye className="h-3 w-3" />
                                                            <span>{Math.floor(Math.random() * 500) + 50}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button size="sm" className="w-full h-8" onClick={(e) => {e.stopPropagation(); handleAddToCart(product)}}>
                                                        <ShoppingCart className="mr-2 h-4 w-4" /> Добавить
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={(e) => {e.stopPropagation(); handleToggleWishlist(product)}}>
                                                        <Star className={cn("h-4 w-4", isInWishlist && 'fill-amber-500 text-amber-500')} />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                            {showBanners && (
                                <div className="p-4 mt-auto border-t">
                                    <div className="aspect-[16/5] bg-muted rounded-lg flex items-center justify-center">
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
