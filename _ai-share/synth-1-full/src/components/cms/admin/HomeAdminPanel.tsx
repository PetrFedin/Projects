'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { DEFAULT_HOME_CMS } from '@/data/cms.home.default';
import { repo } from '@/lib/repo';
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash

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
      setMsg('Сохранено в localStorage. Главная обновится мгновенно.');
    } catch (e: any) {
      setMsg(`Ошибка JSON: ${e?.message ?? 'unknown'}`);
    }
  }

  async function reset() {
    const reset = await repo.cms.resetHome();
    setCfg(reset);
    setRaw(jsonPretty(reset));
    setMsg('Сброшено на заводские настройки.');
  }

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
=======
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16 duration-700 animate-in fade-in">
      <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <span>Systems</span>
            <span className="text-text-muted">//</span>
            <span>OS Admin</span>
          </div>
          <div className="flex items-center gap-2.5">
<<<<<<< HEAD
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              Home CMS Hub
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold tracking-widest text-emerald-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> ENGINE:
              ONLINE
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={save}
<<<<<<< HEAD
            className="h-8 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600"
=======
            className="bg-text-primary hover:bg-accent-primary border-text-primary h-8 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Apply Changes
          </Button>
          <Button
            variant="ghost"
            onClick={reset}
<<<<<<< HEAD
            className="h-8 rounded-lg px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-rose-600"
=======
            className="text-text-muted h-8 rounded-lg px-3 text-[9px] font-bold uppercase tracking-widest transition-all hover:text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Factory Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-8">
<<<<<<< HEAD
          <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <div className="bg-text-primary border-text-primary/30 flex shrink-0 items-center justify-between border-b px-4 py-2">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                  Editor_Live
                </span>
              </div>
<<<<<<< HEAD
              <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500 opacity-60">
=======
              <div className="text-text-secondary font-mono text-[9px] uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                home_config.json
              </div>
            </div>
            <textarea
<<<<<<< HEAD
              className="scrollbar-hide h-[540px] w-full resize-none bg-slate-950 p-3 font-mono text-[11px] text-slate-300 outline-none focus:ring-0"
=======
              className="bg-text-primary text-text-muted scrollbar-hide h-[540px] w-full resize-none p-3 font-mono text-[11px] outline-none focus:ring-0"
>>>>>>> recover/cabinet-wip-from-stash
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
            />
            {msg && (
<<<<<<< HEAD
              <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-4 py-2">
=======
              <div className="bg-bg-surface2 border-border-subtle flex items-center justify-end border-t px-4 py-2">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 animate-in fade-in slide-in-from-right-2">
                  {msg}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 px-1 pb-2.5">
                <h3 className="text-[10px] font-bold uppercase italic tracking-widest text-slate-700">
                  System Metrics
                </h3>
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all">
            <div className="space-y-4">
              <div className="border-border-subtle flex items-center justify-between border-b px-1 pb-2.5">
                <h3 className="text-text-primary text-[10px] font-bold uppercase italic tracking-widest">
                  System Metrics
                </h3>
                <div className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <div className="space-y-2.5 px-1">
                {[
                  { label: 'Stories_Count', val: cfg.stories.length },
                  { label: 'Carousels', val: cfg.carousels.length },
                  { label: 'Live_Nodes', val: cfg.live.length },
                ].map((m, i) => (
                  <div
                    key={i}
<<<<<<< HEAD
                    className="group/item flex items-center justify-between rounded-lg border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors group-hover/item:text-indigo-600">
                      {m.label}
                    </span>
                    <span className="text-sm font-bold italic tabular-nums tracking-tighter text-slate-900">
=======
                    className="group/item hover:bg-bg-surface2 hover:border-border-subtle flex items-center justify-between rounded-lg border border-transparent p-2 transition-all"
                  >
                    <span className="text-text-muted group-hover/item:text-accent-primary text-[9px] font-bold uppercase tracking-[0.15em] transition-colors">
                      {m.label}
                    </span>
                    <span className="text-text-primary text-sm font-bold italic tabular-nums tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            <div className="mt-2 space-y-3 border-t border-slate-50 pt-4">
              <h3 className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                Last Engine Sync
              </h3>
              <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 shadow-inner">
                <p className="break-all font-mono text-[9px] leading-tight text-slate-500 opacity-80">
=======
            <div className="border-border-subtle mt-2 space-y-3 border-t pt-4">
              <h3 className="text-text-muted px-1 text-[9px] font-bold uppercase tracking-widest opacity-60">
                Last Engine Sync
              </h3>
              <div className="bg-bg-surface2/80 border-border-subtle rounded-lg border p-3 shadow-inner">
                <p className="text-text-secondary break-all font-mono text-[9px] leading-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                  {cfg.updatedAtISO}
                </p>
              </div>
            </div>

<<<<<<< HEAD
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3.5 shadow-sm">
              <div className="mb-1.5 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-indigo-600" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-600">
                  AI Suggestion
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase italic leading-relaxed tracking-tight text-indigo-700/70">
=======
            <div className="bg-accent-primary/10 border-accent-primary/20 mt-4 rounded-xl border p-3.5 shadow-sm">
              <div className="mb-1.5 flex items-center gap-2">
                <Sparkles className="text-accent-primary h-3 w-3" />
                <span className="text-accent-primary text-[8px] font-bold uppercase tracking-widest">
                  AI Suggestion
                </span>
              </div>
              <p className="text-accent-primary/70 text-[10px] font-bold uppercase italic leading-relaxed tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                "Use JSON structure for rapid A/B testing of headlines and CTAs without rebuilds."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
