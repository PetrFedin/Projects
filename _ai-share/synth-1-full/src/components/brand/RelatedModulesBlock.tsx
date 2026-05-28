'use client';

/**
 * Блок «Связанные разделы» — перекрёстные ссылки на другие модули.
 * Используется на страницах заказов, задач, партнёров, Production и т.д.
 */
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { finalizeRelatedModuleLinks, type EntityLink } from '@/lib/data/entity-links';

interface RelatedModulesBlockProps {
  title?: string;
  links: EntityLink[];
  className?: string;
}

export function RelatedModulesBlock({
  title = 'Связанные разделы',
  links,
  className,
}: RelatedModulesBlockProps) {
  const safeLinks = finalizeRelatedModuleLinks(links ?? []).filter(
    (link): link is EntityLink => typeof link.href === 'string' && link.href.length > 0
  );
  if (!safeLinks.length) {
    return null;
  }

  return (
    <Card
      className={cn('border-border-subtle border bg-white shadow-sm', className)}
      data-testid="related-modules-block"
    >
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-text-secondary text-xs font-black uppercase tracking-[0.2em]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {safeLinks.map((link, index) => (
            <li key={`${String(link.href)}-${index}`}>
              <Link
                href={link.href}
                className="border-border-subtle bg-bg-surface2/80 text-text-primary hover:border-accent-primary/30 hover:text-accent-primary group flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors hover:bg-white"
              >
                <span className="min-w-0 truncate">{link.label}</span>
                <ArrowUpRight
                  className="text-text-muted group-hover:text-accent-primary size-3.5 shrink-0"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
