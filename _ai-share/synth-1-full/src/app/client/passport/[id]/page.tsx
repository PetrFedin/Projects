'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  MapPin, 
  Leaf, 
  Droplets, 
  ShieldCheck, 
  QrCode, 
  History, 
  Info,
  ChevronRight,
  Calculator,
  ExternalLink,
  Zap,
  CheckCircle2,
  Package,
  Calendar,
  Building2,
  ArrowRightLeft,
  Share2,
  Scissors,
  Layers,
  Sparkles,
  Heart,
  ShoppingCart,
  ArrowLeft
} from 'lucide-react';
import { getProductPassport, MATERIAL_SOURCES } from '@/lib/logic/passport-utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * Digital Product Passport (DPP) Public View
 * Публичная страница истории вещи для конечного клиента.
 */

export default function ProductPassportPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const passport = getProductPassport(params.id) || getProductPassport('PASS-9921')!;
  const sources = MATERIAL_SOURCES[passport.id] || [];
  
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Mobile-Friendly Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex flex-col items-center text-center space-y-3 relative">
          {/* Back Button */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-50">
              <Link href="/brand/products">
                <ArrowLeft className="h-4 w-4 text-slate-400" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
             <ShieldCheck className="w-3.5 h-3.5" />
             Digital Product Passport
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">{passport.name}</h1>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase text-[8px] px-2 h-5">
                Authentic & Verified
             </Badge>
             <span className="text-[10px] text-slate-300 font-black uppercase">SKU: {passport.sku}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl mt-8 space-y-4">
        {/* Visual Header / Gallery Mock */}
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
           <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center relative group">
              <Package className="w-20 h-20 text-slate-200" />
              <div className="absolute top-4 right-6">
                 <div className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-500" />
                 </div>
              </div>
           </div>
        </Card>

        {/* Origin & Production Section */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Origin & Supply Chain</h3>
           <Card className="border-none shadow-sm rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-indigo-600" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-tight">Made in {passport.originCountry}</p>
                    <p className="text-xs text-slate-500 font-medium">{passport.factoryName}, {passport.factoryLocation}</p>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-4">
                 <p className="text-[10px] font-black uppercase text-slate-400">Material Traceability</p>
                 {sources.map((source, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-100">
                             <Layers className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                             <p className="text-xs font-bold">{source.material}</p>
                             <p className="text-[9px] text-slate-400 font-medium uppercase">{source.origin} • {source.supplier}</p>
                          </div>
                       </div>
                       <Badge variant="ghost" className="text-[8px] font-black uppercase text-emerald-600">{source.sustainabilityScore}% ESG</Badge>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Environmental Impact */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Environmental Impact</h3>
           <div className="grid grid-cols-2 gap-3">
              <Card className="border-none shadow-sm rounded-xl p-4 bg-slate-900 text-white space-y-3">
                 <div className="flex items-center gap-2 text-indigo-400">
                    <Leaf className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Carbon Footprint</span>
                 </div>
                 <p className="text-sm font-black">{passport.carbonFootprint} kg</p>
                 <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">CO2 PER ITEM</p>
              </Card>
              <Card className="border-none shadow-sm rounded-xl p-4 bg-white border border-slate-100 space-y-3">
                 <div className="flex items-center gap-2 text-indigo-600">
                    <Droplets className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Water Usage</span>
                 </div>
                 <p className="text-sm font-black text-slate-900">
                    {isMounted ? passport.waterUsage.toLocaleString() : '—'} L
                 </p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">LITERS PER ITEM</p>
              </Card>
           </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Verified Certifications</h3>
           <div className="flex flex-wrap gap-2">
              {passport.certifications.map((cert, i) => (
                 <Badge key={i} className="bg-white text-indigo-600 border border-indigo-100 rounded-full h-10 px-6 font-black uppercase text-[9px] gap-2 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {cert}
                 </Badge>
              ))}
           </div>
        </div>

        {/* Composition & Care */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Care & Circularity</h3>
           <Card className="border-none shadow-sm rounded-xl p-4 space-y-4">
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-indigo-600" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Composition</p>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {passport.composition.map((mat, i) => (
                       <div key={i} className="space-y-1">
                          <p className="text-sm font-black">{mat.percentage}%</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{mat.material}</p>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50 space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4 text-amber-500" />
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Care Instructions</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {passport.careInstructions.map((instr, i) => (
                          <div key={i} className="flex items-center gap-2">
                             <CheckCircle2 className="w-3 h-3 text-indigo-300" />
                             <span className="text-xs font-medium text-slate-600">{instr}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 {passport.repairGuideUrl && (
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 text-[10px] font-black uppercase gap-2">
                       <History className="w-4 h-4" /> Repair & Care Guide
                       <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                    </Button>
                 )}
              </div>
           </Card>
        </div>

        {/* Resale CTA */}
        {passport.resaleEligible && (
           <Card className="border-none shadow-xl shadow-indigo-100 rounded-xl bg-indigo-600 text-white p-4 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">One-Click Resale</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">CIRCULAR ECONOMY</p>
                 </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                 Эта вещь верифицирована. Вы можете мгновенно выставить её на перепродажу через маркетплейс Synth-1, получив полную цену за аутентичность.
              </p>
              <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none rounded-xl font-black uppercase text-[10px] h-12">
                 List for Resale
              </Button>
           </Card>
        )}

        {/* Blockchain Proof */}
        {passport.blockchainHash && (
           <div className="flex flex-col items-center gap-3 py-4">
              <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                 <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="text-center space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Blockchain Verified</p>
                 <p className="text-[9px] text-slate-300 font-mono">{passport.blockchainHash}</p>
              </div>
           </div>
        )}

        {/* Actions Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 z-50">
           <div className="container mx-auto max-w-2xl flex gap-3">
              <Button className="flex-1 rounded-2xl h-10 bg-slate-900 text-white font-black uppercase text-[10px] gap-2">
                 <ShoppingCart className="w-4 h-4" /> Add to Closet
              </Button>
              <Button variant="outline" className="h-10 w-10 rounded-2xl border-slate-200">
                 <Share2 className="w-4 h-4" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
