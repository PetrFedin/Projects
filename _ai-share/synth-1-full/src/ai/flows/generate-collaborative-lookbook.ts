'use server';
/**
 * @fileOverview An AI agent that generates a collaborative lookbook from two product images.
 *
 * - generateCollaborativeLookbook - A function that handles the lookbook generation process.
 * - GenerateCollaborativeLookbookInput - The input type for the function.
 * - GenerateCollaborativeLookbookOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateCollaborativeLookbookInputSchema = z.object({
  productOneName: z.string().describe("The name of the first product."),
  productOneImageDataUri: z
    .string()
    .describe(
      "The image of the first product, as a data URI."
    ),
  productTwoName: z.string().describe("The name of the second product."),
  productTwoImageDataUri: z
    .string()
    .describe(
      "The image of the second product, as a data URI."
    ),
});
export type GenerateCollaborativeLookbookInput = z.infer<typeof GenerateCollaborativeLookbookInputSchema>;

const GenerateCollaborativeLookbookOutputSchema = z.object({
  creativeImageUrl: z
    .string()
    .describe(
      "The data URI of the generated lookbook image."
    ),
});
export type GenerateCollaborativeLookbookOutput = z.infer<typeof GenerateCollaborativeLookbookOutputSchema>;

export async function generateCollaborativeLookbook(
  input: GenerateCollaborativeLookbookInput
): Promise<GenerateCollaborativeLookbookOutput> {
  return generateCollaborativeLookbookFlow(input);
}

const generateCollaborativeLookbookFlow = ai.defineFlow(
  {
    name: 'generateCollaborativeLookbookFlow',
    inputSchema: GenerateCollaborativeLookbookInputSchema,
    outputSchema: GenerateCollaborativeLookbookOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-image-preview'),
        prompt: [
            {media: {url: input.productOneImageDataUri}},
            {media: {url: input.productTwoImageDataUri}},
            {text: `You are an expert fashion stylist and creative director. Your task is to generate a single, cohesive fashion lookbook image that elegantly combines two separate products into one outfit.

            **Products:**
            1.  "${input.productOneName}" (first image)
            2.  "${input.productTwoName}" (second image)

            **Instructions:**
            1.  **Create a Single Model Image:** Generate an image of a single fashion model wearing both products as part of a complete, stylish outfit.
            2.  **Harmonious Styling:** The final look should be well-styled, modern, and aspirational. The two products must look like they were meant to be worn together.
            3.  **Background:** Place the model against a clean, minimalist, high-fashion background (e.g., a studio setting, an architectural backdrop).
            4.  **Do Not Alter Products:** The core design of the products themselves should not be changed.
            5.  **Output:** Generate only the final, styled image. Do not output any text, commentary, or separate images.
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