'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/products';
import { calculateStyleArchetype, ARCHETYPE_LABELS } from '@/lib/fashion/style-archetype';
import type { UserStyleProfileV1 } from '@/lib/fashion/types';
import { Sparkles, BarChart, Palette, LayoutGrid } from 'lucide-react';

export function UserStyleArchetypeBlock() {
  const [profile, setProfile] = useState<UserStyleProfileV1 | null>(null);

  useEffect(() => {
    // В демо считаем на основе всего каталога (как будто это история просмотров)
    // В проде — на основе реальной аналитики из localStorage/DB
    setProfile(calculateStyleArchetype(products.slice(0, 20)));
  }, []);

  if (!profile) return null;

  return (
    <Card className="border-violet-500/20 bg-violet-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          Ваш Style Archetype
        </CardTitle>
        <CardDescription className="text-xs">
          Автоматический профиль на основе ваших предпочтений и поиска.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Основной стиль</p>
            <p className="text-base font-bold text-violet-700">{ARCHETYPE_LABELS[profile.archetype]}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</p>
            <p className="text-lg font-mono font-bold text-violet-600">{profile.confidence}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-violet-100">
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Palette className="h-3 w-3" /> Любимые цвета
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.colorPreferences.map(c => (
                <Badge key={c} variant="secondary" className="text-[9px] px-1.5 h-4 font-normal bg-violet-100 text-violet-700 border-none">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <LayoutGrid className="h-3 w-3" /> Топ категорий
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.topCategories.map(c => (
                <Badge key={c} variant="secondary" className="text-[9px] px-1.5 h-4 font-normal bg-violet-100 text-violet-700 border-none">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
