'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Plus,
  Users,
  Shirt,
  Handshake,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
} from 'lucide-react';
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

export default function BrandCard({
  brand,
  productCount,
  onRequestPartnership,
  onAnalysisClick,
  displaySettings: initialDisplaySettings,
  viewRole,
}: BrandCardProps) {
  const displaySettings = { ...defaultSettings, ...initialDisplaySettings };
  const displayName = displaySettings.nameRU && brand.nameRU ? brand.nameRU : brand.name;

  return (
    <Card className="border-border-subtle group flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-all duration-500 hover:shadow-2xl">
      <CardContent className="relative flex flex-grow flex-col items-center p-4 text-center">
        {viewRole === 'b2b' && (
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[7px] font-black uppercase text-white shadow-lg">
              Match: {brand.matchScore || 92}%
            </Badge>
            {brand.isVerified && (
              <Badge className="flex items-center gap-1 border-none bg-emerald-500 px-2 py-0.5 text-[7px] font-black uppercase text-white shadow-lg">
                <ShieldCheck className="h-2.5 w-2.5" /> Verified
              </Badge>
            )}
          </div>
        )}

        {displaySettings.logo && (
          <div className="bg-bg-surface2 border-border-subtle relative mb-6 flex h-[106px] w-[106px] items-center justify-center overflow-hidden rounded-3xl border p-0.5 transition-transform duration-500 group-hover:scale-110">
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
            <h3 className="text-text-primary text-base font-black uppercase leading-none tracking-tighter">
              {displayName}
            </h3>
            <p className="text-text-muted flex items-center justify-center gap-1 text-[8px] font-bold uppercase tracking-widest">
              <MapPin className="h-2 w-2" /> {brand.city || 'Moscow'}
            </p>
          </div>
        )}

        {displaySettings.description && (
          <p className="text-text-secondary mt-4 line-clamp-2 text-[11px] font-medium leading-relaxed">
            {brand.description}
          </p>
        )}

        <div className="border-border-subtle my-6 flex w-full items-center justify-center gap-3 border-y py-4">
          {displaySettings.followers && (
            <div className="flex flex-col items-center">
              <span className="text-text-primary text-xs font-black">
                {brand.followers.toLocaleString('ru-RU')}
              </span>
              <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                Followers
              </span>
            </div>
          )}
          <div className="bg-bg-surface2 h-6 w-px" />
          {displaySettings.products && (
            <div className="flex flex-col items-center">
              <span className="text-text-primary text-xs font-black">{productCount || 0}</span>
              <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                Products
              </span>
            </div>
          )}
          <div className="bg-bg-surface2 h-6 w-px" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-0.5">
              <span className="text-text-primary text-xs font-black">4.9</span>
              <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
            </div>
            <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
              Rating
            </span>
          </div>
        </div>

        {viewRole === 'b2b' && (
          <div className="bg-accent-primary/10 border-accent-primary/20 mb-6 w-full rounded-2xl border p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-accent-primary text-[8px] font-black uppercase tracking-widest">
                Profit Potential
              </p>
              <Zap className="text-accent-primary fill-accent-primary h-3 w-3" />
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-accent-primary text-sm font-black">{brand.avgMargin || '48%'}</p>
              <p className="text-accent-primary text-[8px] font-bold uppercase">Avg. Margin</p>
            </div>
          </div>
        )}

        <div className="mt-auto flex w-full flex-col gap-3">
          {displaySettings.store_button && (
            <Button
              asChild
              className="bg-text-primary h-11 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl transition-all hover:bg-black"
            >
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
                  className="border-border-default text-text-primary hover:bg-bg-surface2 h-11 flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  onClick={() => onRequestPartnership?.(brand.id, brand.name)}
                >
                  ПАРТНЕРСТВО
                </Button>
              )}
              <Button
                variant="outline"
                className="border-border-default text-text-muted hover:bg-bg-surface2 flex h-11 w-11 items-center justify-center rounded-xl p-0"
                onClick={() => onAnalysisClick?.(brand.id, brand.name)}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            displaySettings.action_button && (
              <Button
                variant="outline"
                className="border-border-default text-text-muted hover:bg-bg-surface2 h-11 w-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
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
