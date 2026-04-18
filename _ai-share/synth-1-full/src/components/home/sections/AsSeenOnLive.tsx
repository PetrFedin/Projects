'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LIVE_POSTS = [
  {
    id: 1,
    user: 'Neural_Aria',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1529133037942-0a3a91690c90?w=800&q=80',
    likes: 1240,
    tags: ['Cyberpunk', 'Streetwear'],
  },
  {
    id: 2,
    user: 'Zero_Gravity',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    likes: 892,
    tags: ['Minimal', 'Futurism'],
  },
  {
    id: 3,
    user: 'Style_Ghost',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    likes: 2105,
    tags: ['Old Money', 'Classic'],
  },
  {
    id: 4,
    user: 'Synth_Lord',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80',
    likes: 560,
    tags: ['Techwear', 'Avantgarde'],
  },
];

export function AsSeenOnLive() {
  return (
    <div className="w-full">
      <div className="mb-12 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-indigo-100 bg-indigo-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-indigo-600"
            >
              SOCIAL_SYNC_LIVE
            </Badge>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-4xl">
              AS SEEN ON LIVE
            </h2>
            <p className="max-w-xl text-sm text-slate-500">
              "Образы, которые взорвали ленту за последние 24 часа. Сообщество выбрало лучшее."
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-4 flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-200"
              >
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
              </div>
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white">
              +42
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">45.2K</div>
            <div className="text-nowrap text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Участников сейчас
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {LIVE_POSTS.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={post.image}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
                <img
                  src={post.avatar}
                  className="h-6 w-6 rounded-full border border-white/20 object-cover"
                />
                <span className="pr-2 text-[9px] font-bold text-white">@{post.user}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <Button
                  variant="ctaOutline"
                  size="ctaMd"
                  className="w-full border-white bg-white text-black hover:border-slate-100 hover:bg-slate-100 hover:text-black"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Купить образ
                </Button>
              </div>
            </div>

            <div className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold uppercase text-indigo-500">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  <span className="text-[10px] font-bold text-slate-900">{post.likes}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-50 pt-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  В тренде
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
