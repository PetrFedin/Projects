'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Video, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { generateSocialVideo } from '@/ai/flows/generate-social-video';

const formSchema = z.object({
  productId: z.string().min(1, { message: 'Пожалуйста, выберите товар.' }),
  prompt: z.string().min(5, { message: 'Промпт должен содержать не менее 5 символов.' }),
});

export default function SocialVideoGenerator({ products }: { products: Product[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productId: '', prompt: 'upbeat, trendy, urban style' },
  });

  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedVideoUrl(null);

    const product = products.find((p) => p.id === values.productId);
    if (!product) {
      toast({ variant: 'destructive', title: 'Товар не найден' });
      setIsGenerating(false);
      return;
    }

    const response = await fetch(product.images[0].url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;

      try {
        toast({
          title: 'Начинаем генерацию видео...',
          description: 'Это может занять несколько минут.',
        });
        const result = await generateSocialVideo({
          productName: product.name,
          productImageDataUri: base64data,
          prompt: values.prompt,
        });

        if (result.videoUrl) {
          setGeneratedVideoUrl(result.videoUrl);
          toast({ title: 'Видео для соцсетей готово!' });
        } else {
          throw new Error('Не удалось получить видео от AI.');
        }
      } catch (error) {
        console.error('Ошибка генерации видео:', error);
        toast({
          variant: 'destructive',
          title: 'Ошибка генерации',
          description: 'Не удалось создать видео. Пожалуйста, попробуйте снова.',
        });
      } finally {
        setIsGenerating(false);
      }
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Генератор видео для соцсетей</CardTitle>
        <CardDescription>
          Создавайте короткие видеоролики для TikTok, Reels и Shorts, используя AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Выберите товар для видео</FormLabel>
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
                <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                  <Image
                    src={selectedProduct.images[0].url}
                    alt={selectedProduct.name}
                    width={64}
                    height={64}
                    className="aspect-square rounded-md object-cover"
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
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Опишите стиль видео</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, динамичный, городской стиль, неон" {...field} />
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
                Сгенерировать видео
              </Button>
            </form>
          </Form>
        </div>
        <div className="aspect-w-9 aspect-h-12 flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-4">
          {isGenerating && (
            <div className="text-center text-muted-foreground">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-2">Генерация видео...</p>
              <p className="text-xs">Это может занять до минуты.</p>
            </div>
          )}
          {!isGenerating && generatedVideoUrl && (
            <video
              src={generatedVideoUrl}
              controls
              autoPlay
              loop
              muted
              className="h-full w-full rounded-md object-contain"
            />
          )}
          {!isGenerating && !generatedVideoUrl && (
            <div className="text-center text-muted-foreground">
              <Video className="mx-auto mb-2 h-10 w-10" />
              <p>Здесь появится ваше видео</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
