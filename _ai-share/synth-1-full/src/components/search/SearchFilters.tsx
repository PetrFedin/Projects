"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Params = {
  q: string;
  brand: string;
  category: string;
  sort: string;
  priceMin?: number;
  priceMax?: number;
};

export function SearchFilters({
  params,
  facets,
  loading,
  onChange,
}: {
  params: Params;
  facets?: { brands: { value: string; count: number }[]; categories: { value: string; count: number }[] };
  loading: boolean;
  onChange: (next: Params) => void;
}) {
  return (
    <Card className="bg-white border border-slate-200 rounded-none shadow-sm sticky top-24 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-900" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">Refine Results</h3>
          </div>
          <button 
            className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            onClick={() => onChange({ q: "", brand: "", category: "", sort: "relevance" })}
          >
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Text Search */}
          <div className="space-y-2.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Search Keywords</label>
            <div className="relative">
              <input
                className="w-full h-11 border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 rounded-none"
                value={params.q}
                onChange={(e) => onChange({ ...params, q: e.target.value })}
                placeholder="e.g. Cashmere, Oversize..."
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Sort */}
          <div className="space-y-2.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Sort By</label>
            <select
              className="w-full h-11 border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all rounded-none appearance-none cursor-pointer"
              value={params.sort}
              onChange={(e) => onChange({ ...params, sort: e.target.value })}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Brands */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-900 block">Brands</label>
              <div className="h-px bg-slate-900/10 flex-1" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="brand" 
                  checked={params.brand === ""} 
                  onChange={() => onChange({ ...params, brand: "" })}
                  className="w-3.5 h-3.5 accent-slate-900"
                />
                <span className={cn("text-[11px] font-bold uppercase transition-colors", params.brand === "" ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>All Brands</span>
              </label>
              {(facets?.brands ?? []).map(b => (
                <label key={b.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="brand" 
                    value={b.value}
                    checked={params.brand === b.value}
                    onChange={(e) => onChange({ ...params, brand: e.target.value })}
                    className="w-3.5 h-3.5 accent-slate-900"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <span className={cn("text-[11px] font-bold uppercase transition-colors", params.brand === b.value ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>{b.value}</span>
                    <span className="text-[9px] font-black text-slate-300 tabular-nums">{b.count}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-900 block">Categories</label>
              <div className="h-px bg-slate-900/10 flex-1" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  checked={params.category === ""} 
                  onChange={() => onChange({ ...params, category: "" })}
                  className="w-3.5 h-3.5 accent-slate-900"
                />
                <span className={cn("text-[11px] font-bold uppercase transition-colors", params.category === "" ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>All Categories</span>
              </label>
              {(facets?.categories ?? []).map(c => (
                <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    value={c.value}
                    checked={params.category === c.value}
                    onChange={(e) => onChange({ ...params, category: e.target.value })}
                    className="w-3.5 h-3.5 accent-slate-900"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <span className={cn("text-[11px] font-bold uppercase transition-colors", params.category === c.value ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>{c.value}</span>
                    <span className="text-[9px] font-black text-slate-300 tabular-nums">{c.count}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-900">Price Range (₽)</label>
              <div className="h-px bg-slate-900/10 flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="w-full h-11 border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 rounded-none"
                value={params.priceMin?.toString() ?? ""}
                onChange={(e) => onChange({ ...params, priceMin: e.target.value ? Number(e.target.value) : undefined })}
                inputMode="numeric"
                placeholder="From"
              />
              <input
                className="w-full h-11 border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 rounded-none"
                value={params.priceMax?.toString() ?? ""}
                onChange={(e) => onChange({ ...params, priceMax: e.target.value ? Number(e.target.value) : undefined })}
                inputMode="numeric"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <button
            disabled={loading}
            className="w-full h-12 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2"
            onClick={() => onChange({ ...params })}
          >
            {loading ? "Searching..." : "Apply Filters"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
