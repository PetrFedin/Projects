'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Workshop2DossierSignoffMeta } from '@/lib/production/workshop2-dossier-phase1.types';

type Props = {
  title: string;
  canSign: boolean;
  signoff?: Workshop2DossierSignoffMeta;
  onSign: () => void;
  onRevoke: () => void;
  canRevoke: boolean;
  /** Пока роль не подписала — кнопка уведомления слева от «Подписать». Скрывается, когда все три подписи стоят. */
  showNotifyResponsible?: boolean;
  onNotifyResponsible?: () => void;
  /** Подсветка только у строки, для которой нажали «Уведомить ответственного». */
  notifyResponsibleHighlighted?: boolean;
  /** Есть ли право роли в команде (без учёта закрепления за лицом). */
  hasRoleCapability?: boolean;
  /** Коротко: закреплено за другим лицом (имя уже под заголовком роли). */
  signatoryMismatchHint?: string;
  passportAssigneeName?: string;
  passportAssigneeOrgLabel?: string;
  /** «Подписать» недоступен, пока вкладки ТЗ ниже порога заполнения. */
  signBlockHint?: string;
};

function formatSignoffWhoWhen(meta: Workshop2DossierSignoffMeta | undefined): string | null {
  if (!meta?.at) return null;
  try {
    const org = meta.byOrganization?.trim();
    const who = org ? `${meta.by} · ${org}` : meta.by;
    return `${who} · ${new Date(meta.at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}`;
  } catch {
    return meta.by;
  }
}

export function Workshop2TzDigitalSignoffRow({
  title,
  canSign,
  signoff,
  onSign,
  onRevoke,
  canRevoke,
  showNotifyResponsible,
  onNotifyResponsible,
  notifyResponsibleHighlighted,
  hasRoleCapability,
  signatoryMismatchHint,
  passportAssigneeName,
  passportAssigneeOrgLabel,
  signBlockHint,
}: Props) {
  const whoWhen = formatSignoffWhoWhen(signoff);
  const rowInactive = !canSign && !signoff;
  return (
    <div
      className={cn(
        'border-border-subtle bg-bg-surface2/60 text-text-primary rounded-md border p-3 text-[11px]',
        rowInactive && 'opacity-65'
      )}
      data-inactive-reason={
        rowInactive && (signatoryMismatchHint || hasRoleCapability === false) ? 'locked' : undefined
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <p className="text-text-primary font-semibold">{title}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {signoff ? (
            <>
              {whoWhen ? (
                <span className="text-text-secondary max-w-[min(100%,14rem)] text-right text-[10px] leading-snug sm:max-w-[18rem]">
                  {whoWhen}
                </span>
              ) : null}
              <span
                className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-400 bg-emerald-50 px-3 text-xs font-semibold text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_0_16px_rgba(16,185,129,0.25)]"
                aria-live="polite"
              >
                Подписано
              </span>
              {canRevoke ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-3 text-xs"
                  onClick={onRevoke}
                >
                  Снять подпись
                </Button>
              ) : (
                <span className="text-text-muted max-w-[10rem] text-[9px] sm:max-w-none">
                  Снять может только руководитель из списка допущенных.
                </span>
              )}
            </>
          ) : (
            <>
              {showNotifyResponsible && onNotifyResponsible ? (
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={notifyResponsibleHighlighted === true}
                  className={cn(
                    'h-8 gap-1.5 px-2.5 text-[11px] font-medium sm:px-3 sm:text-xs',
                    notifyResponsibleHighlighted &&
                      'border-red-500 bg-red-50 text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.25)] hover:border-red-600 hover:bg-red-100 hover:text-red-900'
                  )}
                  onClick={onNotifyResponsible}
                >
                  <LucideIcons.Bell className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">Уведомить</span>
                </Button>
              ) : null}
              <Button
                type="button"
                className="h-8 px-3 text-xs font-semibold"
                disabled={!canSign}
                title={
                  signBlockHint
                    ? signBlockHint
                    : !canSign
                      ? 'Подписать может только закреплённый в паспорте исполнитель с нужным правом в команде.'
                      : undefined
                }
                onClick={onSign}
              >
                Подписать
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
