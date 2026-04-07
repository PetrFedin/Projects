'use server';

/**
 * LLM-подсказки для поиска: расширение запроса семантически близкими вариантами.
 */

import { ai, withTokenAudit, truncateInput } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  query: z.string().describe("Пользовательский поисковый запрос"),
});

const OutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe("2-4 альтернативных поисковых запроса на русском"),
});

export async function suggestSearchQueries(
  query: string
): Promise<string[]> {
  const q = truncateInput(query.trim(), 100);
  if (!q || q.length < 2) return [];

  try {
    const result = await withTokenAudit(
      "suggestSearchQueries",
      { query: q },
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "suggestSearchQueriesPrompt",
          model: "googleai/gemini-1.5-flash",
          input: { schema: InputSchema },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 150, temperature: 0.4 },
          prompt: `Пользователь вводит поисковый запрос в модном каталоге: "{{{query}}}"

Предложи 2-4 альтернативных поисковых запроса на русском, которые:
- семантически близки (синонимы, смежные категории)
- могут помочь найти то же самое иначе
- без лишних слов, только суть запроса
- не повторяй исходный запрос

Примеры:
- "пиджак" -> ["жакет", "блейзер", "классический пиджак"]
- "что-то на вечер" -> ["вечернее платье", "образ на вечер", "выходной look"]
- "как zara" -> ["минимализм", "базовый гардероб", "капсульная коллекция"]

Верни JSON: { "suggestions": ["...", "..."] }`,
        });
        const { output } = await prompt(i);
        return output ?? { suggestions: [] };
      }
    );

    const suggested = result?.suggestions ?? [];
    return suggested.filter((s) => s && s.trim() && s.toLowerCase() !== q.toLowerCase()).slice(0, 4);
  } catch (e) {
    console.warn("[suggestSearchQueries] Genkit failed:", e);
    return [];
  }
}
