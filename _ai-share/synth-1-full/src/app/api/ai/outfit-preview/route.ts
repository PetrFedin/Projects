import { NextRequest, NextResponse } from 'next/server';
import { tryOnOutfit } from '@/ai/flows/try-on-outfit';
import { generateOutfitFromPrompt } from '@/ai/flows/generate-outfit-from-prompt';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      prompt?: string;
      userImage?: string;
      directPrompt?: boolean;
    };
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const direct = body.directPrompt === true;

    if (!prompt) {
      return jsonError(
        { code: 'BAD_REQUEST', message: 'prompt is required', status: 400, meta },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const imageResult =
      typeof body.userImage === 'string' && body.userImage.length > 0
        ? await tryOnOutfit({ prompt, userPhotoDataUri: body.userImage })
        : direct
          ? await generateOutfitFromPrompt({ prompt })
          : await generateOutfitFromPrompt({
              prompt: `fashion photography of a complete outfit for a person, based on the following description: ${prompt}. The image should be a full-body shot against a clean, minimalist background.`,
            });

    return NextResponse.json(imageResult, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to generate outfit preview',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
