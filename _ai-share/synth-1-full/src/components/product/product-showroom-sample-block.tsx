'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Box,
  Scan,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { getShowroomSampleInventory } from '@/lib/fashion/showroom-sample-inventory';
import type { Product } from '@/lib/types';

export function ProductShowroomSampleBlock({ product }: { product: Product }) {
  const sample = getShowroomSampleInventory(product.sku);

  return (
    <Card className="group relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Scan className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Live Showroom Sample Tracker
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
          NFC / QR Sync
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
          <Box className="h-16 w-16 text-slate-900" />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white shadow-md ${
              sample.status === 'available'
                ? 'bg-emerald-100'
                : sample.status === 'with_buyer'
                  ? 'bg-indigo-100'
                  : 'bg-amber-100'
            }`}
          >
            {sample.status === 'available' ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            ) : sample.status === 'with_buyer' ? (
              <User className="h-6 w-6 text-indigo-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="mb-1 text-[11px] font-black uppercase leading-none text-slate-800">
              {sample.id}
            </div>
            <Badge
              className={`h-4 border-none text-[8px] font-black uppercase ${
                sample.status === 'available'
                  ? 'bg-emerald-500 text-white'
                  : sample.status === 'with_buyer'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-amber-600 text-white'
              }`}
            >
              {sample.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <div className="text-[10px] font-bold uppercase text-slate-600">Current Zone</div>
            </div>
            <div className="text-[10px] font-black text-slate-800">{sample.currentZone}</div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <div className="text-[10px] font-bold uppercase text-slate-600">Last Scanned</div>
            </div>
            <div className="text-[10px] font-black text-slate-800">{sample.lastScannedBy}</div>
          </div>
        </div>
      </div>

      <div className="group/btn relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-slate-900 p-3 text-white shadow-lg shadow-slate-200">
        <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover/btn:scale-125">
          <Scan className="h-12 w-12 text-white" />
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-widest">
          Scan Sample QR
        </div>
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </div>
    </Card>
  );
}
