import type { Dispatch, SetStateAction } from 'react';
import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { WORKSHOP2_ARTICLE_PANE_PARAM } from '@/lib/production/workshop2-url';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type Workshop2TzNotifyClipboardDeps = {
  setTzNotifyHighlightRowKey: Dispatch<SetStateAction<string | null>>;
  toast: ToastFn;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  persist: (d: Workshop2DossierPhase1) => void;
  updatedByLabel: string;
};

function resolveArticleUrlWithTzPane(): string {
  let url = typeof window !== 'undefined' ? window.location.href : '';
  if (url) {
    try {
      const u = new URL(url);
      if (!u.searchParams.get(WORKSHOP2_ARTICLE_PANE_PARAM)) {
        u.searchParams.set(WORKSHOP2_ARTICLE_PANE_PARAM, 'tz');
      }
      url = u.toString();
    } catch {
      /* keep raw href */
    }
  }
  return url;
}

/** Запрос подписи по строке ТЗ: подсветка, копирование ссылки, запись в журнал. */
export function notifyResponsibleForTzRowAction(
  deps: Workshop2TzNotifyClipboardDeps,
  rowKey: string,
  roleTitle: string,
  assignee?: string
): void {
  const { setTzNotifyHighlightRowKey, toast, setDossier, updatedByLabel } = deps;
  setTzNotifyHighlightRowKey(rowKey);
  const url = resolveArticleUrlWithTzPane();
  const who = assignee?.trim() ? `${roleTitle} → ${assignee.trim()}` : roleTitle;
  void (async () => {
    try {
      if (url) await navigator.clipboard.writeText(url);
      toast({
        title: url ? 'Ссылка скопирована' : 'Запрос зафиксирован',
        description: url
          ? `Передайте ссылку ответственному: ${who}. Push — после подключения API.`
          : 'Запись добавлена в журнал; передайте ссылку на ТЗ вручную.',
      });
    } catch {
      toast({
        title: 'Не удалось скопировать',
        description: url || 'Скопируйте адрес страницы вручную.',
        variant: 'destructive',
      });
    }
    setDossier((prev: Workshop2DossierPhase1) => {
      const next = pushTzActionLog(prev, updatedByLabel.slice(0, 200), {
        type: 'dossier_edit',
        summaries: [
          `Запрос подписи ТЗ: ${who}. ${url ? `Ссылка: ${url}` : 'URL недоступен в среде.'}`,
        ],
      });
      deps.persist(next);
      return next;
    });
  })();
}

/** Напоминание стейкхолдерам по подтверждению секции ТЗ. */
export function notifyStakeholdersForSectionSignoffAction(
  deps: Workshop2TzNotifyClipboardDeps,
  section: 'general' | 'visuals' | 'material' | 'construction',
  sectionTitle: string,
  side?: 'brand' | 'tech'
): void {
  const { setTzNotifyHighlightRowKey, toast, setDossier, updatedByLabel } = deps;
  setTzNotifyHighlightRowKey(side ? `section:${section}:${side}` : `section:${section}`);
  const url = resolveArticleUrlWithTzPane();
  const who =
    side === 'brand'
      ? 'бренд (продакт / дизайн)'
      : side === 'tech'
        ? 'технолог'
        : 'бренд и технолог';
  const summary =
    side != null
      ? `Секция «${sectionTitle}»: ждём подтверждение — ${who}`
      : `Секция «${sectionTitle}»: нужны пары подписей бренд + технолог`;
  void (async () => {
    try {
      if (url) await navigator.clipboard.writeText(url);

      // Simulate real API notification
      const res = await fetch('/api/brand/workshop2/phase1-dossier/notifications/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          side,
          url,
          message: summary,
        }),
      });

      if (!res.ok) throw new Error('Failed to send notification via API');

      const data = (await res.json()) as { delivered?: boolean };

      toast({
        title: url
          ? data.delivered
            ? 'Уведомление отправлено на email'
            : 'Запрос зафиксирован'
          : 'Запрос зафиксирован',
        description: url
          ? data.delivered
            ? `${summary}. Адресат получит email/push со ссылкой.`
            : `${summary}. Email не настроен, передайте ссылку вручную.`
          : 'Запись в журнале; передайте ссылку вручную.',
      });
    } catch {
      toast({
        title: 'Зафиксировано локально',
        description: url
          ? 'Ссылка скопирована, но отправка email не удалась.'
          : 'Скопируйте адрес страницы вручную.',
        variant: 'destructive',
      });
    }
    const notifiedAt = new Date().toISOString();
    setDossier((prev: Workshop2DossierPhase1) => {
      const next = pushTzActionLog(
        {
          ...prev,
          sectionSignoffReminders: {
            ...(prev.sectionSignoffReminders ?? {}),
            [section]: {
              ...(prev.sectionSignoffReminders?.[section] ?? {}),
              ...(side === 'brand' || side == null
                ? {
                    brand: {
                      ...(prev.sectionSignoffReminders?.[section]?.brand ?? {}),
                      lastNotifiedAt: notifiedAt,
                      notifyCount:
                        (prev.sectionSignoffReminders?.[section]?.brand?.notifyCount ?? 0) + 1,
                    },
                  }
                : {}),
              ...(side === 'tech' || side == null
                ? {
                    tech: {
                      ...(prev.sectionSignoffReminders?.[section]?.tech ?? {}),
                      lastNotifiedAt: notifiedAt,
                      notifyCount:
                        (prev.sectionSignoffReminders?.[section]?.tech?.notifyCount ?? 0) + 1,
                    },
                  }
                : {}),
            },
          },
        },
        updatedByLabel.slice(0, 200),
        {
          type: 'dossier_edit',
          summaries: [
            side != null
              ? `Напоминание о подтверждении секции ТЗ (${who}): ${sectionTitle}. ${
                  url ? `Ссылка: ${url}` : 'URL недоступен в среде.'
                }`
              : `Запрос подтверждений секции ТЗ: ${sectionTitle}. ${
                  url ? `Ссылка: ${url}` : 'URL недоступен в среде.'
                }`,
          ],
        }
      );
      deps.persist(next);
      return next;
    });
  })();
}

export function updateSignoffDeadlineAction(
  deps: Pick<Workshop2TzNotifyClipboardDeps, 'setDossier' | 'persist' | 'updatedByLabel'>,
  section: 'general' | 'visuals' | 'material' | 'construction',
  side: 'brand' | 'tech',
  dueAt: string | undefined
): void {
  const { setDossier, persist, updatedByLabel } = deps;
  setDossier((prev: Workshop2DossierPhase1) => {
    const next = pushTzActionLog(
      {
        ...prev,
        sectionSignoffReminders: {
          ...(prev.sectionSignoffReminders ?? {}),
          [section]: {
            ...(prev.sectionSignoffReminders?.[section] ?? {}),
            [side]: {
              ...(prev.sectionSignoffReminders?.[section]?.[side] ?? {}),
              dueAt,
            },
          },
        },
      },
      updatedByLabel.slice(0, 200),
      {
        type: 'dossier_edit',
        summaries: [
          `Изменён дедлайн подписания секции ${section} (${side}): ${dueAt || 'сброшен'}`,
        ],
      }
    );
    persist(next);
    return next;
  });
}
