'use server';
/**
 * @fileOverview An AI agent that generates a campaign creative from a product image and a prompt.
 *
 * - generateCampaignCreative - A function that handles the creative generation process.
 * - GenerateCampaignCreativeInput - The input type for the function.
 * - GenerateCampaignCreativeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateCampaignCreativeInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired campaign style.'),
  productName: z.string().describe("The name of the product."),
  productPrice: z.string().describe("The price of the product."),
  productImageDataUri: z
    .string()
    .describe(
      "The image of the product, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type GenerateCampaignCreativeInput = z.infer<typeof GenerateCampaignCreativeInputSchema>;

const GenerateCampaignCreativeOutputSchema = z.object({
  creativeImageUrl: z
    .string()
    .describe(
      "The data URI of the generated creative image. It must include a MIME type and use Base64 encoding."
    ),
});
export type GenerateCampaignCreativeOutput = z.infer<typeof GenerateCampaignCreativeOutputSchema>;

export async function generateCampaignCreative(
  input: GenerateCampaignCreativeInput
): Promise<GenerateCampaignCreativeOutput> {
  return generateCampaignCreativeFlow(input);
}

const generateCampaignCreativeFlow = ai.defineFlow(
  {
    name: 'generateCampaignCreativeFlow',
    inputSchema: GenerateCampaignCreativeInputSchema,
    outputSchema: GenerateCampaignCreativeOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-image-preview'),
        prompt: [
            {media: {url: input.productImageDataUri}},
            {text: `You are an expert creative director for a high-end fashion brand. Your task is to generate a compelling ad campaign poster.

            **Instructions:**
            1.  **Analyze the Product Image:** The provided image is the hero product. Do not alter the product itself, but you can place it in a new, creative context.
            2.  **Incorporate the Prompt:** The user's prompt is: "${input.prompt}". Use this as the primary creative direction.
            3.  **Add Text Elements:** Subtly and tastefully overlay the following text onto the image:
                *   Product Name: "${input.productName}"
                *   Price: "${input.productPrice}"
            4.  **Aesthetic:** The final image should look like a professional, polished advertisement. Maintain a sophisticated and modern aesthetic. The text should be legible but integrated seamlessly into the overall design.
            5.  **Output:** Generate only the final image. Do not output any text or commentary.
            `},
        ],
        config: {
            responseModalities: ['IMAGE'], 
        },
    });

    if (!media || !media.url) {
      return { creativeImageUrl: '' };
    }

    return { creativeImageUrl: media.url };
  }
);
