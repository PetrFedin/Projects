'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { User } from 'lucide-react';

type Props = { product: Product };

/** Параметры модели на витрине — из PIM (`attributes.*`). */
export function ProductFitModelBlock({ product }: Props) {
  const a = product.attributes ?? {};
  const height = a.fitModelHeightCm ?? a.modelHeightCm ?? a.model_height_cm;
  const size = a.fitModelSize ?? a.modelSize ?? a.model_size ?? a.sizeOnModel;
  const name = a.fitModelName ?? a.modelName;
  if (height == null && size == null && name == null) return null;

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          Модель на фото
        </CardTitle>
        <CardDescription className="text-xs">
          Снижает возвраты по ожиданию длины и объёма.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
        {name != null && String(name).trim() && (
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Модель</p>
            <p className="font-medium">{String(name)}</p>
          </div>
        )}
        {height != null && String(height).trim() && (
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Рост</p>
            <p className="font-medium">{String(height)} см</p>
          </div>
        )}
        {size != null && String(size).trim() && (
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Размер на модели</p>
            <p className="font-medium">{String(size)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
