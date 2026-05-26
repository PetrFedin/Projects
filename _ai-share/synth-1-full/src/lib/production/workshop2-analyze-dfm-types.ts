/**
 * Client-safe контракт analyze-dfm (API JSON ↔ UI).
 * Zod-схемы остаются в `@/ai/flows/analyze-dfm-flow`.
 */

export type DfmSeverity = 'low' | 'medium' | 'high' | 'critical';

export type DfmComplexityLevel = 'simple' | 'moderate' | 'complex' | 'highly_complex';

export interface DfmIssue {
  severity: DfmSeverity;
  title: string;
  description: string;
  recommendation?: string;
}

export interface AnalyzeDfmOutput {
  complexityLevel: DfmComplexityLevel;
  issues: DfmIssue[];
}

export interface AnalyzeDfmInput {
  articleDescription: string;
  photoUrl?: string;
  userId?: string;
}
