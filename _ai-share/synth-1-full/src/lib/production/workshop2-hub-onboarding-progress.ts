/**
 * Прогресс онбординга хаба Workshop2 — роль и первый артикул (без завышения «готово»).
 */

export type Workshop2HubOnboardingRole = 'designer' | 'technologist' | 'manager';

export type Workshop2HubOnboardingProgressInput = {
  role: Workshop2HubOnboardingRole;
  /** PostgreSQL / справочники из API setup. */
  pgStatus: 'ok' | 'disabled' | 'fallback' | 'unknown';
  /** Есть хотя бы одна строка артикула в активной коллекции. */
  hasArticle: boolean;
  /** Пользователь открывал workspace артикула (localStorage флаг). */
  openedWorkspace?: boolean;
};

export type Workshop2HubOnboardingChecklistItem = {
  id: string;
  labelRu: string;
  done: boolean;
  hintRu?: string;
};

const ROLE_FOCUS: Record<Workshop2HubOnboardingRole, { step2Hint: string; step3Hint: string }> = {
  designer: {
    step2Hint: 'Заполните визуал, референсы и замысел — это база для технолога.',
    step3Hint: 'На вкладке «Техническое задание» проверьте паспорт и визуальный блок.',
  },
  technologist: {
    step2Hint: 'Выберите категорию L1–L3 — подтянутся POM и конструкция.',
    step3Hint: 'Заполните табель мер и BOM перед handoff в цех.',
  },
  manager: {
    step2Hint: 'Следите за pulse готовности на карточке артикула.',
    step3Hint: 'Handoff checklist и подписи — перед передачей в производство.',
  },
};

export function workshop2HubOnboardingRoleHint(role: Workshop2HubOnboardingRole): string {
  return ROLE_FOCUS[role].step2Hint;
}

export function buildWorkshop2HubOnboardingChecklist(
  input: Workshop2HubOnboardingProgressInput
): Workshop2HubOnboardingChecklistItem[] {
  const pgOk = input.pgStatus === 'ok';
  return [
    {
      id: 'pg',
      labelRu: 'PostgreSQL и справочники',
      done: pgOk,
      hintRu: pgOk
        ? 'Досье и события сохраняются на сервере.'
        : input.pgStatus === 'disabled'
          ? 'WORKSHOP2_DATABASE_URL не задан — только localStorage.'
          : 'Fallback на seeds — проверьте setup.',
    },
    {
      id: 'article',
      labelRu: 'Первый артикул в коллекции',
      done: input.hasArticle,
      hintRu: ROLE_FOCUS[input.role].step2Hint,
    },
    {
      id: 'workspace',
      labelRu: 'Workspace артикула открыт',
      done: Boolean(input.openedWorkspace),
      hintRu: ROLE_FOCUS[input.role].step3Hint,
    },
  ];
}

export function computeWorkshop2HubOnboardingProgressPct(
  items: Workshop2HubOnboardingChecklistItem[]
): number {
  if (items.length === 0) return 0;
  const done = items.filter((i) => i.done).length;
  return Math.round((done / items.length) * 100);
}
