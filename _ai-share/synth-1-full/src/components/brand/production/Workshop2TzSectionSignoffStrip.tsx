'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type {
  Workshop2DossierSignoffMeta,
  Workshop2SectionSignoffReminder,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2TzSectionSignoffRequiredSides } from '@/lib/production/workshop2-tz-section-signoff-sides';
import {
  workshop2TzSectionSignoffMetaPassportAligned,
  workshop2TzSignoffMetaIsCommitted,
} from '@/lib/production/workshop2-tz-signoff-complete';
import { cn } from '@/lib/utils';

export type Workshop2TzSectionSignoffTabKey = 'general' | 'visuals' | 'material' | 'construction';

const SECTION_HEADING: Record<Workshop2TzSectionSignoffTabKey, string> = {
  general: 'Паспорт',
  visuals: 'Визуал',
  material: 'Материалы',
  construction: 'Конструкция',
};

/** Кратко: зачем блок и что смотреть в строках ниже. */
function SectionSignoffIntro({ section }: { section: Workshop2TzSectionSignoffTabKey }) {
  const sides = workshop2TzSectionSignoffRequiredSides(section);
  const both = sides.includes('brand') && sides.includes('tech');
  const onlyBrand = sides.includes('brand') && !sides.includes('tech');
  const onlyTech = !sides.includes('brand') && sides.includes('tech');

  if (both) {
    const oneLine =
      section === 'material'
        ? 'Подтверждение материалов и состава двумя сторонами.'
        : 'Подтверждение раздела брендом и технологом.';
    return <p className="text-text-secondary min-h-8 text-[10px] leading-snug">{oneLine}</p>;
  }

  if (onlyBrand) {
    return (
      <p className="text-text-secondary min-h-8 text-[10px] leading-snug">
        Подтверждение визуала со стороны бренда.
      </p>
    );
  }

  if (onlyTech) {
    return (
      <p className="text-text-secondary min-h-8 text-[10px] leading-snug">
        Подтверждение конструкции со стороны технолога.
      </p>
    );
  }

  return (
    <p className="text-text-secondary min-h-8 text-[10px] leading-snug">
      Фиксация согласования секции.
    </p>
  );
}

function formatSignoffWhen(at: string): string {
  try {
    return new Date(at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return at;
  }
}

function SignoffSideRow({
  title,
  meta,
  fillGateOk,
  profileGateOk,
  /** Закреплённый в паспорте артикула подписант (кнопка «Подписанты»). */
  passportAssigneeName,
  passportAssigneeOrg,
  passportAssigneeMissing,
  /** Текущая сессия совпадает с закреплённым подписантом — иначе кнопка «Подтвердить» недоступна. */
  sessionMayConfirmAsPassportSigner,
  /** ФИО/организация текущей сессии — фиксируются в досье при нажатии «Подтвердить». */
  signerNamePreview,
  signerOrgPreview,
  confirmDisabled,
  confirmDisabledReason,
  onNotify,
  notifyRowHighlight,
  notifyMeta,
  onConfirm,
  onRevoke,
  revokeVisible,
  onSetDeadline,
}: {
  title: string;
  meta: Workshop2DossierSignoffMeta | undefined;
  /** Порог заполнения секции для 4/4 и handoff (кнопка «Подтвердить» неактивна, пока ниже порога). */
  fillGateOk: boolean;
  /** ФИО + предприятие в профиле; иначе подтвердить нельзя. */
  profileGateOk: boolean;
  passportAssigneeName: string;
  passportAssigneeOrg: string;
  passportAssigneeMissing: boolean;
  sessionMayConfirmAsPassportSigner: boolean;
  signerNamePreview: string;
  signerOrgPreview: string;
  confirmDisabled: boolean;
  confirmDisabledReason?: string;
  /** Напоминание ответственной стороне (копия ссылки + журнал); до полного подтверждения строки. */
  onNotify?: () => void;
  notifyRowHighlight?: boolean;
  notifyMeta?: Workshop2SectionSignoffReminder;
  onConfirm: () => void;
  onRevoke: () => void;
  revokeVisible: boolean;
  onSetDeadline?: (dueAt: string | undefined) => void;
}) {
  const metaCommitted = workshop2TzSignoffMetaIsCommitted(meta);
  const metaPassportAligned = workshop2TzSectionSignoffMetaPassportAligned(
    meta,
    passportAssigneeName,
    passportAssigneeMissing
  );
  const byAtNoDigest = Boolean(
    meta?.by?.trim() && meta?.at?.trim() && !meta?.signatureDigest?.trim()
  );
  const effectiveConfirmed = metaCommitted && fillGateOk && metaPassportAligned;
  const staleSigned =
    metaCommitted && (!fillGateOk || (!metaPassportAligned && !passportAssigneeMissing));
  const digest = meta?.signatureDigest?.trim();
  const hasNoSignoffData = !meta?.by?.trim() && !meta?.at?.trim();
  const hasActorRecord = Boolean(meta?.by?.trim() && meta?.at?.trim());

  const sessionBlocked = !sessionMayConfirmAsPassportSigner && !metaCommitted;
  const effectiveConfirmDisabled =
    confirmDisabled ||
    sessionBlocked ||
    (hasNoSignoffData && !profileGateOk);

  const confirmBtn = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 shrink-0 text-xs"
      disabled={effectiveConfirmDisabled}
      onClick={onConfirm}
    >
      Подтвердить
    </Button>
  );

  return (
    <div
      className={cn(
        'border-border-default flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm',
        notifyRowHighlight &&
          'border-red-400/90 shadow-[0_0_0_1px_rgba(248,113,113,0.35),0_0_14px_rgba(248,113,113,0.14)]'
      )}
    >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1 space-y-1.5 sm:pr-2">
          <p className="text-text-primary text-xs font-semibold">{title}</p>
          {passportAssigneeMissing ? (
            <p className="text-amber-900/90 text-[10px] leading-snug">
              В паспорте не закреплён ответственный для этой стороны — укажите в карточке артикула (кнопка
              «Подписанты»).
            </p>
          ) : null}
          {metaCommitted && !metaPassportAligned && !passportAssigneeMissing ? (
            <p className="text-destructive text-[11px] font-medium leading-snug">
              Подписант не совпадает с паспортом (ожидался{' '}
              <span className="text-text-primary">{passportAssigneeName.trim() || '—'}</span>).{' '}
              Снимите подпись и подтвердите заново.
            </p>
          ) : null}
          {effectiveConfirmed ? (
            <p className="text-text-secondary text-[11px] leading-snug">
              <span className="text-emerald-700 font-medium">Подтверждено</span>
              {meta?.by ? (
                <>
                  {' '}
                  / подписал(а){' '}
                  <span className="text-text-primary font-medium">{meta.by}</span>
                </>
              ) : null}
              {meta?.byOrganization?.trim() ? (
                <>
                  {' '}
                  / {' '}
                  <span className="text-text-secondary font-medium">{meta.byOrganization.trim()}</span>
                </>
              ) : null}
              {meta?.at ? (
                <>
                  {' '}
                  · {formatSignoffWhen(meta.at)}
                </>
              ) : null}
              {digest ? (
                <>
                  {' '}
                  · отпечаток <span className="font-mono">{digest}</span>
                </>
              ) : null}
            </p>
          ) : staleSigned ? (
            <p className="text-text-muted text-[11px] leading-snug">
              {meta?.by ? (
                <>
                  Подписал <span className="text-text-primary font-medium">{meta.by}</span>
                  {meta?.byOrganization?.trim() ? (
                    <>
                      {' '}
                      · организация{' '}
                      <span className="text-text-secondary font-medium">{meta.byOrganization.trim()}</span>
                    </>
                  ) : null}
                  {meta?.at ? (
                    <>
                      {' '}
                      · {formatSignoffWhen(meta.at)}
                    </>
                  ) : null}
                  {digest ? (
                    <>
                      {' '}
                      · отпечаток <span className="font-mono">{digest}</span>
                    </>
                  ) : null}
                </>
              ) : (
                'Подтверждение не зафиксировано.'
              )}
            </p>
          ) : byAtNoDigest ? (
            <p className="text-amber-900/90 text-[11px] leading-snug">
              Подпись без отпечатка. Подтвердите заново.
            </p>
          ) : hasNoSignoffData ? (
            <div className="space-y-1.5 text-[11px] leading-snug">
              {!profileGateOk ? (
                <p className="text-amber-900/90">
                  Заполните ФИО и компанию в профиле для подписания.
                </p>
              ) : signerNamePreview.trim() ? (
                <p className="text-text-secondary">
                  <span className="text-text-muted">Подписант:</span>{' '}
                  <span className="text-text-primary font-medium">{signerNamePreview.trim()}</span>
                  {signerOrgPreview.trim() ? (
                    <>
                      <span className="text-text-muted"> / </span>
                      <span className="font-medium text-text-secondary">{signerOrgPreview.trim()}</span>
                    </>
                  ) : (
                    <span className="text-amber-900/85"> (укажите компанию в профиле)</span>
                  )}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-text-muted text-[11px] leading-snug">Нет подписи.</p>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col justify-center gap-2 border-t border-border-subtle/70 pt-3 sm:w-auto sm:min-w-[220px] sm:border-l sm:border-t-0 sm:border-border-subtle/70 sm:pl-4 sm:pt-0">
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex flex-wrap items-center justify-end gap-2">
              {onNotify && !effectiveConfirmed ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-pressed={notifyRowHighlight === true}
                  className={cn(
                    'h-8 shrink-0 gap-1.5 text-[11px] font-medium',
                    notifyRowHighlight &&
                      'border-red-500 bg-red-50 text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.25)] hover:border-red-600 hover:bg-red-100 hover:text-red-900'
                  )}
                  onClick={onNotify}
                >
                  <LucideIcons.Bell className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Уведомить
                </Button>
              ) : null}

              {effectiveConfirmDisabled ? (
                <Tooltip>
                  <TooltipTrigger asChild>{confirmBtn}</TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs leading-snug">
                    {sessionBlocked
                      ? `Подтвердить может только закреплённый в паспорте подписант: ${passportAssigneeName.trim() || '—'}.`
                      : confirmDisabledReason?.trim()
                        ? confirmDisabledReason
                        : !profileGateOk && hasNoSignoffData
                          ? 'Укажите в профиле отображаемое имя (ФИО) и предприятие.'
                          : 'Подтверждение недоступно.'}
                  </TooltipContent>
                </Tooltip>
              ) : (
                confirmBtn
              )}

              {hasActorRecord && revokeVisible ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-destructive h-8 text-xs"
                  onClick={onRevoke}
                >
                  Снять
                </Button>
              ) : null}
            </div>

            {onNotify && !effectiveConfirmed && onSetDeadline ? (
              <div className="flex flex-col items-end gap-1">
                <label className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <span className="shrink-0">Срок</span>
                  <input
                    type="date"
                    className="h-8 rounded border border-border-default bg-transparent px-1.5 text-[10px] text-text-secondary"
                    value={notifyMeta?.dueAt ? notifyMeta.dueAt.substring(0, 10) : ''}
                    onChange={(e) =>
                      onSetDeadline(
                        e.target.value ? new Date(e.target.value).toISOString() : undefined
                      )
                    }
                  />
                </label>
                {notifyMeta?.notifyCount ? (
                  <p className="text-right text-[10px] leading-snug text-text-muted">
                    Напоминаний: {notifyMeta.notifyCount}
                    {notifyMeta.lastNotifiedAt
                      ? ` · ${new Date(notifyMeta.lastNotifiedAt).toLocaleString('ru-RU', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}`
                      : ''}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Пара «бренд + технолог» по вкладке ТЗ: запись в `dossier.sectionSignoffs` и событие `section_signoff` в журнале.
 * Нужна для `fourTzLevelsFullySignedByAll`, handoff и экспорта HTML.
 */
export function Workshop2TzSectionSignoffStrip({
  section,
  brandMeta,
  techMeta,
  sectionFillPct,
  fillPctMin,
  tzWriteDisabled,
  canRevoke,
  onConfirmBrand,
  onConfirmTech,
  onRevokeBrand,
  onRevokeTech,
  onNotifyBrand,
  onNotifyTech,
  notifyHighlightBrand,
  notifyHighlightTech,
  notifyMetaBrand,
  notifyMetaTech,
  onSetDeadlineBrand,
  onSetDeadlineTech,
  className,
  /** Кто закреплён в паспорте для бренда (карточка артикула → «Подписанты»). */
  brandPassportName,
  brandPassportOrg,
  brandPassportMissing,
  /** Кто закреплён в паспорте для технолога. */
  techPassportName,
  techPassportOrg,
  techPassportMissing,
  /** Текущая сессия: в досье при нажатии «Подтвердить» пишутся эти ФИО и организация. */
  signerNamePreview,
  signerOrgPreview,
  profileGateOk,
  sectionGateErrors,
  allowConfirmBrand = true,
  allowConfirmTech = true,
  /** Текущая сессия = закреплённый в паспорте подписант бренда (иначе «Подтвердить» недоступен). */
  sessionSignerMatchesBrand = true,
  /** Текущая сессия = закреплённый технолог. */
  sessionSignerMatchesTech = true,
}: {
  section: Workshop2TzSectionSignoffTabKey;
  brandMeta: Workshop2DossierSignoffMeta | undefined;
  techMeta: Workshop2DossierSignoffMeta | undefined;
  sectionFillPct: number;
  fillPctMin: number;
  tzWriteDisabled: boolean;
  canRevoke: boolean;
  brandPassportName: string;
  brandPassportOrg: string;
  brandPassportMissing: boolean;
  techPassportName: string;
  techPassportOrg: string;
  techPassportMissing: boolean;
  signerNamePreview: string;
  signerOrgPreview: string;
  profileGateOk: boolean;
  /** Реальные ошибки секции (минимум/логика), блокируют confirm даже при достаточном %. */
  sectionGateErrors?: string[];
  /** Режим просмотра досье: в чужой роли кнопка этой стороны неактивна (см. `workshop2DossierViewTzSignoffConfirmSides`). */
  allowConfirmBrand?: boolean;
  allowConfirmTech?: boolean;
  sessionSignerMatchesBrand?: boolean;
  sessionSignerMatchesTech?: boolean;
  onConfirmBrand: () => void;
  onConfirmTech: () => void;
  onRevokeBrand: () => void;
  onRevokeTech: () => void;
  /** Копирование ссылки + журнал: напоминание стороне бренда. */
  onNotifyBrand?: () => void;
  /** Копирование ссылки + журнал: напоминание технологу. */
  onNotifyTech?: () => void;
  notifyHighlightBrand?: boolean;
  notifyHighlightTech?: boolean;
  notifyMetaBrand?: Workshop2SectionSignoffReminder;
  notifyMetaTech?: Workshop2SectionSignoffReminder;
  onSetDeadlineBrand?: (dueAt: string | undefined) => void;
  onSetDeadlineTech?: (dueAt: string | undefined) => void;
  className?: string;
}) {
  const secTitle = SECTION_HEADING[section];
  const requiredSides = workshop2TzSectionSignoffRequiredSides(section);
  const gateOk = sectionFillPct >= fillPctMin;
  const sectionErrors = sectionGateErrors ?? [];
  const sectionErrorsOk = sectionErrors.length === 0;
  /** Порог % и отсутствие ошибок секции — то же условие, что и для активации «Подтвердить». */
  const fillAndRulesOk = gateOk && sectionErrorsOk;
  const blockReason = tzWriteDisabled
    ? 'Нет права production:edit — подтверждение и снятие недоступны.'
    : !gateOk
      ? `Сначала доведите заполнение секции «${secTitle}» до не менее ${fillPctMin}% (сейчас ${sectionFillPct}%).`
      : !sectionErrorsOk
        ? `Исправьте ошибки секции: ${sectionErrors.slice(0, 2).join(' ')}`
      : undefined;
  const confirmDisabled = Boolean(blockReason);
  const brandRowCommitted = workshop2TzSignoffMetaIsCommitted(brandMeta);
  const techRowCommitted = workshop2TzSignoffMetaIsCommitted(techMeta);
  const brandPassportAligned = workshop2TzSectionSignoffMetaPassportAligned(
    brandMeta,
    brandPassportName,
    brandPassportMissing
  );
  const techPassportAligned = workshop2TzSectionSignoffMetaPassportAligned(
    techMeta,
    techPassportName,
    techPassportMissing
  );
  const brandStaleSigned =
    brandRowCommitted && (!gateOk || (!brandPassportAligned && !brandPassportMissing));
  const techStaleSigned = techRowCommitted && (!gateOk || (!techPassportAligned && !techPassportMissing));
  const requiredAuditComplete = requiredSides.every((side) =>
    side === 'brand'
      ? brandRowCommitted && brandPassportAligned
      : techRowCommitted && techPassportAligned
  );
  /** Все требуемые для секции подписи есть, ФИО совпадают с паспортом и порог заполнения выполнен. */
  const bothSigned = requiredAuditComplete && gateOk;
  const primaryStatusTone = bothSigned
    ? 'border-emerald-200/90 bg-emerald-50/80 text-emerald-900'
    : fillAndRulesOk
      ? 'border-emerald-200/90 bg-emerald-50/80 text-emerald-900'
      : 'border-amber-200/90 bg-amber-50/85 text-amber-950';
  const primaryStatusText = bothSigned
    ? 'Секция подписана и готова к следующему шагу.'
    : fillAndRulesOk
      ? requiredSides.length > 1
        ? 'Минимум секции закрыт. Подтвердите секцию с двух сторон.'
        : 'Минимум секции закрыт. Подтвердите секцию.'
      : !gateOk
        ? `Заполните секцию до ${fillPctMin}% (сейчас ${sectionFillPct}%).`
        : 'Исправьте ошибки секции перед подтверждением.';

  const brandViewBlockedReason = !allowConfirmBrand
    ? 'В текущем виде досье подтверждение со стороны бренда недоступно. Переключите вид на «Полный» или «Бренд-дизайнер».'
    : undefined;
  const techViewBlockedReason = !allowConfirmTech
    ? 'В текущем виде досье подтверждение со стороны технолога недоступно. Переключите вид на «Полный» или «Технолог».'
    : undefined;

  return (
    <div
      id={`w2-tz-section-signoff-${section}`}
      data-testid={`w2-tz-section-signoff-${section}`}
      className={cn('border-border-default scroll-mt-24 space-y-3 rounded-xl border bg-bg-surface2/30 p-3 sm:p-4 shadow-sm', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LucideIcons.CheckSquare className="h-5 w-5 text-accent-primary" aria-hidden />
          <h2 className="text-text-primary text-sm sm:text-base font-semibold">Подтверждение: {secTitle}</h2>
        </div>
        <div className={cn('px-2.5 py-1 rounded-full border text-[10px] font-semibold', primaryStatusTone)}>
          {bothSigned ? 'Завершено' : fillAndRulesOk ? 'Ожидает подписи' : 'Требует заполнения'}
        </div>
      </div>
      
      <div className="grid gap-2 sm:grid-cols-2">
        {requiredSides.includes('brand') ? (
          <SignoffSideRow
            title="Бренд (продакт / дизайн)"
            meta={brandMeta}
            fillGateOk={gateOk}
            profileGateOk={profileGateOk}
            passportAssigneeName={brandPassportName}
            passportAssigneeOrg={brandPassportOrg}
            passportAssigneeMissing={brandPassportMissing}
            sessionMayConfirmAsPassportSigner={sessionSignerMatchesBrand}
            signerNamePreview={signerNamePreview}
            signerOrgPreview={signerOrgPreview}
            confirmDisabled={confirmDisabled || brandRowCommitted || !allowConfirmBrand}
            confirmDisabledReason={
              !allowConfirmBrand
                ? brandViewBlockedReason
                : brandRowCommitted
                  ? gateOk
                    ? 'Уже подтверждено брендом.'
                    : `Заполнение ниже ${fillPctMin}% — снимите подпись или дозаполните секцию.`
                  : blockReason
            }
            onNotify={onNotifyBrand}
            notifyRowHighlight={notifyHighlightBrand}
            notifyMeta={notifyMetaBrand}
            onSetDeadline={onSetDeadlineBrand}
            onConfirm={onConfirmBrand}
            onRevoke={onRevokeBrand}
            revokeVisible={canRevoke || brandStaleSigned}
          />
        ) : null}
        {requiredSides.includes('tech') ? (
          <SignoffSideRow
            title="Технолог (производство)"
            meta={techMeta}
            fillGateOk={gateOk}
            profileGateOk={profileGateOk}
            passportAssigneeName={techPassportName}
            passportAssigneeOrg={techPassportOrg}
            passportAssigneeMissing={techPassportMissing}
            sessionMayConfirmAsPassportSigner={sessionSignerMatchesTech}
            signerNamePreview={signerNamePreview}
            signerOrgPreview={signerOrgPreview}
            confirmDisabled={confirmDisabled || techRowCommitted || !allowConfirmTech}
            confirmDisabledReason={
              !allowConfirmTech
                ? techViewBlockedReason
                : techRowCommitted
                  ? gateOk
                    ? 'Уже подтверждено технологом.'
                    : `Заполнение ниже ${fillPctMin}% — снимите подпись или дозаполните секцию.`
                  : blockReason
            }
            onNotify={onNotifyTech}
            notifyRowHighlight={notifyHighlightTech}
            notifyMeta={notifyMetaTech}
            onSetDeadline={onSetDeadlineTech}
            onConfirm={onConfirmTech}
            onRevoke={onRevokeTech}
            revokeVisible={canRevoke || techStaleSigned}
          />
        ) : null}
      </div>
    </div>
  );
}
