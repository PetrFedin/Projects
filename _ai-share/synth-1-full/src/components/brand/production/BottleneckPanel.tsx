'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Wallet, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottleneckItem {
  id: string;
  type: 'sla' | 'budget' | 'material' | 'stage';
  title: string;
  detail?: string;
  severity: 'high' | 'medium' | 'low';
  action?: () => void;
}

export interface BottleneckPanelProps {
  items: BottleneckItem[];
  onResolve?: (id: string) => void;
}

export function BottleneckPanel({ items, onResolve }: BottleneckPanelProps) {
  if (items.length === 0) return null;

  return (
    <Card className="overflow-hidden rounded-xl border border-amber-100 bg-amber-50/30 shadow-sm">
      <CardHeader className="border-b border-amber-100/50 p-4">
<<<<<<< HEAD
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Узкие места
        </CardTitle>
        <p className="mt-0.5 text-[9px] text-slate-500">Просрочки, риски, недостающие ресурсы</p>
=======
        <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Узкие места
        </CardTitle>
        <p className="text-text-secondary mt-0.5 text-[9px]">
          Просрочки, риски, недостающие ресурсы
        </p>
>>>>>>> recover/cabinet-wip-from-stash
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center justify-between gap-3 rounded-xl border p-3 transition-all',
              item.severity === 'high' && 'border-rose-100 bg-rose-50',
              item.severity === 'medium' && 'border-amber-100 bg-amber-50',
<<<<<<< HEAD
              item.severity === 'low' && 'border-slate-100 bg-slate-50'
=======
              item.severity === 'low' && 'bg-bg-surface2 border-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              {item.type === 'sla' && <Clock className="h-4 w-4 shrink-0 text-rose-500" />}
              {item.type === 'budget' && <Wallet className="h-4 w-4 shrink-0 text-amber-500" />}
              {item.type === 'material' && <Package className="h-4 w-4 shrink-0 text-amber-500" />}
              {item.type === 'stage' && (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              )}
              <div className="min-w-0">
<<<<<<< HEAD
                <p className="truncate text-[10px] font-bold text-slate-900">{item.title}</p>
                {item.detail && <p className="truncate text-[9px] text-slate-500">{item.detail}</p>}
=======
                <p className="text-text-primary truncate text-[10px] font-bold">{item.title}</p>
                {item.detail && (
                  <p className="text-text-secondary truncate text-[9px]">{item.detail}</p>
                )}
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'shrink-0 text-[8px]',
                item.severity === 'high' && 'border-rose-200 text-rose-700',
                item.severity === 'medium' && 'border-amber-200 text-amber-700'
              )}
            >
              {item.severity === 'high'
                ? 'Критично'
                : item.severity === 'medium'
                  ? 'Внимание'
                  : 'Низкий'}
            </Badge>
            {onResolve && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 shrink-0 text-[9px]"
                onClick={() => onResolve(item.id)}
              >
                →
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
