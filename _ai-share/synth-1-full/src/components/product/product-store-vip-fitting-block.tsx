'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Star, Clock, Calendar, MoveRight, ShoppingBag, Sparkles } from 'lucide-react';
import { getStoreVipFittings } from '@/lib/fashion/store-vip-fittings';
import type { Product } from '@/lib/types';

export function ProductStoreVipFittingBlock({ product }: { product: Product }) {
  const appointments = getStoreVipFittings('STORE-MSK-MAIN');

  return (
    <Card className="p-4 border-2 border-indigo-100 bg-indigo-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <Star className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Star className="w-4 h-4 fill-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">VIP In-Store Appointments</h4>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700 border-none uppercase text-[8px] font-black">Today's Schedule</Badge>
      </div>

      <div className="space-y-3 mb-4">
         {appointments.map((app) => (
           <div key={app.appointmentId} className="p-3 bg-white rounded-xl border border-indigo-50 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                    {app.clientId[0]}
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-800">{app.clientId}</div>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase">
                       <Clock className="w-2.5 h-2.5" /> {app.timeSlot.split(' ')[1]}
                    </div>
                 </div>
              </div>
              
              <div className="text-right">
                 <Badge className={app.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'} variant="outline" className="border-none text-[7px] h-4 font-black uppercase px-1">
                   {app.status}
                 </Badge>
                 <div className="text-[8px] font-black text-indigo-600 mt-1 uppercase tracking-tighter">Stylist: {app.stylistId.split('-')[1]}</div>
              </div>
           </div>
         ))}
      </div>

      <div className="p-3 bg-white rounded-xl border border-indigo-100 mb-2 flex items-center justify-between group cursor-pointer hover:bg-indigo-50 transition-colors">
         <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
            <div className="text-[10px] font-bold text-slate-700">Pre-selected for items: 2 SKU</div>
         </div>
         <MoveRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase justify-center tracking-widest italic">
         <Sparkles className="w-3 h-3 text-indigo-400" /> Stylist hub sync active
      </div>
    </Card>
  );
}
