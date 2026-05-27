'use server';

import { ai, withTokenAudit } from '@/ai/genkit';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';
import { z } from 'zod';

const AnalyzeDfmInputSchema = z.object({
  articleDescription: z.string().describe('Description of the article and its BOM.'),
  photoUrl: z.string().optional().describe('Optional photo URL or base64 data URI of the sketch.'),
  userId: z.string().optional().describe('The ID of the user requesting the analysis.'),
});

export type AnalyzeDfmInput = z.infer<typeof AnalyzeDfmInputSchema>;

const DfmIssueSchema = z.object({
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity of the issue'),
  title: z.string().describe('Short title of the issue'),
  description: z
    .string()
    .describe('Detailed description of the manufacturability issue or complexity'),
  recommendation: z.string().optional().describe('Recommendation to fix or mitigate the issue'),
});

export type DfmIssue = z.infer<typeof DfmIssueSchema>;

const AnalyzeDfmOutputSchema = z.object({
  complexityLevel: z
    .enum(['simple', 'moderate', 'complex', 'highly_complex'])
    .describe('Overall complexity level of sewing the article'),
  issues: z.array(DfmIssueSchema).describe('List of manufacturability issues and warnings'),
});

export type AnalyzeDfmOutput = z.infer<typeof AnalyzeDfmOutputSchema>;

export async function analyzeDfm(input: AnalyzeDfmInput): Promise<AnalyzeDfmOutput> {
  return withTokenAudit('analyzeDfm', input, input.userId, 1, (i) => analyzeDfmFlow(i));
}

const analyzeDfmFlow = ai.defineFlow(
  {
    name: 'analyzeDfmFlow',
    inputSchema: AnalyzeDfmInputSchema,
    outputSchema: AnalyzeDfmOutputSchema,
  },
  async (input) => {
    try {
      const mediaParts = input.photoUrl ? [{ media: { url: input.photoUrl } }] : [];

      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: [
          ...mediaParts,
          {
            text: `Проанализируй следующее описание изделия и спецификацию материалов (BOM) на предмет технологичности (Design for Manufacturability - DFM). 
          
Описание:
${input.articleDescription}

Найди сложные узлы, потенциальные проблемы при массовом пошиве, несовместимость материалов или излишнюю сложность обработки. 
Верни общий уровень сложности (complexityLevel) и массив проблем (issues) в формате JSON.`,
          },
        ],
        output: { schema: AnalyzeDfmOutputSchema },
        config: {
          temperature: 0.2,
        },
      });

      if (!output) throw new Error('AI failed to generate a response');
      return output;
    } catch (error: unknown) {
      console.warn(
        'DFM AI failed, using local fallback:',
        getUnknownErrorMessage(error, 'unknown')
      );

      return {
        complexityLevel: 'moderate' as const,
        issues: [
          {
            severity: 'high' as const,
            title: 'Ошибка анализа',
            description: 'Не удалось выполнить DFM анализ из-за ошибки AI.',
            recommendation: 'Проверьте технологичность вручную.',
          },
        ],
      };
    }
  }
);
