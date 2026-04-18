import { dispatchCommitmentUpdated } from '@/lib/control-adapters/control-invalidation-targets';
import { ProductionCommitment, ProductionCommitmentSchema } from './production-schemas';
import { publishProductionQcUpdated } from '../order/domain-event-factories';
import { VisionQCEngine } from '../ai/vision-qc-mock';
import { StateMachine } from '../core/state-machine';

/**
 * [Phase 2 — Production Aggregate]
 * [Phase 17 — Strict State Machines]
 */
export class ProductionAggregate {
  private stateMachine: StateMachine<ProductionCommitment['status']>;

  constructor(private data: ProductionCommitment) {
    this.stateMachine = new StateMachine(data.status, [
      { from: 'planned', to: 'material_wait' },
      { from: ['planned', 'material_wait'], to: 'in_work' },
      { from: 'in_work', to: 'qc_pending' },
      { from: 'qc_pending', to: 'qc_failed' },
      { from: 'qc_failed', to: 'in_work', errorMessage: 'Must return to in_work for rework' },
      {
        from: 'qc_pending',
        to: 'completed',
        guard: (ctx) => ctx.qcPassedQuantity >= ctx.targetQuantity,
        errorMessage: 'Cannot complete: Passed QC quantity is less than target.',
      },
      { from: 'completed', to: 'shipped' },
      { from: ['planned', 'material_wait', 'in_work'], to: 'cancelled' },
    ]);
  }

  public getData(): ProductionCommitment {
    return Object.freeze({ ...this.data, status: this.stateMachine.getState() });
  }

  public changeStatus(newStatus: ProductionCommitment['status']): void {
    this.stateMachine.transition(newStatus, this.data);
    this.data.status = this.stateMachine.getState();
    this.data.metadata.updatedAt = new Date().toISOString();
    this.data.metadata.version += 1;

    dispatchCommitmentUpdated(this.data.id, {
      commitment_ref: {
        commitment_id: this.data.id,
        party_type: 'factory',
        party_id: this.data.factoryId,
        related_entity_refs: [{ entity_type: 'article', entity_id: this.data.articleId }],
      },
    });
  }

  public recordQCResult(gate: {
    inspectorId: string;
    passed: boolean;
    defectsCount: number;
    notes?: string;
    passedQuantity: number;
  }): void {
    if (this.stateMachine.getState() === 'in_work') {
      this.changeStatus('qc_pending');
    }

    const newGate = {
      id: `qc-${Date.now()}`,
      inspectorId: gate.inspectorId,
      passed: gate.passed,
      defectsCount: gate.defectsCount,
      notes: gate.notes,
      checkedAt: new Date().toISOString(),
    };

    this.data.qcGates.push(newGate);
    this.data.qcPassedQuantity += gate.passedQuantity;

    try {
      if (!gate.passed) {
        this.changeStatus('qc_failed');
      } else if (this.data.qcPassedQuantity >= this.data.targetQuantity) {
        this.changeStatus('completed');
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[ProductionAggregate] Failed to update status after QC: ${msg}`);
    }

    this.data.metadata.updatedAt = new Date().toISOString();
    this.data.metadata.version += 1;

    void publishProductionQcUpdated({
      aggregateId: this.data.id,
      version: this.data.metadata.version,
      payload: {
        gateId: newGate.id,
        status: this.data.status,
        defectsFound: gate.defectsCount,
      },
    });
  }

  public async recordAIVisionQC(imageUrl: string, inspectedQuantity: number): Promise<void> {
    const analysis = await VisionQCEngine.analyzeImage(imageUrl);
    const passed = analysis.recommendedAction === 'pass';
    this.recordQCResult({
      inspectorId: 'ai-vision-agent',
      passed,
      defectsCount: analysis.hasDefects ? 1 : 0,
      notes: `[AI Analysis] ${analysis.notes} (Confidence: ${Math.round(analysis.confidence * 100)}%)`,
      passedQuantity: passed ? inspectedQuantity : 0,
    });
  }

  public static createFromLegacy(params: {
    id?: string;
    articleId: string;
    factoryId: string;
    quantity: number;
    deadline: string;
  }): ProductionAggregate {
    const commitment = ProductionCommitmentSchema.parse({
      id: params.id || `cmt-${Date.now()}`,
      type: 'bulk_production',
      status: 'planned',
      articleId: params.articleId,
      factoryId: params.factoryId || 'unknown-factory',
      targetQuantity: params.quantity || 100,
      plannedStartDate: new Date().toISOString(),
      plannedEndDate:
        params.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
    });

    return new ProductionAggregate(commitment);
  }
}
