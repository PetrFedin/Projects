'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { getAllSizeMeasurements } from '@/lib/fashion/garment-measurements';
import { Ruler } from 'lucide-react';

type Props = { product: Product };

export function ProductMeasurementsBlock({ product }: Props) {
  const allMeasurements = getAllSizeMeasurements(product);
  if (allMeasurements.length === 0) return null;

  const [activeSize, setActiveSize] = useState(allMeasurements[0].size);
  const current = allMeasurements.find(m => m.size === activeSize);

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Точные промеры изделия
        </CardTitle>
        <CardDescription className="text-xs">
          Физические измерения в см для каждого размера. Помогает выбрать без примерки.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeSize} onValueChange={setActiveSize}>
          <TabsList className="h-8 p-1">
            {allMeasurements.map(m => (
              <TabsTrigger key={m.size} value={m.size} className="text-[10px] px-2">
                {m.size}
              </TabsTrigger>
            ))}
          </TabsList>
          {allMeasurements.map(m => (
            <TabsContent key={m.size} value={m.size} className="mt-2">
              <Table>
                <TableBody>
                  {m.measurements.map(meas => (
                    <TableRow key={meas.label} className="h-8">
                      <TableCell className="py-1 text-xs text-muted-foreground">
                        {meas.label}
                      </TableCell>
                      <TableCell className="py-1 text-xs text-right font-mono font-medium">
                        {meas.value} {meas.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
        <p className="text-[10px] text-muted-foreground italic leading-tight">
          * Допуск +/- 1 см. Измерения в свободном состоянии на плоскости.
        </p>
      </CardContent>
    </Card>
  );
}
