'use server';

/**
 * Черновик ответа поддержки на основе FAQ и контекста вопроса.
 */

import { ai, withTokenAudit, truncateInput } from '@/ai/genkit';
import { z } from 'zod';

const InputSchema = z.object({
  customerMessage: z.string(),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
  context: z.string().optional(),
});

const OutputSchema = z.object({
  draftReply: z.string().describe('Черновик ответа на русском'),
  suggestedFaqRef: z.string().optional().describe('ID или тема релевантного FAQ'),
});

export type SuggestSupportReplyInput = z.infer<typeof InputSchema>;
export type SuggestSupportReplyOutput = z.infer<typeof OutputSchema>;

export async function suggestSupportReply(
  input: SuggestSupportReplyInput
): Promise<SuggestSupportReplyOutput> {
  const msg = truncateInput(input.customerMessage.trim(), 500);
  if (!msg) return { draftReply: '' };

  const DEFAULT_FAQ = [
    {
      question: 'Сроки доставки?',
      answer: 'Доставка по России 3-7 рабочих дней. Москва и МО — 1-2 дня. Экспресс — от 1 дня.',
    },
    {
      question: 'Как оформить возврат?',
      answer:
        'Возврат в течение 14 дней с момента получения. Товар должен быть в оригинальной упаковке, без следов использования. Заявка через личный кабинет или поддержку.',
    },
    {
      question: 'Способы оплаты?',
      answer: 'Банковская карта, СБП, рассрочка (Тинькофф, Сбер) при заказе от 3000 ₽.',
    },
    {
      question: 'Как подобрать размер?',
      answer:
        'На странице товара есть таблица размеров. Рекомендуем снять мерки и сравнить с таблицей. При сомнениях — берите размер вверх.',
    },
    {
      question: 'Есть ли примерка?',
      answer: 'Да, в шоурумах Москвы и Санкт-Петербурга. Запись по телефону или на сайте.',
    },
    {
      question: 'Обмен размера?',
      answer: 'Бесплатный обмен в течение 14 дней. Курьер привезёт новый размер и заберёт старый.',
    },
  ];

  const faqItems = input.faq?.length ? input.faq : DEFAULT_FAQ;
  const faqStr = faqItems
    .map(
      (f, i) => `${i + 1}. В: ${f.question}
   О: ${f.answer}`
    )
    .join('\n\n');

  const promptInput = {
    customerMessage: msg,
    faqContent: truncateInput(faqStr, 2000),
    context: input.context ?? 'магазин одежды',
  };

  try {
    const result = await withTokenAudit(
      'suggestSupportReply',
      promptInput,
      undefined,
      undefined,
      async (i) => {
        const prompt = ai.definePrompt({
          name: 'suggestSupportReplyPrompt',
          model: 'googleai/gemini-1.5-flash',
          input: {
            schema: z.object({
              customerMessage: z.string(),
              faqContent: z.string(),
              context: z.string(),
            }),
          },
          output: { schema: OutputSchema },
          config: { maxOutputTokens: 400, temperature: 0.4 },
          prompt: `Ты — оператор поддержки {{{context}}}. Напиши черновик ответа на обращение клиента.

Сообщение клиента: "{{{customerMessage}}}"

База знаний (FAQ):
{{{faqContent}}}

Требования:
- дружелюбный тон
- на русском
- ссылайся на FAQ если релевантно
- если информации нет — предложи уточнить или оставить контакты

Верни JSON: { "draftReply": "...", "suggestedFaqRef": "..." }`,
        });
        const { output } = await prompt(i);
        return output ?? { draftReply: '' };
      }
    );
    return result ?? { draftReply: '' };
  } catch (e) {
    console.warn('[suggestSupportReply] Genkit failed:', e);
    return { draftReply: '' };
  }
}
