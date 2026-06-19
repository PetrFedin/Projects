import { NextResponse } from 'next/server';

/** Legacy requisitions endpoint — fail-closed 410/308 → sample-material-request (Wave Y). */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  if (!collectionId || !articleId) {
    return NextResponse.json(
      {
        message: 'Legacy requisitions removed — use sample-material-request.',
        messageRu: 'Legacy endpoint удалён — используйте sample-material-request.',
        canonical: '/api/workshop2/articles/{collectionId}/{articleId}/sample-material-request',
      },
      { status: 410 }
    );
  }
  const redirect = `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/sample-material-request`;
  return NextResponse.json(
    {
      message: 'PG sample-material-request',
      messageRu: 'Перенаправление на canonical sample-material-request.',
      redirect,
    },
    { status: 308, headers: { Location: redirect } }
  );
}
