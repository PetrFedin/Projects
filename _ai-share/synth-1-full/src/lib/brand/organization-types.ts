/** Сводная метрика здоровья организации (API bundle + демо-ряд в `organization-health-metrics-demo.ts`). */
export type HealthMetric = {
  label: string;
  score: number;
  color: string;
  desc: string;
  href: string;
  trend: number;
  status: 'ok' | 'warning' | 'critical';
  /** data — в общий индекс; placeholder — нет доменных данных, не смешивать с overallHealth */
  scoreSource?: 'data' | 'placeholder';
  details: {
    lastCheck: string;
    checklist: string[];
    missing?: string[];
    tips?: string;
  };
};

/** Профиль бренда из API для обзора организации (см. use-organization-health). */
export type OrgOverviewProfileView = {
  brand?: { name?: string; id?: string };
  legal?: { inn?: string; legal_name?: string };
  contacts?: Record<string, unknown>;
  dna?: Record<string, unknown>;
  [key: string]: unknown;
};

/** Снимок `brand/dashboard` до строгого OpenAPI-контракта; поля читаются точечно в хабе. */
export type OrgHubDashboardSnapshot = Record<string, unknown>;

/** Снимок статусов интеграций: ключ сервиса → объект с `status` и др. */
export type OrgHubIntegrationsSnapshot = Record<string, unknown>;
