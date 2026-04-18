'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { CmsHero } from '@/data/cms.home.default';
import { useRouter } from 'next/navigation';

export function HomeHero({ hero }: { hero: CmsHero }) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-[400px] items-center overflow-hidden rounded-xl border border-slate-100 bg-[#fcfcfc] shadow-2xl shadow-slate-200">
      <div className="absolute inset-0 opacity-20">
        <img
          src={
            hero.backgroundUrl ||
            'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000'
          }
          alt="Hero bg"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative w-full p-4 md:p-16">
        <div className="max-w-2xl space-y-6">
          <div className="font-headline text-sm font-black uppercase leading-[0.9] tracking-tighter text-white md:text-base">
            {hero.title}
          </div>
          <div className="max-w-lg border-l-2 border-white/10 pl-6 text-sm font-medium italic leading-relaxed text-slate-400 md:text-sm">
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
