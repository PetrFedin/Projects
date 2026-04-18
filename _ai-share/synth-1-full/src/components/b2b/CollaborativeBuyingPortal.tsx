'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Users,
  ChevronRight,
  Star,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function CollaborativeBuyingPortal() {
  const { user } = useUIState();
  const { productVotes, toggleProductVote } = useB2BState();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const mockReviewItems = [
    {
      id: '1',
      name: 'Cyber Tech Parka',
      sku: 'CTP-26-001',
      price: 12400,
      image: 'https://placehold.co/400x400/f8fafc/64748b?text=STYLE_1',
    },
    {
      id: '2',
      name: 'Neural Cargo Pants',
      sku: 'NCP-26-042',
      price: 8900,
      image: 'https://placehold.co/400x400/f8fafc/64748b?text=STYLE_2',
    },
    {
      id: '3',
      name: 'Minimalist Overcoat',
      sku: 'MO-26-003',
      price: 15600,
      image: 'https://placehold.co/400x400/f8fafc/64748b?text=STYLE_3',
    },
  ];

  return (
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <Users className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
            >
              COLLAB_REVIEW_v2.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Team Review
            <br />& Voting
          </h2>
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
            Empower your buying team to curate collections together. Vote on key styles, leave
            feedback, and reach consensus before confirming the PO.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="mr-4 flex items-center -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-border-subtle h-10 w-10 overflow-hidden rounded-full border-4 border-white shadow-sm"
              >
                <img src={`https://i.pravatar.cc/100?img=${i + 40}`} />
              </div>
            ))}
            <div className="bg-text-primary flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-[10px] font-black text-white">
              +2
            </div>
          </div>
          <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
            Finalize Consensus <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Voting Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:col-span-8">
          {mockReviewItems.map((item) => {
            const votes = productVotes[item.id] || { likes: [], dislikes: [] };
            const myLike = votes.likes.includes(user?.uid || 'user-1');
            const myDislike = votes.dislikes.includes(user?.uid || 'user-1');

            return (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-6 top-4 flex gap-2">
                    <Badge className="text-text-primary border-none bg-white/90 px-3 py-1 text-[10px] font-black backdrop-blur-md">
                      {item.sku}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleProductVote(item.id, user?.uid || 'user-1', 'like')}
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl border-2 backdrop-blur-md transition-all',
                          myLike
                            ? 'border-emerald-400 bg-emerald-500 text-white shadow-lg'
                            : 'border-white/50 bg-white/20 text-white hover:bg-white/40'
                        )}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleProductVote(item.id, user?.uid || 'user-1', 'dislike')}
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl border-2 backdrop-blur-md transition-all',
                          myDislike
                            ? 'border-rose-400 bg-rose-500 text-white shadow-lg'
                            : 'border-white/50 bg-white/20 text-white hover:bg-white/40'
                        )}
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedProduct(item)}
                      className="h-12 w-12 rounded-2xl border-2 border-white/50 bg-white/20 p-0 text-white backdrop-blur-md hover:bg-white/40"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
                      {item.name}
                    </h4>
                    <span className="text-accent-primary text-sm font-black">
                      {item.price.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-text-muted text-[10px] font-black uppercase">
                        {votes.likes.length} Team Likes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-text-muted text-[10px] font-black uppercase">
                        {votes.dislikes.length} Dislikes
                      </span>
                    </div>
                  </div>

                  <div className="bg-bg-surface2 mt-4 h-1.5 w-full overflow-hidden rounded-full">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(votes.likes.length / (votes.likes.length + votes.dislikes.length + 1)) * 100}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feedback Side */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedProduct ? (
              <motion.div
                key={selectedProduct.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                      Feedback
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProduct(null)}
                      className="h-10 w-10 rounded-xl"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        user: 'Elena (Lead Buyer)',
                        text: 'Love the graphene fabric, but concerned about the price point for our Omsk branch.',
                        time: '2h ago',
                        avatar: 'https://i.pravatar.cc/100?img=41',
                      },
                      {
                        user: 'Mark (Store Mgr)',
                        text: 'Our customers are asking for this specific tech silhouette. Must-have.',
                        time: '1h ago',
                        avatar: 'https://i.pravatar.cc/100?img=42',
                      },
                    ].map((msg, i) => (
                      <div
                        key={i}
                        className="bg-bg-surface2 border-border-subtle flex gap-3 rounded-3xl border p-4"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                          <img src={msg.avatar} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-text-primary text-[10px] font-black uppercase">
                              {msg.user}
                            </span>
                            <span className="text-text-muted text-[8px] font-bold uppercase">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-text-secondary text-[11px] font-medium leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <div className="relative">
                      <textarea
                        placeholder="Add your team feedback..."
                        className="bg-bg-surface2 focus:ring-accent-primary h-32 w-full resize-none rounded-xl border-none p-4 text-sm font-medium focus:ring-2"
                      />
                      <Button className="bg-text-primary absolute bottom-4 right-4 h-10 w-10 rounded-xl p-0 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl border-none p-3 text-white shadow-md shadow-xl">
                <div className="absolute right-0 top-0 p-4 opacity-5">
                  <Users className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-tight">Curation Logic</h3>
                  <p className="text-xs font-medium uppercase leading-relaxed text-white/60">
                    Currently, 82% of your team agrees on the FW26 selection. You need consensus on
                    4 more items to unlock the Tier 2 bulk discount.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Review Completeness</span>
                      <span className="text-white">82%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '82%' }}
                        className="bg-accent-primary h-full"
                      />
                    </div>
                  </div>
                  <Button className="text-text-primary h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    Invite Team Member <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
