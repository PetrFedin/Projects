'use client';

import { Button } from '@/components/ui/button';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type Props = {
  dossier: Workshop2DossierPhase1;
  setDossier: React.Dispatch<React.SetStateAction<Workshop2DossierPhase1>>;
  tzWriteDisabled?: boolean;
};

export function Workshop2ChangeRequestsPanel({ dossier, setDossier, tzWriteDisabled }: Props) {
  const crs = dossier.changeRequests || [];

  const handleCreateCr = () => {
    setDossier((prev) => ({
      ...prev,
      changeRequests: [
        ...(prev.changeRequests || []),
        {
          id: crypto.randomUUID(),
          description: 'Новый запрос на изменение',
          status: 'pending',
          requestedBy: 'Текущий пользователь',
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };

  return (
    <div className="border-border-subtle bg-bg-surface space-y-4 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary text-sm font-semibold">Запросы на изменение (CR)</h3>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleCreateCr}
          disabled={tzWriteDisabled}
        >
          Создать CR
        </Button>
      </div>

      {crs.length === 0 ? (
        <p className="text-text-muted text-xs">Нет активных запросов на изменение.</p>
      ) : (
        <div className="space-y-2">
          {crs.map((cr) => (
            <div
              key={cr.id}
              className="border-border-default flex items-center justify-between rounded-lg border p-3 text-xs"
            >
              <div>
                <p className="text-text-primary font-medium">{cr.description}</p>
                <p className="text-text-muted mt-1">
                  От: {cr.requestedBy} · {new Date(cr.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-800">
                  {cr.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
