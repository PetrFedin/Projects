'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, MapPin, ShieldCheck, Star, Users, Briefcase, Zap, Search } from 'lucide-react';
import { getCisSuppliers } from '@/lib/fashion/cis-sourcing';
import { Button } from '@/components/ui/button';

export default function CisSourcingPage() {
  const suppliers = getCisSuppliers();
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Factory className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Local Sourcing Registry (CIS)</h1>
        </div>
        <p className="text-muted-foreground">
          Реестр проверенных фабрик и ателье в России и странах СНГ для оптимизации производства и логистики.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {suppliers.map((s) => (
          <Card key={s.id} className="p-6 border-2 border-slate-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 shadow-sm shrink-0">
                   <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{s.id}</div>
                   <h3 className="text-xl font-bold text-slate-800 tracking-tight">{s.name}</h3>
                   <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {s.location}
                   </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                 <div className="flex items-center gap-1 text-amber-500 text-sm font-black uppercase">
                    <Star className="w-4 h-4 fill-amber-500" /> {s.rating}
                 </div>
                 <Badge variant="outline" className="bg-emerald-50 border-emerald-100 text-emerald-700 font-black text-[9px] h-4 uppercase tracking-tighter shadow-sm">
                    {s.specialization}
                 </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-50">
               <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-center shadow-sm">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Min Order (MOQ)</div>
                  <div className="text-lg font-black text-slate-800">{s.moq} pcs</div>
               </div>
               <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 text-center shadow-sm">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Certifications</div>
                  <div className="flex justify-center gap-1 mt-1">
                     <ShieldCheck className="w-4 h-4 text-emerald-600" />
                     <Zap className="w-4 h-4 text-amber-500" />
                  </div>
               </div>
            </div>

            <div className="flex gap-2">
               <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] h-10 shadow-md">
                  Request RFQ Pack
               </Button>
               <Button variant="outline" className="font-black uppercase text-[11px] h-10 border-slate-200">
                  Profile
               </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-5 rotate-45">
             <Search className="w-12 h-12" />
           </div>
           <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <Users className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase">Supplier Matching</h3>
           </div>
           <p className="text-[11px] text-emerald-600 font-medium leading-snug mb-4">
              AI-based matching based on your design complexity and target pricing.
           </p>
           <Button size="sm" variant="outline" className="w-full h-8 text-[10px] font-black uppercase border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Start Matchmaking
           </Button>
        </Card>

        <Card className="p-6 border-2 border-slate-100 bg-slate-50/20 shadow-sm">
           <div className="flex items-center gap-3 mb-4 text-slate-600">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase">Audit Reports</h3>
           </div>
           <p className="text-[11px] text-slate-500 font-medium leading-snug mb-4">
              Latest social and quality audit reports for all registered CIS suppliers.
           </p>
           <Button size="sm" variant="outline" className="w-full h-8 text-[10px] font-black uppercase border-slate-200 text-slate-700">
              View Reports
           </Button>
        </Card>

        <Card className="p-6 border-2 border-amber-50 bg-amber-50/10 shadow-sm">
           <div className="flex items-center gap-3 mb-4 text-amber-600">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase">Quick Sourcing</h3>
           </div>
           <p className="text-[11px] text-amber-600 font-medium leading-snug mb-4">
              Need samples in 48h? Access our premium rapid-ateliers in Moscow and SPB.
           </p>
           <Button size="sm" variant="outline" className="w-full h-8 text-[10px] font-black uppercase border-amber-200 text-amber-700 hover:bg-amber-50">
              Request Samples
           </Button>
        </Card>
      </div>

      <div className="mt-8 p-5 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-5 items-center shadow-md">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-emerald-200 shadow-sm shrink-0">
          <Factory className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-black text-emerald-700 uppercase mb-1 tracking-tight">Sourcing Intelligence Unit</div>
          <div className="text-sm font-bold text-emerald-600 leading-snug tracking-tight">
             Платформа рекомендует фабрику <b>"Moscow Atelier Lab"</b> для вашей коллекции аксессуаров на основе текущей загрузки мощностей и географической близости к центральному складу.
          </div>
        </div>
      </div>
    </div>
  );
}
