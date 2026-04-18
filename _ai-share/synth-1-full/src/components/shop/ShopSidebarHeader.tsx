'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';

export function ShopSidebarHeader() {
  const { role } = useRbac();
  return (
    <div className="shrink-0 border-b border-slate-100 px-3 py-3">
      <Link
        href="/shop"
        className="group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-slate-900 text-white transition-colors group-hover:bg-rose-900">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-black uppercase leading-tight tracking-tight text-slate-900">
            Ритейл-центр
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Badge className="h-4 border-none bg-rose-50 px-1 py-0 text-[7px] font-black text-rose-600">
              RETAIL
            </Badge>
            <span className="text-[8px] font-bold capitalize text-slate-400">{role}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
