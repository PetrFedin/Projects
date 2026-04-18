'use server';

/**
 * Генерация описания товара из атрибутов.
 * Используется для товаров с пустым description или для улучшения существующего.
 */

import { ai, withTokenAudit, truncateInput } from '@/ai/genkit';
import { z } from 'zod';

const InputSchema = z.object({
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  color: z.string(),
  composition: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sustainability: z.array(z.string()).optional(),
  existingDescription: z.string().optional(),
});

const PromptInputSchema = z.object({
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  color: z.string(),
  composition: z.string(),
  tags: z.string(),
  sustainability: z.string(),
  existingDescription: z.string(),
  includeSeo: z.boolean().optional(),
});

const OutputSchema = z.object({
  description: z.string().describe('Описание товара на русском, 1-3 предложения'),
  metaTitle: z.string().optional().describe('SEO title до 60 символов'),
  metaDescription: z.string().optional().describe('SEO meta description до 160 символов'),
  keywords: z.array(z.string()).optional().describe('Ключевые слова для SEO'),
});

export type GenerateProductDescriptionInput = z.infer<typeof InputSchema>;
export type GenerateProductDescriptionOutput = z.infer<typeof OutputSchema>;

export interface GenerateProductDescriptionResult {
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export async function generateProductDescription(
  input: GenerateProductDescriptionInput,
  options?: { includeSeo?: boolean }
): Promise<string | GenerateProductDescriptionResult> {
  const tagsStr = input.tags?.length ? input.tags.join(', ') : '';
  const sustainabilityStr = input.sustainability?.length ? input.sustainability.join(', ') : '';

  const includeSeo = options?.includeSeo ?? false;
  const promptInput = {
    name: truncateInput(input.name, 120),
    brand: input.brand,
    category: input.category,
    color: input.color,
    composition: input.composition ?? '',
    tags: tagsStr,
    sustainability: sustainabilityStr,
    existingDescription: input.existingDescription
      ? truncateInput(input.existingDescription, 300)
      : '',
    includeSeo,
  };

  try {
    const result = await withTokenAudit(
      'generateProductDescription',
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: 'generateProductDescriptionPrompt',
          model: 'googleai/gemini-1.5-flash',
          input: { schema: PromptInputSchema },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 300, temperature: 0.6 },
          prompt: `Ты — копирайтер для модного e-commerce. Сгенерируй краткое описание товара.

Товар: {{{name}}}
Бренд: {{{brand}}}
Категория: {{{category}}}
Цвет: {{{color}}}
{{#if composition}}Состав: {{{composition}}}{{/if}}
{{#if tags}}Теги: {{{tags}}}{{/if}}
{{#if sustainability}}Устойчивость: {{{sustainability}}}{{/if}}
{{#if existingDescription}}Текущее описание (улучши или оставь): {{{existingDescription}}}{{/if}}

Требования:
- на русском
- 1-3 предложения
- продающее, но без преувеличений
- упомяни ключевые преимущества (материал, крой, универсальность)
- без маркетингового шума

{{#if includeSeo}}Дополнительно:
- metaTitle: заголовок для браузера до 60 символов (название + бренд)
- metaDescription: описание для поисковиков до 160 символов
- keywords: 3-5 ключевых слов (категория, цвет, материал, стиль){{/if}}

Верни JSON: { "description": "...", "metaTitle": "...", "metaDescription": "...", "keywords": [] }`,
        });
        const { output } = await prompt(i);
        return output ?? { description: '' };
      }
    );
    if (includeSeo && result) {
      return {
        description: result.description ?? '',
        metaTitle: result.metaTitle,
        metaDescription: result.metaDescription,
        keywords: result.keywords,
      };
    }
    return result?.description ?? '';
  } catch (e) {
    console.warn('[generateProductDescription] Genkit failed:', e);
    return options?.includeSeo
      ? { description: '', metaTitle: '', metaDescription: '', keywords: [] }
      : '';
  }
}
