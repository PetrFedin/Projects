'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from './ui/button';
import { Camera, RefreshCcw, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ArViewerDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ArViewerDialog({ product, isOpen, onOpenChange }: ArViewerDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen) {
      const getCameraPermission = async () => {
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);

            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } else {
            toast({
              variant: 'destructive',
              title: 'Камера не поддерживается',
              description: 'Ваш браузер не поддерживает доступ к камере.',
            });
          }
        } catch (error) {
          console.error('Ошибка доступа к камере:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Доступ к камере запрещен',
            description: 'Пожалуйста, разрешите доступ к камере в настройках браузера.',
          });
        }
      };
      getCameraPermission();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const mediaStream = videoRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      } else if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="grid grid-cols-1 gap-0 p-0 sm:max-w-4xl md:grid-cols-2">
        <div className="flex flex-col p-4">
          <DialogHeader>
            <DialogTitle className="mt-2 flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-6 w-6 text-accent" /> AR Примерка
            </DialogTitle>
            <DialogDescription className="text-base">
              Примерьте {product.name} в дополненной реальности.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6">
            <div className="flex items-start gap-3">
              <div className="relative aspect-[4/5] w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <p className="mt-2 text-sm font-bold">{product.price.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Наведите камеру на себя, чтобы начать примерку.
            </p>
            <div className="flex justify-center gap-3">
              <Button size="lg" variant="outline">
                <RefreshCcw className="mr-2 h-5 w-5" /> Сменить товар
              </Button>
              <Button size="lg">
                <Camera className="mr-2 h-5 w-5" /> Сделать фото
              </Button>
            </div>
          </div>
        </div>
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-r-lg bg-secondary/50 p-4 md:aspect-auto">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
            autoPlay
            muted
            playsInline
          />

          {!hasCameraPermission && (
            <div className="z-10 rounded-lg bg-background/80 p-4">
              <Alert variant="destructive">
                <AlertTitle>Требуется доступ к камере</AlertTitle>
                <AlertDescription>
                  Пожалуйста, разрешите доступ к камере в вашем браузере.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
