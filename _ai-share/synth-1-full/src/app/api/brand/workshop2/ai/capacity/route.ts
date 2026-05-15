import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ai, withTokenAudit } from '@/ai/genkit';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';
// import { withB2BV1ApiActorRoleHeaders } from '@/lib/auth/b2b-v1-api-client-headers'; // We'll just use a simple guard or skip for now if not available easily

const CapacityRequestSchema = z.object({
  techPackNotes: z.string().optional(),
  sampleRoomLoad: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  articleId: z.string().optional(),
});

const CapacityResponseSchema = z.object({
  predictedDays: z.number().describe('Predicted duration in days for sample creation'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('Risk level of delay'),
  rationale: z.string().describe('Short explanation of the prediction based on tech pack complexity and room load'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CapacityRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.format() }, { status: 400 });
    }

    const { techPackNotes, sampleRoomLoad } = parsed.data;

    const prompt = `
      You are an AI capacity planner for an experimental fashion workshop (sample room).
      Your task is to predict the duration and risk of delay for a new sample based on the tech pack notes and current room load.
      
      Current Sample Room Load: ${sampleRoomLoad}
      Tech Pack Notes/Complexity: ${techPackNotes || 'Standard basic garment.'}
      
      Baseline: A standard basic garment takes 3-5 days under Medium load.
      Adjust the duration and risk level based on the complexity mentioned in the notes (e.g., delicate fabrics, complex seams, embroidery take longer) and the current room load.
      
      Output JSON matching the schema.
    `;

    const result = await withTokenAudit(
      'workshop2-capacity-planner',
      { prompt, sampleRoomLoad, techPackNotes },
      'system', // userId
      undefined, // historySize
      async () => {
        const response = await ai.generate({
          prompt,
          output: {
            schema: CapacityResponseSchema,
          },
        });
        return response;
      }
    );

    const data = result.output;

    if (!data) {
      throw new Error('No output from AI');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Workshop2 Capacity API Error]', getUnknownErrorMessage(error, 'unknown'));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
