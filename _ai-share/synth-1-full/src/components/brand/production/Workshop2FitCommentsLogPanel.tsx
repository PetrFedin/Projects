'use client';

import { useCallback, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  appendWorkshop2FitCommentToDossier,
  resolveWorkshop2FitCommentInDossier,
  summarizeWorkshop2FitCommentsLog,
} from '@/lib/production/workshop2-fit-comments-log';
import { isWorkshop2FitCommentsGateEnabled } from '@/lib/production/workshop2-fit-comments-log';

type Props = {
  dossier: Workshop2DossierPhase1 | null;
  onDossierPatch: (
    patch: Partial<Workshop2DossierPhase1> | Workshop2DossierPhase1
  ) => void | Promise<void>;
  authorLabel?: string;
  onPersistClick?: () => void;
};

/** Wave 7 P0 #15: журнал комментариев посадки в fit pane. */
export function Workshop2FitCommentsLogPanel({
  dossier,
  onDossierPatch,
  authorLabel,
  onPersistClick,
}: Props) {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [vaultAttachmentId, setVaultAttachmentId] = useState('');
  const [pinX, setPinX] = useState('');
  const [pinY, setPinY] = useState('');

  const summary = useMemo(() => summarizeWorkshop2FitCommentsLog({ dossier }), [dossier]);
  const gateEnabled = isWorkshop2FitCommentsGateEnabled();
  const entries = dossier?.fitComments ?? [];

  const persistDossier = useCallback(
    async (next: Workshop2DossierPhase1) => {
      await onDossierPatch(next);
    },
    [onDossierPatch]
  );

  const handleAdd = async () => {
    if (!dossier || !text.trim()) {
      toast({ title: 'Введите текст комментария', variant: 'destructive' });
      return;
    }
    const pin = pinX.trim() && pinY.trim() ? { xPct: Number(pinX), yPct: Number(pinY) } : undefined;
    const next = appendWorkshop2FitCommentToDossier({
      dossier,
      text,
      author: authorLabel ?? 'technologist',
      vaultAttachmentId: vaultAttachmentId.trim() || undefined,
      pin: pin && Number.isFinite(pin.xPct) && Number.isFinite(pin.yPct) ? pin : undefined,
    });
    await persistDossier(next);
    setText('');
    setVaultAttachmentId('');
    setPinX('');
    setPinY('');
    toast({ title: 'Комментарий добавлен', description: 'Сохраните в досье (PG mirror).' });
  };

  const handleResolve = async (commentId: string) => {
    if (!dossier) return;
    const next = resolveWorkshop2FitCommentInDossier({
      dossier,
      commentId,
      resolvedBy: authorLabel ?? 'brand',
    });
    await persistDossier(next);
    toast({ title: 'Комментарий закрыт' });
  };

  if (!dossier) {
    return (
      <p className="text-text-muted text-[11px]">
        Загрузите досье для журнала комментариев посадки.
      </p>
    );
  }

  return (
    <div
      className="border-border-default mt-4 space-y-3 rounded-xl border bg-white p-4 shadow-sm"
      data-testid="workshop2-fit-comments-log-panel"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-text-primary text-sm font-semibold">Журнал комментариев посадки</h3>
          <p className="text-text-secondary text-[11px]">{summary.hintRu}</p>
        </div>
        {gateEnabled && summary.openCount > 0 ? (
          <Badge variant="destructive" className="text-[10px]">
            Gate: {summary.openCount} открытых
          </Badge>
        ) : null}
      </div>

      <div className="space-y-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Комментарий technologist / designer…"
          className="h-8 text-[11px]"
        />
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={vaultAttachmentId}
            onChange={(e) => setVaultAttachmentId(e.target.value)}
            placeholder="vaultAttachmentId (опц.)"
            className="h-7 text-[10px]"
          />
          <Input
            value={pinX}
            onChange={(e) => setPinX(e.target.value)}
            placeholder="pin X %"
            className="h-7 text-[10px]"
          />
          <Input
            value={pinY}
            onChange={(e) => setPinY(e.target.value)}
            placeholder="pin Y %"
            className="h-7 text-[10px]"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            className="h-7 text-[10px]"
            onClick={() => void handleAdd()}
          >
            <LucideIcons.MessageSquarePlus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
          {onPersistClick ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-[10px]"
              onClick={onPersistClick}
            >
              Сохранить в досье
            </Button>
          ) : null}
        </div>
      </div>

      <ul className="max-h-48 space-y-2 overflow-y-auto">
        {entries.length === 0 ? (
          <li className="text-text-muted text-[11px]">Комментариев пока нет.</li>
        ) : (
          entries.map((c) => (
            <li
              key={c.commentId}
              className="border-border-default rounded-lg border px-2 py-1.5 text-[11px]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-medium">{c.author}</span>
                  <span className="text-text-muted ml-1">
                    {new Date(c.at).toLocaleString('ru-RU')}
                  </span>
                  {c.pin ? (
                    <span className="text-text-muted ml-1">
                      · pin ({c.pin.xPct}%, {c.pin.yPct}%)
                    </span>
                  ) : null}
                  {c.vaultAttachmentId ? (
                    <span className="text-text-muted ml-1">
                      · vault:{c.vaultAttachmentId.slice(0, 8)}
                    </span>
                  ) : null}
                  <p className="text-text-secondary mt-0.5">{c.text}</p>
                </div>
                {!c.resolved ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 shrink-0 text-[10px]"
                    onClick={() => void handleResolve(c.commentId)}
                  >
                    Закрыть
                  </Button>
                ) : (
                  <Badge variant="outline" className="text-[9px] text-emerald-700">
                    закрыт
                  </Badge>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
