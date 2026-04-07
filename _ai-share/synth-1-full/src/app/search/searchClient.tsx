"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Download, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  ChevronDown,
  ArrowRight,
  Maximize2,
  X,
  Package,
  BarChart3,
  TrendingUp,
  RefreshCcw,
  PlusCircle,
  MoreHorizontal,
  Heart,
  ShoppingBag,
  Sparkles,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters } from "@/components/search/SearchFilters";
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUIState } from "@/providers/ui-state";
import { SynthaProductCard } from "@/components/syntha-product-card";

type Result = {
  items: any[];
  total: number;
  facets: {
    brands: { value: string; count: number }[];
    categories: { value: string; count: number }[];
  };
};

export default function SearchPageClient({
  initial,
}: {
  initial: { q: string; brand: string; category: string; sort: string; priceMin?: number; priceMax?: number };
}) {
  const router = useRouter();
  const [params, setParams] = React.useState(initial);
  const [data, setData] = React.useState<Result | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [searchViewMode, setSearchViewMode] = React.useState<'products' | 'looks'>('products');
  const [selectedLook, setSelectedLook] = React.useState<any>(null);
  const [isLookDetailsOpen, setIsLookDetailsOpen] = React.useState(false);

  const { wishlist, addWishlistItem, removeWishlistItem, addCartItem, globalCategory } = useUIState();

  async function load(next = params) {
    setLoading(true);
    const usp = new URLSearchParams();
    usp.set("q", next.q);
    if (next.brand) usp.set("brand", next.brand);
    
    // Merge globalCategory with manual category selection
    if (globalCategory !== 'all') {
      usp.set("gender", globalCategory);
    }
    
    if (next.category) usp.set("category", next.category);
    if (next.sort) usp.set("sort", next.sort);
    if (typeof next.priceMin === "number") usp.set("priceMin", String(next.priceMin));
    if (typeof next.priceMax === "number") usp.set("priceMax", String(next.priceMax));

    try {
      const res = await fetch(`/api/search/query?${usp.toString()}`);
      const json = (await res.json()) as Result;
      setData(json);
    } catch (error) {
      console.error("Failed to load search results", error);
    } finally {
      setLoading(false);
    }

    router.replace(`/search?${usp.toString()}`);
  }

  React.useEffect(() => { 
    load(params); 
    // eslint-disable-next-line 
  }, [params.brand, params.category, params.sort, params.priceMin, params.priceMax, globalCategory]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      {/* --- TOP STRATEGIC BAR (Inventory Style) --- */}
      <div className="border-b border-slate-200 bg-slate-50/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black tracking-tight uppercase text-slate-900">Showroom Matrix</h1>
            <div className="h-4 w-[1px] bg-slate-300" />
            
            {/* View Mode Toggle (Products/Looks) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setSearchViewMode("products")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  searchViewMode === "products" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Package className="h-3 w-3" />
                Товары
              </button>
              <button
                onClick={() => setSearchViewMode("looks")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  searchViewMode === "looks" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Sparkles className="h-3 w-3" />
                Образы
              </button>
            </div>

            <div className="h-4 w-[1px] bg-slate-300" />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {searchViewMode === 'products' ? 'Total Items:' : 'Total Looks:'}
                </span>
                <span className="text-[10px] font-black text-slate-900">
                  {searchViewMode === 'products' ? (data?.total ?? 0) : 6}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status:</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active FW26</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-slate-200 p-0.5 rounded shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("h-8 px-5 text-[10px] font-black uppercase rounded-sm transition-all", viewMode === 'grid' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={cn("h-8 px-5 text-[10px] font-black uppercase rounded-sm transition-all", viewMode === 'table' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
              >
                Table
              </button>
            </div>
            <div className="h-4 w-[1px] bg-slate-300 mx-2" />
            <Button variant="joor" className="h-10 px-6 border-2">
              <Download className="h-3.5 w-3.5 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">
        {/* ANALYTICAL OVERVIEW (Inventory Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { label: "Global Demand", val: "84.2%", sub: "Rising", trend: "up", icon: BarChart3 },
            { label: "Supply Chain", val: "Stable", sub: "98% Flow", trend: "up", icon: RefreshCcw },
            { label: "Price Index", val: "+2.1%", sub: "Inflation", trend: "up", icon: TrendingUp },
            { label: "Available Styles", val: data?.total || "0", sub: "Across Brands", trend: "up", icon: Package },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-slate-400 transition-colors cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{m.label}</span>
                <m.icon className="h-4 w-4 text-slate-200 group-hover:text-slate-900 transition-colors" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black tracking-tight text-slate-900">{m.val}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">{m.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* LEFT FILTER SIDEBAR */}
          <div className="lg:col-span-3">
            <SearchFilters 
              params={params} 
              facets={data?.facets} 
              loading={loading} 
              onChange={(p) => setParams(p)} 
            />
          </div>

          {/* RIGHT PRODUCT GRID/TABLE */}
          <div className="lg:col-span-9 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-50 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[3/4] bg-slate-50 border border-slate-100" />
                ))}
              </div>
            ) : searchViewMode === 'products' ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {(data?.items ?? []).map((p) => (
                    <SynthaProductCard key={p.id} product={p as any} />
                  ))}
                </div>
              ) : (
                /* TABLE VIEW (Inventory Style) */
                <div className="border border-slate-200 rounded-none bg-white overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[40%]">Product Detail</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Wholesale Price</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(data?.items ?? []).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 bg-[#fcfcfc] border border-slate-100 overflow-hidden relative p-1 shrink-0">
                                <img src={p.image} alt="" className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{p.title}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{p.brand}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-slate-900 tabular-nums">{Number(p.price).toLocaleString("ru-RU")} ₽</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="h-8 w-8 inline-flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all border border-transparent hover:border-slate-900">
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              /* LOOKS VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                <AnimatePresence mode="popLayout">
                  {[
                  { 
                    id: 'look-1', 
                    title: 'Gorpcore City', 
                    author: 'Syntha Lab', 
                    type: 'expert', 
                    price: 85000, 
                    originalPrice: 112000,
                    bonus: 2500,
                    items: 4,
                    timeLeft: '12:45:08',
                    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800',
                    gallery: [
                      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200',
                      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200'
                    ],
                    products: [
                      { id: 'p1', name: 'Технологичный анорак', price: 42000, brand: 'Syntha Lab', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
                      { id: 'p2', name: 'Брюки-карго', price: 28000, brand: 'Syntha Lab', image: 'https://images.unsplash.com/photo-1552970571-c41c44b8882c?w=400' }
                    ]
                  },
                  { 
                    id: 'look-2', 
                    title: 'Minimalist Winter', 
                    author: 'Nordic Wool', 
                    type: 'brand', 
                    price: 145000, 
                    originalPrice: 180000,
                    bonus: 5000,
                    items: 3,
                    timeLeft: '05:20:12',
                    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800',
                    gallery: [
                      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200'
                    ],
                    products: [
                      { id: 'p5', name: 'Пальто из кашемира', price: 95000, brand: 'Nordic Wool', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400' }
                    ]
                  },
                  { 
                    id: 'look-3', 
                    title: 'Cyberpunk Era', 
                    author: 'SYNTHA AI', 
                    type: 'platform', 
                    price: 98000, 
                    originalPrice: 130000,
                    bonus: 4000,
                    items: 5,
                    timeLeft: '24:00:00',
                    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800',
                    gallery: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200'],
                    products: []
                  },
                  { 
                    id: 'look-4', 
                    title: 'Ecological Future', 
                    author: 'Nordic Wool', 
                    type: 'brand', 
                    price: 55000, 
                    originalPrice: 75000,
                    bonus: 1500,
                    items: 3,
                    timeLeft: '48:15:30',
                    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800',
                    gallery: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200'],
                    products: []
                  },
                  { 
                    id: 'look-5', 
                    title: 'Parisian Morning', 
                    author: 'Marie L.', 
                    type: 'expert', 
                    price: 112000, 
                    originalPrice: 150000,
                    bonus: 3200,
                    items: 4,
                    timeLeft: '08:30:00',
                    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
                    gallery: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200'],
                    products: []
                  },
                  { 
                    id: 'look-6', 
                    title: 'Tech Noir', 
                    author: 'Syntha Lab', 
                    type: 'expert', 
                    price: 72000, 
                    originalPrice: 95000,
                    bonus: 2100,
                    items: 3,
                    timeLeft: '15:20:00',
                    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
                    gallery: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200'],
                    products: []
                  }
                ]
                .filter(l => !params.brand || l.author.toLowerCase().includes(params.brand.toLowerCase()))
                .map((look) => (
                  <motion.div
                    key={look.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="cursor-pointer group/look-card"
                    onClick={() => {
                      setSelectedLook(look);
                      setIsLookDetailsOpen(true);
                    }}
                  >
                    <div className="relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-900 transition-all duration-500 shadow-sm hover:shadow-xl">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <Image 
                          src={look.imageUrl} 
                          alt={look.title} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover/look-card:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                          <Badge className={cn(
                            "text-[7px] font-black tracking-widest px-1.5 py-0.5 rounded-md border-none",
                            look.type === 'expert' ? "bg-amber-500 text-white" :
                            look.type === 'brand' ? "bg-indigo-600 text-white" :
                            look.type === 'platform' ? "bg-black text-white" :
                            "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          )}>
                            {look.type.toUpperCase()} LOOK
                          </Badge>
                          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                            <div className="h-1 w-1 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[8px] font-black text-slate-900">{look.timeLeft}</span>
                          </div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 space-y-2">
                          <div>
                            <p className="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">{look.author}</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-tighter leading-tight">{look.title}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{look.items} ВЕЩЕЙ</span>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">В НАЛИЧИИ</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white border-t border-slate-50 flex justify-between items-end">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest line-through">{look.originalPrice.toLocaleString('ru-RU')}₽</p>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-base font-black text-slate-900 tracking-tighter leading-none">{look.price.toLocaleString('ru-RU')}₽</p>
                            <span className="text-[8px] font-black text-emerald-600">-{Math.round((1 - look.price/look.originalPrice)*100)}%</span>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            )}
            
            {(!data?.items || data?.items.length === 0) && !loading && (
              <div className="py-40 text-center space-y-4 bg-slate-50/50 border border-slate-100 border-dashed">
                <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto border border-slate-100">
                  <Search className="h-8 w-8 text-slate-200" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Ничего не найдено</h4>
                  <p className="text-[11px] text-slate-400 font-medium max-w-xs mx-auto uppercase tracking-widest leading-loose">
                    Попробуйте изменить параметры фильтрации или поисковый запрос.
                  </p>
                  <Button 
                    variant="joor" 
                    className="mt-6 border-2"
                    onClick={() => {
                      const next = { q: "", brand: "", category: "", sort: "relevance" };
                      setParams(next);
                      load(next);
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Look Details Dialog */}
      <Dialog open={isLookDetailsOpen} onOpenChange={setIsLookDetailsOpen}>
        <DialogContent className="max-w-[95vw] w-[1200px] max-h-[90vh] p-0 overflow-hidden bg-white border-none rounded-xl shadow-2xl">
          {selectedLook && (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Left: Gallery Section */}
              <div className="md:w-1/2 bg-slate-50 relative group h-[400px] md:h-auto">
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {(selectedLook.gallery || [selectedLook.imageUrl]).map((img: string, i: number) => (
                      <CarouselItem key={i} className="h-full">
                        <div className="relative w-full h-full aspect-[4/5] md:aspect-auto min-h-[400px] md:min-h-[800px]">
                          <Image 
                            src={img} 
                            alt={`Gallery ${i}`} 
                            fill 
                            className="object-cover" 
                            priority
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-white/20 border-none text-white hover:bg-white hover:text-black transition-all" />
                  <CarouselNext className="right-4 bg-white/20 border-none text-white hover:bg-white hover:text-black transition-all" />
                </Carousel>
                
                {/* Branding Badge Overlay */}
                <div className="absolute top-4 left-6 z-10 flex flex-col gap-2">
                  <Badge className="bg-black text-white px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest border-none shadow-2xl">
                    {selectedLook.type.toUpperCase()} PREVIEW
                  </Badge>
                </div>
              </div>

              {/* Right: Look Info Section */}
              <div className="md:w-1/2 flex flex-col h-full bg-white relative">
                <div className="p-4 md:p-4 space-y-10 overflow-y-auto max-h-[90vh]">
                  {/* Header */}
                  <div className="space-y-4 border-b border-slate-100 pb-10 relative">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] leading-none mb-2">{selectedLook.author}</p>
                      <DialogTitle className="text-sm md:text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedLook.title}</DialogTitle>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BUNDLE_PRICE</span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-sm font-black text-slate-900 tracking-tighter leading-none">{selectedLook.price.toLocaleString('ru-RU')}₽</span>
                          <span className="text-sm font-black text-slate-300 line-through tracking-tighter">{selectedLook.originalPrice.toLocaleString('ru-RU')}₽</span>
                        </div>
                      </div>
                      <Badge className="h-10 px-4 bg-emerald-500 text-white border-none font-black text-xs uppercase tracking-widest flex items-center justify-center rounded-2xl shadow-lg shadow-emerald-500/20">
                        -{Math.round((1 - selectedLook.price/selectedLook.originalPrice)*100)}% ВЫГОДА
                      </Badge>
                    </div>
                  </div>

                  {/* Composition Matrix */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-indigo-600" /> СОСТАВ ОБРАЗА ({selectedLook.items})
                      </h4>
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Sparkles className="h-3 w-3 fill-indigo-600" />
                        <span className="text-xs font-black uppercase tracking-widest">+{selectedLook.bonus} BONUSES</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {(selectedLook.products || []).map((product: any) => (
                        <div key={product.id} className="group/item flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-900 rounded-3xl transition-all duration-500 border border-transparent hover:border-white/10">
                          <div className="h-20 w-12 rounded-xl overflow-hidden relative shrink-0 shadow-md">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-indigo-600 group-hover/item:text-indigo-400 uppercase tracking-widest leading-none mb-1">{product.brand}</p>
                            <h5 className="text-sm font-black text-slate-900 group-hover/item:text-white uppercase tracking-tight truncate leading-tight">{product.name}</h5>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="bg-white group-hover/item:bg-white/10 border-slate-200 group-hover/item:border-white/20 text-[8px] font-black uppercase text-slate-500 group-hover/item:text-white/60">S, M, L, XL</Badge>
                              <Badge variant="outline" className="bg-white group-hover/item:bg-white/10 border-slate-200 group-hover/item:border-white/20 text-[8px] font-black uppercase text-slate-500 group-hover/item:text-white/60">Black</Badge>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="font-black text-slate-900 group-hover/item:text-white text-base tracking-tighter leading-none">{product.price.toLocaleString('ru-RU')}₽</p>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl bg-white group-hover/item:bg-white/20 text-slate-400 group-hover/item:text-white hover:bg-black hover:text-white transition-all shadow-sm">
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Rewards Active</p>
                        <p className="text-[11px] text-indigo-900/60 font-medium">Бесплатная доставка + 2 года гарантии на компоненты.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">SYNTHA_SECURE_PAY</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="button-glimmer button-professional flex-1 !h-12 !rounded-3xl shadow-2xl">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        КУПИТЬ ВЕСЬ ОБРАЗ ({selectedLook.price.toLocaleString('ru-RU')}₽)
                      </Button>
                      <Button variant="outline" className="h-12 w-12 rounded-3xl border-slate-200 hover:border-slate-900 hover:bg-white transition-all shrink-0">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
