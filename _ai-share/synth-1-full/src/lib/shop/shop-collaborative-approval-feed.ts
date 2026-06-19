/** PG-backed collaborative order approval steps (shop collection_order). */

export type ShopCollaborativeApprovalStepId = 'matrix' | 'margin' | 'submit';

export type ShopCollaborativeApprovalState = {
  buyerId: string;
  orderId: string;
  matrixDone: boolean;
  marginDone: boolean;
  submitDone: boolean;
  updatedAt: string;
};

export const SHOP_COLLABORATIVE_APPROVAL_STEP_ORDER: readonly ShopCollaborativeApprovalStepId[] = [
  'matrix',
  'margin',
  'submit',
] as const;

export function shopCollaborativeApprovalStepDone(
  state: ShopCollaborativeApprovalState,
  stepId: ShopCollaborativeApprovalStepId
): boolean {
  if (stepId === 'matrix') return state.matrixDone;
  if (stepId === 'margin') return state.marginDone;
  return state.submitDone;
}

export function shopCollaborativeApprovalCanAdvance(
  state: ShopCollaborativeApprovalState,
  stepId: ShopCollaborativeApprovalStepId
): boolean {
  if (shopCollaborativeApprovalStepDone(state, stepId)) return false;
  const idx = SHOP_COLLABORATIVE_APPROVAL_STEP_ORDER.indexOf(stepId);
  if (idx <= 0) return true;
  const prev = SHOP_COLLABORATIVE_APPROVAL_STEP_ORDER[idx - 1];
  return shopCollaborativeApprovalStepDone(state, prev);
}

export function shopCollaborativeApprovalStepsFromState(state: ShopCollaborativeApprovalState): {
  id: ShopCollaborativeApprovalStepId;
  labelRu: string;
  done: boolean;
}[] {
  return [
    { id: 'matrix', labelRu: 'Matrix qty locked', done: state.matrixDone },
    { id: 'margin', labelRu: 'Landed margin OK', done: state.marginDone },
    { id: 'submit', labelRu: 'Submit to brand', done: state.submitDone },
  ];
}

export function defaultShopCollaborativeApprovalState(input: {
  buyerId: string;
  orderId: string;
}): ShopCollaborativeApprovalState {
  return {
    buyerId: input.buyerId,
    orderId: input.orderId,
    matrixDone: false,
    marginDone: false,
    submitDone: false,
    updatedAt: new Date().toISOString(),
  };
}
