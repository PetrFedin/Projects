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
    <Card className="border-border-subtle hover:border-text-primary group relative overflow-hidden rounded-xl border bg-white transition-all hover:shadow-2xl hover:shadow-md">
      <CardContent className="space-y-6 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="bg-bg-surface2 border-border-default flex h-6 w-6 items-center justify-center rounded-full border">
                <Users className="text-text-muted h-3 w-3" />
              </div>
              <span className="text-text-muted group-hover:text-text-primary text-[10px] font-black uppercase tracking-widest transition-colors">
                @{post.author.split('@')[0]}
              </span>
            </div>
            <h3 className="text-text-primary line-clamp-1 text-base font-bold uppercase leading-tight tracking-tight">
              {post.title}
            </h3>
            <div className="text-text-muted text-[9px] font-black uppercase tabular-nums tracking-widest">
              {new Date(post.createdAtISO).toLocaleDateString('ru-RU')} // {post.views} просмотров
            </div>
          </div>

          <Button
            variant="outline"
            className="border-border-subtle group/like flex h-10 items-center gap-2 rounded-xl px-4 transition-all hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600"
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
              className="bg-bg-surface2 border-border-subtle text-text-muted group-hover:bg-text-primary/90 group-hover:border-text-primary rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-all group-hover:text-white"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {post.items.slice(0, 3).map((it, idx) => (
            <div
              key={idx}
              className="group/item border-border-subtle relative aspect-[3/4] overflow-hidden rounded-2xl border bg-[#fcfcfc] p-2"
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
            className="text-text-muted hover:text-text-primary hover:bg-bg-surface2 group/btn h-10 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
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
