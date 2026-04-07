'use server';

/**
 * Автотегирование товаров: LLM возвращает style tags для скоринга стилиста.
 */

import { ai, withTokenAudit, truncateInput } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
});

const OutputSchema = z.object({
  tags: z.array(z.string()).describe("Теги стиля: minimal, casual, formal, urban, classic, premium, sport, elegant, etc."),
  occasion: z.array(z.string()).optional().describe("Сценарии: Work, Daily, Evening, Sport, Travel"),
  silhouette: z.string().optional().describe("fitted, oversized, relaxed"),
});

const VALID_TAGS = [
  "minimal", "casual", "formal", "urban", "classic", "premium", "sport", "elegant",
  "essential", "versatile", "functional", "statement", "tailored", "relaxed",
  "slim-fit", "oversized", "athletic", "golf", "dressy", "everyday",
];

export type InferProductTagsInput = z.infer<typeof InputSchema>;
export type InferProductTagsOutput = z.infer<typeof OutputSchema>;

export async function inferProductTags(
  input: InferProductTagsInput
): Promise<{ tags: string[] }> {
  const promptInput = {
    name: truncateInput(input.name, 120),
    category: input.category,
    description: input.description ? truncateInput(input.description, 300) : "",
    color: input.color ?? "",
  };

  try {
    const result = await withTokenAudit(
      "inferProductTags",
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "inferProductTagsPrompt",
          model: "googleai/gemini-1.5-flash",
          input: { schema: z.object({ name: z.string(), category: z.string(), description: z.string(), color: z.string() }) },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 150, temperature: 0.3 },
          prompt: `Ты — эксперт по модной классификации. Определи теги для товара.

Товар: {{{name}}}
Категория: {{{category}}}
Цвет: {{{color}}}
Описание: {{{description}}}

Верни 3-8 тегов из списка: minimal, casual, formal, urban, classic, premium, sport, elegant, essential, versatile, functional, statement, tailored, relaxed, slim-fit, oversized, athletic, golf, dressy, everyday.

Только англоязычные теги в нижнем регистре. Формат: { "tags": ["...", "..."] }`,
        });
        const { output } = await prompt(i);
        return output ?? { tags: [] };
      }
    );

    const tags = (result?.tags ?? []).filter((t) =>
      VALID_TAGS.includes(t.toLowerCase())
    );
    return { tags: [...new Set(tags)].slice(0, 10) };
  } catch (e) {
    console.warn("[inferProductTags] Genkit failed:", e);
    return { tags: [] };
  }
}
