"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Tag, 
  Store, 
  Gavel, 
  Shirt, 
  Zap,
  ArrowRight,
  Cpu,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  Hash,
  Camera,
  Mic,
  QrCode,
  MapPin,
  Truck,
  Box,
  Brain,
  History as HistoryIcon,
  Activity,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type SuggestItem = {
  type: "product" | "brand" | "category" | "auction" | "query" | "trend";
  label: string;
  description?: string;
  payload?: any;
};

export function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<SuggestItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setQ("АНАЛИЗ ИЗОБРАЖЕНИЯ...");

    // Simulate AI processing the image
    setTimeout(() => {
      setIsAnalyzing(false);
      setQ("Красное кожаное пальто"); // AI "detected" query
      setItems([
        { type: "product", label: "Кожаное пальто Premium", description: "98% Visual Match", payload: { slug: "leather-coat" } },
        { type: "product", label: "Плащ из эко-кожи", description: "92% Visual Match", payload: { slug: "eco-leather-trench" } },
        { type: "trend", label: "Red Leather Trend", description: "AI Trend Correlation", payload: { query: "red leather" } },
      ]);
    }, 2500);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQ("");
      setItems([]);
      return;
    }

    const v = q.trim();
    if (!v) {
      setItems([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(v)}`);
        if (res.ok) {
          const json = (await res.json()) as SuggestItem[];
          // Filter out any private profile results if they exist (client-side safety)
          const publicItems = json.filter(it => !["profile", "admin", "private"].includes(it.type));
          setItems(publicItems);
        } else {
          // Public mock data only
          setItems([
            { type: "product", label: "Пальто из кашемира", description: "Премиальная коллекция FW26", payload: { slug: "cashmere-coat" } },
            { type: "brand", label: "Syntha Premium", description: "Public Brand Showroom", payload: { brand: "syntha" } },
            { type: "auction", label: "Тендер: Пошив 500ед.", description: "Открытый B2B аукцион", payload: { id: "auc-1" } },
            { type: "trend", label: "Эко-материалы", description: "Тренд сезона 2026", payload: { query: "eco" } },
          ]);
        }
      } catch (error) {
        console.error("Search fetch failed", error);
      }
    }, 200);

    return () => clearTimeout(t);
  }, [q, open]);

  function handleSelect(it: SuggestItem) {
    setOpen(false);
    if (it.type === "product" && it.payload?.slug) {
      router.push(`/products/${it.payload.slug}`);
    } else if (it.type === "brand" && it.payload?.brand) {
      router.push(`/search?brand=${it.payload.brand}`);
    } else if (it.type === "category" && it.payload?.category) {
      router.push(`/search?category=${it.payload.category}`);
    } else if (it.type === "auction" && it.payload?.id) {
      router.push(`/auctions/${it.payload.id}`);
    } else if (it.type === "passport" && it.payload?.id) {
      router.push(`/b/syntha?passport=${it.payload.id}`);
    } else if (it.type === "query" && it.payload?.q) {
      router.push(`/search?q=${encodeURIComponent(it.payload.q)}`);
    } else if (it.type === "trend" && it.payload?.query) {
      router.push(`/search?q=${encodeURIComponent(it.payload.query)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(it.label)}`);
    }
  }

  return (
    <>
        <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 text-slate-900 hover:bg-slate-50 transition-colors group"
      >
        <Search className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
        <span className="sr-only">Поиск по платформе</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-4xl">
        <div className="flex flex-col h-[70vh] max-h-[700px] overflow-hidden bg-white rounded-none">
          {/* Syntha-style Search Header */}
          <div className="px-10 pt-10 pb-6 border-b border-slate-100 bg-white relative overflow-hidden shrink-0">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-900 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Поиск</span>
                </div>
              </div>
              
              <div className="flex items-center border-b-2 border-slate-900 pb-2 transition-all relative">
                <CommandInput
                  placeholder="ПОИСК ПО ПЛАТФОРМЕ..."
                  value={q}
                  onValueChange={setQ}
                  className="h-12 border-none focus:ring-0 text-base md:text-sm font-black uppercase tracking-tight placeholder:text-slate-100 flex-1 bg-transparent text-slate-900 caret-black"
                />
                <div className="flex items-center gap-2 ml-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-full group/mic"
                    title="Голосовой поиск"
                  >
                    <Mic className="h-5 w-5 group-hover/mic:scale-110 transition-transform" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "h-10 w-10 transition-all rounded-full group/cam",
                      isAnalyzing ? "bg-indigo-600 text-white animate-pulse" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                    )}
                    title="Визуальный поиск по фото"
                  >
                    <Camera className="h-5 w-5 group-hover/cam:scale-110 transition-transform" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all rounded-full group/qr"
                    title="Сканировать Digital Passport"
                  >
                    <QrCode className="h-5 w-5 group-hover/qr:scale-110 transition-transform" />
                  </Button>
                  {q && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setQ("")}
                      className="h-10 px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0 border-l border-slate-100 ml-2 rounded-none"
                    >
                      <Zap className="h-4 w-4" />
                      Очистить
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <CommandList className="flex-1 px-10 pb-10 pt-2 scrollbar-hide bg-white overflow-y-auto">
            {/* Quick Actions / Role-based Deep Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 mt-2">
              <button onClick={() => { setOpen(false); router.push('/search?visual=true'); }} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all group/qa">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover/qa:bg-indigo-600 group-hover/qa:text-white transition-colors">
                  <Camera className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-tight">Visual Search</p>
                  <p className="text-[7px] text-slate-400 font-bold uppercase">Поиск по фото</p>
                </div>
              </button>
              <button onClick={() => { setOpen(false); router.push('/loyalty'); }} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all group/qa">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover/qa:bg-emerald-600 group-hover/qa:text-white transition-colors">
                  <QrCode className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-tight">Digital Passport</p>
                  <p className="text-[7px] text-slate-400 font-bold uppercase">Проверить вещь</p>
                </div>
              </button>
              <button onClick={() => { setOpen(false); router.push('/brand/analytics-360'); }} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all group/qa">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center group-hover/qa:bg-amber-600 group-hover/qa:text-white transition-colors">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-tight">AI Insights</p>
                  <p className="text-[7px] text-slate-400 font-bold uppercase">Аналитика рынка</p>
                </div>
              </button>
              <button onClick={() => { setOpen(false); router.push('/live'); }} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all group/qa">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover/qa:bg-rose-600 group-hover/qa:text-white transition-colors">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-tight">Live Pulse</p>
                  <p className="text-[7px] text-slate-400 font-bold uppercase">События Live</p>
                </div>
              </button>
            </div>

            <CommandEmpty className="py-24 text-center">
              <div className="space-y-6 max-w-xs mx-auto">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <Search className="h-8 w-8 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-900">Результатов не найдено</p>
                </div>
              </div>
            </CommandEmpty>

            {q.length === 0 && (
              <div className="w-full">
                <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 block">Популярные запросы</span>}>
                  <div className="flex flex-wrap gap-2 p-2">
                    {[
                      "FW26", "Organic Cotton", "Smart Tailoring", "Techwear", 
                      "Cashmere", "Оверсайз", "Минимализм", "Sustainable Fashion",
                      "Streetwear", "Luxury Knitwear"
                    ].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => { setQ(tag); }}
                        className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm flex items-center gap-2 group"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </CommandGroup>
              </div>
            )}

            {items.length > 0 && (
              <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 block">Результаты поиска</span>}>
                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <CommandItem
                      key={idx}
                      value={it.label}
                      onSelect={() => handleSelect(it)}
                      className="flex items-center justify-between p-4 cursor-pointer border border-slate-50 hover:border-slate-900 rounded-none group aria-selected:bg-slate-50 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-all">
                          {it.type === 'product' && <Shirt className="h-5 w-5 text-slate-400" />}
                          {it.type === 'brand' && <Store className="h-5 w-5 text-slate-400" />}
                          {it.type === 'auction' && <Gavel className="h-5 w-5 text-slate-400" />}
                          {it.type === 'category' && <Tag className="h-5 w-5 text-slate-400" />}
                          {it.type === 'trend' && <TrendingUp className="h-5 w-5 text-slate-400" />}
                          {it.type === 'query' && <Search className="h-5 w-5 text-slate-400" />}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{it.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-slate-200 px-1 py-0 rounded-none">{it.type}</Badge>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{it.description}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
          </CommandList>

          {/* Syntha-style Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end text-slate-400 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Neural Engine v2.5</span>
                </div>
                <span className="text-[7px] font-bold uppercase text-slate-400 tracking-[0.4em] mt-3 block">Защита индустриальных данных</span>
              </div>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
