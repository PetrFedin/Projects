"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SearchResultsGrid({
  loading,
  q,
  total,
  items,
}: {
  loading: boolean;
  q: string;
  total: number;
  items: any[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {loading ? "Загрузка результатов..." : `Найдено: ${total} ${total === 1 ? 'позиция' : 'позиций'} · запрос: “${q || "—"}”`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {(items ?? []).map((p) => (
          <Card key={p.id} className="bg-slate-900/50 border-slate-800 hover:border-accent/50 transition-all group overflow-hidden rounded-2xl">
            <CardContent className="p-0 space-y-0">
              <div className="w-full aspect-[4/5] bg-slate-800 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {p.season !== "All" && (
                    <Badge className="bg-black/60 backdrop-blur-md text-[8px] font-black uppercase border-none">
                      {p.season}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-0.5">{p.brand}</div>
                    <div className="text-sm font-bold text-white truncate">{p.title}</div>
                  </div>
                  <div className="text-sm font-black text-white shrink-0">{Number(p.price).toLocaleString("ru-RU")} ₽</div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(p.tags ?? []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[9px] font-medium text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && (!items || !items.length) && (
        <div className="text-sm text-slate-400 p-4 rounded-3xl bg-slate-900/30 border border-slate-800 border-dashed text-center">
          <div className="max-w-xs mx-auto space-y-2">
            <p className="font-bold text-white uppercase tracking-widest text-xs">Ничего не найдено</p>
            <p className="text-[11px]">Попробуйте изменить параметры фильтрации или поисковый запрос.</p>
          </div>
        </div>
      )}
    </div>
  );
}
