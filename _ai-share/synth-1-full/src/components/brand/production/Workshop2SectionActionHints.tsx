'use client';

import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

const STEP_LABEL: Record<Workshop2TzSignoffSectionKey, string> = {
  general: 'Паспорт изделия',
  visuals: 'Визуал и образ',
  material: 'Материалы и маркировка',
  construction: 'Конструкция и мерки',
  assignment: 'Задание и отправка',
  b2b_sales: 'B2B/Продажи',
};

const DEFAULT_ACTIONS: Record<Workshop2TzSignoffSectionKey, string[]> = {
  general: [
    'Заполните Sku и название.',
    'Проверьте аудиторию и L1-L3.',
    'Добавьте сроки запуска.',
  ],
  visuals: [
    'Добавьте 1+ референс.',
    'Укажите цвет и референс.',
    'Выберите силуэт/посадку.',
  ],
  material: [
    'Добавьте 2+ материалов в Bom.',
    'Проверьте состав 100%.',
    'Заполните маркировку/уход.',
  ],
  construction: [
    'Укажите застежку и узлы.',
    'Добавьте 3+ конструктивные привязки.',
    'Проверьте карманы/обработку.',
  ],
  assignment: [
    'Проверьте готовность секций.',
    'Выберите вложения для передачи.',
    'Зафиксируйте handoff.',
  ],
  b2b_sales: [
    'Заполните параметры B2B.',
  ],
};

function normalizeWarningAsAction(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  if (!cleaned) return '';
  if (/[.!?]$/.test(cleaned)) return cleaned;
  return `${cleaned}.`;
}

function toSignoffSectionKey(active: Workshop2TzSignoffSectionKey): DossierSection {
  return active;
}

export function Workshop2SectionActionHints({
  activeSection,
  handbookCheckBySection,
}: {
  activeSection: Workshop2TzSignoffSectionKey;
  handbookCheckBySection: Record<DossierSection, string[]> | null;
}) {
  const currentKey = toSignoffSectionKey(activeSection);
  const rawWarnings = handbookCheckBySection ? (handbookCheckBySection[currentKey] ?? []) : [];
  const actions =
    rawWarnings.length > 0
      ? rawWarnings.map(normalizeWarningAsAction).filter(Boolean).slice(0, 5)
      : DEFAULT_ACTIONS[activeSection];
  const hasWarnings = rawWarnings.length > 0;

  return (
    <div className="min-h-16 px-2 py-1.5">
      <p className="text-text-primary text-[10px] font-semibold">{STEP_LABEL[activeSection]}</p>
      <p className="text-text-secondary mt-0.5 text-[10px]">Что сделать в этом шаге.</p>
      <ul className="mt-1 space-y-1">
        {actions.map((item) => (
          <li key={item} className="text-text-secondary flex items-start gap-1.5 text-[10px]">
            <span
              className={
                hasWarnings
                  ? 'mt-[2px] inline-block h-1.5 w-1.5 rounded-full bg-amber-500'
                  : 'mt-[2px] inline-block h-1.5 w-1.5 rounded-full bg-accent-primary/80'
              }
            />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
