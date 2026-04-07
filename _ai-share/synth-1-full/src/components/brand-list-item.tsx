
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Users, Shirt, Handshake, Zap, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrandListItemProps {
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

export default function BrandListItem({ brand, productCount, onRequestPartnership, onAnalysisClick, displaySettings: initialDisplaySettings, viewRole }: BrandListItemProps) {
  const displaySettings = { ...defaultSettings, ...initialDisplaySettings };
  const displayName = displaySettings.nameRU && brand.nameRU ? brand.nameRU : brand.name;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white border border-slate-100 group rounded-3xl">
        <div className="flex items-center p-4">
            {displaySettings.logo && (
                <div className="relative w-20 h-20 rounded-2xl mr-8 overflow-hidden bg-slate-50 flex items-center justify-center p-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 border border-slate-100">
                    <Image
                        src={brand.logo.url}
                        alt={brand.logo.alt}
                        fill
                        className="object-contain p-2"
                        data-ai-hint={brand.logo.hint}
                        sizes="80px"
                    />
                </div>
            )}

            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                 <div className="md:col-span-5 space-y-1">
                    {displaySettings.name && (
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">{displayName}</h3>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <MapPin className="h-2 w-2" /> {brand.city || 'Moscow'}
                        </p>
                      </div>
                    )}
                    {displaySettings.description && <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">{brand.description}</p>}
                 </div>
                 
                 <div className="md:col-span-4 grid grid-cols-3 gap-3">
                   {displaySettings.followers && (
                      <div className='flex flex-col items-center'>
                          <span className="text-sm font-black text-slate-900">{brand.followers.toLocaleString('ru-RU')}</span>
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Followers</span>
                      </div>
                   )}
                    {displaySettings.products && (
                      <div className='flex flex-col items-center'>
                          <span className="text-sm font-black text-slate-900">{productCount || 0}</span>
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Products</span>
                      </div>
                    )}
                    <div className='flex flex-col items-center'>
                        <div className="flex items-center gap-0.5">
                          <span className="text-sm font-black text-slate-900">4.9</span>
                          <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                    </div>
                 </div>

                 {viewRole === 'b2b' && (
                   <div className="md:col-span-3 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100/50 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Potential</p>
                        <p className="text-sm font-black text-indigo-900">{brand.avgMargin || '48%'}</p>
                      </div>
                      <Badge className="bg-indigo-600 text-white border-none text-[7px] font-black px-1.5 py-0.5">Match {brand.matchScore || 92}%</Badge>
                   </div>
                 )}
            </div>

             <div className="ml-8 flex items-center gap-3">
                {displaySettings.store_button && (
                    <Button asChild className="h-11 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                        <Link href={`/b/${brand.slug}`}>
                            В ШОУРУМ
                        </Link>
                    </Button>
                )}
                
                {viewRole === 'b2b' ? (
                  <div className="flex gap-2">
                    {displaySettings.request_partnership_button && (
                      <Button 
                        variant="outline" 
                        className="h-11 px-6 border-slate-200 text-slate-900 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-50 transition-all"
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
                    <Button variant="outline" className="h-11 px-6 border-slate-200 text-slate-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                        Подписаться
                    </Button>
                  )
                )}
            </div>
        </div>
    </Card>
  );
}
