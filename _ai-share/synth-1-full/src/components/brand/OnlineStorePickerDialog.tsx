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
            Магазин получит запрос на подтверждение связи. После подтверждения синхронизация будет
            активна.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск по названию, городу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="border-border-subtle max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">
            {filtered.length === 0 ? (
              <p className="text-text-secondary py-6 text-center text-sm">
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
                    'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                    'hover:bg-bg-surface2 hover:border-border-default border border-transparent'
                  )}
                >
                  <div className="bg-bg-surface2 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    {shop.logoUrl ? (
                      <Image
                        src={shop.logoUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <Store className="text-text-muted h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate font-semibold">{shop.name}</p>
                    <p className="text-text-secondary truncate text-xs">
                      {[shop.type, shop.city].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <Check className="text-accent-primary h-4 w-4 shrink-0" />
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
