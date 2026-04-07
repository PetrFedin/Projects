'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';

export function ShopSidebarHeader() {
  const { role } = useRbac();
  return (
    <div className="px-3 py-3 border-b border-slate-100 shrink-0">
      <Link
        href="/shop"
        className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
      >
        <div className="h-9 w-9 rounded-[4px] bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-rose-900 transition-colors">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 truncate leading-tight">
            Ритейл-центр
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge className="bg-rose-50 text-rose-600 border-none text-[7px] font-black px-1 py-0 h-4">
              RETAIL
            </Badge>
            <span className="text-[8px] text-slate-400 font-bold capitalize">{role}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
