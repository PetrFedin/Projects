'use server';

/**
 * Анализ гардероба: что есть, чего не хватает, что докупить.
 */

import { ai, withTokenAudit, truncateInput } from '@/ai/genkit';
import { z } from 'zod';

const WardrobeItemSchema = z.object({
  title: z.string(),
  category: z.string(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const InputSchema = z.object({
  items: z.array(WardrobeItemSchema),
  occasion: z.string().optional().describe('Желаемый сценарий: офис, вечер, путешествие и т.д.'),
});

const OutputSchema = z.object({
  summary: z.string().describe('Краткое описание гардероба (1-2 предложения)'),
  gaps: z.array(z.string()).describe('Категории/типы вещей, которых не хватает'),
  recommendations: z
    .array(z.string())
    .describe('Конкретные рекомендации: что докупить (названия типов вещей)'),
});

export type AnalyzeWardrobeInput = z.infer<typeof InputSchema>;
export type AnalyzeWardrobeOutput = z.infer<typeof OutputSchema>;

export async function analyzeWardrobe(input: AnalyzeWardrobeInput): Promise<AnalyzeWardrobeOutput> {
  if (input.items.length === 0) {
    return {
      summary:
        'Гардероб пуст. Начните с базовых вещей: белая рубашка, темные брюки, нейтральная обувь.',
      gaps: ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories'],
      recommendations: ['Белая рубашка', 'Черные брюки', 'Лоферы или кеды', 'Тренч или пальто'],
    };
  }

  const itemsStr = input.items
    .map(
      (it) =>
        `- ${it.title} (${it.category})${it.color ? `, ${it.color}` : ''}${it.tags?.length ? ` [${it.tags.join(', ')}]` : ''}`
    )
    .join('\n');

  const promptInput = {
    itemsDescription: truncateInput(itemsStr, 800),
    occasion: input.occasion ?? 'универсальный стиль',
  };

  try {
    const result = await withTokenAudit(
      'analyzeWardrobe',
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: 'analyzeWardrobePrompt',
          model: 'googleai/gemini-1.5-flash',
          input: { schema: z.object({ itemsDescription: z.string(), occasion: z.string() }) },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 400, temperature: 0.5 },
          prompt: `Ты — AI-стилист. Проанализируй гардероб пользователя.

В гардеробе:
{{{itemsDescription}}}

Желаемый сценарий: {{{occasion}}}

Задачи:
1. summary — кратко опиши состав гардероба (1-2 предложения) на русском
2. gaps — перечисли категории/типы вещей, которых не хватает (Outerwear, Tops, Bottoms, Shoes, Accessories или конкретнее: "верхняя одежда", "обувь для офиса")
3. recommendations — 3-5 конкретных рекомендаций что докупить (названия типов: "Бежевый тренч", "Лоферы", "Ремень кожаный")

Верни JSON: { "summary": "...", "gaps": [...], "recommendations": [...] }`,
        });
        const { output } = await prompt(i);
        return output ?? { summary: '', gaps: [], recommendations: [] };
      }
    );
    return result ?? { summary: '', gaps: [], recommendations: [] };
  } catch (e) {
    console.warn('[analyzeWardrobe] Genkit failed:', e);
    return {
      summary: 'Не удалось проанализировать гардероб.',
      gaps: [],
      recommendations: [],
    };
  }
}
