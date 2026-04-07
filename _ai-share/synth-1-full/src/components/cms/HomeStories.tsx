"use client";

import * as React from "react";
import type { CmsStory } from "@/data/cms.home.default";
import { useRouter } from "next/navigation";

export function HomeStories({ stories }: { stories: CmsStory[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar px-2">
        {stories.map((s) => (
          <button
            key={s.id}
            onClick={() => s.href && router.push(s.href)}
            className="shrink-0 w-44 group relative transition-all text-left"
          >
            <div className="relative w-full aspect-[9/16] overflow-hidden rounded-3xl border border-slate-100 p-1.5 transition-all group-hover:border-slate-900 group-hover:shadow-2xl group-hover:shadow-slate-200 bg-white">
              <div className="w-full h-full relative overflow-hidden rounded-[1.2rem]">
                <img src={s.cover} alt={s.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                {s.tag && (
                  <div className="absolute top-3 left-3 text-[8px] font-black px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-md uppercase tracking-widest">
                    {s.tag}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[11px] font-black text-white leading-tight uppercase tracking-tighter drop-shadow-lg line-clamp-2">{s.title}</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
