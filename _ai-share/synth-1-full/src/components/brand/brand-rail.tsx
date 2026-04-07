
'use client';

import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { RailProduct, Look, Capsule, CartItem, Product } from '@/lib/types';
import { products as allProducts } from '@/lib/products';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, ShoppingCart, ArrowLeft, ArrowRight, Layers, Filter, ChevronsUpDown, GripVertical, QrCode, Send, ThumbsUp, MessageSquare, PlusCircle, Link as LinkIcon, FileText, TrendingUp, AlertTriangle, Flame, Shirt, Trello } from 'lucide-react';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Combobox } from '../ui/combobox';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { looks as allLooks } from '@/lib/looks';

const PRODUCTS: RailProduct[] = allProducts.map(p => ({
    id: p.id,
    title: p.name,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    heroRailImageUrl: p.images[0].url,
    variants: (p.availableColors || [{ id: `color-${p.id}-default`, name: p.color, hex: '#000000', sizeAvailability: p.sizes?.map(s => ({name: s.name})) }]).map(c => ({
        variantId: c.id,
        colorCode: c.hex,
        colorName: c.name,
        sizeRun: (c.sizeAvailability || p.sizes || []).map(s => typeof s === 'string' ? s : s.name),
        images: p.images.filter(img => img.colorName === c.name).map(i => i.url),
    })),
    pricing: { currentPrice: p.price, currency: "₽" },
    badges: {
        newIn: p.tags?.includes('newSeason'),
        bestseller: !!p.bestsellerRank && p.bestsellerRank <= 5,
    }
}));


function SizeGrid({ product, onBulkAddToCart }: { product: RailProduct, onBulkAddToCart: (items: {variantId: string, size: string, quantity: number}[]) => void }) {
    const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({});

    const handleQuantityChange = (variantId: string, size: string, quantity: number) => {
        setQuantities(prev => ({
            ...prev,
            [variantId]: {
                ...(prev[variantId] || {}),
                [size]: quantity,
            }
        }));
    };

    const handleBulkAdd = () => {
        const itemsToAdd: {variantId: string, size: string, quantity: number}[] = [];
        Object.entries(quantities).forEach(([variantId, sizes]) => {
            Object.entries(sizes).forEach(([size, quantity]) => {
                if (quantity > 0) {
                    itemsToAdd.push({variantId, size, quantity});
                }
            });
        });
        onBulkAddToCart(itemsToAdd);
        setQuantities({});
    }
    
    const allSizes = [...new Set(product.variants.flatMap(v => v.sizeRun))].sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });

    return (
        <div className="bg-card p-3 border-t">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Цвет</TableHead>
                            {allSizes.map((size, index) => <TableHead key={`${size}-${index}`} className="p-1 text-center w-20">{size}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {product.variants.map(variant => (
                            <TableRow key={variant.variantId}>
                                <TableCell className="p-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: variant.colorCode }}></div>
                                        <span className="text-xs truncate">{variant.colorName}</span>
                                    </div>
                                </TableCell>
                                {allSizes.map((size, index) => (
                                    <TableCell key={`${variant.variantId}-${size}-${index}`} className="p-1">
                                        {variant.sizeRun.includes(size) ? (
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={quantities[variant.variantId]?.[size] || ''}
                                                onChange={e => handleQuantityChange(variant.variantId, size, parseInt(e.target.value) || 0)}
                                                className="h-7 w-12 text-center text-xs"
                                            />
                                        ) : (
                                            <div className="w-12 h-7 flex items-center justify-center text-muted-foreground">-</div>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Button size="sm" className="w-full mt-2" onClick={handleBulkAdd}>Добавить в заказ</Button>
        </div>
    );
}

const ProductDetail = forwardRef<HTMLDivElement, { product: RailProduct, onAddToCart: (variantId: string, size: string, quantity: number) => void, onBack: () => void }>(({ product, onAddToCart, onBack }, ref) => {
    const [activeVariant, setActiveVariant] = useState(product.variants[0]);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    
    const handleQuantityChange = (size: string, quantity: number) => {
        setQuantities(prev => ({...prev, [size]: quantity}));
    }

    const handleBulkAddToCart = () => {
        Object.entries(quantities).forEach(([size, quantity]) => {
            if (quantity > 0) {
                onAddToCart(activeVariant.variantId, size, quantity);
            }
        });
        setQuantities({});
    }

    return (
        <motion.div
            ref={ref}
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-card border-l shadow-2xl z-10 flex flex-col"
        >
            <div className="p-4 flex items-center justify-between border-b">
                <Button variant="ghost" onClick={onBack} size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    <div className="relative aspect-[4/5] w-full bg-muted rounded-lg overflow-hidden">
                        <Image src={activeVariant.images[0] || product.heroRailImageUrl} alt={product.title} fill className="object-cover" />
                    </div>
                    <div className="flex gap-2">
                        {product.variants.map((v, i) => (
                            <button key={`${v.variantId}-${i}`} onClick={() => setActiveVariant(v)} className={cn("h-10 w-10 rounded-full border-2", activeVariant.variantId === v.variantId ? 'border-primary' : 'border-border')} style={{backgroundColor: v.colorCode}}></button>
                        ))}
                    </div>
                    <h3 className="text-base font-semibold">{product.title}</h3>
                    <p className="text-sm font-bold">{product.pricing.currency} {product.pricing.currentPrice.toLocaleString('ru-RU')}</p>
                    <p className="text-sm text-muted-foreground">{activeVariant.colorName}</p>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Размеры и количество:</p>
                        <div className="grid grid-cols-3 gap-2">
                            {activeVariant.sizeRun.map((size, index) => (
                                <div key={`${size}-${index}`} className="flex flex-col gap-1">
                                    <Label htmlFor={`qty-${size}`} className="text-xs text-center">{size}</Label>
                                    <Input id={`qty-${size}`} type="number" min="0" value={quantities[size] || ''} onChange={(e) => handleQuantityChange(size, parseInt(e.target.value) || 0)} className="h-8 text-center" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <div className="p-4 border-t mt-auto">
                <Button className="w-full" size="lg" onClick={handleBulkAddToCart} disabled={Object.values(quantities).every(q => q === 0)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Добавить в заказ
                </Button>
            </div>
        </motion.div>
    )
});
ProductDetail.displayName = 'ProductDetail';

const LookDetail = forwardRef<HTMLDivElement, { look: Look, onAddToCart: (product: Product, size: string, quantity: number) => void, onBack: () => void }>(({ look, onAddToCart, onBack }, ref) => {
    const lookProducts = allProducts.filter(p => look.products?.some(lp => lp.productId === p.id));

    return (
        <motion.div
            ref={ref}
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-card border-l shadow-2xl z-10 flex flex-col"
        >
            <div className="p-4 flex items-center justify-between border-b">
                <Button variant="ghost" onClick={onBack} size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                </Button>
            </div>
            <ScrollArea className="flex-1">
                 <div className="relative aspect-[4/5] w-full bg-muted">
                    <Image src={look.imageUrl} alt={look.description} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-4">
                    <h3 className="text-base font-semibold">{look.title || "Образ"}</h3>
                    <p className="text-sm text-muted-foreground">{look.description}</p>
                    <Separator />
                    <h4 className="font-semibold">Товары в образе</h4>
                    <div className="space-y-3">
                        {lookProducts.map(p => (
                            <div key={p.id} className="flex gap-3">
                                 <div className="relative w-12 h-20 rounded-md overflow-hidden bg-muted">
                                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">{p.brand}</p>
                                    <p className="font-semibold text-base leading-tight">{p.name}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => onAddToCart(p, p.sizes?.[0].name || 'One Size', 1)}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </motion.div>
    )
});
LookDetail.displayName = 'LookDetail';

export function BrandRail() {
    const [activeView, setActiveView] = useState<'product' | 'look' | 'capsule' | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [expandedSizeGridId, setExpandedSizeGridId] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [groupBy, setGroupBy] = useState<'brand' | 'category' | 'none'>('none');
    const [viewMode, setViewMode] = useState<'products' | 'looks'>('products');
    
    const { addB2bOrderItem, b2bCart } = useB2BState();
    const { toast } = useToast();

    const handleAddToCart = (product: Product, size: string, quantity: number) => {
        addB2bOrderItem(product, size, quantity);
        toast({
            title: "Добавлено в заказ",
            description: `${product.name} (${size}) x ${quantity}`,
        });
    }
    
    const handleBulkAddToCart = (items: {variantId: string, size: string, quantity: number}[]) => {
        let totalAdded = 0;
        let lastAddedName = '';
        items.forEach(item => {
            const product = PRODUCTS.find(p => p.variants.some(v => v.variantId === item.variantId));
            const allProduct = allProducts.find(p => p.id === product?.id);
            if(allProduct) {
                addB2bOrderItem(allProduct, item.size, item.quantity);
                totalAdded += item.quantity;
                lastAddedName = allProduct.name;
            }
        });
        if(totalAdded > 0) {
            toast({
                title: "Товары добавлены в заказ",
                description: `Добавлено ${totalAdded} ед. ${items.length > 1 ? '' : `(${lastAddedName})`}`,
            });
        }
    }

    const handleSelectProduct = (productId: string) => {
        setActiveId(productId);
        setActiveView('product');
    };

    const handleSelectLook = (lookId: string) => {
        setActiveId(lookId);
        setActiveView('look');
    }
    
    const totalQuantity = b2bCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = b2bCart.reduce((sum, item) => sum + (item.price * 0.4) * item.quantity, 0);

    const productsToDisplay = useMemo(() => {
        return PRODUCTS.filter(p => {
            const brandMatch = brandFilter.length === 0 || brandFilter.includes(p.brand);
            const categoryMatch = categoryFilter.length === 0 || categoryFilter.includes(p.subcategory || p.category);
            return brandMatch && categoryMatch;
        });
    }, [brandFilter, categoryFilter]);

    const groupedItems = useMemo(() => {
        if (groupBy === 'none') {
            return { 'Все': viewMode === 'products' ? productsToDisplay : allLooks };
        }
        const itemsToGroup = viewMode === 'products' ? productsToDisplay : allLooks;
        return itemsToGroup.reduce((acc, item) => {
            const key = groupBy === 'brand' ? (item as any).brand : ((item as any).subcategory || (item as any).category);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item as any);
            return acc;
        }, {} as Record<string, (RailProduct | Look)[]>);
    }, [productsToDisplay, allLooks, groupBy, viewMode]);

    const allBrands = useMemo(() => [...new Set(PRODUCTS.map(p => p.brand))].map(b => ({ value: b, label: b })), []);
    const allCategories = useMemo(() => [...new Set(PRODUCTS.map(p => p.subcategory || p.category))].map(c => ({ value: c, label: c })), []);
    
    return (
        <section className="h-full bg-secondary/30 flex flex-col p-4 md:p-4 lg:p-4 overflow-hidden">
            <div className="mb-4">
                <h2 className="text-base font-semibold">Syntha / Коллекция FW24</h2>
                 <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Combobox options={allBrands} multiple value={brandFilter} onChange={(v) => setBrandFilter(v as string[])} placeholder="Бренд" className="w-[150px] h-8" />
                    <Combobox options={allCategories} multiple value={categoryFilter} onChange={(v) => setCategoryFilter(v as string[])} placeholder="Категория" className="w-[150px] h-8" />
                    <div className="flex items-center gap-2">
                       <Layers className="h-4 w-4 text-muted-foreground" />
                       <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
                            <SelectTrigger className="w-[150px] h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Без группировки</SelectItem>
                                <SelectItem value="brand">По бренду</SelectItem>
                                <SelectItem value="category">По категории</SelectItem>
                            </SelectContent>
                       </Select>
                    </div>
                     <div className="flex items-center gap-2 p-1 border rounded-md bg-background">
                         <Button variant={viewMode === 'products' ? 'secondary' : 'ghost'} size="sm" className="h-6 px-2 text-xs" onClick={() => setViewMode('products')}><Shirt className="h-4 w-4 mr-1.5"/>Товары</Button>
                         <Button variant={viewMode === 'looks' ? 'secondary' : 'ghost'} size="sm" className="h-6 px-2 text-xs" onClick={() => setViewMode('looks')}><Trello className="h-4 w-4 mr-1.5"/>Образы</Button>
                    </div>
                </div>
            </div>
            <div className="flex-1 relative overflow-y-auto pr-4 -mr-4">
                <AnimatePresence>
                    <div className="space-y-4">
                        {Object.entries(groupedItems).map(([groupName, items]) => (
                            <div key={groupName}>
                                {groupBy !== 'none' && <h3 className="font-semibold mb-2">{groupName}</h3>}
                                <div className={cn(
                                    "grid gap-3",
                                    viewMode === 'products' 
                                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                                )}>
                                    {items.map(item => {
                                        if ('variants' in item) { // It's a RailProduct
                                            const totalInCart = b2bCart.filter(cartItem => cartItem.id === item.id).reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                                            return (
                                                <div key={item.id} className="bg-card border rounded-lg overflow-hidden flex flex-col shadow-sm">
                                                    <div
                                                        className="relative w-full aspect-[4/5] overflow-hidden cursor-pointer group"
                                                        onClick={() => handleSelectProduct(item.id)}
                                                    >
                                                        <Image src={item.heroRailImageUrl} alt={item.title} fill className="object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                        {totalInCart > 0 && <div className="absolute top-2 left-2 h-8 w-8 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center font-bold text-sm">{totalInCart}</div>}
                                                        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                                                            {item.badges?.newIn && <Badge variant="secondary">New</Badge>}
                                                            {item.badges?.bestseller && <Badge variant="destructive">Hot</Badge>}
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                                            <h3 className="font-semibold text-white truncate text-sm">{item.title}</h3>
                                                            <p className="text-xs text-white/80">{item.pricing.currency} {item.pricing.currentPrice.toLocaleString('ru-RU')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                         <Button 
                                                            variant="ghost" 
                                                            className="w-full rounded-t-none text-xs" 
                                                            onClick={() => setExpandedSizeGridId(expandedSizeGridId === item.id ? null : item.id)}
                                                        >
                                                            Размеры
                                                            <ChevronsUpDown className="ml-2 h-3 w-3"/>
                                                        </Button>
                                                        {expandedSizeGridId === item.id && <SizeGrid product={item} onBulkAddToCart={handleBulkAddToCart} />}
                                                    </div>
                                                </div>
                                            )
                                        } else { // It's a Look
                                            return (
                                                 <div key={item.id} className="bg-card border rounded-lg overflow-hidden flex flex-col shadow-sm cursor-pointer group" onClick={() => handleSelectLook(item.id)}>
                                                      <div className="relative w-full aspect-[4/5] overflow-hidden">
                                                        <Image src={item.imageUrl} alt={item.description} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                        <div className="absolute bottom-0 left-0 p-4 text-white">
                                                            <p className="font-semibold text-sm">{item.title || item.description}</p>
                                                            <p className="text-xs text-white/80">{(item.products || []).length} товаров</p>
                                                        </div>
                                                    </div>
                                                 </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatePresence>
            </div>
            
            <AnimatePresence>
                {activeView === 'product' && activeId && (
                    <ProductDetail 
                        product={PRODUCTS.find(p => p.id === activeId)!} 
                        onAddToCart={(variantId, size, qty) => {
                            const product = PRODUCTS.find(p => p.variants.some(v => v.variantId === variantId));
                            const allProduct = allProducts.find(p => p.id === product?.id);
                            if(allProduct) handleAddToCart(allProduct, size, qty);
                        }} 
                        onBack={() => setActiveView(null)} 
                    />
                )}
                 {activeView === 'look' && activeId && (
                    <LookDetail 
                        look={allLooks.find(l => l.id === activeId)!} 
                        onAddToCart={handleAddToCart} 
                        onBack={() => setActiveView(null)} 
                    />
                )}
                 {totalQuantity > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
                    >
                        <div className="bg-card border rounded-lg shadow-2xl p-3 flex items-center gap-3">
                             <div className="flex items-center gap-3 text-sm">
                                <p>Товаров: <span className="font-bold">{b2bCart.length}</span></p>
                                <p>Всего единиц: <span className="font-bold">{totalQuantity}</span></p>
                                <p>Сумма: <span className="font-bold">{totalAmount.toLocaleString('ru-RU')} ₽</span></p>
                            </div>
                            <Button asChild>
                                <Link href="/shop/b2b/matrix">
                                    Перейти к заказу <ArrowRight className="ml-2 h-4 w-4"/>
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

    