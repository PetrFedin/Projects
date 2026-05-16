/**
 * Демо-данные для виджетов дашборда (используются только при `SYNTH_DASHBOARD_DEMO_MOCKS`).
 * Единая точка правки чисел/строк до появления API.
 */

import type { CreditLine, PaymentMethod, OutstandingInvoice } from '@/hooks/usePaymentData';
import type {
  LiveCollaborator,
  PendingApproval,
  TeamBudget,
} from '@/hooks/useCollaborativeOrder';

export const DASHBOARD_DEMO_CREDIT_LINE: CreditLine = {
  available: 2_400_000,
  limit: 5_000_000,
  used: 2_600_000,
};

export const DASHBOARD_DEMO_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'net30',
    name: 'Отсрочка 30 дней',
    dueDate: '20 мар',
    badge: 'Стандарт',
  },
  {
    id: 'bnpl',
    name: 'Рассрочка / кредит (банк-партнёр РФ)',
    badge: 'по программе банка',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'escrow',
    name: 'Эскроу',
    badge: 'Защита сделки',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'factoring',
    name: 'Факторинг',
    badge: 'Финансирование под дебиторку',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

export const DASHBOARD_DEMO_OUTSTANDING_INVOICES: OutstandingInvoice[] = [
  {
    id: 'inv-1',
    number: 'INV-8821',
    amount: 420_000,
    daysUntilDue: 5,
    daysOverdue: 0,
    isOverdue: false,
  },
  {
    id: 'inv-2',
    number: 'INV-8790',
    amount: 890_000,
    daysUntilDue: 0,
    daysOverdue: 2,
    isOverdue: true,
  },
];

export const DASHBOARD_DEMO_TEAM_BUDGET: TeamBudget = {
  allocated: 420_000,
  total: 650_000,
  remaining: 230_000,
};

export const DASHBOARD_DEMO_LIVE_COLLABORATORS: LiveCollaborator[] = [
  {
    userId: 'user-1',
    name: 'Maria Ivanova',
    avatar: '/avatars/maria.jpg',
    initials: 'MI',
    status: 'active',
    lastAction: 'добавила 5 SKU (2 мин назад)',
    addedItems: 5,
  },
  {
    userId: 'user-2',
    name: 'Ivan Kozlov',
    avatar: '/avatars/ivan.jpg',
    initials: 'IK',
    status: 'idle',
    lastAction: 'изменил quantities (15 мин назад)',
    addedItems: 0,
  },
];

export const DASHBOARD_DEMO_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'approval-1',
    title: 'Nordic Wool FW26 Order',
    requester: 'Elena Volkova',
    timestamp: '10 мин назад',
    itemCount: 12,
  },
  {
    id: 'approval-2',
    title: 'Syntha Lab SS26 Samples',
    requester: 'Alexey Petrov',
    timestamp: '1 ч назад',
    itemCount: 5,
  },
];
