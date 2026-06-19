export async function pushBrandReleaseSyndication(input?: {
  collectionId?: string;
}): Promise<
  | { ok: true; readyCount: number; messageRu?: string; storageMode?: string }
  | { ok: false; messageRu: string }
> {
  const res = await fetch('/api/brand/merch/release-syndication/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input ?? {}),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    result?: { readyCount: number };
    messageRu?: string;
    storageMode?: string;
  };
  if (!res.ok || !json.ok) {
    return { ok: false, messageRu: json.messageRu ?? 'Push не выполнен.' };
  }
  return {
    ok: true,
    readyCount: json.result?.readyCount ?? 0,
    messageRu: json.messageRu,
    storageMode: json.storageMode,
  };
}
