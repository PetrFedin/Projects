'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Store, Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PLATFORM_SHOPS } from '@/lib/data/platform-shops';
import type { PlatformShop } from '@/lib/brand-profile/online-store-types';

interface OnlineStorePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (shop: PlatformShop) => void;
  excludeIds?: string[];
}

export function OnlineStorePickerDialog({
  open,
  onOpenChange,
  onSelect,
  excludeIds = [],
}: OnlineStorePickerDialogProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PLATFORM_SHOPS.filter(
      (s) =>
        !excludeIds.includes(s.id) &&
        (!q ||
          s.name.toLowerCase().includes(q) ||
          (s.nameAlt && s.nameAlt.toLowerCase().includes(q)) ||
          (s.city && s.city.toLowerCase().includes(q)))
    );
  }, [search, excludeIds]);

  const handleSelect = (shop: PlatformShop) => {
    onSelect(shop);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Выбрать из участников платформы
          </DialogTitle>
          <DialogDescription>
            Магазин получит запрос на подтверждение связи. После подтверждения синхронизация будет активна.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по названию, городу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border border-slate-100 p-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                {excludeIds.length > 0 && !search
                  ? 'Все участники уже добавлены'
                  : 'Ничего не найдено'}
              </p>
            ) : (
              filtered.map((shop) => (
                <button
                  key={shop.id}
                  type="button"
                  onClick={() => handleSelect(shop)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                    'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  )}
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {shop.logoUrl ? (
                      <Image src={shop.logoUrl} alt="" width={40} height={40} className="object-cover" />
                    ) : (
                      <Store className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{shop.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {[shop.type, shop.city].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
