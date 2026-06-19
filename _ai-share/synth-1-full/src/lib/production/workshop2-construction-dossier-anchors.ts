/**
 * Якоря секции «Конструкция» и смежных переходов «до 9 баллов» в ТЗ.
 */

export const W2_CONSTRUCTION_SUBPAGE_ANCHORS = {
  hub: 'w2-construction-hub',
  /** Один контур: конструкция ↔ мерки ↔ BOM (sectionReadiness, mat ↔ sketch). */
  contour: 'w2-construction-contour',
  /** Выгрузка узлов / ТК — маршруты вне этого экрана. */
  export: 'w2-construction-export',
  /** Подпись секции + отсылка к панели этапа ТЗ. */
  signoff: 'w2-construction-signoff',
  /** CAD / лекала / pattern files block. */
  patternFiles: 'w2-construction-pattern-files',
  /** Панель отправки в цех (assignment send). */
  send: 'w2-construction-send',
  /** 3D/CAD viewer embed. */
  cadViewer: 'w2-construction-cad-viewer',
} as const;

/** Липкая панель «этап ТЗ» над телом секции (подписи brand/tech по активной вкладке). */
export const W2_TZ_SECTION_STAGE_DOM_ID = 'w2-tz-section-stage' as const;
