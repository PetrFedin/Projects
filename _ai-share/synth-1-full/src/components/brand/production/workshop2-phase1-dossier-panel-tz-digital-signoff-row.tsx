'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { Workshop2DossierSignoffMeta } from '@/lib/production/workshop2-dossier-phase1.types';
import { formatSignoffWhoWhen } from '@/components/brand/production/workshop2-phase1-dossier-panel-signoff-format';
import { WORKSHOP_HINT_TOOLTIP_CLASS } from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';

export function WorkshopTzDigitalSignoffRow({
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
}: {
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
  /** Блокировка «Подписать»: вкладки ТЗ ниже порога заполнения. */
  signBlockHint?: string;
}) {
  const whoWhen = formatSignoffWhoWhen(signoff);
  return (
    <div className="border-border-subtle bg-bg-surface2/60 text-text-primary rounded-md border p-3 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-text-primary font-semibold">{title}</p>
          {passportAssigneeName?.trim() ? (
            <p className="text-text-secondary text-[10px] leading-snug">
              {passportAssigneeOrgLabel?.trim() ? (
                <>
                  <span className="text-text-muted font-medium">{passportAssigneeOrgLabel.trim()}</span>
                  <span className="text-text-muted"> · </span>
                </>
              ) : null}
              {passportAssigneeName.trim()}
            </p>
          ) : null}
          {!canSign && !signoff ? (
            signatoryMismatchHint ? (
              <p className="text-[10px] leading-snug text-amber-900/90">{signatoryMismatchHint}</p>
            ) : hasRoleCapability === false ? (
              <p className="text-text-secondary text-[10px] leading-snug">
                Нет права цифровой подписи для этого направления. Выдайте право в{' '}
                <Link
                  href={ROUTES.brand.teamPermissions}
                  className="text-accent-primary hover:text-accent-primary font-medium underline"
                >
                  Команда → права доступа
                </Link>
                .
              </p>
            ) : null
          ) : null}
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
                className="inline-flex h-9 items-center justify-center rounded-md border border-emerald-400 bg-emerald-50 px-3 text-xs font-semibold text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_0_16px_rgba(16,185,129,0.25)]"
                aria-live="polite"
              >
                Подписано
              </span>
              {canRevoke ? (
                <Button type="button" variant="outline" className="h-9 px-3 text-xs" onClick={onRevoke}>
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
                    'h-9 gap-1.5 px-2.5 text-[11px] font-medium sm:px-3 sm:text-xs',
                    notifyResponsibleHighlighted &&
                      'border-red-500 bg-red-50 text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.25)] hover:border-red-600 hover:bg-red-100 hover:text-red-900'
                  )}
                  onClick={onNotifyResponsible}
                >
                  <Bell className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">Уведомить</span>
                </Button>
              ) : null}
              {(() => {
                const defaultNoSignHint =
                  'Подписать может только закреплённый в паспорте исполнитель с нужным правом в команде.';
                const signTooltipHint = signBlockHint ?? (!canSign ? defaultNoSignHint : null);
                const signBtn = (
                  <Button type="button" className="h-9 px-3 text-xs font-semibold" disabled={!canSign} onClick={onSign}>
                    Подписать
                  </Button>
                );
                if (!canSign && signTooltipHint) {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex">{signBtn}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className={WORKSHOP_HINT_TOOLTIP_CLASS}>
                        <p className="max-w-xs text-xs">{signTooltipHint}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                return signBtn;
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
