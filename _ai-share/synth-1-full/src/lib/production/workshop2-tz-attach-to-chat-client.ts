import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export async function attachWorkshop2TzBundleToArticleChat(input: {
  collectionId: string;
  articleId: string;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(
      `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/attach-tz-to-chat`,
      {
        method: 'POST',
        headers: buildWorkshop2ApiRequestHeaders(),
      }
    );
    const json = (await res.json()) as { ok?: boolean; messageRu?: string; error?: string };
    if (!res.ok || !json.ok) {
      return { ok: false, message: json.messageRu ?? 'Не удалось прикрепить ТЗ к чату' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Ошибка сети' };
  }
}
