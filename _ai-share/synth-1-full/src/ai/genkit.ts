import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { getFromCache, saveToCache, generateCacheKey } from './llm-cache';
import { checkUserQuota, logTokenUsage } from './token-guard';

/**
 * Centralized AI configuration with token economy and safety rules.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-1.5-flash',
});

/**
 * Token usage tracking interface
 */
export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCostUSD?: number;
}

/**
 * Middleware-like wrapper for flow execution to track tokens, enforce safety and handle CACHING.
 */
export async function withTokenAudit<I, O>(
  flowName: string,
  input: I,
  userId: string | undefined = undefined,
  historySize: number | undefined = undefined,
  execution: (input: I) => Promise<O>
): Promise<O> {
  const cacheKey = generateCacheKey(flowName, input);
  const cachedResult = await getFromCache<O>(cacheKey);
  
  if (cachedResult) {
    console.log(`[AI_CACHE] Hit for ${flowName}`);
    return cachedResult;
  }

  const startTime = Date.now();
  const payloadSize = JSON.stringify(input).length;
  const estimatedInputTokens = Math.ceil(payloadSize / 4);
  const estimatedCost = (estimatedInputTokens / 1_000_000) * 0.075;

  // 1. Quota Check
  if (userId) {
    const isAllowed = await checkUserQuota(userId, estimatedCost);
    if (!isAllowed) throw new Error(`User ${userId} exceeded daily AI quota.`);
  }

  try {
    if (payloadSize > 51200) {
      throw new Error(`Payload too large: ${payloadSize} bytes.`);
    }

    const result = await execution(input);
    const duration = Date.now() - startTime;
    
    let usage: TokenUsage = {};
    if (result && typeof result === 'object' && 'usage' in (result as any)) {
      const genkitUsage = (result as any).usage;
      usage = {
        promptTokens: genkitUsage?.inputTokens || genkitUsage?.promptTokens,
        completionTokens: genkitUsage?.outputTokens || genkitUsage?.completionTokens,
        totalTokens: genkitUsage?.totalTokens,
      };
    }
    
    // 2. Logging & Auditing
    logTokenUsage(flowName, usage);

    // 3. Cache Save
    saveToCache(cacheKey, result);

    return result;
  } catch (error: any) {
    console.error(`[TOKEN_AUDIT_ERROR] Flow: ${flowName}`, error.message);
    throw error;
  }
}


/**
 * Truncates text to a maximum length to prevent token leakage.
 */
export function truncateInput(text: string, maxLength: number = 4000): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "... [truncated for token economy]";
}

/**
 * Limits an array to a maximum number of items.
 */
export function limitArraySize<T>(items: T[], maxItems: number = 100): T[] {
  if (items.length <= maxItems) return items;
  return items.slice(0, maxItems);
}

/**
 * Simple summarization helper for review lists or logs.
 */
export function summarizeList(items: string[], maxItems: number = 10): string {
  if (items.length <= maxItems) return items.join('\n');
  const truncated = items.slice(0, maxItems);
  return truncated.join('\n') + `\n... and ${items.length - maxItems} more items omitted.`;
}

/**
 * Retries an asynchronous function with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  initialDelay: number = 500 // milliseconds
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries + 1; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(2, i);
      console.warn(`Retry attempt ${i + 1}/${maxRetries + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError; // Re-throw the last error if all retries fail
}
