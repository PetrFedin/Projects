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
<<<<<<< HEAD
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
=======
      <div className="border-border-subtle flex flex-col items-end justify-between gap-3 border-b pb-8 md:flex-row">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary/5 flex h-8 w-8 items-center justify-center rounded-xl">
              <Sparkles className="text-text-primary h-4 w-4" />
            </div>
            <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">
              Community_Nexus
            </span>
          </div>
          <h1 className="text-text-primary font-headline text-sm font-black uppercase tracking-tighter md:text-base">
            Community Looks
          </h1>
          <p className="text-text-muted max-w-lg text-sm font-medium uppercase italic tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
            "Живой поток образов, созданных нашими пользователями и AI-ядром Syntha."
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
<<<<<<< HEAD
            className="button-professional border-slate-200"
=======
            className="button-professional border-border-default"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full animate-[module-load-line_2s_infinite] bg-slate-900" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
              <div className="bg-bg-surface2 h-1 w-24 overflow-hidden rounded-full">
                <div className="bg-text-primary h-full animate-[module-load-line_2s_infinite]" />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <Card className="space-y-6 rounded-xl border border-slate-100 p-4">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 border-b border-slate-50 pb-2 text-xs font-black uppercase tracking-widest text-slate-900">
=======
            <Card className="border-border-subtle space-y-6 rounded-xl border p-4">
              <div className="space-y-4">
                <h3 className="text-text-primary border-border-subtle flex items-center gap-2 border-b pb-2 text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  <TrendingUp className="h-3 w-3" /> Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Minimal', 'Techwear', 'Avant-Garde', 'Cyberpunk', 'Casual', 'Luxury'].map(
                    (tag) => (
                      <span
                        key={tag}
<<<<<<< HEAD
                        className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
=======
                        className="bg-bg-surface2 text-text-muted border-border-subtle hover:bg-text-primary/90 cursor-pointer rounded-xl border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4">
<<<<<<< HEAD
                <h3 className="flex items-center gap-2 border-b border-slate-50 pb-2 text-xs font-black uppercase tracking-widest text-slate-900">
=======
                <h3 className="text-text-primary border-border-subtle flex items-center gap-2 border-b pb-2 text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  <LayoutGrid className="h-3 w-3" /> System Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
<<<<<<< HEAD
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
=======
                    <span className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                      Global_Nodes
                    </span>
                    <span className="text-text-primary text-xs font-black">12.4k</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                      Active_Sessions
                    </span>
                    <span className="text-text-primary text-xs font-black">1,842</span>
>>>>>>> recover/cabinet-wip-from-stash
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
