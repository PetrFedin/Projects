/**
 * Разрешение URL для Fit3D: vault/CAD id → download path; иначе честный placeholder.
 */

export const WORKSHOP2_FIT3D_PLACEHOLDER_GLB = '/models/placeholder.glb' as const;

export type Workshop2Fit3dModelResolution = {
  modelUrl: string;
  /** true — демо-модель, не CAD из vault */
  isPlaceholder: boolean;
  /** В production placeholder.glb не подставляется без vault/CAD */
  placeholderBlockedInProd?: boolean;
  /** Показывать 3D только в dev / при явном флаге / при реальной модели */
  viewerEnabled: boolean;
  hintRu: string;
};

function isGlbLikePath(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v.endsWith('.glb') || v.endsWith('.gltf');
}

/** Публичный URL vault-файла (cad-ingest / upload). */
export function workshop2VaultGlbPublicUrl(input: {
  collectionId: string;
  articleId: string;
  vaultDocumentId: string;
}): string {
  const { collectionId, articleId, vaultDocumentId } = input;
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/vault/${encodeURIComponent(vaultDocumentId)}/file`;
}

/**
 * @param cadVersionId — id vault-документа или путь к .glb
 */
export function resolveWorkshop2Fit3dModel(input: {
  cadVersionId?: string | null;
  collectionId?: string;
  articleId?: string;
  /** NEXT_PUBLIC_W2_FIT3D_ENABLE=1 — показ viewer в production */
  forceEnable?: boolean;
}): Workshop2Fit3dModelResolution {
  const cad = String(input.cadVersionId ?? '').trim();
  const prod = process.env.NODE_ENV === 'production';
  const envEnable = process.env.NEXT_PUBLIC_W2_FIT3D_ENABLE === '1';
  const viewerEnabled = Boolean(input.forceEnable || envEnable || !prod);

  if (cad && isGlbLikePath(cad)) {
    return {
      modelUrl: cad.startsWith('/') ? cad : `/${cad}`,
      isPlaceholder: false,
      viewerEnabled,
      hintRu: 'Модель из вложения .glb',
    };
  }

  if (cad && input.collectionId && input.articleId) {
    return {
      modelUrl: workshop2VaultGlbPublicUrl({
        collectionId: input.collectionId,
        articleId: input.articleId,
        vaultDocumentId: cad,
      }),
      isPlaceholder: false,
      viewerEnabled,
      hintRu: 'Модель из Vault (CAD ingest). При ошибке загрузки — загрузите .glb в Vault.',
    };
  }

  const allowDemoPlaceholder =
    process.env.WORKSHOP2_FIT3D_ALLOW_PLACEHOLDER === '1' ||
    process.env.NEXT_PUBLIC_W2_FIT3D_ALLOW_PLACEHOLDER === '1';

  if (prod && !cad) {
    return {
      modelUrl: '',
      isPlaceholder: true,
      placeholderBlockedInProd: true,
      viewerEnabled: false,
      hintRu: 'В production 3D без vault-модели отключён. Загрузите .glb через Vault → CAD ingest.',
    };
  }

  if (prod && !allowDemoPlaceholder) {
    return {
      modelUrl: '',
      isPlaceholder: true,
      placeholderBlockedInProd: true,
      viewerEnabled: false,
      hintRu:
        'Fit3D: placeholder.glb запрещён в production — загрузите vault .glb (WORKSHOP2_FIT3D_ALLOW_PLACEHOLDER=1 только для демо).',
    };
  }

  return {
    modelUrl: WORKSHOP2_FIT3D_PLACEHOLDER_GLB,
    isPlaceholder: true,
    viewerEnabled: prod
      ? Boolean(allowDemoPlaceholder && (envEnable || input.forceEnable))
      : Boolean(viewerEnabled),
    hintRu: prod
      ? 'Демо placeholder.glb — только с WORKSHOP2_FIT3D_ALLOW_PLACEHOLDER=1.'
      : 'Демо-модель placeholder.glb. Загрузите .glb через Vault → CAD ingest или укажите cadVersionId сессии.',
  };
}
