/**
 * Вызовы `/api/ai/*` из клиентских компонентов (граница без `@/ai/*`).
 */

import type {
  SummarizeProductReviewsInput,
  SummarizeProductReviewsOutput,
  ModerateContentResult,
  AnalyzeWardrobeOutput,
  GenerateContentIdeasOutput,
  OutfitPreviewResult,
  ChatResponseResult,
  SuggestProductPriceOutput,
  CampaignCreativeResult,
  CollaborativeLookbookResult,
  SocialVideoResult,
} from '@/lib/ai-client/types';
import type { DesignIteration, DesignPrompt } from '@/lib/types/ai-design';
import type { PlannedSKU, SKUDemandForecast } from '@/lib/types/analytics';
import type { BodyMeasurements } from '@/lib/types/client';

async function postAiJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
  if (!res.ok) {
    const msg =
      typeof data?.message === 'string'
        ? data.message
        : typeof data?.error === 'string'
          ? data.error
          : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function summarizeProductReviewsClient(
  input: SummarizeProductReviewsInput
): Promise<SummarizeProductReviewsOutput> {
  return postAiJson<SummarizeProductReviewsOutput>('/api/ai/reviews', input);
}

export async function moderateContentClient(body: {
  text: string;
  context?: string;
}): Promise<ModerateContentResult> {
  return postAiJson<ModerateContentResult>('/api/ai/moderate', body);
}

export async function analyzeWardrobeClient(input: {
  items: { title: string; category: string; color?: string; tags?: string[] }[];
  occasion?: string;
}): Promise<AnalyzeWardrobeOutput> {
  return postAiJson<AnalyzeWardrobeOutput>('/api/ai/wardrobe-analyze', input);
}

export async function inferProductTagsClient(body: {
  name: string;
  category: string;
  description?: string;
  color?: string;
}): Promise<unknown> {
  return postAiJson('/api/ai/infer-tags', body);
}

export async function generateContentIdeasClient(body: {
  brandName: string;
  theme?: string;
  channel?: string;
  count?: number;
}): Promise<GenerateContentIdeasOutput> {
  return postAiJson<GenerateContentIdeasOutput>('/api/ai/content-ideas', body);
}

export async function outfitPreviewClient(body: {
  prompt: string;
  userImage?: string;
  /** Если true — `prompt` передаётся в модель как есть (без обёртки чата). */
  directPrompt?: boolean;
}): Promise<OutfitPreviewResult> {
  return postAiJson<OutfitPreviewResult>('/api/ai/outfit-preview', body);
}

export async function chatResponseClient(body: {
  query: string;
  history?: { role: 'user' | 'model'; content: string }[];
  userId?: string;
}): Promise<ChatResponseResult> {
  return postAiJson<ChatResponseResult>('/api/ai/chat-response', body);
}

export async function designVariantsClient(body: {
  brandId: string;
  prompt: DesignPrompt;
  count: number;
}): Promise<DesignIteration[]> {
  return postAiJson<DesignIteration[]>('/api/ai/design-variants', body);
}

export async function campaignCreativeClient(body: {
  productName: string;
  productPrice: string;
  productImageDataUri: string;
  prompt: string;
}): Promise<CampaignCreativeResult> {
  return postAiJson<CampaignCreativeResult>('/api/ai/campaign-creative', body);
}

export async function suggestPriceClient(body: {
  productName: string;
  productionCost: number;
  category: string;
  brandSegment: string;
}): Promise<SuggestProductPriceOutput> {
  return postAiJson<SuggestProductPriceOutput>('/api/ai/suggest-price', body);
}

export async function skuSimulationClient(body: {
  brandId: string;
  plannedItems: Partial<PlannedSKU>[];
}): Promise<SKUDemandForecast[]> {
  return postAiJson<SKUDemandForecast[]>('/api/ai/sku-simulation', body);
}

export async function bodyScanClient(body: {
  userId: string;
  frontImageUrl?: string;
  sideImageUrl?: string;
  height: number;
  unit: 'cm' | 'in';
}): Promise<BodyMeasurements> {
  return postAiJson<BodyMeasurements>('/api/ai/body-scanner', body);
}

export async function collaborativeLookbookClient(body: {
  productOneName: string;
  productOneImageDataUri: string;
  productTwoName: string;
  productTwoImageDataUri: string;
}): Promise<CollaborativeLookbookResult> {
  return postAiJson<CollaborativeLookbookResult>('/api/ai/collaborative-lookbook', body);
}

export async function socialVideoClient(body: {
  prompt: string;
  productName: string;
  productImageDataUri: string;
}): Promise<SocialVideoResult> {
  return postAiJson<SocialVideoResult>('/api/ai/social-video', body);
}
