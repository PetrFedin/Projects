'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { loadBodyProfile, calculateFitMatch } from '@/lib/fashion/fit-match-logic';
import { getAllSizeMeasurements } from '@/lib/fashion/garment-measurements';
import { ROUTES } from '@/lib/routes';
import { UserCheck, AlertCircle, ChevronRight } from 'lucide-react';

type Props = { product: Product };

export function ProductFitMatchBlock({ product }: Props) {
  const [profile, setProfile] = useState<ReturnType<typeof loadBodyProfile>>(null);
  const garmentSizes = getAllSizeMeasurements(product);

  useEffect(() => {
    setProfile(loadBodyProfile());
  }, []);

  if (!profile) {
    return (
      <Card className="mt-4 border-dashed bg-muted/20">
        <CardContent className="pt-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold">Умный подбор размера</p>
            <p className="text-[10px] text-muted-foreground">Заполните свои мерки, чтобы мы сравнили их с промерами изделия.</p>
          </div>
          <Link 
            href={ROUTES.client.profile} // or a dedicated fit profile page
            className="text-[10px] text-primary flex items-center hover:underline whitespace-nowrap"
          >
            Настроить <ChevronRight className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  const matches = calculateFitMatch(profile, garmentSizes);
  if (matches.length === 0) return null;

  const best = matches[0];

  return (
    <Card className="mt-4 border-emerald-500/30 bg-emerald-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-600" />
          Наш прогноз посадки
        </CardTitle>
        <CardDescription className="text-xs">
          Сравнение ваших мерок с физическими промерами этой модели.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Рекомендуем:</span>
            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              Размер {best.size}
            </Badge>
          </div>
          <div className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
            {best.score}% Match
          </div>
        </div>
        
        {best.notes.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-emerald-500/20">
            {best.notes.map((note, i) => (
              <p key={i} className="text-[10px] flex items-center gap-1.5 text-emerald-800">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {note}
              </p>
            ))}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground italic leading-tight">
          * Прогноз на основе сантиметров изделия. Если любите свободнее — берите на размер больше.
        </p>
      </CardContent>
    </Card>
  );
}
