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

export default function BrandListItem({
  brand,
  productCount,
  onRequestPartnership,
  onAnalysisClick,
  displaySettings: initialDisplaySettings,
  viewRole,
}: BrandListItemProps) {
  const displaySettings = { ...defaultSettings, ...initialDisplaySettings };
  const displayName = displaySettings.nameRU && brand.nameRU ? brand.nameRU : brand.name;

  return (
    <Card className="border-border-subtle bg-bg-surface group overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center p-4">
        {displaySettings.logo && (
          <div className="border-border-subtle bg-bg-surface2 relative mr-8 flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-3 transition-transform duration-500 group-hover:scale-105">
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

        <div className="grid flex-grow grid-cols-1 items-center gap-3 md:grid-cols-12">
          <div className="space-y-1 md:col-span-5">
            {displaySettings.name && (
              <div className="flex items-baseline gap-3">
                <h3 className="text-text-primary text-sm font-black uppercase leading-none tracking-tight">
                  {displayName}
                </h3>
                <p className="text-text-muted flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest">
                  <MapPin className="h-2 w-2" /> {brand.city || 'Moscow'}
                </p>
              </div>
            )}
            {displaySettings.description && (
              <p className="text-text-secondary mt-1 line-clamp-1 text-xs font-medium">
                {brand.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 md:col-span-4">
            {displaySettings.followers && (
              <div className="flex flex-col items-center">
                <span className="text-text-primary text-sm font-black">
                  {brand.followers.toLocaleString('ru-RU')}
                </span>
                <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                  Followers
                </span>
              </div>
            )}
            {displaySettings.products && (
              <div className="flex flex-col items-center">
                <span className="text-text-primary text-sm font-black">{productCount || 0}</span>
                <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                  Products
                </span>
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5">
                <span className="text-text-primary text-sm font-black">4.9</span>
                <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                Rating
              </span>
            </div>
          </div>

          {viewRole === 'b2b' && (
            <div className="border-accent-primary/20 bg-accent-primary/10 flex items-center justify-between rounded-xl border px-4 py-2 md:col-span-3">
              <div className="space-y-0.5">
                <p className="text-accent-primary text-[7px] font-black uppercase tracking-widest">
                  Potential
                </p>
                <p className="text-text-primary text-sm font-black">{brand.avgMargin || '48%'}</p>
              </div>
              <Badge className="bg-accent-primary text-text-inverse border-none px-1.5 py-0.5 text-[7px] font-black">
                Match {brand.matchScore || 92}%
              </Badge>
            </div>
          )}
        </div>

        <div className="ml-8 flex items-center gap-3">
          {displaySettings.store_button && (
            <Button
              asChild
              className="bg-text-primary text-text-inverse h-11 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black"
            >
              <Link href={`/b/${brand.slug}`}>В ШОУРУМ</Link>
            </Button>
          )}

          {viewRole === 'b2b' ? (
            <div className="flex gap-2">
              {displaySettings.request_partnership_button && (
                <Button
                  variant="outline"
                  className="border-border-subtle text-text-primary hover:bg-bg-surface2 h-11 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest transition-all"
                  onClick={() => onRequestPartnership?.(brand.id, brand.name)}
                >
                  ПАРТНЕРСТВО
                </Button>
              )}
              <Button
                variant="outline"
                className="border-border-subtle text-text-muted hover:bg-bg-surface2 flex h-11 w-11 items-center justify-center rounded-xl p-0 transition-all"
                onClick={() => onAnalysisClick?.(brand.id, brand.name)}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            displaySettings.action_button && (
              <Button
                variant="outline"
                className="border-border-subtle text-text-muted hover:bg-bg-surface2 h-11 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Подписаться
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}
