'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Search,
  Calculator,
  Truck,
  FileCheck,
  CreditCard,
  Factory,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Package,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** 7. AQL Calculator */
export function AQLCalculator() {
  const [lotSize, setLotSize] = useState(500);
  const [level, setLevel] = useState<'II' | 'III'>('II');
  const levelII = [
    {
      aql: 0.065,
      sample: Math.min(
        lotSize,
        [2, 8, 13, 20, 32, 50, 80, 125, 200, 315, 500, 800][
          Math.min(11, Math.floor(Math.log10(lotSize)) + 4)
        ] || 50
      ),
      accept: 0,
      reject: 1,
    },
  ];
  const sampleSize =
    level === 'II' ? (lotSize <= 280 ? 32 : lotSize <= 500 ? 50 : 80) : lotSize <= 280 ? 50 : 80;
  return (
    <Card className="border-border-subtle rounded-xl border shadow-sm">
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
          <Calculator className="h-4 w-4" aria-hidden /> AQL-калькулятор (ISO 2859)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div>
          <label className="text-text-secondary text-[9px] font-bold uppercase">Объём партии</label>
          <Input
            type="number"
            value={lotSize}
            onChange={(e) => setLotSize(Number(e.target.value) || 0)}
            className="mt-1 h-8 text-[10px]"
          />
        </div>
        <div>
          <label className="text-text-secondary text-[9px] font-bold uppercase">Уровень</label>
          <div className="mt-1 flex gap-2">
            {(['II', 'III'] as const).map((l) => (
              <Button
                key={l}
                variant={level === l ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-[9px]"
                onClick={() => setLevel(l)}
              >
                {l}
              </Button>
            ))}
          </div>
        </div>
        <div className="bg-bg-surface2 rounded-lg p-3">
          <p className="text-[10px] font-bold">
            Выборка: <span className="text-accent-primary">{sampleSize}</span> ед.
          </p>
          <p className="text-text-secondary mt-0.5 text-[9px]">Ac/Re для AQL 0.065: 0/1</p>
        </div>
      </CardContent>
    </Card>
  );
}

/** 6. Cargo tracking card */
export function CargoTrackingCard({
  trackId,
  status,
  eta,
}: {
  trackId?: string;
  status?: string;
  eta?: string;
}) {
  return (
    <Card className="border-border-subtle rounded-xl border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase">Трек {trackId || '—'}</p>
          <p className="text-text-secondary text-[9px]">
            Статус: {status || 'В пути'} · ETA: {eta || '—'}
          </p>
        </div>
      </div>
    </Card>
  );
}

/** 8. Cash flow summary */
export function CashFlowSummary({
  inflows,
  outflows,
}: {
  inflows?: number[];
  outflows?: number[];
}) {
  const inSum = (inflows || [120000, 85000, 0]).reduce((a, b) => a + b, 0);
  const outSum = (outflows || [350000, 120000]).reduce((a, b) => a + b, 0);
  const diff = inSum - outSum;
  return (
    <Card className="border-border-subtle rounded-xl border shadow-sm">
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
          <CreditCard className="h-4 w-4" aria-hidden /> Кэш-флоу (месяц)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-text-secondary text-[9px]">Поступления</p>
            <p className="text-sm font-bold text-emerald-600">+{(inSum / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-text-secondary text-[9px]">Платежи</p>
            <p className="text-sm font-bold text-rose-600">−{(outSum / 1000).toFixed(0)}k</p>
          </div>
          <div>
            <p className="text-text-secondary text-[9px]">Итого</p>
            <p
              className={cn('text-sm font-bold', diff >= 0 ? 'text-emerald-600' : 'text-rose-600')}
            >
              {diff >= 0 ? '+' : ''}
              {(diff / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** 9. Factory rating card */
export function FactoryRatingCard({
  name,
  rating,
  quality,
  delivery,
  contact,
}: {
  name: string;
  rating?: number;
  quality?: number;
  delivery?: number;
  contact?: string;
}) {
  const r = rating ?? 4.5;
  return (
    <Card className="border-border-subtle rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-black uppercase">{name}</p>
          <p className="text-text-secondary mt-0.5 text-[9px]">Рейтинг {r.toFixed(1)}/5</p>
          {(quality !== undefined || delivery !== undefined) && (
            <div className="mt-2 flex gap-2">
              {quality !== undefined && (
                <Badge variant="outline" className="text-[8px]">
                  QC {quality}%
                </Badge>
              )}
              {delivery !== undefined && (
                <Badge variant="outline" className="text-[8px]">
                  В срок {delivery}%
                </Badge>
              )}
            </div>
          )}
        </div>
        {contact && (
          <a href={`mailto:${contact}`} className="text-accent-primary text-[9px] hover:underline">
            {contact}
          </a>
        )}
      </div>
    </Card>
  );
}

/** 5. Factory load overview */
export function FactoryLoadOverview({
  data,
}: {
  data?: Array<{ factory: string; week: string; load: number; poCount: number }>;
}) {
  const rows = data || [
    { factory: 'Global Textiles', week: '12–18.03', load: 85, poCount: 3 },
    { factory: 'Smart Tailor', week: '12–18.03', load: 60, poCount: 2 },
  ];
  return (
    <Card className="border-border-subtle rounded-xl border shadow-sm">
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
          <BarChart3 className="h-4 w-4" aria-hidden /> Загрузка фабрик
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[9px]">Фабрика</TableHead>
              <TableHead className="text-[9px]">Неделя</TableHead>
              <TableHead className="text-[9px]">Загрузка</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="text-[10px]">{r.factory}</TableCell>
                <TableCell className="text-[10px]">{r.week}</TableCell>
                <TableCell className="text-[10px]">
                  <Progress
                    value={r.load}
                    className="h-2 w-20"
                    aria-label={`Загрузка фабрики ${r.factory}: ${r.load}%`}
                  />
                  <span className="ml-2 text-[9px]">{r.load}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/** Cert expiry reminder */
export function CertExpiryReminder({ items }: { items?: Array<{ name: string; expiry: string }> }) {
  const list = items || [
    { name: 'Декларация EAC', expiry: '15.06.2026' },
    { name: 'Сертификат качества', expiry: '01.09.2026' },
  ];
  return (
    <Card className="border-border-subtle rounded-xl border shadow-sm">
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
          <FileCheck className="h-4 w-4" aria-hidden /> Срок действия сертификатов
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-1">
          {list.map((it, i) => (
            <li key={i} className="flex items-center justify-between text-[10px]">
              <span>{it.name}</span>
              <Badge variant="outline" className="text-[8px]">
                {it.expiry}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
