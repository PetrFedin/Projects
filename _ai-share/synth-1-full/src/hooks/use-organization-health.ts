'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { fastApiService } from '@/lib/fastapi-service';
import type { HealthMetric } from '@/app/brand/organization/page-data';
import { BRAND_ID, HEALTH_OK, HEALTH_WARNING } from '@/app/brand/organization/organization-config';

function computeProfileCompleteness(profile: any): { score: number; checklist: string[]; missing?: string[]; tips?: string } {
  if (!profile || typeof profile !== 'object') return { score: 0, checklist: ['Нет данных профиля'], tips: 'Загрузите профиль бренда' };
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

function computeIntegrationsHealth(integrations: any): { score: number; checklist: string[]; missing?: string[]; tips?: string } {
  if (!integrations || typeof integrations !== 'object') return { score: 50, checklist: ['Статус интеграций неизвестен'], tips: 'Проверьте раздел Интеграции' };
  const entries = Object.entries(integrations) as [string, any][];
  const total = entries.length || 1;
  const ok = entries.filter(([, v]) => v?.status === 'ok').length;
  const score = Math.round((ok / total) * 100);
  const list = entries.map(([k, v]) => `${k}: ${v?.status === 'ok' ? 'активна' : v?.status || 'ошибка'}`);
  const errors = entries.filter(([, v]) => v?.status !== 'ok');
  const missing = errors.length ? errors.map(([k]) => k) : undefined;
  return {
    score: Math.min(score, 100),
    checklist: list.length ? list : ['Нет подключённых интеграций'],
    missing,
    tips: errors.length ? `Исправьте: ${errors.map(([k]) => k).join(', ')}` : undefined,
  };
}

function computeMarkingHealth(dashboard: any): { score: number; checklist: string[] } {
  if (!dashboard) return { score: 70, checklist: ['Статус маркировки неизвестен'] };
  const status = (dashboard as any).markingSyncStatus;
  const score = status === 'ok' ? 94 : status === 'error' ? 50 : 75;
  return {
    score,
    checklist: [
      status === 'ok' ? 'ЭДО активна' : 'Проверьте ЭДО',
      (dashboard as any).markingLastSync ? `Синхр: ${(dashboard as any).markingLastSync}` : 'Синхронизация КИЗ',
    ],
  };
}

function formatDate(d: Date) {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Хук: Индекс здоровья организации на основе реальных данных профиля.
 * Пробует API, при отсутствии данных вычисляет из profile + dashboard + integrations.
 */
export function useOrganizationHealth() {
  const { user } = useAuth();
  const [apiHealthData, setApiHealthData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [apiRes, profileRes, dashboardRes, integrationsRes] = await Promise.allSettled([
        fastApiService.getOrganizationHealth(BRAND_ID),
        fastApiService.getBrandProfile(BRAND_ID),
        fastApiService.getBrandDashboard(BRAND_ID),
        fastApiService.getIntegrationsStatus(BRAND_ID),
      ]);
      const api = apiRes.status === 'fulfilled' ? apiRes.value : null;
      const profileResVal = profileRes.status === 'fulfilled' ? profileRes.value : null;
      const dashboardResVal = dashboardRes.status === 'fulfilled' ? dashboardRes.value : null;
      const integrationsResVal = integrationsRes.status === 'fulfilled' ? integrationsRes.value : null;
      if (profileRes.status === 'rejected') setError(profileRes.reason instanceof Error ? profileRes.reason : new Error('Не удалось загрузить профиль'));
      setApiHealthData(api);
      const p = profileResVal && typeof profileResVal === 'object' ? (profileResVal as any).data ?? profileResVal : profileResVal;
      const d = dashboardResVal && typeof dashboardResVal === 'object' ? (dashboardResVal as any).data ?? dashboardResVal : dashboardResVal;
      const i = integrationsResVal && typeof integrationsResVal === 'object' ? (integrationsResVal as any).data ?? integrationsResVal : integrationsResVal;
      setProfile(p);
      setDashboard(d);
      setIntegrations(i);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Не удалось загрузить данные'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = useMemo((): HealthMetric[] => {
    const lastCheck = formatDate(new Date());
    const api = apiHealthData && typeof apiHealthData === 'object' ? (apiHealthData as any)?.data ?? apiHealthData : null;

    if (Array.isArray(api) && api.length > 0) {
      return api as HealthMetric[];
    }

    const profileHealth = computeProfileCompleteness(profile);
    const integrationsHealth = computeIntegrationsHealth(integrations);
    const markingHealth = computeMarkingHealth(dashboard);

    const teamCount = user?.team?.length ?? 0;
    const teamScore = teamCount >= 5 ? 90 : teamCount >= 2 ? 75 : teamCount >= 1 ? 60 : 40;

    const statusFrom = (s: number) => (s >= HEALTH_OK ? 'ok' : s >= HEALTH_WARNING ? 'warning' : 'critical') as 'ok' | 'warning' | 'critical';
    const colorFrom = (s: number) => (s >= HEALTH_OK ? 'bg-emerald-500' : s >= HEALTH_WARNING ? 'bg-amber-500' : 'bg-rose-500');

    return [
      {
        label: 'Полнота профиля',
        score: profileHealth.score,
        color: colorFrom(profileHealth.score),
        desc: profileHealth.score >= 80 ? 'Заполнены ключевые поля' : 'Заполните обязательные поля',
        href: '/brand',
        trend: 0,
        status: statusFrom(profileHealth.score),
        details: { lastCheck, checklist: profileHealth.checklist, missing: profileHealth.missing, tips: profileHealth.tips },
      },
      {
        label: 'Безопасность',
        score: 88,
        color: 'bg-emerald-500',
        desc: '2FA, API-ключи',
        href: '/brand/security',
        trend: 0,
        status: 'ok',
        details: { lastCheck, checklist: ['2FA', 'API-ключи', 'Сессии'] },
      },
      {
        label: 'Активность команды',
        score: teamScore,
        color: colorFrom(teamScore),
        desc: teamCount ? `${teamCount} участников` : 'Добавьте участников',
        href: '/brand/team',
        trend: 0,
        status: statusFrom(teamScore),
        details: { lastCheck, checklist: teamCount ? [`${teamCount} в команде`] : [], missing: teamCount ? undefined : ['Добавьте участников в раздел Команда'] },
      },
      {
        label: 'Интеграции',
        score: integrationsHealth.score,
        color: colorFrom(integrationsHealth.score),
        desc: integrations ? `${integrationsHealth.checklist.filter(c => c.includes('активна')).length} активных` : 'Проверьте статус',
        href: '/brand/integrations',
        trend: 0,
        status: statusFrom(integrationsHealth.score),
        details: { lastCheck, checklist: integrationsHealth.checklist, missing: integrationsHealth.missing, tips: integrationsHealth.tips },
      },
      {
        label: 'ЭДО и маркировка',
        score: markingHealth.score,
        color: colorFrom(markingHealth.score),
        desc: (dashboard as any)?.markingSyncStatus === 'ok' ? 'Честный ЗНАК, ЭДО' : 'Проверьте маркировку',
        href: '/brand/compliance',
        trend: 0,
        status: statusFrom(markingHealth.score),
        details: { lastCheck, checklist: markingHealth.checklist },
      },
      {
        label: 'Подписка',
        score: 100,
        color: 'bg-emerald-500',
        desc: 'Тариф активен',
        href: '/brand/subscription',
        trend: 0,
        status: 'ok',
        details: { lastCheck, checklist: ['Подписка активна'] },
      },
      {
        label: 'Документы',
        score: (dashboard as any)?.openB2bOrders ? 75 : 85,
        color: 'bg-amber-500',
        desc: 'Договоры, счета',
        href: '/brand/documents',
        trend: 0,
        status: 'warning',
        details: { lastCheck, checklist: ['Проверьте раздел Документы'] },
      },
      {
        label: 'Настройки',
        score: 78,
        color: 'bg-amber-500',
        desc: 'Конфигурация',
        href: '/brand/settings',
        trend: 0,
        status: 'warning',
        details: { lastCheck, checklist: ['Часовой пояс', 'Валюта', 'Webhooks'] },
      },
    ];
  }, [apiHealthData, profile, dashboard, integrations, user?.team?.length]);

  const overallHealth = useMemo(() => Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length), [metrics]);
  const lastCheck = metrics[0]?.details?.lastCheck ?? formatDate(new Date());

  return {
    metrics,
    overallHealth,
    lastCheck,
    isLoading: loading,
    error,
    refetch: fetchData,
    profile,
    dashboard,
    integrations,
  };
}
