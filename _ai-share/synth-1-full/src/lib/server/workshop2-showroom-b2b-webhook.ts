import 'server-only';

import type { Workshop2ShowroomLinesheetPayload } from '@/lib/production/workshop2-showroom-linesheet-payload';

export type Workshop2ShowroomB2bWebhookResult = {
  attempted: boolean;
  delivered: boolean;
  httpStatus?: number;
  error?: string;
};

/** Outbound webhook при publish — без fake ACK; только честный HTTP результат. */
export async function postWorkshop2ShowroomB2bWebhook(input: {
  collectionId: string;
  articleId: string;
  campaign: {
    published: boolean;
    campaignName?: string;
    wholesalePrice?: number;
    msrp?: number;
    moq?: number;
    windowStart?: string;
    windowEnd?: string;
  };
  linesheet: Workshop2ShowroomLinesheetPayload;
}): Promise<Workshop2ShowroomB2bWebhookResult> {
  const url =
    process.env.WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL?.trim() ||
    process.env.WORKSHOP2_B2B_PORTAL_WEBHOOK_URL?.trim();
  if (!url) {
    return { attempted: false, delivered: false };
  }
  if (!input.campaign.published) {
    return { attempted: false, delivered: false };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.WORKSHOP2_SHOWROOM_B2B_WEBHOOK_SECRET
          ? { 'X-Workshop2-Secret': process.env.WORKSHOP2_SHOWROOM_B2B_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        type: 'showroom.published',
        collectionId: input.collectionId,
        articleId: input.articleId,
        campaign: input.campaign,
        linesheet: input.linesheet,
        emittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return {
        attempted: true,
        delivered: false,
        httpStatus: res.status,
        error: `http_${res.status}`,
      };
    }
    return { attempted: true, delivered: true, httpStatus: res.status };
  } catch (e) {
    return {
      attempted: true,
      delivered: false,
      error: e instanceof Error ? e.message : 'webhook_failed',
    };
  }
}
