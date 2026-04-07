/**
 * AI Design Assistant Types
 */

export interface DesignPrompt {
  id: string;
  text: string;
  category: string;
  styleTags: string[];
  colorPalette: string[];
  referenceImageUrls?: string[];
}

export interface DesignIteration {
  id: string;
  promptId: string;
  imageUrl: string;
  createdAt: string;
  aiModel: string;
  parameters: Record<string, any>;
  isFavorite: boolean;
  technicalSpecs?: {
    suggestedFabric: string;
    complexityScore: number; // 1-10
    estimatedCmtCost: number;
  };
}

export interface DesignProject {
  id: string;
  name: string;
  brandId: string;
  iterations: DesignIteration[];
  status: 'ideation' | 'sampling' | 'approved' | 'archived';
}
