'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { CARE_SYMBOL_LIBRARY } from '@/lib/fashion/care-symbols';
import { ArrowLeft, Droplets } from 'lucide-react';

export default function CareSymbolsPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.client.home}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Droplets className="h-6 w-6" />
            Пиктограммы ухода
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Библиотека для демо-карточек. В проде — синхронизация с PIM / GS1 и локализация.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Символы</CardTitle>
          <CardDescription>Короткий код и расшифровка для колл-центра и FAQ.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CARE_SYMBOL_LIBRARY.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border p-3"
            >
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">id: {c.id}</p>
              </div>
              <Badge variant="outline" className="shrink-0 font-mono">
                {c.short}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs leading-relaxed text-muted-foreground">
        На PDP символы подтягиваются из{' '}
        <code className="rounded bg-muted px-1">attributes.care</code> (массив id) или подставляется
        безопасный дефолт до заполнения PIM.
      </p>
    </div>
  );
}
