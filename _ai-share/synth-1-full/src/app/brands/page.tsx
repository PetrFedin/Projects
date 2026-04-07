
'use client';

import { useState, useMemo, useEffect } from 'react';
import BrandCard from '@/components/brand-card';
import BrandListItem from '@/components/brand-list-item';
import { brands } from '@/lib/placeholder-data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Search, Filter, Globe, ShieldCheck, Activity, Brain, Target, Sparkles, TrendingUp, Zap, MousePointer2, Layers, Info, X, Store, Check, Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { segments as bpiSegments } from '@/lib/bpi-matrix-data';
import { useUIState } from '@/providers/ui-state';
import allProductsData from '@/lib/products';
import { PartnershipDialog } from '@/components/brand/PartnershipDialog';
import { AnalysisDialog } from '@/components/brand/AnalysisDialog';
import { B2BPartnershipDiscovery } from '@/components/brand/partnership-discovery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function BrandsPage() {
  const { 
    followedBrands: globalFollowed = [], 
    favoriteBrands: globalFavorites = [], 
    partnershipRequests = {},
    toggleFollowBrand, 
    toggleFavoriteBrand,
    sendPartnershipRequest,
    viewRole,
    setViewRole
  } = useUIState();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeFilterGroup, setActiveFilterGroup] = useState<string | null>(null);
  const [activeSegments, setActiveSegments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSegmentDirectory, setShowSegmentDirectory] = useState(false);
  const [showBrandSelector, setShowBrandSelector] = useState(false);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [activeGlobalFilter, setActiveGlobalFilter] = useState<'all' | 'followed' | 'favorites'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('Все');
  const [products, setProducts] = useState<Product[]>(allProductsData);
  const [displaySettings, setDisplaySettings] = useState<any>(null);
  const [partnershipBrand, setPartnershipBrand] = useState<{ id: string, name: string } | null>(null);
  const [analysisBrand, setAnalysisBrand] = useState<{ id: string, name: string } | null>(null);

  const segmentStats = useMemo(() => {
    const stats: Record<string, number> = {};
    brands.forEach(brand => {
      if (brand.segment) {
        stats[brand.segment] = (stats[brand.segment] || 0) + 1;
      }
    });
    return stats;
  }, []);

  useEffect(() => {
    async function fetchData() {
        try {
            const [productsRes, settingsRes] = await Promise.all([
                fetch('/data/products.json'),
                fetch('/data/brand-display-data.json')
            ]);
            const productsData: Product[] = await productsRes.json();
            const settingsData = await settingsRes.json();
            setProducts(productsData);

            const initialSettings: Record<string, Record<string, boolean>> = { grid: {}, list: {} };
            settingsData.parameters.forEach((group: any) => {
                group.items.forEach((item: any) => {
                    initialSettings.grid[item.id] = !!item.grid;
                    initialSettings.list[item.id] = !!item.list;
                });
            });
            setDisplaySettings(initialSettings);

        } catch (error) {
            console.error("Failed to fetch data for brands page:", error);
        }
    }
    fetchData();
  }, []);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const russianAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  const numbers = '0123456789'.split('');
  
  const filterGroups = {
      '0-9': numbers,
      'A-Z': alphabet,
      'А-Я': russianAlphabet
  }

  const handleFilterClick = (letter: string) => {
    setActiveLetter(prev => prev === letter ? null : letter);
  }

  const handleGroupClick = (group: string) => {
    setActiveFilterGroup(prev => prev === group ? null : group);
    setActiveLetter(null);
  }

  const handlePartnershipClick = (brandId: string, brandName: string) => {
    setPartnershipBrand({ id: brandId, name: brandName });
  }

  const handleAnalysisClick = (brandId: string, brandName: string) => {
    setAnalysisBrand({ id: brandId, name: brandName });
  }

  const filteredBrands = useMemo(() => {
    let result = brands;
    
    // Category filtering
    if (categoryFilter !== 'Все') {
        const brandsWithCategoryProducts = result.filter(brand => {
            const brandProducts = products.filter(p => p.brand === brand.name);
            return brandProducts.some(p => {
                if (categoryFilter === 'Женщинам') return p.gender === 'women' || p.gender === 'unisex';
                if (categoryFilter === 'Мужчинам') return p.gender === 'men' || p.gender === 'unisex';
                if (categoryFilter === 'Детям') return p.gender === 'kids' || p.category === 'Детям';
                if (categoryFilter === 'Beauty') return p.category === 'Beauty' || p.category === 'Красота';
                if (categoryFilter === 'Home') return p.category === 'Home' || p.category === 'Дом';
                return false;
            });
        });
        result = brandsWithCategoryProducts;
    }

    if (searchQuery) {
        result = result.filter(brand => 
            brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.nameRU?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (activeLetter) {
        result = result.filter(brand => {
            const nameToTest = brand.name;
            return nameToTest.toUpperCase().startsWith(activeLetter) || (!isNaN(parseInt(activeLetter, 10)) && nameToTest.startsWith(activeLetter));
        });
    }

    if (activeSegments.length > 0) {
        result = result.filter(brand => brand.segment && activeSegments.includes(brand.segment));
    }

    if (selectedBrandIds.length > 0) {
        result = result.filter(brand => selectedBrandIds.includes(brand.id));
    }

    if (activeGlobalFilter === 'followed') {
        if (viewRole === 'b2b') {
            result = result.filter(brand => partnershipRequests[brand.id] === 'accepted');
        } else {
            result = result.filter(brand => globalFollowed.includes(brand.id));
        }
    } else if (activeGlobalFilter === 'favorites') {
        result = result.filter(brand => globalFavorites.includes(brand.id));
    }

    return [...result].sort((a, b) => {
        const aFollowed = viewRole === 'b2b' ? partnershipRequests?.[a.id] === 'accepted' : globalFollowed?.includes(a.id);
        const bFollowed = viewRole === 'b2b' ? partnershipRequests?.[b.id] === 'accepted' : globalFollowed?.includes(b.id);
        if (aFollowed && !bFollowed) return -1;
        if (!aFollowed && bFollowed) return 1;

        const aFavorite = globalFavorites?.includes(a.id);
        const bFavorite = globalFavorites?.includes(b.id);
        if (aFavorite && !bFavorite) return -1;
        if (!aFavorite && bFavorite) return 1;

        return 0;
    });
  }, [activeLetter, searchQuery, activeSegments, selectedBrandIds, activeGlobalFilter, globalFollowed, globalFavorites, brands, partnershipRequests, viewRole, categoryFilter, products]);

  return (
    <div className="min-h-screen bg-bg-canvas relative overflow-hidden group/section">
      {/* OS Background Elements */}
      <div className="absolute inset-0 os-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 os-calibration-grid opacity-[0.03] pointer-events-none" />
      
      {/* System Pulse Ticker - Unified */}
      <div className="relative z-50 bg-black text-white h-8 overflow-hidden flex items-center border-b border-white/10">
        <div className="flex items-center gap-3 px-6 shrink-0 border-r border-white/20 bg-black h-full">
          <Activity className="h-3 w-3 animate-pulse text-accent-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white">ПУЛЬС</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="flex flex-row items-center gap-3 animate-pulse-marquee whitespace-nowrap w-max">
            {[
              "ЛОГ: Nordic Wool обновили оптовый каталог (Осень-Зима 26)",
              "AI_STRATEGY: Высокий спрос на 'Activewear' в B2B сегменте (+12.4%)",
              "СИСТЕМА: Обработано 5 новых запросов на партнерство",
              "MARKET: 92% положительных откликов на новый индекс BPI",
              "АНАЛИТИКА: Рост сегмента Contemporary составил +14.2%",
              "RETAIL: Топовый хаб активности: Moscow_North",
              "ОС_ОБНОВЛЕНИЕ: Алгоритм мэтчинга оптимизирован до v4.2",
              "B2B_LOG: Nordic Wool подтвердили участие в осенней сессии заказов"
            ].map((msg, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className="h-1 w-1 rounded-full bg-accent-primary" />
                <span className="text-[10px] font-mono uppercase tracking-tighter text-white/70">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative OS elements */}
      <div className="os-side-tab group-hover/section:opacity-20">DIRECTORY_BRANDS</div>
      <div className="os-kernel-overlay flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-state-success" />
          <span className="text-[8px] font-mono text-text-muted">LINK_STATUS: STABLE</span>
        </div>
        <div className="os-hex-chip">0xBRND</div>
      </div>

      <div className="relative z-10 container max-w-[1600px] py-12 space-y-6">
        {viewRole === 'b2b' && <B2BPartnershipDiscovery />}

        {/* Header Section */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-border-default pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                <Store className="h-5 w-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary to-accent-hover opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase border-border-strong px-2 py-0.5 bg-bg-surface/50 text-text-primary">
                {viewRole === "b2b" ? "PARTNERS_b2b" : "PARTNERS_b2c"}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <h1 className="text-sm md:text-sm font-headline font-black tracking-tight text-text-primary uppercase">
                  {viewRole === "b2b" ? "ПАРТНЕРЫ" : "БРЕНДЫ"}
                </h1>
              </div>
              <p className="text-text-secondary text-sm max-w-2xl font-light">
                Глобальная экосистема авторизованных партнеров.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[320px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input 
                placeholder="Поиск по названию или ID..." 
                className="pl-10 bg-bg-surface border-border-strong focus:ring-accent-primary/20 h-11 text-sm font-mono"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">
                Отобрано: {filteredBrands.length} / {brands.length}
              </span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8 rounded-md transition-all", viewMode === 'grid' ? "bg-bg-surface shadow-sm border border-border-default" : "opacity-40")}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8 rounded-md transition-all", viewMode === 'list' ? "bg-bg-surface shadow-sm border border-border-default" : "opacity-40")}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto w-full px-4">
          {['Все', 'Женщинам', 'Мужчинам', 'Детям', 'Beauty', 'Home'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "flex-1 px-2 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all whitespace-nowrap border flex items-center justify-center gap-1.5 group min-w-[120px]",
                categoryFilter === cat 
                  ? "bg-black text-white border-black shadow-lg button-glimmer" 
                  : "bg-white text-slate-400 hover:text-slate-600 border-slate-200"
              )}
            >
              <span className="truncate">
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Navigation */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary View Filters */}
              <div className="flex items-center gap-1 p-1 bg-bg-surface2/50 border border-border-subtle rounded-xl w-fit">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-8 rounded-lg font-mono text-[9px] uppercase tracking-widest px-4 transition-all",
                    activeGlobalFilter === 'all' ? "bg-bg-surface shadow-sm text-text-primary border border-border-default" : "text-text-muted hover:text-text-primary"
                  )}
                  onClick={() => setActiveGlobalFilter('all')}
                >
                  Все
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-8 rounded-lg font-mono text-[9px] uppercase tracking-widest px-4 transition-all flex items-center gap-2",
                    activeGlobalFilter === 'followed' ? "bg-bg-surface shadow-sm text-text-primary border border-border-default" : "text-text-muted hover:text-text-primary"
                  )}
                  onClick={() => setActiveGlobalFilter('followed')}
                >
                  <Check className="h-3 w-3" />
                  {viewRole === 'b2b' ? "Партнеры" : "Подписки"}
                  {viewRole === 'b2b' ? (
                    Object.values(partnershipRequests).filter(s => s === 'accepted').length > 0 && (
                      <span className="ml-1 text-[8px] opacity-60">
                        ({Object.values(partnershipRequests).filter(s => s === 'accepted').length})
                      </span>
                    )
                  ) : (
                    globalFollowed.length > 0 && (
                      <span className="ml-1 text-[8px] opacity-60">({globalFollowed.length})</span>
                    )
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-8 rounded-lg font-mono text-[9px] uppercase tracking-widest px-4 transition-all flex items-center gap-2",
                    activeGlobalFilter === 'favorites' ? "bg-bg-surface shadow-sm text-text-primary border border-border-default" : "text-text-muted hover:text-text-primary"
                  )}
                  onClick={() => setActiveGlobalFilter('favorites')}
                >
                  <Heart className="h-3 w-3" />
                  Избранное
                  {globalFavorites.length > 0 && <span className="ml-1 text-[8px] opacity-60">({globalFavorites.length})</span>}
                </Button>
              </div>

              {/* Brand Selection Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "h-10 rounded-xl font-mono text-[10px] uppercase tracking-tighter gap-2 px-4",
                  selectedBrandIds.length > 0 ? "border-accent-primary text-accent-primary bg-accent-soft" : "border-border-strong hover:bg-bg-surface2"
                )}
                onClick={() => setShowBrandSelector(true)}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                {selectedBrandIds.length > 0 ? `Выбрано: ${selectedBrandIds.length}` : "Выбор брендов"}
              </Button>

              {selectedBrandIds.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-text-muted hover:text-state-error"
                  onClick={() => setSelectedBrandIds([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {/* Segment Directory Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "h-10 rounded-xl font-mono text-[10px] uppercase tracking-tighter gap-2 px-4",
                  activeSegments.length > 0 ? "border-accent-primary text-accent-primary bg-accent-soft" : "border-border-strong hover:bg-bg-surface2"
                )}
                onClick={() => setShowSegmentDirectory(true)}
              >
                <Layers className="h-3.5 w-3.5" />
                {activeSegments.length > 0 ? `Сегменты: ${activeSegments.length}` : "Справочник сегментов"}
              </Button>
              
              {activeSegments.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-text-muted hover:text-state-error"
                  onClick={() => setActiveSegments([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Alphabetical Filter Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-surface2 border border-border-subtle rounded-lg">
                <Filter className="h-3 w-3 text-text-muted" />
                <span className="text-[10px] font-mono font-bold text-text-secondary uppercase whitespace-nowrap">АЛФАВИТ</span>
              </div>
              <div className="flex items-center gap-1">
                {Object.keys(filterGroups).map(groupName => (
                  <button
                    key={groupName}
                    onClick={() => handleGroupClick(groupName)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all border shrink-0 uppercase tracking-tighter",
                      activeFilterGroup === groupName 
                        ? "bg-text-primary text-text-inverse border-text-primary shadow-md" 
                        : "bg-bg-surface text-text-secondary border-border-strong hover:border-text-primary"
                    )}
                  >
                    {groupName}
                  </button>
                ))}
              </div>
            </div>
        </div>
        
        <AnimatePresence>
          {activeFilterGroup && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
                <div className="p-4 bg-bg-surface/50 border border-border-subtle rounded-2xl backdrop-blur-sm flex flex-wrap gap-1.5">
                {filterGroups[activeFilterGroup as keyof typeof filterGroups].map(letter => (
                    <button 
                    key={letter}
                    onClick={() => handleFilterClick(letter)}
                      className={cn(
                        "h-8 w-8 flex items-center justify-center rounded-lg text-[11px] font-mono transition-all border",
                        activeLetter === letter 
                          ? "bg-accent-primary text-white border-accent-primary shadow-sm" 
                          : "bg-bg-surface text-text-muted border-border-subtle hover:border-border-strong hover:text-text-primary"
                      )}
                  >
                    {letter}
                    </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
        {/* Main Content Area */}
        <div className={cn(
          "relative",
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            : "flex flex-col gap-3"
        )}>
          {filteredBrands.map((brand, idx) => {
             const productCount = products.filter(p => p.brand === brand.name).length;
             return (
               <motion.div
                 key={brand.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.03 }}
                 className="group/card relative"
               >
                 <div className="os-bracket-tl absolute -top-1 -left-1 w-3 h-3 border-t border-l border-border-strong opacity-0 group-hover/card:opacity-100 transition-opacity" />
                 <div className="os-bracket-tr absolute -top-1 -right-1 w-3 h-3 border-t border-r border-border-strong opacity-0 group-hover/card:opacity-100 transition-opacity" />
                 
                 {viewMode === 'grid' ? (
                   <BrandCard 
                    brand={brand} 
                    productCount={productCount} 
                    displaySettings={displaySettings?.grid} 
                    viewRole={viewRole} 
                    onPartnershipClick={handlePartnershipClick}
                    onAnalysisClick={handleAnalysisClick}
                   />
                 ) : (
                   <BrandListItem 
                    brand={brand} 
                    productCount={productCount} 
                    displaySettings={displaySettings?.list} 
                    viewRole={viewRole} 
                    onPartnershipClick={handlePartnershipClick}
                    onAnalysisClick={handleAnalysisClick}
                   />
                 )}
               </motion.div>
             );
          })}
        </div>

        {/* No Results Fallback */}
        {filteredBrands.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-3xl bg-bg-surface/30">
            <div className="h-12 w-12 rounded-full bg-bg-surface2 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-text-muted opacity-20" />
            </div>
            <h3 className="text-base font-headline font-bold text-text-primary">Совпадений не найдено</h3>
            <p className="text-text-muted mt-2">Попробуйте изменить параметры поиска или фильтрации</p>
              <Button 
                variant="outline" 
                className="mt-6 font-mono text-[10px] uppercase tracking-widest h-9"
                onClick={() => {
                  setSearchQuery('');
                  setActiveLetter(null);
                  setActiveFilterGroup(null);
                  setSelectedBrandIds([]);
                  setActiveSegments([]);
                  setCategoryFilter('Все');
                }}
              >
                Сбросить все фильтры
          </Button>
          </div>
        )}

        {/* Footer Metrics - Density Pattern */}
        <div className="pt-12 border-t border-border-subtle">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Авторизованных брендов', value: brands.length, icon: ShieldCheck },
              { label: 'B2B Операций / 24ч', value: '1.2k', icon: Activity },
              { label: 'AI Анализ активен', value: '100%', icon: Brain },
              { label: 'Время отклика узла', value: '14ms', icon: Zap }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-text-muted">
                  <stat.icon className="h-3 w-3" />
                  <span className="text-[10px] font-mono uppercase tracking-tight">{stat.label}</span>
                </div>
                <div className="text-sm font-headline font-black text-text-primary tabular">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Directory Dialog */}
      <Dialog open={showSegmentDirectory} onOpenChange={setShowSegmentDirectory}>
        <DialogContent className="max-w-[90vw] w-[800px] bg-bg-surface border-border-strong rounded-3xl overflow-hidden p-0">
          <DialogHeader className="p-4 bg-bg-surface2 border-b border-border-subtle relative overflow-hidden">
            <div className="absolute inset-0 os-grid-bg opacity-20 pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent-primary" />
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest bg-white/50 border-border-strong">BPI_MATRIX_CLASSIFIER</Badge>
              </div>
              <DialogTitle className="text-base font-headline font-black uppercase tracking-tight text-text-primary">
                Справочник Сегментов
              </DialogTitle>
              <DialogDescription className="text-text-secondary text-sm font-light">
                Классификация брендов на основе матрицы BPI (Brand Performance Index). Выбрать можно несколько сегментов и каждый выбранный будет выделен зеленым. Если нажать повторно на сегмент, он становится обычного цвета и выбор снимается.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-bg-canvas/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bpiSegments.map((segment) => {
                const brandCount = segmentStats[segment.name] || 0;
                const isOccupied = brandCount > 0;
                const isSelected = activeSegments.includes(segment.name);
                return (
                  <button
                    key={segment.code}
                    disabled={!isOccupied}
                    onClick={() => {
                      if (!isOccupied) return;
                      setActiveSegments(prev => 
                        prev.includes(segment.name) 
                          ? prev.filter(s => s !== segment.name) 
                          : [...prev, segment.name]
                      );
                    }}
                    className={cn(
                      "flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 group/seg relative",
                      isSelected 
                        ? "bg-emerald-100 border-emerald-500 shadow-lg shadow-emerald-500/10" 
                        : isOccupied 
                          ? "bg-bg-surface border-border-subtle hover:border-accent-primary hover:shadow-md cursor-pointer"
                          : "bg-bg-surface2/50 border-border-subtle/50 opacity-40 cursor-not-allowed grayscale"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2 w-full">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          "font-mono text-[9px] px-1.5 py-0",
                          isSelected ? "border-emerald-500 text-emerald-700 bg-emerald-500/10" : "border-border-strong text-text-muted"
                        )}>
                          {segment.code}
                        </Badge>
                        {!isOccupied ? (
                          <Badge variant="outline" className="bg-text-muted/5 text-text-muted/40 border-text-muted/10 text-[7px] uppercase font-black tracking-widest px-1.5 py-0">ПУСТО</Badge>
                        ) : (
                          <Badge variant="outline" className={cn(
                            "text-[7px] uppercase font-black tracking-widest px-2 py-0.5 border-none rounded-lg",
                            isSelected ? "bg-emerald-500 text-white" : "bg-accent-primary/10 text-accent-primary"
                          )}>
                            {brandCount} {brandCount === 1 ? 'бренд' : brandCount < 5 ? 'бренда' : 'брендов'}
                          </Badge>
                        )}
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest",
                        isSelected 
                          ? "text-emerald-600" 
                          : isOccupied 
                            ? "text-text-muted group-hover/seg:text-accent-primary"
                            : "text-text-muted/40"
                      )}>
                        {segment.group}
                      </span>
                    </div>
                    <h4 className={cn(
                      "text-sm font-headline font-bold uppercase tracking-tight mb-1",
                      isSelected ? "text-slate-900" : "text-text-primary"
                    )}>
                      {segment.name}
                    </h4>
                    <p className={cn(
                      "text-[11px] leading-relaxed line-clamp-2",
                      isSelected ? "text-slate-700" : "text-text-secondary"
                    )}>
                      {segment.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 bg-bg-surface border-t border-border-subtle flex justify-end">
            <Button 
              className="h-12 px-10 rounded-2xl font-mono text-[10px] uppercase tracking-widest transition-all duration-500 button-glimmer button-professional !bg-black hover:!bg-black shadow-xl shadow-slate-200/50 border-none text-white"
              onClick={() => setShowSegmentDirectory(false)}
            >
              {activeSegments.length > 0 ? (
                <div className="flex items-center gap-2">
                  Сохранить выбор ({activeSegments.length})
                  <Check className="h-3.5 w-3.5" />
                </div>
              ) : "Закрыть реестр"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Brand Selector Dialog */}
      <Dialog open={showBrandSelector} onOpenChange={setShowBrandSelector}>
        <DialogContent className="max-w-[90vw] w-[600px] bg-bg-surface border-border-strong rounded-3xl overflow-hidden p-0">
          <DialogHeader className="p-4 bg-bg-surface2 border-b border-border-subtle relative overflow-hidden">
            <div className="absolute inset-0 os-grid-bg opacity-20 pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-accent-primary" />
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest bg-white/50 border-border-strong">BRAND_FILTER_v2</Badge>
              </div>
              <DialogTitle className="text-base font-headline font-black uppercase tracking-tight text-text-primary">
                Выбор Брендов
              </DialogTitle>
              <DialogDescription className="text-text-secondary text-sm font-light">
                Выберите конкретные бренды из списка для фильтрации основного вида.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar bg-bg-canvas/30">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 pb-4 border-b border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-text-muted uppercase">Быстрый выбор</span>
                  <button 
                    className="text-[10px] font-mono text-accent-primary uppercase hover:underline"
                    onClick={() => setSelectedBrandIds([])}
                  >
                    Очистить всё
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 flex-1 rounded-lg font-mono text-[9px] uppercase tracking-tighter gap-2 hover:bg-accent-soft hover:text-accent-primary transition-all"
                    onClick={() => {
                      const followedIds = brands.filter(b => globalFollowed.includes(b.id)).map(b => b.id);
                      setSelectedBrandIds(prev => Array.from(new Set([...prev, ...followedIds])));
                    }}
                  >
                    <Check className="h-3 w-3" />
                    Выбрать подписки ({globalFollowed.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 flex-1 rounded-lg font-mono text-[9px] uppercase tracking-tighter gap-2 hover:bg-state-error/10 hover:text-state-error transition-all"
                    onClick={() => {
                      const favoriteIds = brands.filter(b => globalFavorites.includes(b.id)).map(b => b.id);
                      setSelectedBrandIds(prev => Array.from(new Set([...prev, ...favoriteIds])));
                    }}
                  >
                    <Heart className="h-3 w-3" />
                    Выбрать избранное ({globalFavorites.length})
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase block mb-2">Список авторизованных участников</span>
                {brands.map((brand) => {
                  const isSelected = selectedBrandIds.includes(brand.id);
                  return (
                    <div 
                      key={brand.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-2xl border transition-all group cursor-pointer",
                        isSelected 
                          ? "bg-emerald-50/50 border-emerald-500/30" 
                          : "bg-bg-surface border-border-subtle hover:border-accent-primary/30"
                      )}
                      onClick={() => {
                        setSelectedBrandIds(prev => 
                          prev.includes(brand.id) 
                            ? prev.filter(id => id !== brand.id) 
                            : [...prev, brand.id]
                        );
                      }}
                    >
                      <div 
                        className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-all duration-300",
                          isSelected 
                            ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20" 
                            : "border-border-strong bg-white"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={4} />}
                      </div>
                      <div className="flex items-center gap-3 flex-grow">
                        <div className="w-8 h-8 rounded-lg border border-border-subtle bg-bg-surface2 flex items-center justify-center overflow-hidden shrink-0">
                          {brand.logo?.url ? (
                            <img src={brand.logo.url} alt={brand.name} className="w-full h-full object-contain p-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <span className="text-[10px] font-bold text-text-muted">{brand.name[0]}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-headline font-bold text-text-primary uppercase tracking-tight">{brand.name}</span>
                          <span className="text-[9px] font-mono text-text-muted uppercase">{brand.segment || 'No Segment'}</span>
                        </div>
                      </div>
                    </div>
                  );
        })}
      </div>
            </div>
          </div>
          
          <div className="p-4 bg-bg-surface border-t border-border-subtle flex justify-between items-center">
            <span className="text-[10px] font-mono text-text-muted uppercase">
              Выбрано: <span className="text-accent-primary font-bold">{selectedBrandIds.length}</span>
            </span>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="font-mono text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl hover:bg-bg-surface2"
                onClick={() => setShowBrandSelector(false)}
              >
                Отмена
              </Button>
              <Button 
                className="font-mono text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl bg-black text-white hover:bg-slate-900"
                onClick={() => setShowBrandSelector(false)}
              >
                Применить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PartnershipDialog 
        isOpen={!!partnershipBrand}
        onOpenChange={(open) => !open && setPartnershipBrand(null)}
        brandName={partnershipBrand?.name || ''}
        brandId={partnershipBrand?.id || ''}
        status={partnershipBrand ? (partnershipRequests[partnershipBrand.id] || 'none') : 'none'}
        onSend={(id) => {
          sendPartnershipRequest(id);
        }}
      />

      <AnalysisDialog 
        isOpen={!!analysisBrand}
        onOpenChange={(open) => !open && setAnalysisBrand(null)}
        brandName={analysisBrand?.name || ''}
        brandId={analysisBrand?.id || ''}
        viewRole={viewRole}
      />
    </div>
  );
}
