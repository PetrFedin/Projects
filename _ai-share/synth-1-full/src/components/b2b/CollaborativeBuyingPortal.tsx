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
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function CollaborativeBuyingPortal() {
  const { user } = useUIState();
  const { productVotes, toggleProductVote } = useB2BState();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const mockReviewItems = [
    { id: '1', name: 'Cyber Tech Parka', sku: 'CTP-26-001', price: 12400, image: 'https://placehold.co/400x400/f8fafc/64748b?text=STYLE_1' },
    { id: '2', name: 'Neural Cargo Pants', sku: 'NCP-26-042', price: 8900, image: 'https://placehold.co/400x400/f8fafc/64748b?text=STYLE_2' },
    { id: '3', name: 'Minimalist Overcoat', sku: 'MO-26-003', price: 15600, image: 'https://placehold.co/400x400/f8fafc/64748b?text=STYLE_3' }
  ];

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              COLLAB_REVIEW_v2.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Team Review<br/>& Voting
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Empower your buying team to curate collections together. Vote on key styles, leave feedback, and reach consensus before confirming the PO.
          </p>
        </div>

        <div className="flex gap-3">
           <div className="flex -space-x-3 items-center mr-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                   <img src={`https://i.pravatar.cc/100?img=${i+40}`} />
                </div>
              ))}
              <div className="h-10 w-10 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">+2</div>
           </div>
           <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
              Finalize Consensus <CheckCircle2 className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Voting Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3">
           {mockReviewItems.map((item) => {
             const votes = productVotes[item.id] || { likes: [], dislikes: [] };
             const myLike = votes.likes.includes(user?.uid || 'user-1');
             const myDislike = votes.dislikes.includes(user?.uid || 'user-1');

             return (
               <Card key={item.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden transition-all hover:scale-[1.02]">
                  <div className="relative aspect-square overflow-hidden">
                     <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute top-4 left-6 flex gap-2">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[10px] px-3 py-1">
                           {item.sku}
                        </Badge>
                     </div>
                     <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <div className="flex gap-2">
                           <button 
                             onClick={() => toggleProductVote(item.id, user?.uid || 'user-1', 'like')}
                             className={cn(
                               "h-12 w-12 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 transition-all",
                               myLike ? "bg-emerald-500 border-emerald-400 text-white shadow-lg" : "bg-white/20 border-white/50 text-white hover:bg-white/40"
                             )}
                           >
                              <ThumbsUp className="h-5 w-5" />
                           </button>
                           <button 
                             onClick={() => toggleProductVote(item.id, user?.uid || 'user-1', 'dislike')}
                             className={cn(
                               "h-12 w-12 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 transition-all",
                               myDislike ? "bg-rose-500 border-rose-400 text-white shadow-lg" : "bg-white/20 border-white/50 text-white hover:bg-white/40"
                             )}
                           >
                              <ThumbsDown className="h-5 w-5" />
                           </button>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => setSelectedProduct(item)}
                          className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/50 text-white p-0 hover:bg-white/40"
                        >
                           <MessageSquare className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex items-center justify-between">
                        <h4 className="text-base font-black uppercase tracking-tight text-slate-900">{item.name}</h4>
                        <span className="text-sm font-black text-indigo-600">{item.price.toLocaleString('ru-RU')} ₽</span>
                     </div>
                     
                     <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase text-slate-400">{votes.likes.length} Team Likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-rose-500" />
                           <span className="text-[10px] font-black uppercase text-slate-400">{votes.dislikes.length} Dislikes</span>
                        </div>
                     </div>

                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4">
                        <motion.div 
                          className="h-full bg-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(votes.likes.length / (votes.likes.length + votes.dislikes.length + 1)) * 100}%` }}
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
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Feedback</h3>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(null)} className="h-10 w-10 rounded-xl"><ArrowRight className="h-5 w-5" /></Button>
                     </div>

                     <div className="space-y-6">
                        {[
                          { user: 'Elena (Lead Buyer)', text: 'Love the graphene fabric, but concerned about the price point for our Omsk branch.', time: '2h ago', avatar: 'https://i.pravatar.cc/100?img=41' },
                          { user: 'Mark (Store Mgr)', text: 'Our customers are asking for this specific tech silhouette. Must-have.', time: '1h ago', avatar: 'https://i.pravatar.cc/100?img=42' }
                        ].map((msg, i) => (
                          <div key={i} className="flex gap-3 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                             <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
                                <img src={msg.avatar} />
                             </div>
                             <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-black uppercase text-slate-900">{msg.user}</span>
                                   <span className="text-[8px] font-bold text-slate-400 uppercase">{msg.time}</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">{msg.text}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="pt-4">
                        <div className="relative">
                           <textarea 
                             placeholder="Add your team feedback..." 
                             className="w-full h-32 p-4 rounded-xl bg-slate-50 border-none font-medium text-sm resize-none focus:ring-2 focus:ring-indigo-500"
                           />
                           <Button className="absolute bottom-4 right-4 h-10 w-10 rounded-xl bg-slate-900 text-white p-0"><CheckCircle2 className="h-4 w-4" /></Button>
                        </div>
                     </div>
                  </Card>
               </motion.div>
             ) : (
               <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-3 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Users className="h-32 w-32" />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <h3 className="text-sm font-black uppercase tracking-tight">Curation Logic</h3>
                     <p className="text-xs font-medium text-white/60 leading-relaxed uppercase">
                       Currently, 82% of your team agrees on the FW26 selection. You need consensus on 4 more items to unlock the Tier 2 bulk discount.
                     </p>
                     <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                           <span>Review Completeness</span>
                           <span className="text-white">82%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-indigo-500" />
                        </div>
                     </div>
                     <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl">
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
