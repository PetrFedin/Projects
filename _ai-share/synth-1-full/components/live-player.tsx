

'use client';

import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Heart, Send, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';

interface LivePlayerProps {
    event: ImagePlaceholder;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const mockComments = [
    { user: "Елена", text: "Какая красивая вещь! 😍" },
    { user: "Максим", text: "Это из новой коллекции?" },
    { user: "Анна", text: "Очень нравится цвет!" },
    { user: "Иван", text: "А какой состав ткани?" },
    { user: "София", text: "Уже хочу это купить!" },
];

const featuredProduct = products.find(p => p.id === '12'); // Silk Midi Dress

export default function LivePlayer({ event, isOpen, onOpenChange }: LivePlayerProps) {
    const { toast } = useToast();
    const { addCartItem } = useUIState();
    
    if (!event) return null;

    const handleAddToCart = () => {
        if (!featuredProduct) return;
        addCartItem(featuredProduct);
        toast({
            title: "Товар добавлен в корзину",
            description: `${featuredProduct.name} теперь в вашей корзине.`,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 gap-0 grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2">
                    <AspectRatio ratio={9 / 16}>
                        <Image 
                            src={event.imageUrl} 
                            alt={event.description} 
                            fill 
                            className="object-cover rounded-l-lg"
                            sizes="(max-width: 768px) 100vw, 67vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">LIVE</div>
                            <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-lg">Презентация новой коллекции</h3>
                            <p className="text-sm">от @brand_name</p>
                        </div>
                    </AspectRatio>
                </div>
                <div className="md:col-span-1 flex flex-col bg-background h-full max-h-[90vh]">
                        <DialogHeader className="p-4 border-b">
                        <DialogTitle>Прямой эфир</DialogTitle>
                        <DialogDescription>
                            Общайтесь и делайте покупки в режиме реального времени.
                        </DialogDescription>
                    </DialogHeader>

                    {featuredProduct && (
                        <div className="p-4 border-b">
                            <p className="text-sm font-semibold mb-2 text-muted-foreground">Товар в эфире:</p>
                                <div className="flex gap-4 items-start">
                                <div className="relative aspect-[4/5] w-20 rounded-md overflow-hidden flex-shrink-0">
                                <Image src={featuredProduct.images[0].url} alt={featuredProduct.images[0].alt} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold leading-tight">{featuredProduct.name}</p>
                                    <p className="text-sm text-muted-foreground">{featuredProduct.price.toLocaleString('ru-RU')} ₽</p>
                                    <Button size="sm" className="mt-2 w-full" onClick={handleAddToCart}>
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Добавить
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {mockComments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{comment.user}</p>
                                        <p className="text-muted-foreground">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t mt-auto">
                        <div className="flex gap-2">
                            <Input placeholder="Ваш комментарий..." className="flex-1" />
                            <Button variant="ghost" size="icon">
                                <Send className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
