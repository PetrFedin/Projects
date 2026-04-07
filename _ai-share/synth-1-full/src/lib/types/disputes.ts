/**
 * Dispute Resolution Hub Types
 */

export type DisputeStatus = 'draft' | 'filed' | 'under_review' | 'evidence_required' | 'mediation' | 'resolved' | 'closed';
export type DisputeCategory = 'quality_issue' | 'shortage' | 'delayed_delivery' | 'payment_issue' | 'wrong_item' | 'other';
export type DisputeSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface DisputeEvidence {
  id: string;
  type: 'image' | 'video' | 'document' | 'log';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  description: string;
}

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderRole: string;
  text: string;
  timestamp: string;
  attachments?: string[]; // IDs of DisputeEvidence
}

export interface Dispute {
  id: string;
  caseNumber: string;
  title: string;
  category: DisputeCategory;
  status: DisputeStatus;
  severity: DisputeSeverity;
  
  // Parties
  claimantId: string;
  claimantName: string;
  respondentId: string;
  respondentName: string;
  arbitratorId?: string; // Synth-1 Admin
  
  // Context
  relatedOrderId?: string;
  relatedProductId?: string;
  claimValue?: number;
  currency?: string;
  
  // Content
  description: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  
  // Timeline
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  
  // Resolution
  resolutionNote?: string;
  refundAmount?: number;
}

export interface DisputeStats {
  totalActive: number;
  avgResolutionTime: number; // days
  winRate: number; // % of resolved cases for claimant
  totalClaimValue: number;
}
