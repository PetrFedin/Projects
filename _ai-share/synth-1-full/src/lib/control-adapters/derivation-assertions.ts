/**
 * Shared validation throws for derivation builders (Order + Article).
 * Keeps contract failures loud during development without a rule engine.
 */
import type { Blocker, NextAction } from '@/lib/contracts';
import { validateBlocker, validateNextAction } from '@/lib/contracts';

export function assertDerivationBlockerValid(b: Blocker, context: string): void {
  const v = validateBlocker(b);
  if (!v.ok) throw new Error(`${context}: ${v.errors.join('; ')}`);
}

export function assertDerivationNextActionValid(a: NextAction, context: string): void {
  const v = validateNextAction(a);
  if (!v.ok) throw new Error(`${context}: ${v.errors.join('; ')}`);
}
