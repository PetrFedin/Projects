'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES,
  applyVaultCadMeasuresToDossierPom,
  countCadVaultMetadataMeasures,
  extractCadMeasuresFromDossierPom,
  extractCadMeasuresFromTechPackMeta,
  extractCadMeasuresFromVaultMetadata,
  isCadVaultDocument,
  meetsWorkshop2CadViewerMinimum,
  mergeCadMeasureLists,
  type Workshop2CadMeasureEntry,
} from '@/lib/production/workshop2-cad-metadata';
import { listWorkshop2VaultDocumentsFromApi } from '@/lib/production/workshop2-vault-client';
import {
  loadWorkshop2DossierFromApi,
  postWorkshop2CadVaultMirrorSync,
} from '@/lib/production/workshop2-api-client';
import { W2_CONSTRUCTION_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-construction-dossier-anchors';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { Workshop2OperationalPgMirrorChip } from '@/components/brand/production/workshop2-operational-panel-chrome';
import { summarizeWorkshop2TzConstructionPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';

const SOURCE_LABEL: Record<Workshop2CadMeasureEntry['source'], string> = {
  vault_metadata: 'Vault CAD',
  tech_pack_metadata: 'Tech pack',
  dossier_pom: 'Табель мер (досье)',
};

export function Workshop2ConstructionCadViewerPanel({
  collectionId,
  articleUrlSegment,
  dossier,
  onDossierChange,
}: {
  collectionId: string;
  articleUrlSegment: string;
  dossier: Workshop2DossierPhase1;
  onDossierChange?: (next: Workshop2DossierPhase1) => void;
}) {
  const [vaultMeasures, setVaultMeasures] = useState<Workshop2CadMeasureEntry[]>([]);
  const [vaultFiles, setVaultFiles] = useState<{ documentId: string; fileName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [mirrorBusy, setMirrorBusy] = useState(false);
  const constructionPgMirror = useMemo(
    () => summarizeWorkshop2TzConstructionPgMirror(dossier),
    [dossier]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void listWorkshop2VaultDocumentsFromApi(collectionId, articleUrlSegment).then((res) => {
      if (cancelled) return;
      setLoading(false);
      if (!res.ok) return;
      const cadDocs = res.documents.filter((d) => isCadVaultDocument(d.metadata));
      setVaultFiles(
        cadDocs.map((d) => ({
          documentId: d.documentId,
          fileName: d.fileName ?? d.documentId,
        }))
      );
      const fromVault = cadDocs.flatMap((d) => extractCadMeasuresFromVaultMetadata(d.metadata));
      setVaultMeasures(fromVault);
    });
    return () => {
      cancelled = true;
    };
  }, [collectionId, articleUrlSegment]);

  const techPackMeasures = useMemo(
    () =>
      (dossier.techPackAttachments ?? [])
        .filter((a) => a.sourceKind === 'cad')
        .flatMap((a) =>
          extractCadMeasuresFromTechPackMeta(
            (a as { cadMeasures?: unknown[] }).cadMeasures
              ? { cadMeasures: (a as { cadMeasures?: unknown[] }).cadMeasures }
              : undefined
          )
        ),
    [dossier.techPackAttachments]
  );

  const pomMeasures = useMemo(
    () =>
      extractCadMeasuresFromDossierPom(
        dossier.sampleBasePerSizeDimensions,
        dossier.sampleBaseSizeLabel
      ),
    [dossier.sampleBasePerSizeDimensions, dossier.sampleBaseSizeLabel]
  );

  const measures = useMemo(
    () => mergeCadMeasureLists(vaultMeasures, techPackMeasures, pomMeasures),
    [vaultMeasures, techPackMeasures, pomMeasures]
  );

  const vaultMetaCount = useMemo(() => countCadVaultMetadataMeasures(measures), [measures]);
  const cadMinimumMet = useMemo(() => meetsWorkshop2CadViewerMinimum(measures), [measures]);

  const vaultHref = workshop2ArticleHref(collectionId, articleUrlSegment, { w2pane: 'vault' });

  return (
    <div
      id={W2_CONSTRUCTION_SUBPAGE_ANCHORS.cadViewer}
      className="border-border-default scroll-mt-24 space-y-3 rounded-xl border border-dashed bg-slate-50/80 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <LucideIcons.Eye className="text-accent-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <h3 className="text-text-primary text-sm font-semibold">Просмотр CAD (post-ingest)</h3>
            <p className="text-text-secondary text-[11px] leading-snug">
              Не редактор лекал: мерки из metadata vault (cad-ingest, мин.{' '}
              {WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES} строка), tech pack и табель POM.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {vaultMetaCount > 0 && onDossierChange ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() => {
                  const { dossier: next, imported } = applyVaultCadMeasuresToDossierPom(
                    dossier,
                    vaultMeasures
                  );
                  if (imported > 0) onDossierChange(next);
                }}
              >
                Импорт в базовый размер
              </Button>
              {Object.keys(dossier.sampleBasePerSizeDimensions ?? {}).length > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px]"
                  onClick={() => {
                    const { dossier: next, imported } = applyVaultCadMeasuresToDossierPom(
                      dossier,
                      vaultMeasures,
                      { importAllSizeRows: true }
                    );
                    if (imported > 0) onDossierChange(next);
                  }}
                >
                  Импорт во все размеры
                </Button>
              ) : null}
            </>
          ) : null}
          <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" asChild>
            <Link href={vaultHref}>Vault → CAD</Link>
          </Button>
          <span data-testid="workshop2-tz-construction-pg-chip">
            <Workshop2OperationalPgMirrorChip {...constructionPgMirror} />
          </span>
          {onDossierChange ? (
            <Workshop2DossierPersistButton
              busy={mirrorBusy}
              variant="secondary"
              className="h-7 text-[10px]"
              title="cadVaultLinkMirror → PG"
              onClick={() => {
                setMirrorBusy(true);
                void postWorkshop2CadVaultMirrorSync(collectionId, articleUrlSegment).then(
                  async (res) => {
                    if (res.ok) {
                      const loaded = await loadWorkshop2DossierFromApi(
                        collectionId,
                        articleUrlSegment
                      );
                      if (loaded.ok) onDossierChange(loaded.data.dossier);
                    }
                    setMirrorBusy(false);
                  }
                );
              }}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          CAD в vault: {vaultFiles.length}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          Мерок: {measures.length} (vault meta: {vaultMetaCount})
        </Badge>
        {vaultFiles.length > 0 && !cadMinimumMet ? (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-50 text-[10px] text-amber-900"
          >
            Нужна ≥{WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES} мерка в metadata CAD-файла
          </Badge>
        ) : null}
        {loading ? <span className="text-text-muted text-[10px]">Загрузка vault…</span> : null}
        {dossier.cadVaultLinkMirror?.cadIngestPath ? (
          <Badge variant="outline" className="text-[10px]">
            ingest: {dossier.cadVaultLinkMirror.cadIngestPath}
          </Badge>
        ) : null}
      </div>

      {vaultFiles.length > 0 ? (
        <ul className="text-text-secondary space-y-1 text-[11px]">
          {vaultFiles.map((f) => (
            <li key={f.documentId} className="flex items-center gap-1.5">
              <LucideIcons.FileStack className="h-3.5 w-3.5 shrink-0" />
              {f.fileName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text-muted text-[11px] italic">
          Загрузите CAD через cad-ingest в Vault — мерки появятся здесь из metadata файла.
        </p>
      )}

      {dossier.cadPomImport?.lastImportedAt ? (
        <p className="text-text-muted text-[10px]">
          Последний импорт CAD→POM:{' '}
          {new Date(dossier.cadPomImport.lastImportedAt).toLocaleString('ru-RU')} · ячеек{' '}
          {dossier.cadPomImport.importedCellCount} · размеры:{' '}
          {dossier.cadPomImport.sizeKeys.join(', ')}
        </p>
      ) : null}

      {measures.length > 0 ? (
        <div className="overflow-x-auto rounded-md border bg-white">
          <table className="w-full min-w-[320px] text-left text-[11px]">
            <thead className="bg-bg-surface2/70 text-text-muted border-b">
              <tr>
                <th className="px-2 py-1.5 font-semibold">Мерка</th>
                <th className="px-2 py-1.5 font-semibold">Значение</th>
                <th className="px-2 py-1.5 font-semibold">Источник</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((m) => (
                <tr
                  key={`${m.source}-${m.id}`}
                  className="border-border-subtle border-b last:border-0"
                >
                  <td className="text-text-primary px-2 py-1.5">{m.label}</td>
                  <td className="px-2 py-1.5 font-mono">
                    {m.valueCm != null ? `${m.valueCm} см` : '—'}
                    {m.tolerancePlusCm != null || m.toleranceMinusCm != null
                      ? ` (+${m.tolerancePlusCm ?? 0}/−${m.toleranceMinusCm ?? 0})`
                      : null}
                  </td>
                  <td className="text-text-muted px-2 py-1.5">{SOURCE_LABEL[m.source]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
