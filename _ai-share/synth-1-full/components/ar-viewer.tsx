
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface ArViewerDialogProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function ArViewerDialog({ product, isOpen, onOpenChange }: ArViewerDialogProps) {
    const avatarImage = PlaceHolderImages.find(img => img.id === "avatar-3d");
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        if(isOpen && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    setHasCameraPermission(true);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Ошибка доступа к камере:", err);
                    setHasCameraPermission(false);
                    toast({
                        variant: 'destructive',
                        title: 'Доступ к камере запрещен',
                        description: 'Пожалуйста, разрешите доступ к камере в настройках браузера.',
                    });
                });
        } else if (isOpen) {
            toast({
                variant: 'destructive',
                title: 'Камера не поддерживается',
                description: 'Ваш браузер не поддерживает доступ к камере.',
            });
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [isOpen, toast]);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl grid grid-cols-1 md:grid-cols-2 p-0 gap-0">
                <div className="p-8 flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold mt-2 flex items-center gap-2"><Sparkles className="h-6 w-6 text-accent" /> AR Примерка</DialogTitle>
                        <DialogDescription className="text-base">Примерьте {product.name} в дополненной реальности.</DialogDescription>
                    </DialogHeader>

                     <div className="my-6">
                        <div className="flex gap-4 items-start">
                            <div className="relative aspect-[4/5] w-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                            <Image src={product.images[0].url} alt={product.images[0].alt} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold leading-tight text-lg">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.brand}</p>
                                <p className="text-lg font-bold mt-2">{product.price.toLocaleString('ru-RU')} ₽</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 space-y-3">
                         <p className="text-sm text-muted-foreground text-center">Наведите камеру на себя, чтобы начать примерку.</p>
                         <div className="flex justify-center gap-4">
                            <Button size="lg" variant="outline">
                                <RefreshCcw className="mr-2 h-5 w-5" /> Сменить товар
                            </Button>
                            <Button size="lg">
                                <Camera className="mr-2 h-5 w-5" /> Сделать фото
                            </Button>
                        </div>
                    </div>

                </div>
                <div className="bg-secondary/50 flex items-center justify-center p-8 rounded-r-lg relative overflow-hidden aspect-[4/5] md:aspect-auto">
                    {hasCameraPermission ? (
                        <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay muted playsInline />
                    ) : (
                       <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                         <Camera className="h-16 w-16 mb-4" />
                         <p className="font-semibold">Ожидание камеры...</p>
                         <p className="text-sm">Пожалуйста, разрешите доступ.</p>
                       </div>
                    )}
                     {avatarImage && (
                        <Image
                            src={avatarImage.imageUrl}
                            alt="3D Avatar Overlay"
                            width={500}
                            height={800}
                            className="object-contain absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
                            data-ai-hint={avatarImage.imageHint}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

    