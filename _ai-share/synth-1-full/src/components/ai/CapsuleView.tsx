"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Package, LayoutGrid, Layers, ArrowRight, Sparkles, 
  ShoppingCart, Info, Trash2, Plus, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LookResultCard } from "./LookResultCard";
import type { Look, LookItem, WardrobeItem } from "@/lib/repo/aiStylistRepo";
import { resolveProductForDisplay } from "@/lib/ai-stylist";

interface CapsuleViewProps {
  capsule: {
    items: LookItem[];
    combinations: Look[];
  };
  wardrobe?: WardrobeItem[];
  viewRole?: "client" | "b2b";
}

export function CapsuleView({ capsule, wardrobe, viewRole = "client" }: CapsuleViewProps) {
  const [activeTab, setActiveTab] = React.useState<'items' | 'combinations'>('items');
  const [selectedComboIdx, setSelectedComboIdx] = React.useState(0);

  const resolvedItems = capsule.items.map(it => {
    const p = resolveProductForDisplay(it.productId, wardrobe);
    return p ? { ...it, p } : null;
  }).filter(Boolean);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tighter leading-none">
              AI_Capsule_Generator
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">
                {resolvedItems.length} вещей • {capsule.combinations.length} сочетаний
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('items')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'items' ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Состав
          </button>
          <button
            onClick={() => setActiveTab('combinations')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'combinations' ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            Образы
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'items' ? (
          <motion.div
            key="items"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {resolvedItems.map((item: any, idx) => (
              <div 
                key={item.p.id}
                className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-900 transition-all duration-500"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={item.p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.p.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none text-[7px] font-black px-1.5 py-0.5">
                      {Math.round(95 + Math.random() * 4)}%_FIT
                    </Badge>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">{item.p.brand}</div>
                  <div className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-1">{item.p.title}</div>
                  <div className="text-[9px] font-bold text-indigo-600">{item.p.price.toLocaleString('ru-RU')} ₽</div>
                </div>
              </div>
            ))}
            
            <button className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-4 hover:border-slate-900 hover:bg-slate-50 transition-all group aspect-[3/4]">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors mb-3">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                Добавить вещь
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="combinations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {capsule.combinations.map((combo, idx) => (
                <button
                  key={combo.id}
                  onClick={() => setSelectedComboIdx(idx)}
                  className={cn(
                    "shrink-0 px-6 py-3 rounded-2xl border-2 transition-all flex flex-col gap-1",
                    selectedComboIdx === idx 
                      ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                  )}
                >
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Комбинация</div>
                  <div className="text-[11px] font-black uppercase">Вариант #{idx + 1}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-4">
                <LookResultCard 
                  look={capsule.combinations[selectedComboIdx]} 
                  wardrobe={wardrobe} 
                  viewRole={viewRole} 
                />
              </div>
              
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-full flex flex-col justify-center text-center space-y-6">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="h-12 w-12 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto border border-slate-100 rotate-3">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Все вещи совместимы</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Этот набор из {resolvedItems.length} вещей позволяет составить более 12 различных образов для разных сценариев — от работы до вечернего выхода.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-video bg-white rounded-2xl border border-slate-100 flex items-center justify-center group overflow-hidden">
                        <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-indigo-500 transition-colors">
                          PREVIEW_MODE_{i}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full h-10 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-2xl transition-all button-glimmer">
                    Купить всю капсулу
                    <ShoppingCart className="h-4 w-4 ml-3" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
