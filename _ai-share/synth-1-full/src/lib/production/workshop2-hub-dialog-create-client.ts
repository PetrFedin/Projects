import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export async function commitWorkshop2HubDialogArticleViaApi(input: {
  collectionId: string;
  sku: string;
  categoryLeafId: string;
  name?: string;
  comment?: string;
}): Promise<{ ok: boolean; href?: string; message?: string }> {
  try {
    const res = await fetch('/api/workshop2/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildWorkshop2ApiRequestHeaders(),
      },
      body: JSON.stringify({ ...input, commit: true }),
    });
    const json = (await res.json()) as { ok?: boolean; href?: string; message?: string };
    if (!res.ok || !json.ok || !json.href) {
      return { ok: false, message: json.message ?? 'Не удалось создать артикул' };
    }
    return { ok: true, href: json.href };
  } catch {
    return { ok: false, message: 'Ошибка сети' };
  }
}
