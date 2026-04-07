'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import DynamicPricingEngine from '@/components/brand/pricing/DynamicPricingEngine';
import { CommercialTermsMatrix } from '@/components/brand/commercial-terms-matrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Handshake, BarChart3, TrendingDown, Percent } from 'lucide-react';

const PriceComparisonContent = dynamic(() => import('@/app/brand/pricing/price-comparison/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const ElasticityContent = dynamic(() => import('@/app/brand/pricing/elasticity/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const MarkdownContent = dynamic(() => import('@/app/brand/pricing/markdown/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

export default function BrandPricingPage() {
    const [tab, setTab] = useState('pricing');
    return (
        <div className="container mx-auto px-4 py-4 space-y-4">
            <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                <TabsList className="bg-slate-100/80 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap">
                    <TabsTrigger value="pricing" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
                        <DollarSign className="h-3 w-3 shrink-0" /> Ценообразование
                    </TabsTrigger>
                    <TabsTrigger value="price-comparison" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
                        <BarChart3 className="h-3 w-3 shrink-0" /> Сравнение цен
                    </TabsTrigger>
                    <TabsTrigger value="elasticity" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
                        <TrendingDown className="h-3 w-3 shrink-0" /> Эластичность
                    </TabsTrigger>
                    <TabsTrigger value="markdown" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
                        <Percent className="h-3 w-3 shrink-0" /> Оптимизация скидок
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="mt-0">
                    <Tabs defaultValue="dynamic" className="space-y-4">
                        <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200 h-10">
                            <TabsTrigger value="dynamic" className="rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <DollarSign className="mr-2 h-4 w-4" /> B2C Dynamic Pricing
                            </TabsTrigger>
                            <TabsTrigger value="wholesale" className="rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Handshake className="mr-2 h-4 w-4" /> B2B Commercial Terms
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="dynamic" className="mt-0">
                            <DynamicPricingEngine />
                        </TabsContent>

                        <TabsContent value="wholesale" className="mt-0">
                            <CommercialTermsMatrix />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="price-comparison" className="mt-0">
                    {tab === 'price-comparison' && <PriceComparisonContent />}
                </TabsContent>

                <TabsContent value="elasticity" className="mt-0">
                    {tab === 'elasticity' && <ElasticityContent />}
                </TabsContent>

                <TabsContent value="markdown" className="mt-0">
                    {tab === 'markdown' && <MarkdownContent />}
                </TabsContent>
            </Tabs>
        </div>
    );
}
