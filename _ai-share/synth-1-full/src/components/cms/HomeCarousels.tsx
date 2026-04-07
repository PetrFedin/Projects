"use client";

import * as React from "react";
import type { CmsCarousel } from "@/data/cms.home.default";
import { PRODUCTS } from "@/data/products.mock";
import { useRouter } from "next/navigation";
import { ArrowRight, Maximize2 } from "lucide-react";
import Link from "next/link";

export function HomeCarousels({ carousels }: { carousels: CmsCarousel[] }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {carousels.map((c) => {
        const items = c.productSlugs
          .map(slug => PRODUCTS.find(p => p.slug === slug))
          .filter(Boolean) as typeof PRODUCTS;

        return (
          <div key={c.id} className="space-y-6">
            <div className="flex items-end justify-between gap-3 px-2">
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase tracking-tighter text-slate-900 leading-none">{c.title}</h3>
                {c.subtitle && <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">{c.subtitle}</div>}
              </div>
              <button
                className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 group"
                onClick={() => router.push(`/search?q=`)}
              >
                View all <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar px-2">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="shrink-0 w-[240px] group transition-all text-left"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-slate-100 p-4 bg-[#fcfcfc] transition-all group-hover:border-slate-900 group-hover:shadow-2xl group-hover:shadow-slate-200">
                    <img src={p.image} alt={p.title} className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-center">
                    <div className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">{p.brand}</div>
                    <div className="text-xs font-bold uppercase tracking-tight text-slate-900 line-clamp-1 group-hover:underline underline-offset-4">{p.title}</div>
                    <div className="text-sm font-black text-slate-900 tabular-nums">{p.price.toLocaleString("ru-RU")} ₽</div>
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
