import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function FilterChips({ 
  filters, 
  onRemove 
}: { 
  filters: { key: string; label: string; value: string }[];
  onRemove: (key: string) => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {filters.map((f) => (
        <div 
          key={f.key} 
          className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-sm"
        >
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">{f.label}:</span>
          <span className="text-[10px] font-bold text-zinc-900 uppercase">{f.value}</span>
          <button 
            onClick={() => onRemove(f.key)}
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
