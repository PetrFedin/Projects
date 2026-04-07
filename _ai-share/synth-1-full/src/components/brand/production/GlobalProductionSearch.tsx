'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Layers, FileText, Truck, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchResult {
  id: string;
  type: 'collection' | 'sku' | 'po' | 'sample' | 'factory' | 'document' | 'event';
  title: string;
  subtitle?: string;
  collectionId?: string;
}

export interface GlobalProductionSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (result: SearchResult) => void;
  collections: Array<{ id: string; name: string }>;
  skus: Array<{ id: string; name: string; collection?: string }>;
  orders: Array<{ id: string; collection?: string; factory?: string }>;
  samples: Array<{ skuId: string; skuName: string; collection?: string }>;
  factories?: Array<{ id: string; name: string }>;
}

const TYPE_ICONS = {
  collection: Layers,
  sku: Package,
  po: Package,
  sample: Layers,
  factory: Users,
  document: FileText,
  event: Calendar,
};

export function GlobalProductionSearch({
  open,
  onOpenChange,
  onSelect,
  collections,
  skus,
  orders,
  samples,
  factories = [],
}: GlobalProductionSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const search = useCallback(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      setResults([]);
      return;
    }
    const all: SearchResult[] = [
      ...collections.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)).map((c) => ({ id: c.id, type: 'collection' as const, title: c.name, subtitle: c.id })),
      ...skus.filter((s) => (s.name || '').toLowerCase().includes(q) || (s.id || '').toLowerCase().includes(q)).map((s) => ({ id: s.id, type: 'sku' as const, title: s.name, subtitle: s.id, collectionId: s.collection })),
      ...orders.filter((o) => o.id.toLowerCase().includes(q)).map((o) => ({ id: o.id, type: 'po' as const, title: o.id, subtitle: o.factory, collectionId: o.collection })),
      ...samples.filter((s) => (s.skuName || '').toLowerCase().includes(q) || (s.skuId || '').toLowerCase().includes(q)).map((s) => ({ id: s.skuId, type: 'sample' as const, title: s.skuName, subtitle: s.skuId, collectionId: s.collection })),
      ...factories.filter((f) => f.name.toLowerCase().includes(q)).map((f) => ({ id: f.id, type: 'factory' as const, title: f.name })),
    ];
    setResults(all.slice(0, 12));
    setSelectedIdx(0);
  }, [query, collections, skus, orders, samples, factories]);

  useEffect(() => {
    const t = setTimeout(search, 150);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setResults([]);
    setSelectedIdx(0);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      e.preventDefault();
      onSelect(results[selectedIdx]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden border-none shadow-xl rounded-2xl">
        <DialogHeader className="p-4 border-b border-slate-100">
          <DialogTitle className="text-xs font-black uppercase tracking-widest">Глобальный поиск</DialogTitle>
        </DialogHeader>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Артикул, PO, коллекция, фабрика..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 h-10 text-sm"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-[320px] overflow-y-auto border-t border-slate-100">
          {results.length === 0 ? (
            <div className="p-8 text-center text-[11px] text-slate-400">Введите запрос для поиска</div>
          ) : (
            results.map((r, i) => {
              const Icon = TYPE_ICONS[r.type];
              return (
                <button
                  key={`${r.type}-${r.id}`}
                  type="button"
                  onClick={() => { onSelect(r); onOpenChange(false); }}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    i === selectedIdx ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  )}
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate">{r.title}</p>
                    {r.subtitle && <p className="text-[9px] text-slate-500">{r.subtitle}</p>}
                  </div>
                  <Badge variant="outline" className="text-[8px] shrink-0">{r.type}</Badge>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
