'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WardrobePicker, productToPickerItem } from './WardrobePicker';
import { PreferencesAccordion } from './PreferencesAccordion';
import { StylistResults } from './StylistResults';
import type {
  Occasion,
  StyleMood,
  StylistApiResponse as StylistResponse,
  ColorPalette,
  Contrast,
  Season,
  StylistChatMessage as Message,
  WardrobeItem as RepoWardrobeItem,
  StylistPreferences,
<<<<<<< HEAD
} from '@/lib/repo/aiStylistRepo';
=======
} from '@/lib/ai-stylist';
>>>>>>> recover/cabinet-wip-from-stash
import type { Audience, Product } from '@/data/products.mock';
import { useUIState } from '@/providers/ui-state';
import { useToast } from '@/hooks/use-toast';
import { products as catalogProducts } from '@/lib/products';
import { MOCK_WARDROBE } from '@/data/wardrobe.mock';
import {
  Brain,
  MessageSquare,
  ArrowRight,
  Sparkles,
  History,
  Heart,
  Send,
  Mic,
  MicOff,
  Camera,
  Upload,
  LayoutList,
  Layers,
  Plus,
  Wind,
  Trophy,
  Star,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Shirt,
} from 'lucide-react';
<<<<<<< HEAD
import { analyzeWardrobe, type AnalyzeWardrobeOutput } from '@/ai/flows/analyze-wardrobe';
import { CalendarQuickView } from '../user/CalendarQuickView';
import { inferProductTags } from '@/ai/flows/infer-product-tags';
import {
  generateContentIdeas,
  type GenerateContentIdeasOutput,
} from '@/ai/flows/generate-content-ideas';
=======
import type { AnalyzeWardrobeOutput, GenerateContentIdeasOutput } from '@/lib/ai-client/types';
import {
  analyzeWardrobeClient,
  generateContentIdeasClient,
  inferProductTagsClient,
} from '@/lib/ai-client/api';
import { CalendarQuickView } from '../user/CalendarQuickView';
>>>>>>> recover/cabinet-wip-from-stash
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import {
  OCCASIONS,
  AUDIENCES,
  MOODS,
  SEASONS,
  FORMATS,
  PREF_STORAGE_KEY,
  SESSION_HISTORY_KEY,
  MAX_SESSIONS,
} from './stylist-constants';

const CATALOG_IDS = new Set(catalogProducts.map((p) => p.id));

const PERSONAL_WARDROBE_FALLBACK = MOCK_WARDROBE.slice(0, 2).map((w) => ({
  id: w.id,
  title: w.title,
  brand: w.brand ?? 'Syntha',
  category: w.category,
  image: w.image,
  tags: w.tags,
  color: w.color,
}));

export function StylistPanel({ viewRole = 'client' }: { viewRole?: 'client' | 'b2b' }) {
  const { manualWardrobe } = useUIState();
  const { toast } = useToast();
  const [audience, setAudience] = React.useState<Audience>('Woman');
  const [occasion, setOccasion] = React.useState<Occasion>('Daily');
  const [season, setSeason] = React.useState<Season>('Spring');
  const [palette, setPalette] = React.useState<ColorPalette>('Neutral');
  const [contrast, setContrast] = React.useState<Contrast | undefined>(undefined);
  const [mood, setMood] = React.useState<StyleMood>('Minimal');
  const [budgetMax, setBudgetMax] = React.useState<number | undefined>(undefined);
  const [budgetPreference, setBudgetPreference] = React.useState<
    'economy' | 'standard' | 'premium'
  >('standard');
  const [temperature, setTemperature] = React.useState<number>(15);
  const [includeCategories, setIncludeCategories] = React.useState<Product['category'][]>([
    'Tops',
    'Bottoms',
    'Shoes',
  ]);
  const [selectedFormat, setSelectedFormat] = React.useState<string>('all');
  const [selectedWardrobe, setSelectedWardrobe] = React.useState<RepoWardrobeItem[]>([]);
  const [wardrobeTab, setWardrobeTab] = React.useState<'picker' | 'upload'>('picker');
  const [allowWithoutWardrobe, setAllowWithoutWardrobe] = React.useState(true);
  const [chatMessage, setChatMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [sessionHistory, setSessionHistory] = React.useState<SessionEntry[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [isCapsuleMode, setIsCapsuleMode] = React.useState(false);
  const [personalItemImage, setPersonalItemImage] = React.useState<string | null>(null);
  const [isAnalyzingItem, setIsAnalyzingItem] = React.useState(false);
  const [conciergeAdvice, setConciergeAdvice] = React.useState<{
    text: string;
    mood: string;
  } | null>(null);
  const [dailyChallenge, setDailyChallenge] = React.useState<{
    title: string;
    desc: string;
    targetMood: string;
    reward: string;
  } | null>(null);
  const [isAnalyzingFullWardrobe, setIsAnalyzingFullWardrobe] = React.useState(false);
  const [wardrobeScore, setWardrobeScore] = React.useState<{
    style: string;
    completeness: number;
    missing: string[];
  } | null>(null);
  const personalItemInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Challenge of the day
    const challenges = [
      {
        title: "День 'Old Money'",
        desc: "Соберите образ в стиле 'тихой роскоши'. Используйте бежевые и кремовые оттенки.",
        targetMood: 'Classic',
        reward: 'Badge: Elegance Pro',
      },
      {
        title: 'Cyberpunk Night',
        desc: 'Экспериментируйте с технологичными тканями и неоновыми акцентами.',
        targetMood: 'Techwear',
        reward: 'Badge: Future Runner',
      },
      {
        title: 'Gorpcore Weekend',
        desc: 'Подготовьтесь к прогулке на природе, сохраняя стиль.',
        targetMood: 'SportLuxe',
        reward: 'Badge: Nature Walker',
      },
    ];
    setDailyChallenge(challenges[Math.floor(Math.random() * challenges.length)]);

    // Concierge advice
    const advices = [
      {
        text: 'Завтра в Москве +15 и солнце. Рекомендую многослойный образ с легким тренчем.',
        mood: 'Smart Casual',
      },
      {
        text: 'Похоже, на следующей неделе будут дожди. Самое время проверить наличие непромокаемой обуви в вашем гардеробе.',
        mood: 'Techwear',
      },
      {
        text: 'У вас много синего в гардеробе. Попробуйте добавить акцентные аксессуары терракотового цвета.',
        mood: 'AvantGarde',
      },
    ];
    setConciergeAdvice(advices[Math.floor(Math.random() * advices.length)]);
  }, []);

  const handleAnalyzeFullWardrobe = async () => {
    setIsAnalyzingFullWardrobe(true);
    // Simulate deep analysis
    await new Promise((r) => setTimeout(r, 3000));
    setWardrobeScore({
      style: 'Минимализм с элементами Techwear',
      completeness: 65,
      missing: ['Базовый бежевый тренч', 'Белые кожаные кеды', 'Классический черный пиджак'],
    });
    setIsAnalyzingFullWardrobe(false);
    toast({
      title: 'Анализ гардероба завершен',
      description: 'Мы определили ваш стиль и нашли пробелы в капсулах.',
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
            title: 'Вещь проанализирована',
            description: 'Теперь я подберу к ней идеальные сочетания.',
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
  const [wardrobeAnalysis, setWardrobeAnalysis] = React.useState<AnalyzeWardrobeOutput | null>(
    null
  );
  const [isGeneratingIdeas, setIsGeneratingIdeas] = React.useState(false);
  const [marketingIdeas, setMarketingIdeas] = React.useState<GenerateContentIdeasOutput | null>(
    null
  );

  const [preferences, setPreferences] = React.useState<StylistPreferences>(() => {
    if (typeof window === 'undefined') return {};
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
        audience,
        occasion,
        season,
        mood,
        palette,
        budgetMax,
        budgetPreference,
        temperature,
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
  const toggleExcludeOversized = () =>
    setPreferences((p) => ({ ...p, excludeOversized: !p.excludeOversized }));
  const toggleExcludeBright = () =>
    setPreferences((p) => ({ ...p, excludeBright: !p.excludeBright }));
  const resetPreferences = () => setPreferences({});

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      toast({
        title: 'Голосовой помощник',
        description: 'Слушаю ваш запрос...',
      });
      // Mock voice recognition
      setTimeout(() => {
        setIsListening(false);
        const voiceText =
          'Подбери мне что-нибудь дерзкое для вечеринки в стиле киберпанк, бюджет до 50 тысяч';
        setChatMessage(voiceText);
        toast({
          title: 'Запрос распознан',
          description: 'Анализирую параметры стиля...',
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
      title: 'Анализ фото...',
      description: 'AI определяет категорию, цвет и стиль вашей вещи.',
    });

    // AI analysis
    setTimeout(async () => {
      let tags: string[] = ['casual'];
      try {
        const inferred = (await inferProductTagsClient({
          name: file.name,
          category: 'Tops', // Default
<<<<<<< HEAD
        });
=======
        })) as { tags: string[] };
>>>>>>> recover/cabinet-wip-from-stash
        if (inferred.tags.length) tags = inferred.tags;
      } catch (e) {
        console.warn('Tag inference failed', e);
      }

      const newItem: RepoWardrobeItem = {
        id: `cv-${Date.now()}`,
        title: file.name.split('.')[0] || 'Загруженная вещь',
        category: 'Tops',
<<<<<<< HEAD
        brand: 'My Wardrobe',
=======
>>>>>>> recover/cabinet-wip-from-stash
        image: URL.createObjectURL(file),
        tags: tags,
        color: 'white',
      };

      setSelectedWardrobe((prev) => [...prev, newItem]);
      setAllowWithoutWardrobe(false);
      setLoading(false);

      toast({
        title: 'Вещь добавлена',
        description: 'AI успешно распознал футболку белого цвета.',
      });
    }, 2500);
  };

  const runWardrobeAnalysis = async () => {
    if (selectedWardrobe.length === 0) {
      toast({
        title: 'Гардероб пуст',
        description: 'Выберите вещи для анализа.',
      });
      return;
    }

    setIsAnalyzingWardrobe(true);
    try {
<<<<<<< HEAD
      const result = await analyzeWardrobe({
=======
      const result = await analyzeWardrobeClient({
>>>>>>> recover/cabinet-wip-from-stash
        items: selectedWardrobe.map((it) => ({
          title: it.title,
          category: it.category,
          color: it.color,
          tags: it.tags,
        })),
        occasion: occasion,
      });
      setWardrobeAnalysis(result);
    } catch {
      toast({
        title: 'Ошибка анализа',
        description: 'Не удалось проанализировать гардероб.',
      });
    } finally {
      setIsAnalyzingWardrobe(false);
    }
  };

  const runMarketingAnalysis = async () => {
    setIsGeneratingIdeas(true);
    try {
<<<<<<< HEAD
      const result = await generateContentIdeas({
=======
      const result = await generateContentIdeasClient({
>>>>>>> recover/cabinet-wip-from-stash
        brandName: 'Syntha Lab',
        theme: `Коллекция ${season}, стиль ${mood}`,
        channel: 'instagram',
        count: 3,
      });
      setMarketingIdeas(result);
    } catch {
      toast({
        title: 'Ошибка генерации',
        description: 'Не удалось создать идеи контента.',
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const toggleExcludedCategory = (cat: Product['category']) => {
    setPreferences((p) => ({
      ...p,
      excludedCategories: p.excludedCategories?.includes(cat)
        ? p.excludedCategories.filter((x) => x !== cat)
        : [...(p.excludedCategories ?? []), cat],
    }));
  };

  const getFeedbackPreferences = (): StylistPreferences => {
    if (typeof window === 'undefined') return preferences;
    try {
      const likedIds = JSON.parse(localStorage.getItem('syntha_liked_tags') ?? '[]');
      const dislikedIds = JSON.parse(localStorage.getItem('syntha_disliked_tags') ?? '[]');
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
          brand: item.brand ?? 'Syntha',
          category: item.category as RepoWardrobeItem['category'],
          image: item.image,
          tags: item.tags ?? [],
          color: item.color ?? '',
        },
      ];
    });
  };

  async function run() {
    if (includeCategories.length === 0) {
      setError('Выберите хотя бы одну категорию для образа');
      return;
    }
    if (viewRole === 'client' && selectedWardrobe.length === 0 && !allowWithoutWardrobe) {
      setError('Выберите вещь из гардероба или включите «Подобрать с нуля»');
      return;
    }

    setLoading(true);
    setError(null);

    const userContent = chatMessage.trim() || 'Подбери образ';
    const newUserMsg: Message = { role: 'user', content: userContent, timestamp: Date.now() };
    const allMessages: Message[] = [...messages, newUserMsg];
    setMessages(allMessages);
    setChatMessage('');

    try {
      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      const reply = json.reply ?? 'Готово.';
      setMessages((m) => [...m, { role: 'assistant', content: reply, timestamp: Date.now() }]);

      if (json.looks?.length) saveSession(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setChatMessage(userContent);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative space-y-6">
      {/* Voice Assistant Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
<<<<<<< HEAD
                  className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-indigo-500/30 bg-indigo-500/20"
=======
                  className="bg-accent-primary/20 border-accent-primary/30 flex h-40 w-40 items-center justify-center rounded-full border-4"
>>>>>>> recover/cabinet-wip-from-stash
                />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-accent-primary/10 absolute inset-0 h-40 w-40 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic className="h-12 w-12 animate-pulse text-white" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-sm font-black uppercase tracking-tighter text-white">
                  Слушаю...
                </h3>
<<<<<<< HEAD
                <p className="animate-pulse font-mono text-[10px] uppercase tracking-widest text-indigo-400">
=======
                <p className="text-accent-primary animate-pulse font-mono text-[10px] uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Neural_Voice_Processor_Active
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsListening(false)}
                className="mt-4 h-12 rounded-2xl border-white/20 px-8 text-[11px] font-black uppercase text-white hover:bg-white/10"
              >
                Отмена
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification & Wardrobe Analysis Row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {dailyChallenge && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white shadow-xl"
          >
            <div className="absolute -right-4 -top-4 rotate-12 opacity-10 transition-transform duration-700 group-hover:scale-110">
              <Trophy className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="rounded-full border-none bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  CHALLENGE_OF_THE_DAY
                </Badge>
              </div>
              <div>
                <h3 className="mb-1 text-base font-black uppercase leading-none tracking-tight">
                  {dailyChallenge.title}
                </h3>
                <p className="max-w-[200px] text-[11px] leading-relaxed text-white/80">
                  {dailyChallenge.desc}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-amber-200 text-amber-200" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-100">
                    {dailyChallenge.reward}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setMood(dailyChallenge.targetMood as StyleMood);
                    toast({
                      title: 'Вызов принят!',
                      description: 'Режим испытания активирован.',
                    });
                  }}
                  className="h-8 rounded-xl bg-white px-4 text-[9px] font-black uppercase tracking-widest text-orange-600 shadow-lg shadow-black/5 hover:bg-orange-50"
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
<<<<<<< HEAD
          className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/50"
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 transition-transform duration-700 group-hover:scale-110">
            <UserCheck className="h-24 w-24 text-slate-900" />
=======
          className="border-border-subtle group relative overflow-hidden rounded-xl border bg-white p-4 shadow-md shadow-xl"
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 transition-transform duration-700 group-hover:scale-110">
            <UserCheck className="text-text-primary h-24 w-24" />
>>>>>>> recover/cabinet-wip-from-stash
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
<<<<<<< HEAD
                className="border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400"
=======
                className="border-border-default text-text-muted text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              >
                SMART_WARDROBE_AI
              </Badge>
            </div>
            {wardrobeScore ? (
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
<<<<<<< HEAD
                    <div className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
                      Ваш стиль
                    </div>
                    <div className="text-sm font-black uppercase text-slate-900">
=======
                    <div className="text-text-muted mb-0.5 text-[8px] font-black uppercase tracking-widest">
                      Ваш стиль
                    </div>
                    <div className="text-text-primary text-sm font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      {wardrobeScore.style}
                    </div>
                  </div>
                  <div className="text-right">
<<<<<<< HEAD
                    <div className="text-[20px] font-black leading-none text-indigo-600">
                      {wardrobeScore.completeness}%
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
                    <div className="text-accent-primary text-[20px] font-black leading-none">
                      {wardrobeScore.completeness}%
                    </div>
                    <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Полнота капсул
                    </div>
                  </div>
                </div>
<<<<<<< HEAD
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${wardrobeScore.completeness}%` }}
                    className="h-full bg-indigo-500"
=======
                <div className="bg-bg-surface2 h-2 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${wardrobeScore.completeness}%` }}
                    className="bg-accent-primary h-full"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
                <div className="pt-2">
                  <div className="mb-1.5 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-rose-400">
                    <AlertCircle className="h-2 w-2" /> Рекомендуем добавить:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {wardrobeScore.missing.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-rose-100 bg-rose-50 px-2 py-0.5 text-[8px] font-bold uppercase text-rose-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
<<<<<<< HEAD
                <p className="max-w-[220px] text-[11px] leading-relaxed text-slate-500">
=======
                <p className="text-text-secondary max-w-[220px] text-[11px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                  Позвольте ИИ проанализировать ваш текущий гардероб, определить уникальный стиль и
                  найти "пробелы".
                </p>
                <Button
                  onClick={handleAnalyzeFullWardrobe}
                  disabled={isAnalyzingFullWardrobe}
<<<<<<< HEAD
                  className="h-10 w-full gap-2 rounded-xl bg-slate-950 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-black active:scale-95"
=======
                  className="bg-text-primary h-10 w-full gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-black active:scale-95"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  {isAnalyzingFullWardrobe ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
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
<<<<<<< HEAD
          className="group relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-2xl"
=======
          className="bg-text-primary group relative overflow-hidden rounded-xl p-4 text-white shadow-2xl"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
            <Sparkles className="h-24 w-24" />
          </div>
          <div className="relative z-10 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
<<<<<<< HEAD
                <Badge className="rounded-full border-none bg-indigo-500 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white hover:bg-indigo-600">
                  AI_Concierge_Active
                </Badge>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                <Badge className="bg-accent-primary hover:bg-accent-primary rounded-full border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                  AI_Concierge_Active
                </Badge>
                <span className="text-text-muted flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                  Live_Update
                </span>
              </div>
<<<<<<< HEAD
              <p className="max-w-2xl text-sm font-medium italic leading-relaxed text-slate-200">
=======
              <p className="text-text-muted max-w-2xl text-sm font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                "{conciergeAdvice.text}"
              </p>
            </div>
            <Button
              onClick={() => {
                setMood(conciergeAdvice.mood as StyleMood);
                run();
              }}
<<<<<<< HEAD
              className="h-12 shrink-0 rounded-2xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black shadow-xl shadow-white/5 transition-all hover:bg-slate-200 active:scale-95"
=======
              className="hover:bg-bg-surface2 h-12 shrink-0 rounded-2xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black shadow-xl shadow-white/5 transition-all active:scale-95"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Применить совет
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <div className="space-y-2">
            {viewRole === 'b2b' && (
<<<<<<< HEAD
              <div className="mb-8 flex flex-col justify-between gap-3 border-b border-slate-100 pb-6 md:flex-row md:items-center">
=======
              <div className="border-border-subtle mb-8 flex flex-col justify-between gap-3 border-b pb-6 md:flex-row md:items-center">
>>>>>>> recover/cabinet-wip-from-stash
                <div />
                <div className="flex items-center gap-3">
                  <CalendarQuickView role="brand" />
                  <Badge
                    variant="outline"
<<<<<<< HEAD
                    className="rounded-xl border-indigo-100 bg-indigo-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600"
=======
                    className="bg-accent-primary/10 border-accent-primary/20 text-accent-primary rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    B2B_Professional_Mode
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormSelect
                    label="Состав"
                    value={selectedFormat}
                    onChange={handleFormatChange}
                    options={FORMATS}
                  />
                  <FormSelect
                    label="Аудитория"
                    value={audience}
                    onChange={(v) => setAudience(v as Audience)}
                    options={AUDIENCES}
                  />
                  <FormSelect
                    label="Сезон"
                    value={season}
                    onChange={(v) => setSeason(v as Season)}
                    options={SEASONS}
                  />
                  <FormSelect
                    label="Сценарий"
                    value={occasion}
                    onChange={(v) => setOccasion(v as Occasion)}
                    options={OCCASIONS}
                  />
                  <FormSelect
                    label="Стиль"
                    value={mood}
                    onChange={(v) => setMood(v as StyleMood)}
                    options={MOODS}
                  />
                  <FormSelect
                    label="Бюджет AI"
                    value={budgetPreference}
                    onChange={(v) => setBudgetPreference(v as any)}
                    options={[
                      { id: 'economy', label: 'Эконом (Smart)' },
                      { id: 'standard', label: 'Стандарт' },
                      { id: 'premium', label: 'Премиум (Luxury)' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 items-end gap-3">
                  <div className="space-y-3">
<<<<<<< HEAD
                    <label className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Погода (°C)
                      <span className="font-black text-slate-900">
=======
                    <label className="text-text-muted flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                      Погода (°C)
                      <span className="text-text-primary font-black">
>>>>>>> recover/cabinet-wip-from-stash
                        {temperature > 0 ? `+${temperature}` : temperature}°
                      </span>
                    </label>
                    <div className="flex h-11 items-center">
                      <input
                        type="range"
                        min="-20"
                        max="40"
                        step="5"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
<<<<<<< HEAD
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-slate-900"
=======
                        className="bg-bg-surface2 accent-accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
<<<<<<< HEAD
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Макс. Бюджет (₽)
                    </label>
                    <input
                      className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-inner outline-none transition-all placeholder:text-slate-300 focus:border-black"
=======
                    <label className="text-text-muted text-[9px] font-black uppercase tracking-[0.2em]">
                      Макс. Бюджет (₽)
                    </label>
                    <input
                      className="bg-bg-surface2 border-border-subtle text-text-primary placeholder:text-text-muted h-11 w-full rounded-xl border px-4 text-[10px] font-black uppercase tracking-widest shadow-inner outline-none transition-all focus:border-black"
>>>>>>> recover/cabinet-wip-from-stash
                      placeholder="Без лимита"
                      inputMode="numeric"
                      value={budgetMax?.toString() ?? ''}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d]/g, '');
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
<<<<<<< HEAD
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <Shirt className="h-3.5 w-3.5" /> MY_DIGITAL_WARDROBE
                    </label>
                    <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
=======
                    <label className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                      <Shirt className="h-3.5 w-3.5" /> MY_DIGITAL_WARDROBE
                    </label>
                    <div className="bg-bg-surface2 border-border-default flex rounded-lg border p-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                      <button
                        onClick={() => setWardrobeTab('picker')}
                        className={cn(
                          'rounded-md px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all',
                          wardrobeTab === 'picker'
<<<<<<< HEAD
                            ? 'bg-white text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
=======
                            ? 'text-text-primary bg-white shadow-sm'
                            : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        Из архива
                      </button>
                      <button
                        onClick={() => setWardrobeTab('upload')}
                        className={cn(
                          'rounded-md px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all',
                          wardrobeTab === 'upload'
<<<<<<< HEAD
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
=======
                            ? 'text-accent-primary bg-white shadow-sm'
                            : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
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
                            'group relative flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all',
                            personalItemImage
<<<<<<< HEAD
                              ? 'border-indigo-500 bg-indigo-50/50'
                              : 'border-slate-100 hover:border-slate-900 hover:bg-slate-50'
=======
                              ? 'border-accent-primary bg-accent-primary/10'
                              : 'border-border-subtle hover:border-text-primary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                              <span className="text-[9px] font-black uppercase text-indigo-500">
=======
                              <div className="border-accent-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                              <span className="text-accent-primary text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                Neural_Analysis...
                              </span>
                            </div>
                          ) : personalItemImage ? (
                            <>
                              <img
                                src={personalItemImage}
                                className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale-[0.5]"
                              />
                              <div className="relative z-10 flex flex-col items-center gap-1">
<<<<<<< HEAD
                                <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
=======
                                <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                                  Слой_синхронизирован
                                </Badge>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-white drop-shadow-md">
                                  Заменить фото
                                </span>
                              </div>
                            </>
                          ) : (
<<<<<<< HEAD
                            <div className="flex flex-col items-center gap-1 text-slate-400 transition-colors group-hover:text-slate-900">
=======
                            <div className="text-text-muted group-hover:text-text-primary flex flex-col items-center gap-1 transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                              <Plus className="h-5 w-5" />
                              <span className="px-4 text-center text-[9px] font-black uppercase tracking-widest">
                                Загрузить фото вещи
                                <br />
                                для мгновенного подбора
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between">
<<<<<<< HEAD
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
=======
                  <label className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                    <Wind className="h-3.5 w-3.5" /> Prompt-to-Mood (Aesthetic Search)
                  </label>
                  {sessionHistory.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
<<<<<<< HEAD
                          className="h-8 gap-1.5 border-slate-200 text-[9px]"
=======
                          className="border-border-default h-8 gap-1.5 text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <History className="h-3 w-3" />
                          Недавние
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-64 p-2">
<<<<<<< HEAD
                        <div className="mb-2 text-[9px] font-bold uppercase text-slate-500">
=======
                        <div className="text-text-secondary mb-2 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Восстановить параметры
                        </div>
                        {sessionHistory.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => restoreSession(s)}
<<<<<<< HEAD
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[10px] hover:bg-slate-50"
=======
                            className="hover:bg-bg-surface2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <span>
                              {new Date(s.ts).toLocaleDateString('ru', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
<<<<<<< HEAD
                            <span className="text-slate-400">{s.looksCount} образов</span>
=======
                            <span className="text-text-muted">{s.looksCount} образов</span>
>>>>>>> recover/cabinet-wip-from-stash
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <textarea
<<<<<<< HEAD
                      className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 pr-20 text-sm font-medium text-slate-900 shadow-inner outline-none transition-all placeholder:text-slate-300 focus:border-black"
=======
                      className="bg-bg-surface2 border-border-subtle text-text-primary placeholder:text-text-muted min-h-[140px] w-full resize-none rounded-2xl border p-4 pr-20 text-sm font-medium shadow-inner outline-none transition-all focus:border-black"
>>>>>>> recover/cabinet-wip-from-stash
                      placeholder="Опишите эстетику или настроение. Например: 'Завтрак в стиле старых денег в Париже под дождем' или 'Киберпанк-вечеринка в Токио'..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          'h-8 w-8 rounded-lg transition-all',
                          isListening
                            ? 'animate-pulse bg-rose-50 text-rose-500'
<<<<<<< HEAD
                            : 'text-slate-400 hover:text-slate-600'
=======
                            : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                        onClick={toggleListening}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
<<<<<<< HEAD
                        className="h-8 w-8 rounded-lg bg-slate-950 text-white shadow-lg transition-all hover:bg-black active:scale-95"
=======
                        className="bg-text-primary h-8 w-8 rounded-lg text-white shadow-lg transition-all hover:bg-black active:scale-95"
>>>>>>> recover/cabinet-wip-from-stash
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
                        onClick={() => {
                          setIsCapsuleMode(false);
                          run();
                        }}
                        disabled={
                          loading ||
                          (viewRole === 'client' &&
                            selectedWardrobe.length === 0 &&
                            !allowWithoutWardrobe)
                        }
<<<<<<< HEAD
                        className="button-glimmer button-professional h-11 w-fit rounded-2xl border-none !bg-black px-8 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-slate-200/50 hover:!bg-black"
=======
                        className="button-glimmer button-professional h-11 w-fit rounded-2xl border-none !bg-black px-8 text-[11px] font-bold uppercase tracking-widest shadow-md shadow-xl hover:!bg-black"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {loading && !isCapsuleMode ? (
                          <span className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
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
                        onClick={() => {
                          setIsCapsuleMode(true);
                          run();
                        }}
                        disabled={
                          loading ||
                          (viewRole === 'client' &&
                            selectedWardrobe.length === 0 &&
                            !allowWithoutWardrobe)
                        }
                        variant="outline"
<<<<<<< HEAD
                        className="group h-11 w-fit rounded-2xl border-slate-200 px-8 text-[11px] font-bold uppercase tracking-widest text-slate-600 transition-all hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        {loading && isCapsuleMode ? (
                          <span className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600" />
=======
                        className="border-border-default hover:border-accent-primary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary group h-11 w-fit rounded-2xl px-8 text-[11px] font-bold uppercase tracking-widest transition-all"
                      >
                        {loading && isCapsuleMode ? (
                          <span className="flex items-center gap-2">
                            <div className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                            Собираем капсулу...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Собрать капсулу
                            <Layers className="h-4 w-4 transition-transform group-hover:scale-110" />
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

            {viewRole === 'client' && (
<<<<<<< HEAD
              <div className="border-t border-slate-100 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
=======
              <div className="border-border-subtle border-t pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                    <Checkbox
                      checked={allowWithoutWardrobe}
                      onCheckedChange={(v) => setAllowWithoutWardrobe(!!v)}
                    />
                    Свободный поиск (без привязки к вещам)
                  </label>
                </div>
                {!allowWithoutWardrobe && (
                  <div className="mb-3 flex items-center justify-between">
<<<<<<< HEAD
                    <p className="text-[9px] italic text-slate-500">
=======
                    <p className="text-text-secondary text-[9px] italic">
>>>>>>> recover/cabinet-wip-from-stash
                      *Используйте блок «MY_DIGITAL_WARDROBE» выше, чтобы выбрать или загрузить
                      вещь.
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-[10px] font-black uppercase tracking-widest text-red-500">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Ошибка: {error}
              </div>
            )}

            <StylistResults data={data} selectedWardrobe={selectedWardrobe} viewRole={viewRole} />
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <Card className="group/banner relative mt-8 flex min-h-[300px] items-center overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
=======
      <Card className="bg-text-primary group/banner relative mt-8 flex min-h-[300px] items-center overflow-hidden rounded-xl border-none shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000"
            alt="Neural Engine Inventory"
            className="h-full w-full object-cover grayscale"
          />
        </div>
<<<<<<< HEAD
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
=======
        <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
>>>>>>> recover/cabinet-wip-from-stash
        <CardContent className="relative z-10 w-full max-w-4xl space-y-3 p-4 text-white">
          <div className="group/marquee relative mb-2 overflow-hidden whitespace-nowrap border-y border-white/10 py-1.5">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
              className="flex w-fit items-center gap-3"
            >
              {[1, 2].map((i) => (
                <div key={i} className="flex shrink-0 items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Анализ трендов
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Персональный подбор
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Умные рекомендации
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Поиск образов
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Цифровая мода
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase leading-[0.85] tracking-tighter">
              {viewRole === 'b2b' ? 'АНАЛИЗ АССОРТИМЕНТА' : 'ВАШ СТИЛЬ'}
            </h2>
<<<<<<< HEAD
            <p className="whitespace-nowrap border-l-2 border-indigo-500/50 pl-6 text-sm font-medium text-slate-300">
=======
            <p className="text-text-muted border-accent-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              {viewRole === 'b2b'
                ? '"Предиктивная аналитика спроса и оптимизация закупочной корзины."'
                : '"Интеллектуальная синхронизация ваших предпочтений с актуальными коллекциями."'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="button-glimmer button-professional flex h-11 w-fit min-w-[200px] items-center justify-center gap-2 rounded-xl border-none !bg-black px-8 text-[11px] font-black uppercase shadow-none hover:!bg-black"
              >
<<<<<<< HEAD
                <Link href={viewRole === 'b2b' ? '/brand/analytics' : '/u'}>
=======
                <Link href={viewRole === 'b2b' ? '/brand/analytics' : '/client/me'}>
>>>>>>> recover/cabinet-wip-from-stash
                  {viewRole === 'b2b' ? 'Перейти к аналитике' : 'Мой стиль'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              {viewRole === 'b2b' && (
                <Button
                  variant="outline"
                  onClick={runMarketingAnalysis}
                  disabled={isGeneratingIdeas}
                  className="h-11 gap-2 rounded-xl border-white/20 px-6 text-[11px] font-bold uppercase text-white hover:bg-white/10"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingIdeas ? 'Генерация...' : 'Идеи для маркетинга'}
                </Button>
              )}
            </div>

            {viewRole === 'b2b' && marketingIdeas && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
<<<<<<< HEAD
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
=======
                    <MessageSquare className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      AI_Marketing_Toolkit
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMarketingIdeas(null)}
                    className="h-6 text-[8px] uppercase text-white/40 hover:text-white"
                  >
                    Закрыть
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {marketingIdeas.ideas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/20"
                    >
<<<<<<< HEAD
                      <div className="text-[11px] font-black uppercase leading-tight text-indigo-300">
                        {idea.title}
                      </div>
                      <p className="line-clamp-3 text-[10px] leading-relaxed text-slate-400">
=======
                      <div className="text-accent-primary text-[11px] font-black uppercase leading-tight">
                        {idea.title}
                      </div>
                      <p className="text-text-muted line-clamp-3 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                        {idea.caption}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {idea.hashtags?.map((h, i) => (
<<<<<<< HEAD
                          <span key={i} className="text-[8px] text-indigo-400/60">
=======
                          <span key={i} className="text-accent-primary/60 text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                            #{h}
                          </span>
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
<<<<<<< HEAD
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:ring-0">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="border-slate-200 bg-white">
=======
      <label className="text-text-muted text-[9px] font-black uppercase tracking-[0.2em]">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-bg-surface2 border-border-subtle text-text-primary h-11 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-0">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="border-border-default bg-white">
>>>>>>> recover/cabinet-wip-from-stash
          {options.map((o) => (
            <SelectItem
              key={o.id}
              value={o.id}
              className="text-[10px] font-black uppercase tracking-widest"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
