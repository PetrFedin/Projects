
      
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';

interface BulkActionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    products: Product[];
    actionType: 'promo' | 'outlet';
}

export function BulkActionDialog({ isOpen, onOpenChange, products, actionType }: BulkActionDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [discount, setDiscount] = useState<number>(0);
    const [promoCode, setPromoCode] = useState('');

    const handleSendRequest = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            toast({
                title: 'Запрос успешно отправлен',
                description: `Запрос на ${actionType === 'promo' ? 'промо-акцию' : 'перенос в аутлет'} для ${products.length} товаров отправлен на согласование.`,
            });
        }, 1500);
    };
    
    const isPromo = actionType === 'promo';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Массовое действие: {isPromo ? 'Предложить промо-акцию' : 'Предложить перенос в Аутлет'}</DialogTitle>
                    <DialogDescription>
                        Примените условия ко всем выбранным товарам и отправьте запрос на согласование брендам.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                             <Label htmlFor="discount-value">{isPromo ? 'Промокод' : 'Размер скидки (%)'}</Label>
                             <Input 
                                id="discount-value"
                                type={isPromo ? 'text' : 'number'}
                                value={isPromo ? promoCode : (discount || '')}
                                onChange={(e) => isPromo ? setPromoCode(e.target.value) : setDiscount(Number(e.target.value))}
                                placeholder={isPromo ? 'Напр. SUMMER20' : 'Напр. 20'}
                             />
                        </div>
                    </div>
                     <Separator />
                     <h4 className="font-semibold">Выбранные товары ({products.length})</h4>
                     <ScrollArea className="h-64 border rounded-md">
                        <div className="p-4 space-y-2">
                            {products.map(product => (
                                <div key={product.id} className="flex items-center justify-between gap-3 text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Image src={product.images[0].url} alt={product.name} width={32} height={40} className="rounded-sm object-cover" />
                                        <p className="truncate font-medium">{product.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {actionType === 'outlet' && discount > 0 ? (
                                            <>
                                                <p className="text-muted-foreground line-through">{product.price.toLocaleString('ru-RU')} ₽</p>
                                                <p className="font-semibold text-destructive">
                                                    {(product.price * (1 - discount / 100)).toLocaleString('ru-RU')} ₽
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-semibold">{product.price.toLocaleString('ru-RU')} ₽</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSendRequest} disabled={isLoading || (isPromo ? !promoCode : discount <= 0)}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Отправить на согласование
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

    