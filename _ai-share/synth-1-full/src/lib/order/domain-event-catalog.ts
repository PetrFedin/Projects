/**
 * [Phase 62 — Domain Event Type Catalog]
 * Канонические строки типов событий (подписки, Nervous System, интеграции).
 */
export const DomainEventTypes = {
  order: {
    confirmed: 'order.confirmed',
    partialCancelled: 'order.partial_cancelled',
    shipped: 'order.shipped',
    claimResolved: 'order.claim_resolved',
    shipmentCreated: 'order.shipment_created',
  },
  inventory: {
    customerReturnProcessed: 'inventory.customer_return_processed',
    channelTransferCompleted: 'inventory.channel_transfer_completed',
    reconciliationCompleted: 'inventory.reconciliation_completed',
    discrepancyDetected: 'inventory.discrepancy_detected',
    ownershipTransferred: 'inventory.ownership_transferred',
    grainUnlocked: 'inventory.grain_unlocked',
    snapshotCreated: 'inventory.snapshot_created',
    cycleCountCompleted: 'inventory.cycle_count_completed',
    stockLow: 'inventory.stock_low',
    stockReserved: 'inventory.stock_reserved',
    reservationExpired: 'inventory.reservation_expired',
    b2b2cAllocationCompleted: 'inventory.b2b2c_allocation_completed',
    overstockDetected: 'inventory.overstock_detected',
  },
  production: {
    qcUpdated: 'production.qc_updated',
    qcFailed: 'production.qc_failed',
    transferCreated: 'production.transfer_created',
    draftCreated: 'production.draft_created',
    bioReactorApproved: 'production.bio_reactor_approved',
    replicatorMassDepleted: 'production.replicator_mass_depleted',
    insufficientDarkEnergy: 'production.insufficient_dark_energy',
    timelineFractureRisk: 'production.timeline_fracture_risk',
    wasteGenerated: 'production.waste_generated',
  },
  article: {
    readyForProduction: 'article.ready_for_production',
  },
  control: {
    riskAlert: 'control.risk_alert',
    crisisCascadeTriggered: 'control.crisis_cascade_triggered',
  },
  store: {
    eslPriceUpdated: 'store.esl_price_updated',
  },
  system: {
    globalAnomalyDetected: 'system.global_anomaly_detected',
    interplanetaryConflictResolved: 'system.interplanetary_conflict_resolved',
    singularityPatchProposed: 'system.singularity_patch_proposed',
    catastrophicFailureImminent: 'system.catastrophic_failure_imminent',
  },
  logistics: {
    rfidScan: 'logistics.rfid_scan',
    returnProcessed: 'logistics.return_processed',
    shipmentCreated: 'logistics.shipment_created',
    nanoHealingFailed: 'logistics.nano_healing_failed',
    temporalParadoxRisk: 'logistics.temporal_paradox_risk',
    dimensionalCollapseRisk: 'logistics.dimensional_collapse_risk',
    telekineticDrop: 'logistics.telekinetic_drop',
    delayReported: 'logistics.delay_reported',
  },
  finance: {
    fraudDetected: 'finance.fraud_detected',
    omniversalTransferCompleted: 'finance.omniversal_transfer_completed',
  },
  governance: {
    proposalPassed: 'governance.proposal_passed',
  },
  retail: {
    biometricCheckoutCompleted: 'retail.biometric_checkout_completed',
    telepathicIntentLocked: 'retail.telepathic_intent_locked',
  },
  design: {
    neuroConceptGenerated: 'design.neuro_concept_generated',
  },
  planning: {
    quantumForecastCompleted: 'planning.quantum_forecast_completed',
    multiverseBranchMerged: 'planning.multiverse_branch_merged',
  },
  security: {
    qkdEavesdroppingDetected: 'security.qkd_eavesdropping_detected',
  },
  edge: {
    neuromorphicAnomalyDetected: 'edge.neuromorphic_anomaly_detected',
  },
  energy: {
    antimatterContainmentWarning: 'energy.antimatter_containment_warning',
    vacuumDecayWarning: 'energy.vacuum_decay_warning',
  },
  operations: {
    terraformingEnergyCritical: 'operations.terraforming_energy_critical',
  },
  network: {
    interstellarInterference: 'network.interstellar_interference',
  },
  database: {
    shardCapacityWarning: 'database.shard_capacity_warning',
  },
  marketing: {
    dnaProfileAnalyzed: 'marketing.dna_profile_analyzed',
    hiveMindBroadcastSuccess: 'marketing.hive_mind_broadcast_success',
    sentimentSpike: 'marketing.sentiment_spike',
  },
} as const;
