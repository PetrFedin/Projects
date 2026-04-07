/**
 * Задел под разметку скетча по фото (ИИ).
 * Подключите реализацию с вызовом модели; пока — пустой провайдер без сети.
 */

export type SketchAiPinCandidate = {
  xPct: number;
  yPct: number;
  suggestedText?: string;
};

export interface SketchAiMarkupProvider {
  proposePinsFromImage(imageDataUrl: string): Promise<SketchAiPinCandidate[]>;
}

export const noopSketchAiMarkupProvider: SketchAiMarkupProvider = {
  async proposePinsFromImage() {
    return [];
  },
};

let activeProvider: SketchAiMarkupProvider = noopSketchAiMarkupProvider;

export function setSketchAiMarkupProvider(p: SketchAiMarkupProvider): void {
  activeProvider = p;
}

export function getSketchAiMarkupProvider(): SketchAiMarkupProvider {
  return activeProvider;
}
