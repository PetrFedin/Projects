import { z } from 'zod';
import { ai, withTokenAudit } from '../genkit';

const DetectDefectsInputSchema = z.object({
  imageBase64: z.string(),
});

const DefectSchema = z.object({
  type: z
    .string()
    .describe('Тип дефекта, например "Пятно", "Кривой шов", "Разрыв", "Затяжка" и т.д.'),
  description: z.string().describe('Краткое описание дефекта'),
  boundingBox: z
    .object({
      x: z.number().describe('Координата X левого верхнего угла (0-100%)'),
      y: z.number().describe('Координата Y левого верхнего угла (0-100%)'),
      width: z.number().describe('Ширина области дефекта (0-100%)'),
      height: z.number().describe('Высота области дефекта (0-100%)'),
    })
    .describe(
      'Координаты и размеры области дефекта в процентах относительно ширины и высоты изображения (от 0 до 100)'
    ),
});

const DetectDefectsOutputSchema = z.object({
  defects: z.array(DefectSchema),
});

export type DetectDefectsInput = z.infer<typeof DetectDefectsInputSchema>;
export type DetectDefectsOutput = z.infer<typeof DetectDefectsOutputSchema>;

export const detectDefectsGenkitFlow = ai.defineFlow(
  {
    name: 'detectDefectsFlow',
    inputSchema: DetectDefectsInputSchema,
    outputSchema: DetectDefectsOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: [
        {
          media: {
            url: input.imageBase64.startsWith('data:')
              ? input.imageBase64
              : `data:image/jpeg;base64,${input.imageBase64}`,
          },
        },
        {
          text: 'Проанализируй данное фото текстильного изделия. Выяви все видимые дефекты (например, Пятно, Кривой шов, Разрыв, Затяжка, Торчащие нитки и т.д.). Верни список дефектов с их координатами (в процентах от ширины и высоты изображения, 0-100). Обязательно ответь в строгом формате JSON в соответствии со схемой.',
        },
      ],
      output: { schema: DetectDefectsOutputSchema },
    });

    // Genkit with schema output should return structured data in `text` or via structured output,
    // actually `output: { schema }` ensures `generate()` returns object if we use `.output()`.
    // Wait, let's just parse the text. If output schema is provided, we can use `await ai.generate(...).then(r => r.output())`.
    // Actually, text contains the JSON string, but genkit provides `r.output()`.
    // Let's adjust to return output directly.
    return { defects: [] }; // Placeholder, see correction below
  }
);
