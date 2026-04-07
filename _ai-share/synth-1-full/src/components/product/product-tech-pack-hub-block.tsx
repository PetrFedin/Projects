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
    toast({ title: 'Tech Pack экспортирован', description: 'JSON файл готов для загрузки в PLM / ERP.' });
  };

  return (
    <Card className="mt-4 border-violet-500/30 bg-violet-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileJson className="h-4 w-4 text-violet-600" />
          Tech Pack Data Hub
        </CardTitle>
        <CardDescription className="text-xs">
          Сводка данных для производства: промеры, состав, уход, PIM-атрибуты.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded border bg-background space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Состав</p>
            <p className="text-[11px] line-clamp-1">{techPack.composition}</p>
          </div>
          <div className="p-2 rounded border bg-background space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Промеры</p>
            <p className="text-[11px]">{techPack.measurements.length} размеров</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {techPack.fabricSpec?.gsm && (
            <Badge variant="outline" className="text-[9px] border-violet-200">
              GSM: {techPack.fabricSpec.gsm}
            </Badge>
          )}
          {techPack.careSymbols.length > 0 && (
            <Badge variant="outline" className="text-[9px] border-violet-200">
              {techPack.careSymbols.length} символов ухода
            </Badge>
          )}
          <Badge variant="outline" className="text-[9px] border-violet-200 text-violet-700">
            <CheckCircle2 className="h-2 w-2 mr-1" />
            GTIN/EAN ready
          </Badge>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs gap-2 border-violet-400/50 hover:bg-violet-100"
          onClick={downloadJson}
        >
          <Download className="h-3 w-3" />
          Скачать Tech Pack (JSON)
        </Button>
      </CardContent>
    </Card>
  );
}
