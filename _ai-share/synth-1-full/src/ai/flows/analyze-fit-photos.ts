'use server';

import { ai, withTokenAudit } from '@/ai/genkit';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';
import { z } from 'zod';

const AnalyzeFitPhotosInputSchema = z.object({
  photoUrls: z.array(z.string()).describe("Array of photo URLs or base64 data URIs to analyze."),
  userId: z.string().optional().describe('The ID of the user requesting the analysis.'),
});

export type AnalyzeFitPhotosInput = z.infer<typeof AnalyzeFitPhotosInputSchema>;

const AnalyzeFitPhotosOutputSchema = z.object({
  wrinklesDetected: z.array(z.string()).describe("List of detected wrinkles and fit defects."),
  recommendations: z.array(z.string()).describe("List of recommendations for the pattern maker."),
});

export type AnalyzeFitPhotosOutput = z.infer<typeof AnalyzeFitPhotosOutputSchema>;

export async function analyzeFitPhotos(
  input: AnalyzeFitPhotosInput
): Promise<AnalyzeFitPhotosOutput> {
  return withTokenAudit('analyzeFitPhotos', input, input.userId, input.photoUrls.length, (i) =>
    analyzeFitPhotosFlow(i)
  );
}

const analyzeFitPhotosFlow = ai.defineFlow(
  {
    name: 'analyzeFitPhotosFlow',
    inputSchema: AnalyzeFitPhotosInputSchema,
    outputSchema: AnalyzeFitPhotosOutputSchema,
  },
  async (input) => {
    try {
      const mediaParts = input.photoUrls.map(url => ({ media: { url } }));
      
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: [
          ...mediaParts,
          { text: 'Проанализируй фотографии примерки одежды на модели. Найди заломы, дисбаланс и дефекты посадки. Верни JSON массив обнаруженных дефектов (wrinklesDetected) и рекомендаций конструктору (recommendations).' }
        ],
        output: { schema: AnalyzeFitPhotosOutputSchema },
        config: {
          temperature: 0.2,
        }
      });
      
      if (!output) throw new Error('AI failed to generate a response');
      return output;
    } catch (error: unknown) {
      console.warn('Fit AI failed, using local fallback:', getUnknownErrorMessage(error, 'unknown'));

      return { 
        wrinklesDetected: ['Не удалось проанализировать фото (ошибка AI)'],
        recommendations: ['Проверьте посадку вручную']
      };
    }
  }
);
