/**
 * Notification triggers — Email, Push
 * Связано с production alerts и SLA
 */

export type NotificationChannel = 'email' | 'push';

export type TriggerType = 'sla_overdue' | 'new_qc' | 'po_amendment' | 'deadline';

export interface TriggerConfig {
  id: TriggerType;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

export const DEFAULT_TRIGGERS: TriggerConfig[] = [
  {
    id: 'sla_overdue',
    label: 'Просрочка SLA',
    description: 'Когда этап сэмпла превышает дедлайн',
    email: true,
    push: true,
  },
  { id: 'new_qc', label: 'Новый QC', description: 'Появление QC-отчёта', email: false, push: true },
  {
    id: 'po_amendment',
    label: 'Amendment PO',
    description: 'Изменение заказа на производство',
    email: true,
    push: true,
  },
  {
    id: 'deadline',
    label: 'Дедлайн задачи',
    description: 'Близкий дедлайн (24ч)',
    email: true,
    push: true,
  },
];
