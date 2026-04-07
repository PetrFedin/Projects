'use server';

/**
 * Гид по размерам: рекомендация размера на основе параметров и типа товара.
 */

import { ai, withTokenAudit, truncateInput } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  productName: z.string(),
  category: z.string(),
  sizeChart: z.string().optional().describe("Таблица размеров в текстовом виде"),
  userHeight: z.number().optional().describe("Рост в см"),
  userWeight: z.number().optional().describe("Вес в кг"),
  userChest: z.number().optional().describe("Обхват груди в см"),
  userWaist: z.number().optional().describe("Обхват талии в см"),
  userHips: z.number().optional().describe("Обхват бёдер в см"),
  userQuestion: z.string().optional().describe("Вопрос пользователя"),
});

const OutputSchema = z.object({
  suggestedSize: z.string().describe("Рекомендуемый размер: S, M, L, XL или цифровой"),
  recommendation: z.string().describe("Краткий совет на русском"),
  tips: z.array(z.string()).optional().describe("Дополнительные советы"),
});

export type SuggestSizeInput = z.infer<typeof InputSchema>;
export type SuggestSizeOutput = z.infer<typeof OutputSchema>;

export async function suggestSize(
  input: SuggestSizeInput
): Promise<SuggestSizeOutput> {
  const hasMeasurements =
    input.userHeight ?? input.userChest ?? input.userWaist ?? input.userHips;

  const promptInput = {
    productName: truncateInput(input.productName, 80),
    category: input.category,
    sizeChart: input.sizeChart ? truncateInput(input.sizeChart, 500) : "Нет данных",
    userMeasurements: hasMeasurements
      ? [
          input.userHeight && `рост: ${input.userHeight} см`,
          input.userWeight && `вес: ${input.userWeight} кг`,
          input.userChest && `грудь: ${input.userChest} см`,
          input.userWaist && `талия: ${input.userWaist} см`,
          input.userHips && `бёдра: ${input.userHips} см`,
        ]
          .filter(Boolean)
          .join(", ")
      : "Не указаны",
    userQuestion: truncateInput((input.userQuestion ?? "").trim() || "Какой размер выбрать?", 200),
  };

  try {
    const result = await withTokenAudit(
      "suggestSize",
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "suggestSizePrompt",
          model: "googleai/gemini-1.5-flash",
          input: {
            schema: z.object({
              productName: z.string(),
              category: z.string(),
              sizeChart: z.string(),
              userMeasurements: z.string(),
              userQuestion: z.string(),
            }),
          },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 250, temperature: 0.2 },
          prompt: `Ты — консультант по размерам в модном магазине.

Товар: {{{productName}}}
Категория: {{{category}}}
Таблица размеров: {{{sizeChart}}}

Параметры пользователя: {{{userMeasurements}}}
Вопрос: {{{userQuestion}}}

Если параметры не указаны — дай общие советы по подбору размера для этой категории.
Рекомендуй размер (S, M, L, XL или цифровой если указан в таблице). На русском.

Верни JSON: { "suggestedSize": "...", "recommendation": "...", "tips": [] }`,
        });
        const { output } = await prompt(i);
        return output ?? { suggestedSize: "M", recommendation: "Рекомендуем ориентироваться на таблицу размеров.", tips: [] };
      }
    );
    return result ?? { suggestedSize: "M", recommendation: "Рекомендуем ориентироваться на таблицу размеров.", tips: [] };
  } catch (e) {
    console.warn("[suggestSize] Genkit failed:", e);
    return { suggestedSize: "M", recommendation: "Обратитесь к таблице размеров на странице товара.", tips: [] };
  }
}
