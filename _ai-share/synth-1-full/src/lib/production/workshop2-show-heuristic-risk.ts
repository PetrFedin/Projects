/**
 * Phase 1B UX: heuristic / demo panels скрыты по умолчанию (PredictiveRisk, VendorBidding).
 * PredictiveRisk: WORKSHOP2_SHOW_HEURISTIC_RISK или NEXT_PUBLIC_WORKSHOP2_SHOW_HEURISTIC_RISK
 * VendorBidding: WORKSHOP2_SHOW_VENDOR_BIDDING или NEXT_PUBLIC_WORKSHOP2_SHOW_VENDOR_BIDDING
 */
function envFlag(
  env: Record<string, string | undefined>,
  serverKey: string,
  publicKey: string
): boolean {
  const raw = env[serverKey] ?? env[publicKey];
  return raw === 'true' || raw === '1';
}

export function isWorkshop2ShowHeuristicRiskEnabled(
  env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {}
): boolean {
  return envFlag(env, 'WORKSHOP2_SHOW_HEURISTIC_RISK', 'NEXT_PUBLIC_WORKSHOP2_SHOW_HEURISTIC_RISK');
}

export function isWorkshop2ShowVendorBiddingEnabled(
  env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {}
): boolean {
  const flag = envFlag(
    env,
    'WORKSHOP2_SHOW_VENDOR_BIDDING',
    'NEXT_PUBLIC_WORKSHOP2_SHOW_VENDOR_BIDDING'
  );
  if (!flag) return false;
  const market = String(env.WORKSHOP2_MARKET ?? 'ru')
    .trim()
    .toLowerCase();
  return market !== 'global' ? true : flag;
}
