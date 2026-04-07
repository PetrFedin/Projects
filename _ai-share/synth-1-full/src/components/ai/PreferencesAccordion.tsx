"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter, ChevronDown, X, Palette, Scissors, ShieldAlert, 
  Sparkles, SlidersHorizontal, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { StylistPreferences, ColorPalette, Contrast } from "@/lib/repo/aiStylistRepo";
import type { Product } from "@/data/products.mock";
import {
  PREF_COLORS,
  CATEGORIES,
  PALETTES,
  CONTRASTS,
} from "./stylist-constants";

interface PreferencesAccordionProps {
  preferences: StylistPreferences;
  palette: ColorPalette;
  contrast: Contrast | undefined;
  onToggleFavoriteColor: (c: string) => void;
  onToggleExcludedCategory: (cat: Product["category"]) => void;
  onToggleExcludeOversized: () => void;
  onToggleExcludeBright: () => void;
  onPaletteChange: (p: ColorPalette) => void;
  onContrastChange: (c: Contrast | undefined) => void;
  onReset: () => void;
}

export function PreferencesAccordion({
  preferences,
  palette,
  contrast,
  onToggleFavoriteColor,
  onToggleExcludedCategory,
  onToggleExcludeOversized,
  onToggleExcludeBright,
  onPaletteChange,
  onContrastChange,
  onReset,
}: PreferencesAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActive =
    (preferences.favoriteColors?.length ?? 0) > 0 ||
    (preferences.excludedCategories?.length ?? 0) > 0 ||
    preferences.excludeOversized ||
    preferences.excludeBright;

  return (
    <div className="w-full pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-indigo-600 transition-colors group"
        >
          <div className={cn(
            "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
            isOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          )}>
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span>Мои предпочтения</span>
            <span className="text-[7px] text-slate-400 mt-1 font-bold">{hasActive ? 'Настроено' : 'По умолчанию'}</span>
          </div>
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-300 ml-2", isOpen && "rotate-180")} />
        </button>
        
        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
            onClick={onReset}
          >
            <X className="h-3 w-3 mr-1.5" />
            Сбросить
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 bg-slate-50/50 rounded-xl p-4 border border-slate-100 shadow-inner">
              {/* Любимые цвета */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <Palette className="h-3.5 w-3.5" />
                  Любимые цвета
                </div>
                <div className="flex flex-wrap gap-2">
                  {PREF_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onToggleFavoriteColor(c.id)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all relative group",
                        preferences.favoriteColors?.includes(c.id)
                          ? "bg-white text-indigo-600 border-indigo-200 shadow-sm"
                          : "bg-white/50 text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-white"
                      )}
                    >
                      {preferences.favoriteColors?.includes(c.id) && (
                        <motion.div layoutId="color-check" className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-2 w-2 text-white" />
                        </motion.div>
                      )}
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Исключить категории */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <Scissors className="h-3.5 w-3.5" />
                  Исключить из подбора
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onToggleExcludedCategory(cat.id)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all",
                        preferences.excludedCategories?.includes(cat.id)
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-white/50 text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-white"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ограничения по стилю */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Ограничения по стилю
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onToggleExcludeOversized}
                    className={cn(
                      "flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all",
                      preferences.excludeOversized
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className={cn("h-4 w-4 rounded-lg border-2 flex items-center justify-center", preferences.excludeOversized ? "border-white bg-white" : "border-slate-200")}>
                      {preferences.excludeOversized && <div className="h-2 w-2 rounded-[2px] bg-slate-900" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Без oversize</span>
                  </button>

                  <button
                    onClick={onToggleExcludeBright}
                    className={cn(
                      "flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all",
                      preferences.excludeBright
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className={cn("h-4 w-4 rounded-lg border-2 flex items-center justify-center", preferences.excludeBright ? "border-white bg-white" : "border-slate-200")}>
                      {preferences.excludeBright && <div className="h-2 w-2 rounded-[2px] bg-slate-900" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Без ярких</span>
                  </button>
                </div>
              </div>

              {/* Цветовая палитра */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Цветовая палитра
                </div>
                <div className="flex flex-wrap gap-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onPaletteChange(p.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm",
                        palette === p.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-900"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
