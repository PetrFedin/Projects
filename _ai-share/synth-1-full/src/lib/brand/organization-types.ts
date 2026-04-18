/** Сводная метрика здоровья организации (используется в page-data и use-organization-health). */
export type HealthMetric = {
  label: string;
  score: number;
  color: string;
  desc: string;
  href: string;
  trend: number;
  status: 'ok' | 'warning' | 'critical';
  details: {
    lastCheck: string;
    checklist: string[];
    missing?: string[];
    tips?: string;
  };
};

/** Профиль бренда из API для обзора организации (см. use-organization-health). */
export type OrgOverviewProfileView = {
  brand?: { name?: string };
  legal?: { inn?: string; legal_name?: string };
  contacts?: Record<string, unknown>;
  dna?: Record<string, unknown>;
  [key: string]: unknown;
};
