'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function isHubNavItem(item: unknown): item is { path: string; title: string } {
  return (
    item !== null &&
    typeof item === 'object' &&
    'path' in item &&
    'title' in item &&
    typeof (item as { path: unknown }).path === 'string' &&
    typeof (item as { title: unknown }).title === 'string'
  );
}

type BrandGlobalHubNavProps = {
  navigation: unknown;
};

/** API navigation strip — отдельный chunk от brand layout shell. */
export function BrandGlobalHubNav({ navigation }: BrandGlobalHubNavProps) {
  const pathname = usePathname();
  if (!Array.isArray(navigation) || navigation.length === 0 || !navigation.every(isHubNavItem)) {
    return null;
  }

  return (
    <div className="border-border-subtle bg-bg-surface scrollbar-hide flex w-full flex-nowrap items-center gap-4 overflow-x-auto border-b px-4 py-2 sm:px-6 lg:px-8">
      {navigation.map((item, idx) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={`${item.path}-${idx}`}
            href={item.path}
            className={cn(
              'shrink-0 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.2em] transition-all',
              isActive ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
