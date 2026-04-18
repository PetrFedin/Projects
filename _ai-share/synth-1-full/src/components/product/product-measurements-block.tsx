'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { getAllSizeMeasurements } from '@/lib/fashion/garment-measurements';
import { Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type Props = { product: Product };

export function ProductMeasurementsBlock({ product }: Props) {
  const allMeasurements = getAllSizeMeasurements(product);
  const [activeSize, setActiveSize] = useState(allMeasurements[0]?.size ?? '');

<<<<<<< HEAD
  const [activeSize, setActiveSize] = useState(allMeasurements[0].size);
=======
  if (allMeasurements.length === 0) return null;
>>>>>>> recover/cabinet-wip-from-stash
  const current = allMeasurements.find((m) => m.size === activeSize);

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Ruler className="h-4 w-4" />
          Точные промеры изделия
        </CardTitle>
        <CardDescription className="text-xs">
          Физические измерения в см для каждого размера. Помогает выбрать без примерки.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeSize} onValueChange={setActiveSize}>
<<<<<<< HEAD
          <TabsList className="h-8 p-1">
            {allMeasurements.map((m) => (
              <TabsTrigger key={m.size} value={m.size} className="px-2 text-[10px]">
=======
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-8 flex-wrap p-0.5')}>
            {allMeasurements.map((m) => (
              <TabsTrigger
                key={m.size}
                value={m.size}
                className={cn(
                  cabinetSurface.tabsTrigger,
                  'h-7 px-2 text-[10px] font-semibold normal-case tracking-normal'
                )}
              >
>>>>>>> recover/cabinet-wip-from-stash
                {m.size}
              </TabsTrigger>
            ))}
          </TabsList>
          {allMeasurements.map((m) => (
            <TabsContent key={m.size} value={m.size} className="mt-2">
              <Table>
                <TableBody>
                  {m.measurements.map((meas) => (
                    <TableRow key={meas.label} className="h-8">
                      <TableCell className="py-1 text-xs text-muted-foreground">
                        {meas.label}
                      </TableCell>
                      <TableCell className="py-1 text-right font-mono text-xs font-medium">
                        {meas.value} {meas.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
        <p className="text-[10px] italic leading-tight text-muted-foreground">
          * Допуск +/- 1 см. Измерения в свободном состоянии на плоскости.
        </p>
      </CardContent>
    </Card>
  );
}
