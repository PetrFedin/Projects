import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import type { W2ProductionPreflightIssue } from './workshop2-production-preflight';

export type W2AiConflictRule = {
  /** Уникальный идентификатор конфликта */
  id: string;
  /** Опционально: Фильтр по уровню 1 каталога (например, 'Одежда', 'Обувь', 'Сумки') */
  targetL1?: string[];
  /** Опционально: Фильтр по уровню 2 каталога */
  targetL2?: string[];
  /** Опционально: Фильтр по уровню 3 каталога */
  targetL3?: string[];
  /** Функция возвращает true, если конфликт обнаружен (правило срабатывает) */
  checkConflict: (
    dossier: Workshop2DossierPhase1,
    leaf?: { l1: string; l2: string; l3: string }
  ) => boolean;
  severity: 'warning' | 'blocker';
  section: 'passport' | 'visuals' | 'materials' | 'construction' | 'sketch' | 'handoff';
  label: string;
  detail: string;
  anchor?: string;
};

/**
 * Справочник возможных конфликтов (Cross-check Registry).
 * Описывает бизнес-логику несовместимостей атрибутов (например, материал vs фурнитура).
 */
export const W2_PREFLIGHT_AI_CONFLICTS: W2AiConflictRule[] = [
  {
    id: 'ai.inconsistency.silk_with_heavy_needle',
    targetL1: ['Одежда'],
    checkConflict: (d) => {
      const hasSilk = d.assignments.some(
        (a) =>
          a.attributeId === 'composition' &&
          a.values.some(
            (v) =>
              v.text?.toLowerCase().includes('шелк') || v.text?.toLowerCase().includes('шифон')
          )
      );
      const hasHeavySeam = d.assignments.some(
        (a) =>
          (a.attributeId === 'seam_type' || a.attributeId === 'needle_type') &&
          a.values.some(
            (v) =>
              v.text?.toLowerCase().includes('толстая') ||
              v.text?.toLowerCase().includes('деним') ||
              v.text?.toLowerCase().includes('heavy')
          )
      );
      return hasSilk && hasHeavySeam;
    },
    severity: 'warning',
    section: 'construction',
    label: 'AI: Легкая ткань + грубый шов',
    detail:
      'Выбран тонкий материал (шелк/шифон), но указаны узлы/иглы для плотных тканей.',
    anchor: 'construction',
  },
  {
    id: 'ai.inconsistency.shoes_winter_without_insulation',
    targetL1: ['Обувь'],
    checkConflict: (d) => {
      const isWinter = d.assignments.some(
        (a) =>
          a.attributeId === 'season' &&
          a.values.some((v) => v.text?.toLowerCase().includes('зим'))
      );
      const hasNoInsulation = !d.assignments.some(
        (a) => a.attributeId === 'insulationMaterialOptions' && a.values.length > 0
      );
      return isWinter && hasNoInsulation;
    },
    severity: 'warning',
    section: 'materials',
    label: 'AI: Зимняя обувь без утеплителя',
    detail:
      'Для зимнего сезона не указан материал утеплителя в спецификации материалов обуви.',
    anchor: 'materials',
  },
  {
    id: 'ai.inconsistency.bags_heavy_load_weak_handles',
    targetL1: ['Сумки'],
    targetL2: ['Дорожные сумки', 'Рюкзаки'],
    checkConflict: (d) => {
      const hasWeakStitching = d.assignments.some(
        (a) =>
          a.attributeId === 'stitchingOptionsByCategory' &&
          a.values.some(
            (v) =>
              v.text?.toLowerCase().includes('одинарная') ||
              v.text?.toLowerCase().includes('обычная')
          )
      );
      return hasWeakStitching;
    },
    severity: 'warning',
    section: 'construction',
    label: 'AI: Слабое крепление ручек для тяжелой сумки',
    detail:
      'Для рюкзака или дорожной сумки выбрана простая строчка. Рекомендуется усиленное (крестообразное) крепление.',
    anchor: 'construction',
  },
  {
    id: 'ai.inconsistency.white_fabric_dark_lining',
    checkConflict: (d) => {
      const isWhiteMain = d.assignments.some(
        (a) =>
          (a.attributeId === 'primaryColorFamilyOptions' || a.attributeId === 'color') &&
          a.values.some(
            (v) =>
              v.text?.toLowerCase().includes('бел') ||
              v.text?.toLowerCase().includes('светл')
          )
      );
      const isDarkLining = d.assignments.some(
        (a) =>
          a.attributeId === 'liningOptionsByCategory' &&
          a.values.some(
            (v) =>
              v.text?.toLowerCase().includes('черн') ||
              v.text?.toLowerCase().includes('темн')
          )
      );
      return isWhiteMain && isDarkLining;
    },
    severity: 'warning',
    section: 'materials',
    label: 'AI: Светлый верх и темная подкладка',
    detail:
      'Выбран светлый основной цвет, но темная подкладка. Возможен прокрас основного материала после стирки.',
    anchor: 'materials',
  },
  {
    id: 'ai.inconsistency.leather_care_washable',
    checkConflict: (d) => {
      const isLeather = d.assignments.some(
        (a) =>
          a.attributeId === 'composition' &&
          a.values.some(
            (v) =>
              v.text?.toLowerCase().includes('кожа') ||
              v.text?.toLowerCase().includes('leather')
          )
      );
      const isMachineWashable = d.assignments.some(
        (a) =>
          a.attributeId === 'careWashingClassOptions' &&
          a.values.some((v) => v.text?.toLowerCase().includes('машинная стирка'))
      );
      return isLeather && isMachineWashable;
    },
    severity: 'blocker',
    section: 'materials',
    label: 'AI: Кожа и машинная стирка',
    detail:
      'Указана машинная стирка для изделия из кожи. Это недопустимо для натуральной кожи (только химчистка).',
    anchor: 'materials',
  },
];

/**
 * Запуск всех проверок по справочнику конфликтов для конкретного досье
 */
export function runWorkshop2AiConflictChecks(
  dossier: Workshop2DossierPhase1,
  leaf?: { l1Name: string; l2Name: string; l3Name: string }
): W2ProductionPreflightIssue[] {
  const issues: W2ProductionPreflightIssue[] = [];
  const normalizedLeaf = leaf
    ? {
        l1: leaf.l1Name || '',
        l2: leaf.l2Name || '',
        l3: leaf.l3Name || '',
      }
    : undefined;

  for (const rule of W2_PREFLIGHT_AI_CONFLICTS) {
    if (rule.targetL1 && rule.targetL1.length > 0) {
      if (
        !normalizedLeaf ||
        !rule.targetL1.some((l1) =>
          normalizedLeaf.l1.toLowerCase().includes(l1.toLowerCase())
        )
      ) {
        continue;
      }
    }
    if (rule.targetL2 && rule.targetL2.length > 0) {
      if (
        !normalizedLeaf ||
        !rule.targetL2.some((l2) =>
          normalizedLeaf.l2.toLowerCase().includes(l2.toLowerCase())
        )
      ) {
        continue;
      }
    }
    if (rule.targetL3 && rule.targetL3.length > 0) {
      if (
        !normalizedLeaf ||
        !rule.targetL3.some((l3) =>
          normalizedLeaf.l3.toLowerCase().includes(l3.toLowerCase())
        )
      ) {
        continue;
      }
    }

    if (rule.checkConflict(dossier, normalizedLeaf)) {
      issues.push({
        id: rule.id,
        severity: rule.severity,
        section: rule.section,
        label: rule.label,
        detail: rule.detail,
        anchor: rule.anchor,
      });
    }
  }

  return issues;
}
