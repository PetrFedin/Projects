'use client';

import * as React from 'react';
import type { CmsStory } from '@/data/cms.home.default';
import { useRouter } from 'next/navigation';

export function HomeStories({ stories }: { stories: CmsStory[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="custom-scrollbar flex gap-3 overflow-x-auto px-2 pb-4">
        {stories.map((s) => (
          <button
            key={s.id}
            onClick={() => s.href && router.push(s.href)}
            className="group relative w-44 shrink-0 text-left transition-all"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-1.5 transition-all group-hover:border-slate-900 group-hover:shadow-2xl group-hover:shadow-slate-200">
              <div className="relative h-full w-full overflow-hidden rounded-[1.2rem]">
                <img
                  src={s.cover}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                {s.tag && (
                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                    {s.tag}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="line-clamp-2 text-[11px] font-black uppercase leading-tight tracking-tighter text-white drop-shadow-lg">
                    {s.title}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
