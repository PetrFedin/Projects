'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Filter,
  ChevronDown,
  X,
  Palette,
  Scissors,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/data/products.mock';
import { PREF_COLORS, CATEGORIES, PALETTES, CONTRASTS } from './stylist-constants';
import type { StylistPreferences, ColorPalette, Contrast } from '@/lib/ai-stylist/types';

interface PreferencesAccordionProps {
  preferences: StylistPreferences;
  palette: ColorPalette;
  contrast: Contrast | undefined;
  onToggleFavoriteColor: (c: string) => void;
  onToggleExcludedCategory: (cat: Product['category']) => void;
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
    <div className="border-border-subtle w-full border-t pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-text-primary hover:text-accent-primary group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
              isOpen
                ? 'bg-accent-primary text-white'
                : 'bg-bg-surface2 text-text-secondary group-hover:bg-bg-surface2'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span>Мои предпочтения</span>
            <span className="text-text-muted mt-1 text-[7px] font-bold">
              {hasActive ? 'Настроено' : 'По умолчанию'}
            </span>
          </div>
          <ChevronDown
            className={cn('ml-2 h-3 w-3 transition-transform duration-300', isOpen && 'rotate-180')}
          />
        </button>

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl px-3 text-[9px] font-black uppercase tracking-widest text-rose-500 transition-all hover:bg-rose-50"
            onClick={onReset}
          >
            <X className="mr-1.5 h-3 w-3" />
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-bg-surface2/80 border-border-subtle grid grid-cols-1 gap-3 rounded-xl border p-4 py-4 shadow-inner md:grid-cols-2">
              {/* Любимые цвета */}
              <div className="space-y-4">
                <div className="text-text-muted flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                  <Palette className="h-3.5 w-3.5" />
                  Любимые цвета
                </div>
                <div className="flex flex-wrap gap-2">
                  {PREF_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onToggleFavoriteColor(c.id)}
                      className={cn(
                        'group relative rounded-xl border px-3 py-2 text-[10px] font-bold transition-all',
                        preferences.favoriteColors?.includes(c.id)
                          ? 'text-accent-primary border-accent-primary/30 bg-white shadow-sm'
                          : 'text-text-secondary border-border-subtle hover:border-border-default bg-white/50 hover:bg-white'
                      )}
                    >
                      {preferences.favoriteColors?.includes(c.id) && (
                        <motion.div
                          layoutId="color-check"
                          className="bg-accent-primary absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full"
                        >
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
                <div className="text-text-muted flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                  <Scissors className="h-3.5 w-3.5" />
                  Исключить из подбора
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onToggleExcludedCategory(cat.id)}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-[10px] font-bold transition-all',
                        preferences.excludedCategories?.includes(cat.id)
                          ? 'border-rose-200 bg-rose-50 text-rose-600'
                          : 'text-text-secondary border-border-subtle hover:border-border-default bg-white/50 hover:bg-white'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ограничения по стилю */}
              <div className="space-y-4">
                <div className="text-text-muted flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Ограничения по стилю
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onToggleExcludeOversized}
                    className={cn(
                      'flex items-center justify-center gap-3 rounded-2xl border p-4 transition-all',
                      preferences.excludeOversized
                        ? 'bg-text-primary border-text-primary text-white'
                        : 'text-text-secondary border-border-subtle hover:border-border-default bg-white'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-lg border-2',
                        preferences.excludeOversized
                          ? 'border-white bg-white'
                          : 'border-border-default'
                      )}
                    >
                      {preferences.excludeOversized && (
                        <div className="bg-text-primary h-2 w-2 rounded-[2px]" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Без oversize
                    </span>
                  </button>

                  <button
                    onClick={onToggleExcludeBright}
                    className={cn(
                      'flex items-center justify-center gap-3 rounded-2xl border p-4 transition-all',
                      preferences.excludeBright
                        ? 'bg-text-primary border-text-primary text-white'
                        : 'text-text-secondary border-border-subtle hover:border-border-default bg-white'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-lg border-2',
                        preferences.excludeBright
                          ? 'border-white bg-white'
                          : 'border-border-default'
                      )}
                    >
                      {preferences.excludeBright && (
                        <div className="bg-text-primary h-2 w-2 rounded-[2px]" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Без ярких
                    </span>
                  </button>
                </div>
              </div>

              {/* Цветовая палитра */}
              <div className="space-y-4">
                <div className="text-text-muted flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5" />
                  Цветовая палитра
                </div>
                <div className="flex flex-wrap gap-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onPaletteChange(p.id)}
                      className={cn(
                        'rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm transition-all',
                        palette === p.id
                          ? 'bg-accent-primary border-accent-primary text-white'
                          : 'text-text-secondary border-border-subtle hover:border-border-default hover:text-text-primary bg-white'
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
