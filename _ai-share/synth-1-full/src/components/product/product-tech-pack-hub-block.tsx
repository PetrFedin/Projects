'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/lib/types';
import { buildTechPack, techPackToJson } from '@/lib/fashion/tech-pack-logic';
import { FileJson, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Props = { product: Product };

export function ProductTechPackHubBlock({ product }: Props) {
  const { toast } = useToast();
  const techPack = buildTechPack(product);

  const downloadJson = () => {
    const json = techPackToJson(techPack);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-pack-${product.sku}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Tech Pack экспортирован',
      description: 'JSON файл готов для загрузки в PLM / ERP.',
    });
  };

  return (
    <Card className="border-accent-primary/30 bg-accent-primary/100 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileJson className="text-accent-primary h-4 w-4" />
          Tech Pack Data Hub
        </CardTitle>
        <CardDescription className="text-xs">
          Сводка данных для производства: промеры, состав, уход, PIM-атрибуты.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1 rounded border bg-background p-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Состав</p>
            <p className="line-clamp-1 text-[11px]">{techPack.composition}</p>
          </div>
          <div className="space-y-1 rounded border bg-background p-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Промеры</p>
            <p className="text-[11px]">{techPack.measurements.length} размеров</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {techPack.fabricSpec?.gsm && (
            <Badge variant="outline" className="border-accent-primary/25 text-[9px]">
              GSM: {techPack.fabricSpec.gsm}
            </Badge>
          )}
          {techPack.careSymbols.length > 0 && (
            <Badge variant="outline" className="border-accent-primary/25 text-[9px]">
              {techPack.careSymbols.length} символов ухода
            </Badge>
          )}
          <Badge
            variant="outline"
            className="border-accent-primary/25 text-accent-primary text-[9px]"
          >
            <CheckCircle2 className="mr-1 h-2 w-2" />
            GTIN/EAN ready
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-accent-primary/40 hover:bg-accent-primary/15 w-full gap-2 text-xs"
          onClick={downloadJson}
        >
          <Download className="h-3 w-3" />
          Скачать Tech Pack (JSON)
        </Button>
      </CardContent>
    </Card>
  );
}
