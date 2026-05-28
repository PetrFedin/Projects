import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzAttrComment } from '@/lib/production/workshop2-attr-comments-storage';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';

/**
 * Блоки ТЗ для комментариев с карточки артикула (превью паспорта): id совпадает с ключом в `attrCommentsById`.
 */
export const W2_ARTICLE_TZ_BLOCK_COMMENT_DEFS: readonly {
  readonly id: string;
  /** Полное название темы */
  readonly label: string;
  /** Короткая подпись на бейдже превью */
  readonly pillLabel: string;
  readonly section: DossierSection;
  readonly scrollDomId?: string;
}[] = [
  {
    id: 'w2-block-assignment',
    label: 'Отправка',
    pillLabel: 'Отпр.',
    section: 'assignment',
    scrollDomId: W2_CONSTRUCTION_SUBPAGE_ANCHORS.send,
  },
  {
    id: 'w2-block-construction-sample',
    label: 'Базовые параметры сэмпла / лекало',
    pillLabel: 'Сэмпл',
    section: 'construction',
    scrollDomId: W2_CONSTRUCTION_SUBPAGE_ANCHORS.hub,
  },
  {
    id: 'w2-block-material',
    label: 'Материал и состав',
    pillLabel: 'Мат.',
    section: 'material',
    scrollDomId: 'w2-material-hub',
  },
  {
    id: 'w2-block-visual-refs',
    label: 'Референсы',
    pillLabel: 'Реф.',
    section: 'general',
    scrollDomId: 'w2-passport-visual-refs',
  },
  {
    id: 'w2-block-brand-notes',
    label: 'Дизайнерский замысел',
    pillLabel: 'Зам.',
    section: 'general',
    scrollDomId: 'w2-attr-brandNotes',
  },
  {
    id: 'w2-block-visuals',
    label: 'Визуал',
    pillLabel: 'Виз.',
    section: 'construction',
    scrollDomId: 'w2-tz-section-signoff-visuals',
  },
  {
    id: 'w2-block-passport',
    label: 'Паспорт артикула',
    pillLabel: 'Пасп.',
    section: 'general',
    scrollDomId: 'w2-passport-hub',
  },
] as const;

export type W2TzBlockCommentMetrics = { total: number; openCritical: number };

export function computeW2TzBlockCommentMetrics(
  map: Record<string, Workshop2TzAttrComment[] | undefined>,
  ids: readonly string[]
): Record<string, W2TzBlockCommentMetrics> {
  return Object.fromEntries(
    ids.map((id) => {
      const rows = map[id] ?? [];
      const openCritical = rows.filter(
        (r) => r.severity === 'critical' && (r.status ?? 'open') !== 'resolved'
      ).length;
      return [id, { total: rows.length, openCritical }];
    })
  );
}

export const W2_PREVIEW_PASSPORT_IMAGE_COMMENT_IDS: readonly string[] = [
  'w2-block-visual-refs',
  'w2-block-brand-notes',
  'w2-block-visuals',
];

export const W2_PREVIEW_PASSPORT_HEADER_COMMENT_IDS: readonly string[] = ['w2-block-passport'];

export const W2_PREVIEW_PASSPORT_TAIL_COMMENT_IDS: readonly string[] = [
  'w2-block-material',
  'w2-block-construction-sample',
  'w2-block-assignment',
];

export function w2FindTzBlockCommentDef(
  id: string
): (typeof W2_ARTICLE_TZ_BLOCK_COMMENT_DEFS)[number] | undefined {
  return W2_ARTICLE_TZ_BLOCK_COMMENT_DEFS.find((d) => d.id === id);
}
