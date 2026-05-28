'use client';

import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCollectionsGridItemMainMetaBadges({
  c,
  cn,
}: {
  c: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Badge
        className={cn(
          'text-[9px] font-bold uppercase',
          c.status === 'Production'
            ? 'bg-accent-primary/15 text-accent-primary border-0'
            : c.status === 'Development'
              ? 'border-0 bg-amber-100 text-amber-700'
              : 'border-0 bg-emerald-100 text-emerald-700'
        )}
      >
        {String(c.status)} · {String(c.readiness)}
      </Badge>
      {(Boolean(c.season) || Boolean(c.tag)) && (
        <Badge variant="outline" className="text-[8px]">
          {String(c.season || c.tag)}
        </Badge>
      )}
      <span className="text-text-primary text-[12px] font-bold">{String(c.budget)}</span>
      {c.deadline != null && String(c.deadline) !== '' && String(c.deadline) !== '—' && (
        <span className="text-text-secondary flex items-center gap-0.5 text-[10px] font-medium">
          <Calendar className="h-3 w-3" /> До {String(c.deadline)}
        </span>
      )}
    </div>
  );
}
