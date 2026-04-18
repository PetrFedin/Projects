'use client';

import * as React from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Check,
  ChevronDown,
  Shirt,
  RefreshCw,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import type { Look, WardrobeItem } from '@/lib/repo/aiStylistRepo';
import type { SummarizeProductReviewsOutput } from '@/ai/flows/summarize-product-reviews';

type DisplayProduct = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  slug: string;
};

interface LookProductItemProps {
  item: { p: DisplayProduct; reason: string; productId: string };
  look: Look;
  wardrobe?: WardrobeItem[];
  excludeIds: string[];
}

export function LookProductItem({ item, look, excludeIds }: LookProductItemProps) {
  const { p, reason } = item;
  const [alternatives, setAlternatives] = React.useState<
    { id: string; title: string; price: number; image: string; slug: string }[]
  >([]);
  const [sizeSuggestion, setSizeSuggestion] = React.useState<{
    suggestedSize: string;
    recommendation: string;
  } | null>(null);
  const [reviewsSummary, setReviewsSummary] = React.useState<SummarizeProductReviewsOutput | null>(
    null
  );
  const [loadingAlt, setLoadingAlt] = React.useState(false);
  const [loadingSize, setLoadingSize] = React.useState(false);
  const [loadingReviews, setLoadingReviews] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const productSlug = p.brand === 'My Wardrobe' ? undefined : p.slug;
  const isWardrobe = p.brand === 'My Wardrobe';

  const fetchAlternatives = async () => {
    if (loadingAlt || alternatives.length > 0) return;
    setLoadingAlt(true);
    try {
      const res = await fetch(
        `/api/ai/stylist/alternatives?productId=${p.id}&category=${p.category}&excludeIds=${excludeIds.join(',')}`
      );
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
      const res = await fetch('/api/ai/suggest-size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: p.title, category: p.category }),
      });
      if (res.ok) {
        const data = await res.json();
        setSizeSuggestion({
          suggestedSize: data.suggestedSize,
          recommendation: data.recommendation,
        });
      }
    } catch {
      setSizeSuggestion({
        suggestedSize: '—',
        recommendation: 'Не удалось получить рекомендацию.',
      });
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
    <div className="group/item flex items-center gap-3 transition-transform hover:translate-x-1">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors group-hover/item:border-slate-900">
        <img
          src={p.image}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
        />
        {isWardrobe && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px]">
            <Check className="h-4 w-4 text-slate-900" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <div className="truncate text-[8px] font-black uppercase tracking-widest text-slate-400">
            {p.brand?.toLowerCase().includes('syntha') ? 'Syntha Lab' : p.brand}
          </div>
          {isWardrobe && (
            <div className="os-hex-chip !border-none !bg-accent !text-[5px] !text-white">OWNED</div>
          )}
        </div>
        <div className="truncate text-[11px] font-black uppercase tracking-tight text-slate-900">
          {p.title}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[9px] text-slate-400">
            {p.price > 0 ? `${p.price.toLocaleString('ru-RU')} ₽` : 'IN_INVENTORY'}
          </span>
          {productSlug ? (
            <Link
              href={`/products/${productSlug}`}
              className="text-[7px] font-black uppercase tracking-widest text-accent opacity-0 transition-opacity hover:underline group-hover/item:opacity-100"
            >
              Подробнее
            </Link>
          ) : (
            <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">
              Из гардероба
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isWardrobe) {
    return <div className="flex items-center gap-3 py-2">{content}</div>;
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <div className="group/item -mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-slate-100/50">
          {content}
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover/item:opacity-100" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-3 p-3">
        <div className="flex flex-wrap gap-2">
          {productSlug && (
            <Link
              href={`/products/${productSlug}`}
              className="text-[10px] font-bold text-accent hover:underline"
            >
              Подробнее →
            </Link>
          )}
          <button
            onClick={fetchSize}
            disabled={loadingSize}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <Shirt className="h-3 w-3" />
            {loadingSize
              ? '...'
              : sizeSuggestion
                ? `Размер: ${sizeSuggestion.suggestedSize}`
                : 'Какой размер?'}
          </button>
          <button
            onClick={fetchReviews}
            disabled={loadingReviews}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <MessageCircle className="h-3 w-3" />
            {loadingReviews ? '...' : reviewsSummary ? 'Отзывы AI' : 'Что говорят?'}
          </button>
        </div>
        {sizeSuggestion && (
          <p className="border-l-2 border-indigo-200 pl-2 text-[9px] text-slate-600">
            {sizeSuggestion.recommendation}
          </p>
        )}

        {reviewsSummary && (
          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Social_Proof
              </span>
              <span className="text-[8px] font-bold uppercase text-emerald-600">
                {reviewsSummary.sentiment}
              </span>
            </div>
            <p className="text-[9px] font-medium leading-tight text-slate-700">
              {reviewsSummary.summary}
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {reviewsSummary.pros.slice(0, 2).map((pro, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-emerald-600"
                >
                  <ThumbsUp className="h-2.5 w-2.5" /> {pro}
                </div>
              ))}
              {reviewsSummary.cons.slice(0, 1).map((con, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-rose-400"
                >
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
            className="mb-2 flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="h-3 w-3" />
            {loadingAlt ? 'Загрузка...' : 'Похожие товары'}
          </button>
          {alternatives.length > 0 && (
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {alternatives.map((a) => (
                <Link
                  key={a.id}
                  href={`/products/${a.slug}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                >
                  <img src={a.image} alt="" className="h-8 w-8 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-bold">{a.title}</div>
                    <div className="text-[8px] text-slate-500">
                      {a.price.toLocaleString('ru-RU')} ₽
                    </div>
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
