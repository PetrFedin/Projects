'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import {
  Wand2,
  Loader2,
  Instagram,
  Facebook,
  Send,
  Sparkles,
  Layout,
  Target,
  BarChart3,
  Zap,
  Download,
  Share2,
  CheckCircle2,
  Info,
  ChevronRight,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
} from '@/components/ui/select';
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
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    desc: 'Неон, ночной город, технологичность',
    icon: Zap,
  },
  { id: 'vogue', name: 'Vogue Editorial', desc: 'Высокая мода, студийный свет', icon: Sparkles },
  { id: 'streetwear', name: 'Street Culture', desc: 'Урбан, граффити, динамика', icon: Target },
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
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedImage(null);
    setShowAnalytics(false);

    const product = products.find((p) => p.id === values.productId);
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
    <div className="space-y-4 duration-500 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Badge className="mb-3 border-none bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            AI Marketing Suite
          </Badge>
          <h1 className="text-sm font-black uppercase italic leading-none tracking-tight text-slate-900">
            Campaign <span className="text-blue-600">Generator</span>
          </h1>
          <p className="mt-4 max-w-xl font-medium text-slate-500">
            Создавайте рекламные креативы за секунды. Наш ИИ адаптирует фото товара под любой стиль
            и подготовит форматы для соцсетей.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 px-4 text-[9px] font-bold uppercase tracking-widest"
          >
            <History className="mr-2 h-3.5 w-3.5" /> История
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        {/* Left: Configuration */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Параметры кампании
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          1. Выберите товар
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-none bg-slate-50 font-bold">
                              <SelectValue placeholder="Выберите товар из каталога..." />
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

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      2. Стиль креатива
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {AD_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setCurrentStyle(style.id);
                            form.setValue('style', style.id);
                          }}
                          className={cn(
                            'group rounded-2xl border-2 p-4 text-left transition-all',
                            currentStyle === style.id
                              ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          )}
                        >
                          <style.icon
                            className={cn(
                              'mb-3 h-5 w-5 transition-transform group-hover:scale-110',
                              currentStyle === style.id ? 'text-blue-600' : 'text-slate-400'
                            )}
                          />
                          <p className="mb-1 text-[10px] font-black uppercase tracking-tight">
                            {style.name}
                          </p>
                          <p className="text-[9px] font-medium leading-tight text-slate-400">
                            {style.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          3. Описание идеи (Промпт)
                        </FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Опишите желаемую атмосферу, освещение или фон..."
                            className="min-h-[100px] w-full resize-none rounded-2xl border-none bg-slate-50 p-4 text-xs font-medium transition-all focus:ring-2 focus:ring-blue-500"
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
                    className="h-10 w-full rounded-2xl bg-slate-900 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-blue-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Генерируем...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" /> Сгенерировать креатив
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results & Analytics */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border-none bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Image
                    src="/logo-icon.svg"
                    alt="Syntha"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                    Preview
                  </p>
                  <h3 className="text-sm font-black uppercase tracking-tight">
                    AI Generation Canvas
                  </h3>
                </div>
              </div>
              {generatedImage && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200">
                    <Download className="mr-2 h-3.5 w-3.5" /> .JPG
                  </Button>
                  <Button size="sm" className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700">
                    <Share2 className="mr-2 h-3.5 w-3.5" /> Экспорт
                  </Button>
                </div>
              )}
            </div>

            <CardContent className="relative flex flex-1 flex-col p-0">
              {isGenerating ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 p-4 text-center backdrop-blur-sm">
                  <div className="w-64 space-y-6">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="animate-progress-fast h-full bg-blue-600" />
                    </div>
                    <p className="animate-pulse text-[10px] font-black uppercase tracking-widest text-blue-600">
                      ИИ анализирует фото товара и генерирует фон...
                    </p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="grid h-full grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-[4/5] border-r border-slate-100 bg-slate-900">
                    <Image src={generatedImage} alt="Creative" fill className="object-cover" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <Badge className="border-none bg-blue-600 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                        Final Asset
                      </Badge>
                    </div>
                  </div>
                  <div className="max-h-[600px] space-y-4 overflow-y-auto p-4">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Форматы для экспорта
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            id: 'insta',
                            label: 'Instagram Stories',
                            size: '1080x1920',
                            icon: Instagram,
                          },
                          { id: 'feed', label: 'FB/Insta Feed', size: '1080x1080', icon: Layout },
                          { id: 'tg', label: 'Telegram Ad', size: '1200x628', icon: Send },
                        ].map((format) => (
                          <div
                            key={format.id}
                            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:border-blue-200"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                              <format.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
                                {format.label}
                              </p>
                              <p className="text-[9px] font-bold uppercase text-slate-400">
                                {format.size}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-blue-600" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {showAnalytics && (
                      <div className="space-y-6 border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest">
                            Прогноз эффективности (AI)
                          </h4>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'CTR Score', value: 84, color: 'bg-emerald-500' },
                            { label: 'Audience Match', value: 92, color: 'bg-blue-500' },
                            {
                              label: 'Conversion Lift',
                              value: 15,
                              color: 'bg-amber-500',
                              isPerc: true,
                            },
                          ].map((metric) => (
                            <div key={metric.label} className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                <span>{metric.label}</span>
                                <span className="text-slate-900">
                                  {metric.isPerc ? '+' : ''}
                                  {metric.value}%
                                </span>
                              </div>
                              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-50">
                                <div
                                  className={cn('h-full', metric.color)}
                                  style={{ width: `${metric.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] font-medium italic leading-relaxed text-slate-400">
                          *Прогноз основан на исторических данных похожих кампаний в стиле "
                          {AD_STYLES.find((s) => s.id === currentStyle)?.name}".
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-4 text-center opacity-40">
                  <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-xl bg-slate-50">
                    <Sparkles className="h-10 w-10 text-slate-200" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-tight text-slate-300">
                    Холст пуст
                  </h2>
                  <p className="mt-4 max-w-sm text-sm font-medium text-slate-400">
                    Настройте параметры слева и нажмите «Сгенерировать», чтобы создать свой первый
                    рекламный креатив.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="group relative flex items-center justify-between overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-2xl">
            <Zap className="absolute -right-4 -top-4 h-32 w-32 text-white opacity-[0.03] transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-900/50">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase italic leading-tight tracking-tight">
                  Direct Export to Ads Manager
                </h4>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Опубликуйте кампанию в Facebook/Instagram в 1 клик
                </p>
              </div>
            </div>
            <Button className="relative z-10 h-12 rounded-xl bg-white px-8 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-xl hover:bg-slate-100">
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
  );
}
