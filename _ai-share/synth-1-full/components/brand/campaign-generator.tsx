'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { generateCampaignCreative } from '@/ai/flows/generate-campaign-creative';

const formSchema = z.object({
  productId: z.string().min(1, { message: 'Пожалуйста, выберите товар.' }),
  prompt: z.string().min(10, { message: 'Промпт должен содержать не менее 10 символов.' }),
});

export default function CampaignGenerator({ products }: { products: Product[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productId: '', prompt: '' },
  });

  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find(p => p.id === selectedProductId);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedImage(null);

    const product = products.find(p => p.id === values.productId);
    if (!product) {
        toast({ variant: 'destructive', title: 'Товар не найден' });
        setIsGenerating(false);
        return;
    }
    
    // We need to fetch the image and convert it to a data URI
    const response = await fetch(product.images[0].url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
        const base64data = reader.result as string;

        try {
            const result = await generateCampaignCreative({
                productName: product.name,
                productPrice: `₽${product.price.toLocaleString('ru-RU')}`,
                productImageDataUri: base64data,
                prompt: values.prompt,
            });

            if (result.creativeImageUrl) {
                setGeneratedImage(result.creativeImageUrl);
                toast({ title: 'Креатив успешно сгенерирован!' });
            } else {
                throw new Error('Не удалось получить изображение от AI.');
            }
        } catch (error) {
            console.error('Ошибка генерации кампании:', error);
            toast({
                variant: 'destructive',
                title: 'Ошибка генерации',
                description: 'Не удалось создать креатив. Пожалуйста, попробуйте снова.',
            });
        } finally {
            setIsGenerating(false);
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Генератор рекламных кампаний</CardTitle>
        <CardDescription>
          Используйте AI для создания уникальных рекламных креативов для ваших товаров.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Выберите товар</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите товар из вашего каталога..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

             {selectedProduct && (
                <div className="flex items-center gap-4 rounded-md border p-3 bg-muted/30">
                    <Image src={selectedProduct.images[0].url} alt={selectedProduct.name} width={64} height={64} className="rounded-md aspect-square object-cover" />
                    <div>
                        <p className="font-semibold">{selectedProduct.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedProduct.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                </div>
             )}

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Опишите вашу идею</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, осенняя распродажа в стиле минимализм" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Сгенерировать креатив
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 bg-muted/30 min-h-[300px]">
            {isGenerating && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>}
            {!isGenerating && generatedImage && (
                <div className="relative w-full aspect-[4/5]">
                    <Image src={generatedImage} alt="Сгенерированный креатив" fill className="object-contain" />
                </div>
            )}
             {!isGenerating && !generatedImage && (
                <div className="text-center text-muted-foreground">
                    <p>Здесь появится ваш креатив</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
