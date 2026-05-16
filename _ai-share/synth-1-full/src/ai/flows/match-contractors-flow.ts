'use server';

import { ai, withTokenAudit } from '@/ai/genkit';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';
import { z } from 'zod';
import type { SewingPlanPartnerRow } from '@/lib/production/workshop2-sewing-plan-reference-types';

const MatchContractorsInputSchema = z.object({
  articleDescription: z.string().describe("Description of the article, BOM, and required operations."),
  contractors: z.array(z.any()).describe("List of available contractor profiles to evaluate."),
  userId: z.string().optional().describe('The ID of the user requesting the analysis.'),
});

export type MatchContractorsInput = z.infer<typeof MatchContractorsInputSchema>;

const ContractorMatchSchema = z.object({
  contractorId: z.string().describe("The ID of the matched contractor"),
  score: z.number().describe("Match score from 0 to 100"),
  rationale: z.string().describe("Explanation of why this contractor is a good fit for this article"),
});

export type ContractorMatch = z.infer<typeof ContractorMatchSchema>;

const MatchContractorsOutputSchema = z.object({
  matches: z.array(ContractorMatchSchema).describe("Top 3 contractor matches"),
});

export type MatchContractorsOutput = z.infer<typeof MatchContractorsOutputSchema>;

export async function matchContractors(
  input: MatchContractorsInput
): Promise<MatchContractorsOutput> {
  return withTokenAudit('matchContractors', input, input.userId, 1, (i) =>
    matchContractorsFlow(i)
  );
}

const matchContractorsFlow = ai.defineFlow(
  {
    name: 'matchContractorsFlow',
    inputSchema: MatchContractorsInputSchema,
    outputSchema: MatchContractorsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `Выступай в роли эксперта по подбору производственных мощностей (Matchmaker).
Проанализируй требования к изделию и выбери 3 наиболее подходящих подрядчиков из предоставленного списка.

Требования к изделию:
${input.articleDescription}

Доступные подрядчики:
${JSON.stringify(input.contractors, null, 2)}

Верни массив из 3 лучших совпадений (matches) в формате JSON, где для каждого указан contractorId, оценка совпадения (score 0-100) и обоснование выбора (rationale).`,
        output: { schema: MatchContractorsOutputSchema },
        config: {
          temperature: 0.2,
        }
      });
      
      if (!output) throw new Error('AI failed to generate a response');
      return output;
    } catch (error: unknown) {
      console.warn('Matchmaker AI failed, using local fallback:', getUnknownErrorMessage(error, 'unknown'));

      // Fallback: just return the first 3 if available
      const fallbackMatches = input.contractors.slice(0, 3).map((c: any, i: number) => ({
        contractorId: c.id,
        score: 80 - (i * 10),
        rationale: 'Выбрано автоматически (ошибка AI сервиса)'
      }));

      return { matches: fallbackMatches };
    }
  }
);