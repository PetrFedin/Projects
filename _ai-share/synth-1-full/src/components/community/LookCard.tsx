'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <Card className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white transition-all hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200">
      <CardContent className="space-y-6 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                <Users className="h-3 w-3 text-slate-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-slate-900">
                @{post.author.split('@')[0]}
              </span>
            </div>
            <h3 className="line-clamp-1 text-base font-bold uppercase leading-tight tracking-tight text-slate-900">
              {post.title}
            </h3>
            <div className="text-[9px] font-black uppercase tabular-nums tracking-widest text-slate-400">
              {new Date(post.createdAtISO).toLocaleDateString('ru-RU')} // {post.views} просмотров
            </div>
          </div>

          <Button
            variant="outline"
            className="group/like flex h-10 items-center gap-2 rounded-xl border-slate-100 px-4 transition-all hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600"
            onClick={(e) => {
              e.preventDefault();
              onLike();
            }}
          >
            <Heart className="h-4 w-4 transition-transform group-hover/like:scale-110" />
            <span className="text-sm font-black tabular-nums">{post.likes}</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {post.items.slice(0, 3).map((it, idx) => (
            <div
              key={idx}
              className="group/item relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-50 bg-[#fcfcfc] p-2"
            >
              <img
                src={it.image}
                alt={it.title}
                className="h-full w-full object-contain transition-transform duration-700 group-hover/item:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-2 opacity-0 transition-opacity group-hover/item:opacity-100">
                <div className="truncate text-[8px] font-black uppercase text-white">
                  {it.title}
                </div>
                <div className="text-[9px] font-black tabular-nums text-emerald-400">
                  {it.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button
            asChild
            variant="ghost"
            className="group/btn h-10 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <Link href={`/looks/${post.id}`} className="flex items-center justify-center gap-2">
              Подробнее{' '}
              <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
