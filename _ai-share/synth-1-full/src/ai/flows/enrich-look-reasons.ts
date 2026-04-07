'use server';

/**
 * LLM-enriched объяснения выбора товаров в образах.
 * Принимает образы и контекст, возвращает улучшенные reason для каждого item.
 */

import { ai, withTokenAudit, truncateInput } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  occasion: z.string(),
  mood: z.string(),
  season: z.string(),
  palette: z.string().optional(),
  itemsDescription: z.string().describe("List of items: productId, title, category, color, lookTitle, isFromWardrobe, currentReason"),
});

const EnrichedReasonSchema = z.object({
  productId: z.string(),
  reason: z.string().describe("Краткое объяснение выбора товара на русском (до 15 слов)"),
});

const OutputSchema = z.object({
  reasons: z.array(EnrichedReasonSchema),
});

export type EnrichLookReasonsParams = {
  occasion: string;
  mood: string;
  season: string;
  palette?: string;
  items: Array<{
    productId: string;
    title: string;
    category: string;
    color: string;
    tags: string[];
    currentReason: string;
    isFromWardrobe: boolean;
    lookTitle: string;
  }>;
};

export async function enrichLookReasons(
  params: EnrichLookReasonsParams
): Promise<Record<string, string>> {
  if (params.items.length === 0) return {};

  const itemsDescription = params.items
    .map(
      (it) =>
        `- productId: ${it.productId}, title: ${truncateInput(it.title, 60)}, category: ${it.category}, color: ${it.color}, lookTitle: ${it.lookTitle}, isFromWardrobe: ${it.isFromWardrobe}, currentReason: ${truncateInput(it.currentReason, 80)}`
    )
    .join("\n");

  const promptInput = {
    occasion: params.occasion,
    mood: params.mood,
    season: params.season,
    palette: params.palette,
    itemsDescription,
  };

  try {
    const result = await withTokenAudit(
      "enrichLookReasons",
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "enrichLookReasonsPrompt",
          model: "googleai/gemini-1.5-flash",
          input: { schema: InputSchema },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 800, temperature: 0.5 },
          prompt: `Ты — AI-стилист Syntha. Пользователь запросил образы: сценарий {{occasion}}, стиль {{mood}}, сезон {{season}}.
{{#if palette}}Цветовая гамма: {{palette}}.{{/if}}

Для каждого товара в образе нужно написать короткое объяснение, почему он выбран. Объяснение должно быть:
- на русском
- до 15 слов
- конкретным: упомянуть цвет, категорию, соответствие occasion/mood
- для вещей из гардероба — написать "Твоя вещь из гардероба" или короткую похвалу

Товары:
{{{itemsDescription}}}

Верни JSON: { "reasons": [ { "productId": "...", "reason": "..." } ] } — ровно для каждого товара из списка.`,
        });
        const { output } = await prompt(i);
        return output ?? { reasons: [] };
      }
    );

    const map: Record<string, string> = {};
    for (const r of result?.reasons ?? []) {
      map[r.productId] = r.reason;
    }
    return map;
  } catch (e) {
    console.warn("[enrichLookReasons] Genkit failed:", e);
    return {};
  }
}
