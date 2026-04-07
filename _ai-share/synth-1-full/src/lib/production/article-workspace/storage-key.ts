import type { ArticleRef } from './types';

const PREFIX = 'synth.brand.articleWorkspace.v1::';

export function articleWorkspaceStorageKey(ref: ArticleRef): string {
  const c = ref.collectionId.replace(/:/g, '_');
  const a = ref.articleId.replace(/:/g, '_');
  return `${PREFIX}${c}::${a}`;
}
