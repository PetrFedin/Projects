/**
 * Контекст распродажи / маркдауна для финансового слоя и Knowledge Graph.
 */
export interface ClearanceContext {
  campaignId?: string;
  markdownPercent?: number;
  effectiveFrom?: string;
  reason?: string;
}
