'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Product, ColorInfo } from '@/lib/types';
import type { LookSelection } from '@/types/story';

interface LookProductSelectorProps {
  product: Product;
  selections: LookSelection[];
  onUpdate: (productId: string, colorId: string, size: string, delta: number) => void;
}

export function LookProductSelector({ product, selections, onUpdate }: LookProductSelectorProps) {
  const colors: ColorInfo[] = product.availableColors || [
    {
      id: 'c1',
      name: 'Графит',
      hex: '#374151',
      colorDescription: 'Глубокий серый оттенок',
      status: 'active',
      isBase: true,
      lifecycleStatus: 'in_stock',
      noSale: false,
      carryOver: true,
    },
    {
      id: 'c2',
      name: 'Олива',
      hex: '#374631',
      colorDescription: 'Приглушенный зеленый милитари',
      status: 'active',
      isBase: false,
      lifecycleStatus: 'in_stock',
      noSale: false,
      carryOver: false,
    },
    {
      id: 'c3',
      name: 'Песочный',
      hex: '#d1bfa7',
      colorDescription: 'Теплый бежевый оттенок',
      status: 'active',
      isBase: false,
      lifecycleStatus: 'in_stock',
      noSale: false,
      carryOver: false,
    },
  ];

  const [activeColorId, setActiveColorId] = useState<string>(colors[0].id);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-muted/50 bg-muted/20 p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
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
          <p className="text-[9px] font-bold uppercase text-muted-foreground">
            {product.availability === 'pre_order'
              ? 'Предзаказ'
              : `${product.price.toLocaleString('ru-RU')} ₽`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Цвет</p>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-900">
            {colors.find((c) => c.id === activeColorId)?.name}
          </p>
        </div>
        <div className="flex gap-2">
          {colors.map((color) => (
            <Tooltip key={color.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveColorId(color.id)}
                  onMouseEnter={() => setIsDescriptionVisible(true)}
                  onMouseLeave={() => setIsDescriptionVisible(false)}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition-all active:scale-90',
                    activeColorId === color.id
                      ? 'scale-110 border-black shadow-md'
                      : 'border-transparent hover:border-slate-300'
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="z-[100] rounded-xl border border-black/5 bg-white/95 px-3 py-2 text-[9px] font-black uppercase text-slate-900 shadow-xl backdrop-blur-md duration-200 animate-in fade-in zoom-in"
                collisionPadding={20}
              >
                {color.colorDescription && (
                  <span className="font-bold lowercase text-slate-500 first-letter:uppercase">
                    {color.colorDescription}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">
          Выберите размеры
        </p>
        <div className="flex gap-1.5">
          {['XS', 'S', 'M', 'L'].map((size) => {
            const item = selections.find((s) => s.colorId === activeColorId && s.size === size);
            const qty = item?.qty || 0;

            return (
              <button
                key={size}
                onClick={() => onUpdate(product.id, activeColorId, size, 1)}
                className={cn(
                  'relative h-8 w-10 overflow-visible rounded-xl border text-[10px] font-black transition-all',
                  qty > 0
                    ? 'border-black bg-black text-white'
                    : 'border-slate-200 bg-white text-black hover:bg-muted'
                )}
              >
                {size}
                {qty > 0 && (
                  <div className="absolute -right-2 -top-2 z-20 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-green-500 px-0.5 text-white shadow-md">
                    <span className="text-[7px] font-black">{qty}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selections.length > 0 && (
        <div className="space-y-2 border-t border-black/5 pt-2">
          <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">
            Выбранные позиции:
          </p>
          <div className="space-y-1.5">
            {selections.map((sel, idx) => {
              const color = colors.find((c) => c.id === sel.colorId);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-black/5 bg-white/50 p-1.5 animate-in slide-in-from-left-1"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ backgroundColor: color?.hex }}
                    />
                    <span className="text-[9px] font-black uppercase">
                      {color?.name} / {sel.size}
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg border bg-white p-0.5">
                    <button
                      onClick={() => onUpdate(product.id, sel.colorId, sel.size, -1)}
                      className="flex h-5 w-5 items-center justify-center rounded hover:bg-muted"
                    >
                      <Minus className="h-2 w-2" />
                    </button>
                    <span className="w-5 text-center text-[9px] font-black">{sel.qty}</span>
                    <button
                      onClick={() => onUpdate(product.id, sel.colorId, sel.size, 1)}
                      className="flex h-5 w-5 items-center justify-center rounded text-green-600 hover:bg-muted"
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
