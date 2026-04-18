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
import { Skeleton } from './ui/skeleton';
import { ArViewerDialog as ArViewerDialogComponent } from './ar-viewer-dialog';

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

  return <ArViewerDialogComponent product={product} isOpen={isOpen} onOpenChange={onOpenChange} />;
}
