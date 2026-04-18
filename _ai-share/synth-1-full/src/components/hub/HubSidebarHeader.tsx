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
  badgeClass = 'bg-bg-surface2 text-text-secondary',
  iconBgClass = 'bg-text-primary',
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
    <div className="border-border-subtle shrink-0 border-b px-3 py-3">
      <Link
        href={href}
        className="hover:bg-bg-surface2 group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors"
      >
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] text-white transition-opacity group-hover:opacity-90',
            iconBgClass
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text-primary truncate text-[10px] font-black uppercase leading-tight tracking-tight">
            {title}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {badge && (
              <Badge className={cn(badgeClass, 'h-4 border-none px-1 py-0 text-[7px] font-black')}>
                {badge}
              </Badge>
            )}
            <span className="text-text-muted text-[8px] font-bold capitalize">{role}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
