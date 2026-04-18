'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';
import { ROUTES } from '@/lib/routes';

export function ShopSidebarHeader() {
  const { role } = useRbac();
  return (
    <div className="border-border-subtle shrink-0 border-b px-3 py-3">
      <Link
        href={ROUTES.shop.home}
        className="hover:bg-bg-surface2 group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors"
      >
        <div className="bg-text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] text-white transition-colors group-hover:bg-rose-900">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text-primary truncate text-[10px] font-black uppercase leading-tight tracking-tight">
            Ритейл-центр
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Badge className="h-4 border-none bg-rose-50 px-1 py-0 text-[7px] font-black text-rose-600">
              RETAIL
            </Badge>
            <span className="text-text-muted text-[8px] font-bold capitalize">{role}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
