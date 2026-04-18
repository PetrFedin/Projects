/**
 * Демо AI Vision QC — заглушка анализа изображения.
 */
export const VisionQCEngine = {
  async analyzeImage(_imageUrl: string): Promise<{
    recommendedAction: 'pass' | 'fail';
    hasDefects: boolean;
    notes: string;
    confidence: number;
  }> {
    return {
      recommendedAction: 'pass',
      hasDefects: false,
      notes: 'Mock vision analysis',
      confidence: 0.92,
    };
  },
};
