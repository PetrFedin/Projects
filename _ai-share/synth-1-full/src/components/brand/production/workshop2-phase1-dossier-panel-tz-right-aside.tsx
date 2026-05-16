'use client';

import type { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { WorkshopTzDigitalSignoffRow } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-digital-signoff-row';
import { renderHandbookCheckReportBlock } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-report';
import type { HandbookCheckSnapshot } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import { SECTION_LABEL_BY_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { canRevokeTzSignoff } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import { ROUTES } from '@/lib/routes';
import type { Workshop2DossierSignoffMeta } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2TzAsideDigitalSignoffRowVm = {
  rowKey: string;
  title: string;
  passportAssigneeName?: string;
  passportAssigneeOrgLabel?: string;
  assigneeForNotify?: string;
  canSign: boolean;
  hasRoleCapability: boolean;
  signatoryMismatchHint?: string;
  signoff?: Workshop2DossierSignoffMeta;
  signBlockHint?: string;
};

export function Workshop2DossierTzRightAsidePanel({
  hideTzGlobalRoleSignoffBlock,
  allTzDigitalSignoffsDone,
  activeSectionSignGateMeets,
  tzDigitalSignoffRows,
  tzDigitalSignoffRowsGated,
  tzSignoffBlockHint,
  notifyResponsibleForTzRow,
  tzNotifyHighlightRowKey,
  updatedByLabel,
  tzRevokersEffective,
  signTzDigitalRow,
  revokeTzDigitalRow,
  handbookCheckSnapshot,
  handbookCheckReportExpanded,
  setHandbookCheckReportExpanded,
}: {
  hideTzGlobalRoleSignoffBlock: boolean;
  allTzDigitalSignoffsDone: boolean;
  activeSectionSignGateMeets: boolean;
  tzDigitalSignoffRows: readonly Workshop2TzAsideDigitalSignoffRowVm[];
  tzDigitalSignoffRowsGated: readonly Workshop2TzAsideDigitalSignoffRowVm[];
  tzSignoffBlockHint: string;
  notifyResponsibleForTzRow: (rowKey: string, roleTitle: string, assignee?: string) => void;
  tzNotifyHighlightRowKey: string | null;
  updatedByLabel: string;
  tzRevokersEffective: readonly string[];
  signTzDigitalRow: (rowKey: string, title: string) => void;
  revokeTzDigitalRow: (rowKey: string, title: string) => void;
  handbookCheckSnapshot: HandbookCheckSnapshot | null;
  handbookCheckReportExpanded: boolean;
  setHandbookCheckReportExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <aside className="space-y-4 self-start xl:sticky xl:top-4">
      <div className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm">
        {!hideTzGlobalRoleSignoffBlock ? (
          <div id="w2-tz-digital-signoffs" className="scroll-mt-24 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.BadgeCheck className="h-4 w-4 shrink-0" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <h2 className="text-text-primary text-base font-semibold">Подтверждения ТЗ</h2>
                <p className="text-text-secondary text-xs leading-snug">
                  Цифровые подписи ролей (дизайнер, технолог, менеджер и доп. строки из паспорта). Снять
                  подпись могут только руководители из списка отзыва. Нужно право{' '}
                  <code className="text-[10px]">production:edit</code> (
                  <Link
                    href={ROUTES.brand.teamPermissions}
                    className="text-accent-primary font-medium underline"
                  >
                    Команда → права доступа
                  </Link>
                  ).
                </p>
              </div>
            </div>
            {!allTzDigitalSignoffsDone && !activeSectionSignGateMeets && tzDigitalSignoffRows.length > 0 ? (
              <p
                className="rounded-md border border-amber-200/90 bg-amber-50/80 px-2.5 py-1.5 text-[10px] font-medium leading-snug text-amber-950"
                role="status"
              >
                {tzSignoffBlockHint}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {tzDigitalSignoffRows.length === 0 ? (
                <p className="border-border-subtle bg-bg-surface2/60 text-text-secondary col-span-full rounded-md border px-3 py-2 text-[11px] sm:col-span-2">
                  В паспорте нет участников на этапе «ТЗ»: отметьте этап у ролей и закрепите исполнителей в
                  «Ответственные за подпись ТЗ».
                </p>
              ) : (
                tzDigitalSignoffRowsGated.map((row) => (
                  <WorkshopTzDigitalSignoffRow
                    key={row.rowKey}
                    title={row.title}
                    passportAssigneeName={row.passportAssigneeName}
                    passportAssigneeOrgLabel={row.passportAssigneeOrgLabel}
                    canSign={row.canSign}
                    hasRoleCapability={row.hasRoleCapability}
                    signatoryMismatchHint={row.signatoryMismatchHint}
                    signBlockHint={row.signBlockHint}
                    signoff={row.signoff}
                    showNotifyResponsible={!row.signoff && !allTzDigitalSignoffsDone}
                    onNotifyResponsible={() =>
                      notifyResponsibleForTzRow(row.rowKey, row.title, row.assigneeForNotify)
                    }
                    notifyResponsibleHighlighted={tzNotifyHighlightRowKey === row.rowKey}
                    canRevoke={canRevokeTzSignoff(updatedByLabel, [...tzRevokersEffective])}
                    onSign={() => signTzDigitalRow(row.rowKey, row.title)}
                    onRevoke={() => revokeTzDigitalRow(row.rowKey, row.title)}
                  />
                ))
              )}
            </div>
          </div>
        ) : null}
        {handbookCheckSnapshot
          ? renderHandbookCheckReportBlock(
              handbookCheckSnapshot,
              {
                expanded: handbookCheckReportExpanded,
                onToggleExpanded: () => setHandbookCheckReportExpanded((v) => !v),
              },
              SECTION_LABEL_BY_ID
            )
          : null}
      </div>
    </aside>
  );
}
