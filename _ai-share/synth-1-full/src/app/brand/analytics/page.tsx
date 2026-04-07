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
import { mockPromotions } from '@/app/admin/promotions/page';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getAnalyticsLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function AnalyticsPage() {
    const synthaBrand = brands.find(b => b.slug?.includes('syntha') || b.id?.includes('syntha')) || brands[0];
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
                    if (brand) setBrandProducts(products.filter(p => p.brand === brand.name));
                } else {
                    const { default: fallbackProducts } = await import('@/lib/products');
                    setAllProducts(fallbackProducts as Product[]);
                    if (brand) setBrandProducts((fallbackProducts as Product[]).filter(p => p.brand === brand.name));
                }
            } catch (error) {
                try {
                    const { default: fallbackProducts } = await import('@/lib/products');
                    setAllProducts(fallbackProducts as Product[]);
                    if (brand) setBrandProducts((fallbackProducts as Product[]).filter(p => p.brand === brand.name));
                } catch (_) {
                    console.warn("Analytics: no product data available");
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
    }
    
    // Find a promotion related to one of the brand's products for the SKU analytics component
    const relevantPromotion = mockPromotions.find(p => brandProducts.some(bp => bp.id === p.productId));
    
    if (isLoading) {
        return (
            <div className="space-y-4 pb-20">
                <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-7 w-48 rounded-xl" />
                    <Skeleton className="h-7 w-32 rounded-xl" />
                </div>
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
            {/* Control Panel — без повтора заголовка раздела (шапка из layout) */}
            <div className="flex flex-col md:flex-row justify-end items-end gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <Button variant="ghost" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
                            <RefreshCw className="mr-1.5 h-3 w-3" /> Recalculate
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border border-slate-200 bg-white text-[9px] font-bold uppercase gap-1.5 hover:bg-slate-50 shadow-sm text-slate-500 tracking-widest transition-all">
                            <Search className="h-3 w-3" /> Deep Audit
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg border border-slate-200 bg-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-50 shadow-sm text-indigo-600 tracking-widest transition-all" asChild>
                            <a href={`data:text/csv;charset=utf-8,${encodeURIComponent('metric,value\nsell-through,78%\nmarket-share,12%\nretailer-orders,124')}`} download="analytics-export.csv">
                                <Download className="h-3 w-3 mr-1" /> Export CSV
                            </a>
                        </Button>
                    </div>
                    <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 px-3 text-[9px]" asChild>
                            <Link href="/brand/analytics-bi">BI Reports</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 text-[9px]" asChild>
                            <Link href="/brand/analytics-360">360° Analytics</Link>
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
                    <Card className="p-4 text-center text-muted-foreground border-dashed rounded-xl">
                        <p className="text-[10px] font-bold uppercase tracking-widest">No product data available for analysis.</p>
                    </Card>
                )}
                
                {/* --- MARKETROOM SYNC / RETAILER BASKET INSIGHTS --- */}
                <Card className="border-indigo-100 bg-indigo-50/10 overflow-hidden relative rounded-xl shadow-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShoppingBag className="h-24 w-24 text-indigo-600 rotate-12" />
                    </div>
                    <CardHeader className="p-4 relative z-10 border-b border-indigo-50/50">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[8px] font-bold uppercase px-1.5 h-4 tracking-widest shadow-sm">LIVE MARKET INTELLIGENCE</Badge>
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 leading-none">Marketroom Real-time Analytics</CardTitle>
                        <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">What's happening in retailer baskets now</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white p-4 border border-indigo-100 shadow-sm rounded-xl hover:border-indigo-200 transition-all group">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-[0.15em] leading-none group-hover:text-indigo-600 transition-colors">Draft Orders (In Baskets)</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-base font-bold text-slate-900 tabular-nums">124 Units</span>
                                        <span className="text-[8px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1 rounded h-3.5 flex items-center tracking-widest">+15% TODAY</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-indigo-600 w-3/4 shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-1000" />
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-medium italic opacity-70">"Graphite Parka — Most added item"</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-4 border border-indigo-100 shadow-sm rounded-xl hover:border-indigo-200 transition-all group">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-[0.15em] leading-none group-hover:text-indigo-600 transition-colors">Showroom Traffic</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-base font-bold text-slate-900 tabular-nums">2,400+ Views</span>
                                        <span className="text-[8px] font-bold text-indigo-600 uppercase bg-indigo-50 px-1 rounded h-3.5 flex items-center tracking-widest animate-pulse">LIVE NOW</span>
                                    </div>
                                    <div className="flex -space-x-1.5">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className="h-5 w-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[7px] font-bold uppercase text-slate-400 shadow-sm">
                                                R{i}
                                            </div>
                                        ))}
                                        <div className="h-5 px-1.5 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[7px] font-bold text-white shadow-sm">
                                            +18
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-medium opacity-70">Retailers analyzing your collection right now</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 border border-indigo-100 shadow-sm rounded-xl hover:border-indigo-200 transition-all group">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-[0.15em] leading-none group-hover:text-indigo-600 transition-colors">Sentiment Analysis</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-base font-bold text-slate-900 uppercase">Positive</span>
                                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-bold uppercase px-1.5 h-4 tracking-widest shadow-lg">STRONG BUY</Badge>
                                    </div>
                                    <p className="text-[10px] text-slate-600 leading-relaxed font-bold uppercase tracking-tight italic opacity-80">
                                        "Buyers note high material quality in FW'26 capsule."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <CollaborationInsights brand={brand} allProducts={allProducts} />
                
                <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:border-indigo-100 transition-all">
                    <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner"><Beaker className="h-3.5 w-3.5" /></div>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 leading-none">Image A/B Testing</CardTitle>
                        </div>
                        <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Optimize conversion rates with visual experiments.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {brandProducts.slice(0,3).map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all group">
                                    <div className="relative w-10 h-10 shrink-0 shadow-sm border border-slate-200 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover"/>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-[10px] text-slate-900 uppercase tracking-tight truncate mb-2">{p.name}</p>
                                        <Button variant="outline" size="sm" onClick={() => openTestDialog(p)} className="h-6 w-full rounded-md font-bold uppercase text-[8px] tracking-widest bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
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
        </div>
    );
}
