'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Progress } from '../ui/progress';

interface ABTestDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type TestState = 'idle' | 'running' | 'finished';

export function ABTestDialog({ product, isOpen, onOpenChange }: ABTestDialogProps) {
  const [variantBImage, setVariantBImage] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVariantBImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testState === 'running') {
      setProgress(0);
      const totalDuration = 4000; // 4 seconds
      const interval = 50;
      const steps = totalDuration / interval;
      let currentStep = 0;

      timer = setInterval(() => {
          currentStep++;
          const newProgress = (currentStep / steps) * 100;
          setProgress(newProgress);
          if (newProgress >= 100) {
              clearInterval(timer);
              setTestState('finished');
          }
      }, interval);
    }
    return () => clearInterval(timer);
  }, [testState]);

  const handleStartTest = () => {
    if (!variantBImage) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTestState('running');
    }, 1500);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a delay to allow for closing animation
    setTimeout(() => {
        setVariantBImage(null);
        setTestState('idle');
        setIsLoading(false);
        setProgress(0);
    }, 300);
  }

  const renderContent = () => {
    switch (testState) {
      case 'finished':
        return (
          <div>
            <DialogTitle className="text-sm font-bold">Результаты теста для "{product.name}"</DialogTitle>
            <DialogDescription className="mt-2">Тест завершен. Вариант Б показал лучшие результаты.</DialogDescription>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">Вариант A (Контроль)</p>
                  <div className="relative aspect-[4/5] w-full mt-2 rounded-md overflow-hidden bg-muted">
                    <Image src={product.images[0].url} alt="Вариант A" fill className="object-cover" sizes="250px" />
                  </div>
                   <div className="mt-4 space-y-2 text-sm">
                        <p>CTR: <span className="font-semibold">3.2%</span></p>
                        <p>Добавлений в корзину: <span className="font-semibold">1,204</span></p>
                    </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-500 bg-green-500/10">
                <CardContent className="p-4">
                   <p className="text-sm font-medium text-green-800 dark:text-green-300">Вариант Б (Победитель)</p>
                   <div className="relative aspect-[4/5] w-full mt-2 rounded-md overflow-hidden bg-muted">
                    <Image src={variantBImage!} alt="Вариант Б" fill className="object-cover" sizes="250px"/>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                        <p>CTR: <span className="font-semibold text-green-700 dark:text-green-300">4.1% (+28%)</span></p>
                        <p>Добавлений в корзину: <span className="font-semibold text-green-700 dark:text-green-300">1,541 (+28%)</span></p>
                    </div>
                </CardContent>
              </Card>
            </div>
             <DialogFooter className="mt-6">
                <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
                <Button>Применить Вариант Б</Button>
            </DialogFooter>
          </div>
        );
      case 'running':
        return (
          <>
            <DialogHeader>
                <DialogTitle className="text-sm font-bold">Тест запущен!</DialogTitle>
                <DialogDescription>Мы собираем данные. Вы можете закрыть это окно, результаты появятся здесь по завершении.</DialogDescription>
            </DialogHeader>
            <div className="py-12 text-center">
                 <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                 <p className="mt-4 text-muted-foreground">Собираем статистику...</p>
                 <Progress value={progress} className="w-full max-w-sm mx-auto mt-4" />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Закрыть</Button>
            </DialogFooter>
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">A/B Тест для "{product.name}"</DialogTitle>
              <DialogDescription>Загрузите альтернативное изображение, чтобы начать тест и сравнить его эффективность с текущим.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">Вариант A (Текущее)</p>
                  <div className="relative aspect-[4/5] w-full mt-2 rounded-md overflow-hidden bg-muted">
                    <Image src={product.images[0].url} alt="Вариант A" fill className="object-cover" sizes="250px"/>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium">Вариант Б (Новое)</p>
                  <div className="relative aspect-[4/5] w-full mt-2 rounded-md overflow-hidden bg-muted border-2 border-dashed flex items-center justify-center">
                    {variantBImage ? (
                      <Image src={variantBImage} alt="Вариант B" fill className="object-cover" sizes="250px"/>
                    ) : (
                      <label htmlFor="upload-b" className="text-center cursor-pointer text-muted-foreground p-4">
                        <Upload className="mx-auto h-8 w-8" />
                        <p className="mt-2 text-sm">Загрузить изображение</p>
                      </label>
                    )}
                    <input id="upload-b" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleClose}>Отмена</Button>
              <Button onClick={handleStartTest} disabled={!variantBImage || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                Начать тест
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl">{renderContent()}</DialogContent>
    </Dialog>
  );
}
