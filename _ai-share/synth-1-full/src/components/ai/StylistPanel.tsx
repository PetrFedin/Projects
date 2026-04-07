"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WardrobePicker, productToPickerItem } from "./WardrobePicker";
import { PreferencesAccordion } from "./PreferencesAccordion";
import { StylistResults } from "./StylistResults";
import type {
  Occasion,
  StyleMood,
  StylistResponse,
  ColorPalette,
  Contrast,
  Season,
  Message,
  WardrobeItem as RepoWardrobeItem,
  StylistPreferences,
} from "@/lib/repo/aiStylistRepo";
import type { Audience, Product } from "@/data/products.mock";
import { useUIState } from "@/providers/ui-state";
import { useToast } from "@/hooks/use-toast";
import { products as catalogProducts } from "@/lib/products";
import { MOCK_WARDROBE } from "@/data/wardrobe.mock";
import { Brain, MessageSquare, ArrowRight, Sparkles, History, Heart, Send, Mic, MicOff, Camera, Upload, LayoutList, Layers, Plus, Wind, Trophy, Star, CheckCircle2, UserCheck, AlertCircle, Shirt } from "lucide-react";
import { analyzeWardrobe, type AnalyzeWardrobeOutput } from "@/ai/flows/analyze-wardrobe";
import { CalendarQuickView } from "../user/CalendarQuickView";
import { inferProductTags } from "@/ai/flows/infer-product-tags";
import { generateContentIdeas, type GenerateContentIdeasOutput } from "@/ai/flows/generate-content-ideas";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import {
  OCCASIONS,
  AUDIENCES,
  MOODS,
  SEASONS,
  FORMATS,
  PREF_STORAGE_KEY,
  SESSION_HISTORY_KEY,
  MAX_SESSIONS,
} from "./stylist-constants";

const CATALOG_IDS = new Set(catalogProducts.map((p) => p.id));

const PERSONAL_WARDROBE_FALLBACK = MOCK_WARDROBE.slice(0, 2).map((w) => ({
  id: w.id,
  title: w.title,
  brand: w.brand,
  category: w.category,
  image: w.image,
  tags: w.tags,
  color: w.color,
}));

export function StylistPanel({ viewRole = "client" }: { viewRole?: "client" | "b2b" }) {
  const { manualWardrobe } = useUIState();
  const { toast } = useToast();
  const [audience, setAudience] = React.useState<Audience>("Woman");
  const [occasion, setOccasion] = React.useState<Occasion>("Daily");
  const [season, setSeason] = React.useState<Season>("Spring");
  const [palette, setPalette] = React.useState<ColorPalette>("Neutral");
  const [contrast, setContrast] = React.useState<Contrast | undefined>(undefined);
  const [mood, setMood] = React.useState<StyleMood>("Minimal");
  const [budgetMax, setBudgetMax] = React.useState<number | undefined>(undefined);
  const [budgetPreference, setBudgetPreference] = React.useState<'economy' | 'standard' | 'premium'>('standard');
  const [temperature, setTemperature] = React.useState<number>(15);
  const [includeCategories, setIncludeCategories] = React.useState<Product["category"][]>(["Tops", "Bottoms", "Shoes"]);
  const [selectedFormat, setSelectedFormat] = React.useState<string>("all");
  const [selectedWardrobe, setSelectedWardrobe] = React.useState<RepoWardrobeItem[]>([]);
  const [wardrobeTab, setWardrobeTab] = React.useState<'picker' | 'upload'>('picker');
  const [allowWithoutWardrobe, setAllowWithoutWardrobe] = React.useState(true);
  const [chatMessage, setChatMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [sessionHistory, setSessionHistory] = React.useState<SessionEntry[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [isCapsuleMode, setIsCapsuleMode] = React.useState(false);
  const [personalItemImage, setPersonalItemImage] = React.useState<string | null>(null);
  const [isAnalyzingItem, setIsAnalyzingItem] = React.useState(false);
  const [conciergeAdvice, setConciergeAdvice] = React.useState<{ text: string; mood: string } | null>(null);
  const [dailyChallenge, setDailyChallenge] = React.useState<{ title: string; desc: string; targetMood: string; reward: string } | null>(null);
  const [isAnalyzingFullWardrobe, setIsAnalyzingFullWardrobe] = React.useState(false);
  const [wardrobeScore, setWardrobeScore] = React.useState<{ style: string; completeness: number; missing: string[] } | null>(null);
  const personalItemInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Challenge of the day
    const challenges = [
      { title: "День 'Old Money'", desc: "Соберите образ в стиле 'тихой роскоши'. Используйте бежевые и кремовые оттенки.", targetMood: "Classic", reward: "Badge: Elegance Pro" },
      { title: "Cyberpunk Night", desc: "Экспериментируйте с технологичными тканями и неоновыми акцентами.", targetMood: "Techwear", reward: "Badge: Future Runner" },
      { title: "Gorpcore Weekend", desc: "Подготовьтесь к прогулке на природе, сохраняя стиль.", targetMood: "SportLuxe", reward: "Badge: Nature Walker" }
    ];
    setDailyChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    
    // Concierge advice
    const advices = [
      { text: "Завтра в Москве +15 и солнце. Рекомендую многослойный образ с легким тренчем.", mood: "Smart Casual" },
      { text: "Похоже, на следующей неделе будут дожди. Самое время проверить наличие непромокаемой обуви в вашем гардеробе.", mood: "Techwear" },
      { text: "У вас много синего в гардеробе. Попробуйте добавить акцентные аксессуары терракотового цвета.", mood: "AvantGarde" }
    ];
    setConciergeAdvice(advices[Math.floor(Math.random() * advices.length)]);
  }, []);

  const handleAnalyzeFullWardrobe = async () => {
    setIsAnalyzingFullWardrobe(true);
    // Simulate deep analysis
    await new Promise(r => setTimeout(r, 3000));
    setWardrobeScore({
      style: "Минимализм с элементами Techwear",
      completeness: 65,
      missing: ["Базовый бежевый тренч", "Белые кожаные кеды", "Классический черный пиджак"]
    });
    setIsAnalyzingFullWardrobe(false);
    toast({
      title: "Анализ гардероба завершен",
      description: "Мы определили ваш стиль и нашли пробелы в капсулах.",
    });
  };

  const handlePersonalItemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAnalyzingItem(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPersonalItemImage(event.target?.result as string);
        setTimeout(() => {
          setIsAnalyzingItem(false);
          toast({
            title: "Вещь проанализирована",
            description: "Теперь я подберу к ней идеальные сочетания.",
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };
  const [data, setData] = React.useState<StylistResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isAnalyzingWardrobe, setIsAnalyzingWardrobe] = React.useState(false);
  const [wardrobeAnalysis, setWardrobeAnalysis] = React.useState<AnalyzeWardrobeOutput | null>(null);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = React.useState(false);
  const [marketingIdeas, setMarketingIdeas] = React.useState<GenerateContentIdeasOutput | null>(null);

  const [preferences, setPreferences] = React.useState<StylistPreferences>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(PREF_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_HISTORY_KEY);
      setSessionHistory(stored ? JSON.parse(stored) : []);
    } catch {
      setSessionHistory([]);
    }
  }, []);

  type SessionEntry = {
    id: string;
    ts: number;
    params: { 
      audience: string; 
      occasion: string; 
      season: string; 
      mood: string; 
      palette: string; 
      budgetMax?: number;
      budgetPreference?: string;
      temperature?: number;
    };
    looksCount: number;
  };
  const saveSession = (res: StylistResponse) => {
    const entry: SessionEntry = {
      id: `s-${Date.now()}`,
      ts: Date.now(),
      params: { 
        audience, occasion, season, mood, palette, budgetMax, 
        budgetPreference, temperature 
      },
      looksCount: res.looks?.length ?? 0,
    };
    setSessionHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_SESSIONS);
      try {
        localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const restoreSession = (entry: SessionEntry) => {
    setAudience(entry.params.audience as Audience);
    setOccasion(entry.params.occasion as Occasion);
    setSeason(entry.params.season as Season);
    setMood(entry.params.mood as StyleMood);
    setPalette(entry.params.palette as ColorPalette);
    setBudgetMax(entry.params.budgetMax);
    if (entry.params.budgetPreference) setBudgetPreference(entry.params.budgetPreference as any);
    if (entry.params.temperature !== undefined) setTemperature(entry.params.temperature);
  };

  const toggleFavoriteColor = (c: string) => {
    setPreferences((p) => ({
      ...p,
      favoriteColors: p.favoriteColors?.includes(c)
        ? p.favoriteColors.filter((x) => x !== c)
        : [...(p.favoriteColors ?? []), c],
    }));
  };
  const toggleExcludeOversized = () => setPreferences((p) => ({ ...p, excludeOversized: !p.excludeOversized }));
  const toggleExcludeBright = () => setPreferences((p) => ({ ...p, excludeBright: !p.excludeBright }));
  const resetPreferences = () => setPreferences({});

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      toast({
        title: "Голосовой помощник",
        description: "Слушаю ваш запрос...",
      });
      // Mock voice recognition
      setTimeout(() => {
        setIsListening(false);
        const voiceText = "Подбери мне что-нибудь дерзкое для вечеринки в стиле киберпанк, бюджет до 50 тысяч";
        setChatMessage(voiceText);
        toast({
          title: "Запрос распознан",
          description: "Анализирую параметры стиля...",
        });
      }, 4000);
    } else {
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    toast({
      title: "Анализ фото...",
      description: "AI определяет категорию, цвет и стиль вашей вещи.",
    });

    // AI analysis
    setTimeout(async () => {
      let tags: string[] = ["casual"];
      try {
        const inferred = await inferProductTags({
          name: file.name,
          category: "Tops", // Default
        });
        if (inferred.tags.length) tags = inferred.tags;
      } catch (e) {
        console.warn("Tag inference failed", e);
      }

      const newItem: RepoWardrobeItem = {
        id: `cv-${Date.now()}`,
        title: file.name.split('.')[0] || "Загруженная вещь",
        category: "Tops",
        brand: "My Wardrobe",
        image: URL.createObjectURL(file),
        tags: tags,
        color: "white",
      };
      
      setSelectedWardrobe(prev => [...prev, newItem]);
      setAllowWithoutWardrobe(false);
      setLoading(false);
      
      toast({
        title: "Вещь добавлена",
        description: "AI успешно распознал футболку белого цвета.",
      });
    }, 2500);
  };

  const runWardrobeAnalysis = async () => {
    if (selectedWardrobe.length === 0) {
      toast({
        title: "Гардероб пуст",
        description: "Выберите вещи для анализа.",
      });
      return;
    }

    setIsAnalyzingWardrobe(true);
    try {
      const result = await analyzeWardrobe({
        items: selectedWardrobe.map(it => ({
          title: it.title,
          category: it.category,
          color: it.color,
          tags: it.tags
        })),
        occasion: occasion
      });
      setWardrobeAnalysis(result);
    } catch {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось проанализировать гардероб.",
      });
    } finally {
      setIsAnalyzingWardrobe(false);
    }
  };

  const runMarketingAnalysis = async () => {
    setIsGeneratingIdeas(true);
    try {
      const result = await generateContentIdeas({
        brandName: "Syntha Lab",
        theme: `Коллекция ${season}, стиль ${mood}`,
        channel: "instagram",
        count: 3
      });
      setMarketingIdeas(result);
    } catch {
      toast({
        title: "Ошибка генерации",
        description: "Не удалось создать идеи контента.",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const toggleExcludedCategory = (cat: Product["category"]) => {
    setPreferences((p) => ({
      ...p,
      excludedCategories: p.excludedCategories?.includes(cat)
        ? p.excludedCategories.filter((x) => x !== cat)
        : [...(p.excludedCategories ?? []), cat],
    }));
  };

  const getFeedbackPreferences = (): StylistPreferences => {
    if (typeof window === "undefined") return preferences;
    try {
      const likedIds = JSON.parse(localStorage.getItem("syntha_liked_tags") ?? "[]");
      const dislikedIds = JSON.parse(localStorage.getItem("syntha_disliked_tags") ?? "[]");
      return {
        ...preferences,
        likedTags: likedIds, // Здесь ID товаров используются как суррогат тегов для скоринга
        dislikedTags: dislikedIds,
      };
    } catch {
      return preferences;
    }
  };

  const hasActivePreferences =
    (preferences.favoriteColors?.length ?? 0) > 0 ||
    (preferences.excludedCategories?.length ?? 0) > 0 ||
    preferences.excludeOversized ||
    preferences.excludeBright;

  const clientWardrobeItems = React.useMemo(() => {
    const personalOnly = manualWardrobe
      .filter((p) => !CATALOG_IDS.has(p.id))
      .map(productToPickerItem)
      .filter((item) => item.image);
    const items = personalOnly.slice(0, 2);
    if (items.length < 2) {
      return [...items, ...PERSONAL_WARDROBE_FALLBACK.slice(0, 2 - items.length)];
    }
    return items;
  }, [manualWardrobe]);

  const handleFormatChange = (val: string) => {
    setSelectedFormat(val);
    const format = FORMATS.find((f) => f.id === val);
    if (format) setIncludeCategories(format.items);
  };

  const toggleWardrobe = (item: {
    id: string;
    title: string;
    brand?: string;
    category: string;
    image: string;
    tags?: string[];
    color?: string;
  }) => {
    setSelectedWardrobe((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev.filter((i) => i.id !== item.id);
      return [
        ...prev,
        {
          id: item.id,
          title: item.title,
          brand: item.brand ?? "Syntha",
          category: item.category as RepoWardrobeItem["category"],
          image: item.image,
          tags: item.tags ?? [],
          color: item.color ?? "",
        },
      ];
    });
  };

  async function run() {
    if (includeCategories.length === 0) {
      setError("Выберите хотя бы одну категорию для образа");
      return;
    }
    if (viewRole === "client" && selectedWardrobe.length === 0 && !allowWithoutWardrobe) {
      setError("Выберите вещь из гардероба или включите «Подобрать с нуля»");
      return;
    }

    setLoading(true);
    setError(null);

    const userContent = chatMessage.trim() || "Подбери образ";
    const newUserMsg: Message = { role: "user", content: userContent, timestamp: Date.now() };
    const allMessages: Message[] = [...messages, newUserMsg];
    setMessages(allMessages);
    setChatMessage("");

    try {
      const res = await fetch("/api/ai/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          occasion,
          season,
          palette,
          contrast,
          mood,
          includeCategories,
          wardrobe: selectedWardrobe,
          messages: allMessages,
          budgetMax: budgetMax && budgetMax > 0 ? budgetMax : undefined,
          temperature: temperature,
          isCapsule: isCapsuleMode,
          personalItemImage: personalItemImage || undefined,
          preferences: {
            ...getFeedbackPreferences(),
            budgetPreference,
          },
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = (await res.json()) as StylistResponse;
      setData(json);

      const reply = json.reply ?? "Готово.";
      setMessages((m) => [...m, { role: "assistant", content: reply, timestamp: Date.now() }]);

      if (json.looks?.length) saveSession(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setChatMessage(userContent);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Voice Assistant Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-40 w-40 rounded-full bg-indigo-500/20 flex items-center justify-center border-4 border-indigo-500/30"
                />
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 h-40 w-40 rounded-full bg-indigo-500/10"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">Слушаю...</h3>
                <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">Neural_Voice_Processor_Active</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsListening(false)}
                className="mt-4 border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 h-12 font-black uppercase text-[11px]"
              >
                Отмена
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification & Wardrobe Analysis Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {dailyChallenge && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white relative overflow-hidden group shadow-xl"
          >
            <div className="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-700 rotate-12">
              <Trophy className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                  CHALLENGE_OF_THE_DAY
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight leading-none mb-1">{dailyChallenge.title}</h3>
                <p className="text-white/80 text-[11px] leading-relaxed max-w-[200px]">{dailyChallenge.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-amber-200 fill-amber-200" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-100">{dailyChallenge.reward}</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => {
                    setMood(dailyChallenge.targetMood as StyleMood);
                    toast({
                      title: "Вызов принят!",
                      description: "Режим испытания активирован.",
                    });
                  }}
                  className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl px-4 h-8 font-black uppercase text-[9px] tracking-widest shadow-lg shadow-black/5"
                >
                  Участвовать
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-4 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <UserCheck className="h-24 w-24 text-slate-900" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                SMART_WARDROBE_AI
              </Badge>
            </div>
            {wardrobeScore ? (
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ваш стиль</div>
                    <div className="text-sm font-black text-slate-900 uppercase">{wardrobeScore.style}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-black text-indigo-600 leading-none">{wardrobeScore.completeness}%</div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Полнота капсул</div>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${wardrobeScore.completeness}%` }} className="h-full bg-indigo-500" />
                </div>
                <div className="pt-2">
                  <div className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <AlertCircle className="h-2 w-2" /> Рекомендуем добавить:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {wardrobeScore.missing.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[8px] font-bold text-rose-600 uppercase">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-500 text-[11px] leading-relaxed max-w-[220px]">
                  Позвольте ИИ проанализировать ваш текущий гардероб, определить уникальный стиль и найти "пробелы".
                </p>
                <Button 
                  onClick={handleAnalyzeFullWardrobe}
                  disabled={isAnalyzingFullWardrobe}
                  className="w-full bg-slate-950 text-white hover:bg-black rounded-xl h-10 font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg active:scale-95 transition-all"
                >
                  {isAnalyzingFullWardrobe ? (
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : <Brain className="h-4 w-4" />}
                  Проанализировать гардероб
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Style Concierge block */}
      {conciergeAdvice && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Sparkles className="h-24 w-24" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  AI_Concierge_Active
                </Badge>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  Live_Update
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200 max-w-2xl leading-relaxed italic">
                "{conciergeAdvice.text}"
              </p>
            </div>
            <Button 
              onClick={() => {
                setMood(conciergeAdvice.mood as StyleMood);
                run();
              }}
              className="bg-white text-black hover:bg-slate-200 rounded-2xl px-8 h-12 font-black uppercase text-[11px] tracking-widest shrink-0 shadow-xl shadow-white/5 active:scale-95 transition-all"
            >
              Применить совет
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12">
          <div className="space-y-2">
            {viewRole === "b2b" && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-6 mb-8">
                  <div />
                  <div className="flex items-center gap-3">
                    <CalendarQuickView role="brand" />
                    <Badge variant="outline" className="bg-indigo-50 border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest">
                      B2B_Professional_Mode
                    </Badge>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormSelect label="Состав" value={selectedFormat} onChange={handleFormatChange} options={FORMATS} />
                    <FormSelect label="Аудитория" value={audience} onChange={(v) => setAudience(v as Audience)} options={AUDIENCES} />
                    <FormSelect label="Сезон" value={season} onChange={(v) => setSeason(v as Season)} options={SEASONS} />
                    <FormSelect label="Сценарий" value={occasion} onChange={(v) => setOccasion(v as Occasion)} options={OCCASIONS} />
                    <FormSelect label="Стиль" value={mood} onChange={(v) => setMood(v as StyleMood)} options={MOODS} />
                    <FormSelect 
                      label="Бюджет AI" 
                      value={budgetPreference} 
                      onChange={(v) => setBudgetPreference(v as any)} 
                      options={[
                        { id: 'economy', label: 'Эконом (Smart)' },
                        { id: 'standard', label: 'Стандарт' },
                        { id: 'premium', label: 'Премиум (Luxury)' }
                      ]} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex justify-between">
                        Погода (°C)
                        <span className="text-slate-900 font-black">{temperature > 0 ? `+${temperature}` : temperature}°</span>
                      </label>
                      <div className="h-11 flex items-center">
                        <input
                          type="range"
                          min="-20"
                          max="40"
                          step="5"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Макс. Бюджет (₽)</label>
                      <input
                        className="w-full h-11 rounded-xl bg-slate-50 border border-slate-100 px-4 text-[10px] text-slate-900 font-black uppercase tracking-widest outline-none focus:border-black transition-all placeholder:text-slate-300 shadow-inner"
                        placeholder="Без лимита"
                        inputMode="numeric"
                        value={budgetMax?.toString() ?? ""}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^\d]/g, "");
                          setBudgetMax(v ? Number(v) : undefined);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Unified Wardrobe Center */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <Shirt className="h-3.5 w-3.5" /> MY_DIGITAL_WARDROBE
                      </label>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button 
                          onClick={() => setWardrobeTab('picker')}
                          className={cn(
                            "px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                            wardrobeTab === 'picker' ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Из архива
                        </button>
                        <button 
                          onClick={() => setWardrobeTab('upload')}
                          className={cn(
                            "px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                            wardrobeTab === 'upload' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Новое фото
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {wardrobeTab === 'picker' ? (
                        <motion.div 
                          key="picker"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-3"
                        >
                          <WardrobePicker
                            items={clientWardrobeItems}
                            selectedIds={selectedWardrobe.map((s) => s.id)}
                            onToggle={toggleWardrobe}
                          />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="upload"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-3"
                        >
                          <div 
                            onClick={() => personalItemInputRef.current?.click()}
                            className={cn(
                              "relative h-24 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center group overflow-hidden",
                              personalItemImage ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-slate-900 hover:bg-slate-50"
                            )}
                          >
                            <input 
                              type="file" 
                              ref={personalItemInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handlePersonalItemUpload} 
                            />
                            
                            {isAnalyzingItem ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[9px] font-black uppercase text-indigo-500">Neural_Analysis...</span>
                              </div>
                            ) : personalItemImage ? (
                              <>
                                <img src={personalItemImage} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.5]" />
                                <div className="relative z-10 flex flex-col items-center gap-1">
                                  <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black uppercase">Слой_синхронизирован</Badge>
                                  <span className="text-[8px] text-white font-bold uppercase tracking-widest drop-shadow-md">Заменить фото</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-slate-900 transition-colors">
                                <Plus className="h-5 w-5" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-center px-4">
                                  Загрузить фото вещи<br/>для мгновенного подбора
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Wind className="h-3.5 w-3.5" /> Prompt-to-Mood (Aesthetic Search)
                    </label>
                    {sessionHistory.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 text-[9px] gap-1.5 border-slate-200">
                            <History className="h-3 w-3" />
                            Недавние
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64 p-2">
                          <div className="text-[9px] font-bold uppercase text-slate-500 mb-2">Восстановить параметры</div>
                          {sessionHistory.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => restoreSession(s)}
                              className="w-full text-left px-3 py-2 rounded-lg text-[10px] hover:bg-slate-50 flex justify-between items-center"
                            >
                              <span>{new Date(s.ts).toLocaleDateString("ru", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                              <span className="text-slate-400">{s.looksCount} образов</span>
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <textarea
                      className="w-full min-h-[140px] rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm font-medium text-slate-900 outline-none focus:border-black transition-all placeholder:text-slate-300 resize-none shadow-inner pr-20"
                      placeholder="Опишите эстетику или настроение. Например: 'Завтрак в стиле старых денег в Париже под дождем' или 'Киберпанк-вечеринка в Токио'..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8 rounded-lg transition-all",
                          isListening ? "bg-rose-50 text-rose-500 animate-pulse" : "text-slate-400 hover:text-slate-600"
                        )}
                        onClick={toggleListening}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-slate-950 text-white hover:bg-black transition-all shadow-lg active:scale-95"
                        onClick={run}
                        disabled={!chatMessage.trim() || loading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {!chatMessage.trim() && (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => { setIsCapsuleMode(false); run(); }}
                        disabled={loading || (viewRole === "client" && selectedWardrobe.length === 0 && !allowWithoutWardrobe)}
                        className="button-glimmer button-professional !bg-black hover:!bg-black shadow-xl shadow-slate-200/50 border-none px-8 h-11 rounded-2xl font-bold uppercase text-[11px] tracking-widest w-fit"
                      >
                        {loading && !isCapsuleMode ? (
                          <span className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            Генерация...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Сгенерировать образ
                            <Sparkles className="h-4 w-4" />
                          </span>
                        )}
                      </Button>

                      <Button
                        onClick={() => { setIsCapsuleMode(true); run(); }}
                        disabled={loading || (viewRole === "client" && selectedWardrobe.length === 0 && !allowWithoutWardrobe)}
                        variant="outline"
                        className="border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-8 h-11 rounded-2xl font-bold uppercase text-[11px] tracking-widest w-fit transition-all group"
                      >
                        {loading && isCapsuleMode ? (
                          <span className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                            Собираем капсулу...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Собрать капсулу
                            <Layers className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                </div>
              </div>

              <PreferencesAccordion
                preferences={preferences}
                palette={palette}
                contrast={contrast}
                onToggleFavoriteColor={toggleFavoriteColor}
                onToggleExcludedCategory={toggleExcludedCategory}
                onToggleExcludeOversized={toggleExcludeOversized}
                onToggleExcludeBright={toggleExcludeBright}
                onPaletteChange={setPalette}
                onContrastChange={setContrast}
                onReset={resetPreferences}
              />

              {viewRole === "client" && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Checkbox checked={allowWithoutWardrobe} onCheckedChange={(v) => setAllowWithoutWardrobe(!!v)} />
                      Свободный поиск (без привязки к вещам)
                    </label>
                  </div>
                  {!allowWithoutWardrobe && (
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] text-slate-500 italic">
                        *Используйте блок «MY_DIGITAL_WARDROBE» выше, чтобы выбрать или загрузить вещь.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Ошибка: {error}
                </div>
              )}

              <StylistResults data={data} selectedWardrobe={selectedWardrobe} viewRole={viewRole} />
            </div>
          </div>
        </div>

      <Card className="bg-slate-900 border-none rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-2xl group/banner mt-8">
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000"
            alt="Neural Engine Inventory"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <CardContent className="relative z-10 p-4 space-y-3 max-w-4xl text-white w-full">
          <div className="overflow-hidden whitespace-nowrap mb-2 py-1.5 border-y border-white/10 relative group/marquee">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-3 w-fit"
            >
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Анализ трендов</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Персональный подбор</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Умные рекомендации</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Поиск образов</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Цифровая мода</span>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-tighter leading-[0.85]">
              {viewRole === "b2b" ? "АНАЛИЗ АССОРТИМЕНТА" : "ВАШ СТИЛЬ"}
            </h2>
            <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">
              {viewRole === "b2b"
                ? '"Предиктивная аналитика спроса и оптимизация закупочной корзины."'
                : '"Интеллектуальная синхронизация ваших предпочтений с актуальными коллекциями."'}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                asChild
                className="button-glimmer button-professional !bg-black hover:!bg-black shadow-none border-none px-8 h-11 min-w-[200px] rounded-xl font-black uppercase text-[11px] flex items-center justify-center gap-2 w-fit"
              >
                <Link href={viewRole === "b2b" ? "/brand/analytics" : "/u"}>
                  {viewRole === "b2b" ? "Перейти к аналитике" : "Мой стиль"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              {viewRole === "b2b" && (
                <Button 
                  variant="outline" 
                  onClick={runMarketingAnalysis}
                  disabled={isGeneratingIdeas}
                  className="border-white/20 text-white hover:bg-white/10 px-6 h-11 rounded-xl font-bold uppercase text-[11px] gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingIdeas ? "Генерация..." : "Идеи для маркетинга"}
                </Button>
              )}
            </div>

            {viewRole === "b2b" && marketingIdeas && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI_Marketing_Toolkit</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setMarketingIdeas(null)} className="h-6 text-[8px] text-white/40 hover:text-white uppercase">Закрыть</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {marketingIdeas.ideas.map((idea, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all space-y-2">
                      <div className="text-[11px] font-black text-indigo-300 uppercase leading-tight">{idea.title}</div>
                      <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3">{idea.caption}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.hashtags?.map((h, i) => (
                          <span key={i} className="text-[8px] text-indigo-400/60">#{h}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FormSelect<T extends { id: string; label: string }>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: T[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-0">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200">
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id} className="text-[10px] font-black uppercase tracking-widest">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
