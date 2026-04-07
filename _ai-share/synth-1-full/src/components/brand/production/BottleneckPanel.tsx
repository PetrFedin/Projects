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
    <Card className="border border-amber-100 shadow-sm rounded-xl overflow-hidden bg-amber-50/30">
      <CardHeader className="p-4 border-b border-amber-100/50">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Узкие места
        </CardTitle>
        <p className="text-[9px] text-slate-500 mt-0.5">Просрочки, риски, недостающие ресурсы</p>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center justify-between gap-3 p-3 rounded-xl border transition-all',
              item.severity === 'high' && 'bg-rose-50 border-rose-100',
              item.severity === 'medium' && 'bg-amber-50 border-amber-100',
              item.severity === 'low' && 'bg-slate-50 border-slate-100'
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              {item.type === 'sla' && <Clock className="w-4 h-4 text-rose-500 shrink-0" />}
              {item.type === 'budget' && <Wallet className="w-4 h-4 text-amber-500 shrink-0" />}
              {item.type === 'material' && <Package className="w-4 h-4 text-amber-500 shrink-0" />}
              {item.type === 'stage' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-900 truncate">{item.title}</p>
                {item.detail && <p className="text-[9px] text-slate-500 truncate">{item.detail}</p>}
              </div>
            </div>
            <Badge variant="outline" className={cn("text-[8px] shrink-0", item.severity === 'high' && "border-rose-200 text-rose-700", item.severity === 'medium' && "border-amber-200 text-amber-700")}>
              {item.severity === 'high' ? 'Критично' : item.severity === 'medium' ? 'Внимание' : 'Низкий'}
            </Badge>
            {onResolve && (
              <Button variant="ghost" size="sm" className="h-7 text-[9px] shrink-0" onClick={() => onResolve(item.id)}>
                →
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
