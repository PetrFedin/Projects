'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  Sparkles, 
  Maximize2, 
  Shirt, 
  User, 
  Palette,
  CheckCircle2,
  Info,
  Brain,
  Zap,
  Loader2,
  Heart,
  RefreshCcw,
  ChevronRight,
  ChevronDown,
  Check,
  Camera,
  MapPin,
  Terminal,
  Activity,
  Layers,
  Settings2,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';
import { motion, Reorder } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock Images for AI Generation
const MOCK_LOOK_IMAGES = {
  woman: {
    studio: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    street: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
    editorial: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
  },
  man: {
    studio: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800',
    street: 'https://images.unsplash.com/photo-1488161628813-fa4466f658b3?auto=format&fit=crop&q=80&w=800',
    editorial: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=800'
  },
  boy: {
    studio: 'https://images.unsplash.com/photo-1622244099803-7531845e2f3a?auto=format&fit=crop&q=80&w=800',
    street: 'https://images.unsplash.com/photo-1519457431-75514b723006?auto=format&fit=crop&q=80&w=800',
    editorial: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&q=80&w=800'
  },
  girl: {
    studio: 'https://images.unsplash.com/photo-1621452137023-9c84aa590f88?auto=format&fit=crop&q=80&w=800',
    street: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    editorial: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800'
  }
};

export default function LookBuilderPage() {
  const { toast } = useToast();
  const { addCartItem, addLookboard, addProductToLookboard } = useUIState();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bgRemovedItems, setBgRemovedItems] = useState<string[]>([]);
  
  // New States for Advanced Features
  const [selectedModel, setSelectedModel] = useState<'man' | 'woman' | 'boy' | 'girl'>('woman');
  const [activeModelGroup, setActiveModelGroup] = useState<'adult' | 'child'>('adult');
  const [isGeneratingLook, setIsGeneratingLook] = useState(false);
  const [generatedLookUrl, setGeneratedLookUrl] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // AI Pipeline States
  const [generationStyle, setGenerationStyle] = useState<'studio' | 'street' | 'editorial'>('studio');
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [renderQuality, setFitQuality] = useState(85);

  const GENERATION_STYLES = [
    { id: 'studio', name: 'Studio Editorial', icon: Camera, desc: 'Чистый белый фон, профессиональный свет' },
    { id: 'street', name: 'Street Style', icon: MapPin, desc: 'Городская локация, естественные тени' },
    { id: 'editorial', name: 'Vogue Cover', icon: Globe, desc: 'Высокая контрастность, журнальный рендер' }
  ];

  // Filter state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [showSynthaOnly, setShowSynthaOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { wishlist } = useUIState();

  const brandsList = Array.from(new Set(products.map(p => p.brand))).sort();
  const categoriesList = ['Clothing', 'Footwear', 'Accessories'];

  useEffect(() => {
    // Sync activeModelGroup with selectedModel on mount
    if (selectedModel === 'boy' || selectedModel === 'girl') {
      setActiveModelGroup('child');
    } else {
      setActiveModelGroup('adult');
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const categoryMatch = activeCategories.length === 0 || activeCategories.some(cat => p.category.includes(cat));
    
    // Model/Audience Filter Logic
    let audienceMatch = false;
    if (selectedModel === 'man') {
      audienceMatch = p.audience === 'Мужской' || p.audience === 'Унисекс';
    } else if (selectedModel === 'woman') {
      audienceMatch = p.audience === 'Женский' || p.audience === 'Унисекс';
    } else if (selectedModel === 'boy') {
      audienceMatch = p.audience === 'Детский' || p.audience === 'Мальчики' || p.audience === 'Новорожденные';
    } else if (selectedModel === 'girl') {
      audienceMatch = p.audience === 'Детский' || p.audience === 'Девочки' || p.audience === 'Новорожденные';
    }
    
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const synthaMatch = !showSynthaOnly || (p.isPromoted || (parseInt(p.id) % 3 === 0));
    const favoriteMatch = !showFavoritesOnly || wishlist.some(item => item.id === p.id);

    return categoryMatch && audienceMatch && brandMatch && synthaMatch && favoriteMatch;
  });

  const checkCategoryConflict = (product: Product, currentItems: Product[]) => {
    const name = product.name.toLowerCase();
    const cat = product.category.toLowerCase();
    const subcat = (product.subcategory || '').toLowerCase();

    const isDress = name.includes('платье') || name.includes('dress') || subcat.includes('dress');
    const isSkirt = name.includes('юбка') || name.includes('skirt') || subcat.includes('skirt');
    const isPants = name.includes('брюки') || name.includes('джинсы') || name.includes('pants') || name.includes('jeans') || subcat.includes('pants');
    const isShorts = name.includes('шорты') || name.includes('shorts') || subcat.includes('shorts');
    const isOuterwear = cat.includes('верхняя') || cat.includes('outerwear') || name.includes('куртка') || name.includes('пальто') || name.includes('jacket') || name.includes('coat');
    const isFootwear = cat.includes('обувь') || cat.includes('footwear') || name.includes('кроссовки') || name.includes('ботинки') || name.includes('shoes');

    for (const item of currentItems) {
      const itemName = item.name.toLowerCase();
      const itemCat = item.category.toLowerCase();
      const itemSubcat = (item.subcategory || '').toLowerCase();

      const existingDress = itemName.includes('платье') || itemName.includes('dress') || itemSubcat.includes('dress');
      const existingSkirt = itemName.includes('юбка') || itemName.includes('skirt') || itemSubcat.includes('skirt');
      const existingPants = itemName.includes('брюки') || itemName.includes('джинсы') || itemName.includes('pants') || itemName.includes('jeans') || itemSubcat.includes('pants');
      const existingShorts = itemName.includes('шорты') || itemName.includes('shorts') || itemSubcat.includes('shorts');
      const existingOuterwear = itemCat.includes('верхняя') || itemCat.includes('outerwear') || itemName.includes('куртка') || itemName.includes('пальто') || itemName.includes('jacket') || itemName.includes('coat');
      const existingFootwear = itemCat.includes('обувь') || itemCat.includes('footwear') || itemName.includes('кроссовки') || itemName.includes('ботинки') || itemName.includes('shoes');

      if (isDress && (existingSkirt || existingPants || existingShorts)) return "Нельзя добавить платье, если уже выбрана юбка или брюки.";
      if ((isSkirt || isPants || isShorts) && existingDress) return "Нельзя добавить юбку или брюки к платью.";
      if (isOuterwear && existingOuterwear) return "Можно выбрать только один предмет верхней одежды.";
      if (isFootwear && existingFootwear) return "Можно выбрать только одну пару обуви.";
      if (isPants && (existingShorts || existingPants)) return "Брюки/джинсы конфликтуют с уже выбранным низом.";
      if (isShorts && (existingPants || existingShorts)) return "Шорты конфликтуют с уже выбранным низом.";
    }
    return null;
  };

  const addToLook = (product: Product) => {
    if (selectedItems.find(item => item.id === product.id)) {
      toast({
        title: "Товар уже в образе",
        description: "Вы уже добавили этот предмет на холст.",
        variant: "destructive"
      });
      return;
    }

    const conflictError = checkCategoryConflict(product, selectedItems);
    if (conflictError) {
      toast({
        title: "Конфликт категорий",
        description: conflictError,
        variant: "destructive"
      });
      return;
    }

    setSelectedItems([...selectedItems, product]);
    setGeneratedLookUrl(null);
    toast({
      title: "Добавлено в образ",
      description: `${product.name} успешно добавлен в конструктор.`,
    });
  };

  const generateAILook = () => {
    if (selectedItems.length < 2) {
      toast({
        title: "Мало вещей",
        description: "Добавьте хотя бы 2-3 предмета для генерации образа на модели.",
        variant: "destructive"
      });
      return;
    }

    setRenderStatus('processing');
    setIsGeneratingLook(true);
    setGenerationLogs([]);
    setGeneratedLookUrl(null);

    const logs = [
      "Инициализация AI Pipeline v4.2...",
      "Загрузка текстур выбранных SKU...",
      "Анализ физических свойств ткани...",
      `Подбор освещения под стиль: ${generationStyle.toUpperCase()}`,
      `Масштабирование под модель: ${selectedModel.toUpperCase()}`,
      "Генерация теней и окклюзии...",
      "Neural Fusion: Сборка финального кадра...",
      "DLSS Rendering complete."
    ];

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setGenerationLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        
        // Finalize generation with stability delay
        setTimeout(() => {
          const rawUrl = (MOCK_LOOK_IMAGES as any)[selectedModel][generationStyle];
          const finalUrl = `${rawUrl}&t=${Date.now()}`;
          
          setGeneratedLookUrl(finalUrl);
          setRenderStatus('success');
          setIsGeneratingLook(false);
          setFitQuality(Math.round(Math.random() * 5 + 94));
          
          toast({
            title: "Генерация завершена",
            description: "Ваш образ готов в выбранном стиле.",
          });
        }, 800);
      }
    }, 500);
  };

  const removeFromLook = (productId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== productId));
    setBgRemovedItems(bgRemovedItems.filter(id => id !== productId));
  };

  const totalLookPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleSaveLook = () => {
    if (selectedItems.length === 0) return;
    const newLb = addLookboard(`Look: ${new Date().toLocaleDateString()}`, "Generated from Live Look Builder");
    selectedItems.forEach(item => {
      addProductToLookboard(item, newLb.id);
    });
    toast({
      title: "Look Saved",
      description: "Ваш образ успешно сохранен в профиле.",
    });
  };

  const handleBuyLook = () => {
    selectedItems.forEach(item => {
      addCartItem(item, item.sizes?.[0]?.name || "One Size");
    });
    toast({
      title: "Look added to cart",
      description: `All ${selectedItems.length} items have been added to your bag.`,
    });
  };

  const handleShareLook = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Ссылка на ваш образ скопирована.",
    });
  };

  return (
    <div className="min-h-screen bg-bg-surface2">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-4">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <Badge className="bg-accent-primary text-white border-none mb-3 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
              AI Creative Studio
            </Badge>
            <h1 className="text-sm font-black uppercase tracking-tight text-text-primary leading-none">
              Live Look <span className="text-accent-primary">Builder</span>
            </h1>
            <p className="mt-4 text-text-secondary font-medium max-w-xl">
              Создайте профессиональный образ с помощью нейронного рендеринга. 
              Выберите вещи, настройте стиль съемки и запустите генерацию.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-border-subtle flex mr-4 relative">
              {[
                { id: 'woman', label: 'Женщина', group: 'adult' },
                { id: 'man', label: 'Мужчина', group: 'adult' },
                { id: 'child', label: 'Ребенок', group: 'child' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    if (m.id === 'child') {
                      setActiveModelGroup('child');
                      if (selectedModel !== 'boy' && selectedModel !== 'girl') {
                        setSelectedModel('boy');
                        setSelectedItems([]);
                        setGeneratedLookUrl(null);
                      }
                    } else {
                      setActiveModelGroup('adult');
                      setSelectedModel(m.id as any);
                      setSelectedItems([]);
                      setGeneratedLookUrl(null);
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    (m.id === 'child' ? activeModelGroup === 'child' : selectedModel === m.id) ? "bg-text-primary text-white shadow-lg" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {m.id === 'child' ? <Plus className={cn("h-3 w-3", activeModelGroup === 'child' ? "rotate-45" : "")} /> : <User className="h-3 w-3" />}
                  {m.label}
                </button>
              ))}

              {activeModelGroup === 'child' && (
                <div className="absolute top-full left-0 right-0 mt-2 p-1 bg-white rounded-2xl shadow-xl border border-border-subtle flex animate-in slide-in-from-top-2 duration-300 z-50">
                  {[
                    { id: 'boy', label: 'Мальчик' },
                    { id: 'girl', label: 'Девочка' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedModel(c.id as any);
                        setSelectedItems([]);
                        setGeneratedLookUrl(null);
                      }}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                        selectedModel === c.id ? "bg-accent-primary text-white shadow-md" : "text-text-muted hover:bg-bg-surface2"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={handleSaveLook}
              className="rounded-2xl border-border-default h-12 px-6 font-bold uppercase tracking-widest text-[10px]"
            >
              <Download className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShareLook}
              className="rounded-2xl border-border-default h-12 px-6 font-bold uppercase tracking-widest text-[10px]"
            >
              <Share2 className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-3 items-start">
          {/* Left Side: Controls & Catalog */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Generator Control Panel */}
            <div className="space-y-4">
              <Card className="rounded-xl border-none shadow-2xl bg-text-primary text-white p-4 relative overflow-hidden group">
                <Sparkles className="absolute -right-4 -top-4 h-32 w-32 text-white opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                  <header className="space-y-2">
                    <Badge className="bg-accent-primary text-white border-none font-black text-[8px] uppercase px-2 py-0.5 flex w-fit items-center gap-1">
                      <Settings2 className="h-2 w-2" /> AI Engine v4.2
                    </Badge>
                    <h3 className="text-sm font-black uppercase tracking-tight leading-none italic">Look <br /> Pipeline</h3>
                  </header>

                  <div className="space-y-3">
                    <p className="text-[8px] font-black uppercase text-text-secondary tracking-widest">1. Стиль генерации</p>
                    <div className="grid grid-cols-1 gap-2">
                      {GENERATION_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setGenerationStyle(style.id as any)}
                          className={cn(
                            "p-3 rounded-xl border transition-all text-left group/style flex items-center gap-3",
                            generationStyle === style.id 
                              ? "bg-white/10 border-accent-primary shadow-lg shadow-accent-primary/20" 
                              : "bg-white/5 border-white/5 hover:bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                            generationStyle === style.id ? "bg-accent-primary text-white" : "bg-white/10 text-text-muted"
                          )}>
                            <style.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-tight">{style.name}</p>
                            <p className="text-[8px] font-medium text-text-secondary leading-none mt-0.5">{style.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={generateAILook}
                    disabled={isGeneratingLook || selectedItems.length < 2}
                    className="w-full h-10 bg-white text-text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent-primary hover:text-white transition-all shadow-xl shadow-black/20"
                  >
                    {isGeneratingLook ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-text-primary group-hover:fill-white" />}
                    Запустить рендеринг
                  </Button>
                </div>
              </Card>

              {/* Technical Logs */}
              <Card className="rounded-xl border-none shadow-2xl bg-text-primary text-emerald-500 p-4 relative overflow-hidden group border border-white/5">
                <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Neural Log</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                
                <div className="space-y-2 h-[100px] overflow-y-auto scrollbar-hide font-mono text-[9px] leading-tight">
                  {generationLogs.length === 0 ? (
                    <p className="text-emerald-500/40 italic">Waiting for SKU analysis...</p>
                  ) : (
                    generationLogs.map((log, i) => (
                      <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-emerald-500/30">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                        <span className="text-emerald-400">&gt; {log}</span>
                      </div>
                    ))
                  )}
                  {isGeneratingLook && (
                    <div className="flex gap-2 items-center text-emerald-400 animate-pulse">
                      <span>&gt; processing...</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-500/10 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-emerald-500/40">Confidence</p>
                    <p className="text-xs font-black">{renderQuality}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-emerald-500/40">Steps</p>
                    <p className="text-xs font-black">50/50</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Catalog Card */}
            <div className="bg-white p-4 rounded-xl shadow-xl border border-border-subtle">
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-widest text-xs text-text-primary italic">Inventory: {selectedModel}</h3>
                  <Badge variant="outline" className="text-[8px] font-black border-accent-primary/20 text-accent-primary">v4.0 Ready</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between rounded-xl text-[9px] font-black uppercase tracking-widest h-10 border-border-subtle">
                        {activeCategories.length === 0 ? "Категории" : `Cat (${activeCategories.length})`}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-xl p-1" align="start">
                      {categoriesList.map(cat => (
                        <DropdownMenuCheckboxItem
                          key={cat}
                          checked={activeCategories.includes(cat)}
                          onCheckedChange={(checked) => {
                            setActiveCategories(prev => 
                              checked ? [...prev, cat] : prev.filter(c => c !== cat)
                            );
                          }}
                          className="text-[9px] font-black uppercase tracking-widest rounded-lg"
                        >
                          {cat}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between rounded-xl text-[9px] font-black uppercase tracking-widest h-10 border-border-subtle">
                        {selectedBrands.length === 0 ? "Бренды" : `Brands (${selectedBrands.length})`}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl p-1 max-h-[300px] overflow-y-auto scrollbar-hide" align="end">
                      {brandsList.map(brand => (
                        <DropdownMenuCheckboxItem
                          key={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            setSelectedBrands(prev => 
                              checked ? [...prev, brand] : prev.filter(b => b !== brand)
                            );
                          }}
                          className="text-[9px] font-black uppercase tracking-widest rounded-lg"
                        >
                          {brand}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-bg-surface2 animate-pulse rounded-2xl" />
                  ))
                ) : (
                  filteredProducts.map(product => {
                    const conflictMsg = checkCategoryConflict(product, selectedItems);
                    return (
                      <button
                        key={product.id}
                        disabled={!!conflictMsg}
                        onClick={() => addToLook(product)}
                        className={cn(
                          "group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all text-left bg-bg-surface2",
                          conflictMsg ? "opacity-40 grayscale cursor-not-allowed border-border-subtle" : "border-border-subtle hover:border-accent-primary"
                        )}
                      >
                        <Image
                          src={product.images?.[0]?.url || (product as any).image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                          <p className="text-[7px] font-black uppercase text-white bg-black/40 backdrop-blur-sm p-1 rounded-md truncate">{product.name}</p>
                        </div>
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-2 w-2 text-text-primary" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: Main Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl shadow-2xl border border-border-subtle min-h-[850px] relative overflow-hidden flex flex-col">
              
              {/* Technical Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              <div className="relative z-10 flex flex-col h-full p-4">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-text-primary flex items-center justify-center text-white">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Workspace / {selectedModel.toUpperCase()}</p>
                      <h3 className="text-base font-black uppercase tracking-tight text-text-primary italic">Composition Canvas</h3>
                    </div>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Estimated Total</p>
                        <p className="text-sm font-black text-text-primary italic">{totalLookPrice.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <Button 
                        onClick={handleBuyLook}
                        className="rounded-2xl h-10 px-8 bg-accent-primary hover:bg-accent-primary text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-accent-primary/15"
                      >
                        <Zap className="mr-2 h-4 w-4 fill-white" /> Check Out Look
                      </Button>
                    </div>
                  )}
                </div>

                {selectedItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-40">
                    <div className="h-24 w-24 rounded-xl bg-bg-surface2 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                      <Shirt className="h-10 w-10 text-text-muted" />
                    </div>
                    <h2 className="text-base font-black uppercase tracking-tight text-text-muted italic">
                      Canvas <br /> Waiting
                    </h2>
                    <p className="text-text-muted mt-4 max-w-sm font-medium uppercase text-[10px] tracking-widest">
                      Select items to begin neural fitting process
                    </p>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-3 flex-1 items-start">
                    
                    {/* Selected Items Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {selectedItems.map((item) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={item.id}
                          className="group relative aspect-[3/4] bg-bg-surface2 rounded-xl overflow-hidden border border-border-subtle hover:border-accent-primary/30 shadow-sm transition-all duration-500"
                        >
                          <Image
                            src={item.images?.[0]?.url || (item as any).image}
                            alt={item.name}
                            fill
                            className="object-contain p-4 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => removeFromLook(item.id)}
                              className="h-10 w-10 rounded-2xl bg-white/90 backdrop-blur-sm text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100 duration-500">
                            <p className="text-[8px] font-black uppercase text-accent-primary mb-0.5">{item.brand}</p>
                            <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight truncate">{item.name}</h4>
                          </div>
                        </motion.div>
                      ))}
                      
                      <button 
                        className="aspect-[3/4] rounded-xl border-4 border-dashed border-border-subtle flex flex-col items-center justify-center text-text-muted hover:border-accent-primary/20 hover:text-accent-primary/40 transition-all group"
                        onClick={() => toast({ title: "Continue exploring", description: "Select more items from the catalog." })}
                      >
                        <Plus className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Add SKU</span>
                      </button>
                    </div>

                    {/* AI Preview Area */}
                    <div className="sticky top-0 h-full">
                      <div className="aspect-[3/4] rounded-[3.5rem] bg-text-primary shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-white overflow-hidden relative group/preview">
                        
                        {/* 1. Loading State */}
                        {renderStatus === 'processing' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-text-primary z-[30]">
                            <div className="space-y-4 flex flex-col items-center">
                              <div className="relative">
                                <Loader2 className="h-24 w-24 text-accent-primary animate-spin" />
                                <Activity className="absolute inset-0 m-auto h-8 w-8 text-accent-primary animate-pulse" />
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">Neural Fusion v5.2</p>
                                <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-accent-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 4.5, ease: "linear" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Success State (The Image) */}
                        {renderStatus === 'success' && generatedLookUrl && (
                          <motion.div 
                            key={generatedLookUrl}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-[100] bg-text-primary"
                            style={{ 
                              backgroundImage: `url(${generatedLookUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            {/* Technical Overlays (Always on top) */}
                            <div className="absolute inset-0 z-[110] pointer-events-none">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                              
                              <div className="absolute top-4 left-8 flex flex-col gap-2">
                                <Badge className="bg-accent-primary text-white border-none text-[8px] font-black uppercase py-1 px-3 shadow-xl">
                                  STABLE DIFFUSION v5.2
                                </Badge>
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-none text-[8px] font-black uppercase py-1 px-3">
                                  STYLE: {generationStyle.toUpperCase()}
                                </Badge>
                                <Badge className="bg-emerald-500/80 backdrop-blur-md text-white border-none text-[8px] font-black uppercase py-1 px-3">
                                  CONFIDENCE: {renderQuality}%
                                </Badge>
                              </div>

                              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end pointer-events-auto">
                                <div className="space-y-4">
                                  <div className="flex flex-col gap-1">
                                    <p className="text-[10px] font-black uppercase text-accent-primary tracking-widest italic">Neural Fusion Result</p>
                                    <h4 className="text-base font-black text-white uppercase tracking-tighter italic">Professional Shoot</h4>
                                  </div>
                                  <div className="flex -space-x-3">
                                    {selectedItems.map((item, i) => (
                                      <div key={i} className="h-12 w-12 rounded-full border-2 border-text-primary overflow-hidden bg-white shadow-2xl relative">
                                        <img src={item.images?.[0]?.url || (item as any).image} alt={item.name} className="w-full h-full object-contain p-2" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRenderStatus('idle');
                                    setGeneratedLookUrl(null);
                                  }}
                                  className="rounded-2xl bg-white text-text-primary hover:bg-accent-primary hover:text-white text-[9px] font-black uppercase h-12 px-8 shadow-2xl transition-all"
                                >
                                  <RefreshCcw className="mr-2 h-3 w-3" /> Reset Pipeline
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* 3. Idle State */}
                        {renderStatus === 'idle' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white/20 z-[10]">
                            <div className="space-y-6">
                              <div className="h-32 w-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover/preview:scale-110 transition-transform duration-700">
                                <Sparkles className="h-12 w-12 text-white/20" />
                              </div>
                              <h3 className="text-base font-black uppercase tracking-tight text-white italic">
                                Ready for <br /> Fusion
                              </h3>
                              <p className="max-w-[200px] text-[8px] font-bold uppercase tracking-widest text-white/30 leading-relaxed mx-auto">
                                Click "Запустить рендеринг" to start neural processing
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Advisor Bottom Bar */}
            <Card className="rounded-xl border-none shadow-2xl bg-gradient-to-r from-indigo-900 to-text-primary p-4 text-white relative overflow-hidden group">
              <Brain className="absolute -right-4 -top-4 h-32 w-32 text-white opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="h-20 w-20 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Palette className="h-10 w-10 text-accent-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase">Composition Perfect</Badge>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent-primary italic">Stylist v4.2 Analysis</p>
                  </div>
                  <h4 className="text-base font-black uppercase tracking-tight italic">
                    {selectedItems.length === 0 
                      ? "Ready for Analysis" 
                      : "Balanced Aesthetics"}
                  </h4>
                  <p className="text-xs text-text-muted font-medium max-w-2xl leading-relaxed">
                    {selectedItems.length === 0 
                      ? "Добавьте вещи, чтобы наш алгоритм проанализировал цветовую гармонию, сочетаемость текстур и актуальность силуэта."
                      : "Выбранная комбинация демонстрирует высокую степень цветовой гармонии (94%). Рекомендуем использовать 'Street Style' рендеринг для подчеркивания текстур ткани."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
