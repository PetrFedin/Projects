"use client";

import * as React from "react";
import { repo } from "@/lib/repo";
import { LookCard } from "./LookCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Sparkles, LayoutGrid } from "lucide-react";

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

  React.useEffect(() => { reload(); }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-3 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900/5 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Community_Nexus</span>
          </div>
          <h1 className="text-sm md:text-base font-black uppercase tracking-tighter text-slate-900 font-headline">Community Looks</h1>
          <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em] max-w-lg italic">
            "Живой поток образов, созданных нашими пользователями и AI-ядром Syntha."
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="button-professional border-slate-200" onClick={reload}>
            Refresh Feed
          </Button>
          <Button asChild className="button-glimmer button-professional">
            <a href="/#stylist">Generate New Look</a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 animate-[module-load-line_2s_infinite]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing_Feed...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <Card className="rounded-xl border border-slate-100 p-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" /> Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Minimal", "Techwear", "Avant-Garde", "Cyberpunk", "Casual", "Luxury"].map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 cursor-pointer hover:bg-slate-900 hover:text-white transition-all">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-2">
                  <LayoutGrid className="h-3 w-3" /> System Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global_Nodes</span>
                    <span className="text-xs font-black text-slate-900">12.4k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active_Sessions</span>
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
