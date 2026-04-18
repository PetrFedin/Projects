/**
 * Типы ответов AI HTTP API для клиентских компонентов (без импорта `@/ai/*`).
 */

export type SummarizeProductReviewsInput = {
  reviews: { text: string; rating: number }[];
};

export type SummarizeProductReviewsOutput = {
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: 'В основном положительные' | 'Смешанные' | 'В основном отрицательные';
};

export type ModerateContentResult = {
  approved: boolean;
  flags?: string[];
  reason?: string;
};

export type AnalyzeWardrobeOutput = {
  summary: string;
  gaps: string[];
  recommendations: string[];
};

export type GenerateContentIdeasOutput = {
  ideas: { title: string; caption: string; hashtags?: string[] }[];
};

export type OutfitPreviewResult = {
  generatedOutfitImage?: string;
};

export type ChatResponseResult = {
  response?: string;
};

export type SuggestProductPriceOutput = {
  suggestedRrp: number;
  reasoning: string;
};

export type CampaignCreativeResult = {
  creativeImageUrl?: string;
};

export type CollaborativeLookbookResult = {
  creativeImageUrl?: string;
};

export type SocialVideoResult = {
  videoUrl?: string;
};
