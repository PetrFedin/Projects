'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Wand2, Loader2, Bot, Upload, Paperclip, X, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/auth-provider';
import { chatResponseClient, outfitPreviewClient } from '@/lib/ai-client/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { findMatchingProducts } from '@/lib/ai-product-matcher';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { useUIState } from '@/providers/ui-state';
import { ShoppingCart } from 'lucide-react';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  image?: string | null;
  isLoading?: boolean;
  recommendedProducts?: Product[];
};

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Пожалуйста, введите сообщение.',
  }),
  userImage: z.any().optional(),
});

export default function AiStylist() {
  const { user } = useAuth();
  const userId = user?.uid;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  useEffect(() => {
    if (isOpen) {
      // Initial message from bot when dialog opens
      setMessages([
        {
          id: 'init',
          type: 'bot',
          text: 'Привет! Я ваш AI-стилист. Опишите образ, который вы ищете, или загрузите фото для примерки.',
        },
      ]);
      setIsBotLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isBotLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUserImagePreview(result);
        form.setValue('userImage', result);
        toast({ title: 'Фото загружено', description: 'Теперь опишите одежду для примерки.' });
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: values.prompt,
      image: userImagePreview,
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    setUserImagePreview(null);
    setIsBotLoading(true);

    try {
      // 1. Get a conversational response from the bot
      const chatResponse = await chatResponseClient({
        query: values.prompt,
        history: messages.map((msg) => ({
          role: msg.type === 'user' ? ('user' as const) : ('model' as const),
          content: msg.text,
        })),
        userId,
      });

      const botResponseText = chatResponse.response || 'Сейчас посмотрим...';
      const botMessageId = `bot-${Date.now()}`;
      const botMessage: Message = {
        id: botMessageId,
        type: 'bot',
        text: botResponseText,
        isLoading: true,
      };
      setMessages((prev) => [...prev, botMessage]);

      // 2. Decide which image generation flow to run
      const imageResult = await outfitPreviewClient({
        prompt: values.prompt,
        userImage: values.userImage || undefined,
      });

      if (!imageResult?.generatedOutfitImage) {
        throw new Error('Не удалось сгенерировать изображение.');
      }

      // 3. Find matching products from catalog
      const recommendedProducts = await findMatchingProducts(values.prompt, 4);

      // 4. Update the bot's message with the generated image and products
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                image: imageResult.generatedOutfitImage,
                isLoading: false,
                recommendedProducts:
                  recommendedProducts.length > 0 ? recommendedProducts : undefined,
              }
            : m
        )
      );
    } catch (error) {
      console.error('Ошибка AI стилиста:', error);
      const errorText = 'К сожалению, у меня возникла ошибка. Попробуйте еще раз.';
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, type: 'bot', text: errorText }]);
    } finally {
      setIsBotLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setMessages([]);
      setUserImagePreview(null);
      setIsBotLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group fixed bottom-6 right-6 h-12 w-12 rounded-full border-2 border-border bg-card shadow-2xl"
              aria-label="Открыть AI стилиста"
              onClick={() => setIsOpen(true)}
            >
              <Avatar className="h-full w-full transition-transform group-hover:scale-110">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400"
                  alt="AI Стилист"
                />
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-4"></div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="mb-2">
            <p>AI Стилист 24/7</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="flex h-[80vh] flex-col p-0 sm:max-w-2xl">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="flex items-center gap-2 font-headline text-base">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400"
                alt="AI Стилист"
              />
              <AvatarFallback>
                <Bot />
              </AvatarFallback>
            </Avatar>
            AI Стилист
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-6 px-4 py-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex items-start gap-3', msg.type === 'user' && 'justify-end')}
              >
                {msg.type === 'bot' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400"
                      alt="AI Стилист"
                    />
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-sm space-y-2 md:max-w-md',
                    msg.type === 'user' && 'text-right'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-lg p-3',
                      msg.type === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  </div>
                  {msg.image && (
                    <div className="relative flex aspect-[4/5] w-full items-center justify-center rounded-md border bg-secondary">
                      <Image
                        src={msg.image}
                        alt="Сгенерированный образ"
                        fill
                        className="rounded-md object-contain"
                      />
                    </div>
                  )}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Рекомендуемые товары:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {msg.recommendedProducts.map((product) => (
                          <ProductRecommendationCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}
                  {msg.isLoading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isBotLoading && messages[messages.length - 1].type === 'user' && (
              <div className={cn('flex items-start gap-3')}>
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400"
                    alt="AI Стилист"
                  />
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t bg-background p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              {userImagePreview && (
                <div className="absolute bottom-16 left-2 rounded-md border bg-card p-1 shadow-lg">
                  <div className="relative h-12 w-12">
                    <Image
                      src={userImagePreview}
                      alt="Превью"
                      fill
                      className="rounded-sm object-cover"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-muted"
                      onClick={() => setUserImagePreview(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="С чем вам помочь?"
                          {...field}
                          className="pr-20"
                          autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                          </Button>
                          <Button type="submit" disabled={isBotLoading} size="icon" variant="ghost">
                            <CornerDownLeft className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProductRecommendationCard({ product }: { product: Product }) {
  const { addCartItem } = useUIState();

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border bg-card transition-colors hover:border-accent">
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          <p className="truncate font-semibold">{product.name}</p>
          <p className="text-xs text-white/80">{product.price.toLocaleString('ru-RU')} ₽</p>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            addCartItem(product, product.sizes?.[0]?.name || 'One Size', 1);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}
