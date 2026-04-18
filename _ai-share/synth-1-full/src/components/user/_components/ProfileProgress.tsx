import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProfileProgressProps {
  progress: {
    current: {
      title: string;
      percent: number;
      items: Array<{ key: string; label: string; done: boolean }>;
    };
  };
  isOpen: boolean;
  onToggle: () => void;
}

export const ProfileProgress = ({ progress, isOpen, onToggle }: ProfileProgressProps) => {
  return (
    <div className="rounded-lg border p-3">
      <button
        type="button"
        className="w-full text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="profile-progress-details"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Прогресс профиля</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{progress.current.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold tabular-nums">{progress.current.percent}%</div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      <div className="mt-3">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-zinc-200 to-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 transition-[width] duration-500 ease-out"
            style={{ width: `${progress.current.percent}%` }}
          />
        </div>
      </div>

      {isOpen && (
        <div id="profile-progress-details" className="mt-3">
          <div className="grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
            {progress.current.items.map((it) => (
              <div key={it.key} className="flex items-center gap-2">
                <span
                  className={cn('h-2 w-2 rounded-full', it.done ? 'bg-green-600' : 'bg-red-500')}
                  aria-hidden
                />
                <span className={cn('min-w-0', it.done && 'text-zinc-700')}>{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
