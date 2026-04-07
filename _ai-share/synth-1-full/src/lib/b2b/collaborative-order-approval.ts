/**
 * Candid: Collaborative Order Forms + approval workflow.
 * Совместное заполнение заказа → отправка на согласование → апрув.
 */

export type CollaborativeOrderStatus =
  | 'draft'           // Черновик, редактируют участники
  | 'pending_approval' // Отправлен на согласование
  | 'approved'        // Одобрен, можно конвертировать в заказ
  | 'rejected'        // Отклонён
  | 'ordered';        // Уже оформлен как заказ

export interface CollaborativeOrderParticipant {
  userId: string;
  email: string;
  role: 'editor' | 'approver' | 'viewer';
  joinedAt: string;
}

export interface CollaborativeOrderApprovalStep {
  approverId: string;
  approverEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  actedAt?: string;
}

export interface CollaborativeOrderWithApproval {
  id: string;
  name: string;
  brandId: string;
  collectionId: string;
  status: CollaborativeOrderStatus;
  participants: CollaborativeOrderParticipant[];
  approvalSteps: CollaborativeOrderApprovalStep[];
  itemsCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  /** Кто отправил на approval */
  submittedBy?: string;
  submittedAt?: string;
}
