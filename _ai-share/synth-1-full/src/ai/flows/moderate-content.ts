'use server';

/**
 * Модерация контента: отзывы, комментарии.
 */

import { ai, withTokenAudit, truncateInput } from '@/ai/genkit';
import { z } from 'zod';

const InputSchema = z.object({
  text: z.string(),
  context: z.enum(['review', 'comment', 'description']).optional(),
});

const OutputSchema = z.object({
  approved: z.boolean().describe('true если контент допустим'),
  flags: z.array(z.string()).describe('Список проблем: spam, offensive, off-topic, fake, etc.'),
  reason: z.string().optional().describe('Краткое объяснение на русском'),
});

export type ModerateContentInput = z.infer<typeof InputSchema>;
export type ModerateContentOutput = z.infer<typeof OutputSchema>;

export async function moderateContent(input: ModerateContentInput): Promise<ModerateContentOutput> {
  const text = truncateInput(input.text.trim(), 1000);
  if (!text) return { approved: true, flags: [] };

  try {
    const result = await withTokenAudit(
      'moderateContent',
      { text, context: input.context ?? 'review' },
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: 'moderateContentPrompt',
          model: 'googleai/gemini-1.5-flash',
          input: { schema: InputSchema },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 150, temperature: 0.2 },
          prompt: `Ты — модератор контента для модного e-commerce. Оцени текст.

Текст: "{{{text}}}"
Контекст: {{{context}}}

Определи:
- approved: true если текст подходит для публикации (отзыв, комментарий)
- flags: массив проблем: spam, offensive, off-topic, fake, personal_data, hate_speech (пустой если проблем нет)
- reason: краткое объяснение на русском, если не approved

Верни JSON: { "approved": true/false, "flags": [], "reason": "..." }`,
        });
        const { output } = await prompt(i);
        return output ?? { approved: true, flags: [] };
      }
    );
    return result ?? { approved: true, flags: [] };
  } catch (e) {
    console.warn('[moderateContent] Genkit failed:', e);
    return { approved: true, flags: [] };
  }
}
