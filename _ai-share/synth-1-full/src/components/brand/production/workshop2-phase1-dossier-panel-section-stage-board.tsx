'use client';

import * as LucideIcons from 'lucide-react';

export function SectionStageBoard({
  warnings,
  onJumpToVisualBrandNotes,
}: {
  warnings: string[];
  onJumpToVisualBrandNotes?: () => void;
}) {
  if (warnings.length === 0) return null;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="space-y-1 rounded-lg border border-amber-100 bg-amber-50/40 p-3">
        <ul className="space-y-1">
          {warnings.map((w, idx) => {
            const targetAttrId = w.includes('SKU')
              ? 'sku'
              : w.includes('назв')
                ? 'name'
                : w.includes('замыс')
                  ? 'brandNotes'
                  : w.includes('материал')
                    ? 'mat'
                    : w.includes('мерки')
                      ? 'sampleBaseSize'
                      : null;
            return (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-800">
                <LucideIcons.AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{w}</span>
                {targetAttrId && (
                  <button
                    type="button"
                    className="text-accent-primary ml-auto text-[10px] font-bold hover:underline"
                    onClick={() => {
                      if (targetAttrId === 'brandNotes' && onJumpToVisualBrandNotes) {
                        onJumpToVisualBrandNotes();
                        return;
                      }
                      const el = document.getElementById(`w2-attr-${targetAttrId}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    ПЕРЕЙТИ
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
