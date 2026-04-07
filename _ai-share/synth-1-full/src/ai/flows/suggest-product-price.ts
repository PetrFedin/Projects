
'use server';
/**
 * @fileOverview An AI agent that suggests a retail price for a product.
 *
 * - suggestProductPrice - A function that handles the price suggestion process.
 * - SuggestProductPriceInput - The input type for the function.
 * - SuggestProductPriceOutput - The return type for the function.
 */

import {ai, withTokenAudit, truncateInput} from '@/ai/genkit';
import {z} from 'zod';

const SuggestProductPriceInputSchema = z.object({
  productName: z.string().describe("The name of the product."),
  productionCost: z.number().describe("The production cost of one unit of the product."),
  category: z.string().describe("The product's category (e.g., 'Верхняя одежда', 'Трикотаж')."),
  brandSegment: z.string().describe("The segment of the brand (e.g., 'Contemporary', 'Luxury')."),
});
export type SuggestProductPriceInput = z.infer<typeof SuggestProductPriceInputSchema>;

const SuggestProductPriceOutputSchema = z.object({
  suggestedRrp: z.number().describe("The suggested Recommended Retail Price (RRP)."),
  reasoning: z.string().describe("A brief explanation for the suggested price."),
});
export type SuggestProductPriceOutput = z.infer<typeof SuggestProductPriceOutputSchema>;

export async function suggestProductPrice(
  input: SuggestProductPriceInput
): Promise<SuggestProductPriceOutput> {
  const optimizedInput = {
    ...input,
    productName: truncateInput(input.productName, 200),
  };
  return withTokenAudit('suggestProductPrice', optimizedInput, undefined, undefined, (i) => suggestProductPriceFlow(i));
}


const prompt = ai.definePrompt({
    name: 'suggestProductPricePrompt',
    input: {schema: SuggestProductPriceInputSchema},
    output: {schema: SuggestProductPriceOutputSchema},
    config: {
      maxOutputTokens: 300,
      temperature: 0.2, // Low temperature for pricing precision
    },
    prompt: `You are a pricing expert for a fashion e-commerce platform. Your task is to suggest a Recommended Retail Price (RRP) for a new product.

    Product Details:
    - Name: {{{productName}}}
    - Production Cost: {{{productionCost}}} ₽
    - Category: {{{category}}}
    - Brand Segment: {{{brandSegment}}}

    Instructions:
    1.  Calculate a base price by applying a standard markup to the production cost. Use a multiplier between 2.2 and 2.8, depending on the category and segment. (e.g., luxury accessories might have a higher multiplier than basic knitwear).
    2.  Round the calculated price to a psychologically appealing number (e.g., ending in -90, -50, or -00, like 24990 or 25000).
    3.  Provide a brief, one or two-sentence reasoning for your suggestion, mentioning the target margin and market positioning.

    Example Output:
    {
        "suggestedRrp": 24900,
        "reasoning": "Рекомендуемая цена основана на стандартной наценке для категории 'Трикотаж' и обеспечивает маржинальность около 65%, что соответствует сегменту Contemporary."
    }
    `,
});


const suggestProductPriceFlow = ai.defineFlow(
  {
    name: 'suggestProductPriceFlow',
    inputSchema: SuggestProductPriceInputSchema,
    outputSchema: SuggestProductPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
