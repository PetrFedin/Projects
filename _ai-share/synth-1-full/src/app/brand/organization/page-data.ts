/**
 * Данные для Обзор организации: метаданные секций, карточки, активность.
 * Синхронизировано с brand-navigation и entity-links.
 */

import {
  Building2,
  Users,
  Settings,
  Zap,
  CreditCard,
  ShieldCheck,
  FileText,
  UserCircle2,
  Cpu,
  Factory,
  Package,
  Store,
  Truck,
  ClipboardList,
  CheckSquare,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SectionMeta } from '@/components/brand/SectionBlock';

export const SECTION_META: Record<string, SectionMeta> = {
  health: {
    description: 'Сводный индекс состояния организации по ключевым параметрам.',
    purpose: 'Быстро оценить готовность бренда к работе и выявить слабые места.',
    functionality: [
      'Полнота профиля (обязательные поля)',
      'Уровень безопасности (2FA, API)',
      'Активность команды (онлайн)',
      'Статус интеграций',
    ],
    importance: 9,
  },
  activity: {
    description: 'Лента последних действий в разделе «Организация».',
    purpose: 'Видеть, что меняли коллеги, и быстро реагировать на важные события.',
    functionality: [
      'События по профилю, команде, интеграциям',
      'Переход к полной ленте в разделе «Команда»',
    ],
    importance: 7,
  },
  onboarding: {
    description: 'Чек-лист первичной настройки организации.',
    purpose: 'Пошагово пройти обязательные шаги и выйти на полную готовность.',
    functionality: ['Профиль и юр.данные', 'Команда', 'Интеграции', 'ЭДО и маркировка', 'Подписка'],
    importance: 8,
  },
  alerts: {
    description: 'Срочные действия и уведомления, требующие внимания.',
    purpose: 'Не пропустить истекающие сертификаты, незаполненные данные и сбои.',
    functionality: ['Истекающие сертификаты', 'Незаполненные данные профиля', 'Статус систем'],
    importance: 9,
  },
  partners: {
    description:
      'Связи бренда с магазинами, производствами, поставщиками и дистрибуторами. Обзор экосистемы и прямая связь с заказами B2B, документами, задачами и возвратами на платформе.',
    purpose:
      'Видеть партнёров по типам, переходить в заказы с партнёрами, документы, задачи и возвраты — единая точка входа в партнёрские бизнес-процессы.',
    functionality: [
      'Сводка: всего партнёров, рост, требующие внимания, интеграции',
      'Производства, поставщики, магазины, дистрибуторы, интеграции',
      'Связь с заказами B2B — заказы с партнёрами',
      'Документы — договоры, накладные, акты с партнёрами',
      'Задачи — назначенные по партнёрам и контрактам',
      'Возвраты и рекламации от партнёров',
      'Отгрузки и логистика по партнёрам',
      'Подробный обзор экосистемы',
    ],
    importance: 8,
  },
  modules: {
    description: 'Карточки модулей организации с переходами в подразделы.',
    purpose: 'Удобная навигация по профилю, команде, документам и настройкам.',
    functionality: [
      'Профиль бренда',
      'Команда',
      'Документооборот',
      'Интеграции',
      'Подписка и биллинг',
      'Безопасность',
      'Настройки',
      'ЭДО и маркировка',
    ],
    importance: 10,
  },
};

/** Мета для подблоков «Требует внимания»: описание и ссылка «Детально» */
export const ALERT_BLOCK_META: Record<
  string,
  { description: string; detailHref: string; title: string }
> = {
  certificates: {
    title: 'Истекающие сертификаты',
    description:
      'Сертификаты с истекающим сроком действия. Продлите или замените до истечения, чтобы не прерывать работу интеграций и соответствие требованиям.',
    detailHref: '/brand',
  },
  profile: {
    title: 'Незаполненные данные',
    description:
      'Обязательные поля профиля или Brand DNA не заполнены. Заполните для полноты карточки бренда и корректной работы систем.',
    detailHref: '/brand',
  },
  systems: {
    title: 'Системы',
    description:
      'Статус интеграций и внешних систем. При сбоях проверьте подключения и перейдите в раздел интеграций для диагностики.',
    detailHref: '/brand/integrations',
  },
  tasks: {
    title: 'Задачи без исполнителя',
    description:
      'Задачи без назначенного ответственного. Назначьте исполнителя в разделе команды, чтобы не допустить просрочки.',
    detailHref: '/brand/team?tab=tasks',
  },
};

export const NAVIGATION_CARDS = [
  {
    title: 'Профиль бренда',
    description: 'Юридические данные, контакты, Brand DNA, история и ценности.',
    icon: Building2,
    href: '/brand',
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    stats: { label: 'Заполнено', value: '92%', status: 'success' as const },
    changePct7d: 2,
    changePct30d: -1,
    addHref: '/brand',
    addLabel: 'Редактировать',
  },
  {
    title: 'Команда',
    description: 'Сотрудники, роли, права, активность, задачи и коллаборация.',
    icon: Users,
    href: '/brand/team',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    stats: { label: 'Участников', value: '24', status: 'active' as const },
    changePct7d: 5,
    changePct30d: 12,
    addHref: '/brand/team?action=invite',
    addLabel: 'Добавить',
  },
  {
    title: 'Документооборот',
    description: 'Договоры, акты, спецификации, ЭДО и генератор документов.',
    icon: FileText,
    href: '/brand/documents',
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    stats: { label: 'На подписи', value: '2', status: 'warning' as const },
    changePct7d: -3,
    changePct30d: 2,
    addHref: '/brand/documents?action=new',
    addLabel: 'Добавить',
  },
  {
    title: 'Интеграции',
    description: 'Маркетплейсы (WB, Ozon), ERP, логистика, webhooks, SSO.',
    icon: Zap,
    href: '/brand/integrations',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    stats: { label: 'Активно', value: '3/13', status: 'warning' as const },
    changePct7d: 0,
    changePct30d: 5,
    addHref: '/brand/integrations',
    addLabel: 'Подключить',
  },
  {
    title: 'Подписка и биллинг',
    description: 'Тариф, лимиты, история платежей и способы оплаты.',
    icon: CreditCard,
    href: '/brand/subscription',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    stats: { label: 'План', value: 'Elite', status: 'success' as const },
    changePct7d: 0,
    changePct30d: 0,
  },
  {
    title: 'Безопасность',
    description: '2FA, API ключи, активные сессии, журнал аудита.',
    icon: ShieldCheck,
    href: '/brand/security',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    stats: { label: 'Оценка', value: '88/100', status: 'success' as const },
    changePct7d: 1,
    changePct30d: 3,
    addHref: '/brand/security',
    addLabel: 'Настроить',
  },
  {
    title: 'Настройки',
    description: 'Локализация, уведомления, каналы продаж, налоги.',
    icon: Settings,
    href: '/brand/settings',
    color: 'text-text-secondary',
    bg: 'bg-bg-surface2',
    stats: { label: 'Конфигурация', value: 'OK', status: 'success' as const },
    changePct7d: 0,
    changePct30d: 1,
    addHref: '/brand/settings',
    addLabel: 'Открыть',
  },
  {
    title: 'ЭДО и маркировка',
    description: 'Честный ЗНАК, маркировка, синхронизация КИЗ со складом.',
    icon: ShieldCheck,
    href: '/brand/compliance',
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    stats: { label: 'Статус', value: 'Настроено', status: 'success' as const },
    changePct7d: 4,
    changePct30d: 8,
    addHref: '/brand/compliance',
    addLabel: 'Настроить',
  },
];

export type RecentActivity = {
  user: string;
  action: string;
  time: string;
  type: 'profile' | 'team' | 'integration' | 'security' | 'billing';
  icon: typeof Building2;
  participantId: string;
  /** ISO date for period filtering */
  dateStr: string;
};

/** Базовые события без даты; dayOffset = 0 сегодня, -1 вчера и т.д. */
const RECENT_ACTIVITIES_BASE: (Omit<RecentActivity, 'dateStr'> & { dayOffset: number })[] = [
  {
    user: 'Анна К.',
    action: 'Обновила юридический адрес компании',
    time: '5 мин назад',
    type: 'profile',
    icon: Building2,
    participantId: 'anna',
    dayOffset: 0,
  },
  {
    user: 'Игорь Д.',
    action: 'Добавил нового сотрудника (CFO)',
    time: '12 мин назад',
    type: 'team',
    icon: Users,
    participantId: 'igor',
    dayOffset: 0,
  },
  {
    user: 'Мария С.',
    action: 'Подключила интеграцию с 1C:Предприятие',
    time: '25 мин назад',
    type: 'integration',
    icon: Zap,
    participantId: 'maria',
    dayOffset: 0,
  },
  {
    user: 'Петр В.',
    action: 'Включил двухфакторную аутентификацию',
    time: '1ч назад',
    type: 'security',
    icon: ShieldCheck,
    participantId: 'petr',
    dayOffset: 0,
  },
  {
    user: 'Система',
    action: 'Автоматическое продление подписки Elite',
    time: '2ч назад',
    type: 'billing',
    icon: CreditCard,
    participantId: 'system',
    dayOffset: 0,
  },
  {
    user: 'Анна К.',
    action: 'Загрузила логотип бренда',
    time: 'вчера',
    type: 'profile',
    icon: Building2,
    participantId: 'anna',
    dayOffset: -1,
  },
  {
    user: 'Игорь Д.',
    action: 'Создал задачу по интеграции',
    time: '2 дня назад',
    type: 'team',
    icon: Users,
    participantId: 'igor',
    dayOffset: -2,
  },
  {
    user: 'Мария С.',
    action: 'Экспорт в 1С выполнен успешно',
    time: '3 дня назад',
    type: 'integration',
    icon: Zap,
    participantId: 'maria',
    dayOffset: -3,
  },
  {
    user: 'Петр В.',
    action: 'Настроил 2FA для команды',
    time: '4 дня назад',
    type: 'security',
    icon: ShieldCheck,
    participantId: 'petr',
    dayOffset: -4,
  },
  {
    user: 'Анна К.',
    action: 'Обновила контакты в профиле',
    time: '5 дней назад',
    type: 'profile',
    icon: Building2,
    participantId: 'anna',
    dayOffset: -5,
  },
];

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Активность с датами относительно переданного «сегодня» — при выборе 7/30 дней события попадают в период */
export function getRecentActivities(relativeTo: Date = new Date()): RecentActivity[] {
  return RECENT_ACTIVITIES_BASE.map((a) => {
    const d = new Date(relativeTo);
    d.setDate(d.getDate() + a.dayOffset);
    const { dayOffset: _dayOffset, ...rest } = a;
    return { ...rest, dateStr: toDateStr(d) };
  });
}

/** Для обратной совместимости: активность относительно текущей даты (один раз при импорте не подойдёт, используйте getRecentActivities в компоненте) */
export const RECENT_ACTIVITIES: RecentActivity[] = getRecentActivities(new Date());

/** Team members for Health Index metric assignment */
export const HEALTH_METRIC_TEAM = [
  { id: 'anna', label: 'Анна К.', role: 'CEO' },
  { id: 'igor', label: 'Игорь Д.', role: 'CFO' },
  { id: 'maria', label: 'Мария С.', role: 'CTO' },
  { id: 'petr', label: 'Петр В.', role: 'Security' },
  { id: 'olga', label: 'Ольга С.', role: 'HR' },
  { id: 'dmitry', label: 'Дмитрий К.', role: 'Operations' },
];

/** Unique participants for activity filter - icons for buttons, label in tooltip */
export const ACTIVITY_PARTICIPANTS = [
  { id: 'all', label: 'Все', Icon: Users },
  { id: 'anna', label: 'Анна К.', Icon: UserCircle2, initials: 'А' },
  { id: 'igor', label: 'Игорь Д.', Icon: UserCircle2, initials: 'И' },
  { id: 'maria', label: 'Мария С.', Icon: UserCircle2, initials: 'М' },
  { id: 'petr', label: 'Петр В.', Icon: UserCircle2, initials: 'П' },
  { id: 'system', label: 'Система', Icon: Cpu },
];

export type OnboardingStep = {
  id: string;
  order: number;
  label: string;
  href: string;
  /** Зачем нужен шаг */
  why: string;
  /** Что блокируется без него */
  blocksWithout: string;
  /** Что проверить / заполнить */
  checkItems: string[];
  /** Привязка к метрике здоровья для вычисления done (score >= 80) */
  healthMetricKey: 'profile' | 'team' | 'integrations' | 'compliance' | 'subscription';
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'profile',
    order: 1,
    label: 'Профиль и юр.данные',
    href: '/brand',
    why: 'Для договоров, счетов и отчётов. Без юр.данных невозможны B2B-сделки.',
    blocksWithout: 'Счета, акты, участие в тендерах',
    checkItems: ['ИНН, КПП', 'Юр. наименование', 'Контакты', 'Brand DNA'],
    healthMetricKey: 'profile',
  },
  {
    id: 'team',
    order: 2,
    label: 'Команда',
    href: '/brand/team',
    why: 'Для коллаборации, задач и контроля доступа. Минимум — ответственный и исполнитель.',
    blocksWithout: 'Назначение задач, доступ к разделам',
    checkItems: ['Минимум 1 участник', 'Роли и права'],
    healthMetricKey: 'team',
  },
  {
    id: 'integrations',
    order: 3,
    label: 'Интеграции',
    href: '/brand/integrations',
    why: 'Синхронизация с ERP, маркетплейсами, логистикой. Без интеграций — ручной ввод.',
    blocksWithout: 'Автосинхрон остатков, заказы с WB/Ozon',
    checkItems: ['1С или ERP', 'ЭДО Diadoc', 'Маркетплейсы при необходимости'],
    healthMetricKey: 'integrations',
  },
  {
    id: 'compliance',
    order: 4,
    label: 'ЭДО и маркировка',
    href: '/brand/compliance',
    why: 'Честный ЗНАК и ЭДО обязательны для легальной торговли товарами под маркировкой.',
    blocksWithout: 'Приём и отгрузка маркированных товаров',
    checkItems: ['ЭДО подключено', 'Синхронизация КИЗ', 'Нет просроченных УПД'],
    healthMetricKey: 'compliance',
  },
  {
    id: 'subscription',
    order: 5,
    label: 'Подписка',
    href: '/brand/subscription',
    why: 'Активный тариф даёт доступ к функциям и лимитам.',
    blocksWithout: 'Доступ к премиум-функциям',
    checkItems: ['Тариф активен', 'Оплата до даты'],
    healthMetricKey: 'subscription',
  },
];

/** Соответствие label метрики здоровья → ключ шага онбординга */
export const HEALTH_LABEL_TO_ONBOARDING_KEY: Record<string, OnboardingStep['healthMetricKey']> = {
  'Полнота профиля': 'profile',
  'Активность команды': 'team',
  Интеграции: 'integrations',
  'ЭДО и маркировка': 'compliance',
  Подписка: 'subscription',
};

export type HealthMetric = {
  label: string;
  score: number;
  color: string;
  desc: string;
  href: string;
  trend: number; // % change vs last week, e.g. +2 or -1
  status: 'ok' | 'warning' | 'critical';
  details: {
    lastCheck: string;
    checklist: string[];
    /** Что ещё не заполнено / что доработать */
    missing?: string[];
    tips?: string;
  };
};

export const HEALTH_METRICS: HealthMetric[] = [
  {
    label: 'Полнота профиля',
    score: 92,
    color: 'bg-accent-primary',
    desc: 'Заполнены все обязательные поля',
    href: '/brand',
    trend: 2,
    status: 'ok',
    details: {
      lastCheck: '11.03.2025',
      checklist: ['Юр. наименование', 'ИНН', 'Контакты', 'Logo'],
      tips: 'Добавьте Brand DNA для 100%',
    },
  },
  {
    label: 'Безопасность',
    score: 88,
    color: 'bg-emerald-500',
    desc: '2FA активна, 0 уязвимостей',
    href: '/brand/security',
    trend: 0,
    status: 'ok',
    details: {
      lastCheck: '11.03.2025',
      checklist: ['2FA включена', 'API-ключи ротированы', '0 активных сессий с риском'],
    },
  },
  {
    label: 'Активность команды',
    score: 84,
    color: 'bg-blue-500',
    desc: '8 участников онлайн',
    href: '/brand/team',
    trend: 5,
    status: 'ok',
    details: {
      lastCheck: '11.03.2025',
      checklist: ['8/24 онлайн', '14 задач за неделю', '5 комментариев'],
    },
  },
  {
    label: 'Интеграции',
    score: 76,
    color: 'bg-amber-500',
    desc: '3 активных, 6 доступных',
    href: '/brand/integrations',
    trend: -2,
    status: 'warning',
    details: {
      lastCheck: '10.03.2025',
      checklist: ['1С: активна', 'Diadoc: активна', 'Маркетплейсы: 1/3'],
      tips: 'Подключите Wildberries и Ozon',
    },
  },
  {
    label: 'ЭДО и маркировка',
    score: 94,
    color: 'bg-emerald-500',
    desc: 'Честный ЗНАК, ЭДО настроены',
    href: '/brand/compliance',
    trend: 1,
    status: 'ok',
    details: {
      lastCheck: '11.03.2025',
      checklist: ['ЭДО Diadoc', 'КИЗ синхронизированы', 'Нет просроченных УПД'],
    },
  },
  {
    label: 'Подписка',
    score: 100,
    color: 'bg-emerald-500',
    desc: 'Elite активна до 01.06.2025',
    href: '/brand/subscription',
    trend: 0,
    status: 'ok',
    details: {
      lastCheck: '11.03.2025',
      checklist: ['План Elite', 'Оплата до 01.06.2025', 'Все лимиты в норме'],
    },
  },
  {
    label: 'Документы',
    score: 68,
    color: 'bg-amber-500',
    desc: '2 на подписи, 0 просроченных',
    href: '/brand/documents',
    trend: -4,
    status: 'warning',
    details: {
      lastCheck: '10.03.2025',
      checklist: ['Подписано: 94%', 'На подписи: 2', 'Просроченных: 0'],
      tips: 'Подпишите договор #4521',
    },
  },
  {
    label: 'Настройки',
    score: 78,
    color: 'bg-amber-500',
    desc: 'Конфигурация на 78%',
    href: '/brand/settings',
    trend: 3,
    status: 'warning',
    details: {
      lastCheck: '09.03.2025',
      checklist: ['Часовой пояс', 'Валюта', 'Языки', 'Webhooks частично'],
      tips: 'Настройте webhooks для уведомлений',
    },
  },
];

export type PartnerCountItem = {
  id: string;
  label: string;
  value: string;
  href: string;
  color: string;
  /** Иконка для карточки */
  icon: LucideIcon;
  /** Краткое описание (тултип/подсказка) */
  description: string;
  /** Изменение за период, например +2 или -1 */
  trend?: string;
  /** Направление тренда для иконки и цвета */
  trendDirection?: 'up' | 'down';
  /** Подпись к тренду в тултипе, например "за неделю" */
  trendLabel?: string;
  /** Статус одной строкой */
  statusShort?: string;
  /** Ссылка при клике на статус (фильтр в разделе) */
  statusHref?: string;
  /** Вторая строка статуса (показывается перед statusShort, на одном уровне) */
  statusShort2?: string;
  statusHref2?: string;
  /** Ссылка на добавление */
  addHref: string;
  /** Текст кнопки добавления */
  addLabel: string;
  /** Число для мини-прогресса (интеграции: 3 из 9). Если задано — показываем прогресс-бар */
  progressValue?: number;
  progressMax?: number;
  /** Количество элементов, требующих внимания (бейдж на карточке) */
  alertCount?: number;
  /** Дополнительная строка под значением, например "5 с активными заказами" */
  subline?: string;
  /** Связанные бизнес-процессы платформы (показать в подсказке) */
  businessProcesses?: { label: string; href: string }[];
  /** Роль в экосистеме: supply = цепочка поставок, sales = канал продаж, platform = связь/инфра */
  roleInChain?: 'supply' | 'sales' | 'platform';
  /** Детальные метрики для попапа и карточки (значение + опциональная ссылка) */
  detailMetrics?: { label: string; value: string; href?: string }[];
  /** Краткие подсказки «что проверить» в подсказке */
  tips?: string[];
};

/** Ссылка на полный обзор экосистемы (отчёт, дашборд партнёров) */
export const PARTNERS_ECOSYSTEM_OVERVIEW_HREF = '/brand/retailers';

/** Бизнес-процессы: оформление как у «Партнёры по типам» (иконка, цвет, метрики, прирост, описание) */
export interface PartnerProcessItem {
  id: string;
  label: string;
  href: string;
  count7d: number;
  count30d: number;
  /** Прирост за 7 дн. в % (для отображения в правом верхнем углу) */
  changePct7d?: number;
  /** Прирост за 30 дн. в % */
  changePct30d?: number;
  sub: string;
  icon: LucideIcon;
  color: string;
  /** Описание для попапа по иконке вопроса */
  description?: string;
  /** Подсказки для попапа */
  tips?: string[];
  detailMetrics?: { label: string; value: string; href?: string }[];
  /** Ссылка на действие «добавить» (создать заказ, задачу и т.д.) */
  addHref?: string;
  /** Текст кнопки: Добавить, Создать заказ и т.д. */
  addLabel?: string;
}
export const PARTNER_BUSINESS_PROCESSES: PartnerProcessItem[] = [
  {
    id: 'b2b-orders',
    label: 'Заказы B2B',
    href: '/brand/b2b-orders',
    count7d: 6,
    count30d: 24,
    changePct7d: 20,
    changePct30d: 33,
    sub: 'в работе',
    icon: ClipboardList,
    color: 'bg-blue-500',
    description:
      'Заказы от партнёров: подтверждение, производство, отгрузка. Сводка по статусам за выбранный период.',
    tips: ['Подтверждайте заказы в срок', 'Следите за заказами в производстве'],
    addHref: '/brand/b2b-orders?action=new',
    addLabel: 'Создать заказ',
    detailMetrics: [
      { label: 'На подтверждении', value: '3', href: '/brand/b2b-orders?status=pending' },
      { label: 'В производстве', value: '5', href: '/brand/b2b-orders' },
    ],
  },
  {
    id: 'documents',
    label: 'Документы',
    href: '/brand/documents',
    count7d: 1,
    count30d: 2,
    changePct7d: 0,
    changePct30d: 100,
    sub: 'с партнёрами',
    icon: FileText,
    color: 'bg-text-secondary',
    description:
      'Договоры, спецификации, акты с партнёрами. Документы на подпись и истекающие в ближайшее время.',
    tips: ['Проверяйте срок действия договоров', 'Подписанные документы в ЭДО'],
    addHref: '/brand/documents?action=new',
    addLabel: 'Добавить',
    detailMetrics: [
      { label: 'На подпись', value: '2', href: '/brand/documents?status=pending' },
      { label: 'Истекают в 30 дн.', value: '5', href: '/brand/documents?expiring=30' },
    ],
  },
  {
    id: 'tasks',
    label: 'Задачи',
    href: '/brand/team?tab=tasks',
    count7d: 3,
    count30d: 8,
    changePct7d: 50,
    changePct30d: 14,
    sub: 'по партнёрам',
    icon: CheckSquare,
    color: 'bg-emerald-500',
    description:
      'Открытые задачи, привязанные к партнёрам. Просроченные и с дедлайном в выбранном периоде.',
    tips: ['Назначайте ответственных', 'Закрывайте просроченные'],
    addHref: '/brand/team?tab=tasks&action=new',
    addLabel: 'Добавить задачу',
    detailMetrics: [
      { label: 'Просрочено', value: '2', href: '/brand/team?tab=tasks&overdue=1' },
      { label: 'Открытых', value: '8', href: '/brand/team?tab=tasks' },
    ],
  },
  {
    id: 'returns',
    label: 'Возвраты',
    href: '/brand/returns-claims',
    count7d: 2,
    count30d: 5,
    changePct7d: -20,
    changePct30d: 25,
    sub: 'от партнёров',
    icon: RotateCcw,
    color: 'bg-amber-500',
    description:
      'Возвраты и рекламации от партнёров. Открытые заявки и инциденты качества за период.',
    tips: ['Обрабатывайте рекламации в срок', 'Фиксируйте причины возвратов'],
    addHref: '/brand/returns-claims?action=new',
    addLabel: 'Оформить возврат',
    detailMetrics: [
      { label: 'Открытых возвратов', value: '5', href: '/brand/returns-claims' },
      { label: 'Рекламаций за месяц', value: '2', href: '/brand/returns-claims' },
    ],
  },
  {
    id: 'shipments',
    label: 'Отгрузки',
    href: '/brand/b2b-orders',
    count7d: 4,
    count30d: 12,
    changePct7d: 33,
    changePct30d: 20,
    sub: 'к отгрузке',
    icon: Truck,
    color: 'bg-sky-500',
    description: 'Отгрузки партнёрам: в пути, к отгрузке, задержки. Данные за выбранный период.',
    tips: ['Отслеживайте трекинг', 'Планируйте отгрузки заранее'],
    addHref: '/brand/b2b-orders',
    addLabel: 'К отгрузке',
    detailMetrics: [
      { label: 'В пути', value: '18', href: '/brand/logistics' },
      { label: 'К отгрузке', value: '12', href: '/brand/b2b-orders' },
    ],
  },
  {
    id: 'auctions',
    label: 'Закупки',
    href: '/brand/auctions',
    count7d: 0,
    count30d: 0,
    sub: 'аукционы, поставщики',
    icon: ShoppingCart,
    color: 'bg-accent-primary/100',
    description: 'Аукционы и закупки у поставщиков. Активные торги и приглашения.',
    tips: ['Проверяйте условия поставщиков', 'Сравнивайте предложения'],
    addHref: '/brand/auctions?action=new',
    addLabel: 'Создать аукцион',
    detailMetrics: [{ label: 'Активных аукционов', value: '0', href: '/brand/auctions' }],
  },
];

/** Короткие ссылки: где работать с партнёрами */
export const PARTNER_WORK_LINKS = [
  { label: 'Шоурум', href: '/brand/showroom', sub: 'байеры' },
  { label: 'Чаты', href: '/brand/messages', sub: 'сообщения с партнёрами' },
  { label: 'Команда', href: '/brand/team', sub: 'ответственные' },
];

/** Табы секции «Партнёрская экосистема»: систематизация по смыслу */
export const PARTNER_ECOSYSTEM_TABS = [
  { id: 'overview', label: 'Обзор', desc: 'Сводка и быстрые переходы' },
  {
    id: 'by-type',
    label: 'Партнёры по типам',
    desc: 'Цепочка поставок, каналы продаж, интеграции',
  },
  {
    id: 'processes',
    label: 'Процессы и области',
    desc: 'Контракты, финансы, качество, логистика, задачи, аналитика',
  },
] as const;

export const PARTNER_COUNTS: PartnerCountItem[] = [
  {
    id: 'factories',
    label: 'Производства',
    value: '8',
    href: '/brand/factories',
    color: 'bg-blue-500',
    icon: Factory,
    description: 'Связи с производствами и фабриками. Контракты, заказы, контроль качества.',
    trend: '+2',
    trendDirection: 'up',
    trendLabel: 'за месяц',
    statusShort: '1 ожидает подтверждения',
    statusHref: '/brand/factories?status=pending',
    addHref: '/brand/factories?action=new',
    addLabel: 'Добавить',
    alertCount: 1,
    subline: '5 с активными заказами',
    businessProcesses: [
      { label: 'Заказы на производство', href: '/brand/production' },
      { label: 'B2B заказы', href: '/brand/b2b-orders' },
    ],
    roleInChain: 'supply',
    detailMetrics: [
      { label: 'Активных заказов', value: '5', href: '/brand/b2b-orders' },
      { label: 'Новых за период', value: '1', href: '/brand/factories' },
      { label: 'Договоров', value: '8', href: '/brand/documents' },
    ],
    tips: [
      'Сроки по контрактам',
      'Контроль качества образцов',
      'Загрузка производственных мощностей',
    ],
  },
  {
    id: 'suppliers',
    label: 'Поставщики',
    value: '24',
    href: '/brand/materials',
    color: 'bg-emerald-500',
    icon: Package,
    description: 'Связи с поставщиками материалов и сырья. Спецификации, сертификаты.',
    trend: '+5',
    trendDirection: 'up',
    trendLabel: 'за месяц',
    statusShort: '2 ожидают подтверждения',
    statusHref: '/brand/materials?status=pending',
    addHref: '/brand/materials?action=new',
    addLabel: 'Добавить',
    subline: '12 с сертификатами',
    businessProcesses: [
      { label: 'Документы (спецификации)', href: '/brand/documents' },
      { label: 'Закупки', href: '/brand/auctions' },
    ],
    roleInChain: 'supply',
    detailMetrics: [
      { label: 'С сертификатами', value: '12', href: '/brand/materials' },
      { label: 'Новых за период', value: '3', href: '/brand/materials' },
      { label: 'Спецификаций', value: '24', href: '/brand/documents' },
    ],
    tips: [
      'Актуальность сертификатов',
      'Минимальные партии и сроки поставки',
      'Резерв по критичным позициям',
    ],
  },
  {
    id: 'retailers',
    label: 'Магазины',
    value: '156',
    href: '/brand/retailers',
    color: 'bg-accent-primary',
    icon: Store,
    description: 'Связи с магазинами и ретейлерами. Точки продаж, условия, заказы.',
    trend: '+12',
    trendDirection: 'up',
    trendLabel: 'за месяц',
    statusShort: '3 ожидают подтверждения',
    statusHref: '/brand/retailers?status=pending',
    addHref: '/brand/retailers?action=invite',
    addLabel: 'Пригласить',
    alertCount: 3,
    subline: '89 с заказами за 30 дн.',
    businessProcesses: [
      { label: 'Заказы B2B', href: '/brand/b2b-orders' },
      { label: 'Документы', href: '/brand/documents' },
      { label: 'Возвраты', href: '/brand/returns-claims' },
    ],
    roleInChain: 'sales',
    detailMetrics: [
      { label: 'С заказами за 30 дн.', value: '89', href: '/brand/b2b-orders' },
      { label: 'Новых за период', value: '12', href: '/brand/retailers' },
      { label: 'Договоров активно', value: '142', href: '/brand/documents' },
    ],
    tips: [
      'Условия оплаты и логистики по контрактам',
      'Регулярность заказов и план выкупа',
      'Возвраты и рекламации',
    ],
  },
  {
    id: 'distributors',
    label: 'Дистрибуторы',
    value: '18',
    href: '/brand/distributors',
    color: 'bg-sky-500',
    icon: Truck,
    description: 'Связи с дистрибуторами. Каналы поставок, логистика, охват регионов.',
    trend: '+3',
    trendDirection: 'up',
    trendLabel: 'за месяц',
    statusShort: '2 ожидают подтверждения',
    statusHref: '/brand/distributors?status=pending',
    addHref: '/brand/distributors?action=new',
    addLabel: 'Добавить',
    subline: '14 активных каналов',
    businessProcesses: [
      { label: 'Заказы B2B', href: '/brand/b2b-orders' },
      { label: 'Логистика', href: '/brand/logistics' },
    ],
    roleInChain: 'sales',
    detailMetrics: [
      { label: 'Активных каналов', value: '14', href: '/brand/distributors' },
      { label: 'Новых за период', value: '2', href: '/brand/distributors' },
      { label: 'Заказы B2B', value: '12', href: '/brand/b2b-orders' },
    ],
    tips: ['Территории и эксклюзивность', 'План отгрузок по каналам', 'Логистика до дистрибутора'],
  },
  {
    id: 'integrations',
    label: 'Интеграции',
    value: '3/9',
    href: '/brand/integrations',
    color: 'bg-amber-500',
    icon: Zap,
    description: 'Системы связи с партнёрами: 1С, ЭДО, маркетплейсы. Активных из доступных.',
    statusShort2: '6 доступно',
    statusHref2: '/brand/integrations',
    statusShort: '2 ожидают подключения',
    statusHref: '/brand/integrations',
    addHref: '/brand/integrations',
    addLabel: 'Подключить',
    progressValue: 3,
    progressMax: 9,
    businessProcesses: [
      { label: 'Склад и отгрузки', href: '/brand/warehouse' },
      { label: 'Документы (ЭДО)', href: '/brand/documents' },
    ],
    roleInChain: 'platform',
    detailMetrics: [
      { label: 'Активных', value: '3', href: '/brand/integrations' },
      { label: 'Доступно', value: '6', href: '/brand/integrations' },
    ],
    tips: ['Статус 1С и ЭДО', 'Синхрон остатков с маркетплейсами', 'Webhooks и API для партнёров'],
  },
];

/** Описание виджета «Требуют внимания» для иконки вопроса */
export const ATTENTION_WIDGET_DESCRIPTION =
  'Партнёры с открытыми задачами, документами на подпись, просроченными платежами или требующие проверки. Число и список зависят от выбранного периода (7 или 30 дней).';
export const ATTENTION_WIDGET_TIPS = [
  'Проверяйте партнёров на проверке',
  'Закрывайте просроченные документы',
  'Реагируйте на алерты по партнёрам',
];

/** Требуют внимания: количество и разбивка за период */
export const ATTENTION_BY_PERIOD: Record<
  '7d' | '30d',
  { total: number; items: { label: string; value: string; href: string }[] }
> = {
  '7d': {
    total: 2,
    items: [
      { label: 'Производства', value: '1', href: '/brand/factories?status=review' },
      { label: 'Магазины', value: '1', href: '/brand/retailers?status=pending' },
    ],
  },
  '30d': {
    total: 4,
    items: [
      { label: 'Производства', value: '1', href: '/brand/factories?status=review' },
      { label: 'Магазины', value: '3', href: '/brand/retailers?status=pending' },
    ],
  },
};

/** Рост числа партнёров по периодам (для виджета «Рост за период») */
export const PARTNER_GROWTH_BY_PERIOD: Record<
  '7d' | '30d',
  { total: number; items: { label: string; value: string; href: string }[] }
> = {
  '7d': {
    total: 8,
    items: [
      { label: 'Производства', value: '+1', href: '/brand/factories' },
      { label: 'Поставщики', value: '+2', href: '/brand/materials' },
      { label: 'Магазины', value: '+4', href: '/brand/retailers' },
      { label: 'Дистрибуторы', value: '+1', href: '/brand/distributors' },
    ],
  },
  '30d': {
    total: 22,
    items: [
      { label: 'Производства', value: '+2', href: '/brand/factories' },
      { label: 'Поставщики', value: '+5', href: '/brand/materials' },
      { label: 'Магазины', value: '+12', href: '/brand/retailers' },
      { label: 'Дистрибуторы', value: '+3', href: '/brand/distributors' },
    ],
  },
};

/** Подписи групп партнёров по роли в экосистеме */
export const PARTNER_ROLE_LABELS: Record<'supply' | 'sales' | 'platform', string> = {
  supply: 'Цепочка поставок',
  sales: 'Каналы продаж',
  platform: 'Связь и интеграции',
};

/** Порядок карточек по ролям (слева направо, горизонтально) */
export const PARTNER_ROLE_ORDER: Record<'supply' | 'sales' | 'platform', string[]> = {
  supply: ['factories', 'suppliers'],
  sales: ['retailers', 'distributors'],
  platform: ['integrations'],
};

/** Данные для интерактивного виджета справа от каждого блока (цепочка / каналы / связь) */
export interface PartnerRoleWidgetItem {
  label: string;
  value: string;
  href?: string;
}
export interface PartnerRoleWidget {
  title: string;
  summary?: string;
  items: PartnerRoleWidgetItem[];
  actions: { label: string; href: string }[];
  /** Доп. блок при раскрытии */
  expandLabel?: string;
  expandItems?: { label: string; href?: string }[];
}

export const PARTNER_ROLE_WIDGETS: Record<'supply' | 'sales' | 'platform', PartnerRoleWidget> = {
  supply: {
    title: 'В работе по цепочке',
    summary: 'Заказы, проверки, документы',
    items: [
      { label: 'Активных заказов', value: '5', href: '/brand/b2b-orders' },
      { label: 'Новых за период', value: '1', href: '/brand/factories' },
      { label: 'Договоров', value: '8', href: '/brand/documents' },
    ],
    actions: [
      { label: 'Добавить производство', href: '/brand/factories?action=new' },
      { label: 'Добавить поставщика', href: '/brand/materials?action=new' },
    ],
    expandLabel: 'Быстрые переходы',
    expandItems: [
      { label: 'Заказы на производство', href: '/brand/production' },
      { label: 'Закупки', href: '/brand/auctions' },
    ],
  },
  sales: {
    title: 'По каналам продаж',
    summary: 'Заказы, подтверждения, договоры',
    items: [
      { label: 'С заказами за 30 дн.', value: '89', href: '/brand/b2b-orders' },
      { label: 'Ожидают подтверждения', value: '3', href: '/brand/retailers?status=pending' },
      { label: 'Активных каналов', value: '14', href: '/brand/distributors' },
    ],
    actions: [
      { label: 'Пригласить магазин', href: '/brand/retailers?action=invite' },
      { label: 'Добавить дистрибутора', href: '/brand/distributors?action=new' },
    ],
    expandLabel: 'Быстрые переходы',
    expandItems: [
      { label: 'Заказы B2B', href: '/brand/b2b-orders' },
      { label: 'Возвраты от партнёров', href: '/brand/returns-claims' },
    ],
  },
  platform: {
    title: 'Подключения',
    summary: '3 из 9 активно',
    items: [
      { label: 'Активных', value: '3', href: '/brand/integrations' },
      { label: 'Доступно', value: '6', href: '/brand/integrations' },
    ],
    actions: [{ label: 'Подключить интеграцию', href: '/brand/integrations' }],
    expandLabel: 'Типы интеграций',
    expandItems: [
      { label: '1С', href: '/brand/integrations' },
      { label: 'ЭДО', href: '/brand/documents' },
      { label: 'Маркетплейсы', href: '/brand/integrations' },
    ],
  },
};

/** Блоки экосистемы: контракты, финансы, качество, логистика, задачи, аналитика */
export interface PartnerEcosystemBlock {
  id: string;
  title: string;
  /** Заголовок в две строки [первая, вторая], как «Качество и рекламации» */
  titleLines?: [string, string];
  description: string;
  href: string;
  /** Иконка блока (как в Связь с процессами) */
  icon: LucideIcon;
  /** Цвет фона иконки: bg-text-secondary, bg-blue-500 и т.д. */
  color: string;
  /** Изменение за 7 дн., % */
  changePct7d?: number;
  /** Изменение за 30 дн., % */
  changePct30d?: number;
  /** Метрики по умолчанию (или за 30 дн.) */
  metrics: { label: string; value: string; href?: string }[];
  /** Метрики за 7 дн. — если есть, подставляются при выборе периода 7 дней */
  metrics7d?: { label: string; value: string; href?: string }[];
  /** Метрики за 30 дн. — если есть, подставляются при выборе периода 30 дней */
  metrics30d?: { label: string; value: string; href?: string }[];
  /** Количество требующих внимания за период (бейдж) */
  alertCount?: number;
  alertCount7d?: number;
  alertCount30d?: number;
  /** Подсказка при наведении на красный бейдж: что в нём */
  alertTooltip?: string;
  /** Ссылка на действие «добавить» */
  addHref?: string;
  /** Текст кнопки: Добавить, Создать заказ и т.д. */
  addLabel?: string;
}

export const PARTNER_ECOSYSTEM_BLOCKS: PartnerEcosystemBlock[] = [
  {
    id: 'contracts-docs',
    title: 'Контракты и документы',
    titleLines: ['Контракты', 'и документы'],
    description:
      'Договоры, спецификации, акты с партнёрами. Срок действия, на подпись, истекающие.',
    href: '/brand/documents',
    icon: FileText,
    color: 'bg-text-secondary',
    changePct7d: 0,
    changePct30d: 100,
    alertCount: 2,
    alertCount7d: 1,
    alertCount30d: 2,
    alertTooltip: 'Документы на подпись, истекающие в ближайшее время',
    addHref: '/brand/documents?action=new',
    addLabel: 'Добавить',
    metrics: [
      { label: 'На подпись', value: '2', href: '/brand/documents?status=pending' },
      { label: 'Истекают в 30 дн.', value: '5', href: '/brand/documents?expiring=30' },
      { label: 'Активных договоров', value: '192', href: '/brand/documents' },
    ],
    metrics7d: [
      { label: 'На подпись за 7 дн.', value: '1', href: '/brand/documents?status=pending' },
      { label: 'Истекают в 30 дн.', value: '5', href: '/brand/documents?expiring=30' },
      { label: 'Активных договоров', value: '192', href: '/brand/documents' },
    ],
    metrics30d: [
      { label: 'На подпись за 30 дн.', value: '2', href: '/brand/documents?status=pending' },
      { label: 'Истекают в 30 дн.', value: '5', href: '/brand/documents?expiring=30' },
      { label: 'Активных договоров', value: '192', href: '/brand/documents' },
    ],
  },
  {
    id: 'finance-settlements',
    title: 'Финансы и расчёты',
    titleLines: ['Финансы', 'и расчёты'],
    description: 'Дебиторка по партнёрам, платёжные условия, выверки, просроченные платежи.',
    href: '/brand/finance',
    icon: CreditCard,
    color: 'bg-emerald-500',
    changePct7d: 5,
    changePct30d: -2,
    alertCount: 1,
    alertCount7d: 0,
    alertCount30d: 1,
    alertTooltip: 'Просроченные платежи, партнёры на выверке',
    addHref: '/brand/finance',
    addLabel: 'Выверка',
    metrics: [
      { label: 'К получению', value: '2,4 млн ₽', href: '/brand/finance' },
      { label: 'Просрочено', value: '1', href: '/brand/finance?overdue=1' },
      { label: 'На выверке', value: '3 партнёра', href: '/brand/finance' },
    ],
    metrics7d: [
      { label: 'К получению за 7 дн.', value: '0,8 млн ₽', href: '/brand/finance' },
      { label: 'Просрочено', value: '0', href: '/brand/finance?overdue=1' },
      { label: 'На выверке', value: '1 партнёр', href: '/brand/finance' },
    ],
    metrics30d: [
      { label: 'К получению за 30 дн.', value: '2,4 млн ₽', href: '/brand/finance' },
      { label: 'Просрочено', value: '1', href: '/brand/finance?overdue=1' },
      { label: 'На выверке', value: '3 партнёра', href: '/brand/finance' },
    ],
  },
  {
    id: 'quality-claims',
    title: 'Качество и рекламации',
    titleLines: ['Качество', 'и рекламации'],
    description: 'Возвраты, претензии, инциденты качества по партнёрам.',
    href: '/brand/returns-claims',
    icon: RotateCcw,
    color: 'bg-amber-500',
    changePct7d: 25,
    changePct30d: 15,
    alertCount: 5,
    alertCount7d: 2,
    alertCount30d: 5,
    alertTooltip: 'Открытые возвраты и рекламации от партнёров',
    addHref: '/brand/returns-claims?action=new',
    addLabel: 'Оформить возврат',
    metrics: [
      { label: 'Открытых возвратов', value: '5', href: '/brand/returns-claims' },
      { label: 'Рекламаций за месяц', value: '2', href: '/brand/returns-claims' },
      { label: 'Партнёров с претензиями', value: '3', href: '/brand/returns-claims' },
    ],
    metrics7d: [
      { label: 'Возвратов за 7 дн.', value: '2', href: '/brand/returns-claims' },
      { label: 'Рекламаций за 7 дн.', value: '1', href: '/brand/returns-claims' },
      { label: 'Партнёров с претензиями', value: '2', href: '/brand/returns-claims' },
    ],
    metrics30d: [
      { label: 'Возвратов за 30 дн.', value: '5', href: '/brand/returns-claims' },
      { label: 'Рекламаций за 30 дн.', value: '2', href: '/brand/returns-claims' },
      { label: 'Партнёров с претензиями', value: '3', href: '/brand/returns-claims' },
    ],
  },
  {
    id: 'logistics-shipments',
    title: 'Логистика и отгрузки',
    titleLines: ['Логистика', 'и отгрузки'],
    description: 'Отгрузки в пути, склады партнёров, сроки доставки, задержки.',
    href: '/brand/logistics',
    icon: Truck,
    color: 'bg-sky-500',
    changePct7d: 33,
    changePct30d: 20,
    addHref: '/brand/b2b-orders',
    addLabel: 'К отгрузке',
    metrics: [
      { label: 'В пути', value: '18', href: '/brand/logistics' },
      { label: 'К отгрузке', value: '12', href: '/brand/b2b-orders' },
      { label: 'Задержки', value: '0', href: '/brand/logistics' },
    ],
    metrics7d: [
      { label: 'В пути за 7 дн.', value: '5', href: '/brand/logistics' },
      { label: 'К отгрузке за 7 дн.', value: '4', href: '/brand/b2b-orders' },
      { label: 'Задержки', value: '0', href: '/brand/logistics' },
    ],
    metrics30d: [
      { label: 'В пути за 30 дн.', value: '18', href: '/brand/logistics' },
      { label: 'К отгрузке за 30 дн.', value: '12', href: '/brand/b2b-orders' },
      { label: 'Задержки', value: '0', href: '/brand/logistics' },
    ],
  },
  {
    id: 'tasks-actions',
    title: 'Задачи и действия',
    titleLines: ['Задачи', 'и действия'],
    description: 'Открытые задачи по партнёрам, просроченные действия.',
    href: '/brand/team?tab=tasks',
    icon: CheckSquare,
    color: 'bg-emerald-500',
    changePct7d: 50,
    changePct30d: 14,
    alertCount: 2,
    alertCount7d: 1,
    alertCount30d: 2,
    alertTooltip: 'Просроченные задачи по партнёрам',
    addHref: '/brand/team?tab=tasks&action=new',
    addLabel: 'Добавить задачу',
    metrics: [
      { label: 'Открытых задач', value: '8', href: '/brand/team?tab=tasks' },
      { label: 'Просрочено', value: '2', href: '/brand/team?tab=tasks&overdue=1' },
      { label: 'По партнёрам', value: '6', href: '/brand/team?tab=tasks' },
    ],
    metrics7d: [
      { label: 'Задач за 7 дн.', value: '3', href: '/brand/team?tab=tasks' },
      { label: 'Просрочено за 7 дн.', value: '1', href: '/brand/team?tab=tasks&overdue=1' },
      { label: 'По партнёрам за 7 дн.', value: '2', href: '/brand/team?tab=tasks' },
    ],
    metrics30d: [
      { label: 'Задач за 30 дн.', value: '8', href: '/brand/team?tab=tasks' },
      { label: 'Просрочено за 30 дн.', value: '2', href: '/brand/team?tab=tasks&overdue=1' },
      { label: 'По партнёрам за 30 дн.', value: '6', href: '/brand/team?tab=tasks' },
    ],
  },
  {
    id: 'partner-analytics',
    title: 'Аналитика по партнёрам',
    titleLines: ['Аналитика', 'по партнёрам'],
    description: 'Топ по объёму, план/факт, доля в выручке по каналам.',
    href: '/brand/retailers',
    icon: TrendingUp,
    color: 'bg-accent-primary',
    changePct7d: 3,
    changePct30d: 12,
    addHref: '/brand/retailers',
    addLabel: 'Отчёт',
    metrics: [
      { label: 'Топ-10 партнёров', value: '—', href: '/brand/retailers' },
      { label: 'План/факт', value: '94%', href: '/brand/retailers' },
      { label: 'Рост за месяц', value: '+12%', href: '/brand/retailers' },
    ],
    metrics7d: [
      { label: 'Топ за 7 дн.', value: '—', href: '/brand/retailers' },
      { label: 'План/факт за 7 дн.', value: '96%', href: '/brand/retailers' },
      { label: 'Рост за 7 дн.', value: '+3%', href: '/brand/retailers' },
    ],
    metrics30d: [
      { label: 'Топ за 30 дн.', value: '—', href: '/brand/retailers' },
      { label: 'План/факт за 30 дн.', value: '94%', href: '/brand/retailers' },
      { label: 'Рост за 30 дн.', value: '+12%', href: '/brand/retailers' },
    ],
  },
];
