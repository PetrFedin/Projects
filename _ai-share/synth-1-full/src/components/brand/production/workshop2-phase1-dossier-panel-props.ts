import type { MutableRefObject, ReactNode } from 'react';
import type { Workshop2ArticleLinePatch } from '@/lib/production/local-collection-inventory';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2TzDigitalSignoffCapabilities } from '@/lib/production/workshop2-tz-digital-signoff';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2DossierPanelVariant = 'phase1' | 'phase2' | 'phase3';

export type Workshop2Phase1DossierPanelProps = {
  collectionId: string;
  articleId: string;
  /** Внутренний 6-значный номер из инвентаря; не редактируется в ТЗ. */
  internalArticleCode?: string;
  articleSku: string;
  articleName: string;
  categoryLeafId: string;
  updatedByLabel: string;
  /**
   * Предприятие подписанта (бренд из профиля и т.п.) — пишется в `byOrganization` при подтверждении секций и цифровых подписей ТЗ.
   */
  sectionSignoffOrganizationLabel?: string;
  onPatchArticleLine: (patch: Workshop2ArticleLinePatch) => boolean;
  /** Шаг 1: «Назад» к списку артикулов. */
  onBack?: () => void;
  /** Шаг 2–3: «Назад» к предыдущему шагу (без выхода к списку). */
  onPreviousStep?: () => void;
  /** `phase1` — досье; `phase2`/`phase3` — атрибуты соответствующей фазы каталога. */
  variant?: Workshop2DossierPanelVariant;
  /** Шаг 1 → 2 (после проверок при «Следующее»). */
  onContinueToNextStep?: () => void;
  /** Шаг 2 → 3. */
  onContinueToStep3?: () => void;
  /** Шаг 3: «Готово» — сохранить и выйти к списку. */
  onFinishWorkshop?: () => void;
  onNavigateToTab?: (
    tab: 'overview' | 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock',
    opts?: { dossierSection?: DossierSection; scrollDomId?: string }
  ) => void;
  /** Открыть конкретный раздел досье (например, с обзора по query `w2sec`). */
  focusDossierSection?: DossierSection | null;
  /** Подсветка основной колонки ТЗ после перехода с обзора (~3 c, держит родитель). */
  flashDossier?: null | { mode: 'main' } | { mode: 'section'; section: DossierSection };
  /**
   * Подписи (как в профиле), которым разрешено снимать цифровые подписи подтверждений ТЗ.
   * Сравнение без учёта регистра. Пустой список — снять нельзя никому.
   */
  tzSignoffRevokerLabels?: string[];
  /**
   * Кто может ставить цифровую подпись по направлениям (задаётся в разделе Команда).
   * Если не передано — разрешены все три роли (демо).
   */
  tzDigitalSignoffCapabilities?: Workshop2TzDigitalSignoffCapabilities;
  /** Внешняя перезагрузка досье из storage (например правка подписантов в паспорте). */
  dossierHydrateKey?: number;
  /**
   * Родитель (карточка артикула) регистрирует сюда `open(blockId)` → открывается тот же диалог комментариев,
   * что и по кнопкам внутри ТЗ (`openAttrComments`).
   */
  dossierCommentsBridgeRef?: MutableRefObject<{ open: (blockId: string) => void } | null>;
  /** Id блоков `w2-block-*` — для счётчиков на превью паспорта в карточке артикула. */
  tzBlockCommentMetricKeys?: readonly string[];
  onTzBlockCommentMetrics?: (
    metrics: Record<string, { total: number; openCritical: number }>
  ) => void;
  /** Открыть диалог «Пульс» артикула (родитель); для материалов — подсказки раздела. */
  onOpenPulse?: (ctx?: {
    materialHints?: boolean;
    materialBomHub?: boolean;
    constructionMeasurements?: boolean;
    visualHub?: boolean;
    /** Явная секция ТЗ для диалога «Пульс», если URL ещё не отражает вкладку. */
    activeTzSection?: Workshop2TzSignoffSectionKey;
  }) => void;
  /** Родитель (воркспейс) ренерит «Пульс»; сюда кладём тяжёлые блоки визуала / BOM без дублирования состояния. */
  pulseSlotRef?: MutableRefObject<{
    renderVisualHub?: () => ReactNode;
    renderMaterialBomHub?: () => ReactNode;
    renderTzMinimalControls?: () => ReactNode;
  }>;
  /** Закрыть диалог «Пульс» перед переходом по якорю из хаба. */
  onRequestClosePulse?: () => void;
  /** Актуальный HTML предпросмотра финального ТЗ (для модалки «Предварительно ТЗ» в карточке артикула). */
  onTzSpecPreviewHtml?: (html: string) => void;
  /**
   * Черновики SKU и названия из формы ТЗ — чтобы карточка артикула (Пульс, pre-flight) совпадала с тем,
   * что пользователь ещё не сохранил в инвентарь.
   */
  onArticleLineDraftsChange?: (drafts: { sku: string; name: string }) => void;
};
