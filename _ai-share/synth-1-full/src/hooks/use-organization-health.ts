'use client';

import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { fastApiService } from '@/lib/fastapi-service';
import type {
  HealthMetric,
  OrgHubDashboardSnapshot,
  OrgHubIntegrationsSnapshot,
  OrgOverviewProfileView,
} from '@/lib/brand/organization-types';
import { BRAND_ID, HEALTH_OK, HEALTH_WARNING } from '@/app/brand/organization/organization-config';
import { ensureErrorFromUnknown } from '@/lib/unknown-error-message';

/** Не дёргать health/brand слишком часто при повторном монтировании вкладки (меньше сети и токенов). */
const HEALTH_BUNDLE_STALE_MS = 120_000;

function toOrgProfileView(value: unknown): OrgOverviewProfileView | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as OrgOverviewProfileView;
}

function toDashboardSnapshot(value: unknown): OrgHubDashboardSnapshot | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as OrgHubDashboardSnapshot;
}

function toIntegrationsSnapshot(value: unknown): OrgHubIntegrationsSnapshot | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as OrgHubIntegrationsSnapshot;
}

function computeProfileCompleteness(profile: OrgOverviewProfileView | null): {
  score: number;
  checklist: string[];
  missing?: string[];
  tips?: string;
} {
  if (!profile || typeof profile !== 'object')
    return { score: 0, checklist: ['Нет данных профиля'], tips: 'Загрузите профиль бренда' };
  const brand = profile.brand || {};
  const legal = profile.legal || {};
  const contacts = profile.contacts || {};
  const dna = profile.dna || {};
  const filled: string[] = [];
  if (brand.name) filled.push('Название бренда');
  if (legal.inn) filled.push('ИНН');
  if (legal.legal_name) filled.push('Юр. наименование');
  if (Object.keys(contacts).length > 0) filled.push('Контакты');
  if (Object.keys(dna).length > 0) filled.push('Brand DNA');
  const total = 5;
  const score = Math.round((filled.length / total) * 100);
  const missing = [];
  if (!brand.name) missing.push('Название');
  if (!legal.inn) missing.push('ИНН');
  if (!legal.legal_name) missing.push('Юр. наименование');
  if (Object.keys(contacts).length === 0) missing.push('Контакты');
  if (Object.keys(dna).length === 0) missing.push('Brand DNA');
  return {
    score: Math.min(score, 100),
    checklist: filled.length ? filled : ['Заполните профиль'],
    missing: missing.length ? missing : undefined,
    tips: missing.length ? `Добавьте: ${missing.join(', ')}` : undefined,
  };
}

function integrationEntryStatus(v: unknown): string | undefined {
  if (v == null || typeof v !== 'object') return undefined;
  const s = (v as { status?: unknown }).status;
  return typeof s === 'string' ? s : undefined;
}

function computeIntegrationsHealth(integrations: OrgHubIntegrationsSnapshot | null): {
  score: number;
  checklist: string[];
  missing?: string[];
  tips?: string;
} {
  if (!integrations || typeof integrations !== 'object')
    return {
      score: 50,
      checklist: ['Статус интеграций неизвестен'],
      tips: 'Проверьте раздел Интеграции',
    };
  const entries = Object.entries(integrations);
  const total = entries.length || 1;
  const ok = entries.filter(([, v]) => integrationEntryStatus(v) === 'ok').length;
  const score = Math.round((ok / total) * 100);
  const list = entries.map(([k, v]) => {
    const st = integrationEntryStatus(v);
    return `${k}: ${st === 'ok' ? 'активна' : st || 'ошибка'}`;
  });
  const errors = entries.filter(([, v]) => integrationEntryStatus(v) !== 'ok');
  const missing = errors.length ? errors.map(([k]) => k) : undefined;
  return {
    score: Math.min(score, 100),
    checklist: list.length ? list : ['Нет подключённых интеграций'],
    missing,
    tips: errors.length ? `Исправьте: ${errors.map(([k]) => k).join(', ')}` : undefined,
  };
}

function computeMarkingHealth(dashboard: OrgHubDashboardSnapshot | null): {
  score: number;
  checklist: string[];
} {
  if (!dashboard) return { score: 70, checklist: ['Статус маркировки неизвестен'] };
  const status = dashboard.markingSyncStatus;
  const score = status === 'ok' ? 94 : status === 'error' ? 50 : 75;
  const lastSync = dashboard.markingLastSync;
  return {
    score,
    checklist: [
      status === 'ok' ? 'ЭДО активна' : 'Проверьте ЭДО',
      lastSync != null && lastSync !== '' ? `Синхр: ${String(lastSync)}` : 'Синхронизация КИЗ',
    ],
  };
}

/** Сигналы из того же dashboard, что и хаб (маркировка, inventory sync). */
function computeSecurityFromDashboard(dashboard: unknown): { score: number; checklist: string[] } {
  if (!dashboard || typeof dashboard !== 'object') {
    return { score: 62, checklist: ['Нет дашборда для сигналов риска'] };
  }
  const d = dashboard as Record<string, unknown>;
  const invFail = Number(d.inventorySyncFailed30d) || 0;
  const mark = d.markingSyncStatus;
  let score = 88;
  const checklist: string[] = ['Отдельный аудит 2FA/API вне этого снимка'];
  if (mark === 'error') {
    score -= 28;
    checklist.push('Маркировка: ошибка');
  } else if (mark === 'warning') {
    score -= 12;
    checklist.push('Маркировка: требует внимания');
  }
  if (invFail > 0) {
    score -= Math.min(35, 7 * Math.min(invFail, 5));
    checklist.push(`Сбоев синхронизации остатков (30д): ${invFail}`);
  }
  score = Math.max(38, Math.min(100, Math.round(score)));
  return { score, checklist };
}

/** Прокси «настройки» до модели org settings — по юр. блоку профиля. */
function computeSettingsFromProfile(profile: unknown): { score: number; checklist: string[] } {
  if (!profile || typeof profile !== 'object') {
    return { score: 52, checklist: ['Нет профиля'] };
  }
  const legal = ((profile as Record<string, unknown>).legal as Record<string, unknown>) || {};
  const hasInn = Boolean(legal.inn);
  const hasLegalName = Boolean(legal.legal_name);
  let score = 52 + (hasInn ? 18 : 0) + (hasLegalName ? 18 : 0);
  score = Math.min(95, score);
  const checklist: string[] = [];
  if (hasInn) checklist.push('ИНН указан');
  if (hasLegalName) checklist.push('Юр. наименование указано');
  if (!checklist.length) checklist.push('Заполните юр. блок в профиле');
  return { score, checklist };
}

function formatDate(d: Date) {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function unwrapGenericPayload(val: unknown): unknown {
  if (val == null || typeof val !== 'object') return val;
  if ('data' in val && (val as { data: unknown }).data !== undefined) {
    return (val as { data: unknown }).data;
  }
  return val;
}

function isOrganizationHealthBundle(
  payload: unknown
): payload is {
  metrics: unknown[];
  profile?: unknown;
  dashboard?: unknown;
  integrations?: unknown;
} {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    Array.isArray((payload as { metrics?: unknown }).metrics)
  );
}

export type UseOrganizationHealthResult = {
  metrics: HealthMetric[];
  overallHealth: number;
  lastCheck: string;
  isLoading: boolean;
  error: Error | null;
  partialLoadWarning: string | null;
  refetch: () => void;
  profile: OrgOverviewProfileView | null;
  dashboard: OrgHubDashboardSnapshot | null;
  integrations: OrgHubIntegrationsSnapshot | null;
  organizationPresence: {
    participantsCount?: number;
    onlineCount?: number;
  };
};

/**
 * Хук: Индекс здоровья организации на основе реальных данных профиля.
 * Сначала один запрос health (bundle: метрики + profile/dashboard/integrations); при старом бэкенде или сбое — отдельные GET и расчёт на клиенте.
 */
export function useOrganizationHealth(): UseOrganizationHealthResult {
  const { user } = useAuth();
  const [apiHealthData, setApiHealthData] = useState<unknown>(null);
  const [profile, setProfile] = useState<OrgOverviewProfileView | null>(null);
  const [dashboard, setDashboard] = useState<OrgHubDashboardSnapshot | null>(null);
  const [integrations, setIntegrations] = useState<OrgHubIntegrationsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [partialLoadWarning, setPartialLoadWarning] = useState<string | null>(null);

  const healthCacheRef = useRef<{
    at: number;
    apiHealthData: unknown;
    profile: OrgOverviewProfileView | null;
    dashboard: OrgHubDashboardSnapshot | null;
    integrations: OrgHubIntegrationsSnapshot | null;
    partialLoadWarning: string | null;
    error: Error | null;
  } | null>(null);

  const fetchData = useCallback(async (opts?: { force?: boolean }) => {
    const force = Boolean(opts?.force);
    const cached = healthCacheRef.current;
    if (
      !force &&
      cached &&
      Date.now() - cached.at < HEALTH_BUNDLE_STALE_MS &&
      (cached.profile != null || cached.dashboard != null || cached.integrations != null)
    ) {
      setApiHealthData(cached.apiHealthData);
      setProfile(cached.profile);
      setDashboard(cached.dashboard);
      setIntegrations(cached.integrations);
      setPartialLoadWarning(cached.partialLoadWarning);
      setError(cached.error);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let apiRaw: unknown = null;
      try {
        apiRaw = await fastApiService.getOrganizationHealth(BRAND_ID);
      } catch {
        apiRaw = null;
      }

      const payload = unwrapGenericPayload(apiRaw);
      if (
        isOrganizationHealthBundle(payload) &&
        payload.metrics.length > 0
      ) {
        setApiHealthData(apiRaw);
        setProfile(toOrgProfileView(payload.profile ?? null));
        setDashboard(toDashboardSnapshot(payload.dashboard ?? null));
        setIntegrations(toIntegrationsSnapshot(payload.integrations ?? null));
        setPartialLoadWarning(null);
        setError(null);
        healthCacheRef.current = {
          at: Date.now(),
          apiHealthData: apiRaw,
          profile: toOrgProfileView(payload.profile ?? null),
          dashboard: toDashboardSnapshot(payload.dashboard ?? null),
          integrations: toIntegrationsSnapshot(payload.integrations ?? null),
          partialLoadWarning: null,
          error: null,
        };
        return;
      }

      const [profileRes, dashboardRes, integrationsRes] = await Promise.allSettled([
        fastApiService.getBrandProfile(BRAND_ID),
        fastApiService.getBrandDashboard(BRAND_ID),
        fastApiService.getIntegrationsStatus(BRAND_ID),
      ]);
      const warnParts: string[] = [];
      if (dashboardRes.status === 'rejected') warnParts.push('дашборд');
      if (integrationsRes.status === 'rejected') warnParts.push('интеграции');
      const partialWarn =
        profileRes.status === 'fulfilled' && warnParts.length > 0
          ? `Не удалось загрузить: ${warnParts.join(', ')}. Данные могут быть неполными.`
          : null;
      const loadErr =
        profileRes.status === 'rejected'
          ? ensureErrorFromUnknown(profileRes.reason, 'Не удалось загрузить профиль')
          : null;

      if (profileRes.status === 'rejected') {
        setError(loadErr);
        setPartialLoadWarning(null);
      } else {
        setError(null);
        setPartialLoadWarning(partialWarn);
      }
      setApiHealthData(apiRaw);
      const p =
        profileRes.status === 'fulfilled'
          ? toOrgProfileView(unwrapGenericPayload(profileRes.value))
          : null;
      const d =
        dashboardRes.status === 'fulfilled'
          ? toDashboardSnapshot(unwrapGenericPayload(dashboardRes.value))
          : null;
      const i =
        integrationsRes.status === 'fulfilled'
          ? toIntegrationsSnapshot(unwrapGenericPayload(integrationsRes.value))
          : null;
      setProfile(p);
      setDashboard(d);
      setIntegrations(i);
      healthCacheRef.current = {
        at: Date.now(),
        apiHealthData: apiRaw,
        profile: p,
        dashboard: d,
        integrations: i,
        partialLoadWarning: profileRes.status === 'rejected' ? null : partialWarn,
        error: loadErr,
      };
    } catch (e) {
      const err = ensureErrorFromUnknown(e, 'Не удалось загрузить данные');
      setError(err);
      setPartialLoadWarning(null);
      healthCacheRef.current = {
        at: Date.now(),
        apiHealthData: null,
        profile: null,
        dashboard: null,
        integrations: null,
        partialLoadWarning: null,
        error: err,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const metrics = useMemo((): HealthMetric[] => {
    const lastCheck = formatDate(new Date());
    const api =
      apiHealthData != null && typeof apiHealthData === 'object'
        ? unwrapGenericPayload(apiHealthData)
        : null;

    // Backend v2: { data: { metrics, profile, dashboard, integrations } }
    if (
      api &&
      typeof api === 'object' &&
      !Array.isArray(api) &&
      Array.isArray((api as { metrics?: unknown }).metrics) &&
      ((api as { metrics: unknown[] }).metrics.length ?? 0) > 0
    ) {
      return (api as { metrics: HealthMetric[] }).metrics.map((m) =>
        m.scoreSource != null ? m : { ...m, scoreSource: 'data' as const }
      );
    }

    // Старый контракт: { data: HealthMetric[] }
    if (Array.isArray(api) && api.length > 0) {
      return (api as HealthMetric[]).map((m) =>
        m.scoreSource != null ? m : { ...m, scoreSource: 'data' as const }
      );
    }

    const profileHealth = computeProfileCompleteness(profile);
    const integrationsHealth = computeIntegrationsHealth(integrations);
    const markingHealth = computeMarkingHealth(dashboard);

    const docPendingSig = Number(dashboard?.['documentsPendingSignature']) || 0;

    const teamCount = user?.team?.length ?? 0;
    const teamScore = teamCount >= 5 ? 90 : teamCount >= 2 ? 75 : teamCount >= 1 ? 60 : 40;

    const statusFrom = (s: number) =>
      (s >= HEALTH_OK ? 'ok' : s >= HEALTH_WARNING ? 'warning' : 'critical') as
        | 'ok'
        | 'warning'
        | 'critical';
    const colorFrom = (s: number) =>
      s >= HEALTH_OK ? 'bg-emerald-500' : s >= HEALTH_WARNING ? 'bg-amber-500' : 'bg-rose-500';

    const securityFromDash = computeSecurityFromDashboard(dashboard);
    const settingsFromProfile = computeSettingsFromProfile(profile);
    const openB2b = Number(dashboard?.['openB2bOrders']) || 0;
    let docsScore = 88;
    if (docPendingSig > 0) {
      docsScore = Math.max(42, 88 - Math.min(40, 15 * Math.min(docPendingSig, 3)));
    }
    if (openB2b > 8) docsScore -= Math.min(22, Math.floor(openB2b / 4));
    docsScore = Math.max(35, Math.min(100, docsScore));
    const docsStatus = statusFrom(docsScore);

    return [
      {
        label: 'Полнота профиля',
        score: profileHealth.score,
        color: colorFrom(profileHealth.score),
        desc: profileHealth.score >= 80 ? 'Заполнены ключевые поля' : 'Заполните обязательные поля',
        href: '/brand',
        trend: 0,
        status: statusFrom(profileHealth.score),
        scoreSource: 'data',
        details: {
          lastCheck,
          checklist: profileHealth.checklist,
          missing: profileHealth.missing,
          tips: profileHealth.tips,
        },
      },
      {
        label: 'Безопасность',
        score: securityFromDash.score,
        color: colorFrom(securityFromDash.score),
        desc: 'По сигналам дашборда (маркировка, синхр. остатков)',
        href: '/brand/security',
        trend: 0,
        status: statusFrom(securityFromDash.score),
        scoreSource: 'data',
        details: { lastCheck, checklist: securityFromDash.checklist },
      },
      {
        label: 'Активность команды',
        score: teamScore,
        color: colorFrom(teamScore),
        desc: teamCount ? `${teamCount} участников` : 'Добавьте участников',
        href: '/brand/team',
        trend: 0,
        status: statusFrom(teamScore),
        scoreSource: 'data',
        details: {
          lastCheck,
          checklist: teamCount ? [`${teamCount} в команде`] : [],
          missing: teamCount ? undefined : ['Добавьте участников в раздел Команда'],
        },
      },
      {
        label: 'Интеграции',
        score: integrationsHealth.score,
        color: colorFrom(integrationsHealth.score),
        desc: integrations
          ? `${integrationsHealth.checklist.filter((c) => c.includes('активна')).length} активных`
          : 'Проверьте статус',
        href: '/brand/integrations',
        trend: 0,
        status: statusFrom(integrationsHealth.score),
        scoreSource: 'data',
        details: {
          lastCheck,
          checklist: integrationsHealth.checklist,
          missing: integrationsHealth.missing,
          tips: integrationsHealth.tips,
        },
      },
      {
        label: 'ЭДО и маркировка',
        score: markingHealth.score,
        color: colorFrom(markingHealth.score),
        desc:
          dashboard?.['markingSyncStatus'] === 'ok'
            ? 'Честный ЗНАК, ЭДО'
            : 'Проверьте маркировку',
        href: '/brand/compliance',
        trend: 0,
        status: statusFrom(markingHealth.score),
        scoreSource: 'data',
        details: { lastCheck, checklist: markingHealth.checklist },
      },
      {
        label: 'Подписка',
        score: 70,
        color: 'bg-amber-500',
        desc: 'Нет данных плана в API',
        href: '/brand/subscription',
        trend: 0,
        status: 'warning',
        scoreSource: 'placeholder',
        details: {
          lastCheck,
          checklist: ['Тариф не подключён к health bundle'],
          tips: 'См. раздел Подписка',
        },
      },
      {
        label: 'Документы',
        score: docsScore,
        color: colorFrom(docsScore),
        desc: 'ЭДО и открытые B2B',
        href: '/brand/documents',
        trend: 0,
        status: docsStatus,
        scoreSource: 'data',
        details: {
          lastCheck,
          checklist: [
            docPendingSig ? `На подписи: ${docPendingSig}` : 'Нет черновиков на подпись',
            openB2b ? `Открытых B2B: ${openB2b}` : 'Открытых B2B нет',
          ],
        },
      },
      {
        label: 'Настройки',
        score: settingsFromProfile.score,
        color: colorFrom(settingsFromProfile.score),
        desc: 'По юр. блоку профиля (прокси до модели настроек)',
        href: '/brand/settings',
        trend: 0,
        status: statusFrom(settingsFromProfile.score),
        scoreSource: 'data',
        details: { lastCheck, checklist: settingsFromProfile.checklist },
      },
    ];
  }, [apiHealthData, profile, dashboard, integrations, user?.team?.length]);

  const overallHealth = useMemo(() => {
    const counted = metrics.filter((m) => m.scoreSource !== 'placeholder');
    const slice = counted.length > 0 ? counted : metrics;
    return Math.round(slice.reduce((s, m) => s + m.score, 0) / slice.length);
  }, [metrics]);
  const lastCheck = metrics[0]?.details?.lastCheck ?? formatDate(new Date());

  const organizationPresence = useMemo(() => {
    const d = dashboard && typeof dashboard === 'object' ? (dashboard as Record<string, unknown>) : null;
    const fromDashboardParticipants =
      typeof d?.participantsCount === 'number'
        ? (d.participantsCount as number)
        : typeof d?.teamMembersCount === 'number'
          ? (d.teamMembersCount as number)
          : typeof d?.membersCount === 'number'
            ? (d.membersCount as number)
            : undefined;
    const fromDashboardOnline =
      typeof d?.onlineCount === 'number'
        ? (d.onlineCount as number)
        : typeof d?.membersOnline === 'number'
          ? (d.membersOnline as number)
          : undefined;
    const teamLen = Array.isArray(user?.team) ? user.team.length : undefined;
    const participantsCount =
      fromDashboardParticipants != null && fromDashboardParticipants >= 0
        ? fromDashboardParticipants
        : teamLen != null && teamLen > 0
          ? teamLen
          : undefined;
    let onlineCount =
      fromDashboardOnline != null && fromDashboardOnline >= 0 ? fromDashboardOnline : undefined;
    if (onlineCount != null && participantsCount != null) {
      onlineCount = Math.min(onlineCount, participantsCount);
    }
    return { participantsCount, onlineCount };
  }, [dashboard, user?.team]);

  return {
    metrics,
    overallHealth,
    lastCheck,
    isLoading: loading,
    error,
    partialLoadWarning,
    refetch: () => void fetchData({ force: true }),
    profile,
    dashboard,
    integrations,
    organizationPresence,
  };
}
