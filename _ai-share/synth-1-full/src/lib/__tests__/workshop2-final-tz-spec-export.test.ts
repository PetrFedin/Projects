/**
 * @jest-environment node
 */
import { getHandbookCategoryLeaves } from '@/lib/production/category-handbook-leaves';
import { buildWorkshop2FinalTzSpecDocumentHtml } from '@/lib/production/workshop2-final-tz-spec-export';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

function emptyDossier(): Workshop2DossierPhase1 {
  return { schemaVersion: 1, assignments: [] };
}

function exportCtxBase() {
  const leaf = getHandbookCategoryLeaves()[0]!;
  return {
    articleSku: 'SKU-1',
    articleName: 'Test',
    pathLabel: 'L1 / L2',
    l2Name: leaf.l2Name,
    tzPhase: '1' as const,
    categoryLeafId: leaf.leafId,
    measurementsLeaf: leaf,
    preflightOk: false,
    preflightIssueCount: 2,
    sectionSignoffsFull: 0,
    gateLifecycleState: 'draft',
  };
}

describe('workshop2-final-tz-spec-export', () => {
  it('builds html with toc and section anchors', () => {
    const html = buildWorkshop2FinalTzSpecDocumentHtml(emptyDossier(), exportCtxBase());
    expect(html).toContain('Итоговое техническое задание');
    expect(html).toContain('id="sec-passport"');
    expect(html).toContain('id="sec-approvals"');
    expect(html).toContain('SKU-1');
    expect(html).toContain('--- Основной материал (справочник) ---');
    expect(html).toContain('Базовый размер и мерки');
    expect(html).toContain('Чеклист готовности визуала');
    expect(html).toContain('Чеклист материалов / BOM');
    expect(html).toContain('Подписи секций и передача в производство');
    expect(html).toContain('Ворота готовности');
    expect(html).toContain('Ошибки минимального стандарта (machine-code)');
    expect(html).toContain('чеклист готовности отмечен вручную');
    expect(html).toContain('Сводка по каталогу');
    expect(html).toContain('Чеклист «Задание»');
    expect(html).toContain('разделе 6');
    expect(html).toContain('предпросмотр');
    expect(html).toContain('Бирка / маркировка');
  });

  it('omits measurements table when measurementsLeaf is null', () => {
    const html = buildWorkshop2FinalTzSpecDocumentHtml(emptyDossier(), {
      ...exportCtxBase(),
      measurementsLeaf: null,
    });
    expect(html).toContain('Мерки по листу каталога не переданы в контекст экспорта');
    expect(html).not.toContain('table class="measurements"');
  });

  it('shows server-verified tech pack line in canonical banner', () => {
    const html = buildWorkshop2FinalTzSpecDocumentHtml(
      {
        ...emptyDossier(),
        techPackAttachments: [
          {
            attachmentId: 'a1',
            fileName: 'cut.zip',
            sourceKind: 'archive',
            byteStorage: 'session',
            canonicalSource: 'object_store_verified',
            remoteObjectKey: 'brand/c1/a1/cut.zip',
            objectStoreEtag: '"abc"',
            serverIntegrityVerifiedAt: '2026-01-02T12:00:00.000Z',
          },
        ],
      } as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1,
      exportCtxBase()
    );
    expect(html).toContain('object_store_verified');
    expect(html).toContain('cut.zip');
    expect(html).toContain('ETag');
  });

  it('includes composition label subsection when spec has content', () => {
    const html = buildWorkshop2FinalTzSpecDocumentHtml(
      {
        ...emptyDossier(),
        compositionLabelSpec: {
          labelWidthMm: '40',
          labelHeightMm: '15',
          physicalMaterial: 'satin',
          includeFiberCompositionFromTz: true,
          technologistNotes: 'Тестовая бирка',
        },
      },
      exportCtxBase()
    );
    expect(html).toContain('id="sec-composition-label"');
    expect(html).toContain('Бирка состава и ухода');
    expect(html).toContain('40');
    expect(html).toContain('Сатин');
    expect(html).toContain('Тестовая бирка');
  });
});
