
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Users, Shirt, Handshake, MapPin, Star, Zap, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrandCardProps {
  brand: Brand;
  productCount?: number;
  onRequestPartnership?: (id: string, name: string) => void;
  onAnalysisClick?: (id: string, name: string) => void;
  displaySettings?: Record<string, boolean>;
  viewRole?: string;
}

const defaultSettings = {
    logo: true,
    name: true,
    description: true,
    followers: true,
    products: true,
    store_button: true,
    action_button: true,
    request_partnership_button: true,
    nameRU: true,
};


export default function BrandCard({ brand, productCount, onRequestPartnership, onAnalysisClick, displaySettings: initialDisplaySettings, viewRole }: BrandCardProps) {
  const displaySettings = { ...defaultSettings, ...initialDisplaySettings };
  const displayName = displaySettings.nameRU && brand.nameRU ? brand.nameRU : brand.name;

  return (
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl bg-white border border-slate-100 group flex flex-col h-full rounded-xl">
      <CardContent className="p-4 flex flex-col items-center text-center flex-grow relative">
        {viewRole === 'b2b' && (
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-indigo-600 text-white border-none text-[7px] font-black uppercase px-2 py-0.5 shadow-lg">
              Match: {brand.matchScore || 92}%
            </Badge>
            {brand.isVerified && (
              <Badge className="bg-emerald-500 text-white border-none text-[7px] font-black uppercase px-2 py-0.5 shadow-lg flex items-center gap-1">
                <ShieldCheck className="h-2.5 w-2.5" /> Verified
              </Badge>
            )}
          </div>
        )}

        {displaySettings.logo && (
            <div className="relative w-[106px] h-[106px] rounded-3xl mb-6 overflow-hidden bg-slate-50 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform duration-500 border border-slate-100">
                <Image
                    src={brand.logo.url}
                    alt={brand.logo.alt}
                    fill
                    className="object-contain"
                    data-ai-hint={brand.logo.hint}
                    sizes="106px"
                />
            </div>
        )}
        
        {displaySettings.name && (
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase tracking-tighter leading-none text-slate-900">{displayName}</h3>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <MapPin className="h-2 w-2" /> {brand.city || 'Moscow'}
            </p>
          </div>
        )}

        {displaySettings.description && (
          <p className="text-[11px] text-slate-500 font-medium mt-4 line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        )}
        
        <div className="flex items-center gap-3 py-4 border-y border-slate-50 w-full justify-center my-6">
            {displaySettings.followers && (
                <div className='flex flex-col items-center'>
                    <span className="text-xs font-black text-slate-900">{brand.followers.toLocaleString('ru-RU')}</span>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Followers</span>
                </div>
            )}
            <div className="w-px h-6 bg-slate-100" />
             {displaySettings.products && (
                <div className='flex flex-col items-center'>
                    <span className="text-xs font-black text-slate-900">{productCount || 0}</span>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Products</span>
                </div>
             )}
             <div className="w-px h-6 bg-slate-100" />
             <div className='flex flex-col items-center'>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs font-black text-slate-900">4.9</span>
                  <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                </div>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
            </div>
        </div>

        {viewRole === 'b2b' && (
          <div className="w-full mb-6 p-3 bg-indigo-50 rounded-2xl border border-indigo-100/50">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Profit Potential</p>
              <Zap className="h-3 w-3 text-indigo-600 fill-indigo-600" />
            </div>
            <div className="flex justify-between items-baseline">
              <p className="text-sm font-black text-indigo-900">{brand.avgMargin || '48%'}</p>
              <p className="text-[8px] font-bold text-indigo-400 uppercase">Avg. Margin</p>
            </div>
          </div>
        )}

        <div className="mt-auto w-full flex flex-col gap-3">
            {displaySettings.store_button && (
                 <Button asChild className="w-full h-11 bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-slate-200">
                    <Link href={`/b/${brand.slug}`}>
                        В ШОУРУМ <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                </Button>
            )}
            
            {viewRole === 'b2b' ? (
              <div className="flex gap-2">
                {displaySettings.request_partnership_button && (
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-slate-200 text-slate-900 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-50 transition-all"
                    onClick={() => onRequestPartnership?.(brand.id, brand.name)}
                  >
                    ПАРТНЕРСТВО
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="h-11 w-11 border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 flex items-center justify-center p-0"
                  onClick={() => onAnalysisClick?.(brand.id, brand.name)}
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              displaySettings.action_button && (
                <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    Подписаться
                </Button>
              )
            )}
        </div>
      </CardContent>
    </Card>
  );
}
