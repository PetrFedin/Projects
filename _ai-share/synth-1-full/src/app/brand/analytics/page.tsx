'use client';

import { useState, useEffect } from 'react';
import type { Brand, Product, Promotion } from '@/lib/types';
import { brands } from '@/lib/placeholder-data';
import CollaborationInsights from '@/components/brand/collaboration-insights';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ABTestDialog } from '@/components/brand/ab-test-dialog';
import { Beaker, Download, RefreshCw, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkuAnalytics } from '@/components/brand/sku-analytics';
import { mockPromotions } from '@/lib/data/mock-promotions';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getAnalyticsLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

export default function AnalyticsPage() {
  const synthaBrand =
    brands.find((b) => b.slug?.includes('syntha') || b.id?.includes('syntha')) || brands[0];
  const [brand] = useState<Brand>(synthaBrand!);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [selectedProductForTest, setSelectedProductForTest] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const products: Product[] = await response.json();
          setAllProducts(products);
          if (brand) setBrandProducts(products.filter((p) => p.brand === brand.name));
        } else {
          const { default: fallbackProducts } = await import('@/lib/products');
          setAllProducts(fallbackProducts as Product[]);
          if (brand)
            setBrandProducts((fallbackProducts as Product[]).filter((p) => p.brand === brand.name));
        }
      } catch (error) {
        try {
          const { default: fallbackProducts } = await import('@/lib/products');
          setAllProducts(fallbackProducts as Product[]);
          if (brand)
            setBrandProducts((fallbackProducts as Product[]).filter((p) => p.brand === brand.name));
        } catch (_) {
          console.warn('Analytics: no product data available');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [brand]);

  if (!brand) return <div className="p-4 text-center">Бренд не найден.</div>;

  const openTestDialog = (product: Product) => {
    setSelectedProductForTest(product);
  };

  // Find a promotion related to one of the brand's products for the SKU analytics component
  const relevantPromotion = mockPromotions.find((p) =>
    brandProducts.some((bp) => bp.id === p.productId)
  );

  if (isLoading) {
    return (
<<<<<<< HEAD
      <div className="space-y-4 pb-20">
=======
      <div className="space-y-4 pb-8">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-7 w-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* Control Panel — без повтора заголовка раздела (шапка из layout) */}
      <div className="flex flex-col items-end justify-end gap-3 border-b border-slate-100 pb-3 md:flex-row">
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <Button
              variant="ghost"
              className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
=======
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16 duration-700 animate-in fade-in">
      {/* Control Panel — без повтора заголовка раздела (шапка из layout) */}
      <div className="border-border-subtle flex flex-col items-end justify-end gap-3 border-b pb-3 md:flex-row">
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
            <Button
              variant="ghost"
              className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <RefreshCw className="mr-1.5 h-3 w-3" /> Recalculate
            </Button>
            <Button
              variant="outline"
              size="sm"
<<<<<<< HEAD
              className="h-7 gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:bg-slate-50"
=======
              className="border-border-default hover:bg-bg-surface2 text-text-secondary h-7 gap-1.5 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Search className="h-3 w-3" /> Deep Audit
            </Button>
            <Button
              variant="outline"
              size="sm"
<<<<<<< HEAD
              className="h-7 gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm transition-all hover:bg-indigo-50"
=======
              className="border-border-default hover:bg-accent-primary/10 text-accent-primary h-7 gap-1.5 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              asChild
            >
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent('metric,value\nsell-through,78%\nmarket-share,12%\nretailer-orders,124')}`}
                download="analytics-export.csv"
              >
                <Download className="mr-1 h-3 w-3" /> Export CSV
              </a>
            </Button>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7 px-3 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/analytics-bi">BI Reports</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-[9px]" asChild>
              <Link href="/brand/analytics-360">360° Analytics</Link>
=======
              <Link href={ROUTES.brand.analyticsBi}>BI Reports</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-[9px]" asChild>
              <Link href={ROUTES.brand.analytics360}>360° Analytics</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {brandProducts.length > 0 ? (
          <SkuAnalytics
            brandProducts={brandProducts}
            initialSku={relevantPromotion?.productId || brandProducts[0].id}
            promotion={relevantPromotion}
          />
        ) : (
          <Card className="rounded-xl border-dashed p-4 text-center text-muted-foreground">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              No product data available for analysis.
            </p>
          </Card>
        )}

        {/* --- MARKETROOM SYNC / RETAILER BASKET INSIGHTS --- */}
<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-indigo-100 bg-indigo-50/10 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <ShoppingBag className="h-24 w-24 rotate-12 text-indigo-600" />
          </div>
          <CardHeader className="relative z-10 border-b border-indigo-50/50 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <Badge
                variant="outline"
                className="h-4 border-indigo-100 bg-indigo-50 px-1.5 text-[8px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm"
=======
        <Card className="border-accent-primary/20 bg-accent-primary/10 relative overflow-hidden rounded-xl shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <ShoppingBag className="text-accent-primary h-24 w-24 rotate-12" />
          </div>
          <CardHeader className="border-accent-primary/15 relative z-10 border-b p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Sparkles className="text-accent-primary h-3.5 w-3.5" />
              <Badge
                variant="outline"
                className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 px-1.5 text-[8px] font-bold uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
              >
                LIVE MARKET INTELLIGENCE
              </Badge>
            </div>
<<<<<<< HEAD
            <CardTitle className="text-sm font-bold uppercase leading-none tracking-widest text-slate-900">
              Marketroom Real-time Analytics
            </CardTitle>
            <CardDescription className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
            <CardTitle className="text-text-primary text-sm font-bold uppercase leading-none tracking-widest">
              Marketroom Real-time Analytics
            </CardTitle>
            <CardDescription className="text-text-muted mt-1 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              What's happening in retailer baskets now
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
              <div className="group rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200">
                <p className="mb-3 text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 transition-colors group-hover:text-indigo-600">
=======
              <div className="border-accent-primary/20 hover:border-accent-primary/30 group rounded-xl border bg-white p-4 shadow-sm transition-all">
                <p className="text-text-muted group-hover:text-accent-primary mb-3 text-[9px] font-bold uppercase leading-none tracking-[0.15em] transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                  Draft Orders (In Baskets)
                </p>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
<<<<<<< HEAD
                    <span className="text-base font-bold tabular-nums text-slate-900">
=======
                    <span className="text-text-primary text-base font-bold tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                      124 Units
                    </span>
                    <span className="flex h-3.5 items-center rounded bg-emerald-50 px-1 text-[8px] font-bold uppercase tracking-widest text-emerald-600">
                      +15% TODAY
                    </span>
                  </div>
<<<<<<< HEAD
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-50 shadow-inner">
                    <div className="h-full w-3/4 bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-1000" />
                  </div>
                  <p className="text-[9px] font-medium italic text-slate-500 opacity-70">
=======
                  <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full shadow-inner">
                    <div className="bg-accent-primary h-full w-3/4 shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-1000" />
                  </div>
                  <p className="text-text-secondary text-[9px] font-medium italic opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                    "Graphite Parka — Most added item"
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <div className="group rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200">
                <p className="mb-3 text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 transition-colors group-hover:text-indigo-600">
=======
              <div className="border-accent-primary/20 hover:border-accent-primary/30 group rounded-xl border bg-white p-4 shadow-sm transition-all">
                <p className="text-text-muted group-hover:text-accent-primary mb-3 text-[9px] font-bold uppercase leading-none tracking-[0.15em] transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                  Showroom Traffic
                </p>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
<<<<<<< HEAD
                    <span className="text-base font-bold tabular-nums text-slate-900">
                      2,400+ Views
                    </span>
                    <span className="flex h-3.5 animate-pulse items-center rounded bg-indigo-50 px-1 text-[8px] font-bold uppercase tracking-widest text-indigo-600">
=======
                    <span className="text-text-primary text-base font-bold tabular-nums">
                      2,400+ Views
                    </span>
                    <span className="text-accent-primary bg-accent-primary/10 flex h-3.5 animate-pulse items-center rounded px-1 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      LIVE NOW
                    </span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
<<<<<<< HEAD
                        className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[7px] font-bold uppercase text-slate-400 shadow-sm"
=======
                        className="bg-bg-surface2 text-text-muted flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[7px] font-bold uppercase shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        R{i}
                      </div>
                    ))}
<<<<<<< HEAD
                    <div className="flex h-5 items-center justify-center rounded-full border-2 border-white bg-indigo-600 px-1.5 text-[7px] font-bold text-white shadow-sm">
                      +18
                    </div>
                  </div>
                  <p className="text-[9px] font-medium text-slate-500 opacity-70">
=======
                    <div className="bg-accent-primary flex h-5 items-center justify-center rounded-full border-2 border-white px-1.5 text-[7px] font-bold text-white shadow-sm">
                      +18
                    </div>
                  </div>
                  <p className="text-text-secondary text-[9px] font-medium opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                    Retailers analyzing your collection right now
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <div className="group rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200">
                <p className="mb-3 text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 transition-colors group-hover:text-indigo-600">
=======
              <div className="border-accent-primary/20 hover:border-accent-primary/30 group rounded-xl border bg-white p-4 shadow-sm transition-all">
                <p className="text-text-muted group-hover:text-accent-primary mb-3 text-[9px] font-bold uppercase leading-none tracking-[0.15em] transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                  Sentiment Analysis
                </p>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
<<<<<<< HEAD
                    <span className="text-base font-bold uppercase text-slate-900">Positive</span>
=======
                    <span className="text-text-primary text-base font-bold uppercase">
                      Positive
                    </span>
>>>>>>> recover/cabinet-wip-from-stash
                    <Badge className="h-4 border-none bg-emerald-500 px-1.5 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg">
                      STRONG BUY
                    </Badge>
                  </div>
<<<<<<< HEAD
                  <p className="text-[10px] font-bold uppercase italic leading-relaxed tracking-tight text-slate-600 opacity-80">
=======
                  <p className="text-text-secondary text-[10px] font-bold uppercase italic leading-relaxed tracking-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                    "Buyers note high material quality in FW'26 capsule."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CollaborationInsights brand={brand} allProducts={allProducts} />

<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-4">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner">
                <Beaker className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-sm font-bold uppercase leading-none tracking-widest text-slate-900">
                Image A/B Testing
              </CardTitle>
            </div>
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
        <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
          <CardHeader className="border-border-subtle bg-bg-surface2/80 border-b p-4">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-lg border p-1.5 shadow-inner">
                <Beaker className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-text-primary text-sm font-bold uppercase leading-none tracking-widest">
                Image A/B Testing
              </CardTitle>
            </div>
            <CardDescription className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Optimize conversion rates with visual experiments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {brandProducts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
<<<<<<< HEAD
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-indigo-100 hover:bg-slate-50"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="mb-2 truncate text-[10px] font-bold uppercase tracking-tight text-slate-900">
=======
                  className="border-border-subtle hover:border-accent-primary/20 hover:bg-bg-surface2 group flex items-center gap-3 rounded-xl border p-3 transition-all"
                >
                  <div className="border-border-default relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border shadow-sm transition-transform group-hover:scale-105">
                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-text-primary mb-2 truncate text-[10px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {p.name}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openTestDialog(p)}
<<<<<<< HEAD
                      className="h-6 w-full rounded-md bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
=======
                      className="hover:bg-text-primary/90 hover:border-text-primary h-6 w-full rounded-md bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Start Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedProductForTest && (
          <ABTestDialog
            product={selectedProductForTest}
            isOpen={!!selectedProductForTest}
            onOpenChange={(isOpen) => {
              if (!isOpen) setSelectedProductForTest(null);
            }}
          />
        )}

        <RelatedModulesBlock links={getAnalyticsLinks()} className="mt-6" />
      </div>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
