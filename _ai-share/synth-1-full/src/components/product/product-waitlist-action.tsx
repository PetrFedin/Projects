'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { addToWaitlist, loadWaitlist } from '@/lib/fashion/waitlist-store';
import { Bell, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Props = { product: Product };

export function ProductWaitlistAction({ product }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [inWaitlist, setInWaitlist] = useState<string[]>([]);

  useEffect(() => {
    const list = loadWaitlist();
    setInWaitlist(list.filter(e => e.sku === product.sku).map(e => e.size));
  }, [product.sku]);

  const handleAdd = () => {
    if (!selectedSize) return;
    const newList = addToWaitlist(product, selectedSize);
    setInWaitlist(newList.filter(e => e.sku === product.sku).map(e => e.size));
    setOpen(false);
    toast({
      title: 'Добавлено в лист ожидания',
      description: `Мы сообщим, когда размер ${selectedSize} появится в наличии.`,
    });
  };

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2 border-primary/40 text-primary hover:bg-primary/5">
            <Bell className="h-4 w-4" />
            Узнать о наличии
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Лист ожидания</DialogTitle>
            <DialogDescription>
              Выберите нужный размер. Как только он поступит на склад, мы пришлем уведомление.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-4">
            {/* В демо показываем все размеры как доступные для ожидания */}
            {['XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39', '40'].slice(0, 6).map(size => {
              const isAdded = inWaitlist.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => !isAdded && setSelectedSize(size)}
                  className={`h-10 w-12 rounded-md border text-sm flex items-center justify-center transition-colors ${
                    isAdded 
                      ? 'bg-muted border-muted text-muted-foreground cursor-default' 
                      : selectedSize === size 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border hover:border-primary'
                  }`}
                >
                  {isAdded ? <Check className="h-4 w-4" /> : size}
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button disabled={!selectedSize} onClick={handleAdd}>
              Сообщить мне
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {inWaitlist.length > 0 && (
        <p className="text-[10px] text-muted-foreground text-center">
          Вы уже ждете размеры: <span className="font-medium">{inWaitlist.join(', ')}</span>
        </p>
      )}
    </div>
  );
}
