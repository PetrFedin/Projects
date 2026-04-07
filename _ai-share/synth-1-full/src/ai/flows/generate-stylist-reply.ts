'use server';

/**
 * AI — генерация персонализированного ответа стилиста после подбора образов
 */

import { ai, withTokenAudit } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  userMessage: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional(),
  occasion: z.string(),
  mood: z.string(),
  season: z.string(),
  wardrobeItemTitle: z.string().optional(),
  hasPersonalItem: z.boolean().optional(),
  looksCount: z.number(),
  totalPriceRange: z.string().optional(),
  looksSummary: z.string().optional().describe("Краткое описание образов: названия товаров и цены"),
  temperature: z.number().optional(),
});

const OutputSchema = z.object({
  reply: z.string().describe("Краткий ответ стилиста на русском (1-2 предложения)"),
});

export async function generateStylistReply(input: z.infer<typeof InputSchema>): Promise<string> {
  try {
    const result = await withTokenAudit(
      "generateStylistReply",
      input,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "stylistReplyPrompt",
          model: "googleai/gemini-1.5-flash",
          input: { schema: InputSchema },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 150, temperature: 0.6 },
          prompt: `Ты — AI-стилист Syntha. Ты ведешь диалог с пользователем в формате живого консьержа.
Параметры текущего подбора: сценарий {{occasion}}, стиль {{mood}}, сезон {{season}}.
{{#if temperature}}Погода: {{temperature}}°C.{{/if}}
Подобрано {{looksCount}} образов.
{{#if totalPriceRange}}Диапазон цен: {{totalPriceRange}}.{{/if}}
{{#if wardrobeItemTitle}}В основе — вещь из гардероба: {{wardrobeItemTitle}}.{{/if}}
{{#if hasPersonalItem}}Пользователь загрузил фото своей вещи, к которой нужно подобрать дополнения.{{/if}}
{{#if looksSummary}}Подобранные вещи: {{looksSummary}}{{/if}}

{{#if history}}
История диалога:
{{#each history}}
{{role}}: "{{content}}"
{{/each}}
{{/if}}

Последнее сообщение пользователя: "{{userMessage}}"

Напиши короткий, профессиональный и вовлекающий ответ (1-3 предложения) на русском. 
Если пользователь просит "подешевле", "другой цвет" или "добавь что-то", подтверди, что ты учел это в подборе.
Упомяни конкретные вещи. Без эмодзи.`,
        });
        const { output } = await prompt(i);
        return output ?? { reply: "" };
      }
    );
    return result?.reply ?? "";
  } catch (e) {
    console.warn("[generateStylistReply] Genkit failed:", e);
    return "";
  }
}
