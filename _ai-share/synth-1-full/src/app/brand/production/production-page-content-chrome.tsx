'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Заголовок секции в стиле кабинета (полоска + подпись). */
export function ProductionSectionHeader({
  title,
  barColor = 'bg-accent-primary',
}: {
  title: string;
  barColor?: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className={cn('h-1 w-8 rounded-full', barColor)} />
      <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">{title}</h2>
    </div>
  );
}

/** Декоративная сетка фона страницы производства. */
export function ProductionPageSvgGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.03]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="prod-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#prod-grid)" />
        <motion.circle
          cx={100}
          cy={100}
          animate={{ cx: [100, 400, 100], cy: [100, 200, 100] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          r={2}
          fill="currentColor"
        />
        <motion.circle
          cx={500}
          cy={300}
          animate={{ cx: [500, 200, 500], cy: [300, 500, 300] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          r={2}
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
