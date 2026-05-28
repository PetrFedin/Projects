import type {
  Workshop2SketchAnnotationPriority,
  Workshop2SketchAnnotationStage,
  Workshop2SketchAnnotationStatus,
  Workshop2SketchAnnotationType,
} from '@/lib/production/workshop2-dossier-phase1.types';

export const NEXT_PIN_PRESET_LABEL: Record<'critical' | 'qc' | 'other', string> = {
  critical: 'критично',
  qc: 'этап ОТК',
  other: 'остальные',
};

export const TYPE_LABELS: Record<Workshop2SketchAnnotationType, string> = {
  construction: 'Конструкция',
  material: 'Материал',
  fit: 'Посадка',
  finishing: 'Обработка',
  hardware: 'Фурнитура',
  labeling: 'Маркировка',
  qc: 'ОТК',
};

export const PRIORITY_LABELS: Record<Workshop2SketchAnnotationPriority, string> = {
  critical: 'Критично',
  important: 'Важно',
  note: 'Заметка',
};

export const STATUS_LABELS: Record<Workshop2SketchAnnotationStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Закрыта',
  rejected: 'Отклонена',
};

export const STAGE_LABELS: Record<Workshop2SketchAnnotationStage, string> = {
  tz: 'ТЗ',
  sample: 'Образец',
  prelaunch: 'Предзапуск',
  release: 'Выпуск',
  qc: 'ОТК',
};

export const ORPHAN_LINKED_TASK_LABEL = 'Слот не найден — выберите блок в списке';
