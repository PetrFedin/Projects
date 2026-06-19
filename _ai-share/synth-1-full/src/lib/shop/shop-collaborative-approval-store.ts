import type {
  ShopCollaborativeApprovalState,
  ShopCollaborativeApprovalStepId,
} from '@/lib/shop/shop-collaborative-approval-feed';

const STORAGE_KEY = 'shop_collaborative_approvals_v1';
const DEFAULT_BUYER = 'shop1';

export function loadShopCollaborativeApprovalLocal(
  buyerId: string,
  orderId: string
): ShopCollaborativeApprovalState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShopCollaborativeApprovalState;
    if (parsed.buyerId !== buyerId || parsed.orderId !== orderId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveShopCollaborativeApprovalLocal(state: ShopCollaborativeApprovalState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function fetchShopCollaborativeApproval(input: {
  buyerId?: string;
  orderId: string;
}): Promise<ShopCollaborativeApprovalState | null> {
  const buyerId = input.buyerId?.trim() || DEFAULT_BUYER;
  const orderId = input.orderId.trim();
  if (!orderId) return null;

  const res = await fetch(
    `/api/shop/b2b/collaborative/approvals?buyerId=${encodeURIComponent(buyerId)}&orderId=${encodeURIComponent(orderId)}`,
    { cache: 'no-store' }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    state?: ShopCollaborativeApprovalState | null;
  };
  if (!res.ok || !json.ok) return loadShopCollaborativeApprovalLocal(buyerId, orderId);
  if (json.state) saveShopCollaborativeApprovalLocal(json.state);
  return json.state ?? loadShopCollaborativeApprovalLocal(buyerId, orderId);
}

export async function advanceShopCollaborativeApprovalStep(input: {
  buyerId?: string;
  orderId: string;
  stepId: ShopCollaborativeApprovalStepId;
}): Promise<{ state: ShopCollaborativeApprovalState; advanced: boolean; storageMode?: string }> {
  const buyerId = input.buyerId?.trim() || DEFAULT_BUYER;
  const orderId = input.orderId.trim();
  if (!orderId) {
    throw new Error('orderId required');
  }

  const res = await fetch('/api/shop/b2b/collaborative/approvals', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyerId, orderId, stepId: input.stepId }),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    state?: ShopCollaborativeApprovalState;
    advanced?: boolean;
    storageMode?: string;
    messageRu?: string;
  };
  if (!res.ok || !json.ok || !json.state) {
    throw new Error(json.messageRu ?? 'Не удалось сохранить шаг approval.');
  }
  saveShopCollaborativeApprovalLocal(json.state);
  return {
    state: json.state,
    advanced: json.advanced === true,
    storageMode: json.storageMode,
  };
}
