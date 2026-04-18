'use server';

/**
 * @fileOverview Summarizes product reviews to provide a concise overview of pros and cons.
 *
 * - summarizeProductReviews - A function that summarizes product reviews.
 * - SummarizeProductReviewsInput - The input type for the summarizeProductReviews function.
 * - SummarizeProductReviewsOutput - The return type for the summarizeProductReviews function.
 */

import { ai, withTokenAudit, truncateInput, summarizeList } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeProductReviewsInputSchema = z.object({
  reviews: z
    .array(
      z.object({
        text: z.string().describe('The text of the review.'),
        rating: z.number().describe('The rating given in the review.'),
      })
    )
    .describe('An array of product reviews.'),
});

export type SummarizeProductReviewsInput = z.infer<typeof SummarizeProductReviewsInputSchema>;

const SummarizeProductReviewsOutputSchema = z.object({
  summary: z.string().describe('A concise one-paragraph summary of the general sentiment.'),
  pros: z.array(z.string()).describe('A list of key positive points mentioned by customers.'),
  cons: z
    .array(z.string())
    .describe('A list of key negative points or cons mentioned by customers.'),
  sentiment: z
    .enum(['В основном положительные', 'Смешанные', 'В основном отрицательные'])
    .describe('The overall sentiment of the reviews.'),
});

export type SummarizeProductReviewsOutput = z.infer<typeof SummarizeProductReviewsOutputSchema>;

export async function summarizeProductReviews(
  input: SummarizeProductReviewsInput
): Promise<SummarizeProductReviewsOutput> {
  return withTokenAudit('summarizeProductReviews', input, (i) => summarizeProductReviewsFlow(i));
}

const prompt = ai.definePrompt({
  name: 'summarizeProductReviewsPrompt',
  input: { schema: SummarizeProductReviewsInputSchema },
  output: { schema: SummarizeProductReviewsOutputSchema },
  config: {
    maxOutputTokens: 500,
    temperature: 0.3, // Lower temperature for more consistent analysis
  },
  prompt: `You are an AI assistant helping brand managers analyze customer feedback.
  Analyze the following product reviews.

  Your task is to:
  1.  Determine the overall sentiment: 'В основном положительные', 'Смешанные', or 'В основном отрицательные'.
  2.  Extract 2-3 key positive points (pros).
  3.  Extract 2-3 key negative points (cons).
  4.  Write a concise one-paragraph summary of the general feedback.

  Reviews:
  {{#each reviews}}
  - "{{text}}" (Rating: {{rating}})
  {{/each}}
  `,
});

const summarizeProductReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProductReviewsFlow',
    inputSchema: SummarizeProductReviewsInputSchema,
    outputSchema: SummarizeProductReviewsOutputSchema,
  },
  async (input) => {
    // Token Economy: Limit to top 20 reviews and truncate each review text
    const optimizedInput = {
      reviews: input.reviews.slice(0, 20).map((r) => ({
        ...r,
        text: truncateInput(r.text, 300),
      })),
    };

    const { output } = await prompt(optimizedInput);
    return output!;
  }
);
