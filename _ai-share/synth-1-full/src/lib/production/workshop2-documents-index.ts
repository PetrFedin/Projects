/**
 * Единый индекс «Документы и финансы»: vault + экспорт пакета ТЗ.
 */
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

export type Workshop2DocumentIndexEntry = {
  id: string;
  labelRu: string;
  kind: 'vault' | 'export' | 'handoff';
  href: string;
  descriptionRu?: string;
};

export function buildWorkshop2DocumentsIndex(input: {
  collectionId: string;
  articleUrlSegment: string;
}): Workshop2DocumentIndexEntry[] {
  const { collectionId, articleUrlSegment } = input;
  const encCol = encodeURIComponent(collectionId);
  const encArt = encodeURIComponent(articleUrlSegment);
  return [
    {
      id: 'vault-panel',
      labelRu: 'Vault (файлы)',
      kind: 'vault',
      href: workshop2ArticleHref(collectionId, articleUrlSegment, { w2pane: 'vault' }),
      descriptionRu: 'Договоры, CAD, вложения tech pack',
    },
    {
      id: 'tz-bundle',
      labelRu: 'Пакет ТЗ (ZIP)',
      kind: 'export',
      href: `/api/workshop2/articles/${encCol}/${encArt}/export-tz-bundle`,
      descriptionRu: 'Серверная сборка ZIP: досье + бинарники vault',
    },
    {
      id: 'handoff',
      labelRu: 'Передача в цех',
      kind: 'handoff',
      href: workshop2ArticleHref(collectionId, articleUrlSegment, {
        w2pane: 'tz',
        w2sec: 'assignment',
      }),
      descriptionRu: 'Чеклист handoff-readiness и фиксация пакета',
    },
  ];
}
