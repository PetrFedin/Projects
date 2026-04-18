'use client';

import * as React from 'react';
import { repo } from '@/lib/repo';
import { LookCard } from './LookCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Sparkles, LayoutGrid } from 'lucide-react';

export function LooksFeed() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function reload() {
    setLoading(true);
    await repo.looks.ingestSavedLooks();
    const list = await repo.looks.list();
    setItems(list);
    setLoading(false);
  }

  React.useEffect(() => {
    reload();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div className="flex flex-col items-end justify-between gap-3 border-b border-slate-100 pb-8 md:flex-row">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/5">
              <Sparkles className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Community_Nexus
            </span>
          </div>
          <h1 className="font-headline text-sm font-black uppercase tracking-tighter text-slate-900 md:text-base">
            Community Looks
          </h1>
          <p className="max-w-lg text-sm font-medium uppercase italic tracking-[0.2em] text-slate-400">
            "Живой поток образов, созданных нашими пользователями и AI-ядром Syntha."
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="button-professional border-slate-200"
            onClick={reload}
          >
            Refresh Feed
          </Button>
          <Button asChild className="button-glimmer button-professional">
            <a href="/#stylist">Generate New Look</a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-20">
              <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full animate-[module-load-line_2s_infinite] bg-slate-900" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Syncing_Feed...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.map((p) => (
                <LookCard
                  key={p.id}
                  post={p}
                  onLike={async () => {
                    await repo.looks.like(p.id);
                    const list = await repo.looks.list();
                    setItems(list);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="sticky top-24">
            <Card className="space-y-6 rounded-xl border border-slate-100 p-4">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 border-b border-slate-50 pb-2 text-xs font-black uppercase tracking-widest text-slate-900">
                  <TrendingUp className="h-3 w-3" /> Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Minimal', 'Techwear', 'Avant-Garde', 'Cyberpunk', 'Casual', 'Luxury'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="flex items-center gap-2 border-b border-slate-50 pb-2 text-xs font-black uppercase tracking-widest text-slate-900">
                  <LayoutGrid className="h-3 w-3" /> System Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Global_Nodes
                    </span>
                    <span className="text-xs font-black text-slate-900">12.4k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Active_Sessions
                    </span>
                    <span className="text-xs font-black text-slate-900">1,842</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
