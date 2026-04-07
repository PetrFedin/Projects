import { Clock } from 'lucide-react';
import { AuditEvent } from '../hooks/use-profile-audit';

interface ProfileAuditProps {
  events: AuditEvent[];
}

export const ProfileAudit = ({ events }: ProfileAuditProps) => {
  return (
    <div className="mt-6 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          История изменений
        </div>
        <div className="text-xs text-muted-foreground">{events.length} событий</div>
      </div>

      {events.length === 0 ? (
        <div className="mt-3 text-sm text-muted-foreground">
          Пока нет событий. Изменения и подтверждения появятся здесь автоматически.
        </div>
      ) : (
        <div className="mt-3 space-y-2 max-h-[320px] overflow-auto pr-1">
          {events.slice(0, 20).map((ev) => (
            <div key={ev.id} className="flex items-start justify-between gap-3 rounded-md border px-3 py-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground/90">{ev.message}</div>
                {ev.section && <div className="text-xs text-muted-foreground">{ev.section}</div>}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums shrink-0">
                {new Date(ev.ts).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
