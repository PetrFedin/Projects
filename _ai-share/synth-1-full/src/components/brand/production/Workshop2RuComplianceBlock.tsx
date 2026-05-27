'use client';

import Link from 'next/link';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2B2cShopProductHref } from '@/lib/production/workshop2-b2c-dpp-linkage';
import { workshop2MarkingCompositionLabelGateHintRu } from '@/lib/production/workshop2-marking-honest-sign';
import { buildWorkshop2MarkingWizardSteps } from '@/lib/production/workshop2-marking-honest-sign';

type Props = {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1 | null;
};

/** Wave 10: блок «Соответствие РФ» — бирка, маркировка, DPP (без лишних модалок). */
export function Workshop2RuComplianceBlock({ collectionId, articleId, dossier }: Props) {
  if (!dossier) return null;
  const steps = buildWorkshop2MarkingWizardSteps(dossier);
  const markingHint = workshop2MarkingCompositionLabelGateHintRu(dossier);
  const slug = dossier.passportProductionBrief?.b2cProductSlug?.trim();

  return (
    <div
      className="space-y-2 rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-3 text-[11px]"
      data-testid="workshop2-ru-compliance-block"
    >
      <p className="font-semibold text-emerald-900">Соответствие РФ</p>
      <p className="text-slate-700">{markingHint}</p>
      <ul className="list-disc space-y-0.5 pl-4 text-slate-600">
        {steps.map((s) => (
          <li key={s.id}>
            {s.labelRu}: {s.hintRu}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 pt-1">
        {collectionId && articleId ? (
          <Link
            href={`/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/compliance-pack.zip`}
            className="inline-flex items-center rounded-md bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800"
            title="ZIP: readiness, бирка PDF, CSV ЧЗ, GTIN, DPP"
            data-testid="workshop2-ru-compliance-pack-download"
          >
            Скачать пакет соответствия РФ
          </Link>
        ) : null}
        <span className="text-slate-700" title="PDF бирки состава — панель конструктора ТЗ">
          <Link
            href={`#${encodeURIComponent('w2-composition-label')}`}
            className="text-accent-primary hover:underline"
          >
            Бирка состава (PDF)
          </Link>{' '}
          — секция «Конструкция / маркировка»
        </span>
        {collectionId && articleId ? (
          <Link
            href={`/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/marking/export-csv`}
            className="text-accent-primary font-medium hover:underline"
            title="CSV для личного кабинета Честный ЗНАК"
          >
            CSV → ЧЗ
          </Link>
        ) : null}
        {slug ? (
          <>
            <Link
              href={buildWorkshop2B2cShopProductHref(slug)}
              className="text-accent-primary font-medium hover:underline"
              title="Карточка товара в B2C магазине"
              data-testid="workshop2-ru-b2c-shop-product-link"
            >
              Карточка в магазине
            </Link>
            <Link
              href={`/api/shop/products/${encodeURIComponent(slug)}/dpp`}
              className="text-accent-primary font-medium hover:underline"
              title="Экспорт B2C DPP"
            >
              DPP ({slug})
            </Link>
          </>
        ) : (
          <span className="text-text-muted">DPP: укажите b2cProductSlug в паспорте</span>
        )}
      </div>
    </div>
  );
}
