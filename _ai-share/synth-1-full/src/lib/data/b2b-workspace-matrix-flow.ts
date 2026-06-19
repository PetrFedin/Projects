import type { DigitalFlowId } from '@/lib/data/b2b-workspace-matrix.types';

export const DIGITAL_WORKSPACE_CONNECTIONS = [
  {
    from: 'pim',
    to: 'showroom-360',
    label: 'ДАННЫЕ -> 3D',
    desc: 'Автоматическая синхронизация характеристик товара с 3D-шоурумом.',
  },
  {
    from: 'pim',
    to: 'merch',
    label: 'PIM -> RACK',
    desc: 'Наполнение цифровых рейлов актуальными данными из PIM-системы.',
  },
  {
    from: 'planning',
    to: 'collab-buying',
    label: 'ПЛАН -> ЗАКУПКИ',
    desc: 'Передача утвержденной матрицы планирования в среду командного отбора.',
  },
  {
    from: 'prod-pulse',
    to: 'logistics',
    label: 'ЗАВОД -> ТРЕКИНГ',
    desc: 'Автоматическое создание логистической заявки при выходе партии из производства.',
  },
  {
    from: 'ats',
    to: 'merch',
    label: 'СТОК -> RACK',
    desc: 'Отображение доступности товаров на цифровых витринах в реальном времени.',
  },
  {
    from: 'financing',
    to: 'contracts',
    label: 'ОПЛАТА -> ПРАВО',
    desc: 'Генерация финансовых соглашений при одобрении кредитной линии.',
  },
  {
    from: 'leads',
    to: 'crm',
    label: 'ЛИДЫ -> CRM',
    desc: 'Автоматическая конвертация успешных лидов в карточки партнеров в CRM.',
  },
  {
    from: 'supplier-discovery',
    to: 'b2b-rfq',
    label: 'ПОИСК -> RFQ',
    desc: 'От профиля поставщика — в запрос котировки с реквизитами и требованиями.',
  },
  {
    from: 'fulfillment-dashboard',
    to: 'logistics',
    label: 'SLA -> ТРЕКИНГ',
    desc: 'Проблемные заказы из fulfillment ведут в сквозной трекинг поставок.',
  },
] as const;

export const FLOW_CONFIG: Record<DigitalFlowId, { label: string; color: string; bgColor: string }> =
  {
    intelligence: {
      label: 'Интеллект и Аналитика',
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
    },
    ops: { label: 'Операции и Коллаборация', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    commercial: {
      label: 'Коммерция и Продажи',
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
    },
    supply: { label: 'Цепочки Поставок', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  };
