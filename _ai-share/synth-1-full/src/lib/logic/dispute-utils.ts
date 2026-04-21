import { Dispute, DisputeStatus, DisputeMessage, DisputeEvidence } from '../types/disputes';

/**
 * Dispute Resolution Hub Logic
 * Система формализованного цифрового арбитража для B2B-споров.
 */

export function createDispute(
  title: string,
  category: Dispute['category'],
  description: string,
  claimantId: string,
  claimantName: string,
  respondentId: string,
  respondentName: string,
  relatedOrderId?: string,
  claimValue?: number
): Dispute {
  const now = new Date().toISOString();
  return {
    id: `DISP-${Date.now()}`,
    caseNumber: `SYNTH-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    category,
    status: 'filed',
    severity: 'medium',
    claimantId,
    claimantName,
    respondentId,
    respondentName,
    relatedOrderId,
    claimValue,
    currency: 'RUB',
    description,
    evidence: [],
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addMessageToDispute(
  dispute: Dispute,
  senderId: string,
  senderRole: string,
  text: string,
  attachments?: string[]
): { updatedDispute: Dispute; message: DisputeMessage } {
  const message: DisputeMessage = {
    id: `MSG-${Date.now()}`,
    senderId,
    senderRole,
    text,
    timestamp: new Date().toISOString(),
    attachments,
  };

  const updatedDispute: Dispute = {
    ...dispute,
    messages: [...dispute.messages, message],
    updatedAt: message.timestamp,
  };

  return { updatedDispute, message };
}

export function updateDisputeStatus(
  dispute: Dispute,
  newStatus: DisputeStatus,
  resolutionNote?: string,
  refundAmount?: number
): Dispute {
  const now = new Date().toISOString();
  const updated: Dispute = {
    ...dispute,
    status: newStatus,
    updatedAt: now,
    resolutionNote: resolutionNote || dispute.resolutionNote,
    refundAmount: refundAmount !== undefined ? refundAmount : dispute.refundAmount,
  };

  if (newStatus === 'resolved' || newStatus === 'closed') {
    updated.resolvedAt = now;
  }

  return updated;
}

/**
 * AI Dispute Analyzer (Simulated)
 * Анализирует доказательства и историю спора для рекомендации решения.
 */
export async function analyzeDisputeAI(
  dispute: Dispute
): Promise<{ probabilityClaimant: number; suggestedResolution: string; confidence: number }> {
  // Имитация AI-анализа
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const prob = 0.3 + Math.random() * 0.5;
  return {
    probabilityClaimant: prob,
    suggestedResolution:
      prob > 0.6
        ? 'Full refund recommended due to clear evidence of quality issues.'
        : 'Partial refund of 30% suggested for shipping delays with shared responsibility.',
    confidence: 0.85,
  };
}
