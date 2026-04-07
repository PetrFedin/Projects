'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { ROUTES } from '@/lib/routes';
import { APPAREL_SIZE_TABLE, FOOTWEAR_EU_US, findApparelRowByLabel } from '@/lib/fashion/size-conversion';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function SizeConverterPage() {
  const [label, setLabel] = useState('M');
  const row = useMemo(() => findApparelRowByLabel(label), [label]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-6 w-6" />
              Конвертер размеров
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Справочные таблицы; в проде подставляйте матрицу бренда из PIM.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Tabs defaultValue="apparel">
        <TabsList>
          <TabsTrigger value="apparel">Верх / платья</TabsTrigger>
          <TabsTrigger value="shoes">Обувь EU→US</TabsTrigger>
        </TabsList>
        <TabsContent value="apparel" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Подбор по маркировке</CardTitle>
              <CardDescription>Выберите размер на этикетке (INT / бренд часто совпадает с колонкой).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Размер</Label>
                <select
                  className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                >
                  {APPAREL_SIZE_TABLE.map((r) => (
                    <option key={r.label} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {row && (
                <div className="rounded-lg border p-4 text-sm grid sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">EU</p>
                    <p className="font-mono text-lg">{row.eu}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">US</p>
                    <p className="font-mono text-lg">{row.us}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">UK</p>
                    <p className="font-mono text-lg">{row.uk}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Полная таблица</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>INT</TableHead>
                    <TableHead>EU</TableHead>
                    <TableHead>US</TableHead>
                    <TableHead>UK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {APPAREL_SIZE_TABLE.map((r) => (
                    <TableRow key={r.label}>
                      <TableCell className="font-medium">{r.label}</TableCell>
                      <TableCell className="font-mono">{r.eu}</TableCell>
                      <TableCell className="font-mono">{r.us}</TableCell>
                      <TableCell className="font-mono">{r.uk}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shoes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Обувь</CardTitle>
              <CardDescription>Усреднение по мужской линейке; у женских брендов сдвиг −1…1,5.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EU</TableHead>
                    <TableHead>US (ориентир)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FOOTWEAR_EU_US.map((r) => (
                    <TableRow key={r.eu}>
                      <TableCell className="font-mono">{r.eu}</TableCell>
                      <TableCell className="font-mono">{r.us}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
