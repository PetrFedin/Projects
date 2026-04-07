'use server';

/**
 * Генерация идей контента для брендов: посты, подписи, описания.
 */

import { ai, withTokenAudit, truncateInput } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  brandName: z.string(),
  theme: z.string().optional().describe("Тема: новая коллекция, сезон, акция, behind-the-scenes"),
  channel: z.enum(["instagram", "telegram", "blog", "email"]).optional(),
  count: z.number().min(1).max(10).optional(),
});

const OutputSchema = z.object({
  ideas: z.array(z.object({
    title: z.string(),
    caption: z.string().describe("Краткое описание поста/подписи"),
    hashtags: z.array(z.string()).optional(),
  })),
});

export type GenerateContentIdeasInput = z.infer<typeof InputSchema>;
export type GenerateContentIdeasOutput = z.infer<typeof OutputSchema>;

export async function generateContentIdeas(
  input: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  const promptInput = {
    brandName: truncateInput(input.brandName, 60),
    theme: input.theme ?? "новинки сезона",
    channel: input.channel ?? "instagram",
    count: input.count ?? 5,
  };

  try {
    const result = await withTokenAudit(
      "generateContentIdeas",
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "generateContentIdeasPrompt",
          model: "googleai/gemini-1.5-flash",
          input: { schema: z.object({ brandName: z.string(), theme: z.string(), channel: z.string(), count: z.number() }) },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 600, temperature: 0.7 },
          prompt: `Ты — контент-менеджер для модного бренда. Придумай идеи для соцсетей.

Бренд: {{{brandName}}}
Тема: {{{theme}}}
Канал: {{{channel}}}

Сгенерируй ровно {{{count}}} идей. Каждая идея:
- title: заголовок поста (до 10 слов)
- caption: краткая подпись/концепция (1-2 предложения)
- hashtags: 3-5 релевантных хештегов

Верни JSON: { "ideas": [ { "title": "...", "caption": "...", "hashtags": [] } ] }`,
        });
        const { output } = await prompt(i);
        return output ?? { ideas: [] };
      }
    );
    return result ?? { ideas: [] };
  } catch (e) {
    console.warn("[generateContentIdeas] Genkit failed:", e);
    return { ideas: [] };
  }
}
