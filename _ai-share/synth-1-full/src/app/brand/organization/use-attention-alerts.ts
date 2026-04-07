/**
 * Состояние алертов «Требует внимания».
 * Блок активен когда items.length > 0. При dismiss — удаляем элемент, блок становится неактивным когда пусто.
 * activeSince — время, с которого блок активен (для отображения в углу).
 * historyByBlock — история действий по каждому блоку (появилось, устранено, изменено) + автор.
 * API-интеграция — позже, сейчас локальный state.
 */

import { useState, useCallback, useEffect } from 'react';

export type HistoryEntry = {
  id: string;
  action: 'appeared' | 'dismissed' | 'changed';
  label: string;
  author: string;
  timestamp: number;
};

export type CertificateAlert = { id: string; name: string; daysLeft: number };
export type ProfileAlert = { id: string; name: string; detail: string };
export type TaskAlert = { id: string; title: string; priority: string };

export type AttentionAlertsState = {
  certificates: CertificateAlert[];
  profile: ProfileAlert[];
  tasks: TaskAlert[];
  /** Пусто = системы в норме (зелёный блок). Непусто = сбои. */
  integrationIssues: string[];
};

import { getInitialAlertsState } from './organization-demo-data';

export type BlockId = 'certificates' | 'profile' | 'systems' | 'tasks' | 'approval' | 'contract' | 'confirmation' | 'delivery' | 'lowStock' | 'overduePayment' | 'moderation' | 'dataErrors' | 'syncFail' | 'documents' | 'accessRequests' | 'suspicious' | 'photos' | 'apiKey' | 'integrationUpdate' | 'audit' | 'inactiveUsers' | '2fa';

const BLOCK_LABELS: Record<BlockId, string> = {
  certificates: 'Истекающие сертификаты',
  profile: 'Незаполненные данные',
  systems: 'Системы в норме',
  tasks: 'Задачи без исполнителя',
  approval: 'Ожидает одобрения',
  contract: 'Истекает договор',
  confirmation: 'Ожидает подтверждения',
  delivery: 'Задержка поставки',
  lowStock: 'Низкий остаток',
  overduePayment: 'Просроченный платёж',
  moderation: 'Ожидает модерации',
  dataErrors: 'Ошибки в данных',
  syncFail: 'Сбой синхронизации',
  documents: 'Документы на подпись',
  accessRequests: 'Заявки на доступ',
  suspicious: 'Подозрительная активность',
  photos: 'Обновить фото',
  apiKey: 'Истекает API-ключ',
  integrationUpdate: 'Обновление интеграции',
  audit: 'Проверка аудита',
  inactiveUsers: 'Неактивные пользователи',
  '2fa': 'Двухфакторная аутентификация',
};

/** Форматирует длительность в читаемый вид */
export function formatActiveDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} д`;
  if (h > 0) return `${h} ч`;
  if (min > 0) return `${min} мин`;
  return '<1 мин';
}

let historyId = 0;
function addHistory(
  prev: Record<BlockId, HistoryEntry[]>,
  blockId: BlockId,
  action: HistoryEntry['action'],
  label: string,
  author: string
): Record<BlockId, HistoryEntry[]> {
  const list = prev[blockId] ?? [];
  return {
    ...prev,
    [blockId]: [{ id: `h${++historyId}`, action, label, author, timestamp: Date.now() }, ...list].slice(0, 50),
  };
}

export function useAttentionAlerts() {
  const [alerts, setAlerts] = useState<AttentionAlertsState>(getInitialAlertsState);
  const [activeSince, setActiveSince] = useState<Partial<Record<BlockId, number>>>({});
  const [historyByBlock, setHistoryByBlock] = useState<Record<BlockId, HistoryEntry[]>>(() => {
    const init = getInitialAlertsState();
    const h: Record<BlockId, HistoryEntry[]> = {} as any;
    init.certificates.forEach((c) => {
      if (!h.certificates) h.certificates = [];
      h.certificates.push({ id: `h${++historyId}`, action: 'appeared', label: `Появилось: ${c.name}`, author: 'Система', timestamp: Date.now() - 86400000 * 2 });
    });
    init.profile.forEach((p) => {
      if (!h.profile) h.profile = [];
      h.profile.push({ id: `h${++historyId}`, action: 'appeared', label: `Появилось: ${p.name}`, author: 'Система', timestamp: Date.now() - 86400000 });
    });
    init.tasks.forEach((t) => {
      if (!h.tasks) h.tasks = [];
      h.tasks.push({ id: `h${++historyId}`, action: 'appeared', label: `Появилось: ${t.title}`, author: 'Система', timestamp: Date.now() - 3600000 });
    });
    if (!h.systems) h.systems = [];
    h.systems.push({ id: `h${++historyId}`, action: 'appeared', label: 'Системы в норме', author: 'Система', timestamp: Date.now() - 7200000 });
    return h;
  });

  const isBlockActive = useCallback((id: BlockId) => {
    if (id === 'certificates') return alerts.certificates.length > 0;
    if (id === 'profile') return alerts.profile.length > 0;
    if (id === 'systems') return alerts.integrationIssues.length === 0;
    if (id === 'tasks') return alerts.tasks.length > 0;
    return false;
  }, [alerts]);

  useEffect(() => {
    const now = Date.now();
    const active: BlockId[] = [];
    if (alerts.certificates.length > 0) active.push('certificates');
    if (alerts.profile.length > 0) active.push('profile');
    if (alerts.integrationIssues.length === 0) active.push('systems');
    if (alerts.tasks.length > 0) active.push('tasks');
    setActiveSince((prev) => {
      const next = { ...prev };
      active.forEach((id) => { if (next[id] == null) next[id] = now; });
      (['certificates', 'profile', 'systems', 'tasks'] as BlockId[]).forEach((id) => {
        if (!active.includes(id)) delete next[id];
      });
      return next;
    });
  }, [alerts.certificates.length, alerts.profile.length, alerts.tasks.length, alerts.integrationIssues.length]);

  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const dismissCertificate = useCallback((id: string) => {
    const cert = alerts.certificates.find((c) => c.id === id);
    setHistoryByBlock((prev) => addHistory(prev, 'certificates', 'dismissed', `Устранено: ${cert?.name ?? id}`, 'Вы'));
    setAlerts((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id),
    }));
  }, [alerts.certificates]);

  const dismissProfile = useCallback((id: string) => {
    const p = alerts.profile.find((x) => x.id === id);
    setHistoryByBlock((prev) => addHistory(prev, 'profile', 'dismissed', `Устранено: ${p?.name ?? id}`, 'Вы'));
    setAlerts((prev) => ({
      ...prev,
      profile: prev.profile.filter((p) => p.id !== id),
    }));
  }, [alerts.profile]);

  const dismissTask = useCallback((id: string) => {
    const t = alerts.tasks.find((x) => x.id === id);
    setHistoryByBlock((prev) => addHistory(prev, 'tasks', 'dismissed', `Устранено: ${t?.title ?? id}`, 'Вы'));
    setAlerts((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, [alerts.tasks]);

  const getActiveDuration = useCallback((id: BlockId) => {
    const since = activeSince[id];
    if (since == null) return null;
    return formatActiveDuration(Date.now() - since);
  }, [activeSince]);

  const getHistory = useCallback((blockId: BlockId) => historyByBlock[blockId] ?? [], [historyByBlock]);
  const getBlockLabel = useCallback((blockId: BlockId) => BLOCK_LABELS[blockId] ?? blockId, []);

  return {
    alerts,
    activeSince,
    historyByBlock,
    getHistory,
    getBlockLabel,
    getActiveDuration,
    isBlockActive,
    dismissCertificate,
    dismissProfile,
    dismissTask,
  };
}
