'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allBrandNavLinks } from '@/lib/data/brand-navigation';
import { useBrandCenter } from '@/providers/brand-center-state';

interface BrandCenterSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResult = {
  href: string;
  label: string;
  description?: string;
  group?: string;
  fromRecent?: boolean;
  fromFavorite?: boolean;
};

export function BrandCenterSearch({ open, onOpenChange }: BrandCenterSearchProps) {
  const router = useRouter();
  const { recentPages, favorites, addRecent } = useBrandCenter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchableLinks = allBrandNavLinks.map((link) => ({
    ...link,
    searchText: `${link.label} ${link.description || ''} ${link.href}`.toLowerCase(),
  }));

  const getResults = useCallback((): SearchResult[] => {
    if (query.trim()) {
      return searchableLinks
        .filter((l) => l.searchText.includes(query.toLowerCase()))
        .slice(0, 14)
        .map((l) => ({
          href: l.href,
          label: l.label,
          description: l.description,
<<<<<<< HEAD
          group: (l as any).group,
=======
          group: 'group' in l ? (l as { group?: string }).group : undefined,
>>>>>>> recover/cabinet-wip-from-stash
        }));
    }
    const recent: SearchResult[] = recentPages.slice(0, 6).map((r) => ({
      href: r.href,
      label: r.label,
      description: r.group,
      fromRecent: true,
    }));
    const fav: SearchResult[] = favorites.slice(0, 6).map((f) => ({
      href: f.href,
      label: f.label,
      description: f.group,
      fromFavorite: true,
    }));
    return [...recent, ...fav.filter((f) => !recent.some((r) => r.href === f.href))].slice(0, 12);
  }, [query, recentPages, favorites, searchableLinks]);

  const results = getResults();

  const handleSelect = useCallback(
    (item: SearchResult) => {
      addRecent({ href: item.href, label: item.label, group: item.description });
      router.push(item.href);
      onOpenChange(false);
      setQuery('');
      setSelectedIndex(0);
    },
    [addRecent, router, onOpenChange]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (!open) return;
      if (e.key === 'Escape') onOpenChange(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const item = results[selectedIndex];
        if (item) handleSelect(item);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [open, results, selectedIndex, onOpenChange, handleSelect]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<<<<<<< HEAD
      <DialogContent className="gap-0 overflow-hidden border-slate-200 p-0 sm:max-w-xl">
        <div className="flex items-center border-b border-slate-100 px-4">
          <Search className="mr-3 h-4 w-4 shrink-0 text-slate-400" />
=======
      <DialogContent className="border-border-subtle gap-0 overflow-hidden p-0 sm:max-w-xl">
        <div className="border-border-subtle flex items-center border-b px-4">
          <Search className="text-text-muted mr-3 h-4 w-4 shrink-0" />
>>>>>>> recover/cabinet-wip-from-stash
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Поиск по Brand Center: страницы, модули..."
            className="h-12 border-0 text-sm shadow-none focus-visible:ring-0"
            autoFocus
          />
          <Badge variant="outline" className="ml-2 font-mono text-[9px]">
            ⌘K
          </Badge>
        </div>
        <div className="max-h-[320px] overflow-y-auto py-2">
          {!query.trim() && recentPages.length > 0 && (
            <div className="px-4 py-1">
<<<<<<< HEAD
              <p className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
              <p className="text-text-muted flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                <Clock className="h-3 w-3" /> Недавние
              </p>
            </div>
          )}
          {results.length === 0 ? (
<<<<<<< HEAD
            <div className="px-4 py-8 text-center text-sm text-slate-400">
=======
            <div className="text-text-muted px-4 py-8 text-center text-sm">
>>>>>>> recover/cabinet-wip-from-stash
              {query.trim() ? 'Ничего не найдено' : 'Откройте страницы для появления в недавних'}
            </div>
          ) : (
            <div className="space-y-0.5">
              {results.map((item, i) => (
                <button
                  key={`${item.href}-${i}`}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
<<<<<<< HEAD
                    selectedIndex === i ? 'bg-indigo-50' : 'hover:bg-slate-50'
=======
                    selectedIndex === i ? 'bg-accent-primary/10' : 'hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {item.fromFavorite ? (
                    <Star className="h-4 w-4 shrink-0 fill-amber-500 text-amber-500" />
                  ) : (
<<<<<<< HEAD
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
=======
                    <ArrowRight className="text-text-muted h-3.5 w-3.5 shrink-0" />
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                    {(item.description || item.href) && (
<<<<<<< HEAD
                      <p className="truncate text-[10px] text-slate-400">
=======
                      <p className="text-text-muted truncate text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.description || item.href}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
