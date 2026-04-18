'use client';

import * as React from 'react';
import type { CmsCarousel } from '@/data/cms.home.default';
import { PRODUCTS } from '@/data/products.mock';
import { useRouter } from 'next/navigation';
import { ArrowRight, Maximize2 } from 'lucide-react';
import Link from 'next/link';

export function HomeCarousels({ carousels }: { carousels: CmsCarousel[] }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {carousels.map((c) => {
        const items = c.productSlugs
          .map((slug) => PRODUCTS.find((p) => p.slug === slug))
          .filter(Boolean) as typeof PRODUCTS;

        return (
          <div key={c.id} className="space-y-6">
            <div className="flex items-end justify-between gap-3 px-2">
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase leading-none tracking-tighter text-slate-900">
                  {c.title}
                </h3>
                {c.subtitle && (
                  <div className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    {c.subtitle}
                  </div>
                )}
              </div>
              <button
                className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-900"
                onClick={() => router.push(`/search?q=`)}
              >
                View all{' '}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="custom-scrollbar flex gap-3 overflow-x-auto px-2 pb-6">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group w-[240px] shrink-0 text-left transition-all"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-slate-100 bg-[#fcfcfc] p-4 transition-all group-hover:border-slate-900 group-hover:shadow-2xl group-hover:shadow-slate-200">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-contain transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-black text-white shadow-xl transition-transform duration-500 group-hover:scale-100">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-center">
                    <div className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                      {p.brand}
                    </div>
                    <div className="line-clamp-1 text-xs font-bold uppercase tracking-tight text-slate-900 underline-offset-4 group-hover:underline">
                      {p.title}
                    </div>
                    <div className="text-sm font-black tabular-nums text-slate-900">
                      {p.price.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
