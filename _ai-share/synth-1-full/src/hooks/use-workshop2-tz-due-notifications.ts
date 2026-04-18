'use client';

import { useEffect } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshopTzSignoffRequiredForRole } from '@/lib/production/workshop2-tz-signatory-options';
import { calculateDossierReadiness } from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

function ymdTodayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfLocalDay(isoYmd: string): Date | null {
  const t = isoYmd?.trim();
  if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [y, m, d] = t.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

function dayDiffTodayVsDue(dueYmd: string): number | null {
  const due = startOfLocalDay(dueYmd);
  if (!due) return null;
  const today = startOfLocalDay(ymdTodayLocal());
  if (!today) return null;
  return Math.round((today.getTime() - due.getTime()) / 86_400_000);
}

const SESSION_KEY_PREFIX = 'synth.w2.tzDuePush';

type RoleKey = 'designer' | 'technologist' | 'manager';

const ROLE_RU: Record<RoleKey, string> = {
  designer: 'Дизайн',
  technologist: 'Технолог',
  manager: 'Менеджер',
};

/**
 * Локальные push-уведомления браузера по `passportProductionBrief.tzRoleResponseDue`,
 * если подпись по роли ещё нужна и разрешение Notification = granted.
 * Не чаще одного срабатывания на роль+дата+день сессии (sessionStorage).
 */
export function useWorkshop2TzDueNotifications(opts: {
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | null;
  collectionId: string;
  articleId: string;
  articleSku?: string;
}): void {
  const { dossier, leaf, collectionId, articleId, articleSku } = opts;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !dossier || !leaf) return;
    if (Notification.permission !== 'granted') return;

    const run = () => {
      const due = dossier.passportProductionBrief?.tzRoleResponseDue;
      if (!due) return;
      const tzB = dossier.tzSignatoryBindings;
      const reqD = workshopTzSignoffRequiredForRole(tzB, 'designer');
      const reqT = workshopTzSignoffRequiredForRole(tzB, 'technologist');
      const reqM = workshopTzSignoffRequiredForRole(tzB, 'manager');
      const readiness = calculateDossierReadiness(dossier, leaf);
      const visualNote = readiness.summary.readyForSample
        ? ''
        : ' Визуал / ТЗ ещё не закрыт по чеклисту.';

      const tryRole = (
        role: RoleKey,
        iso: string | undefined,
        required: boolean,
        signed: boolean
      ) => {
        if (!iso?.trim() || !required || signed) return;
        const diff = dayDiffTodayVsDue(iso);
        if (diff === null) return;
        if (diff < -1) return;
        const day = ymdTodayLocal();
        const sessionKey = `${SESSION_KEY_PREFIX}:${collectionId}:${articleId}:${role}:${iso}:${day}`;
        try {
          if (sessionStorage.getItem(sessionKey)) return;
        } catch {
          return;
        }
        const sku = (articleSku ?? '').trim() || 'SKU';
        let body: string;
        if (diff > 0) {
          body = `${sku}: срок ответа (${iso}) для «${ROLE_RU[role]}» просрочен на ${diff} дн.${visualNote}`;
        } else if (diff === 0) {
          body = `${sku}: сегодня срок ответа (${iso}) для «${ROLE_RU[role]}».${visualNote}`;
        } else {
          body = `${sku}: завтра срок ответа (${iso}) для «${ROLE_RU[role]}».${visualNote}`;
        }
        try {
          new Notification(`ТЗ · SLA · ${ROLE_RU[role]}`, {
            body: body.trim(),
            tag: `${collectionId}:${articleId}:${role}:${iso}`,
          });
          sessionStorage.setItem(sessionKey, '1');
        } catch {
          /* ignore */
        }
      };

      tryRole('designer', due.designer, reqD, Boolean(dossier.isVerifiedByDesigner));
      tryRole('technologist', due.technologist, reqT, Boolean(dossier.isVerifiedByTechnologist));
      tryRole('manager', due.manager, reqM, Boolean(dossier.isVerifiedByManager));
    };

    run();
    const id = window.setInterval(run, 120_000);
    const onVis = () => {
      if (document.visibilityState === 'visible') run();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [articleId, articleSku, collectionId, dossier, leaf]);
}
