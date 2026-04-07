'use server';

/**
 * LLM-парсер пожеланий из чата для уточнения параметров подбора.
 * Используется когда regex-парсер не вытащил достаточно данных.
 */

import { ai, withTokenAudit, truncateInput } from "@/ai/genkit";
import { z } from "zod";

const InputSchema = z.object({
  message: z.string(),
});

const OutputSchema = z.object({
  occasion: z.string().optional().describe("Daily|Work|Date|Travel|Event|Sport|Golf|Evening"),
  mood: z.string().optional().describe("Minimal|Urban|Techwear|Classic|SportLuxe|AvantGarde"),
  palette: z.string().optional().describe("Warm|Cool|Neutral|Monochrome|Vibrant"),
  budgetMax: z.number().optional().describe("Максимальный бюджет в рублях"),
  colors: z.array(z.string()).optional(),
  excludeOversized: z.boolean().optional(),
  excludeBright: z.boolean().optional(),
});

export type ParseChatLLMOutput = z.infer<typeof OutputSchema>;

export async function parseChatWithLLM(message: string): Promise<ParseChatLLMOutput> {
  const q = truncateInput(message.trim(), 300);
  if (!q || q.length < 3) return {};

  try {
    const result = await withTokenAudit(
      "parseChatWithLLM",
      { message: q },
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: "parseChatWithLLMPrompt",
          model: "googleai/gemini-1.5-flash",
          input: { schema: InputSchema },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 200, temperature: 0.2 },
          prompt: `Извлеки параметры подбора образов из сообщения пользователя.

Сообщение: "{{{message}}}"

Доступные значения:
- occasion: Daily, Work, Date, Travel, Event, Sport, Golf, Evening
- mood: Minimal, Urban, Techwear, Classic, SportLuxe, AvantGarde
- palette: Warm, Cool, Neutral, Monochrome, Vibrant
- colors: black, white, gray, navy, blue, beige, olive, brown, red, pink, green, camel, cream
- budgetMax: число в рублях (если "до 50к" -> 50000)
- excludeOversized: true если просит без oversize
- excludeBright: true если просит без ярких цветов

Верни только те поля, которые можно явно вывести из текста. Пустой объект {} если ничего не найдено.`,
        });
        const { output } = await prompt(i);
        return output ?? {};
      }
    );

    const out: ParseChatLLMOutput = {};
    if (result?.occasion) out.occasion = result.occasion as ParseChatLLMOutput["occasion"];
    if (result?.mood) out.mood = result.mood as ParseChatLLMOutput["mood"];
    if (result?.palette) out.palette = result.palette as ParseChatLLMOutput["palette"];
    if (typeof result?.budgetMax === "number" && result.budgetMax > 0) out.budgetMax = result.budgetMax;
    if (result?.colors?.length) out.colors = result.colors;
    if (result?.excludeOversized === true) out.excludeOversized = true;
    if (result?.excludeBright === true) out.excludeBright = true;
    return out;
  } catch (e) {
    console.warn("[parseChatWithLLM] Genkit failed:", e);
    return {};
  }
}
