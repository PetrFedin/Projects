'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Gem, Loader2, Sparkles } from 'lucide-react';
import { campaignCreativeClient } from '@/lib/ai-client/api';
import LatestCollectibles from './latest-collectibles';

const formSchema = z.object({
  productId: z.string().min(1, { message: 'Пожалуйста, выберите товар.' }),
  collectionName: z.string().min(3, { message: 'Название должно содержать не менее 3 символов.' }),
});

export function DigitalCollectiblesCreator({ products }: { products: Product[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productId: '', collectionName: 'Иконы бренда' },
  });

  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedProduct) return;
    setIsGenerating(true);
    setGeneratedItems([]);

    try {
      const response = await fetch(selectedProduct.images[0].url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async () => {
        const base64data = reader.result as string;

        const generationPromises = [
          'pop art style',
          'pixel art style',
          'holographic foil style',
          'vintage blueprint style',
        ].map((style) =>
          campaignCreativeClient({
            productName: selectedProduct.name,
            productPrice: '',
            productImageDataUri: base64data,
            prompt: `A digital collectible card of a fashion item. ${style}. Remove all text.`,
          })
        );

        const results = await Promise.all(generationPromises);
        const imageUrls = results.map((r) => r.creativeImageUrl).filter(Boolean) as string[];

        if (imageUrls.length > 0) {
          setGeneratedItems(imageUrls);
          toast({ title: 'Коллекция успешно создана!' });
        } else {
          throw new Error('AI не смог сгенерировать изображения.');
        }
      };
    } catch (error) {
      console.error('Ошибка генерации коллекции:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать коллекцию. Попробуйте снова.',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card className="border-accent/50 bg-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem /> Создатель цифровых коллекций
        </CardTitle>
        <CardDescription>
          Превратите ваши товары в эксклюзивные цифровые активы (NFT), которые клиенты смогут
          покупать, коллекционировать и дарить.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. Выберите товар-основу</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите товар..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedProduct && (
                  <div className="flex items-center gap-3 rounded-md border bg-card/50 p-3">
                    <Image
                      src={selectedProduct.images[0].url}
                      alt={selectedProduct.name}
                      width={64}
                      height={64}
                      className="aspect-square rounded-md object-cover"
                      sizes="64px"
                    />
                    <div>
                      <p className="font-semibold">{selectedProduct.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProduct.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="collectionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Название коллекции</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип коллекции..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Иконы бренда">Иконы бренда</SelectItem>
                          <SelectItem value="Лимитированный дроп">Лимитированный дроп</SelectItem>
                          <SelectItem value="Арт-коллаборация">Арт-коллаборация</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isGenerating || !selectedProduct}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Выпустить коллекцию
                </Button>
              </form>
            </Form>
          </div>
          <LatestCollectibles
            isLoading={isGenerating}
            items={generatedItems}
            productName={selectedProduct?.name}
            collectionName={form.getValues('collectionName')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
