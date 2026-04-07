"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

type LookPost = {
  id: string;
  title: string;
  author: string;
  createdAtISO: string;
  tags: string[];
  items: { title: string; brand: string; price: number; image: string }[];
  likes: number;
  views: number;
};

export function LookCard({ post, onLike }: { post: LookPost; onLike: () => void }) {
  return (
    <Card className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 group relative">
      <CardContent className="p-4 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Users className="h-3 w-3 text-slate-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">@{post.author.split('@')[0]}</span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 leading-tight line-clamp-1">{post.title}</h3>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
              {new Date(post.createdAtISO).toLocaleDateString("ru-RU")} // {post.views} просмотров
            </div>
          </div>

          <Button 
            variant="outline" 
            className="h-10 px-4 rounded-xl border-slate-100 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-2 group/like"
            onClick={(e) => {
              e.preventDefault();
              onLike();
            }}
          >
            <Heart className="h-4 w-4 transition-transform group-hover/like:scale-110" />
            <span className="text-sm font-black tabular-nums">{post.likes}</span>
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {post.tags.map((t) => (
            <span key={t} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {post.items.slice(0, 3).map((it, idx) => (
            <div key={idx} className="group/item relative aspect-[3/4] rounded-2xl border border-slate-50 bg-[#fcfcfc] overflow-hidden p-2">
              <img src={it.image} alt={it.title} className="w-full h-full object-contain transition-transform duration-700 group-hover/item:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <div className="text-[8px] font-black text-white uppercase truncate">{it.title}</div>
                <div className="text-[9px] font-black text-emerald-400 tabular-nums">{it.price.toLocaleString("ru-RU")} ₽</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <Button asChild variant="ghost" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all group/btn">
            <Link href={`/looks/${post.id}`} className="flex items-center justify-center gap-2">
              Подробнее <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
