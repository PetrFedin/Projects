import type { AssortmentCapsuleIntegrityV1 } from './types';

/** Проверка целостности капсулы (B2B Capsule Checker). */
export function checkCapsuleIntegrity(
  sku: string,
  currentSessionSkus: string[]
): AssortmentCapsuleIntegrityV1 {
  const capsuleId = `CAP-${sku.split('-')[0]}`;
  const required = [
    `${sku.split('-')[0]}-TOP`,
    `${sku.split('-')[0]}-BTM`,
    `${sku.split('-')[0]}-ACC`,
  ];

  const missing = required.filter((req) => !currentSessionSkus.includes(req) && req !== sku);
  const score = Math.max(0, 100 - missing.length * 33);

  return {
    capsuleId,
    requiredSkus: required,
    missingSkus: missing,
    integrityScore: score,
    isCapsuleComplete: missing.length === 0,
  };
}
