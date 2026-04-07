'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export function HubSidebarHeader({
  href,
  icon: Icon,
  title,
  badge,
  badgeClass = 'bg-slate-100 text-slate-600',
  iconBgClass = 'bg-slate-900',
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  badge?: string;
  badgeClass?: string;
  iconBgClass?: string;
}) {
  const { role } = useRbac();
  return (
    <div className="px-3 py-3 border-b border-slate-100 shrink-0">
      <Link href={href} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors group">
        <div className={cn('h-9 w-9 rounded-[4px] flex items-center justify-center text-white shrink-0 group-hover:opacity-90 transition-opacity', iconBgClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 truncate leading-tight">{title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {badge && <Badge className={cn(badgeClass, 'border-none text-[7px] font-black px-1 py-0 h-4')}>{badge}</Badge>}
            <span className="text-[8px] text-slate-400 font-bold capitalize">{role}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
