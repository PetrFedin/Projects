'use client';

import { useState } from 'react';
import { useUIState } from '@/providers/ui-state';
import { Button } from './ui/button';
import { X, Scale, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import ProductCard from './product-card';

export default function ComparisonPanel() {
  const {
    comparisonList,
    toggleComparisonItem,
    clearComparisonList,
    isComparisonOpen,
    setIsComparisonOpen,
    saveComparison,
  } = useUIState();
  const [isSaving, setIsSaving] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const { toast } = useToast();

  if (comparisonList.length === 0 && !isComparisonOpen) {
    return null;
  }

  const openModal = () => setIsComparisonOpen(true);

  const handleSave = () => {
    if (comparisonName.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Введите название',
        description: 'Пожалуйста, дайте название вашему сравнению.',
      });
      return;
    }
    saveComparison(comparisonName);
    toast({
      title: 'Сравнение сохранено',
      description: `Список "${comparisonName}" добавлен в ваш профиль.`,
    });
    setIsSaving(false);
    setComparisonName('');
  };

  return (
    <>
      {/* Bottom Bar Trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-2xl duration-500 animate-in slide-in-from-bottom-full">
        <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Scale className="h-5 w-5" />
                Сравнение ({comparisonList.length}/4)
              </h3>
              <div className="flex -space-x-4">
                {comparisonList.map((p) => (
                  <div
                    key={p.id}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                  >
                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={openModal} disabled={comparisonList.length < 1}>
                Сравнить
              </Button>
              <Button variant="ghost" size="sm" onClick={clearComparisonList}>
                <X className="mr-1 h-4 w-4" />
                Очистить
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Dialog */}
      <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
        <DialogContent className="flex h-[90vh] max-w-7xl flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">Сравнение товаров</DialogTitle>
            <DialogDescription>Сравните до 4 товаров бок о бок.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="-mx-6 flex-1">
            <div className="grid grid-cols-1 gap-3 px-6 sm:grid-cols-2 lg:grid-cols-4">
              {comparisonList.map((product) => (
                <div key={product.id} className="flex flex-col rounded-lg border">
                  <div className="relative p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 z-10 h-7 w-7 bg-background/50 backdrop-blur-sm"
                      onClick={() => toggleComparisonItem(product)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <ProductCard product={product} />
                  </div>
                  <div className="space-y-3 border-t p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Категория</span>
                      <span className="font-medium">{product.subcategory || product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сезон</span>
                      <span className="font-medium">{product.season}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Состав</span>
                      <span className="max-w-[150px] truncate font-medium">{product.material}</span>
                    </div>
                  </div>
                </div>
              ))}
              {[...Array(Math.max(0, 2 - comparisonList.length))].map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center text-muted-foreground"
                >
                  <Scale className="mb-4 h-10 w-10" />
                  <h4 className="font-semibold">Добавьте товар для сравнения</h4>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="items-center border-t pt-4">
            {isSaving ? (
              <div className="flex w-full gap-2 sm:w-auto">
                <Input
                  placeholder="Название для сравнения..."
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  className="sm:w-64"
                />
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
                <Button variant="ghost" onClick={() => setIsSaving(false)}>
                  Отмена
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsSaving(true)}>
                <Save className="mr-2 h-4 w-4" /> Сохранить сравнение
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setIsComparisonOpen(false)}
              className="sm:ml-auto"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
