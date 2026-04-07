'use server';
/**
 * @fileOverview An AI agent that generates an outfit on a user's photo based on a text prompt.
 *
 * - tryOnOutfit - A function that handles the outfit generation and try-on process.
 * - TryOnOutfitInput - The input type for the tryOnOutfit function.
 * - TryOnOutfitOutput - The return type for the tryOnOutfit function.
 */

import {ai, withTokenAudit, truncateInput, withRetry} from '@/ai/genkit';
import {z} from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

const TryOnOutfitInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired outfit style.'),
  userPhotoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TryOnOutfitInput = z.infer<typeof TryOnOutfitInputSchema>;

const TryOnOutfitOutputSchema = z.object({
  generatedOutfitImage: z
    .string()
    .describe(
      "The data URI of the generated image showing the person in the new outfit. It must include a MIME type and use Base64 encoding."
    ),
});
export type TryOnOutfitOutput = z.infer<typeof TryOnOutfitOutputSchema>;

export async function tryOnOutfit(
  input: TryOnOutfitInput
): Promise<TryOnOutfitOutput> {
  const optimizedInput = {
    ...input,
    prompt: truncateInput(input.prompt, 500),
  };
  return withTokenAudit('tryOnOutfit', optimizedInput, undefined, undefined, (i) => tryOnOutfitFlow(i));
}

const tryOnOutfitFlow = ai.defineFlow(
  {
    name: 'tryOnOutfitFlow',
    inputSchema: TryOnOutfitInputSchema,
    outputSchema: TryOnOutfitOutputSchema,
  },
  async input => {
    const {media} = await withRetry(async () => ai.generate({
        model: googleAI.model('gemini-2.5-flash-image-preview'),
        prompt: [
            {media: {url: input.userPhotoDataUri}},
            {text: `Re-draw the person in this image wearing the following outfit: ${input.prompt}. Do not change the person's face or body, only the clothes. The background should remain the same.`},
        ],
        config: {
            responseModalities: ['IMAGE'], 
        },
    }));

    if (!media || !media.url) {
      // Return a specific error or a default image data URI
      return { generatedOutfitImage: '' };
    }

    return {generatedOutfitImage: media.url};
  }
);
