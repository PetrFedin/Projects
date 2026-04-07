"use client";

import * as React from "react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Shirt, RefreshCw, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Look, WardrobeItem } from "@/lib/repo/aiStylistRepo";
import type { SummarizeProductReviewsOutput } from "@/ai/flows/summarize-product-reviews";

type DisplayProduct = { id: string; title: string; brand: string; category: string; price: number; image: string; slug: string };

interface LookProductItemProps {
  item: { p: DisplayProduct; reason: string; productId: string };
  look: Look;
  wardrobe?: WardrobeItem[];
  excludeIds: string[];
}

export function LookProductItem({ item, look, excludeIds }: LookProductItemProps) {
  const { p, reason } = item;
  const [alternatives, setAlternatives] = React.useState<{ id: string; title: string; price: number; image: string; slug: string }[]>([]);
  const [sizeSuggestion, setSizeSuggestion] = React.useState<{ suggestedSize: string; recommendation: string } | null>(null);
  const [reviewsSummary, setReviewsSummary] = React.useState<SummarizeProductReviewsOutput | null>(null);
  const [loadingAlt, setLoadingAlt] = React.useState(false);
  const [loadingSize, setLoadingSize] = React.useState(false);
  const [loadingReviews, setLoadingReviews] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const productSlug = p.brand === "My Wardrobe" ? undefined : p.slug;
  const isWardrobe = p.brand === "My Wardrobe";

  const fetchAlternatives = async () => {
    if (loadingAlt || alternatives.length > 0) return;
    setLoadingAlt(true);
    try {
      const res = await fetch(`/api/ai/stylist/alternatives?productId=${p.id}&category=${p.category}&excludeIds=${excludeIds.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        setAlternatives(data.alternatives ?? []);
      }
    } catch {
      setAlternatives([]);
    } finally {
      setLoadingAlt(false);
    }
  };

  const fetchSize = async () => {
    if (loadingSize || sizeSuggestion) return;
    setLoadingSize(true);
    try {
      const res = await fetch("/api/ai/suggest-size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: p.title, category: p.category }),
      });
      if (res.ok) {
        const data = await res.json();
        setSizeSuggestion({ suggestedSize: data.suggestedSize, recommendation: data.recommendation });
      }
    } catch {
      setSizeSuggestion({ suggestedSize: "—", recommendation: "Не удалось получить рекомендацию." });
    } finally {
      setLoadingSize(false);
    }
  };

  const fetchReviews = async () => {
    if (loadingReviews || reviewsSummary) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/ai/reviews?productId=${p.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviewsSummary(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleOpen = (o: boolean) => {
    setOpen(o);
    if (o && !isWardrobe) {
      fetchAlternatives();
    }
  };

  const content = (
    <div className="flex gap-3 items-center group/item transition-transform hover:translate-x-1">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 relative shadow-sm group-hover/item:border-slate-900 transition-colors">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
        {isWardrobe && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
            <Check className="h-4 w-4 text-slate-900" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest truncate">
            {p.brand?.toLowerCase().includes("syntha") ? "Syntha Lab" : p.brand}
          </div>
          {isWardrobe && <div className="os-hex-chip !bg-accent !text-white !border-none !text-[5px]">OWNED</div>}
        </div>
        <div className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{p.title}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] font-mono text-slate-400">
            {p.price > 0 ? `${p.price.toLocaleString("ru-RU")} ₽` : "IN_INVENTORY"}
          </span>
          {productSlug ? (
            <Link
              href={`/products/${productSlug}`}
              className="opacity-0 group-hover/item:opacity-100 transition-opacity text-[7px] font-black text-accent uppercase tracking-widest hover:underline"
            >
              Подробнее
            </Link>
          ) : (
            <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Из гардероба</span>
          )}
        </div>
      </div>
    </div>
  );

  if (isWardrobe) {
    return <div className="flex gap-3 items-center py-2">{content}</div>;
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <div className="group/item flex gap-3 items-center py-2 cursor-pointer rounded-lg hover:bg-slate-100/50 transition-colors -mx-1 px-1">
          {content}
          <ChevronDown className="h-4 w-4 text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3 space-y-3">
        <div className="flex flex-wrap gap-2">
          {productSlug && (
            <Link href={`/products/${productSlug}`} className="text-[10px] font-bold text-accent hover:underline">
              Подробнее →
            </Link>
          )}
          <button
            onClick={fetchSize}
            disabled={loadingSize}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Shirt className="h-3 w-3" />
            {loadingSize ? "..." : sizeSuggestion ? `Размер: ${sizeSuggestion.suggestedSize}` : "Какой размер?"}
          </button>
          <button
            onClick={fetchReviews}
            disabled={loadingReviews}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <MessageCircle className="h-3 w-3" />
            {loadingReviews ? "..." : reviewsSummary ? "Отзывы AI" : "Что говорят?"}
          </button>
        </div>
        {sizeSuggestion && (
          <p className="text-[9px] text-slate-600 border-l-2 border-indigo-200 pl-2">{sizeSuggestion.recommendation}</p>
        )}
        
        {reviewsSummary && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Social_Proof</span>
              <span className="text-[8px] font-bold text-emerald-600 uppercase">{reviewsSummary.sentiment}</span>
            </div>
            <p className="text-[9px] text-slate-700 leading-tight font-medium">
              {reviewsSummary.summary}
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {reviewsSummary.pros.slice(0, 2).map((pro, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-600 uppercase">
                  <ThumbsUp className="h-2.5 w-2.5" /> {pro}
                </div>
              ))}
              {reviewsSummary.cons.slice(0, 1).map((con, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[8px] font-bold text-rose-400 uppercase">
                  <ThumbsDown className="h-2.5 w-2.5" /> {con}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            onClick={fetchAlternatives}
            disabled={loadingAlt}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 mb-2"
          >
            <RefreshCw className="h-3 w-3" />
            {loadingAlt ? "Загрузка..." : "Похожие товары"}
          </button>
          {alternatives.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {alternatives.map((a) => (
                <Link
                  key={a.id}
                  href={`/products/${a.slug}`}
                  className="flex gap-2 items-center py-1.5 px-2 rounded-lg hover:bg-slate-50"
                >
                  <img src={a.image} alt="" className="w-8 h-8 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold truncate">{a.title}</div>
                    <div className="text-[8px] text-slate-500">{a.price.toLocaleString("ru-RU")} ₽</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
