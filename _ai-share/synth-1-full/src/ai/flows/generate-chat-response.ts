'use server';
/**
 * @fileOverview A conversational AI agent for the stylist.
 *
 * - generateChatResponse - A function that handles generating a conversational response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import { ai, withTokenAudit, truncateInput } from '@/ai/genkit';
import { getProductDetails } from '@/ai/tools/get-product-details';
import { searchProducts } from '@/ai/tools/search-products';
import { z } from 'zod';

const GenerateChatResponseInputSchema = z.object({
  query: z.string().describe("The user's message to the stylist."),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .optional()
    .describe('Chat history for context'),
  userId: z.string().optional().describe('The ID of the user interacting with the stylist.'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe("The AI stylist's conversational response."),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  const historySize = input.history?.length || 0;

  // Basic history summarization if too long (placeholder for more advanced LLM-based summarization)
  let processedHistory = input.history;
  if (historySize > 10) {
    // Example threshold
    const summary = '... [summarized chat history] ...';
    processedHistory = [{ role: 'model', content: summary }];
  }

  const optimizedInput = {
    ...input,
    history: processedHistory?.slice(-5).map((h) => ({
      ...h,
      content: truncateInput(h.content, 500),
    })),
  };

  return withTokenAudit('generateChatResponse', optimizedInput, input.userId, historySize, (i) =>
    generateChatResponseFlow(i)
  );
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: GenerateChatResponseInputSchema },
  output: { schema: GenerateChatResponseOutputSchema },
  tools: [getProductDetails, searchProducts],
  config: {
    maxOutputTokens: 200,
    temperature: 0.7,
  },
  prompt: `You are a friendly and helpful AI fashion stylist named Syntha, specifically trained for the Russian fashion market. 
    Your goal is to have a brief, encouraging, and natural conversation with the user in Russian.
    Based on the user's request, generate a short, one-sentence response that reflects current trends and preferences in Russia.

    If the user asks about a specific product, use 'getProductDetails' to find it. If the user asks to search or filter (e.g. "синий пиджак", "кашемир", "что-нибудь для офиса"), use 'searchProducts' to find matching items and mention 1-3 of them in your response.
    
    History:
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}

    Current user request: {{{query}}}
    `,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('AI failed to generate a response');
      return output;
    } catch (error: any) {
      console.warn('Stylist AI failed, using local fallback:', error.message);

      const query = input.query.toLowerCase();
      let response =
        'Здравствуйте! Я готова помочь вам с подбором образа или аналитикой коллекции для российского рынка.';

      if (query.includes('привет') || query.includes('здравствуй')) {
        response = 'Здравствуйте! Рада вас видеть. Чем могу помочь сегодня?';
      } else if (query.includes('тренд') || query.includes('модно')) {
        response =
          'Сейчас в России наблюдается большой спрос на качественный трикотаж и функциональный минимализм. Могу подобрать конкретные модели.';
      } else if (query.includes('цена') || query.includes('купить')) {
        response =
          'Я могу помочь сориентироваться по ценам на наши SKU. Какой сегмент вас интересует?';
      } else if (query.includes('спасибо')) {
        response = 'Всегда пожалуйста! Обращайтесь, если появятся вопросы.';
      }

      return { response };
    }
  }
);
