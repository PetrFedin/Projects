'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Product, ColorInfo } from '@/lib/types';

interface LookProductSelectorProps {
    product: Product;
    selections: Array<{ colorId: string, size: string, qty: number }>;
    onUpdate: (productId: string, colorId: string, size: string, delta: number) => void;
}

export function LookProductSelector({ 
    product, 
    selections, 
    onUpdate 
}: LookProductSelectorProps) {
    const colors: ColorInfo[] = product.availableColors || [
        { id: 'c1', name: 'Графит', hex: '#374151', colorDescription: 'Глубокий серый оттенок', status: 'active', isBase: true, lifecycleStatus: 'in_stock', noSale: false, carryOver: true },
        { id: 'c2', name: 'Олива', hex: '#374631', colorDescription: 'Приглушенный зеленый милитари', status: 'active', isBase: false, lifecycleStatus: 'in_stock', noSale: false, carryOver: false },
        { id: 'c3', name: 'Песочный', hex: '#d1bfa7', colorDescription: 'Теплый бежевый оттенок', status: 'active', isBase: false, lifecycleStatus: 'in_stock', noSale: false, carryOver: false }
    ];

    const [activeColorId, setActiveColorId] = useState<string>(colors[0].id);

    return (
        <div className="space-y-4 bg-muted/20 p-4 rounded-2xl border border-muted/50">
            <div className="flex items-center gap-3">
                <div className="h-12 w-10 relative rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                    {product.images?.[0]?.url ? (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                    ) : (product as any).image ? (
                        <Image src={(product as any).image} alt={product.name} fill className="object-cover" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground opacity-20" />
                    )}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase leading-tight">{product.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {product.availability === 'pre_order' ? 'Предзаказ' : `${product.price.toLocaleString('ru-RU')} ₽`}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Цвет</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-900">
                        {colors.find(c => c.id === activeColorId)?.name}
                    </p>
                </div>
                <div className="flex gap-2">
                    {colors.map(color => (
                        <Tooltip key={color.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setActiveColorId(color.id)}
                                    className={cn(
                                        "h-6 w-6 rounded-full border-2 transition-all active:scale-90",
                                        activeColorId === color.id ? "border-black scale-110 shadow-md" : "border-transparent hover:border-slate-300"
                                    )}
                                    style={{ backgroundColor: color.hex }}
                                />
                            </TooltipTrigger>
                            <TooltipContent 
                                side="top" 
                                className="bg-white/95 backdrop-blur-md text-slate-900 border border-black/5 shadow-xl text-[9px] font-black uppercase py-2 px-3 rounded-xl animate-in fade-in zoom-in duration-200 z-[100]"
                                collisionPadding={20}
                            >
                                {color.colorDescription && (
                                    <span className="text-slate-500 font-bold lowercase first-letter:uppercase">{color.colorDescription}</span>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Выберите размеры</p>
                <div className="flex gap-1.5">
                    {['XS', 'S', 'M', 'L'].map(size => {
                        const item = selections.find(s => s.colorId === activeColorId && s.size === size);
                        const qty = item?.qty || 0;
                        
                        return (
                            <button 
                                key={size}
                                onClick={() => onUpdate(product.id, activeColorId, size, 1)}
                                className={cn(
                                    "h-8 w-10 rounded-xl border text-[10px] font-black transition-all relative overflow-visible",
                                    qty > 0 
                                        ? "bg-black text-white border-black" 
                                        : "bg-white text-black hover:bg-muted border-slate-200"
                                )}
                            >
                                {size}
                                {qty > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full h-4 min-w-[16px] px-0.5 border-2 border-white shadow-md flex items-center justify-center z-20">
                                        <span className="text-[7px] font-black">{qty}</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selections.length > 0 && (
                <div className="pt-2 border-t border-black/5 space-y-2">
                    <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Выбранные позиции:</p>
                    <div className="space-y-1.5">
                        {selections.map((sel, idx) => {
                            const color = colors.find(c => c.id === sel.colorId);
                            return (
                                <div key={idx} className="flex items-center justify-between bg-white/50 rounded-lg p-1.5 border border-black/5 animate-in slide-in-from-left-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color?.hex }} />
                                        <span className="text-[9px] font-black uppercase">{color?.name} / {sel.size}</span>
                                    </div>
                                    <div className="flex items-center border rounded-lg bg-white p-0.5">
                                        <button 
                                            onClick={() => onUpdate(product.id, sel.colorId, sel.size, -1)}
                                            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
                                        >
                                            <Minus className="h-2 w-2" />
                                        </button>
                                        <span className="w-5 text-center text-[9px] font-black">{sel.qty}</span>
                                        <button 
                                            onClick={() => onUpdate(product.id, sel.colorId, sel.size, 1)}
                                            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-green-600"
                                        >
                                            <Plus className="h-2 w-2" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
