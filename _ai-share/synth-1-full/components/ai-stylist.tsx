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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { tryOnOutfit } from '@/ai/flows/try-on-outfit';
import { generateOutfitFromPrompt } from '@/ai/flows/generate-outfit-from-prompt';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


type Message = {
    id: string;
    type: 'user' | 'bot';
    text: string;
    image?: string | null;
    isLoading?: boolean;
}

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Пожалуйста, введите сообщение.',
  }),
  userImage: z.any().optional(),
});

export default function AiStylist() {
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
            { id: 'init', type: 'bot', text: "Привет! Я ваш AI-стилист. Опишите образ, который вы ищете, или загрузите фото для примерки." }
        ]);
        setIsBotLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
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
        toast({ title: 'Фото загружено', description: 'Теперь опишите одежду для примерки.'})
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { id: `user-${Date.now()}`, type: 'user', text: values.prompt, image: userImagePreview };
    setMessages(prev => [...prev, userMessage]);
    form.reset();
    setUserImagePreview(null);
    setIsBotLoading(true);

    try {
      // 1. Get a conversational response from the bot
      const chatResponse = await generateChatResponse({ query: values.prompt });

      const botResponseText = chatResponse.response || 'Сейчас посмотрим...';
      const botMessageId = `bot-${Date.now()}`;
      const botMessage: Message = { id: botMessageId, type: 'bot', text: botResponseText, isLoading: true };
      setMessages(prev => [...prev, botMessage]);

      // 2. Decide which image generation flow to run
      let imageResult;
      if (values.userImage) {
        // Image-to-Image: "Try on" flow
        imageResult = await tryOnOutfit({ 
          prompt: values.prompt,
          userPhotoDataUri: values.userImage,
        });
      } else {
        // Text-to-Image: "Generate inspiration" flow
        imageResult = await generateOutfitFromPrompt({
          prompt: `fashion photography of a complete outfit for a person, based on the following description: ${values.prompt}. The image should be a full-body shot against a clean, minimalist background.`,
        });
      }

      if (!imageResult?.generatedOutfitImage) {
          throw new Error('Не удалось сгенерировать изображение.');
      }
      
      // 3. Update the bot's message with the generated image
      setMessages(prev => prev.map(m => 
          m.id === botMessageId 
          ? { ...m, image: imageResult.generatedOutfitImage, isLoading: false } 
          : m
      ));

    } catch (error) {
      console.error('Ошибка AI стилиста:', error);
      const errorText = 'К сожалению, у меня возникла ошибка. Попробуйте еще раз.';
       setMessages(prev => [...prev, {id: `err-${Date.now()}`, type: 'bot', text: errorText}]);
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-card border-2 border-border group"
                aria-label="Открыть AI стилиста"
                onClick={() => setIsOpen(true)}
            >
                <Avatar className="h-full w-full group-hover:scale-110 transition-transform">
                    <AvatarImage src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400" alt="AI Стилист"/>
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                 <div className="absolute inset-0 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-card group-hover:ring-4 transition-all duration-300"></div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="mb-2">
            <p>AI Стилист 24/7</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="font-headline text-xl flex items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400" alt="AI Стилист"/>
                <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            AI Стилист
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="px-4 py-2 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-start gap-3", msg.type === 'user' && "justify-end")}>
                        {msg.type === 'bot' && (
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400" alt="AI Стилист"/>
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-sm md:max-w-md space-y-2", msg.type === 'user' && "text-right")}>
                           <div className={cn("p-3 rounded-lg", msg.type === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                             <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                           </div>
                           {msg.image && (
                                <div className="relative aspect-[4/5] w-full rounded-md border bg-secondary flex items-center justify-center">
                                    <Image src={msg.image} alt="Сгенерированный образ" fill className="object-contain rounded-md" />
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
                {isBotLoading && messages[messages.length -1].type === 'user' && (
                     <div className={cn("flex items-start gap-3")}>
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src="https://images.unsplash.com/photo-1614035032449-3c8259392b95?w=400" alt="AI Стилист"/>
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-background">
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                 {userImagePreview && (
                    <div className="absolute bottom-16 left-2 p-1 bg-card border rounded-md shadow-lg">
                        <div className="relative w-16 h-16">
                            <Image src={userImagePreview} alt="Превью" fill className="object-cover rounded-sm" />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute -top-2 -right-2 h-6 w-6 bg-muted rounded-full"
                                onClick={() => setUserImagePreview(null)}
                            >
                                <X className="h-3 w-3"/>
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
                                autoComplete='off'
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
