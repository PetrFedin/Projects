'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getAssetCredits, isAssetUsageValid } from '@/lib/fashion/asset-rights';
import { Camera, Instagram, MapPin, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';

type Props = { product: Product };

export function ProductAssetCreditsBlock({ product }: Props) {
  const credits = getAssetCredits(product);
  const isValid = isAssetUsageValid(credits);

  if (!credits.photographer && !credits.modelName && !credits.location) return null;

  return (
    <Card className="mt-4 border-dashed bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4" />
          Production & Rights
        </CardTitle>
        <CardDescription className="text-xs">
          Кредиты команды и права на использование медиа (DAM).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {credits.photographer && (
            <div className="flex items-center gap-2">
              <Camera className="h-3 w-3 text-muted-foreground" />
              <span>{credits.photographer}</span>
            </div>
          )}
          {credits.modelName && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{credits.modelName}</span>
              {credits.modelInstagram && (
                <a
                  href={`https://instagram.com/${credits.modelInstagram.replace('@', '')}`}
                  target="_blank"
                  className="flex items-center gap-0.5 text-primary hover:underline"
                >
                  <Instagram className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
          {credits.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{credits.location}</span>
            </div>
          )}
          {credits.usageUntil && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>до {new Date(credits.usageUntil).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t pt-2">
          <div className="flex items-center gap-1.5">
            {isValid ? (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            )}
            <span
              className={`text-[10px] font-medium ${isValid ? 'text-emerald-700' : 'text-rose-700'}`}
            >
              {isValid ? 'Лицензия активна' : 'Срок прав истек (DAM alert)'}
            </span>
          </div>
          <Badge variant="outline" className="h-4 text-[9px]">
            Asset ID: {product.sku.slice(0, 6)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
