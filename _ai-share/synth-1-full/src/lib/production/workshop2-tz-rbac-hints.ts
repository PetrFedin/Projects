/**
 * Сводные правила отключения действий Workshop2 / ТЗ: одна точка правды для текстов tooltip и toast.
 *
 * | Зона | Нет `production:edit` | Ворота: не все 4 секции ТЗ (бренд+тех) | Прочее (в компонентах) |
 * | --- | --- | --- | --- |
 * | Handoff, вложения, черновик передачи | {@link W2_TZ_HINT_PRODUCTION_EDIT} | {@link W2_TZ_HINT_FOUR_SECTION_SIGNOFFS} | не заполнены поля; «уже отмечено» |
 * | Цифровые подписи ролей (боковая колонка) | {@link W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE} | порог заполнения активной секции (`TZ_SIGNOFF_BLOCK_HINT` в панели) | закрепление / нет capability |
 * | Экспорт HTML/PDF в досье | то же, что {@link W2_TZ_HINT_PRODUCTION_EDIT} | — | скачивание файла без записи — по продукту |
 */

export const W2_TZ_HINT_PRODUCTION_EDIT =
  'Нужно право «Редактировать производство» (production:edit), чтобы изменять досье и журнал ТЗ.';

export const W2_TZ_HINT_FOUR_SECTION_SIGNOFFS =
  'Сначала подпишите все четыре секции ТЗ (паспорт, визуал, материалы, конструкция) парами бренд и технолог.';

export const W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE =
  'Нужно право «Редактировать производство» (production:edit), чтобы ставить или снимать цифровую подпись в досье.';
