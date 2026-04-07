/**
 * LIVE process — поэтапные схемы с назначением ответственных, доступом, датами, календарём, чатами и задачами.
 */

export type StageStatus = 'not_started' | 'in_progress' | 'done';

/** Участник команды (для назначения ответственных и управления доступом). */
export interface LiveProcessTeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
}

/** Упоминание @user в комментарии */
export interface CommentMention {
  userId: string;
  userName: string;
  /** Позиция в body: "@Анна Иванова" */
  match: string;
}

/** Комментарий к этапу (= сообщение в чате этапа) */
export interface LiveProcessComment {
  id: string;
  stageId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  /** @mentions для уведомлений */
  mentions?: CommentMention[];
}

/** Событие календаря (связано с этапом процесса) */
export interface ProcessCalendarEvent {
  id: string;
  processId: string;
  contextId: string;
  stageId: string;
  title: string;
  startAt: string;
  endAt: string;
  /** Обратная связь с runtime */
  stageRuntimeKey: string;
}

/** Задача по этапу. */
export interface LiveProcessTask {
  id: string;
  stageId: string;
  title: string;
  done: boolean;
  assigneeId?: string;
  dueAt?: string;
  createdAt: string;
}

/** Заметка к этапу. */
export interface LiveProcessNote {
  stageId: string;
  content: string;
  updatedAt: string;
}

/** Данные этапа в контексте процесса (ответственный, доступы, даты, чат, комментарии, задачи). */
export interface LiveProcessStageRuntime {
  stageId: string;
  status: StageStatus;
  /** @deprecated Используйте assigneeIds. Оставлено для обратной совместимости при загрузке. */
  assigneeId?: string | null;
  /** ID ответственных (можно назначить несколько человек). */
  assigneeIds: string[];
  /** ID главного ответственного (должен быть в assigneeIds). */
  primaryAssigneeId: string | null;
  /** ID участников, которым заблокирован доступ к этому этапу. */
  blockedMemberIds: string[];
  plannedStartAt: string | null;
  plannedEndAt: string | null;
  calendarEventId: string | null;
  chatId: string | null;
  /** Участники чата/обсуждения этапа (подмножество команды). */
  participantIds: string[];
  comments: LiveProcessComment[];
  tasks: LiveProcessTask[];
  note: LiveProcessNote | null;
  /** Количество связанных сущностей (артикулы, PO, заказы) — из API/БД */
  entityCounts?: Record<string, number>;
}

/** Условное ветвление: куда перейти при выполнении условия */
export interface StageBranch {
  condition: string;
  targetStageId: string;
  label?: string;
}

/** Связь этапа с сущностями (артикулы, PO, заказы) */
export interface StageEntityLink {
  entityType: 'articles' | 'po' | 'orders' | 'shipments' | 'batches';
  /** Текстовое отображение в карточке, напр. "артикулов: N" */
  labelKey?: string;
}

/** SLA/дедлайн этапа */
export interface StageSla {
  /** Макс. дней на этап (null = без ограничения) */
  maxDays?: number | null;
  /** Описание, напр. "не более 3 дней" */
  description?: string;
  /** Жёсткий дедлайн (дата) — для runtime */
  hardDeadlineAt?: string | null;
}

/** Определение этапа в схеме процесса (шаблон). */
export interface LiveProcessStageDef {
  id: string;
  title: string;
  description: string;
  area: string;
  mandatory?: boolean;
  dependsOn: string[];
  href?: string;
  /** Порядок в схеме (для сортировки) */
  order?: number;
  /** SLA и дедлайны */
  sla?: StageSla;
  /** Условные ветвления: если условие выполнено → переход на targetStageId */
  branches?: StageBranch[];
  /** Подпроцесс: вложенные этапы (например, Сэмплы с Proto/Fit/Gold) */
  subprocess?: LiveProcessDefinition;
  /** Связи с сущностями для отображения "артикулов: N", "заказов: M" */
  entityLinks?: StageEntityLink[];
  /** Роли по этапу: кто может менять статус, назначать, видеть */
  roles?: StageRole[];
  /** Согласование: этап "на согласовании" с воронкой апруверов */
  approval?: StageApproval;
  /** Эскроу: блокировать переход до выполнения условий */
  blockUntilConditions?: string[];
}

/** Определение процесса (набор этапов). */
export interface LiveProcessDefinition {
  id: string;
  name: string;
  description: string;
  stages: LiveProcessStageDef[];
  /** Ключ контекста: collectionId | orderId | shipmentId и т.д. */
  contextKey?: string;
  /** Мета: шаблон, индустрия, тип бизнеса */
  meta?: {
    industry?: string;
    businessType?: string;
    templateId?: string;
    isTemplate?: boolean;
  };
  /** Связи с другими процессами (цепочки) */
  processLinks?: ProcessLink[];
}

/** Индустрия / тип бизнеса для библиотеки шаблонов */
export type ProcessIndustry = 'fast_fashion' | 'luxury' | 'made_to_order' | 'sportswear' | 'accessories' | 'multi_brand' | 'wholesale' | 'generic';
export type ProcessBusinessType = 'production' | 'b2b' | 'logistics' | 'sourcing' | 'qc' | 'finance' | 'compliance' | 'approval';

// ─── 2.1 Контекст и мультиинстанс ───────────────────────────────────────────

/** Тип контекста процесса */
export type ProcessContextType = 'collection' | 'order' | 'rfq' | 'shipment' | 'deal' | 'batch';

/** Реальный контекст (коллекция, заказ, RFQ и т.д.) */
export interface ProcessContext {
  id: string;
  type: ProcessContextType;
  label: string;
  /** Доп. мета: сезон, фабрика и т.д. */
  meta?: Record<string, string>;
}

/** Параллельный инстанс процесса (FW26, SS27, RFQ-123) */
export interface ProcessInstance {
  id: string;
  processId: string;
  contextId: string;
  context: ProcessContext;
  createdAt: string;
  updatedAt?: string;
}

/** Связь между процессами: при завершении этапа A → создать/запустить в процессе B */
export interface ProcessLink {
  sourceProcessId: string;
  sourceStageId: string;
  targetProcessId: string;
  /** Куда перейти в целевом процессе (stageId или 'start') */
  targetStageId?: string;
  /** Условие срабатывания (опционально) */
  condition?: string;
}

// ─── 2.2 Роли и права ───────────────────────────────────────────────────────

/** Роль на этапе: кто может менять статус, назначать, видеть */
export interface StageRole {
  roleId: string;
  /** canChangeStatus | canAssign | canView | canApprove */
  permissions: ('change_status' | 'assign' | 'view' | 'approve' | 'edit_dates')[];
}

/** Согласование: воронка апруверов */
export interface StageApproval {
  /** Этап требует согласования */
  required: boolean;
  /** Последовательность апруверов (один или несколько) */
  approverIds: string[];
  /** Текущий индекс в воронке */
  currentApproverIndex?: number;
  /** Эскроу: блокировать переход до выполнения условий */
  blockUntilConditions?: string[];
}

// ─── 2.3 Метрики и аналитика ────────────────────────────────────────────────

/** Метрики этапа (среднее время, узкие места) */
export interface StageMetrics {
  stageId: string;
  avgDays: number;
  medianDays?: number;
  totalCompleted: number;
  overdueCount: number;
  /** % просроченных */
  overduePct: number;
}

/** KPI процесса */
export interface ProcessKpi {
  onTimePct: number;
  avgCycleDays: number;
  overdueInstances: number;
  stagesWithoutAssignee: number;
}

// ─── 2.4 Уведомления и автоматизация ────────────────────────────────────────

/** Напоминание */
export interface ProcessReminder {
  id: string;
  type: 'overdue' | 'no_assignee' | 'approval_pending' | 'sla_at_risk';
  processId: string;
  contextId: string;
  stageId?: string;
  message: string;
  createdAt: string;
  dismissed?: boolean;
}

/** Триггер при смене статуса */
export interface ProcessTrigger {
  id: string;
  triggerEvent: 'stage_status_change' | 'stage_completed' | 'assignee_changed';
  actions: ('send_email' | 'create_calendar_event' | 'webhook')[];
  webhookUrl?: string;
  config?: Record<string, unknown>;
}

// Extend LiveProcessStageDef with roles and approval
