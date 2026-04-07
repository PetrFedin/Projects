"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Zap, Truck, Activity } from 'lucide-react';
import { InventoryTable } from "@/components/shop/inventory-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Combobox } from '../ui/combobox';
import type { Product } from '@/lib/types';
import { StockSync } from './stock-sync';
import { products as allProducts } from '@/lib/products';
import { BulkActionDialog } from './bulk-action-dialog';
import { Button } from '../ui/button';
import { Badge } from "@/components/ui/badge";

type InventoryItem = Product & {
    listingStatus: 'approved' | 'pending' | 'rejected';
    storeStock: number;
    promotion?: { type: 'outlet' | 'promo' | 'price_change'; value: number, requestedBy: 'shop' | 'brand', status: 'pending' | 'approved' | 'rejected', comment?: string };
    rejectionReason?: string;
    lastRejectionDate?: string;
    requestDate?: string;
};

const initialInventory: InventoryItem[] = allProducts.slice(0, 7).map((p, i) => ({
    ...p,
    storeStock: Math.floor(Math.random() * 20),
    listingStatus: i < 3 ? 'approved' : (i === 3 ? 'pending' : (i === 4 ? 'rejected' : 'approved')),
    promotion: i === 5 ? { type: 'outlet', value: 30, requestedBy: 'brand', status: 'pending' } : (i === 6 ? { type: 'price_change', value: p.price * 1.15, requestedBy: 'brand', status: 'pending', comment: 'Корректировка в связи с новым курсом.' } : undefined),
    lastRejectionDate: i === 4 ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined, // Rejected 2 days ago
    requestDate: i === 3 ? new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() : undefined, // Requested 12 hours ago
}));

export function InventoryPageContent() {
    const [inventory, setInventory] = useState(initialInventory);
    const [searchQuery, setSearchQuery] = useState('');
    const [audienceFilter, setAudienceFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all');
    const [seasonFilter, setSeasonFilter] = useState('all');
    const [category1Filter, setCategory1Filter] = useState('all');
    const [category2Filter, setCategory2Filter] = useState('all');
    const [category3Filter, setCategory3Filter] = useState('all');
    const [skuFilter, setSkuFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
    const [bulkActionType, setBulkActionType] = useState<'promo' | 'outlet' | null>(null);
    const [fullCategoryStructure, setFullCategoryStructure] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/data/categories.json');
                const data = await response.json();
                setFullCategoryStructure(data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const searchMatch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const audienceMatch = audienceFilter === 'all' || item.audience === audienceFilter;
            const brandMatch = brandFilter === 'all' || item.brand === brandFilter;
            const seasonMatch = seasonFilter === 'all' || item.season === seasonFilter;
            const category1Match = category1Filter === 'all' || item.category === category1Filter;
            const category2Match = category2Filter === 'all' || item.subcategory === category2Filter;
            const category3Match = category3Filter === 'all' || item.subcategory2 === category3Filter;
            const skuMatch = skuFilter.length === 0 || skuFilter.includes(item.sku);
            
            const statusMatch = statusFilter === 'all' || 
                (statusFilter === 'action_required' && !!item.promotion) ||
                (statusFilter !== 'action_required' && item.listingStatus === statusFilter);

            return searchMatch && audienceMatch && brandMatch && seasonMatch && category1Match && category2Match && category3Match && skuMatch && statusMatch;
        });
    }, [inventory, searchQuery, audienceFilter, brandFilter, seasonFilter, category1Filter, category2Filter, category3Filter, skuFilter, statusFilter]);

    const brands = useMemo(() => ['all', ...new Set(inventory.map(p => p.brand))], [inventory]);
    const seasons = useMemo(() => ['all', ...new Set(inventory.map(p => p.season))], [inventory]);
    const audiences = useMemo(() => ['all', 'Женский', 'Мужской', 'Унисекс'], []);
    const category1Options = useMemo(() => fullCategoryStructure ? ['all', ...Object.keys(fullCategoryStructure)] : [], [fullCategoryStructure]);
    const category2Options = useMemo(() => {
        if (category1Filter === 'all' || !fullCategoryStructure || !fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure]) return [];
        return ['all', ...Object.keys(fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure])];
    }, [category1Filter, fullCategoryStructure]);
    const category3Options = useMemo(() => {
        if (category1Filter === 'all' || category2Filter === 'all' || !fullCategoryStructure || !fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure]?.[category2Filter as keyof typeof fullCategoryStructure[keyof typeof fullCategoryStructure]]) return [];
        const subCat = fullCategoryStructure[category1Filter as keyof typeof fullCategoryStructure]?.[category2Filter as keyof typeof fullCategoryStructure[keyof typeof fullCategoryStructure]];
        return subCat ? ['all', ...Object.keys(subCat)] : [];
    }, [category1Filter, category2Filter, fullCategoryStructure]);
    const skuOptions = useMemo(() => inventory.map(p => ({ value: p.sku, label: `${p.sku} - ${p.name}` })), [inventory]);

    const handleOpenBulkDialog = (type: 'promo' | 'outlet') => {
        setBulkActionType(type);
        setIsBulkActionDialogOpen(true);
    };

    const selectedProducts = useMemo(() => {
        return inventory.filter(item => selectedRows.has(item.id));
    }, [inventory, selectedRows]);

    return (
        <div className="space-y-6">
            {/* VMI & Dropshipping Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                <Card className="rounded-[1.5rem] border-slate-100 shadow-sm bg-indigo-50/50 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
                        <Zap className="h-12 w-12 text-indigo-600" />
                    </div>
                    <CardHeader className="p-3 pb-2">
                        <Badge className="w-fit bg-indigo-100 text-indigo-700 border-none mb-1 text-[8px] font-black uppercase tracking-widest">Retail VMI Active</Badge>
                        <CardTitle className="text-sm font-black uppercase">Авто-пополнение</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm font-black tabular-nums">12</p>
                                <p className="text-[10px] text-slate-500 font-medium">SKU дозаказано ИИ</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase text-indigo-600 hover:bg-indigo-100/50">Детали</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[1.5rem] border-slate-100 shadow-sm bg-emerald-50/50 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
                        <Truck className="h-12 w-12 text-emerald-600" />
                    </div>
                    <CardHeader className="p-3 pb-2">
                        <Badge className="w-fit bg-emerald-100 text-emerald-700 border-none mb-1 text-[8px] font-black uppercase tracking-widest">Dropshipping Hub</Badge>
                        <CardTitle className="text-sm font-black uppercase">Прямые отгрузки</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm font-black tabular-nums">48</p>
                                <p className="text-[10px] text-slate-500 font-medium">Заказов B2B2C в пути</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase text-emerald-600 hover:bg-emerald-100/50">Трекинг</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[1.5rem] border-slate-100 shadow-sm bg-white relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
                        <Activity className="h-12 w-12 text-slate-600" />
                    </div>
                    <CardHeader className="p-3 pb-2">
                        <Badge variant="outline" className="w-fit border-slate-200 text-slate-500 mb-1 text-[8px] font-black uppercase tracking-widest">Inventory Health</Badge>
                        <CardTitle className="text-sm font-black uppercase">Оборачиваемость</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm font-black tabular-nums">1.4x</p>
                                <p className="text-[10px] text-slate-500 font-medium">Коэффициент SS26</p>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                <span>+0.2</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <StockSync />
            
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                        <div>
                            <CardTitle>Товары вашего магазина</CardTitle>
                            <CardDescription>Просматривайте, редактируйте и управляйте своим каталогом.</CardDescription>
                        </div>
                    </div>
                    <div className="pt-4 space-y-2">
                        <p className="text-sm font-medium">Фильтры</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            <Input placeholder="Поиск по названию/артикулу..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                                <SelectTrigger><SelectValue placeholder="Аудитория..." /></SelectTrigger>
                                <SelectContent>{audiences.map(a => <SelectItem key={a} value={a}>{a === 'all' ? 'Вся аудитория' : a}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={brandFilter} onValueChange={setBrandFilter}>
                                <SelectTrigger><SelectValue placeholder="Бренд..." /></SelectTrigger>
                                <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b === 'all' ? 'Все бренды' : b}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                                <SelectTrigger><SelectValue placeholder="Сезон..." /></SelectTrigger>
                                <SelectContent>{seasons.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'Все сезоны' : s}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger><SelectValue placeholder="Статус..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все статусы</SelectItem>
                                    <SelectItem value="approved">Одобрено</SelectItem>
                                    <SelectItem value="pending">Ожидает</SelectItem>
                                    <SelectItem value="rejected">Отклонено</SelectItem>
                                    <SelectItem value="action_required">Требует действия</SelectItem>
                                </SelectContent>
                            </Select>
                            <Combobox 
                                options={skuOptions}
                                multiple
                                value={skuFilter}
                                onChange={(v) => setSkuFilter(v as string[])}
                                placeholder="Артикул (SKU)"
                            />
                        </div>
                    </div>
                    {selectedRows.size > 0 && (
                        <div className="pt-4 flex items-center gap-2">
                            <p className="text-sm font-medium">Выбрано: {selectedRows.size}</p>
                            <Button size="sm" onClick={() => handleOpenBulkDialog('promo')}>Предложить промо</Button>
                            <Button size="sm" onClick={() => handleOpenBulkDialog('outlet')}>Предложить в аутлет</Button>
                            <Button size="sm" variant="destructive" onClick={() => setSelectedRows(new Set())}>Очистить выбор</Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <InventoryTable 
                        inventory={filteredInventory} 
                        setInventory={setInventory} 
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                    />
                </CardContent>
            </Card>

            {bulkActionType && (
                <BulkActionDialog
                    isOpen={isBulkActionDialogOpen}
                    onOpenChange={setIsBulkActionDialogOpen}
                    products={selectedProducts}
                    actionType={bulkActionType}
                />
            )}
        </div>
    );
}
