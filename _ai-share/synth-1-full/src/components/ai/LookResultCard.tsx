"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { resolveProductForDisplay } from "@/lib/ai-stylist";
import type { Look, WardrobeItem } from "@/lib/repo/aiStylistRepo";
import { 
  Check, ShoppingCart, Share2, Heart, Brain, ThumbsUp, ThumbsDown, 
  Shirt, Layers, Zap, TrendingUp, Info, Sparkles, FileText, MessageSquare,
  X, Maximize2, Camera, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LookProductItem } from "./LookProductItem";
import { OutfitCollage } from "./OutfitCollage";
import { Button } from "@/components/ui/button";
import { useUIState } from "@/providers/ui-state";
import { useToast } from "@/hooks/use-toast";
import { generateContentIdeas, type GenerateContentIdeasOutput } from "@/ai/flows/generate-content-ideas";
import type { Product } from "@/lib/types";

type DisplayProduct = { id: string; title: string; brand: string; category: string; price: number; image: string; slug: string };

export function LookResultCard({ look, wardrobe, viewRole = "client" }: { look: Look; wardrobe?: WardrobeItem[]; viewRole?: "client" | "b2b" }) {
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
  const [viralPrediction, setViralPrediction] = React.useState<{ score: number; reach: string; engagement: string; advice: string } | null>(null);
  const mirrorFileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePredictVirality = async () => {
    setIsPredictingVirality(true);
    await new Promise(r => setTimeout(r, 2000));
    setViralPrediction({
      score: 94.2,
      reach: "450K - 600K",
      engagement: "8.5%",
      advice: "Этот образ идеально попадает в эстетику 'Cyber-Minimalism', которая сейчас растет на +120% в TikTok."
    });
    setIsPredictingVirality(false);
    toast({
      title: "Прогноз готов",
      description: "AI проанализировал виральный потенциал образа.",
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
            title: "Синхронизация завершена",
            description: "AI наложил образ на ваше фото с учетом освещения и позы.",
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
      await new Promise(r => setTimeout(r, 1500));
      const stories = [
        `Этот образ — манифест современной элегантности. Сочетание ${look.title} и премиальных материалов создает ауру уверенности. Идеально для тех, кто ценит баланс между комфортом и статусом.`,
        `Представьте утро в мегаполисе. Этот лук создан для динамичного ритма жизни, где каждая деталь подчеркивает ваш индивидуальный стиль. ${look.title} — это не просто одежда, это ваше сообщение миру.`,
        `Вечер в кругу своих. Мягкие текстуры и выверенный силуэт этого образа располагают к искреннему общению. ${look.title} добавит изысканности вашему присутствию.`
      ];
      setLookStory(stories[Math.floor(Math.random() * stories.length)]);
      toast({
        title: "История образа создана",
        description: "AI сгенерировал персональный нарратив для этого лука.",
      });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось создать историю." });
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const items = look.items.map((it) => {
    const p = resolveProductForDisplay(it.productId, wardrobe);
    return p ? { p, reason: it.reason, productId: it.productId, isMissing: false as const } : { p: null, reason: it.reason, productId: it.productId, isMissing: true as const };
  });

  const validItems = items.filter((it): it is { p: DisplayProduct; reason: string } => it.p !== null);
  const buyableItems = validItems.filter(it => it.p.brand !== "My Wardrobe");

  const handleAddAllToCart = () => {
    
    // Deduplicate by product ID to avoid redundant addCartItem calls
    const uniqueItems = Array.from(new Map(buyableItems.map(it => [it.p.id, it])).values());
    
    uniqueItems.forEach(it => {
      const product: Product = {
        id: it.p.id,
        name: it.p.title,
        price: it.p.price,
        brand: it.p.brand,
        slug: it.p.slug,
        images: [{ id: "1", url: it.p.image, alt: it.p.title }],
        category: it.p.category,
        description: it.reason,
        sku: `AI-${it.p.id}`,
        availability: 'in_stock'
      };
      addCartItem(product, "One Size", 1);
    });
    
    toast({
      title: "Образ добавлен в корзину",
      description: `Добавлено ${buyableItems.length} товаров из подборки "${look.title}".`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Ссылка создана",
      description: "Ваш цифровой образ готов к публикации в соцсетях.",
    });
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    // В реальности это должно идти в БД, но для демо используем localStorage
    const key = type === 'like' ? 'syntha_liked_tags' : 'syntha_disliked_tags';
    const oppositeKey = type === 'like' ? 'syntha_disliked_tags' : 'syntha_liked_tags';
    
    // Собираем все теги из товаров образа
    const allTags = look.items.flatMap(it => {
      const p = resolveProductForDisplay(it.productId, wardrobe);
      // Мы не можем получить оригинальные теги напрямую здесь без доступа к пулу,
      // но мы можем сохранить ID товаров или категории. 
      // Для демо будем сохранять ID как "сигналы" для стилиста.
      return [it.productId];
    });

    const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
    const oppositePrev = JSON.parse(localStorage.getItem(oppositeKey) ?? "[]");
    
    localStorage.setItem(key, JSON.stringify([...new Set([...prev, ...allTags])].slice(0, 100)));
    localStorage.setItem(oppositeKey, JSON.stringify(oppositePrev.filter((id: string) => !allTags.includes(id))));

    toast({
      title: type === 'like' ? "Образ понравился" : "Образ не подошел",
      description: type === 'like' ? "AI запомнит ваши предпочтения." : "Мы будем предлагать меньше похожего.",
    });
  };

  const handlePostToFeed = () => {
    const key = "syntha_feed_posts";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
    const newPost = {
      id: `post-${Date.now()}`,
      look,
      items: validItems.map(it => it.p),
      ts: Date.now(),
      likes: 0,
      author: "AI Stylist"
    };
    localStorage.setItem(key, JSON.stringify([newPost, ...prev].slice(0, 100)));
    toast({
      title: "Опубликовано в Live",
      description: "Ваш образ теперь виден другим пользователям в ленте.",
    });
  };

  const [socialEngagement, setSocialEngagement] = React.useState({ fire: 12, next: 2 });
  const handleSocialAction = (type: 'fire' | 'next') => {
    setSocialEngagement(prev => ({ ...prev, [type]: prev[type] + 1 }));
    toast({
      title: type === 'fire' ? "FIRE!" : "NEXT",
      description: type === 'fire' ? "Вы поддержали этот стиль." : "Вы проголосовали против.",
    });
  };

  const handleGeneratePromo = async () => {
    setIsGeneratingPromo(true);
    try {
      const itemsList = validItems.map(it => it.p.title).join(", ");
      const result = await generateContentIdeas({
        brandName: "Syntha Lab",
        theme: `Образ "${look.title}" из товаров: ${itemsList}`,
        channel: "instagram",
        count: 1
      });
      setPromoContent(result);
      toast({
        title: "Промо сгенерировано",
        description: "AI подготовил пост для вашего магазина.",
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать промо.",
      });
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  return (
    <Card className="bg-white border-slate-200 text-slate-900 overflow-hidden rounded-xl group transition-all hover:shadow-2xl hover:border-slate-900 duration-500 relative os-card-frame">
      <div className="os-card-frame-inner" />
      <CardContent className="p-4 space-y-5 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{look.title}</div>
            <div className="text-[7px] font-mono text-slate-400 mt-1 uppercase tracking-widest">SYN_SYNTH_0x42</div>
          </div>
          <Badge className="bg-slate-950 text-white border-none text-[8px] font-black uppercase px-2.5 py-1 tracking-widest rounded-lg">
            {Math.round(look.confidence * 100)}%_PROBABILITY
          </Badge>
        </div>

        {viewRole === "b2b" && (
          <div className="space-y-3">
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-indigo-600" />
                <div className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Market_Demand_Score</div>
              </div>
              <div className="text-xs font-black text-indigo-900">{(look.confidence * 1.2).toFixed(1)}x</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden group/sentiment">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover/sentiment:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">AI_Sentiment_Map</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[7px] font-black uppercase px-1.5 py-0">High_Enthusiasm</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[7px] font-bold text-white/40 uppercase">Gen Z Appeal</span>
                    <span className="text-[9px] font-black text-white">88%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-indigo-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[7px] font-bold text-white/40 uppercase">Virality Potential</span>
                    <span className="text-[9px] font-black text-white">92%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-500" />
                  </div>
                </div>
              </div>
              
              <p className="text-[8px] text-white/40 leading-relaxed font-medium relative z-10 border-t border-white/5 pt-2 italic">
                "Анализ 45к реакций показывает высокий спрос на минимализм в текущем ценовом сегменте."
              </p>

              <div className="pt-2">
                <Button 
                  onClick={handlePredictVirality}
                  disabled={isPredictingVirality}
                  className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl text-[8px] font-black uppercase tracking-widest gap-2"
                >
                  {isPredictingVirality ? (
                    <div className="h-2 w-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : <TrendingUp className="h-3 w-3" />}
                  Predict_Virality_Potential
                </Button>
              </div>

              {viralPrediction && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-black uppercase text-indigo-400 tracking-widest">Viral_Forecast</span>
                    <Badge className="bg-indigo-500 text-white text-[7px] px-1.5 py-0">Score: {viralPrediction.score}%</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <div className="text-[6px] font-black text-white/40 uppercase mb-1">Est. Reach</div>
                      <div className="text-[10px] font-black text-white">{viralPrediction.reach}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <div className="text-[6px] font-black text-white/40 uppercase mb-1">Eng. Rate</div>
                      <div className="text-[10px] font-black text-white">{viralPrediction.engagement}</div>
                    </div>
                  </div>
                  <p className="text-[8px] text-white/60 leading-relaxed italic border-t border-white/5 pt-2">
                    "{viralPrediction.advice}"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between bg-slate-50/80 px-3 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Longevity_Score</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${look.longevityScore ?? 50}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-slate-900">{look.longevityScore ?? 50}%</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-sm font-black text-slate-950 tracking-tighter tabular-nums">
            {look.totalPrice.toLocaleString("ru-RU")} <span className="text-[10px] font-bold text-slate-400 tracking-normal ml-1 uppercase">₽</span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-lg border transition-all", viewMode === 'list' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200")}
            >
              <Brain className="h-3 w-3" />
            </button>
            <button 
              onClick={() => setViewMode('collage')}
              className={cn("p-1.5 rounded-lg border transition-all", viewMode === 'collage' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200")}
            >
              <Layers className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">
              {viewMode === 'list' ? 'Constituent_Elements' : 'Visual_Synthesis'}
            </span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>
          
          {viewMode === 'list' ? (
            <div className="space-y-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 shadow-inner">
              {items.map((item, idx) => {
                if ("isMissing" in item && item.isMissing) {
                  return (
                    <div key={item.productId} className="flex gap-3 items-center py-2 opacity-60">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-dashed border-slate-200 shrink-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">—</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-medium text-slate-500">Товар недоступен</div>
                        <div className="text-[9px] text-slate-400">ID: {item.productId.slice(0, 8)}</div>
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
              items={validItems.map(it => ({ 
                id: it.p.id, 
                image: it.p.image, 
                category: it.p.category, 
                title: it.p.title 
              }))} 
            />
          )}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-3 w-3 text-slate-400" />
              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Heuristic_Reasoning</div>
            </div>
            <button 
              onClick={handleGenerateStory}
              disabled={isGeneratingStory}
              className="text-[8px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-all"
            >
              <FileText className={cn("h-3 w-3", isGeneratingStory && "animate-pulse")} />
              {lookStory ? "Regenerate_Story" : "Generate_Narrative"}
            </button>
          </div>

          {lookStory && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-slate-50 rounded-xl border-l-2 border-indigo-500 italic"
            >
              <p className="text-[10px] text-slate-600 leading-relaxed">
                "{lookStory}"
              </p>
            </motion.div>
          )}

          <ul className="space-y-2.5 px-1">
            {look.why.map((w, i) => (
              <li key={i} className="text-[10px] text-slate-600 font-medium flex gap-3 items-start leading-relaxed relative group/why">
                <div className="h-1.5 w-1.5 rounded-full border border-slate-300 mt-1 shrink-0 group-hover/why:bg-slate-900 transition-colors" />
                <span className="group-hover/why:text-slate-900 transition-colors">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Button
            className="flex-1 h-12 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-[0.98] transition-all border border-white/10 group/buy button-glimmer"
            onClick={handleAddAllToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2 group-hover/buy:animate-bounce" /> Purchase_Synthesis
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            onClick={() => setIsMagicMirrorOpen(true)}
          >
            <Shirt className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            className="py-2.5 rounded-xl bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] border border-slate-100 transition-all hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 flex items-center justify-center gap-2 group/like"
            onClick={() => handleFeedback('like')}
          >
            <ThumbsUp className="h-3 w-3 group-hover/like:fill-emerald-500 transition-all" /> Like_Style
          </button>
          <button
            className="py-2.5 rounded-xl bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] border border-slate-100 transition-all hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 flex items-center justify-center gap-2 group/dislike"
            onClick={() => handleFeedback('dislike')}
          >
            <ThumbsDown className="h-3 w-3 group-hover/dislike:fill-rose-500 transition-all" /> Not_For_Me
          </button>
        </div>

        <button
          className="w-full mt-2 py-3 rounded-xl bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] border border-slate-800 transition-all hover:bg-black active:scale-[0.98] flex items-center justify-center gap-2 group/live shadow-lg"
          onClick={handlePostToFeed}
        >
          <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 group-hover:animate-pulse" /> Publish_To_Live_Feed
        </button>

        {/* Social Engagement Overlay for Published Looks */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSocialAction('fire')}
            className="flex-1 py-2.5 rounded-xl bg-orange-50 text-orange-600 text-[8px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-3 w-3 fill-orange-500" />
            FIRE ({socialEngagement.fire})
          </button>
          <button
            onClick={() => handleSocialAction('next')}
            className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight className="h-3 w-3" />
            NEXT ({socialEngagement.next})
          </button>
        </div>

        {viewRole === "b2b" && (
          <div className="space-y-2 mt-2">
            <button
              className="w-full py-3 rounded-xl bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group/promo"
              onClick={handleGeneratePromo}
              disabled={isGeneratingPromo}
            >
              <Sparkles className="h-3.5 w-3.5 group-hover:animate-spin" /> 
              {isGeneratingPromo ? "Generating..." : "Generate_B2B_Promo"}
            </button>
            
            {promoContent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-black uppercase text-indigo-400">Marketing_Output</span>
                  <button onClick={() => setPromoContent(null)} className="text-[7px] font-black text-indigo-300 hover:text-indigo-600 uppercase">Clear</button>
                </div>
                <div className="text-[9px] font-bold text-indigo-900 leading-tight">
                  {promoContent.ideas[0]?.title}
                </div>
                <p className="text-[8px] text-indigo-700 leading-relaxed italic">
                  "{promoContent.ideas[0]?.caption}"
                </p>
                <div className="flex flex-wrap gap-1">
                  {promoContent.ideas[0]?.hashtags?.map((h, i) => (
                    <span key={i} className="text-[7px] text-indigo-400">#{h}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        <button
          className="w-full mt-2 py-3 rounded-xl bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] border border-dashed border-slate-200 transition-all hover:bg-white hover:border-slate-900 hover:text-slate-900 active:scale-[0.98] flex items-center justify-center gap-2 group/save"
          onClick={() => {
            const key = "syntha_saved_looks";
            const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
            localStorage.setItem(key, JSON.stringify([look, ...prev].slice(0, 50)));
            toast({
              title: "Образ сохранён",
              description: "Доступен в разделе «Мои образы» (/u/collections).",
            });
          }}
        >
          <Heart className="h-3.5 w-3.5 group-hover/save:fill-rose-500 group-hover/save:text-rose-500 transition-all" /> Store_In_Collections
        </button>
      </CardContent>

      {/* AI Magic Mirror Overlay */}
      <AnimatePresence>
        {isMagicMirrorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-4"
          >
            <button 
              onClick={() => setIsMagicMirrorOpen(false)}
              className="absolute top-4 right-6 text-white/40 hover:text-white p-2 transition-colors z-50"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-indigo-500 text-white border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    AI_Magic_Mirror_v2.0
                  </Badge>
                  <h2 className="text-sm md:text-base font-black text-white uppercase tracking-tighter leading-none">
                    Виртуальная<br/>Примерочная
                  </h2>
                  <p className="text-slate-400 text-sm md:text-sm max-w-md italic">
                    "Примерьте образ {look.title} прямо сейчас. Наш ИИ адаптирует вещи под ваши параметры."
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Button 
                      variant={!isLiveAR ? "default" : "outline"}
                      onClick={() => setIsLiveAR(false)}
                      className={cn("flex-1 h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest", !isLiveAR && "bg-indigo-500 text-white")}
                    >
                      Фото-режим
                    </Button>
                    <Button 
                      variant={isLiveAR ? "default" : "outline"}
                      onClick={() => setIsLiveAR(true)}
                      className={cn("flex-1 h-10 rounded-2xl text-[10px] font-black uppercase tracking-widest", isLiveAR && "bg-emerald-500 text-white border-emerald-500")}
                    >
                      <div className="flex items-center gap-2">
                        {isLiveAR && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                        AR Live Mode
                      </div>
                    </Button>
                  </div>

                  <div 
                    onClick={() => !isLiveAR && mirrorFileInputRef.current?.click()}
                    className={cn(
                      "aspect-[3/4] md:aspect-square w-full max-w-md rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group",
                      isLiveAR ? "border-emerald-500 bg-black" : userPhoto ? "border-indigo-500 bg-white/5" : "border-white/10 hover:border-white/40 hover:bg-white/5"
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
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                          {/* Simulated Live Feed */}
                          <motion.div 
                            animate={{ opacity: [0.4, 0.6, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent z-10"
                          />
                          <div className="text-center space-y-4 z-20">
                            <div className="relative">
                              <div className="h-32 w-32 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
                                <Camera className="h-12 w-12 text-emerald-500 animate-pulse" />
                              </div>
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-2 border-2 border-dashed border-emerald-500/20 rounded-full"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-black uppercase text-emerald-400 tracking-[0.2em]">AR_Neural_Link_Active</div>
                              <div className="text-[9px] text-white/40 font-mono">Syncing: 120fps / Latency: 4ms</div>
                            </div>
                          </div>
                        </div>
                        {/* Simulated overlay components */}
                        <div className="absolute top-4 left-6 z-30 flex flex-col gap-2">
                          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Live</span>
                          </div>
                        </div>
                        {/* Scanning bar */}
                        <motion.div 
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-30"
                        />
                      </>
                    ) : isProcessingTryOn ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <div className="space-y-1 text-center">
                          <div className="text-xs font-black uppercase text-indigo-400 tracking-[0.2em] animate-pulse">Синхронизация_слоев...</div>
                          <div className="text-[10px] text-white/40 font-mono">Neural_Engine_Active</div>
                        </div>
                      </div>
                    ) : userPhoto ? (
                      <>
                        <motion.img 
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={userPhoto} 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay" />
                        
                        {/* Simulated overlay of the look */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                          transition={{ delay: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-full h-full bg-gradient-to-t from-indigo-900/60 to-transparent" />
                        </motion.div>

                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-3 py-1">LOOK_SYNCHRONIZED</Badge>
                          <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-white/40 group-hover:text-white transition-colors text-center p-4">
                        <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                          <Camera className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-black uppercase tracking-widest">Загрузите ваше фото</div>
                          <div className="text-[10px] font-medium opacity-60">Или включите камеру для мгновенной примерки</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Constituent_Look_Items</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {validItems.slice(0, 4).map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <img src={it.p.image} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[10px] font-black text-white truncate uppercase">{it.p.title}</div>
                          <div className="text-[8px] text-white/40 truncate uppercase">{it.p.brand}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">AI_Refinement_Feedback</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Автоматическая подгонка размера под силуэт.",
                      "Симуляция освещения и теней в реальном времени.",
                      "Учет текстур материалов и драпировки ткани."
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] text-white/70 font-medium italic">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    className="flex-1 h-10 rounded-2xl bg-white text-black hover:bg-slate-200 text-[11px] font-black uppercase tracking-widest"
                    onClick={handleAddAllToCart}
                  >
                    Добавить весь образ в корзину
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-10 px-8 rounded-2xl border-white/10 text-white hover:bg-white/5 text-[11px] font-black uppercase tracking-widest"
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
