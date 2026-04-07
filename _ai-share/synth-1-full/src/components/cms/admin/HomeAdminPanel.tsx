"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { CmsHomeConfig } from "@/data/cms.home.default";
import { DEFAULT_HOME_CMS } from "@/data/cms.home.default";
import { repo } from "@/lib/repo";

function jsonPretty(v: any) {
  return JSON.stringify(v, null, 2);
}

export function HomeAdminPanel() {
  const [cfg, setCfg] = React.useState<CmsHomeConfig>(DEFAULT_HOME_CMS);
  const [raw, setRaw] = React.useState(jsonPretty(DEFAULT_HOME_CMS));
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const existing = await repo.cms.getHome();
      setCfg(existing);
      setRaw(jsonPretty(existing));
    })();
  }, []);

  async function save() {
    setMsg(null);
    try {
      const parsed = JSON.parse(raw) as CmsHomeConfig;
      const saved = await repo.cms.saveHome(parsed);
      setCfg(saved);
      setRaw(jsonPretty(saved));
      setMsg("Сохранено в localStorage. Главная обновится мгновенно.");
    } catch (e: any) {
      setMsg(`Ошибка JSON: ${e?.message ?? "unknown"}`);
    }
  }

  async function reset() {
    const reset = await repo.cms.resetHome();
    setCfg(reset);
    setRaw(jsonPretty(reset));
    setMsg("Сброшено на заводские настройки.");
  }

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span>Systems</span>
            <span className="text-slate-300">//</span>
            <span>OS Admin</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Home CMS Hub</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> ENGINE: ONLINE
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={save} className="h-8 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
            Apply Changes
          </Button>
          <Button variant="ghost" onClick={reset} className="h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-all">
            Factory Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8">
          <Card className="border border-slate-100 bg-white rounded-xl overflow-hidden flex flex-col shadow-sm hover:border-indigo-100/50 transition-all">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold tracking-[0.2em]">Editor_Live</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest opacity-60">home_config.json</div>
            </div>
            <textarea
              className="w-full h-[540px] bg-slate-950 p-3 text-[11px] font-mono text-slate-300 outline-none resize-none focus:ring-0 scrollbar-hide"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
            />
            {msg && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">{msg}</div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm hover:border-indigo-100 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 italic">System Metrics</h3>
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <div className="space-y-2.5 px-1">
                {[
                  { label: "Stories_Count", val: cfg.stories.length },
                  { label: "Carousels", val: cfg.carousels.length },
                  { label: "Live_Nodes", val: cfg.live.length },
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center group/item p-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] group-hover/item:text-indigo-600 transition-colors">{m.label}</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums tracking-tighter italic">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50 mt-2">
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1 opacity-60">Last Engine Sync</h3>
              <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 shadow-inner">
                <p className="text-[9px] font-mono text-slate-500 leading-tight break-all opacity-80">{cfg.updatedAtISO}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm mt-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-3 w-3 text-indigo-600" />
                <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">AI Suggestion</span>
              </div>
              <p className="text-[10px] font-bold text-indigo-700/70 leading-relaxed italic uppercase tracking-tight">
                "Use JSON structure for rapid A/B testing of headlines and CTAs without rebuilds."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
