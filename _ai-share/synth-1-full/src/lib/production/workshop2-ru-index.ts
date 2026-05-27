/**
 * Wave 12: единая точка re-export RU-хелперов (без дублирования логики).
 */
export {
  formatWorkshop2RubCurrency,
  calcWorkshop2VatOnNetRub,
  shouldShowWorkshop2RubInUi,
} from '@/lib/production/workshop2-rub-currency';
export { formatWorkshop2RubAmount } from '@/lib/production/workshop2-b2b-checkout-rub';
export {
  buildWorkshop2Ss27RuJourneySteps,
  resolveWorkshop2Ss27RuJourneyActiveStep,
  buildWorkshop2InspectorUrlForArticle,
  WORKSHOP2_SS27_COLLECTION_ID,
  type Workshop2RuJourneyStep,
  type Workshop2RuJourneyStepId,
} from '@/lib/production/workshop2-ru-journey-ss27';
export {
  evaluateWorkshop2RuMarkingSampleOrderGate,
  workshop2RuMarkingSampleOrderHintRu,
} from '@/lib/production/workshop2-marking-sample-order-gate';
export {
  resolveB2bLineWorkshop2WorkspaceHref,
  buildWorkshop2SchetOffertaApiHref,
} from '@/lib/production/workshop2-b2b-order-workshop2-link';
export {
  buildWorkshop2SetupRuIntegrationRows,
  summarizeWorkshop2SetupRuIntegrationsOneLiner,
} from '@/lib/production/workshop2-setup-ru-integrations-summary';
export {
  normalizeWorkshop2TnvedDigits,
  isWorkshop2TnvedFormatValid,
  buildWorkshop2TnvedFtsLookupUrl,
  summarizeWorkshop2GostSizeMappingHintRu,
  WORKSHOP2_GOST_WOMENS_SIZE_RUN,
} from '@/lib/production/workshop2-ru-wave13-helpers';
export {
  localizeWorkshop2GateCheck,
  mapWorkshop2GateReasonCodeToRu,
  WORKSHOP2_GATE_REASON_RU,
} from '@/lib/production/workshop2-gate-messages-ru';
export { WORKSHOP2_RU_COLLECTION_DEFAULTS } from '@/lib/production/workshop2-collection-defaults-constants';
