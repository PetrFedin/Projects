'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products as allProducts } from "@/lib/products";
import Image from "next/image";
import { Save, Search, Percent, TrendingUp, TrendingDown, DollarSign, BrainCircuit, AlertTriangle, Flame, ThumbsUp, ShoppingCart, Lightbulb, Loader2, ChevronsUpDown, PlusCircle, Link as LinkIcon, BarChart2, Download, Share2, Wand2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";
import type { Product, SavedScenario, ProductWithAnalytics } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SkuAnalytics } from '@/components/brand/sku-analytics';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '../ui/label';
import { StatCard } from '../stat-card';
import Link from 'next/link';
import { useUIState } from '@/providers/ui-state';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { suggestProductPrice } from '@/ai/flows/suggest-product-price';
import { fullCategoryStructure } from '@/lib/categories';
import { Combobox } from '../ui/combobox';


type Scenario = 'pessimistic' | 'realistic' | 'optimistic';

interface RrpSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: { suggestedRrp: number; reasoning: string; } | null;
  onAccept: (newPrice: number) => void;
  isLoading: boolean;
}

function RrpSuggestionDialog({ isOpen, onOpenChange, suggestion, onAccept, isLoading }: RrpSuggestionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Wand2 className="text-accent" /> Рекомендация AI по цене</DialogTitle>
                </DialogHeader>
                 {isLoading && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {suggestion && !isLoading && (
                    <div className="py-4 space-y-4">
                        <p className="text-center">Рекомендуемая розничная цена (РРЦ):</p>
                        <p className="text-sm font-bold text-center">{suggestion.suggestedRrp.toLocaleString('ru-RU')} ₽</p>
                        <Alert>
                            <BrainCircuit className="h-4 w-4" />
                            <AlertTitle>Обоснование</AlertTitle>
                            <AlertDescription>{suggestion.reasoning}</AlertDescription>
                        </Alert>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отклонить</Button>
                    <Button disabled={!suggestion} onClick={() => { if(suggestion) onAccept(suggestion.suggestedRrp); }}>Применить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const scenarioModifiers = {
    pessimistic: { sellOut: 0.8, revenue: 0.8, priceModifier: 0.9 },
    realistic: { sellOut: 1, revenue: 1, priceModifier: 1.0 },
    optimistic: { sellOut: 1.15, revenue: 1.2, priceModifier: 1.05 },
};

const potentialConfig = {
    'Хит': { icon: Flame, color: 'text-red-500', description: 'Высокий спрос, высокая маржа. Рекомендуется увеличить закупку.' },
    'Стабильный': { icon: TrendingUp, color: 'text-green-500', description: 'Стабильные продажи, хорошая маржинальность. Надежный выбор.' },
    'Рискованный': { icon: AlertTriangle, color: 'text-amber-500', description: 'Низкая прогнозируемая маржа или sell-out. Требует пересмотра.' },
};

const lifecycleConfig = {
    'New Arrival': { label: 'Новинка', color: 'bg-blue-100 text-blue-800' },
    'Bestseller': { label: 'Хит продаж', color: 'bg-green-100 text-green-800' },
    'Core Item': { label: 'Базовый', color: 'bg-gray-100 text-gray-800' },
    'Last Chance': { label: 'Последний шанс', color: 'bg-orange-100 text-orange-800' },
};

const riskConfig = {
    'Низкий': { color: 'text-green-500', description: 'Стабильный спрос, достаточный запас.' },
    'Средний': { color: 'text-amber-500', description: 'Возможен дефицит при росте спроса.' },
    'Высокий': { color: 'text-red-500', description: 'Высокий риск Out-of-Stock или низкая оборачиваемость.' },
}

const getMarkupColor = (markup: number) => {
    if (markup >= 200) return 'text-green-600';
    if (markup >= 150) return 'text-amber-600';
    return 'text-red-600';
};
  
const getMarginColor = (margin: number) => {
    if (margin >= 65) return 'text-green-600';
    if (margin >= 50) return 'text-amber-600';
    return 'text-red-600';
};

const getStockIndicatorClass = (quantity: number | undefined) => {
    if (quantity === undefined) return '';
    if (quantity <= 5) return 'bg-red-100 dark:bg-red-900/50';
    if (quantity <= 20) return 'bg-yellow-100 dark:bg-yellow-900/50';
    return 'bg-green-100 dark:bg-green-900/50';
};

export default function MarginAnalysisPage() {
    const { addB2bOrderItem } = useUIState();
    const [baseInventory, setBaseInventory] = useState<ProductWithAnalytics[]>([]);
    const [editedProducts, setEditedProducts] = useState<Record<string, Partial<ProductWithAnalytics>>>({});
    const [inventory, setInventory] = useState<ProductWithAnalytics[]>([]);
    const [selectedSku, setSelectedSku] = useState<ProductWithAnalytics | null>(null);
    const [activeScenario, setActiveScenario] = useState<Scenario>('realistic');
    const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
    const [activeScenarioId, setActiveScenarioId] = useState<string>('default');
    const [scenarioName, setScenarioName] = useState('Основной заказ');
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [compareScenarioIds, setCompareScenarioIds] = useState<[string | undefined, string | undefined]>([undefined, undefined]);
    const [isRrpSuggestionOpen, setIsRrpSuggestionOpen] = useState(false);
    const [rrpSuggestion, setRrpSuggestion] = useState<{ suggestedRrp: number; reasoning: string; } | null>(null);
    const [rrpLoading, setRrpLoading] = useState(false);
    const [productForRrp, setProductForRrp] = useState<ProductWithAnalytics | null>(null);

    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all');
    const [category1Filter, setCategory1Filter] = useState('all');
    const [category2Filter, setCategory2Filter] = useState('all');
    const [category3Filter, setCategory3Filter] = useState('all');
    const [audienceFilter, setAudienceFilter] = useState('all');
    const [skuFilter, setSkuFilter] = useState<string[]>([]);
    const [openBrandGroups, setOpenBrandGroups] = useState<Record<string, boolean>>({});


    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const initialInventoryData: ProductWithAnalytics[] = allProducts.map((p, i) => ({
                ...p,
                salesPerWeek: Math.floor(Math.random() * 20) + 5,
                stock: Math.floor(Math.random() * 30),
                aiRecommendation: Math.round((((Math.floor(Math.random() * 20) + 5) * 4) - (Math.floor(Math.random() * 30)))/5)*5,
                aiPotential: i < 5 ? 'Хит' : (i < 10 ? 'Стабильный' : 'Рискованный'),
                riskProfile: i < 5 ? 'Низкий' : (i < 10 ? 'Средний' : 'Высокий'),
                orderQty: i < 3 ? 50 : 0, 
                rrp: p.price * 2.5,
                margin: 0,
                markup: 0,
                forecastRevenue: 0,
                forecastProfit: 0,
                forecastSellOut: 85 + Math.floor(Math.random() * 10) - 5,
                lifecycleStage: i < 2 ? 'New Arrival' : (p.bestsellerRank ? 'Bestseller' : 'Core Item'),
            }));
            setBaseInventory(initialInventoryData);
             if (initialInventoryData.length > 0) {
                const initialEdits: Record<string, Partial<ProductWithAnalytics>> = {};
                initialInventoryData.forEach(p => {
                    initialEdits[p.id] = { orderQty: p.orderQty, rrp: p.rrp };
                });
                setEditedProducts(initialEdits);
                const allBrands = [...new Set(initialInventoryData.map(p => p.brand))];
                setOpenBrandGroups(allBrands.reduce((acc, brand) => ({...acc, [brand]: true}), {}));
            }
            setIsLoading(false);
        }, 500);
    }, []);

    const handleQuantityChange = (productId: string, quantity: number) => {
        setEditedProducts(prev => ({
            ...prev,
            [productId]: { ...(prev[productId] || {}), orderQty: quantity >= 0 ? quantity : 0 }
        }));
    };

    const handleRrpChange = (productId: string, value: number) => {
        setEditedProducts(prev => ({
            ...prev,
            [productId]: { ...(prev[productId] || {}), rrp: value }
        }));
    };
    
    const filteredBaseInventory = useMemo(() => {
        return baseInventory.filter(item => {
            const seasonMatch = seasonFilter === 'all' || item.season === seasonFilter;
            const brandMatch = brandFilter === 'all' || item.brand === brandFilter;
            const searchMatch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const category1Match = category1Filter === 'all' || item.category === category1Filter;
            const category2Match = category2Filter === 'all' || item.subcategory === category2Filter;
            const category3Match = category3Filter === 'all' || item.subcategory2 === category3Filter;
            const audienceMatch = audienceFilter === 'all' || item.audience === audienceFilter;
            const skuMatch = skuFilter.length === 0 || skuFilter.includes(item.sku);

            return seasonMatch && brandMatch && searchMatch && category1Match && category2Match && category3Match && audienceMatch && skuMatch;
        });
    }, [baseInventory, seasonFilter, brandFilter, searchQuery, category1Filter, category2Filter, category3Filter, audienceFilter, skuFilter]);
    
    const skuOptions = useMemo(() => {
        return baseInventory
            .filter(item => {
                const brandMatch = brandFilter === 'all' || item.brand === brandFilter;
                const seasonMatch = seasonFilter === 'all' || item.season === seasonFilter;
                const audienceMatch = audienceFilter === 'all' || item.audience === audienceFilter;
                 const category1Match = category1Filter === 'all' || item.category === category1Filter;
                const category2Match = category2Filter === 'all' || item.subcategory === category2Filter;
                const category3Match = category3Filter === 'all' || item.subcategory2 === category3Filter;
                return brandMatch && seasonMatch && audienceMatch && category1Match && category2Match && category3Match;
            })
            .map(p => ({ value: p.sku, label: `${p.sku} - ${p.name}` }));
    }, [baseInventory, brandFilter, seasonFilter, audienceFilter, category1Filter, category2Filter, category3Filter]);

    useEffect(() => {
        const modifier = scenarioModifiers[activeScenario];
        const calculatedInventory = filteredBaseInventory.map(p => {
            const edited = editedProducts[p.id] || {};
            const cost = p.productionCost || p.price * 0.4;
            const orderQty = edited.orderQty ?? 0;
            const rrp = edited.rrp ?? p.rrp;
            
            const finalRrp = rrp * modifier.priceModifier;
            const markup = cost > 0 ? ((finalRrp - cost) / cost) * 100 : 0;
            const margin = finalRrp > 0 ? ((finalRrp - cost) / finalRrp) * 100 : 0;
            
            const baseSellOut = edited.forecastSellOut ?? p.forecastSellOut;
            const forecastSellOut = Math.min(100, baseSellOut * modifier.sellOut);
            
            const forecastRevenue = finalRrp * orderQty * (forecastSellOut / 100) * modifier.revenue;
            const forecastProfit = (finalRrp - cost) * orderQty * (forecastSellOut / 100) * modifier.revenue;

            return { ...p, orderQty, rrp, margin, markup, forecastRevenue, forecastProfit, forecastSellOut };
        });
        setInventory(calculatedInventory);
    }, [filteredBaseInventory, editedProducts, activeScenario]);
    
    const calculateTotals = (inventorySet: ProductWithAnalytics[]) => {
        return inventorySet.reduce((acc, item) => {
            const cost = item.productionCost || (item.price * 0.4);
            acc.totalQty += item.orderQty;
            acc.totalCost += cost * item.orderQty;
            acc.totalRevenue += item.forecastRevenue;
            acc.totalProfit += item.forecastProfit;
            return acc;
        }, { totalQty: 0, totalCost: 0, totalRevenue: 0, totalProfit: 0 });
    }
    
    const calculateBrandTotals = (brand: string) => {
        const brandInventory = inventory.filter(p => p.brand === brand);
        return calculateTotals(brandInventory);
    }
    
    const groupedByBrand = useMemo(() => {
        return inventory.reduce((acc, item) => {
            if (!acc[item.brand]) {
                acc[item.brand] = [];
            }
            acc[item.brand].push(item);
            return acc;
        }, {} as Record<string, ProductWithAnalytics[]>);
    }, [inventory]);

    const totals = useMemo(() => calculateTotals(inventory), [inventory]);
    
    const calculateScenarioTotals = (scenarioId: string) => {
         const scenario = savedScenarios.find(s => s.id === scenarioId);
         const edits = scenario ? scenario.edits : {};
         const scenarioInventory = baseInventory.map(p => {
            const edited = edits[p.id] || {};
            const cost = p.productionCost || p.price * 0.4;
            const orderQty = edited.orderQty ?? p.orderQty ?? 0;
            const rrp = edited.rrp ?? p.rrp;
            
            const finalRrp = rrp * scenarioModifiers.realistic.priceModifier;
            const forecastSellOut = (edited.forecastSellOut ?? p.forecastSellOut);
            
            const forecastRevenue = finalRrp * orderQty * (forecastSellOut / 100);
            const forecastProfit = (finalRrp - cost) * orderQty * (forecastSellOut / 100);

            return { ...p, orderQty, rrp, forecastRevenue, forecastProfit, forecastSellOut };
        });
        return calculateTotals(scenarioInventory);
    }

    const compareScenario1Totals = compareScenarioIds[0] ? calculateScenarioTotals(compareScenarioIds[0]) : null;
    const compareScenario2Totals = compareScenarioIds[1] ? calculateScenarioTotals(compareScenarioIds[1]) : null;

    const avgMargin = totals.totalRevenue > 0 ? (totals.totalProfit / totals.totalRevenue) * 100 : 0;

    const handleSaveScenario = () => {
        const newScenario: SavedScenario = {
            id: `scenario-${Date.now()}`,
            name: scenarioName,
            edits: JSON.parse(JSON.stringify(editedProducts)),
        };
        setSavedScenarios([...savedScenarios, newScenario]);
        setActiveScenarioId(newScenario.id);
        toast({ title: "Сценарий сохранен", description: `Сценарий "${scenarioName}" был успешно сохранен.` });
    };

    const handleLoadScenario = (scenarioId: string) => {
        if (scenarioId === 'default') {
            const initialEdits: Record<string, Partial<ProductWithAnalytics>> = {};
            baseInventory.forEach(p => {
                initialEdits[p.id] = { orderQty: p.orderQty, rrp: p.rrp };
            });
            setEditedProducts(initialEdits);
            setScenarioName('Основной заказ');
        } else {
            const scenario = savedScenarios.find(s => s.id === scenarioId);
            if (scenario) {
                setEditedProducts(scenario.edits);
                setScenarioName(scenario.name);
            }
        }
        setActiveScenarioId(scenarioId);
    };

    const handleAddToCart = () => {
        let itemsAdded = 0;
        inventory.forEach(item => {
            if (item.orderQty > 0) {
                 const allSizes = item.sizes?.map(s => s.name) || ['One Size'];
                 const qtyPerSize = Math.floor(item.orderQty / allSizes.length);
                 allSizes.forEach((size, index) => {
                    let qty = qtyPerSize;
                    if (index === 0) {
                        qty += item.orderQty % allSizes.length;
                    }
                    if(qty > 0) {
                       addB2bOrderItem(item, size, qty);
                    }
                 });
                 itemsAdded += item.orderQty;
            }
        });
        toast({
            title: 'Товары добавлены в заказ',
            description: `Добавлено ${itemsAdded} ед. товаров. Вы можете просмотреть заказ в B2B-хабе.`
        });
    }
    
    const budget = 3500000;
    const profitTarget = 8000000;
    const budgetExceeded = totals.totalCost > budget;
    const profitTargetNotMet = totals.totalProfit < profitTarget;

    const handleApplyAllRecommendations = () => {
        const newEdits: Record<string, Partial<ProductWithAnalytics>> = {};
        baseInventory.forEach(p => {
            newEdits[p.id] = { ...(editedProducts[p.id] || {}), orderQty: p.aiRecommendation > 0 ? p.aiRecommendation : 0 };
        });
        setEditedProducts(newEdits);
        toast({ title: "Рекомендации AI применены", description: "Количество товаров в заказе обновлено." });
    };
    
     const handleOptimizeOrder = () => {
        setIsLoading(true);
        setTimeout(() => {
            const optimizedEdits: Record<string, Partial<ProductWithAnalytics>> = {};
            let currentBudget = 0;
            const sortedByPotential = [...baseInventory].sort((a, b) => {
                const scoreA = (a.aiPotential === 'Хит' ? 3 : (a.aiPotential === 'Стабильный' ? 2 : 1));
                const scoreB = (b.aiPotential === 'Хит' ? 3 : (b.aiPotential === 'Стабильный' ? 2 : 1));
                return scoreB - scoreA;
            });

            sortedByPotential.forEach(p => {
                const cost = p.productionCost || p.price * 0.4;
                if (currentBudget + (p.aiRecommendation * cost) <= budget) {
                    optimizedEdits[p.id] = { ...(editedProducts[p.id] || {}), orderQty: p.aiRecommendation > 0 ? p.aiRecommendation : 0 };
                    currentBudget += p.aiRecommendation * cost;
                } else {
                    const affordableQty = Math.floor((budget - currentBudget) / cost);
                    if (affordableQty > 0) {
                        optimizedEdits[p.id] = { ...(editedProducts[p.id] || {}), orderQty: affordableQty };
                        currentBudget += affordableQty * cost;
                    } else {
                         optimizedEdits[p.id] = { ...(editedProducts[p.id] || {}), orderQty: 0 };
                    }
                }
            });
            setEditedProducts(optimizedEdits);
            setIsLoading(false);
            toast({ title: "Заказ оптимизирован", description: "Количества обновлены для соответствия бюджету и целям." });
        }, 1500);
    }
    
    const handleSuggestRrp = async (product: ProductWithAnalytics) => {
        setProductForRrp(product);
        setIsRrpSuggestionOpen(true);
        setRrpLoading(true);
        setRrpSuggestion(null);

        try {
            const result = await suggestProductPrice({
                productName: product.name,
                productionCost: product.productionCost || product.price * 0.4,
                category: product.category,
                brandSegment: 'Contemporary', // This should be dynamic in a real app
            });
            setRrpSuggestion(result);
        } catch (error) {
            console.error("Error suggesting price:", error);
            toast({ variant: 'destructive', title: 'Ошибка AI', description: 'Не удалось получить рекомендацию.' });
        } finally {
            setRrpLoading(false);
        }
    };
    
    const handleAcceptSuggestion = (newPrice: number) => {
        if(productForRrp) {
            handleRrpChange(productForRrp.id, newPrice);
        }
        setIsRrpSuggestionOpen(false);
    }

    const seasons = useMemo(() => ['all', ...new Set(baseInventory.map(d => d.season))], [baseInventory]);
    const brands = useMemo(() => ['all', ...new Set(baseInventory.map(d => d.brand))], [baseInventory]);
    const audiences = useMemo(() => ['all', 'Женский', 'Мужской', 'Унисекс'], []);
    const category1Options = useMemo(() => ['all', ...Object.keys(fullCategoryStructure)], []);
    const category2Options = useMemo(() => {
        if (category1Filter === 'all' || !fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure]) return [];
        return ['all', ...Object.keys(fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure])];
    }, [category1Filter]);

    const category3Options = useMemo(() => {
        if (category1Filter === 'all' || category2Filter === 'all' || !fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure]?.[category2Filter as keyof typeof fullCategoryStructure[keyof typeof fullCategoryStructure]]) return [];
        const subCat = fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure]?.[category2Filter as keyof typeof fullCategoryStructure[keyof typeof fullCategoryStructure]];
        return subCat ? ['all', ...Object.keys(subCat)] : [];
    }, [category1Filter, category2Filter]);


    if (isLoading && baseInventory.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-4">
                <header>
                    <h1 className="text-base font-bold font-headline">Маржинальность и Прогноз</h1>
                    <p className="text-muted-foreground">Управляйте ценообразованием, планируйте прибыльность и принимайте решения о закупках.</p>
                </header>
                
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Конструктор бюджета и целей</CardTitle>
                            <Button onClick={handleOptimizeOrder} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>} Оптимизировать
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="budget-target">Бюджет на закупку, ₽</Label>
                            <Input id="budget-target" type="number" defaultValue={budget} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="profit-target">Целевая прибыль, ₽</Label>
                            <Input id="profit-target" type="number" defaultValue={profitTarget} />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                           <Filter className="h-4 w-4 text-muted-foreground" />
                           <h3 className="font-semibold">Фильтры</h3>
                       </div>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                           <Input placeholder="Поиск по названию..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                           <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{audiences.map(a => <SelectItem key={a} value={a}>{a === 'all' ? 'Вся аудитория' : a}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={brandFilter} onValueChange={setBrandFilter}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b === 'all' ? 'Все бренды' : b}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{seasons.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'Все сезоны' : s}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={category1Filter} onValueChange={(v) => {setCategory1Filter(v); setCategory2Filter('all'); setCategory3Filter('all');}}>
                                <SelectTrigger><SelectValue placeholder="Категория 1..." /></SelectTrigger>
                                <SelectContent>{category1Options.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Все категории' : c}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={category2Filter} onValueChange={(v) => {setCategory2Filter(v); setCategory3Filter('all');}} disabled={category1Filter === 'all'}>
                                <SelectTrigger><SelectValue placeholder="Категория 2..." /></SelectTrigger>
                                <SelectContent>{category2Options.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Все' : c}</SelectItem>)}</SelectContent>
                            </Select>
                             <Select value={category3Filter} onValueChange={setCategory3Filter} disabled={category2Filter === 'all'}>
                                <SelectTrigger><SelectValue placeholder="Категория 3..." /></SelectTrigger>
                                <SelectContent>{category3Options.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Все' : c}</SelectItem>)}</SelectContent>
                            </Select>
                            <Combobox 
                                options={skuOptions}
                                multiple
                                value={skuFilter}
                                onChange={(v) => setSkuFilter(v as string[])}
                                placeholder="Артикул (SKU)"
                                className="w-full"
                            />
                       </div>
                    </CardContent>
                </Card>

                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard title="Бюджет закупки" value={`${totals.totalCost.toLocaleString('ru-RU')} ₽`} description={`Всего ${totals.totalQty.toLocaleString('ru-RU')} ед.`} icon={ShoppingCart} />
                    <StatCard title="Прогноз выручки" value={`${totals.totalRevenue.toLocaleString('ru-RU')} ₽`} description={`Сценарий: ${activeScenario}`} icon={DollarSign} />
                    <StatCard title="Прогноз прибыли" value={`${totals.totalProfit.toLocaleString('ru-RU')} ₽`} description="С учетом sell-through" icon={TrendingUp} />
                    <StatCard title="Средняя маржа" value={`${avgMargin.toFixed(1)}%`} description="По всему заказу" icon={Percent} />
                </div>
                 {(budgetExceeded || profitTargetNotMet) && (
                    <Alert variant={budgetExceeded ? "destructive" : "default"} className={!budgetExceeded && profitTargetNotMet ? "bg-amber-100 dark:bg-amber-900/50 border-amber-500/50 text-amber-900 dark:text-amber-200" : ""}>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Рекомендация AI</AlertTitle>
                        <AlertDescription>
                            {budgetExceeded && `Бюджет превышен на ${(totals.totalCost - budget).toLocaleString('ru-RU')} ₽. `}
                            {profitTargetNotMet && `Цель по прибыли не достигнута (не хватает ${(profitTarget - totals.totalProfit).toLocaleString('ru-RU')} ₽). `}
                            Нажмите "Оптимизировать", чтобы AI скорректировал заказ.
                        </AlertDescription>
                    </Alert>
                )}


                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start">
                    <div className="xl:col-span-3">
                        <Card>
                             <CardHeader>
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                                    <div>
                                        <CardTitle>Матрица заказа</CardTitle>
                                        <CardDescription>Введите количество к заказу и РРЦ для расчета маржинальности.</CardDescription>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 p-1 border rounded-md">
                                            <Label className="text-xs font-semibold pl-2">Сценарий:</Label>
                                            <ToggleGroup type="single" value={activeScenario} onValueChange={(value: Scenario) => value && setActiveScenario(value)} className="mt-0">
                                                <ToggleGroupItem value="pessimistic" aria-label="Пессимистичный" className="h-7 text-xs">Пессимистичный</ToggleGroupItem>
                                                <ToggleGroupItem value="realistic" aria-label="Реалистичный" className="h-7 text-xs">Реалистичный</ToggleGroupItem>
                                                <ToggleGroupItem value="optimistic" aria-label="Оптимистичный" className="h-7 text-xs">Оптимистичный</ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="sticky left-0 bg-background z-10 min-w-[250px]">Товар</TableHead>
                                            <TableHead>Стадия</TableHead>
                                            <TableHead>Прогноз AI</TableHead>
                                            <TableHead>Риск</TableHead>
                                            <TableHead>Остаток</TableHead>
                                            <TableHead>Заказ (шт)</TableHead>
                                            <TableHead>Себест.</TableHead>
                                            <TableHead>РРЦ</TableHead>
                                            <TableHead>Наценка</TableHead>
                                            <TableHead>Маржа</TableHead>
                                            <TableHead>Sell-Out</TableHead>
                                            <TableHead>Прогноз Выручки</TableHead>
                                            <TableHead>Прогноз Прибыли</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(groupedByBrand).map(([brand, brandProducts]) => {
                                            const brandTotals = calculateBrandTotals(brand);
                                            const isGroupOpen = openBrandGroups[brand] ?? true;
                                            return (
                                                <React.Fragment key={brand}>
                                                    <TableRow className="bg-muted/50 hover:bg-muted/50 font-semibold" onClick={() => setOpenBrandGroups(p => ({...p, [brand]: !p[brand]}))} >
                                                        <TableCell className="sticky left-0 bg-inherit z-10">
                                                            <div className="flex items-center gap-2">
                                                                <ChevronsUpDown className={cn("h-4 w-4 transition-transform", !isGroupOpen && "-rotate-90")} />
                                                                {brand}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell colSpan={4}></TableCell>
                                                        <TableCell className="text-center">{brandTotals.totalQty.toLocaleString('ru-RU')}</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell className="text-right">{brandTotals.totalRevenue.toLocaleString('ru-RU')} ₽</TableCell>
                                                        <TableCell className="text-right">{brandTotals.totalProfit.toLocaleString('ru-RU')} ₽</TableCell>
                                                    </TableRow>
                                                    {isGroupOpen && brandProducts.map(item => {
                                                        const Icon = potentialConfig[item.aiPotential].icon;
                                                        const potentialColor = potentialConfig[item.aiPotential].color;
                                                        const riskColor = riskConfig[item.riskProfile].color;
                                                        return(
                                                        <TableRow key={item.id} onClick={() => setSelectedSku(item)} className={cn("cursor-pointer", selectedSku?.id === item.id && "bg-secondary")}>
                                                            <TableCell className="sticky left-0 bg-inherit z-10 font-medium">
                                                                <div className="flex items-center gap-3">
                                                                    <Image src={item.images[0].url} alt={item.name} width={40} height={50} className="rounded-md object-cover"/>
                                                                    <div>
                                                                        <p className="font-semibold text-sm group-hover/link:underline">{item.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={`${lifecycleConfig[item.lifecycleStage].color}`}>{lifecycleConfig[item.lifecycleStage].label}</Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className={cn("flex items-center gap-1.5 font-semibold cursor-help", potentialColor)}>
                                                                            <Icon className="h-4 w-4" />
                                                                            {item.aiPotential}
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>{potentialConfig[item.aiPotential].description}</p></TooltipContent>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className={cn("font-semibold cursor-help", riskColor)}>{item.riskProfile}</div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent><p>{riskConfig[item.riskProfile].description}</p></TooltipContent>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className={cn("flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold", getStockIndicatorClass(item.stock))}>
                                                                    {item.stock}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1">
                                                                    <Input type="number" value={item.orderQty} onClick={(e) => e.stopPropagation()} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)} className="w-20 h-8" />
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, item.aiRecommendation); }}>
                                                                                <BrainCircuit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent><p>Применить рекомендацию AI ({item.aiRecommendation} шт.)</p></TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{(item.productionCost || item.price * 0.4).toLocaleString('ru-RU')} ₽</TableCell>
                                                            <TableCell>
                                                                <div className="relative">
                                                                    <Input type="number" value={Math.round(item.rrp)} onClick={(e) => e.stopPropagation()} onChange={(e) => handleRrpChange(item.id, Number(e.target.value))} className="w-24 h-8 pr-7" />
                                                                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8" onClick={(e) => {e.stopPropagation(); handleSuggestRrp(item)}}>
                                                                    <Wand2 className="h-4 w-4 text-accent"/>
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className={cn("font-semibold", getMarkupColor(item.markup))}>{item.markup.toFixed(1)}%</TableCell>
                                                            <TableCell className={cn("font-semibold", getMarginColor(item.margin))}>{item.margin.toFixed(1)}%</TableCell>
                                                            <TableCell>{item.forecastSellOut.toFixed(1)}%</TableCell>
                                                            <TableCell>{item.forecastRevenue.toLocaleString('ru-RU')} ₽</TableCell>
                                                            <TableCell className="font-semibold">{item.forecastProfit.toLocaleString('ru-RU')} ₽</TableCell>
                                                        </TableRow>
                                                    )})}
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow className="font-bold text-base">
                                            <TableCell className="sticky left-0 bg-muted z-10">Итого</TableCell>
                                            <TableCell colSpan={4}></TableCell>
                                            <TableCell className="text-center">{totals.totalQty.toLocaleString('ru-RU')}</TableCell>
                                            <TableCell className="text-right">{totals.totalCost.toLocaleString('ru-RU')} ₽</TableCell>
                                            <TableCell colSpan={3}></TableCell>
                                            <TableCell className="text-right">{totals.totalRevenue.toLocaleString('ru-RU')} ₽</TableCell>
                                            <TableCell className="text-right">{totals.totalProfit.toLocaleString('ru-RU')} ₽</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                             <CardFooter className="flex justify-between items-center">
                                <div>
                                    <Label htmlFor="scenario-name" className="text-xs">Название сценария</Label>
                                    <div className="flex items-center gap-2">
                                        <Select value={activeScenarioId} onValueChange={handleLoadScenario}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Основной заказ</SelectItem>
                                                {savedScenarios.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input id="scenario-name" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} className="w-[200px]" />
                                        <Button variant="outline" onClick={handleSaveScenario}><Save className="mr-2 h-4 w-4"/> Сохранить</Button>
                                        <Button variant="outline" onClick={() => setIsCompareOpen(true)} disabled={savedScenarios.length < 1}><BarChart2 className="mr-2 h-4 w-4"/>Сравнить</Button>
                                    </div>
                                </div>
                                 <Button size="lg" disabled={totals.totalQty === 0} onClick={handleAddToCart}>
                                    <ShoppingCart className="mr-2 h-4 w-4"/> Создать заказ ({totals.totalQty} шт.)
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <RrpSuggestionDialog
                    isOpen={isRrpSuggestionOpen}
                    onOpenChange={setIsRrpSuggestionOpen}
                    suggestion={rrpSuggestion}
                    onAccept={handleAcceptSuggestion}
                    isLoading={rrpLoading}
                />
                <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Сравнение сценариев</DialogTitle>
                            <DialogDescription>Выберите два сценария для сравнения их ключевых показателей.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-3 py-4">
                            <Select onValueChange={(val) => setCompareScenarioIds(prev => [val, prev[1]])}>
                                <SelectTrigger><SelectValue placeholder="Выберите сценарий 1..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Основной заказ</SelectItem>
                                    {savedScenarios.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <Select onValueChange={(val) => setCompareScenarioIds(prev => [prev[0], val])}>
                                <SelectTrigger><SelectValue placeholder="Выберите сценарий 2..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Основной заказ</SelectItem>
                                    {savedScenarios.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {(compareScenario1Totals && compareScenario2Totals) && (
                            <Table>
                                <TableHeader><TableRow><TableHead>Метрика</TableHead><TableHead className="text-right">{savedScenarios.find(s=>s.id===compareScenarioIds[0])?.name || 'Основной заказ'}</TableHead><TableHead className="text-right">{savedScenarios.find(s=>s.id===compareScenarioIds[1])?.name || 'Основной заказ'}</TableHead><TableHead className="text-right">Разница</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>Бюджет</TableCell><TableCell className="text-right">{compareScenario1Totals.totalCost.toLocaleString('ru-RU')} ₽</TableCell><TableCell className="text-right">{compareScenario2Totals.totalCost.toLocaleString('ru-RU')} ₽</TableCell><TableCell className="text-right">{(compareScenario2Totals.totalCost - compareScenario1Totals.totalCost).toLocaleString('ru-RU')} ₽</TableCell></TableRow>
                                    <TableRow><TableCell>Выручка</TableCell><TableCell className="text-right">{compareScenario1Totals.totalRevenue.toLocaleString('ru-RU')} ₽</TableCell><TableCell className="text-right">{compareScenario2Totals.totalRevenue.toLocaleString('ru-RU')} ₽</TableCell><TableCell className="text-right">{(compareScenario2Totals.totalRevenue - compareScenario1Totals.totalRevenue).toLocaleString('ru-RU')} ₽</TableCell></TableRow>
                                    <TableRow><TableCell>Прибыль</TableCell><TableCell className="text-right">{compareScenario1Totals.totalProfit.toLocaleString('ru-RU')} ₽</TableCell><TableCell className="text-right">{compareScenario2Totals.totalProfit.toLocaleString('ru-RU')} ₽</TableCell><TableCell className="text-right">{(compareScenario2Totals.totalProfit - compareScenario1Totals.totalProfit).toLocaleString('ru-RU')} ₽</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog open={!!selectedSku} onOpenChange={(open) => !open && setSelectedSku(null)}>
                    <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Глубокая аналитика: {selectedSku?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto pr-4 -mr-6">
                            {selectedSku && <SkuAnalytics brandProducts={baseInventory} initialSku={selectedSku.id} isDialogMode />}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
