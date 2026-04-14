import { ControlOutput, EntityRef, ControlOwnerRef } from '@/lib/contracts';
import { controlStorage } from './control-storage';
import { interactionLinkage } from './interaction-linkage';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface MultiPartyGate {
  gate_id: string;
  entity_ref: EntityRef;
  required_roles: string[];
  approvals: Record<string, { status: ApprovalStatus; actor_id: string; at: string }>;
  status: ApprovalStatus;
}

/**
 * [Phase 3 — Multi-party Control & Approval Gates]
 * Сервис для управления совместными решениями бренда и партнера (фабрики).
 */
export class MultiPartyControlService {
  private gates: Map<string, MultiPartyGate> = new Map();

  /**
   * Создает ворота утверждения (Gate) для критического изменения.
   */
  public createGate(entityRef: EntityRef, roles: string[]): MultiPartyGate {
    const gateId = `gate-${entityRef.entity_id}-${Date.now()}`;
    const gate: MultiPartyGate = {
      gate_id: gateId,
      entity_ref: entityRef,
      required_roles: roles,
      approvals: {},
      status: 'pending'
    };
    this.gates.set(gateId, gate);
    return gate;
  }

  /**
   * Регистрирует решение одной из сторон.
   */
  public castVote(gateId: string, role: string, actorId: string, decision: 'approve' | 'reject'): MultiPartyGate {
    const gate = this.gates.get(gateId);
    if (!gate) throw new Error('Gate not found');
    if (!gate.required_roles.includes(role)) throw new Error('Role not authorized for this gate');

    gate.approvals[role] = {
      status: decision === 'approve' ? 'approved' : 'rejected',
      actor_id: actorId,
      at: new Date().toISOString()
    };

    // Проверяем, все ли проголосовали
    const allVoted = gate.required_roles.every(r => gate.approvals[r]?.status === 'approved');
    const anyRejected = gate.required_roles.some(r => gate.approvals[r]?.status === 'rejected');

    if (anyRejected) gate.status = 'rejected';
    else if (allVoted) gate.status = 'approved';

    return gate;
  }

  /**
   * Интегрирует статус ворот в ControlOutput.
   */
  public augmentControlWithGates(output: ControlOutput): ControlOutput {
    const entityId = output.entity_ref.entity_id;
    const activeGates = Array.from(this.gates.values()).filter(g => g.entity_ref.entity_id === entityId && g.status === 'pending');

    if (activeGates.length > 0) {
      output.status = 'attention';
      output.reasons.push({ 
        code: 'PENDING_APPROVAL' as any, 
        params: { count: String(activeGates.length) } 
      });
      
      // Если есть висящие утверждения, это блокировщик
      output.blocker_summary.count += activeGates.length;
      output.blocker_summary.highest_severity = 'warning';
    }

    return output;
  }
}

export const multiPartyControl = new MultiPartyControlService();
