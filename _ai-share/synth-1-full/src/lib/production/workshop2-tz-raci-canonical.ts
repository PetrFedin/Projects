/**
 * Канон: кто ведёт данные и подписи на этапах воркспейса артикула.
 * Согласовано с `Workshop2TzSignoffStageId` и разделами ТЗ; не дублирует сами данные в досье.
 *
 * Правило для подписей: цифровая подпись ожидается только у ролей, у которых в паспорте
 * для данного этапа не снят флаг (см. W2PassportTzStagesPick). «Лишних» не ждём —
 * участие задаётся закреплением и чекбоксами этапов, а не списком всех менеджеров.
 */
import type { Workshop2ArticleMainTab } from '@/lib/production/workshop2-collection-metrics';
import type {
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
/**
 * Intentionally empty: no long RACI copy in the product UI. Section ownership for signatures is
 * handled in `w2-tz-section-signer-filter.ts` + паспорт (этап «ТЗ»).
 */
export const W2_RACI_MAIN_TAB_LINE: Record<
  Exclude<Workshop2ArticleMainTab, 'overview'>,
  string
> = {
  tz: '',
  supply: '',
  fit: '',
  plan: '',
  release: '',
  qc: '',
  stock: '',
  vault: '',
};

export const W2_RACI_TZ_SECTION_LINE: Record<Workshop2TzPanelSectionId, string> = {
  general: '',
  visuals: '',
  material: '',
  construction: '',
  assignment: '',
};

/** Пояснение к этапам цифровой подписи в паспорте (чекбоксы у роли). */
export const W2_RACI_TZ_SIGNOFF_STAGE_LINE: Record<Workshop2TzSignoffStageId, string> = {
  tz: 'ТЗ: согласование досье до передачи в образец/снабжение — дизайн, технолог, менеджер изделия, если на них подпись включена; иначе не ждём.',
  sample: 'Образец/пилот: согласование готовности прототипа — бренд+технолог; поставщик/цех — в объёме передачи, не весь ТЗ.',
  supply: 'Снабжение: закреплённые снабжение/PD/поставщик; бренд — только в части бренд-стопов.',
  fit: 'Посадка/эталон: дизайн+технолог+зона, ответственная за примерку; без лишних согласующих вне паспорта.',
  plan: 'План: план+снабжение+производство; бренд — окно даты/объёма.',
  release: 'Выпуск/цех: производственный периметр; бренд — внеплановые остановки по соглашению.',
  qc: 'ОТК: ОТК и (по дефолту) бренд на критичных отклонениях, если в паспорте оставлен этап.',
};

type MainTabRaci = Exclude<Workshop2ArticleMainTab, 'overview'>;

export function w2RaciLineForMainTab(tab: Workshop2ArticleMainTab): string {
  const t: MainTabRaci = tab === 'overview' ? 'tz' : tab;
  return W2_RACI_MAIN_TAB_LINE[t];
}

/** Intentionally empty: dialog «Подписанты» only lists the passport matrix; no in-dialog RACI essays. */
export const W2_RACI_SIGNATORY_HELP_SECTIONS: readonly { title: string; body: string }[] = [];
