'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { 
    Wand2, Loader2, Instagram, Facebook, 
    Send, Sparkles, Layout, Target, 
    BarChart3, Zap, Download, Share2,
    CheckCircle2, Info, ChevronRight, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { generateCampaignCreative } from '@/ai/flows/generate-campaign-creative';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  productId: z.string().min(1, { message: 'Пожалуйста, выберите товар.' }),
  prompt: z.string().min(10, { message: 'Промпт должен содержать не менее 10 символов.' }),
  style: z.string().default('minimalism'),
});

const AD_STYLES = [
    { id: 'minimalism', name: 'Minimalism', desc: 'Чистый фон, акцент на продукте', icon: Layout },
    { id: 'cyberpunk', name: 'Cyberpunk 2077', desc: 'Неон, ночной город, технологичность', icon: Zap },
    { id: 'vogue', name: 'Vogue Editorial', desc: 'Высокая мода, студийный свет', icon: Sparkles },
    { id: 'streetwear', name: 'Street Culture', desc: 'Урбан, граффити, динамика', icon: Target }
];

export default function CampaignGenerator({ products }: { products: Product[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState('minimalism');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productId: '', prompt: '', style: 'minimalism' },
  });

  const selectedProductId = form.watch('productId');
  const selectedProduct = products.find(p => p.id === selectedProductId);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedImage(null);
    setShowAnalytics(false);

    const product = products.find(p => p.id === values.productId);
    if (!product) {
        toast({ variant: 'destructive', title: 'Товар не найден' });
        setIsGenerating(false);
        return;
    }
    
    try {
        // Simulate AI process
        setTimeout(async () => {
            const result = await generateCampaignCreative({
                productName: product.name,
                productPrice: `₽${product.price.toLocaleString('ru-RU')}`,
                productImageDataUri: product.images[0].url,
                prompt: `${values.prompt} in ${values.style} style`,
            });

            if (result.creativeImageUrl) {
                setGeneratedImage(result.creativeImageUrl);
                setShowAnalytics(true);
                toast({ title: 'Креатив успешно сгенерирован!' });
            }
            setIsGenerating(false);
        }, 2000);
    } catch (error) {
        console.error('Ошибка генерации кампании:', error);
        toast({
            variant: 'destructive',
            title: 'Ошибка генерации',
            description: 'Не удалось создать креатив. Пожалуйста, попробуйте снова.',
        });
        setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
                <Badge className="bg-blue-600 text-white border-none mb-3 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                    AI Marketing Suite
                </Badge>
                <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none italic">
                    Campaign <span className="text-blue-600">Generator</span>
                </h1>
                <p className="mt-4 text-slate-500 font-medium max-w-xl">
                    Создавайте рекламные креативы за секунды. Наш ИИ адаптирует фото товара под любой стиль и подготовит форматы для соцсетей.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 font-bold uppercase tracking-widest text-[9px]">
                    <History className="mr-2 h-3.5 w-3.5" /> История
                </Button>
            </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-3 items-start">
            {/* Left: Configuration */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50">
                        <CardTitle className="text-base font-black uppercase tracking-tight">Параметры кампании</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="productId"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Выберите товар</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                                            <SelectValue placeholder="Выберите товар из каталога..." />
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

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">2. Стиль креатива</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {AD_STYLES.map(style => (
                                            <button
                                                key={style.id}
                                                type="button"
                                                onClick={() => {
                                                    setCurrentStyle(style.id);
                                                    form.setValue('style', style.id);
                                                }}
                                                className={cn(
                                                    "p-4 rounded-2xl border-2 text-left transition-all group",
                                                    currentStyle === style.id 
                                                        ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100" 
                                                        : "border-slate-100 hover:border-slate-200 bg-white"
                                                )}
                                            >
                                                <style.icon className={cn(
                                                    "h-5 w-5 mb-3 transition-transform group-hover:scale-110",
                                                    currentStyle === style.id ? "text-blue-600" : "text-slate-400"
                                                )} />
                                                <p className="text-[10px] font-black uppercase tracking-tight mb-1">{style.name}</p>
                                                <p className="text-[9px] font-medium text-slate-400 leading-tight">{style.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">3. Описание идеи (Промпт)</FormLabel>
                                        <FormControl>
                                            <textarea 
                                                placeholder="Опишите желаемую атмосферу, освещение или фон..." 
                                                className="w-full min-h-[100px] p-4 bg-slate-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    disabled={isGenerating}
                                    className="w-full h-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] shadow-xl transition-all hover:bg-blue-600 hover:-translate-y-1"
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Генерируем...</>
                                    ) : (
                                        <><Wand2 className="mr-2 h-4 w-4" /> Сгенерировать креатив</>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            {/* Right: Results & Analytics */}
            <div className="lg:col-span-7 space-y-6">
                <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                <Image src="/logo-icon.svg" alt="Syntha" width={24} height={24} className="brightness-0 invert" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Preview</p>
                                <h3 className="text-sm font-black uppercase tracking-tight">AI Generation Canvas</h3>
                            </div>
                        </div>
                        {generatedImage && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-lg h-9 border-slate-200">
                                    <Download className="h-3.5 w-3.5 mr-2" /> .JPG
                                </Button>
                                <Button size="sm" className="rounded-lg h-9 bg-blue-600 hover:bg-blue-700">
                                    <Share2 className="h-3.5 w-3.5 mr-2" /> Export
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <CardContent className="flex-1 flex flex-col p-0 relative">
                        {isGenerating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 p-4 text-center">
                                <div className="w-64 space-y-6">
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 animate-progress-fast" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 animate-pulse">ИИ анализирует фото товара и генерирует фон...</p>
                                </div>
                            </div>
                        ) : generatedImage ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                                <div className="relative aspect-[4/5] bg-slate-900 border-r border-slate-100">
                                    <Image src={generatedImage} alt="Creative" fill className="object-cover" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <Badge className="bg-blue-600 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 shadow-lg">Final Asset</Badge>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Форматы для экспорта</h4>
                                        <div className="space-y-3">
                                            {[
                                                { id: 'insta', label: 'Instagram Stories', size: '1080x1920', icon: Instagram },
                                                { id: 'feed', label: 'FB/Insta Feed', size: '1080x1080', icon: Layout },
                                                { id: 'tg', label: 'Telegram Ad', size: '1200x628', icon: Send }
                                            ].map(format => (
                                                <div key={format.id} className="p-4 rounded-xl border border-slate-100 flex items-center gap-3 hover:border-blue-200 transition-colors cursor-pointer group">
                                                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <format.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{format.label}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{format.size}</p>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-blue-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {showAnalytics && (
                                        <div className="space-y-6 pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-blue-600" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">Прогноз эффективности (AI)</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'CTR Score', value: 84, color: 'bg-emerald-500' },
                                                    { label: 'Audience Match', value: 92, color: 'bg-blue-500' },
                                                    { label: 'Conversion Lift', value: 15, color: 'bg-amber-500', isPerc: true }
                                                ].map(metric => (
                                                    <div key={metric.label} className="space-y-2">
                                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                            <span>{metric.label}</span>
                                                            <span className="text-slate-900">{metric.isPerc ? '+' : ''}{metric.value}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                                            <div className={cn("h-full", metric.color)} style={{ width: `${metric.value}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed">
                                                *Прогноз основан на исторических данных похожих кампаний в стиле "{AD_STYLES.find(s => s.id === currentStyle)?.name}".
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center opacity-40">
                                <div className="h-24 w-24 rounded-xl bg-slate-50 flex items-center justify-center mb-8">
                                    <Sparkles className="h-10 w-10 text-slate-200" />
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-tight text-slate-300">Холст пуст</h2>
                                <p className="text-slate-400 mt-4 max-w-sm font-medium text-sm">Настройте параметры слева и нажмите «Сгенерировать», чтобы создать свой первый рекламный креатив.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="bg-slate-900 p-4 rounded-xl text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                    <Zap className="absolute -right-4 -top-4 h-32 w-32 text-white opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                            <Target className="h-7 w-7" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight leading-tight italic">Direct Export to Ads Manager</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Опубликуйте кампанию в Facebook/Instagram в 1 клик</p>
                        </div>
                    </div>
                    <Button className="relative z-10 rounded-xl bg-white text-slate-900 font-black uppercase tracking-widest text-[9px] h-12 px-8 hover:bg-slate-100 shadow-xl">
                        Подключить API <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
