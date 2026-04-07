'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    ShieldCheck, Leaf, Globe, Factory, 
    History, QrCode, Share2, Info,
    CheckCircle2, AlertCircle, Box,
    FileText, Zap, Sparkles, MapPin,
    Truck, Recycle, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { buildLocalDppPayload } from '@/lib/platform/dpp-payload';
import type { DppCertificate } from '@/lib/platform/types';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface DPPProps {
    product: Product;
}

const CERT_TONE: Record<DppCertificate['tone'], string> = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    indigo: 'bg-indigo-50 text-indigo-700',
};

export default function DigitalProductPassport({ product }: DPPProps) {
    const dpp = buildLocalDppPayload(product);
    const { sustainabilityScore, supplyChain, materials, certificates } = dpp;
    const materialRows = materials.map((m) => ({
        ...m,
        icon: m.name.includes('Elastane') || m.name.includes('полимер') ? Recycle : Leaf,
        desc: m.description,
    }));

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl">
                        <QrCode className="h-8 w-8" />
                    </div>
                    <div>
                        <Badge className="bg-emerald-500 text-white border-none mb-1 px-2 py-0.5 font-black uppercase tracking-widest text-[8px]">
                            Verified Authentic
                        </Badge>
                        <h1 className="text-base font-black uppercase tracking-tight text-slate-900 leading-tight">
                            Digital Product <span className="text-indigo-600 italic">Passport</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">ID: {dpp.passportId}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 font-bold uppercase tracking-widest text-[9px]">
                        <Share2 className="mr-2 h-3.5 w-3.5" /> Share DPP
                    </Button>
                    <Button className="rounded-xl bg-slate-900 text-white h-10 px-6 font-black uppercase tracking-widest text-[9px] shadow-lg">
                        <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Verify Blockchain
                    </Button>
                </div>
            </header>

            <Card className="rounded-xl border-none shadow-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <Box className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Партия и прослеживаемость</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="rounded-lg bg-white p-3 border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Партия пошива</p>
                                <p className="font-mono font-bold text-slate-900">{dpp.batchLabel}</p>
                            </div>
                            <div className="rounded-lg bg-white p-3 border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Партия окраса</p>
                                <p className="font-mono font-bold text-slate-900">{dpp.dyeBatchLabel}</p>
                            </div>
                            <div className="rounded-lg bg-white p-3 border border-slate-100 sm:col-span-2">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Сертификат ткани</p>
                                <p className="font-semibold text-slate-800">{dpp.fabricCertLine}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-[280px] shrink-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Карта цепочки (обезличенно)</p>
                        <div className="relative h-36 rounded-xl bg-gradient-to-br from-slate-200 via-emerald-100/40 to-indigo-100 border border-slate-200 overflow-hidden">
                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #6366f1 2px, transparent 3px), radial-gradient(circle at 70% 50%, #10b981 2px, transparent 3px), radial-gradient(circle at 45% 75%, #f43f5e 2px, transparent 3px)', backgroundSize: '80px 80px' }} />
                            <div className="absolute top-4 left-6 h-3 w-3 rounded-full bg-indigo-600 ring-2 ring-white shadow" title="Сырьё" />
                            <div className="absolute top-1/2 right-8 h-3 w-3 rounded-full bg-emerald-600 ring-2 ring-white shadow" title="Пошив" />
                            <div className="absolute bottom-5 left-1/3 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white shadow" title="Склад" />
                        </div>
                        <p className="text-[9px] text-slate-500 mt-2 leading-snug">В проде — GeoJSON / карта поставщиков с согласованными данными.</p>
                    </div>
                </div>
            </Card>

            <div className="grid lg:grid-cols-12 gap-3 items-start">
                {/* Left: Product Info & Materials */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden group">
                        <div className="aspect-[3/4] relative overflow-hidden">
                            <Image 
                                src={product.images?.[0]?.url || (product as any).image} 
                                alt={product.name} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100 duration-500">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">{product.brand}</p>
                                <h4 className="text-base font-black uppercase tracking-tight leading-none">{product.name}</h4>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Sustainability Score</h3>
                            <Badge className="bg-indigo-500 text-white border-none font-black">{sustainabilityScore}/100</Badge>
                        </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                              style={{ width: `${Math.min(100, sustainabilityScore)}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                            {dpp.sustainabilityBlurb}
                        </p>
                    </Card>

                    <Card className="rounded-xl border-none shadow-xl bg-white p-4">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6">Material Composition</h3>
                        <div className="space-y-6">
                            {materialRows.map(mat => (
                                <div key={mat.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <mat.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{mat.name}</p>
                                                <p className="text-[9px] font-medium text-slate-400 uppercase">{mat.desc}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black">{mat.percentage}%</span>
                                    </div>
                                    <Progress value={mat.percentage} className="h-1 bg-slate-50 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Middle & Right: Supply Chain & Certificates */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="rounded-xl border-none shadow-xl bg-white p-3 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-5">
                            <Globe className="h-64 w-64 rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-3">
                                <Factory className="h-6 w-6 text-indigo-600" />
                                <h3 className="text-base font-black uppercase tracking-tight leading-none">Transparency Supply Chain</h3>
                            </div>

                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />
                                
                                <div className="space-y-6">
                                    {supplyChain.map((step, idx) => (
                                        <div key={idx} className="flex gap-3 relative">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10",
                                                step.status === 'completed' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-2 w-2 bg-slate-300 rounded-full" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest px-2">{step.stage}</Badge>
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase flex items-center gap-1"><MapPin className="h-3 w-3" /> {step.location}</span>
                                                </div>
                                                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{step.detail}</h4>
                                                <p className="text-[10px] text-slate-400 font-medium max-w-lg leading-relaxed italic">
                                                    Верифицировано независимым аудитором. Соответствует стандартам Fair Trade и ISO 14001.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-3">
                        <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Official Certificates</h3>
                            </div>
                            <div className="space-y-3">
                                {certificates.map((cert) => (
                                    <div key={cert.name} className="p-4 rounded-xl border border-slate-50 flex items-center justify-between group hover:border-indigo-100 transition-all cursor-pointer">
                                        <div>
                                            <p className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block mb-1", CERT_TONE[cert.tone])}>{cert.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 leading-none">{cert.description}</p>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="rounded-xl border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-950 p-4 text-white relative overflow-hidden group">
                            <Recycle className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Recycle className="h-5 w-5 text-indigo-200" />
                                    <h3 className="text-sm font-black uppercase tracking-widest">End of Life Cycle</h3>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xs font-medium leading-relaxed italic text-indigo-100">
                                        Syntha заботится о будущем. Когда вещь вам надоест, вы можете:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-bold uppercase leading-tight">Сдать на переработку (+300 SC)</p>
                                        </li>
                                    </ul>
                                </div>
                                <Button className="w-full bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] h-10 hover:bg-slate-100">
                                    Circularity Program Details
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
