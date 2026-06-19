'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const SIZE_CLASS = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
} as const;

/** Квадратная иконка с wordmark SYNTHA по центру (тёмный фон). */
export function SynthaWordmarkIcon({
  size = 'md',
  className,
}: {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-sm ring-1 ring-black/20',
        SIZE_CLASS[size],
        className
      )}
      aria-hidden
    >
      <Image
        src="/brand/syntha-wordmark-dark.png"
        alt=""
        fill
        sizes="56px"
        className="object-contain p-[18%]"
        priority
      />
    </span>
  );
}
