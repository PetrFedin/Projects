'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Handshake, Users, ArrowRight, Wand2, Loader2, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Brand, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateCollaborativeLookbook } from '@/ai/flows/generate-collaborative-lookbook';

interface CollaborationInsightsProps {
    brand: Brand;
    allProducts: Product[];
}

// Mock data, in a real app this would come from an analytics engine
const frequentlyViewedWith = {
    '1': '2', // Cashmere sweater is viewed with performance pants
    '8': '4', // Denim jacket is viewed with trench coat
};

const audienceOverlap = {
    'syntha': ['Acne Studios', 'A.P.C.', 'Jil Sander'],
}

export default function CollaborationInsights({ brand, allProducts }: CollaborationInsightsProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const { toast } = useToast();

    // Find the product to feature
    const mainProduct = allProducts.find(p => p.id === '1' && p.brand === brand.name);
    
    // Find the collaborative product based on mock data
    const collabProductId = mainProduct ? frequentlyViewedWith[mainProduct.id as keyof typeof frequentlyViewedWith] : undefined;
    const collabProduct = collabProductId ? allProducts.find(p => p.id === collabProductId) : undefined;
    
    const overlappingBrands = audienceOverlap[brand.slug as keyof typeof audienceOverlap] || [];

    const handleGenerate = async () => {
        if (!mainProduct || !collabProduct) {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Необходимые товары для генерации не найдены.' });
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            // Fetch both images and convert to data URIs
            const [res1, res2] = await Promise.all([
                fetch(mainProduct.images[0].url),
                fetch(collabProduct.images[0].url)
            ]);

            const [blob1, blob2] = await Promise.all([res1.blob(), res2.blob()]);

            const reader1 = new FileReader();
            const reader2 = new FileReader();

            const p1 = new Promise<string>(resolve => {
                reader1.onloadend = () => resolve(reader1.result as string);
                reader1.readAsDataURL(blob1);
            });
            const p2 = new Promise<string>(resolve => {
                reader2.onloadend = () => resolve(reader2.result as string);
                reader2.readAsDataURL(blob2);
            });
            
            const [uri1, uri2] = await Promise.all([p1, p2]);

            const result = await generateCollaborativeLookbook({
                productOneName: mainProduct.name,
                productOneImageDataUri: uri1,
                productTwoName: collabProduct.name,
                productTwoImageDataUri: uri2,
            });

            if (result.creativeImageUrl) {
                setGeneratedImage(result.creativeImageUrl);
                toast({ title: 'Совместный лукбук создан!' });
            } else {
                throw new Error('AI не удалось сгенерировать изображение.');
            }

        } catch (error) {
            console.error('Ошибка генерации совместного лукбука:', error);
            toast({ variant: 'destructive', title: 'Ошибка генерации', description: 'Пожалуйста, попробуйте снова.' });
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>AI-Предложение Коллаборации</CardTitle>
                        <CardDescription>Основываясь на поведении пользователей, мы определили возможность для успешной коллаборации.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mainProduct && collabProduct ? (
                            <Alert>
                                <Handshake className="h-4 w-4" />
                                <AlertTitle>Рекомендация</AlertTitle>
                                <AlertDescription>
                                    Пользователи, покупающие ваш <span className="font-semibold">{mainProduct.name}</span>, часто интересуются товаром <span className="font-semibold">{collabProduct.name}</span> от бренда <span className="font-semibold">{collabProduct.brand}</span>.
                                    <div className="flex gap-4 my-4">
                                        <div className="text-center w-32">
                                            <Image src={mainProduct.images[0].url} alt={mainProduct.name} width={100} height={125} className="rounded-md object-cover mx-auto"/>
                                            <p className="text-xs mt-1 font-semibold">{mainProduct.brand}</p>
                                        </div>
                                         <div className="flex items-center text-muted-foreground">+</div>
                                        <div className="text-center w-32">
                                            <Image src={collabProduct.images[0].url} alt={collabProduct.name} width={100} height={125} className="rounded-md object-cover mx-auto"/>
                                            <p className="text-xs mt-1 font-semibold">{collabProduct.brand}</p>
                                        </div>
                                    </div>
                                    Создайте совместный лукбук, чтобы увеличить продажи обоих товаров.
                                </AlertDescription>
                            </Alert>
                        ) : (
                             <p className="text-sm text-muted-foreground">Нет данных для генерации предложения.</p>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Сгенерировать совместный лукбук</CardTitle>
                        <CardDescription>Используйте AI, чтобы создать образ, сочетающий два товара от разных брендов.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 bg-muted/30 min-h-[300px]">
                            {isGenerating && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>}
                            {!isGenerating && generatedImage && (
                                <div className="relative w-full aspect-[4/5]">
                                    <Image src={generatedImage} alt="Сгенерированный лукбук" fill className="object-contain" />
                                </div>
                            )}
                            {!isGenerating && !generatedImage && (
                                <div className="text-center text-muted-foreground">
                                    <p>Здесь появится ваш креатив</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-4">
                             <p className="text-sm text-muted-foreground">Нажмите "Сгенерировать", чтобы AI создал образ с участием вашего Кашемирового свитера и Классических брюк от A.P.C.</p>
                             <Button onClick={handleGenerate} disabled={isGenerating || !mainProduct || !collabProduct}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                Сгенерировать
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Пересечение аудиторий</CardTitle>
                        <CardDescription>Бренды, на которые также подписаны ваши фолловеры.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {overlappingBrands.map(brandName => (
                            <div key={brandName} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={`https://picsum.photos/seed/${brandName.toLowerCase()}/40/40`} />
                                        <AvatarFallback>{brandName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-sm">{brandName}</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                    Подробнее <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
