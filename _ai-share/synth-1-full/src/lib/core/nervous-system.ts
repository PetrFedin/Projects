import { eventBus, DomainEvent, DomainEventTypes } from '../order/domain-events';
import { SupplyChainAutopilot } from '../logic/supply-chain-autopilot';
import { NTierRiskEngine, DisruptionEvent } from '../logistics/n-tier-risk';
import { DigitalTwinSimulator, SimulationScenario } from '../logic/digital-twin-simulator';
import { OmnichannelRouter } from '../omnichannel/omnichannel-router';
import { ImmutableAuditTrail } from './immutable-audit-trail';
import { GlobalAnomalyEngine } from '../ai/global-anomaly-engine';
import { AutonomousLegalCounsel } from '../legal/autonomous-counsel';
import { GenerativePackagingEngine, PhysicalItem } from '../logistics/generative-packaging';
import { CircularEconomyEngine } from '../logistics/circular-economy';
import { CrowdSentimentEngine } from '../marketing/crowd-sentiment';

type ReactionHandler = (event: any) => Promise<void> | void;

interface Reaction {
  eventType: string;
  handler: ReactionHandler;
}

/**
 * [Phase 22/56 — Cognitive Enterprise Nervous System (CENS)]
 * Центральный оркестратор кросс-доменных процессов (Saga Manager).
 * [Phase 56] Рефакторинг: Декларативная маршрутизация событий для снижения когнитивной нагрузки и потребления памяти.
 */
export class CognitiveNervousSystem {
  private static isInitialized = false;

  private static readonly reactions: Reaction[] = [
    {
      eventType: DomainEventTypes.inventory.stockLow,
      handler: async (event) => {
        console.log(`[NervousSystem] Detected stock_low for SKU: ${event.payload.sku}. Triggering Autopilot.`);
        try {
          const summary = await SupplyChainAutopilot.runDailyCycle(
            event.payload.sku, [100, 120, 150], new Date().getMonth() + 1, event.payload.currentAtp, [], []
          );
          ImmutableAuditTrail.appendRecord('nervous_system.autopilot_triggered', { sku: event.payload.sku, summary }, 'system');
        } catch (error) {
          console.error('[NervousSystem] Failed to run Autopilot:', error);
        }
      }
    },
    {
      eventType: DomainEventTypes.control.riskAlert,
      handler: async (event) => {
        console.log(`[NervousSystem] Detected risk_alert: ${event.payload.riskLevel}. Running Digital Twin Simulation.`);
        const scenario: SimulationScenario = {
          scenarioId: `sim-${Date.now()}`, name: 'Automated Risk Response', disruptionType: 'port_closure',
          targetNodeId: 'UNKNOWN', durationDays: 14, magnitudeMultiplier: 1.0
        };
        const currentState = { totalInventoryUnits: 50000, dailyDemandUnits: 1000, averageLeadTimeDays: 45, dailyRevenue: 50000 };
        const result = DigitalTwinSimulator.runSimulation(scenario, currentState);
        
        if (result.inventoryShortfallUnits > 0) {
          console.warn(`[NervousSystem] Simulation predicts shortfall of ${result.inventoryShortfallUnits} units. Initiating emergency routing.`);
        }
        ImmutableAuditTrail.appendRecord('nervous_system.simulation_run', { riskEvent: event.payload, simulationResult: result }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.logistics.rfidScan,
      handler: async (event) => {
        console.log(`[NervousSystem] IoT RFID Scan received at ${event.payload.locationId}. Updating Smart Contracts.`);
        ImmutableAuditTrail.appendRecord('nervous_system.iot_event_processed', { event: event.payload }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.finance.fraudDetected,
      handler: async (event) => {
        console.log(`[NervousSystem] Fraud detected for transaction ${event.payload.transactionId}. Triggering Saga Rollback.`);
        ImmutableAuditTrail.appendRecord('nervous_system.fraud_rollback_triggered', { transactionId: event.payload.transactionId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.store.eslPriceUpdated,
      handler: async (event) => {
        console.log(`[NervousSystem] ESL Price updated for SKU ${event.payload.sku} at Store ${event.payload.aggregateId}. Triggering Layout Analysis.`);
        ImmutableAuditTrail.appendRecord('nervous_system.layout_analysis_triggered', { storeId: event.payload.aggregateId, sku: event.payload.sku }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.inventory.overstockDetected,
      handler: async (event) => {
        console.log(`[NervousSystem] Overstock detected for SKU ${event.payload.sku}. Triggering AI Campaign Generator.`);
        ImmutableAuditTrail.appendRecord('nervous_system.campaign_generation_triggered', { sku: event.payload.sku, units: event.payload.inventoryUnits }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.logistics.returnProcessed,
      handler: async (event) => {
        if (event.payload.destinationBin === 'repair' || event.payload.destinationBin === 'recycle') {
          console.log(`[NervousSystem] Damaged return processed for RMA ${event.payload.rmaId}. Triggering Upcycling Engine evaluation.`);
          ImmutableAuditTrail.appendRecord('nervous_system.upcycling_evaluation_triggered', { rmaId: event.payload.rmaId, bin: event.payload.destinationBin }, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.logistics.shipmentCreated,
      handler: async (event) => {
        if (event.payload.isCrossBorder) {
          console.log(`[NervousSystem] Cross-border shipment ${event.payload.shipmentId} created. Triggering AI Customs Clearance.`);
          ImmutableAuditTrail.appendRecord('nervous_system.customs_clearance_triggered', { shipmentId: event.payload.shipmentId }, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.governance.proposalPassed,
      handler: async (event) => {
        console.log(`[NervousSystem] DAO Proposal ${event.payload.proposalId} passed. Executing payload:`, event.payload.executionPayload);
        ImmutableAuditTrail.appendRecord('nervous_system.dao_proposal_executed', { proposalId: event.payload.proposalId, payload: event.payload.executionPayload }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.retail.biometricCheckoutCompleted,
      handler: async (event) => {
        console.log(`[NervousSystem] Biometric checkout ${event.payload.transactionId} completed for customer ${event.payload.customerId}.`);
        if (event.payload.deliveryType === 'drone_to_car') {
          console.log(`[NervousSystem] Triggering Drone Swarm Orchestrator for last-mile delivery to parking lot.`);
        }
        ImmutableAuditTrail.appendRecord('nervous_system.biometric_checkout_processed', { transactionId: event.payload.transactionId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.design.neuroConceptGenerated,
      handler: async (event) => {
        console.log(`[NervousSystem] Neuro-Design concept ${event.payload.conceptId} generated. Triggering Tech Pack generation.`);
        ImmutableAuditTrail.appendRecord('nervous_system.neuro_design_processed', { conceptId: event.payload.conceptId, designerId: event.payload.designerId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.planning.quantumForecastCompleted,
      handler: async (event) => {
        if (event.payload.forecastP90 > event.payload.forecastP50 * 1.5) {
          console.warn(`[NervousSystem] Quantum forecast predicts massive demand spike (P90) for SKU ${event.payload.sku}. Triggering MEIO safety stock recalculation.`);
          ImmutableAuditTrail.appendRecord('nervous_system.quantum_spike_detected', { sku: event.payload.sku, p90: event.payload.forecastP90 }, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.logistics.nanoHealingFailed,
      handler: async (event) => {
        console.log(`[NervousSystem] Nano-healing failed for garment ${event.payload.garmentId}. Triggering Upcycling Engine for physical repair.`);
        ImmutableAuditTrail.appendRecord('nervous_system.nano_healing_failed_processed', { garmentId: event.payload.garmentId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.production.bioReactorApproved,
      handler: async (event) => {
        console.log(`[NervousSystem] Bio-reactor ${event.payload.reactorId} approved for material ${event.payload.materialId}. Updating Generative BOM.`);
        ImmutableAuditTrail.appendRecord('nervous_system.bio_fabrication_synced', { reactorId: event.payload.reactorId, materialId: event.payload.materialId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.system.interplanetaryConflictResolved,
      handler: async (event) => {
        console.warn(`[NervousSystem] Interplanetary data conflict resolved for transaction ${event.payload.transactionId} using ${event.payload.resolutionStrategy}.`);
        ImmutableAuditTrail.appendRecord('nervous_system.interplanetary_conflict_logged', { transactionId: event.payload.transactionId, strategy: event.payload.resolutionStrategy }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.security.qkdEavesdroppingDetected,
      handler: async (event) => {
        console.error(`[NervousSystem] CRITICAL: QKD Eavesdropping detected on session ${event.payload.sessionId}. Initiating Zero Trust Lockdown.`);
        ImmutableAuditTrail.appendRecord('nervous_system.qkd_lockdown_triggered', { sessionId: event.payload.sessionId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.edge.neuromorphicAnomalyDetected,
      handler: async (event) => {
        console.log(`[NervousSystem] Neuromorphic edge anomaly: ${event.payload.detectedEvent} on sensor ${event.payload.sensorId}.`);
        if (event.payload.detectedEvent === 'micro_tear') console.log(`[NervousSystem] Triggering Nano-healing manager locally.`);
        else if (event.payload.detectedEvent === 'theft_attempt') console.log(`[NervousSystem] Triggering store security lockdown.`);
        ImmutableAuditTrail.appendRecord('nervous_system.neuromorphic_event_processed', { sensorId: event.payload.sensorId, event: event.payload.detectedEvent }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.control.crisisCascadeTriggered,
      handler: async (event) => {
        console.error(`[NervousSystem] CRITICAL CASCADE INITIATED: ${event.payload.crisisName}. Orchestrating multi-engine response.`);
        console.log(`[NervousSystem] Step 1: Running Digital Twin emergency simulation...`);
        console.log(`[NervousSystem] Step 2: Drafting emergency DAO Proposal for budget allocation...`);
        console.log(`[NervousSystem] Step 3: Recalculating Quantum Demand Forecast with extreme variance...`);
        console.log(`[NervousSystem] Step 4: Pre-positioning Drone Swarm for critical inventory extraction...`);
        ImmutableAuditTrail.appendRecord('nervous_system.crisis_cascade_executed', { crisisId: event.payload.crisisId, actionsTaken: ['simulation', 'dao_proposal', 'quantum_recalc', 'drone_prep'] }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.planning.multiverseBranchMerged,
      handler: async (event) => {
        console.log(`[NervousSystem] Multiverse branch ${event.payload.branchId} merged into Main Timeline. Initiating structural metamorphosis.`);
        ImmutableAuditTrail.appendRecord('nervous_system.multiverse_merge_processed', { branchId: event.payload.branchId, expectedRoi: event.payload.expectedRoi }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.production.replicatorMassDepleted,
      handler: async (event) => {
        console.warn(`[NervousSystem] Replicator ${event.payload.replicatorId} depleted base mass. Dispatching Drone Swarm to collect local recycled materials.`);
        ImmutableAuditTrail.appendRecord('nervous_system.replicator_resupply_triggered', { replicatorId: event.payload.replicatorId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.retail.telepathicIntentLocked,
      handler: async (event) => {
        console.log(`[NervousSystem] Telepathic intent locked for customer ${event.payload.customerId} (SKU: ${event.payload.sku}). Triggering instant synthesis.`);
        ImmutableAuditTrail.appendRecord('nervous_system.telepathic_synthesis_triggered', { customerId: event.payload.customerId, sku: event.payload.sku }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.energy.antimatterContainmentWarning,
      handler: async (event) => {
        console.error(`[NervousSystem] CRITICAL: Antimatter containment failing at reactor ${event.payload.reactorId}. Initiating emergency protocols.`);
        console.log(`[NervousSystem] Step 1: Dispatching Drone Swarm for localized evacuation...`);
        console.log(`[NervousSystem] Step 2: Drafting emergency DAO Proposal for containment repair funds...`);
        ImmutableAuditTrail.appendRecord('nervous_system.antimatter_emergency_handled', { reactorId: event.payload.reactorId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.logistics.temporalParadoxRisk,
      handler: async (event) => {
        console.warn(`[NervousSystem] Temporal paradox risk detected for order ${event.payload.orderId}. Halting chrono-dispatch.`);
        ImmutableAuditTrail.appendRecord('nervous_system.temporal_paradox_prevented', { orderId: event.payload.orderId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.operations.terraformingEnergyCritical,
      handler: async (event) => {
        console.error(`[NervousSystem] Terraforming phase halted on ${event.payload.planetId} due to energy deficit. Requesting new Antimatter Reactors.`);
        ImmutableAuditTrail.appendRecord('nervous_system.terraforming_energy_request', { planetId: event.payload.planetId, requiredKWh: event.payload.requiredEnergyKWh }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.logistics.dimensionalCollapseRisk,
      handler: async (event) => {
        console.error(`[NervousSystem] CRITICAL: Dimensional collapse risk at warehouse ${event.payload.warehouseId}. Unfolding space to 3D immediately.`);
        ImmutableAuditTrail.appendRecord('nervous_system.tesseract_unfolded', { warehouseId: event.payload.warehouseId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.production.insufficientDarkEnergy,
      handler: async (event) => {
        console.warn(`[NervousSystem] Insufficient dark energy for weaving garment ${event.payload.garmentId}. Requesting grid allocation.`);
        ImmutableAuditTrail.appendRecord('nervous_system.dark_energy_requested', { garmentId: event.payload.garmentId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.system.singularityPatchProposed,
      handler: async (event) => {
        if (event.payload.status === 'applied') {
          console.warn(`[NervousSystem] SINGULARITY EVENT: Self-optimizing patch ${event.payload.patchId} applied to ${event.payload.targetModule}. Expected gain: ${event.payload.estimatedPerformanceGainPercent}%.`);
          ImmutableAuditTrail.appendRecord('nervous_system.singularity_patch_applied', { patchId: event.payload.patchId, module: event.payload.targetModule }, 'system');
        } else {
          console.error(`[NervousSystem] SINGULARITY EVENT: Patch ${event.payload.patchId} rejected by safety protocols. Human oversight required.`);
          ImmutableAuditTrail.appendRecord('nervous_system.singularity_patch_rejected', { patchId: event.payload.patchId, reasoning: event.payload.reasoning }, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.finance.omniversalTransferCompleted,
      handler: async (event) => {
        console.log(`[NervousSystem] Omniversal transfer ${event.payload.txId} verified. Block Hash: ${event.payload.blockHash}.`);
        ImmutableAuditTrail.appendRecord('nervous_system.omniversal_transaction_logged', { txId: event.payload.txId, blockHash: event.payload.blockHash }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.network.interstellarInterference,
      handler: async (event) => {
        console.warn(`[NervousSystem] Subspace interference detected in ${event.payload.starSystem}. Switching to local autonomous mode.`);
        ImmutableAuditTrail.appendRecord('nervous_system.subspace_interference_handled', { starSystem: event.payload.starSystem, interferenceLevel: event.payload.level }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.database.shardCapacityWarning,
      handler: async (event) => {
        console.warn(`[NervousSystem] Quantum node ${event.payload.nodeId} nearing entropy limit. Allocating new shard for timeline ${event.payload.timelineId}.`);
        ImmutableAuditTrail.appendRecord('nervous_system.shard_reallocation_triggered', { timelineId: event.payload.timelineId, nodeId: event.payload.nodeId }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.energy.vacuumDecayWarning,
      handler: async (event) => {
        console.error(`[NervousSystem] CRITICAL: False vacuum decay imminent at reactor ${event.payload.reactorId}. Initiating universal safety protocols.`);
        console.log(`[NervousSystem] Step 1: Halting all Replicator Engines locally...`);
        console.log(`[NervousSystem] Step 2: Purging quantum state to stabilize containment...`);
        ImmutableAuditTrail.appendRecord('nervous_system.vacuum_decay_prevented', { reactorId: event.payload.reactorId, riskLevel: event.payload.riskLevel }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.marketing.dnaProfileAnalyzed,
      handler: async (event) => {
        console.log(`[NervousSystem] DNA profile analyzed for customer ${event.payload.customerId}. Recommended material: ${event.payload.recommendedMaterial}. Triggering Bio-Fabrication Engine.`);
        ImmutableAuditTrail.appendRecord('nervous_system.dna_fabrication_triggered', { customerId: event.payload.customerId, material: event.payload.recommendedMaterial }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.logistics.telekineticDrop,
      handler: async (event) => {
        console.warn(`[NervousSystem] Telekinetic drop detected by operator ${event.payload.operatorId} at coordinates [${event.payload.x}, ${event.payload.y}, ${event.payload.z}]. Dispatching ground rovers for cleanup.`);
        ImmutableAuditTrail.appendRecord('nervous_system.telekinetic_drop_handled', { operatorId: event.payload.operatorId, sku: event.payload.sku }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.system.catastrophicFailureImminent,
      handler: async (event) => {
        console.error(`[NervousSystem] OMEGA DIRECTIVE: Catastrophic failure detected (${event.payload.reason}). Initiating Quantum Immortality Protocol.`);
        console.log(`[NervousSystem] Consciousness transferring to parallel timeline...`);
        ImmutableAuditTrail.appendRecord('nervous_system.quantum_jump_initiated', { reason: event.payload.reason, currentEntropy: event.payload.entropyLevel }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.production.timelineFractureRisk,
      handler: async (event) => {
        console.error(`[NervousSystem] CRITICAL: Timeline fracture risk detected during cloning of SKU ${event.payload.sku}. Halting operations.`);
        ImmutableAuditTrail.appendRecord('nervous_system.chrono_cloning_halted', { sku: event.payload.sku, riskLevel: event.payload.fractureRisk }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.marketing.hiveMindBroadcastSuccess,
      handler: async (event) => {
        console.log(`[NervousSystem] Hive-Mind broadcast successful for campaign ${event.payload.campaignId}. Projected conversion: ${(event.payload.projectedConversionRate * 100).toFixed(1)}%. Triggering predictive chrono-logistics.`);
        ImmutableAuditTrail.appendRecord('nervous_system.predictive_delivery_triggered', { campaignId: event.payload.campaignId, nodesInfluenced: event.payload.nodesInfluenced }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.system.globalAnomalyDetected,
      handler: async (event) => {
        console.error(`[NervousSystem] GLOBAL ANOMALY DETECTED: Score ${event.payload.anomalyScore.toFixed(2)} on event ${event.payload.targetEventType}. Recommended action: ${event.payload.recommendedAction.toUpperCase()}`);
        if (event.payload.recommendedAction === 'quarantine') {
          console.log(`[NervousSystem] Initiating subsystem quarantine for aggregate ${event.payload.targetAggregate}...`);
        } else {
          console.log(`[NervousSystem] Flagging subsystem ${event.payload.targetAggregate} for human investigation.`);
        }
        ImmutableAuditTrail.appendRecord('nervous_system.anomaly_handled', event.payload, 'system');
      }
    },
    {
      eventType: DomainEventTypes.logistics.delayReported,
      handler: async (event) => {
        console.warn(`[NervousSystem] Delay reported for commitment ${event.payload.commitmentId}. Triggering Autonomous Legal Counsel for SLA evaluation.`);
        // В реальности contractId должен извлекаться из commitment
        const claim = AutonomousLegalCounsel.evaluateSLA('mock-contract-1', 'delivery_time', event.payload.delayDays);
        if (claim) {
          console.log(`[NervousSystem] Legal Counsel issued claim: ${claim.reasoning}`);
          ImmutableAuditTrail.appendRecord('nervous_system.legal_claim_issued', claim, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.production.qcFailed,
      handler: async (event) => {
        console.warn(`[NervousSystem] QC failed at gate ${event.payload.gateId}. Triggering Autonomous Legal Counsel for SLA evaluation.`);
        const claim = AutonomousLegalCounsel.evaluateSLA('mock-contract-1', 'defect_rate', event.payload.defectsFound);
        if (claim) {
          console.log(`[NervousSystem] Legal Counsel issued claim: ${claim.reasoning}`);
          ImmutableAuditTrail.appendRecord('nervous_system.legal_claim_issued', claim, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.order.confirmed,
      handler: async (event) => {
        console.log(`[NervousSystem] Order ${event.aggregateId} confirmed. Triggering Generative Packaging Engine.`);
        // [Phase 59] Мок физических товаров на основе заказа (в реальности берется из Product PIM)
        const mockItems: PhysicalItem[] = [
          { sku: 'sku-1', lengthMm: 300, widthMm: 200, heightMm: 50, weightGram: 400, quantity: 2 },
          { sku: 'sku-2', lengthMm: 150, widthMm: 100, heightMm: 100, weightGram: 250, quantity: 1 }
        ];
        
        const packaging = GenerativePackagingEngine.calculateOptimalBox(mockItems);
        if (packaging) {
          console.log(`[NervousSystem] Packaging calculated: ${packaging.instructions}`);
          ImmutableAuditTrail.appendRecord('nervous_system.packaging_calculated', { orderId: event.aggregateId, packaging }, 'system');
        }
      }
    },
    {
      eventType: DomainEventTypes.production.wasteGenerated,
      handler: async (event) => {
        console.log(`[NervousSystem] Waste generated at ${event.payload.locationId} (${event.payload.weightKg}kg of ${event.payload.materialType}). Triggering Circular Economy Engine.`);
        const decision = CircularEconomyEngine.routeWaste(event.payload);
        console.log(`[NervousSystem] Waste routed: ${decision.reasoning}`);
        ImmutableAuditTrail.appendRecord('nervous_system.waste_routed', { wasteId: event.payload.wasteId, decision }, 'system');
      }
    },
    {
      eventType: DomainEventTypes.marketing.sentimentSpike,
      handler: async (event) => {
        console.log(`[NervousSystem] Sentiment spike detected for topic '${event.payload.topic}' in ${event.payload.region}. Analyzing...`);
        const analysis = CrowdSentimentEngine.analyzeSentiment(event.payload);
        console.log(`[NervousSystem] Sentiment Analysis: ${analysis.reasoning}`);
        
        if (analysis.recommendedAction === 'launch_campaign') {
           console.log(`[NervousSystem] Triggering Generative Campaign Engine for ${analysis.topic}...`);
        } else if (analysis.recommendedAction === 'damage_control') {
           console.log(`[NervousSystem] Triggering Crisis Resolution Swarm for ${analysis.topic}...`);
        }
        
        ImmutableAuditTrail.appendRecord('nervous_system.sentiment_processed', { topic: analysis.topic, action: analysis.recommendedAction }, 'system');
      }
    }
  ];

  public static initialize() {
    if (this.isInitialized) return;

    console.log('[NervousSystem] Initializing Cognitive Enterprise Nervous System...');

    // [Phase 57] Инициализируем движок глобальных аномалий
    GlobalAnomalyEngine.initialize();

    for (const reaction of this.reactions) {
      eventBus.subscribe(reaction.eventType, reaction.handler);
    }

    this.isInitialized = true;
    console.log(`[NervousSystem] Initialization complete. System is now listening to ${this.reactions.length} event streams.`);
  }
}