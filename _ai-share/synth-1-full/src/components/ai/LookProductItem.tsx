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
<<<<<<< HEAD
import type { Look, WardrobeItem } from '@/lib/repo/aiStylistRepo';
import type { SummarizeProductReviewsOutput } from '@/ai/flows/summarize-product-reviews';
=======
import type { Look, WardrobeItem } from '@/lib/ai-stylist/types';
>>>>>>> recover/cabinet-wip-from-stash

type DisplayProduct = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  slug: string;
};
<<<<<<< HEAD
=======

type ReviewSummaryPayload = {
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: 'В основном положительные' | 'Смешанные' | 'В основном отрицательные';
};
>>>>>>> recover/cabinet-wip-from-stash

interface LookProductItemProps {
  item: { p: DisplayProduct; reason: string; productId: string };
  look: Look;
  wardrobe?: WardrobeItem[];
  excludeIds: string[];
}

async function fetchAiWithRetry(input: RequestInfo | URL, init?: RequestInit, retries = 1) {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;
      if (i === retries) throw lastError;
    }
  }
  throw lastError;
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
<<<<<<< HEAD
  const [reviewsSummary, setReviewsSummary] = React.useState<SummarizeProductReviewsOutput | null>(
    null
  );
=======
  const [reviewsSummary, setReviewsSummary] = React.useState<ReviewSummaryPayload | null>(null);
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
      const res = await fetch(
=======
      const res = await fetchAiWithRetry(
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
      const res = await fetch('/api/ai/suggest-size', {
=======
      const res = await fetchAiWithRetry('/api/ai/suggest-size', {
>>>>>>> recover/cabinet-wip-from-stash
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
      const res = await fetchAiWithRetry(`/api/ai/reviews?productId=${p.id}`);
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
<<<<<<< HEAD
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors group-hover/item:border-slate-900">
        <img
          src={p.image}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
        />
        {isWardrobe && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px]">
            <Check className="h-4 w-4 text-slate-900" />
=======
      <div className="border-border-default group-hover/item:border-text-primary relative size-10 shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition-colors">
        <img
          src={p.image}
          alt={p.title}
          className="size-full object-cover transition-transform duration-700 group-hover/item:scale-110"
        />
        {isWardrobe && (
          <div className="bg-text-primary/10 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
            <Check className="text-text-primary size-4" />
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
<<<<<<< HEAD
          <div className="truncate text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
          <div className="text-text-muted truncate text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            {p.brand?.toLowerCase().includes('syntha') ? 'Syntha Lab' : p.brand}
          </div>
          {isWardrobe && (
            <div className="os-hex-chip !border-none !bg-accent !text-[5px] !text-white">OWNED</div>
          )}
        </div>
<<<<<<< HEAD
        <div className="truncate text-[11px] font-black uppercase tracking-tight text-slate-900">
          {p.title}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[9px] text-slate-400">
=======
        <div className="text-text-primary truncate text-sm font-black uppercase tracking-tight">
          {p.title}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-text-muted font-mono text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <span className="text-[7px] font-black uppercase tracking-widest text-slate-300">
=======
            <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
        <div className="group/item -mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-slate-100/50">
          {content}
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover/item:opacity-100" />
=======
        <div className="group/item hover:bg-bg-surface2/50 -mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition-colors">
          {content}
          <ChevronDown className="text-text-muted size-4 shrink-0 opacity-0 transition-opacity group-hover/item:opacity-100" />
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-3 p-3">
        <div className="flex flex-wrap gap-2">
          {productSlug && (
            <Link
              href={`/products/${productSlug}`}
<<<<<<< HEAD
              className="text-[10px] font-bold text-accent hover:underline"
=======
              className="text-xs font-bold text-accent hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Подробнее →
            </Link>
          )}
          <button
            onClick={fetchSize}
            disabled={loadingSize}
<<<<<<< HEAD
            className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <Shirt className="h-3 w-3" />
=======
            className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-xs font-bold"
          >
            <Shirt className="size-3" />
>>>>>>> recover/cabinet-wip-from-stash
            {loadingSize
              ? '...'
              : sizeSuggestion
                ? `Размер: ${sizeSuggestion.suggestedSize}`
                : 'Какой размер?'}
          </button>
          <button
            onClick={fetchReviews}
            disabled={loadingReviews}
<<<<<<< HEAD
            className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <MessageCircle className="h-3 w-3" />
=======
            className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-xs font-bold"
          >
            <MessageCircle className="size-3" />
>>>>>>> recover/cabinet-wip-from-stash
            {loadingReviews ? '...' : reviewsSummary ? 'Отзывы AI' : 'Что говорят?'}
          </button>
        </div>
        {sizeSuggestion && (
<<<<<<< HEAD
          <p className="border-l-2 border-indigo-200 pl-2 text-[9px] text-slate-600">
=======
          <p className="border-accent-primary/30 text-text-secondary border-l-2 pl-2 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
            {sizeSuggestion.recommendation}
          </p>
        )}

        {reviewsSummary && (
<<<<<<< HEAD
          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
          <div className="border-border-subtle bg-bg-surface2 space-y-2 rounded-xl border p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Social_Proof
              </span>
              <span className="text-[8px] font-bold uppercase text-emerald-600">
                {reviewsSummary.sentiment}
              </span>
            </div>
<<<<<<< HEAD
            <p className="text-[9px] font-medium leading-tight text-slate-700">
=======
            <p className="text-text-primary text-[9px] font-medium leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
              {reviewsSummary.summary}
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {reviewsSummary.pros.slice(0, 2).map((pro, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-emerald-600"
                >
<<<<<<< HEAD
                  <ThumbsUp className="h-2.5 w-2.5" /> {pro}
=======
                  <ThumbsUp className="size-2.5" /> {pro}
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
              {reviewsSummary.cons.slice(0, 1).map((con, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-rose-400"
                >
<<<<<<< HEAD
                  <ThumbsDown className="h-2.5 w-2.5" /> {con}
=======
                  <ThumbsDown className="size-2.5" /> {con}
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            onClick={fetchAlternatives}
            disabled={loadingAlt}
<<<<<<< HEAD
            className="mb-2 flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="h-3 w-3" />
=======
            className="text-text-secondary hover:text-text-primary mb-2 flex items-center gap-1 text-xs font-bold"
          >
            <RefreshCw className="size-3" />
>>>>>>> recover/cabinet-wip-from-stash
            {loadingAlt ? 'Загрузка...' : 'Похожие товары'}
          </button>
          {alternatives.length > 0 && (
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {alternatives.map((a) => (
                <Link
                  key={a.id}
                  href={`/products/${a.slug}`}
<<<<<<< HEAD
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                >
                  <img src={a.image} alt="" className="h-8 w-8 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-bold">{a.title}</div>
                    <div className="text-[8px] text-slate-500">
=======
                  className="hover:bg-bg-surface2 flex items-center gap-2 rounded-lg px-2 py-1.5"
                >
                  <img src={a.image} alt="" className="size-8 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-bold">{a.title}</div>
                    <div className="text-text-secondary text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
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
