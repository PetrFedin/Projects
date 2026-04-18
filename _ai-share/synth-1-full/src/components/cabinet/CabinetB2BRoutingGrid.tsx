'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CabinetB2bRoutingRow } from '@/lib/data/cabinet-b2b-routing-matrix';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  rows: CabinetB2bRoutingRow[];
};

export function CabinetB2BRoutingGrid({ rows }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <Card key={row.id} className="border-border-subtle flex flex-col shadow-sm">
          <CardHeader className="space-y-2 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-base leading-snug">{row.title}</CardTitle>
              <Badge
                variant="outline"
                className="shrink-0 text-[9px] font-bold uppercase tracking-wide"
              >
                {row.id}
              </Badge>
            </div>
            <CardDescription className="text-xs leading-relaxed">{row.blurb}</CardDescription>
            <Link
              href={row.homeHref}
              className="text-accent-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              Войти в кабинет
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 pt-0 text-sm">
            <div>
              <p className="text-text-muted mb-1.5 text-[10px] font-black uppercase tracking-widest">
                Функции и входы
              </p>
              <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1 [scrollbar-gutter:stable]">
                {row.anchors.map((a) => (
                  <li key={a.href + a.label}>
                    <Link
                      href={a.href}
                      className="text-text-primary hover:text-accent-primary hover:underline"
                    >
                      {a.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border-subtle mt-auto border-t pt-3">
              <p className="text-text-muted mb-1.5 text-[10px] font-black uppercase tracking-widest">
                Взаимодействие с ролями
              </p>
              <ul className="text-text-secondary space-y-1.5 text-xs">
                {row.peers.map((p) => (
                  <li key={p.href + p.label}>
                    <Link href={p.href} className="hover:text-accent-primary hover:underline">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
