'use client';

import * as LucideIcons from 'lucide-react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Workshop2DesignerManifestoBlock } from '@/components/brand/production/Workshop2DesignerManifestoBlock';
import { Workshop2VisualReferencesBlock as VisualReferencesBlock } from '@/components/brand/production/Workshop2VisualReferencesBlock';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type Props = {
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  saveDraft: () => void;
  updatedByLabel: string;
  /** Атрибуты каталога визуала — рендер родителем (`renderSectionRows`). */
  catalogFieldsSlot: ReactNode;
};

export function Workshop2VisualsDossierSection({
  dossier,
  setDossier,
  saveDraft,
  updatedByLabel,
  catalogFieldsSlot,
}: Props) {
  return (
    <div className="space-y-4">
      <div id="w2-visuals-hub" className="h-0 scroll-mt-24" aria-hidden />
      <Workshop2DesignerManifestoBlock
        brandNotes={dossier.brandNotes}
        onBrandNotesChange={(value) =>
          setDossier((prev) => ({
            ...prev,
            brandNotes: value,
          }))
        }
        onSaveDraft={saveDraft}
      />
      <div id="w2-visuals-refs" className="scroll-mt-24">
        <VisualReferencesBlock
          items={dossier.visualReferences ?? []}
          onChange={(next) => setDossier((p) => ({ ...p, visualReferences: next }))}
          currentUserLabel={updatedByLabel}
          threadAuthorLabel={
            (dossier.passportProductionBrief?.articleCardOwnerName ?? '').trim() || updatedByLabel
          }
          canonicalMainPhotoRefId={dossier.canonicalMainPhotoRefId}
          onSetCanonicalMainPhoto={(refId) =>
            setDossier((p) => ({
              ...p,
              canonicalMainPhotoRefId: refId ?? undefined,
            }))
          }
        />
      </div>
      <div
        id="w2-visuals-attributes"
        className="border-border-default scroll-mt-24 rounded-xl border bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.Palette className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Поля каталога · визуал</h2>
            <p className="text-text-secondary text-sm leading-snug">
              Заполните ключевые поля визуала по категории. Скетч ведется в разделе «Конструкция».
            </p>
          </div>
        </div>
        {catalogFieldsSlot}
      </div>
    </div>
  );
}
