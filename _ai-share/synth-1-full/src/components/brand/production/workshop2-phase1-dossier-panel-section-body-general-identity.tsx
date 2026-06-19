'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { DossierAttributeInput } from './workshop2-dossier-attribute-input';
import type { DossierAttributeDisplayDefinition } from './workshop2-dossier-attribute-input.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import {
  WorkshopInlineHintIcon,
  WorkshopLabelWithHint,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-field-hints';
import { passportManualFieldLabelClass } from '@/components/brand/production/workshop2-phase1-dossier-panel-signoff-format';
import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import {
  clampSampleBasePieceQtyToCap,
  syncSampleBaseSizePartsAndPruneDims,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import {
  Workshop2DossierSectionRows,
  type Workshop2DossierSectionRowsExtra,
  type Workshop2DossierSectionRowsSharedBundle,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-section-rows';
import { Workshop2PassportSewingPlanFields } from '@/components/brand/production/Workshop2PassportSewingPlanFields';
import {
  formatWorkshop2InternalArticleCodePlaceholder,
  isWorkshop2InternalArticleCodeValid,
} from '@/lib/production/local-collection-inventory';
import { effectiveMoqTargetMaxPieces } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2PassportDeadlineCriticality,
  Workshop2PassportPlannedLaunchType,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2AttrComment } from '@/components/brand/production/workshop2-phase1-dossier-panel-attr-comments-dialog';
import { W2_BRIEF_DEFER_ID_PLANNED_LAUNCH_CUSTOM } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { cn } from '@/lib/utils';

export type Workshop2DossierGeneralIdentityBlockProps = {
  isPhase1: boolean;
  isPhase2: boolean;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  internalArticleCode?: string;
  skuDraft: string;
  setSkuDraft: Dispatch<SetStateAction<string>>;
  nameDraft: string;
  setNameDraft: Dispatch<SetStateAction<string>>;
  audiences: { id: string; name: string }[];
  selectedAudienceId: string;
  onAudienceSelect: (audienceId: string) => void;
  l1Opts: string[];
  l2Opts: string[];
  l3Opts: string[];
  currentLeaf: HandbookCategoryLeaf;
  onL1Select: (l1: string) => void;
  onL2Select: (l2: string) => void;
  onL3Select: (l3: string) => void;
  commitSku: () => void;
  commitName: () => void;
  tzMinimalHideDeferCommentUi: boolean;
  deferredAttrIds: Set<string>;
  toggleDeferAttribute: (attributeId: string) => void;
  attrCommentsById: Record<string, Workshop2AttrComment[] | undefined>;
  openAttrComments: (blockId: string) => void;
  passportSewingPlanStartRows: ResolvedPhase1AttributeRow[];
  passportSewingPlanStartExtras: Workshop2DossierSectionRowsExtra[];
  workshop2DossierSectionRowsSharedProps: Workshop2DossierSectionRowsSharedBundle;
  currentPhase: '1' | '2' | '3';
  tzWriteDisabled: boolean;
  articleSku: string;
  passportCategoryCaption: string;
};

export function Workshop2DossierGeneralIdentityBlock({
  isPhase1,
  isPhase2,
  dossier,
  setDossier,
  internalArticleCode,
  skuDraft,
  setSkuDraft,
  nameDraft,
  setNameDraft,
  audiences,
  selectedAudienceId,
  onAudienceSelect,
  l1Opts,
  l2Opts,
  l3Opts,
  currentLeaf,
  onL1Select,
  onL2Select,
  onL3Select,
  commitSku,
  commitName,
  tzMinimalHideDeferCommentUi,
  deferredAttrIds,
  toggleDeferAttribute,
  attrCommentsById,
  openAttrComments,
  passportSewingPlanStartRows,
  passportSewingPlanStartExtras,
  workshop2DossierSectionRowsSharedProps,
  currentPhase,
  tzWriteDisabled,
  articleSku,
  passportCategoryCaption,
}: Workshop2DossierGeneralIdentityBlockProps) {
  return (
    <>
      {isPhase1 ? (
        <>
          <div
            id="w2-passport-identity"
            className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <LucideIcons.Fingerprint className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-text-primary text-base font-semibold">Паспорт артикула</h2>
                  <p className="text-text-secondary text-[11px] leading-snug">
                    SKU, название, аудитория, ветка каталога и сроки образца — база для карточки
                    артикула.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              <DossierAttributeInput
                attribute={{
                  attributeId: 'internalArticleCode',
                  groupId: 'general',
                  name: 'Внутренний артикул',
                  type: 'text',
                  sortOrder: 0,
                  parameters: [],
                  allowFreeText: true,
                  allowMultipleDistinct: false,
                  uiType: 'text_input',
                  value: isWorkshop2InternalArticleCodeValid(internalArticleCode)
                    ? internalArticleCode
                    : formatWorkshop2InternalArticleCodePlaceholder(),
                  label: 'Внутренний артикул',
                  description:
                    'Внутренний порядковый номер артикула в коллекции. Присваивается при создании строки и дальше не редактируется.',
                  placeholder: formatWorkshop2InternalArticleCodePlaceholder(),
                }}
                onChange={() => {
                  // Internal article code is read-only, so no onChange needed
                }}
              />
              <DossierAttributeInput
                attribute={{
                  attributeId: 'sku',
                  groupId: 'general',
                  name: 'Артикул (SKU)',
                  type: 'text',
                  sortOrder: 1,
                  parameters: [],
                  allowFreeText: true,
                  allowMultipleDistinct: false,
                  uiType: 'text_input',
                  value: skuDraft,
                  label: 'Артикул (SKU)',
                  description:
                    'Публичный код модели: этикетки, заказы, интеграции. Сохраняется при выходе из поля (on blur).',
                  placeholder: '',
                }}
                onChange={(value) => {
                  setSkuDraft(value as string);
                  commitSku();
                }}
              />
              <DossierAttributeInput
                attribute={{
                  attributeId: 'audience',
                  groupId: 'general',
                  name: 'Аудитория',
                  type: 'select',
                  sortOrder: 2,
                  parameters: [],
                  allowFreeText: false,
                  allowMultipleDistinct: false,
                  uiType: 'select',
                  value: selectedAudienceId,
                  label: 'Аудитория',
                  description:
                    'Сегмент справочника (женская, мужская и т.д.): от него зависят доступные значения атрибутов.',
                  options: audiences.map((a) => ({ value: a.id, label: a.name })),
                }}
                onChange={(value) => onAudienceSelect(value as string)}
              />
              <DossierAttributeInput
                attribute={{
                  attributeId: 'l1Name',
                  groupId: 'general',
                  name: 'Раздел каталога (L1)',
                  type: 'select',
                  sortOrder: 3,
                  parameters: [],
                  allowFreeText: false,
                  allowMultipleDistinct: false,
                  uiType: 'select',
                  value: currentLeaf.l1Name,
                  label: 'Раздел каталога (L1)',
                  description:
                    'Раздел верхнего уровня в справочнике (например, «Одежда»). Задаёт базовые правила и набор атрибутов.',
                  options: l1Opts.map((o) => ({ value: o, label: o })),
                }}
                onChange={(value) => onL1Select(value as string)}
              />
              <DossierAttributeInput
                attribute={{
                  attributeId: 'l2Name',
                  groupId: 'general',
                  name: 'Подтип / группа (L2)',
                  type: 'select',
                  sortOrder: 4,
                  parameters: [],
                  allowFreeText: false,
                  allowMultipleDistinct: false,
                  uiType: 'select',
                  value: currentLeaf.l2Name,
                  label: 'Подтип / группа (L2)',
                  description:
                    'Группа внутри раздела (например, «Верхняя одежда»). От неё зависят варианты карточки модели (L3).',
                  options: l2Opts.map((o) => ({ value: o, label: o })),
                }}
                onChange={(value) => onL2Select(value as string)}
              />
              <DossierAttributeInput
                attribute={{
                  attributeId: 'l3Name',
                  groupId: 'general',
                  name: 'Карточка модели в справочнике (L3)',
                  type: 'select',
                  sortOrder: 5,
                  parameters: [],
                  allowFreeText: false,
                  allowMultipleDistinct: false,
                  uiType: 'select',
                  value: currentLeaf.l3Name,
                  label: 'Карточка модели в справочнике (L3)',
                  description:
                    'Карточка модели в справочнике (например, «Пальто») — соответствует листу артикула.',
                  options: l3Opts.map((o) => ({ value: o, label: o })),
                }}
                onChange={(value) => onL3Select(value as string)}
              />
              <div className="grid gap-1.5 sm:col-span-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start lg:col-span-3">
                <DossierAttributeInput
                  inputTestId="workshop2-dossier-model-name"
                  attribute={{
                    attributeId: 'name',
                    groupId: 'general',
                    name: 'Рабочее название модели',
                    type: 'text',
                    sortOrder: 6,
                    parameters: [],
                    allowFreeText: true,
                    allowMultipleDistinct: false,
                    uiType: 'text_input',
                    value: nameDraft,
                    label: 'Рабочее название модели',
                    description:
                      'Человекочитаемое имя для команды: не путать с SKU. Сохраняется при выходе из поля.',
                    placeholder: 'Например: Пальто прямого силуэта с поясом',
                  }}
                  onChange={(value) => {
                    setNameDraft(value as string);
                    commitName();
                  }}
                />
                <div
                  className="flex flex-col gap-1 sm:items-end sm:pb-px"
                  role="group"
                  aria-label="Унисекс"
                >
                  <WorkshopLabelWithHint
                    labelClassName="mb-0"
                    hint={
                      <>
                        <p>
                          Флаг паспорта: модель позиционируется как унисекс. Влияет на подсказки и
                          контекст в блоках ТЗ.
                        </p>
                      </>
                    }
                  >
                    Унисекс
                  </WorkshopLabelWithHint>
                  <div className="border-border-default bg-bg-surface2/80 inline-flex shrink-0 self-start rounded-md border p-px sm:self-end">
                    <button
                      type="button"
                      className={cn(
                        'h-[1.4rem] min-w-[1.8rem] rounded-sm px-1.5 text-[10px] font-medium leading-none transition',
                        !dossier.isUnisex
                          ? 'text-text-primary bg-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                      onClick={() =>
                        setDossier((p: Workshop2DossierPhase1) => ({ ...p, isUnisex: false }))
                      }
                    >
                      Нет
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'h-[1.4rem] min-w-[1.8rem] rounded-sm px-1.5 text-[10px] font-medium leading-none transition',
                        dossier.isUnisex === true
                          ? 'text-text-primary bg-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                      onClick={() =>
                        setDossier((p: Workshop2DossierPhase1) => ({ ...p, isUnisex: true }))
                      }
                    >
                      Да
                    </button>
                  </div>
                </div>
              </div>
              <div
                id="w2-passport-brief"
                className="border-border-subtle col-span-full scroll-mt-24 space-y-3 border-t pt-3"
              >
                <div className="grid gap-1.5 sm:grid-cols-3 sm:items-start">
                  <div className="grid grid-cols-2 gap-1.5">
                    <DossierAttributeInput
                      attribute={{
                        attributeId: 'targetSampleOrPilotDate',
                        groupId: 'productionBrief',
                        name: 'Целевая дата образца / пилота',
                        type: 'text',
                        sortOrder: 7,
                        parameters: [],
                        allowFreeText: true,
                        allowMultipleDistinct: false,
                        uiType: 'date_input',
                        value: dossier.passportProductionBrief?.targetSampleOrPilotDate ?? '',
                        label: 'С',
                        description: '',
                      }}
                      onChange={(value) =>
                        setDossier((p: Workshop2DossierPhase1) => ({
                          ...p,
                          passportProductionBrief: {
                            ...(p.passportProductionBrief ?? {}),
                            targetSampleOrPilotDate: (value as string) || undefined,
                          },
                        }))
                      }
                    />
                    <DossierAttributeInput
                      attribute={{
                        attributeId: 'targetSampleOrPilotDateEnd',
                        groupId: 'productionBrief',
                        name: 'Целевая дата образца / пилота (конец)',
                        type: 'text',
                        sortOrder: 8,
                        parameters: [],
                        allowFreeText: true,
                        allowMultipleDistinct: false,
                        uiType: 'date_input',
                        value: dossier.passportProductionBrief?.targetSampleOrPilotDateEnd ?? '',
                        label: 'По',
                        description: '',
                      }}
                      onChange={(value) =>
                        setDossier((p: Workshop2DossierPhase1) => ({
                          ...p,
                          passportProductionBrief: {
                            ...(p.passportProductionBrief ?? {}),
                            targetSampleOrPilotDateEnd: (value as string) || undefined,
                          },
                        }))
                      }
                    />
                  </div>
                  <DossierAttributeInput
                    attribute={{
                      attributeId: 'deadlineCriticality',
                      groupId: 'productionBrief',
                      name: 'Критичность срока',
                      type: 'select',
                      sortOrder: 9,
                      parameters: [],
                      allowFreeText: false,
                      allowMultipleDistinct: false,
                      uiType: 'select',
                      value: dossier.passportProductionBrief?.deadlineCriticality ?? 'tbd',
                      label: 'Критичность срока',
                      description: 'Нельзя сдвигать без согласования / Допустимы корректировки.',
                      options: [
                        { value: 'tbd', label: 'Пока не определено' },
                        { value: 'hard', label: 'Жёсткий дедлайн' },
                        { value: 'flexible', label: 'Гибкий ориентир' },
                      ],
                    }}
                    onChange={(value) =>
                      setDossier((p: Workshop2DossierPhase1) => ({
                        ...p,
                        passportProductionBrief: {
                          ...(p.passportProductionBrief ?? {}),
                          deadlineCriticality: value as Workshop2PassportDeadlineCriticality,
                        },
                      }))
                    }
                  />
                  <DossierAttributeInput
                    attribute={{
                      attributeId: 'moqTargetMaxPieces',
                      groupId: 'productionBrief',
                      name: 'Кол-во образцов',
                      type: 'number',
                      sortOrder: 10,
                      parameters: [],
                      allowFreeText: false,
                      allowMultipleDistinct: false,
                      uiType: 'number_input',
                      value: effectiveMoqTargetMaxPieces(dossier.passportProductionBrief),
                      label: 'Кол-во образцов',
                      description:
                        'Ограничивает, сколько размеров можно отметить в блоке «Базовый размер» → «Выбор из справочника», и верхнюю границу суммы штук по размерам в табеле мерок.',
                      placeholder: '1',
                    }}
                    onChange={(value) => {
                      const num = Number(value);
                      setDossier((p: Workshop2DossierPhase1) => {
                        const prevBrief = p.passportProductionBrief ?? {};
                        if (!Number.isFinite(num) || num < 1) {
                          return {
                            ...p,
                            passportProductionBrief: {
                              ...prevBrief,
                              moqTargetMaxPieces: 1,
                            },
                          };
                        }
                        let next: Workshop2DossierPhase1 = {
                          ...p,
                          passportProductionBrief: { ...prevBrief, moqTargetMaxPieces: num },
                        };
                        const sa = next.assignments.find(
                          (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
                        );
                        const { hbs, ft } = partitionHandbookAndFree(sa);
                        if (hbs.length > num) {
                          const parts = hbs.slice(0, num).map((v) => ({
                            parameterId: v.parameterId!,
                            displayLabel: v.displayLabel ?? '',
                          }));
                          next = syncSampleBaseSizePartsAndPruneDims(next, parts, ft?.text ?? '');
                        }
                        return {
                          ...next,
                          passportProductionBrief: {
                            ...(next.passportProductionBrief ?? {}),
                            moqTargetMaxPieces: num,
                          },
                          sampleBasePerSizePieceQty: clampSampleBasePieceQtyToCap(
                            next.sampleBasePerSizePieceQty,
                            num
                          ),
                        };
                      });
                    }}
                  />
                </div>
                <Workshop2PassportSewingPlanFields
                  brief={dossier.passportProductionBrief}
                  disabled={tzWriteDisabled}
                  labelFilledClassName={passportManualFieldLabelClass(
                    (() => {
                      const b = dossier.passportProductionBrief;
                      return (
                        (b?.sewingRfSubjectIsoCodes?.length ?? 0) > 0 ||
                        (b?.sewingEnterprisePartnerIds?.length ?? 0) > 0 ||
                        Boolean(b?.sewingEnterprisesCustomNote?.trim()) ||
                        Boolean(b?.sewingRegionPlanNote?.trim())
                      );
                    })()
                  )}
                  onPatch={(patch) =>
                    setDossier((p: Workshop2DossierPhase1) => ({
                      ...p,
                      passportProductionBrief: {
                        ...(p.passportProductionBrief ?? {}),
                        ...patch,
                      },
                    }))
                  }
                />
                <div className="scroll-mt-24 space-y-3">
                  <div className="border-border-subtle bg-bg-surface2/40 min-w-0 space-y-2 rounded-lg border p-3">
                    <div className="grid gap-2 sm:grid-cols-2 sm:items-start">
                      <DossierAttributeInput
                        attribute={{
                          attributeId: 'productionStrategy',
                          groupId: 'productionBrief',
                          name: 'Производственная стратегия',
                          type: 'select',
                          sortOrder: 10.5,
                          parameters: [],
                          allowFreeText: false,
                          allowMultipleDistinct: false,
                          uiType: 'select',
                          value: dossier.productionStrategy ?? '',
                          label: 'Производственная стратегия',
                          description: 'CMT, FPP, гибрид или кастомизация бланка.',
                          options: [
                            { value: '', label: 'Не выбрано' },
                            { value: 'fpp', label: 'FPP (Full Production Package)' },
                            { value: 'cmt', label: 'CMT (Cut, Make, Trim)' },
                            { value: 'hybrid', label: 'Гибрид (Hybrid)' },
                            { value: 'blank_customization', label: 'Кастомизация бланка' },
                          ],
                        }}
                        onChange={(value) =>
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            productionStrategy:
                              (value as 'fpp' | 'cmt' | 'hybrid' | 'blank_customization') ||
                              undefined,
                          }))
                        }
                      />
                      <DossierAttributeInput
                        attribute={{
                          attributeId: 'plannedLaunchType',
                          groupId: 'productionBrief',
                          name: 'Планируемый тип запуска',
                          type: 'select',
                          sortOrder: 11,
                          parameters: [],
                          allowFreeText: false,
                          allowMultipleDistinct: false,
                          uiType: 'select',
                          value: dossier.passportProductionBrief?.plannedLaunchType ?? 'undecided',
                          label: 'Планируемый тип запуска',
                          description:
                            'Схема запуска (цех, КНП, опт и др.) — для контура пошива и передачи в работу.',
                          options: [
                            { value: 'undecided', label: 'Ещё не решено' },
                            { value: 'own_floor', label: 'Своё производство (цех бренда)' },
                            { value: 'cmt', label: 'КНП / подряд (CMT)' },
                            { value: 'mixed', label: 'Смешанная схема' },
                            { value: 'domestic_partner', label: 'Партнёр в РФ / СНГ' },
                            { value: 'nearshore_partner', label: 'Ближнее зарубежье' },
                            { value: 'far_east_partner', label: 'Дальнее зарубежье' },
                            { value: 'ecom_d2c_first', label: 'E-com / D2C в приоритете' },
                            { value: 'wholesale_preorder', label: 'Опт / предзаказ' },
                            { value: 'dropship_fulfillment', label: 'Дропшип / fulfillment' },
                            { value: 'made_to_order_mto', label: 'MTO / пошив под заказ' },
                            { value: 'import_rtw', label: 'Импорт готовой одежды (RTW)' },
                            { value: 'pilot_line_only', label: 'Только пилот / образцы' },
                            { value: 'other_catalogued', label: 'Другое (из справочника)' },
                          ],
                        }}
                        onChange={(value) =>
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            passportProductionBrief: {
                              ...(p.passportProductionBrief ?? {}),
                              plannedLaunchType: value as Workshop2PassportPlannedLaunchType,
                            },
                          }))
                        }
                      />
                      <DossierAttributeInput
                        inputTestId="workshop2-dossier-planned-launch-note"
                        attribute={{
                          attributeId: 'plannedLaunchCustomNote',
                          groupId: 'productionBrief',
                          name: 'Дополнение к типу запуска',
                          type: 'text',
                          sortOrder: 12,
                          parameters: [],
                          allowFreeText: true,
                          allowMultipleDistinct: false,
                          uiType: 'text_input',
                          value: dossier.passportProductionBrief?.plannedLaunchCustomNote ?? '',
                          label: 'Дополнение к типу запуска (свободный текст)',
                          placeholder: 'Свой текст',
                        }}
                        onChange={(value) =>
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            passportProductionBrief: {
                              ...(p.passportProductionBrief ?? {}),
                              plannedLaunchCustomNote: (value as string) || undefined,
                            },
                          }))
                        }
                      />
                      <DossierAttributeInput
                        inputTestId="workshop2-dossier-packaging-note"
                        attribute={{
                          attributeId: 'packagingAndLabelingNote',
                          groupId: 'productionBrief',
                          name: 'Упаковка и маркировка',
                          type: 'text',
                          sortOrder: 13,
                          parameters: [],
                          allowFreeText: true,
                          allowMultipleDistinct: false,
                          uiType: 'text_input',
                          value: dossier.passportProductionBrief?.packagingAndLabelingNote ?? '',
                          label: 'Упаковка и маркировка',
                          description:
                            'Транспортная и индивидуальная упаковка (коробки, полибеги, штрихкоды и т.д.)',
                          placeholder: 'Укажите требования к упаковке',
                        }}
                        onChange={(value) =>
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            passportProductionBrief: {
                              ...(p.passportProductionBrief ?? {}),
                              packagingAndLabelingNote: (value as string) || undefined,
                            },
                          }))
                        }
                      />
                      <DossierAttributeInput
                        inputTestId="workshop2-dossier-weight-dimensions-note"
                        attribute={{
                          attributeId: 'weightAndDimensionsNote',
                          groupId: 'productionBrief',
                          name: 'Весогабаритные характеристики',
                          type: 'text',
                          sortOrder: 14,
                          parameters: [],
                          allowFreeText: true,
                          allowMultipleDistinct: false,
                          uiType: 'text_input',
                          value: dossier.passportProductionBrief?.weightAndDimensionsNote ?? '',
                          label: 'Весогабаритные характеристики',
                          description: 'Расчетный вес, габариты изделия или транспортной упаковки',
                          placeholder: 'Вес, габариты (ДхШхВ)',
                        }}
                        onChange={(value) =>
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            passportProductionBrief: {
                              ...(p.passportProductionBrief ?? {}),
                              weightAndDimensionsNote: (value as string) || undefined,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                {passportSewingPlanStartRows.length + passportSewingPlanStartExtras.length > 0 ? (
                  <Workshop2DossierSectionRows
                    {...workshop2DossierSectionRowsSharedProps}
                    rows={passportSewingPlanStartRows}
                    phase={currentPhase}
                    extras={passportSewingPlanStartExtras}
                    opts={{
                      showAttributeNameHintIcons: true,
                      fieldLayout: 'grid2',
                      strictAttributeFillLabelColors: true,
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          id="w2-passport-identity"
          className="border-border-default scroll-mt-24 space-y-1 rounded-xl border bg-white p-4 shadow-sm"
        >
          <p className="flex flex-wrap items-baseline gap-x-1">
            <span
              className={
                isPhase2
                  ? 'text-[9px] font-semibold text-orange-800'
                  : 'text-text-secondary text-[9px] font-semibold'
              }
            >
              {isPhase2 ? 'Обязательный' : 'ОТК / приёмка'}
            </span>
            <span className="text-text-primary text-sm font-semibold">
              {isPhase2 ? 'Шаг 2' : 'Шаг 3'}
            </span>
          </p>
          <p className="text-text-primary font-mono text-sm font-semibold">{articleSku}</p>
          <p className="text-text-secondary text-[10px] leading-snug">{passportCategoryCaption}</p>
          <p className="text-text-secondary text-[10px] leading-snug">
            Полная идентификация и аудитория — на шаге 1 ТЗ; здесь дозаполнение полей паспорта для
            текущего шага.
          </p>
        </div>
      )}
    </>
  );
}
