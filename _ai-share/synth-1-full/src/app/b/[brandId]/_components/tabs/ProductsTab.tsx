'use client';

import React from 'react';
import Image from 'next/image';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
    Check, ArrowRight, Users, Sparkles, Layers, Palette, 
    Ruler, Trophy, Sliders, Filter, LayoutGrid, List, Search 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/product-card';
import ProductListItem from '@/components/product-list-item';

export type AudienceFilter = 
  | 'Все' 
  | 'Взрослые - Женщины' 
  | 'Взрослые - Мужчины' 
  | 'Взрослые - Унисекс' 
  | 'Дети - Девочки' 
  | 'Дети - Мальчики' 
  | 'Дети - Новорожденные' 
  | 'Дети - Унисекс' 
  | 'Non-Fashion';

interface ProductsTabProps {
    activeTopCatalog: string;
    setActiveTopCatalog: (val: string) => void;
    setFilterOutlet: (val: string[]) => void;
    capsuleCollections: { id: string; label: string; desc: string }[];
    activeCapsule: string | null;
    setActiveCapsule: (id: string | null) => void;
    filterAvailability: string[];
    setFilterAvailability: React.Dispatch<React.SetStateAction<string[]>>;
    activeTopAudience: string;
    setActiveTopAudience: (val: string) => void;
    setActiveAudience: React.Dispatch<React.SetStateAction<AudienceFilter[]>>;
    setFilterCategory: React.Dispatch<React.SetStateAction<string[]>>;
    setFilterAttributes: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    setFilterColor: React.Dispatch<React.SetStateAction<string[]>>;
    setFilterSizes: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedSizeRow: (val: any) => void;
    isFilterSidebarOpen: boolean;
    setIsFilterSidebarOpen: (val: boolean) => void;
    activeAudience: AudienceFilter[];
    filterCategory: string[];
    categoriesData: any;
    getAllowedCategories: string[];
    filterColor: string[];
    colorsData: any[];
    selectedSizeRow: any;
    activeSizeChart: any[];
    measurementLabels: Record<string, string>;
    filterAttributes: Record<string, string[]>;
    attributesData: any[];
    getAllowedAttributes: string[];
    filteredProducts: any[];
    viewMode: 'grid' | 'list';
    setViewMode: (val: 'grid' | 'list') => void;
    setIsAiSizeDialogOpen: (val: boolean) => void;
    displayName: string;
}

export function ProductsTab({
    activeTopCatalog,
    setActiveTopCatalog,
    setFilterOutlet,
    capsuleCollections,
    activeCapsule,
    setActiveCapsule,
    filterAvailability,
    setFilterAvailability,
    activeTopAudience,
    setActiveTopAudience,
    setActiveAudience,
    setFilterCategory,
    setFilterAttributes,
    setFilterColor,
    setFilterSizes,
    setSelectedSizeRow,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    activeAudience,
    filterCategory,
    categoriesData,
    getAllowedCategories,
    filterColor,
    colorsData,
    selectedSizeRow,
    activeSizeChart,
    measurementLabels,
    filterAttributes,
    attributesData,
    getAllowedAttributes,
    filteredProducts,
    viewMode,
    setViewMode,
    setIsAiSizeDialogOpen,
    displayName
}: ProductsTabProps) {
    return (
        <TabsContent value="products" className="animate-in fade-in duration-500 pt-4">
            {/* Top Catalog Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar">
                {[
                    { label: 'Все', value: 'all' },
                    { label: 'АССОРТИМЕНТ', value: 'marketplace' },
                    { label: 'Аутлет', value: 'outlet' }
                ].map(opt => (
                    <Button
                        key={opt.value}
                        variant={activeTopCatalog === opt.value ? 'default' : 'outline'}
                        className={cn(
                            "rounded-xl h-9 text-[11px] font-black uppercase tracking-wider transition-all border",
                            opt.label === 'Все' ? "min-w-[60px]" : "min-w-[120px]",
                            activeTopCatalog === opt.value
                                ? "bg-black text-white border-black shadow-lg" 
                                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm"
                        )}
                        onClick={() => {
                            setActiveTopCatalog(opt.value);
                            if (opt.value === 'all') {
                                setFilterOutlet(['marketplace', 'outlet']);
                            } else {
                                setFilterOutlet([opt.value]);
                            }
                        }}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>

            {/* Capsule Collections & Shop the Look */}
            {activeTopCatalog !== 'outlet' && (
                <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar custom-scrollbar mb-2">
                    {capsuleCollections.map(capsule => (
                        <div 
                            key={capsule.id}
                            className={cn(
                                "min-w-[200px] p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                                activeCapsule === capsule.id 
                                    ? "border-accent bg-accent/5 shadow-md" 
                                    : "border-muted/20 bg-white hover:border-accent/30"
                            )}
                            onClick={() => setActiveCapsule(activeCapsule === capsule.id ? null : capsule.id)}
                        >
                            {activeCapsule === capsule.id && (
                                <div className="absolute top-2 right-2">
                                    <Check className="h-3 w-3 text-accent" />
                                </div>
                            )}
                            <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-1">Капсула</p>
                            <h4 className="text-sm font-black uppercase tracking-tight">{capsule.label}</h4>
                            <p className="text-[10px] text-muted-foreground font-medium mt-1">{capsule.desc}</p>
                        </div>
                    ))}
                    {/* Shop the Look Card */}
                    <div className="min-w-[280px] p-4 rounded-2xl border border-dashed border-accent/40 bg-accent/5 flex items-center gap-3 group hover:bg-accent/10 transition-all cursor-pointer">
                        <div className="h-12 w-12 rounded-lg bg-muted/20 relative overflow-hidden flex-shrink-0">
                            <Image 
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80" 
                                alt="Look" 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-0.5">Образ дня</p>
                            <h4 className="text-[11px] font-black uppercase tracking-tight leading-tight">Total Wool Look</h4>
                            <Button variant="link" className="h-auto p-0 text-[9px] font-black uppercase text-muted-foreground hover:text-accent group-hover:translate-x-1 transition-transform">
                                Купить образ <ArrowRight className="h-2.5 w-2.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Availability Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar mb-2">
                {[
                    { label: 'В наличии', value: 'in_stock' },
                    { label: 'Предзаказ', value: 'pre_order' },
                    { label: 'Нет в наличии', value: 'out_of_stock' }
                ].map(opt => {
                    const isSelected = filterAvailability.includes(opt.value);
                    return (
                        <Button
                            key={opt.value}
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                                "rounded-xl h-8 px-4 text-[10px] font-black uppercase tracking-widest transition-all border",
                                isSelected
                                    ? "bg-accent text-white border-accent shadow-md shadow-accent/20" 
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                            )}
                            onClick={() => {
                                setFilterAvailability(prev => {
                                    if (prev.includes(opt.value)) {
                                        return prev.filter(v => v !== opt.value);
                                    } else {
                                        return [...prev, opt.value];
                                    }
                                });
                            }}
                        >
                            {isSelected && <Check className="h-3 w-3 mr-1.5 stroke-[3px]" />}
                            {opt.label}
                        </Button>
                    );
                })}
            </div>

            {/* Top Audience Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar mb-4 border-b">
                {[
                    { label: 'Все', value: 'Все', audience: ['Все'] as AudienceFilter[], category: [] as string[] },
                    { label: 'Женщинам', value: 'Женщинам', audience: ['Взрослые - Женщины', 'Взрослые - Унисекс'] as AudienceFilter[], category: [] as string[] },
                    { label: 'Мужчинам', value: 'Мужчинам', audience: ['Взрослые - Мужчины', 'Взрослые - Унисекс'] as AudienceFilter[], category: [] as string[] },
                    { label: 'Детям', value: 'Детям', audience: ['Дети - Девочки', 'Дети - Мальчики', 'Дети - Новорожденные', 'Дети - Унисекс'] as AudienceFilter[], category: [] as string[] },
                    { label: 'Beauty', value: 'Beauty', audience: ['Non-Fashion'] as AudienceFilter[], category: ['Beauty & Grooming'] },
                    { label: 'Home', value: 'Home', audience: ['Non-Fashion'] as AudienceFilter[], category: ['Home & Lifestyle'] }
                ].map(opt => (
                    <Button
                        key={opt.value}
                        variant={activeTopAudience === opt.value ? 'default' : 'outline'}
                        className={cn(
                            "rounded-xl h-9 text-[11px] font-black uppercase tracking-wider transition-all border",
                            opt.label === 'Все' ? "min-w-[60px]" : "min-w-[120px]",
                            activeTopAudience === opt.value 
                                ? "bg-black text-white border-black shadow-lg" 
                                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm"
                        )}
                        onClick={() => {
                            setActiveTopAudience(opt.value);
                            setActiveAudience(opt.audience);
                            setFilterCategory(opt.category);
                            setFilterAttributes({});
                            setFilterColor([]);
                            setFilterSizes([]);
                            setSelectedSizeRow(null);
                        }}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
                {/* Sidebar Filters */}
                <aside className={cn(
                    "lg:w-72 space-y-4 transition-all duration-300 shrink-0",
                    !isFilterSidebarOpen && "lg:w-0 overflow-hidden opacity-0 invisible"
                )}>
                    <Accordion type="multiple" defaultValue={[]} className="w-full space-y-2">
                        {/* Audience */}
                        <AccordionItem value="audience" className="border-none">
                            <div className="flex items-center justify-between gap-2 p-1 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all border border-transparent hover:border-muted-foreground/10 group">
                                <AccordionTrigger className="hover:no-underline p-2 text-xs font-black uppercase tracking-wider flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                                        </div>
                                        <span className="group-hover:translate-x-0.5 transition-transform">Аудитория</span>
                                        {activeAudience.length > 0 && !activeAudience.includes('Все') && (
                                            <Badge className="h-4 min-w-4 px-1 text-[9px] flex items-center justify-center rounded-full bg-accent text-white border-none shrink-0">
                                                {activeAudience.length}
                                            </Badge>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                {activeAudience.length > 0 && !activeAudience.includes('Все') ? (
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 px-2 text-[9px] uppercase font-black text-muted-foreground hover:text-accent transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAudience(['Все']);
                                            setActiveTopAudience('Все');
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 text-[9px] uppercase font-black text-foreground">
                                        <Check className="h-3 w-3 text-green-600 stroke-[4px]" />
                                        <span>Все</span>
                                    </div>
                                )}
                            </div>
                            <AccordionContent className="pt-2 px-1">
                                <div className="space-y-4 p-4 bg-accent/5 rounded-2xl border border-accent/10">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-accent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">AI Подбор размера</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-tight">
                                        Мы проанализировали ваши параметры (Рост: 178 см, Обхват груди: 92 см) и рекомендуем размер <b>L</b> для этого бренда.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        className="w-full h-8 rounded-xl text-[9px] font-black uppercase tracking-widest border-accent/20 text-accent hover:bg-accent hover:text-white transition-all"
                                        onClick={() => setIsAiSizeDialogOpen(true)}
                                    >
                                        Проверить замеры
                                    </Button>
                                </div>
                                <div className="h-px bg-muted/20 my-4" />
                                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(['Взрослые - Женщины', 'Взрослые - Мужчины', 'Взрослые - Унисекс', 'Дети - Девочки', 'Дети - Мальчики', 'Дети - Новорожденные', 'Дети - Унисекс', 'Non-Fashion'] as AudienceFilter[])
                                        .filter(audience => {
                                            if (activeTopAudience === 'Все' || !activeTopAudience) return true;
                                            
                                            if (activeTopAudience === 'Женщинам') {
                                                return ['Взрослые - Женщины', 'Взрослые - Унисекс'].includes(audience);
                                            }
                                            if (activeTopAudience === 'Мужчинам') {
                                                return ['Взрослые - Мужчины', 'Взрослые - Унисекс'].includes(audience);
                                            }
                                            if (activeTopAudience === 'Детям') {
                                                return audience.startsWith('Дети -');
                                            }
                                            if (activeTopAudience === 'Beauty' || activeTopAudience === 'Home') {
                                                return audience === 'Non-Fashion';
                                            }
                                            return true;
                                        })
                                        .map(audience => {
                                        const isChecked = activeAudience.includes(audience);
                                        return (
                                            <div 
                                                key={audience} 
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer hover:bg-muted/50",
                                                    isChecked && "bg-muted/30"
                                                )}
                                                onClick={() => {
                                                    setActiveAudience(prev => {
                                                        if (audience === 'Все') {
                                                            setActiveTopAudience('Все');
                                                            return ['Все'];
                                                        }
                                                        let withoutAll = prev.filter(a => a !== 'Все');
                                                        
                                                        let next: AudienceFilter[];
                                                        if (withoutAll.includes(audience)) {
                                                            next = withoutAll.filter(a => a !== audience);
                                                        } else {
                                                            next = [...withoutAll, audience];
                                                        }
                                                        setActiveTopAudience('');
                                                        return next.length === 0 ? ['Все'] : next;
                                                    });
                                                }}
                                            >
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    {isChecked && <Check className="h-4 w-4 text-green-600 stroke-[4px]" />}
                                                </div>
                                                <span className={cn(
                                                    "text-[11px] font-medium leading-none",
                                                    isChecked ? "text-foreground font-black" : "text-muted-foreground"
                                                )}>
                                                    {audience}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Categories */}
                        <AccordionItem value="categories" className="border-none">
                            <div className="flex items-center justify-between gap-2 p-1 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all border border-transparent hover:border-muted-foreground/10 group">
                                <AccordionTrigger className="hover:no-underline p-2 text-xs font-black uppercase tracking-wider flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Layers className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                                        </div>
                                        <span className="group-hover:translate-x-0.5 transition-transform">Категории</span>
                                        {filterCategory.length > 0 && (
                                            <Badge className="h-4 min-w-4 px-1 text-[9px] flex items-center justify-center rounded-full bg-accent text-white border-none shrink-0">
                                                {filterCategory.length}
                                            </Badge>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                {filterCategory.length > 0 ? (
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 px-2 text-[9px] uppercase font-black text-muted-foreground hover:text-accent transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFilterCategory([]);
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 text-[9px] uppercase font-black text-foreground">
                                        <Check className="h-3 w-3 text-green-600 stroke-[4px]" />
                                        <span>Все</span>
                                    </div>
                                )}
                            </div>
                            <AccordionContent className="pt-2 px-1">
                                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                                    <Accordion type="multiple" className="w-full space-y-3">
                                        {categoriesData && Object.keys(categoriesData)
                                            .filter(lvl1 => getAllowedCategories.includes(lvl1))
                                            .map(lvl1 => (
                                            <AccordionItem key={lvl1} value={lvl1} className="border-none">
                                                <AccordionTrigger className="py-2.5 px-3 bg-muted/10 rounded-xl hover:bg-muted/30 transition-colors text-[10px] font-black uppercase tracking-widest hover:no-underline text-left">
                                                    <span>{lvl1}</span>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pl-4 space-y-3">
                                                    {Object.keys(categoriesData[lvl1])
                                                        .filter(lvl2 => {
                                                            if (activeAudience.includes('Все')) return true;
                                                            const isFemale = activeAudience.some(a => ['Взрослые - Женщины', 'Дети - Девочки'].includes(a));
                                                            const isMale = activeAudience.some(a => ['Взрослые - Мужчины', 'Дети - Мальчики'].includes(a));
                                                            const isNonFashion = activeAudience.includes('Non-Fashion');
                                                            const isOnlyMaleRelated = activeAudience.every(a => ['Взрослые - Мужчины', 'Дети - Мальчики', 'Взрослые - Унисекс', 'Дети - Унисекс'].includes(a));
                                                            if (isOnlyMaleRelated && ['Платья и сарафаны', 'Юбки', 'Нижнее бельё'].includes(lvl2)) return false;
                                                            if (['Платья и сарафаны', 'Юбки', 'Нижнее бельё'].includes(lvl2)) return isFemale;
                                                            if (lvl1 === 'Beauty & Grooming' || lvl1 === 'Home & Lifestyle') return isNonFashion;
                                                            if (['Одежда', 'Обувь', 'Сумки', 'Аксессуары'].includes(lvl1)) {
                                                                if (isNonFashion && activeAudience.length === 1) return false;
                                                            }
                                                            return true;
                                                        })
                                                        .map(lvl2 => {
                                                            const isLvl2Checked = filterCategory.includes(lvl2);
                                                            const children = Object.keys(categoriesData[lvl1][lvl2]);
                                                            const hasLvl3 = children.length > 0;
                                                            const dName = lvl2 === 'Нижнее бельё' ? 'Женское нижнее бельё и домашняя одежда' : lvl2;
                                                            
                                                            return (
                                                                <div key={lvl2} className="space-y-2">
                                                                    {hasLvl3 ? (
                                                                        <Accordion type="multiple" className="w-full">
                                                                            <AccordionItem value={lvl2} className="border-none">
                                                                                <div className="flex items-center gap-1">
                                                                                    <div 
                                                                                        onClick={() => {
                                                                                            setFilterCategory(prev => {
                                                                                                const isCurrentlyChecked = prev.includes(lvl2);
                                                                                                if (isCurrentlyChecked) {
                                                                                                    return prev.filter(c => c !== lvl2 && !children.includes(c));
                                                                                                } else {
                                                                                                    return Array.from(new Set([...prev, lvl2, ...children]));
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                        className={cn(
                                                                                            "flex-1 text-left px-2.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                                                                                            isLvl2Checked ? "bg-muted/50 text-foreground font-black shadow-sm" : "hover:bg-muted text-muted-foreground/80 font-semibold"
                                                                                        )}
                                                                                    >
                                                                                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                                                            {isLvl2Checked && <Check className="h-3 w-3 text-green-600 stroke-[4px]" />}
                                                                                        </div>
                                                                                        <span>{dName}</span>
                                                                                    </div>
                                                                                    <AccordionTrigger className="p-2 hover:no-underline" />
                                                                                </div>
                                                                                <AccordionContent className="pt-2 pl-6 space-y-2">
                                                                                    {children
                                                                                        .filter(lvl3 => {
                                                                                            if (activeAudience.includes('Все')) return true;
                                                                                            const isOnlyMaleRelated = activeAudience.every(aud => ['Взрослые - Мужчины', 'Дети - Мальчики', 'Дети - Унисекс', 'Взрослые - Унисекс'].includes(aud));
                                                                                            if (isOnlyMaleRelated && ['Коктейльные', 'Вечерние'].includes(lvl3)) return false;
                                                                                            if (['Коктейльные', 'Вечерние', 'Балетки', 'Ботфорты'].includes(lvl3)) {
                                                                                                return activeAudience.some(a => ['Взрослые - Женщины', 'Дети - Девочки'].includes(a));
                                                                                            }
                                                                                            return true;
                                                                                        })
                                                                                        .map(lvl3 => {
                                                                                            const isLvl3Checked = filterCategory.includes(lvl3);
                                                                                            return (
                                                                                                <div 
                                                                                                    key={lvl3}
                                                                                                    onClick={() => {
                                                                                                        setFilterCategory(prev => prev.includes(lvl3) ? prev.filter(c => c !== lvl3) : [...prev, lvl3]);
                                                                                                    }}
                                                                                                    className={cn(
                                                                                                        "w-full text-left px-2 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                                                                                                        isLvl3Checked ? "text-foreground font-black shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                                                                    )}
                                                                                                >
                                                                                                    <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                                                                                                        {isLvl3Checked && <Check className="h-2.5 w-2.5 text-green-600 stroke-[4px]" />}
                                                                                                    </div>
                                                                                                    <span>{lvl3}</span>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    ) : (
                                                                        <div 
                                                                            onClick={() => {
                                                                                setFilterCategory(prev => prev.includes(lvl2) ? prev.filter(c => c !== lvl2) : [...prev, lvl2]);
                                                                            }}
                                                                            className={cn(
                                                                                "w-full text-left px-2.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer hover:bg-muted/50",
                                                                                isLvl2Checked ? "bg-muted/50 text-foreground font-black shadow-sm" : "hover:bg-muted text-muted-foreground/80 font-semibold"
                                                                            )}
                                                                        >
                                                                            <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                                                {isLvl2Checked && <Check className="h-3 w-3 text-green-600 stroke-[4px]" />}
                                                                            </div>
                                                                            <span>{dName}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Colors */}
                        <AccordionItem value="colors" className="border-none">
                            <div className="flex items-center justify-between gap-2 p-1 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all border border-transparent hover:border-muted-foreground/10 group">
                                <AccordionTrigger className="hover:no-underline p-2 text-xs font-black uppercase tracking-wider flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Palette className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                                        </div>
                                        <span className="group-hover:translate-x-0.5 transition-transform">Цвет</span>
                                        {filterColor.length > 0 && (
                                            <Badge className="h-4 min-w-4 px-1 text-[9px] flex items-center justify-center rounded-full bg-accent text-white border-none shrink-0">
                                                {filterColor.length}
                                            </Badge>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                {filterColor.length > 0 ? (
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 px-2 text-[9px] uppercase font-black text-muted-foreground hover:text-accent transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFilterColor([]);
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 text-[9px] uppercase font-black text-foreground">
                                        <Check className="h-3 w-3 text-green-600 stroke-[4px]" />
                                        <span>Все</span>
                                    </div>
                                )}
                            </div>
                            <AccordionContent className="pt-2 px-1">
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {colorsData.map(color => {
                                        const isChecked = filterColor.includes(color.name);
                                        return (
                                            <div 
                                                key={color.name} 
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer hover:bg-muted/50",
                                                    isChecked && "bg-muted/30"
                                                )}
                                                onClick={() => {
                                                    setFilterColor(prev => 
                                                        prev.includes(color.name) 
                                                            ? prev.filter(c => c !== color.name) 
                                                            : [...prev, color.name]
                                                    );
                                                }}
                                            >
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    {isChecked && <Check className="h-4 w-4 text-green-600 stroke-[4px]" />}
                                                </div>
                                                <div className="relative flex items-center justify-center shrink-0">
                                                    <div 
                                                        className={cn(
                                                            "h-3.5 w-3.5 rounded-full border shadow-sm transition-all",
                                                            isChecked && "scale-110 ring-2 ring-green-500 ring-offset-1"
                                                        )} 
                                                        style={{ backgroundColor: color.hex }} 
                                                    />
                                                </div>
                                                <span className={cn(
                                                    "text-[11px] font-medium leading-none",
                                                    isChecked ? "text-foreground font-black" : "text-muted-foreground"
                                                )}>
                                                    {color.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Sizes */}
                        <AccordionItem value="sizes" className="border-none">
                            <div className="flex items-center justify-between gap-2 p-1 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all border border-transparent hover:border-muted-foreground/10 group">
                                <AccordionTrigger className="hover:no-underline p-2 text-xs font-black uppercase tracking-wider flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Ruler className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                                        </div>
                                        <span className="group-hover:translate-x-0.5 transition-transform">Размеры</span>
                                        {selectedSizeRow && (
                                            <Badge className="h-4 w-4 p-0 flex items-center justify-center rounded-full bg-accent text-white border-none shrink-0">
                                                <Check className="h-2 w-2 stroke-[4px]" />
                                            </Badge>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                {selectedSizeRow ? (
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 px-2 text-[9px] uppercase font-black text-muted-foreground hover:text-accent transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSizeRow(null);
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 text-[9px] uppercase font-black text-foreground">
                                        <Check className="h-3 w-3 text-green-600 stroke-[4px]" />
                                        <span>Все</span>
                                    </div>
                                )}
                            </div>
                            <AccordionContent className="pt-1 px-1">
                                {activeSizeChart && activeSizeChart.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            {['RU', 'Alpha', 'EU', 'US', 'UK'].filter(s => activeSizeChart[0] && activeSizeChart[0][s]).map(system => {
                                                const isValueSelected = !!selectedSizeRow;
                                                return (
                                                    <div key={system} className="space-y-0.5">
                                                        <Label className="text-[8px] uppercase font-black text-muted-foreground/70 ml-1">{system}</Label>
                                                        <Select 
                                                            value={selectedSizeRow ? String(selectedSizeRow[system] || '') : 'all'} 
                                                            onValueChange={(val) => {
                                                                if (val === 'all') {
                                                                    setSelectedSizeRow(null);
                                                                } else {
                                                                    const foundRow = activeSizeChart.find(r => String(r[system]) === val);
                                                                    setSelectedSizeRow(foundRow || null);
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className={cn(
                                                                "h-7 rounded-lg text-[10px] font-black uppercase transition-all",
                                                                isValueSelected ? "bg-muted/50 border-2 border-muted-foreground/20 text-foreground" : "bg-muted/30 border-none text-muted-foreground"
                                                            )}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-3 h-3 flex items-center justify-center shrink-0">
                                                                        {isValueSelected && <Check className="h-3 w-3 text-green-600 stroke-[4px]" />}
                                                                    </div>
                                                                    <SelectValue placeholder={`Выбрать ${system}`} />
                                                                </div>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all" className="text-[10px] font-bold uppercase">Все</SelectItem>
                                                                {activeSizeChart.map((row, idx) => (
                                                                    <SelectItem key={idx} value={String(row[system])} className="text-[10px] font-bold uppercase">
                                                                        {String(row[system])}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {selectedSizeRow && (
                                            <div className="bg-accent/5 rounded-xl p-3 space-y-2 border border-accent/20 animate-in fade-in zoom-in duration-200">
                                                <div className="flex items-center justify-between border-b border-accent/10 pb-1 mb-2">
                                                    <p className="text-[9px] font-black uppercase text-accent tracking-widest">Соответствие</p>
                                                    <Trophy className="h-3 w-3 text-accent" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {Object.entries(selectedSizeRow)
                                                        .filter(([k]) => ['IT', 'FR', 'EU', 'US', 'UK', 'RU', 'Alpha'].includes(k))
                                                        .map(([k, v]) => (
                                                            <div key={k} className="flex flex-col items-center p-1 bg-white rounded border border-muted/50">
                                                                <span className="text-[7px] font-bold text-muted-foreground uppercase leading-none mb-0.5">{k}</span>
                                                                <span className="text-[9px] font-black text-foreground uppercase">{String(v)}</span>
                                                            </div>
                                                        ))}
                                                </div>
                                                
                                                <div className="pt-2 space-y-1">
                                                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter">Замеры изделия (см)</p>
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                        {Object.entries(selectedSizeRow)
                                                            .filter(([k]) => !['IT', 'FR', 'EU', 'US', 'UK', 'RU', 'Alpha'].includes(k))
                                                            .map(([k, v]) => (
                                                                <div key={k} className="flex justify-between items-center border-b border-muted/30 pb-0.5">
                                                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{measurementLabels[k] || k}:</span>
                                                                    <span className="text-[9px] font-black text-foreground">{String(v)}</span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-muted/20 rounded-xl border border-dashed text-center">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">
                                            {(Array.isArray(activeAudience) ? activeAudience : []).some(a => ['Взрослые - Мужчины', 'Дети - Мальчики', 'Дети - Новорожденные'].includes(a)) 
                                                ? "Матрица размеров для этой аудитории скоро появится" 
                                                : "Выберите категорию, чтобы увидеть сетку"
                                            }
                                        </p>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* Attributes */}
                        <AccordionItem value="attributes" className="border-none">
                            <div className="flex items-center justify-between gap-2 p-1 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all border border-transparent hover:border-muted-foreground/10 group">
                                <AccordionTrigger className="hover:no-underline p-2 text-xs font-black uppercase tracking-wider flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Sliders className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                                        </div>
                                        <span className="group-hover:translate-x-0.5 transition-transform">Атрибуты</span>
                                        {Object.values(filterAttributes).some(arr => arr.length > 0) && (
                                            <Badge className="h-4 min-w-4 px-1 text-[9px] flex items-center justify-center rounded-full bg-accent text-white border-none shrink-0">
                                                {Object.values(filterAttributes).reduce((acc, curr) => acc + curr.length, 0)}
                                            </Badge>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                {Object.values(filterAttributes).some(arr => arr.length > 0) ? (
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 px-2 text-[9px] uppercase font-black text-muted-foreground hover:text-accent transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFilterAttributes({});
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 text-[9px] uppercase font-black text-foreground">
                                        <Check className="h-3 w-3 text-green-600 stroke-[4px]" />
                                        <span>Все</span>
                                    </div>
                                )}
                            </div>
                            <AccordionContent className="pt-2 px-1">
                                <Accordion type="multiple" className="w-full space-y-3">
                                    {attributesData
                                        .filter(attr => getAllowedAttributes.includes(attr.id))
                                        .map(attr => (
                                        <AccordionItem key={attr.id} value={attr.id} className="border-none">
                                            <AccordionTrigger className="py-2.5 px-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-[10px] font-black uppercase tracking-wider hover:no-underline text-left shadow-sm">
                                                <div className="flex items-center justify-between w-full pr-1">
                                                    <span>{attr.name_ru}</span>
                                                    {filterAttributes[attr.id]?.length > 0 && (
                                                        <Badge className="h-3.5 min-w-3.5 px-1 text-[8px] flex items-center justify-center rounded-full bg-accent text-white border-none shrink-0 ml-2">
                                                            {filterAttributes[attr.id].length}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-2 px-0 pl-4">
                                                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                                    {attr.values.slice(0, 20).map((val: string) => {
                                                        const isChecked = filterAttributes[attr.id]?.includes(val);
                                                        return (
                                                            <div 
                                                                key={val} 
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors cursor-pointer hover:bg-muted/50",
                                                                    isChecked && "bg-muted/30"
                                                                )}
                                                                onClick={() => {
                                                                    setFilterAttributes(prev => {
                                                                        const current = prev[attr.id] || [];
                                                                        if (current.includes(val)) {
                                                                            return { ...prev, [attr.id]: current.filter(v => v !== val) };
                                                                        } else {
                                                                            return { ...prev, [attr.id]: [...current, val] };
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                                    {isChecked && <Check className="h-4 w-4 text-green-600 stroke-[4px]" />}
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[11px] font-medium leading-none",
                                                                    isChecked ? "text-foreground font-black" : "text-muted-foreground"
                                                                )}>
                                                                    {val}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Button 
                        variant="outline" 
                        className="w-full rounded-xl text-xs uppercase font-black py-6 border-2 hover:bg-accent/5 transition-all"
                        onClick={() => {
                            setActiveTopCatalog('marketplace');
                            setActiveTopAudience('Все');
                            setActiveAudience(['Все']);
                            setFilterCategory([]);
                            setFilterColor([]);
                            setFilterSizes([]);
                            setSelectedSizeRow(null);
                            setFilterAttributes({});
                            setFilterOutlet(['marketplace']);
                        }}
                    >
                        Очистить всё
                    </Button>
                </aside>

                {/* Main Collection Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 bg-muted/20 p-2 rounded-2xl border border-dashed">
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="hidden lg:flex items-center gap-2 text-xs font-bold rounded-xl"
                                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                            >
                                <Filter className="h-4 w-4" />
                                {isFilterSidebarOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                            </Button>
                            <div className="text-sm text-muted-foreground font-medium">
                                Найдено изделий: <span className="text-foreground font-black">{filteredProducts.length}</span>
                            </div>
                        </div>
                        
                        <div className="flex bg-white/50 p-1 rounded-xl gap-1 border shadow-sm">
                            <Button 
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8 rounded-lg"
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                size="icon" 
                                className="h-8 w-8 rounded-lg"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className={cn(
                            "grid gap-3",
                            viewMode === 'grid' 
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                                : "grid-cols-1"
                        )}>
                            {filteredProducts.map((product) => (
                                viewMode === 'grid' 
                                    ? <ProductCard key={product.id} product={product} />
                                    : <ProductListItem key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center space-y-6 bg-muted/10 rounded-[4rem] border border-dashed border-muted-foreground/20">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <Search className="h-10 w-10 text-muted-foreground opacity-30" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black">Ничего не найдено</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto font-medium">Попробуйте изменить параметры фильтрации или сбросить их</p>
                            </div>
                            <Button size="lg" variant="outline" className="rounded-2xl px-8" onClick={() => {
                                setActiveTopCatalog('marketplace');
                                setActiveTopAudience('Все');
                                setFilterCategory([]);
                                setFilterColor([]);
                                setFilterAttributes({});
                                setFilterOutlet(['marketplace']);
                                setActiveAudience(['Все']);
                            }}>Сбросить все фильтры</Button>
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
    );
}
