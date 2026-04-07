"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { CmsHero } from "@/data/cms.home.default";
import { useRouter } from "next/navigation";

export function HomeHero({ hero }: { hero: CmsHero }) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-[#fcfcfc] min-h-[400px] flex items-center shadow-2xl shadow-slate-200">
      <div className="absolute inset-0 opacity-20">
        <img src={hero.backgroundUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000"} alt="Hero bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative p-4 md:p-16 w-full">
        <div className="max-w-2xl space-y-6">
          <div className="text-sm md:text-base font-black text-white leading-[0.9] uppercase tracking-tighter font-headline">
            {hero.title}
          </div>
          <div className="text-sm md:text-sm text-slate-400 font-medium leading-relaxed max-w-lg italic border-l-2 border-white/10 pl-6">
            {hero.subtitle}
          </div>

          <div className="pt-4">
            <Button variant="cta" size="ctaLg" onClick={() => router.push(hero.ctaHref)}>
              {hero.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
