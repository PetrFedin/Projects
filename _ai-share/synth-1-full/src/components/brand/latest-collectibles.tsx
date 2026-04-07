
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Loader2, Gift, ShoppingBag, Info } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface LatestCollectiblesProps {
    isLoading: boolean;
    items: string[];
    productName?: string;
    collectionName?: string;
}

export default function LatestCollectibles({ isLoading, items, productName, collectionName }: LatestCollectiblesProps) {
    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Последняя коллекция</CardTitle>
                    <CardDescription>Предпросмотр вашей новой цифровой коллекции.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[250px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (items.length === 0) {
        return (
             <Card className="border-dashed">
                <CardHeader>
                    <CardTitle>Последняя коллекция</CardTitle>
                    <CardDescription>Предпросмотр вашей новой цифровой коллекции.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[250px] text-center text-muted-foreground">
                    <p>Здесь появятся ваши<br/>сгенерированные активы</p>
                </CardContent>
            </Card>
        )
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Коллекция: "{collectionName}"</CardTitle>
                <CardDescription>Основано на товаре: {productName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {items.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group bg-muted/50">
                             <Image src={src} alt={`Collectible ${index + 1}`} fill className="object-contain p-2" sizes="150px" />
                             <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button variant="outline" size="sm">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                Купить
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Пользователи смогут купить этот NFT</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button variant="outline" size="sm">
                                                <Gift className="mr-2 h-4 w-4" />
                                                Подарить
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Пользователи смогут подарить этот NFT</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                             </div>
                        </div>
                    ))}
                </div>
                 <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4 p-2 bg-muted rounded-md">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>Это предпросмотр того, как пользователи будут взаимодействовать с вашей коллекцией на публичной странице бренда.</p>
                </div>
            </CardContent>
        </Card>
    )
}
