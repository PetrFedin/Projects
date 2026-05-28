'use server';
/**
 * @fileOverview An AI agent that generates outfits from a text prompt.
 *
 * - generateOutfitFromPrompt - A function that handles the outfit generation process.
 * - GenerateOutfitFromPromptInput - The input type for the generateOutfitFromPrompt function.
 * - GenerateOutfitFromPromptOutput - The return type for the generateOutfitFromPrompt function.
 */

import { ai, withTokenAudit, truncateInput, withRetry } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateOutfitFromPromptInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired outfit style.'),
});
export type GenerateOutfitFromPromptInput = z.infer<typeof GenerateOutfitFromPromptInputSchema>;

const GenerateOutfitFromPromptOutputSchema = z.object({
  generatedOutfitImage: z
    .string()
    .describe(
      "The data URI of the generated outfit image, which must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateOutfitFromPromptOutput = z.infer<typeof GenerateOutfitFromPromptOutputSchema>;

export async function generateOutfitFromPrompt(
  input: GenerateOutfitFromPromptInput
): Promise<GenerateOutfitFromPromptOutput> {
  const optimizedInput = {
    ...input,
    prompt: truncateInput(input.prompt, 500),
  };
  return withTokenAudit('generateOutfitFromPrompt', optimizedInput, undefined, undefined, (i) =>
    generateOutfitFromPromptFlow(i)
  );
}

const generateOutfitFromPromptFlow = ai.defineFlow(
  {
    name: 'generateOutfitFromPromptFlow',
    inputSchema: GenerateOutfitFromPromptInputSchema,
    outputSchema: GenerateOutfitFromPromptOutputSchema,
  },
  async (input) => {
    const { media } = await withRetry(async () =>
      ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: input.prompt,
      })
    );

    if (!media || !media.url) {
      // Return a specific error or a default image data URI
      return { generatedOutfitImage: '' };
    }

    return { generatedOutfitImage: media.url };
  }
);
