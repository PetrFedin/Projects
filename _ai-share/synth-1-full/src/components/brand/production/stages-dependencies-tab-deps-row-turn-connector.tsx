'use client';

import { ArrowDown } from 'lucide-react';

/** Вертикальный переход: колонка 1–5 под последним узлом потока в строке (чётная — справа, нечётная — слева). */
export function DepsRowTurnConnector({ column }: { column: number }) {
  const col = Math.min(Math.max(Math.round(column), 1), 5);
  return (
    <div className="grid min-h-[28px] w-full shrink-0 grid-cols-5" aria-hidden>
      {[1, 2, 3, 4, 5].map((c) =>
        c === col ? (
          <span key={c} className="flex flex-col items-center justify-start">
            <span className="bg-accent-primary/90 h-2.5 w-0.5 rounded-full" />
            <ArrowDown className="text-accent-primary h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        ) : (
          <span key={c} />
        )
      )}
    </div>
  );
}
