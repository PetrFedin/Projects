/**
 * Client-safe контракт match-contractors (API JSON ↔ UI).
 * Zod-схемы остаются в `@/ai/flows/match-contractors-flow`.
 */

export interface ContractorMatch {
  contractorId: string;
  score: number;
  rationale: string;
}

export interface MatchContractorsOutput {
  matches: ContractorMatch[];
}

export interface MatchContractorsInput {
  articleDescription: string;
  contractors: unknown[];
  userId?: string;
}
