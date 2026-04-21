'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { resolveProductForDisplay } from '@/lib/ai-stylist';
import type { Look, WardrobeItem } from '@/lib/ai-stylist';
import {
  Check,
  ShoppingCart,
  Share2,
  Heart,
  Brain,
  ThumbsUp,
  ThumbsDown,
  Shirt,
  Layers,
  Zap,
  TrendingUp,
  Info,
  Sparkles,
  FileText,
  MessageSquare,
  X,
  Maximize2,
  Camera,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LookProductItem } from './LookProductItem';
import { OutfitCollage } from './OutfitCollage';
import { Button } from '@/components/ui/button';
import { useUIState } from '@/providers/ui-state';
import { useToast } from '@/hooks/use-toast';
import type { GenerateContentIdeasOutput } from '@/lib/ai-client/types';
import { generateContentIdeasClient } from '@/lib/ai-client/api';
import type { Product } from '@/lib/types';

type DisplayProduct = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  slug: string;
};

export function LookResultCard({
  look,
  wardrobe,
  viewRole = 'client',
}: {
  look: Look;
  wardrobe?: WardrobeItem[];
  viewRole?: 'client' | 'b2b';
}) {
  const { addCartItem } = useUIState();
  const { toast } = useToast();
  const [viewMode, setViewMode] = React.useState<'list' | 'collage'>('list');
  const [isGeneratingPromo, setIsGeneratingPromo] = React.useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = React.useState(false);
  const [promoContent, setPromoContent] = React.useState<GenerateContentIdeasOutput | null>(null);
  const [lookStory, setLookStory] = React.useState<string | null>(null);
  const [isMagicMirrorOpen, setIsMagicMirrorOpen] = React.useState(false);
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [isProcessingTryOn, setIsProcessingTryOn] = React.useState(false);
  const [isLiveAR, setIsLiveAR] = React.useState(false);
  const [isPredictingVirality, setIsPredictingVirality] = React.useState(false);
  const [viralPrediction, setViralPrediction] = React.useState<{
    score: number;
    reach: string;
    engagement: string;
    advice: string;
  } | null>(null);
  const mirrorFileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePredictVirality = async () => {
    setIsPredictingVirality(true);
    await new Promise((r) => setTimeout(r, 2000));
    setViralPrediction({
      score: 94.2,
      reach: '450K - 600K',
      engagement: '8.5%',
      advice:
        "Этот образ идеально попадает в эстетику 'Cyber-Minimalism', которая сейчас растет на +120% в TikTok.",
    });
    setIsPredictingVirality(false);
    toast({
      title: 'Прогноз готов',
      description: 'AI проанализировал виральный потенциал образа.',
    });
  };

  const handleMirrorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingTryOn(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setTimeout(() => {
          setIsProcessingTryOn(false);
          toast({
            title: 'Синхронизация завершена',
            description: 'AI наложил образ на ваше фото с учетом освещения и позы.',
          });
        }, 2500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    try {
      // Simulate LLM narrative generation
      await new Promise((r) => setTimeout(r, 1500));
      const stories = [
        `Этот образ — манифест современной элегантности. Сочетание ${look.title} и премиальных материалов создает ауру уверенности. Идеально для тех, кто ценит баланс между комфортом и статусом.`,
        `Представьте утро в мегаполисе. Этот лук создан для динамичного ритма жизни, где каждая деталь подчеркивает ваш индивидуальный стиль. ${look.title} — это не просто одежда, это ваше сообщение миру.`,
        `Вечер в кругу своих. Мягкие текстуры и выверенный силуэт этого образа располагают к искреннему общению. ${look.title} добавит изысканности вашему присутствию.`,
      ];
      setLookStory(stories[Math.floor(Math.random() * stories.length)]);
      toast({
        title: 'История образа создана',
        description: 'AI сгенерировал персональный нарратив для этого лука.',
      });
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось создать историю.' });
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const items = look.items.map((it) => {
    const p = resolveProductForDisplay(it.productId, wardrobe);
    return p
      ? { p, reason: it.reason, productId: it.productId, isMissing: false as const }
      : { p: null, reason: it.reason, productId: it.productId, isMissing: true as const };
  });

  const validItems = items.filter(
    (it): it is { p: DisplayProduct; reason: string; productId: string; isMissing: false } =>
      it.p !== null
  );
  const buyableItems = validItems.filter((it) => it.p.brand !== 'My Wardrobe');

  const handleAddAllToCart = () => {
    // Deduplicate by product ID to avoid redundant addCartItem calls
    const uniqueItems = Array.from(new Map(buyableItems.map((it) => [it.p.id, it])).values());

    uniqueItems.forEach((it) => {
      const product: Product = {
        id: it.p.id,
        name: it.p.title,
        price: it.p.price,
        brand: it.p.brand,
        slug: it.p.slug,
        images: [{ id: '1', url: it.p.image, alt: it.p.title, hint: '' }],
        category: it.p.category,
        description: it.reason,
        sku: `AI-${it.p.id}`,
        sustainability: [],
        color: '',
        season: '',
        availability: 'in_stock',
      };
      addCartItem(product, 'One Size', 1);
    });

    toast({
      title: 'Образ добавлен в корзину',
      description: `Добавлено ${buyableItems.length} товаров из подборки "${look.title}".`,
    });
  };

  const handleShare = () => {
    toast({
      title: 'Ссылка создана',
      description: 'Ваш цифровой образ готов к публикации в соцсетях.',
    });
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    // В реальности это должно идти в БД, но для демо используем localStorage
    const key = type === 'like' ? 'syntha_liked_tags' : 'syntha_disliked_tags';
    const oppositeKey = type === 'like' ? 'syntha_disliked_tags' : 'syntha_liked_tags';

    // Собираем все теги из товаров образа
    const allTags = look.items.flatMap((it) => {
      const p = resolveProductForDisplay(it.productId, wardrobe);
      // Мы не можем получить оригинальные теги напрямую здесь без доступа к пулу,
      // но мы можем сохранить ID товаров или категории.
      // Для демо будем сохранять ID как "сигналы" для стилиста.
      return [it.productId];
    });

    const prev = JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
    const oppositePrev = JSON.parse(localStorage.getItem(oppositeKey) ?? '[]') as string[];

    localStorage.setItem(key, JSON.stringify([...new Set([...prev, ...allTags])].slice(0, 100)));
    localStorage.setItem(
      oppositeKey,
      JSON.stringify(oppositePrev.filter((id: string) => !allTags.includes(id)))
    );

    toast({
      title: type === 'like' ? 'Образ понравился' : 'Образ не подошел',
      description:
        type === 'like' ? 'AI запомнит ваши предпочтения.' : 'Мы будем предлагать меньше похожего.',
    });
  };

  const handlePostToFeed = () => {
    const key = 'syntha_feed_posts';
    const prev = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[];
    const newPost = {
      id: `post-${Date.now()}`,
      look,
      items: validItems.map((it) => it.p),
      ts: Date.now(),
      likes: 0,
      author: 'AI Stylist',
    };
    localStorage.setItem(key, JSON.stringify([newPost, ...prev].slice(0, 100)));
    toast({
      title: 'Опубликовано в Live',
      description: 'Ваш образ теперь виден другим пользователям в ленте.',
    });
  };

  const [socialEngagement, setSocialEngagement] = React.useState({ fire: 12, next: 2 });
  const handleSocialAction = (type: 'fire' | 'next') => {
    setSocialEngagement((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    toast({
      title: type === 'fire' ? 'FIRE!' : 'NEXT',
      description: type === 'fire' ? 'Вы поддержали этот стиль.' : 'Вы проголосовали против.',
    });
  };

  const handleGeneratePromo = async () => {
    setIsGeneratingPromo(true);
    try {
      const itemsList = validItems.map((it) => it.p.title).join(', ');
      const result = await generateContentIdeasClient({
        brandName: 'Syntha Lab',
        theme: `Образ "${look.title}" из товаров: ${itemsList}`,
        channel: 'instagram',
        count: 1,
      });
      setPromoContent(result);
      toast({
        title: 'Промо сгенерировано',
        description: 'AI подготовил пост для вашего магазина.',
      });
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сгенерировать промо.',
      });
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  return (
    <Card className="border-border-default text-text-primary hover:border-text-primary os-card-frame group relative overflow-hidden rounded-xl bg-white transition-all duration-500 hover:shadow-2xl">
      <div className="os-card-frame-inner" />
      <CardContent className="relative z-10 space-y-5 p-4">
        <div className="border-border-subtle flex items-center justify-between border-b pb-4">
          <div className="flex flex-col">
            <div className="text-text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              {look.title}
            </div>
            <div className="text-text-muted mt-1 font-mono text-[7px] uppercase tracking-widest">
              SYN_SYNTH_0x42
            </div>
          </div>
          <Badge className="bg-text-primary rounded-lg border-none px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white">
            {Math.round(look.confidence * 100)}%_PROBABILITY
          </Badge>
        </div>

        {viewRole === 'b2b' && (
          <div className="space-y-3">
            <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center justify-between rounded-2xl border p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-accent-primary h-3 w-3" />
                <div className="text-accent-primary text-[8px] font-black uppercase tracking-widest">
                  Market_Demand_Score
                </div>
              </div>
              <div className="text-accent-primary text-xs font-black">
                {(look.confidence * 1.2).toFixed(1)}x
              </div>
            </div>

            <div className="bg-text-primary group/sentiment relative space-y-3 overflow-hidden rounded-2xl border border-white/10 p-4">
              <div className="from-accent-primary/10 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover/sentiment:opacity-100" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">
                    AI_Sentiment_Map
                  </span>
                </div>
                <Badge className="border-none bg-emerald-500/20 px-1.5 py-0 text-[7px] font-black uppercase text-emerald-400">
                  High_Enthusiasm
                </Badge>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-end justify-between">
                    <span className="text-[7px] font-bold uppercase text-white/40">
                      Gen Z Appeal
                    </span>
                    <span className="text-[9px] font-black text-white">88%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '88%' }}
                      className="bg-accent-primary h-full"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-end justify-between">
                    <span className="text-[7px] font-bold uppercase text-white/40">
                      Virality Potential
                    </span>
                    <span className="text-[9px] font-black text-white">92%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <p className="relative z-10 border-t border-white/5 pt-2 text-[8px] font-medium italic leading-relaxed text-white/40">
                "Анализ 45к реакций показывает высокий спрос на минимализм в текущем ценовом
                сегменте."
              </p>

              <div className="pt-2">
                <Button
                  onClick={handlePredictVirality}
                  disabled={isPredictingVirality}
                  className="bg-accent-primary hover:bg-accent-primary h-8 w-full gap-2 rounded-xl border-none text-[8px] font-black uppercase tracking-widest text-white"
                >
                  {isPredictingVirality ? (
                    <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  Predict_Virality_Potential
                </Button>
              </div>

              {viralPrediction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-accent-primary text-[7px] font-black uppercase tracking-widest">
                      Viral_Forecast
                    </span>
                    <Badge className="bg-accent-primary px-1.5 py-0 text-[7px] text-white">
                      Score: {viralPrediction.score}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 p-2">
                      <div className="mb-1 text-[6px] font-black uppercase text-white/40">
                        Est. Reach
                      </div>
                      <div className="text-[10px] font-black text-white">
                        {viralPrediction.reach}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <div className="mb-1 text-[6px] font-black uppercase text-white/40">
                        Eng. Rate
                      </div>
                      <div className="text-[10px] font-black text-white">
                        {viralPrediction.engagement}
                      </div>
                    </div>
                  </div>
                  <p className="border-t border-white/5 pt-2 text-[8px] italic leading-relaxed text-white/60">
                    "{viralPrediction.advice}"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="bg-bg-surface2/80 flex items-center justify-between rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <div className="text-text-secondary text-[8px] font-black uppercase tracking-widest">
              Longevity_Score
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-border-subtle h-1 w-12 overflow-hidden rounded-full">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${look.longevityScore ?? 50}%` }}
              />
            </div>
            <span className="text-text-primary text-[10px] font-black">
              {look.longevityScore ?? 50}%
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-text-primary text-sm font-black tabular-nums tracking-tighter">
            {look.totalPrice.toLocaleString('ru-RU')}{' '}
            <span className="text-text-muted ml-1 text-[10px] font-bold uppercase tracking-normal">
              ₽
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-lg border p-1.5 transition-all',
                viewMode === 'list'
                  ? 'bg-text-primary border-text-primary text-white'
                  : 'text-text-muted border-border-subtle hover:border-border-default bg-white'
              )}
            >
              <Brain className="h-3 w-3" />
            </button>
            <button
              onClick={() => setViewMode('collage')}
              className={cn(
                'rounded-lg border p-1.5 transition-all',
                viewMode === 'collage'
                  ? 'bg-text-primary border-text-primary text-white'
                  : 'text-text-muted border-border-subtle hover:border-border-default bg-white'
              )}
            >
              <Layers className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-text-muted text-[8px] font-black uppercase tracking-[0.3em]">
              {viewMode === 'list' ? 'Constituent_Elements' : 'Visual_Synthesis'}
            </span>
            <div className="bg-bg-surface2 h-[1px] flex-1" />
          </div>

          {viewMode === 'list' ? (
            <div className="bg-bg-surface2/80 border-border-subtle/50 space-y-3 rounded-2xl border p-3 shadow-inner">
              {items.map((item, idx) => {
                if ('isMissing' in item && item.isMissing) {
                  return (
                    <div key={item.productId} className="flex items-center gap-3 py-2 opacity-60">
                      <div className="bg-bg-surface2 border-border-default flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed">
                        <span className="text-text-muted text-[8px] font-bold uppercase">—</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-text-secondary text-[10px] font-medium">
                          Товар недоступен
                        </div>
                        <div className="text-text-muted text-[9px]">
                          ID: {item.productId.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <LookProductItem
                    key={item.p.id}
                    item={item as { p: DisplayProduct; reason: string; productId: string }}
                    look={look}
                    wardrobe={wardrobe}
                    excludeIds={look.items.map((it) => it.productId)}
                  />
                );
              })}
            </div>
          ) : (
            <OutfitCollage
              items={validItems.map((it) => ({
                id: it.p.id,
                image: it.p.image,
                category: it.p.category,
                title: it.p.title,
              }))}
            />
          )}
        </div>

        <div className="border-border-subtle border-t pt-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="text-text-muted h-3 w-3" />
              <div className="text-text-muted text-[8px] font-black uppercase tracking-[0.2em]">
                Heuristic_Reasoning
              </div>
            </div>
            <button
              onClick={handleGenerateStory}
              disabled={isGeneratingStory}
              className="text-accent-primary hover:text-accent-primary flex items-center gap-1 text-[8px] font-black uppercase tracking-widest transition-all"
            >
              <FileText className={cn('h-3 w-3', isGeneratingStory && 'animate-pulse')} />
              {lookStory ? 'Regenerate_Story' : 'Generate_Narrative'}
            </button>
          </div>

          {lookStory && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-surface2 border-accent-primary mb-4 rounded-xl border-l-2 p-3 italic"
            >
              <p className="text-text-secondary text-[10px] leading-relaxed">"{lookStory}"</p>
            </motion.div>
          )}

          <ul className="space-y-2.5 px-1">
            {look.why.map((w, i) => (
              <li
                key={i}
                className="text-text-secondary group/why relative flex items-start gap-3 text-[10px] font-medium leading-relaxed"
              >
                <div className="border-border-default group-hover/why:bg-text-primary mt-1 h-1.5 w-1.5 shrink-0 rounded-full border transition-colors" />
                <span className="group-hover/why:text-text-primary transition-colors">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-border-subtle flex gap-2 border-t pt-4">
          <Button
            className="bg-text-primary group/buy button-glimmer h-12 flex-1 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-black active:scale-[0.98]"
            onClick={handleAddAllToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4 group-hover/buy:animate-bounce" />{' '}
            Purchase_Synthesis
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border-default hover:bg-bg-surface2 text-text-muted hover:text-text-primary h-12 w-12 rounded-xl bg-white shadow-sm transition-all"
            onClick={() => setIsMagicMirrorOpen(true)}
          >
            <Shirt className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-border-default hover:bg-bg-surface2 text-text-muted hover:text-text-primary h-12 w-12 rounded-xl bg-white shadow-sm transition-all"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            className="bg-bg-surface2 text-text-muted border-border-subtle group/like flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[8px] font-black uppercase tracking-[0.2em] transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
            onClick={() => handleFeedback('like')}
          >
            <ThumbsUp className="h-3 w-3 transition-all group-hover/like:fill-emerald-500" />{' '}
            Like_Style
          </button>
          <button
            className="bg-bg-surface2 text-text-muted border-border-subtle group/dislike flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[8px] font-black uppercase tracking-[0.2em] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => handleFeedback('dislike')}
          >
            <ThumbsDown className="h-3 w-3 transition-all group-hover/dislike:fill-rose-500" />{' '}
            Not_For_Me
          </button>
        </div>

        <button
          className="bg-text-primary border-text-primary/30 group/live mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-black active:scale-[0.98]"
          onClick={handlePostToFeed}
        >
          <Zap className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 group-hover:animate-pulse" />{' '}
          Publish_To_Live_Feed
        </button>

        {/* Social Engagement Overlay for Published Looks */}
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleSocialAction('fire')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 py-2.5 text-[8px] font-black uppercase tracking-widest text-orange-600 transition-all hover:bg-orange-100"
          >
            <Sparkles className="h-3 w-3 fill-orange-500" />
            FIRE ({socialEngagement.fire})
          </button>
          <button
            onClick={() => handleSocialAction('next')}
            className="bg-bg-surface2 text-text-muted border-border-subtle hover:bg-bg-surface2 flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-[8px] font-black uppercase tracking-widest transition-all"
          >
            <ArrowRight className="h-3 w-3" />
            NEXT ({socialEngagement.next})
          </button>
        </div>

        {viewRole === 'b2b' && (
          <div className="mt-2 space-y-2">
            <button
              className="bg-accent-primary hover:bg-accent-primary group/promo flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all"
              onClick={handleGeneratePromo}
              disabled={isGeneratingPromo}
            >
              <Sparkles className="h-3.5 w-3.5 group-hover:animate-spin" />
              {isGeneratingPromo ? 'Generating...' : 'Generate_B2B_Promo'}
            </button>

            {promoContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-accent-primary/10 border-accent-primary/20 space-y-2 overflow-hidden rounded-xl border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-accent-primary text-[7px] font-black uppercase">
                    Marketing_Output
                  </span>
                  <button
                    onClick={() => setPromoContent(null)}
                    className="text-accent-primary hover:text-accent-primary text-[7px] font-black uppercase"
                  >
                    Clear
                  </button>
                </div>
                <div className="text-accent-primary text-[9px] font-bold leading-tight">
                  {promoContent.ideas[0]?.title}
                </div>
                <p className="text-accent-primary text-[8px] italic leading-relaxed">
                  "{promoContent.ideas[0]?.caption}"
                </p>
                <div className="flex flex-wrap gap-1">
                  {promoContent.ideas[0]?.hashtags?.map((h, i) => (
                    <span key={i} className="text-accent-primary text-[7px]">
                      #{h}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        <button
          className="bg-bg-surface2 text-text-muted border-border-default hover:border-text-primary hover:text-text-primary group/save mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-[8px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white active:scale-[0.98]"
          onClick={() => {
            const key = 'syntha_saved_looks';
            const prev = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[];
            localStorage.setItem(key, JSON.stringify([look, ...prev].slice(0, 50)));
            toast({
              title: 'Образ сохранён',
              description: 'Доступен в разделе «Мои образы» (/u/collections).',
            });
          }}
        >
          <Heart className="h-3.5 w-3.5 transition-all group-hover/save:fill-rose-500 group-hover/save:text-rose-500" />{' '}
          Store_In_Collections
        </button>
      </CardContent>

      {/* AI Magic Mirror Overlay */}
      <AnimatePresence>
        {isMagicMirrorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-text-primary/95 fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl md:p-4"
          >
            <button
              onClick={() => setIsMagicMirrorOpen(false)}
              className="absolute right-6 top-4 z-50 p-2 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-3 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-accent-primary rounded-full border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    AI_Magic_Mirror_v2.0
                  </Badge>
                  <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-white md:text-base">
                    Виртуальная
                    <br />
                    Примерочная
                  </h2>
                  <p className="text-text-muted max-w-md text-sm italic md:text-sm">
                    "Примерьте образ {look.title} прямо сейчас. Наш ИИ адаптирует вещи под ваши
                    параметры."
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Button
                      variant={!isLiveAR ? 'default' : 'outline'}
                      onClick={() => setIsLiveAR(false)}
                      className={cn(
                        'h-10 flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest',
                        !isLiveAR && 'bg-accent-primary text-white'
                      )}
                    >
                      Фото-режим
                    </Button>
                    <Button
                      variant={isLiveAR ? 'default' : 'outline'}
                      onClick={() => setIsLiveAR(true)}
                      className={cn(
                        'h-10 flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest',
                        isLiveAR && 'border-emerald-500 bg-emerald-500 text-white'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isLiveAR && (
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        )}
                        AR Live Mode
                      </div>
                    </Button>
                  </div>

                  <div
                    onClick={() => !isLiveAR && mirrorFileInputRef.current?.click()}
                    className={cn(
                      'group relative flex aspect-[3/4] w-full max-w-md cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all md:aspect-square',
                      isLiveAR
                        ? 'border-emerald-500 bg-black'
                        : userPhoto
                          ? 'border-accent-primary bg-white/5'
                          : 'border-white/10 hover:border-white/40 hover:bg-white/5'
                    )}
                  >
                    <input
                      type="file"
                      ref={mirrorFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleMirrorPhotoUpload}
                    />

                    {isLiveAR ? (
                      <>
                        <div className="bg-text-primary absolute inset-0 flex items-center justify-center">
                          {/* Simulated Live Feed */}
                          <motion.div
                            animate={{ opacity: [0.4, 0.6, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 z-10 bg-gradient-to-br from-emerald-500/20 to-transparent"
                          />
                          <div className="z-20 space-y-4 text-center">
                            <div className="relative">
                              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-emerald-500/30">
                                <Camera className="h-12 w-12 animate-pulse text-emerald-500" />
                              </div>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                className="absolute -inset-2 rounded-full border-2 border-dashed border-emerald-500/20"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                                AR_Neural_Link_Active
                              </div>
                              <div className="font-mono text-[9px] text-white/40">
                                Syncing: 120fps / Latency: 4ms
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Simulated overlay components */}
                        <div className="absolute left-6 top-4 z-30 flex flex-col gap-2">
                          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-md">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white">
                              Live
                            </span>
                          </div>
                        </div>
                        {/* Scanning bar */}
                        <motion.div
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 z-30 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                        />
                      </>
                    ) : isProcessingTryOn ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="border-accent-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
                        <div className="space-y-1 text-center">
                          <div className="text-accent-primary animate-pulse text-xs font-black uppercase tracking-[0.2em]">
                            Синхронизация_слоев...
                          </div>
                          <div className="font-mono text-[10px] text-white/40">
                            Neural_Engine_Active
                          </div>
                        </div>
                      </div>
                    ) : userPhoto ? (
                      <>
                        <motion.img
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={userPhoto}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="bg-accent-primary/20 absolute inset-0 mix-blend-overlay" />

                        {/* Simulated overlay of the look */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                          transition={{ delay: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="h-full w-full bg-gradient-to-t from-indigo-900/60 to-transparent" />
                        </motion.div>

                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                          <Badge className="border-none bg-emerald-500 px-3 py-1 text-[10px] font-black text-white">
                            LOOK_SYNCHRONIZED
                          </Badge>
                          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md">
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-4 text-center text-white/40 transition-colors group-hover:text-white">
                        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                          <Camera className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-black uppercase tracking-widest">
                            Загрузите ваше фото
                          </div>
                          <div className="text-[10px] font-medium opacity-60">
                            Или включите камеру для мгновенной примерки
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-accent-primary h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                      Constituent_Look_Items
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {validItems.slice(0, 4).map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3"
                      >
                        <img src={it.p.image} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-[10px] font-black uppercase text-white">
                            {it.p.title}
                          </div>
                          <div className="truncate text-[8px] uppercase text-white/40">
                            {it.p.brand}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                      AI_Refinement_Feedback
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Автоматическая подгонка размера под силуэт.',
                      'Симуляция освещения и теней в реальном времени.',
                      'Учет текстур материалов и драпировки ткани.',
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-[11px] font-medium italic text-white/70"
                      >
                        <div className="bg-accent-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="hover:bg-bg-surface2 h-10 flex-1 rounded-2xl bg-white text-[11px] font-black uppercase tracking-widest text-black"
                    onClick={handleAddAllToCart}
                  >
                    Добавить весь образ в корзину
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-2xl border-white/10 px-8 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/5"
                    onClick={() => setUserPhoto(null)}
                  >
                    Сброс
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
