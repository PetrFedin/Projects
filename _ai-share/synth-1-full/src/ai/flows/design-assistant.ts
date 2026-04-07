'use server';

import { withTokenAudit } from '../genkit';
import { DesignPrompt, DesignIteration } from '../../lib/types/ai-design';

/**
 * AI Design Assistant Flow
 * Генерация вариантов дизайна по текстовому описанию и создание техпакетов.
 */

export interface DesignGenerationInput {
  brandId: string;
  prompt: DesignPrompt;
  count: number;
}

export async function generateDesignVariants(input: DesignGenerationInput): Promise<DesignIteration[]> {
  return withTokenAudit(
    'generateDesignVariants',
    input,
    input.brandId,
    undefined,
    async (payload) => {
      console.log(`[AI_DESIGN] Generating ${payload.count} design variants for: ${payload.prompt.text}`);
      
      // Имитация работы AI-модели (например, Stable Diffusion / Midjourney API)
      await new Promise(resolve => setTimeout(resolve, 3500));

      const iterations: DesignIteration[] = [];
      for (let i = 0; i < payload.count; i++) {
        iterations.push({
          id: `ITER-${Date.now()}-${i}`,
          promptId: payload.prompt.id,
          imageUrl: `/ai/design-mock-${i + 1}.jpg`, // Mock image
          createdAt: new Date().toISOString(),
          aiModel: 'Synth-Vision-Gen 2.0',
          parameters: { denoising: 0.75, sampler: 'DPM++ 2M SDE' },
          isFavorite: false,
          technicalSpecs: {
            suggestedFabric: i === 0 ? 'Silk Satin' : 'Recycled Polyester',
            complexityScore: 7,
            estimatedCmtCost: 25 + Math.random() * 10
          }
        });
      }
      return iterations;
    }
  );
}

/**
 * Преобразование дизайна в черновик техпакета (BOM skeleton)
 */
export async function convertToTechPackDraft(iteration: DesignIteration) {
  return {
    productId: `P-AI-${Date.now()}`,
    name: "AI Generated Concept",
    status: 'draft',
    bom: [
      { id: 'b1', category: 'fabric', name: iteration.technicalSpecs?.suggestedFabric || 'Standard Fabric', consumptionPerUnit: 1.5, unit: 'meters', wastageAllowance: 0.05 }
    ],
    version: '0.1'
  };
}
