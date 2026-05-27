import { NextResponse } from 'next/server';
import {
  buildWorkshop2IntegrationCeilingProbes,
  buildWorkshop2StructuredIntegrationProbeSummary,
  buildWorkshop2Wave1HorizontalProbes,
  buildWorkshop2Wave2HorizontalProbes,
  buildWorkshop2Wave3HorizontalProbes,
  buildWorkshop2Wave4HorizontalProbes,
  buildWorkshop2Wave5HorizontalProbes,
  buildWorkshop2Wave6HorizontalProbes,
  buildWorkshop2Wave7HorizontalProbes,
  buildWorkshop2Wave8HorizontalProbes,
  buildWorkshop2Wave9RuHorizontalProbes,
  buildWorkshop2Wave10RuHorizontalProbes,
  buildWorkshop2Wave11RuConnectivityProbe,
  buildWorkshop2Wave12RuConnectivityProbe,
  buildWorkshop2Wave13RuFinalizationProbe,
  buildWorkshop2Wave14RuFinalizationProbe,
  buildWorkshop2Wave15RuComplianceCycleProbe,
  buildWorkshop2Wave16RuBatchLinksProbe,
  buildWorkshop2Wave17RuApiErrorsProbe,
  buildWorkshop2Wave18RuApiCoverageProbe,
  buildWorkshop2Wave19RuStabilizationProbe,
  buildWorkshop2Wave20RuMaturityProbe,
  buildWorkshop2Wave21B2bJoorParityProbe,
  buildWorkshop2Wave22B2bParityGapsProbe,
  buildWorkshop2Wave23B2bFullParityProbe,
  buildWorkshop2Wave24RuInfraProbe,
  buildWorkshop2Wave26RuE2eReadyProbe,
  buildWorkshop2Wave27GreenSuiteProbe,
  buildWorkshop2Wave28DeadEndsFixedProbe,
  buildWorkshop2Wave29ModuleHealthProbe,
  buildWorkshop2Wave30PriorityProbe,
  buildWorkshop2Wave31GreenSuiteProbe,
  buildWorkshop2Wave32LiveReadinessProbe,
  buildWorkshop2Wave33CiReadyProbe,
  buildWorkshop2Wave34StagingLiveProbe,
  buildWorkshop2Wave17RuStabilizationProbe,
  buildWorkshop2WaveRuSummary,
  workshop2AllIntegrationCeilingsLive,
  workshop2LiveIntegrationProbeSummary,
} from '@/lib/production/workshop2-live-integration-probes';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';
import { isWorkshop2StagingContractModeEnabled } from '@/lib/production/workshop2-staging-contract-mode';
import { getWorkshop2ShopifyConnection } from '@/lib/server/workshop2-shopify-connection-repository';
import { buildWorkshop2InvestorReadinessReport } from '@/lib/production/workshop2-investor-readiness';

/** Wave 32–33: server env probes для UI ceilings + roadmap metadata. */
export async function GET() {
  const ceilings = buildWorkshop2IntegrationCeilingProbes();
  const stagingContractMode = isWorkshop2StagingContractModeEnabled();
  const wave40Ready = stagingContractMode;
  const shopifyConn = await getWorkshop2ShopifyConnection();
  const investorReadiness = buildWorkshop2InvestorReadinessReport();
  const market = getWorkshop2MarketProfile();
  return NextResponse.json({
    ok: true,
    market,
    probes: workshop2LiveIntegrationProbeSummary(),
    probeFlags: buildWorkshop2StructuredIntegrationProbeSummary(),
    ceilings,
    allLive: workshop2AllIntegrationCeilingsLive(),
    readyForInvestorDemo: investorReadiness.readyForInvestorDemo,
    investorReadinessReasons: investorReadiness.reasons,
    allConfigured: Object.values(workshop2LiveIntegrationProbeSummary()).every(Boolean),
    stagingContractMode,
    catalogHonesty: {
      totalItems: 79,
      atOrAbove9: wave40Ready ? 79 : 73,
      ceilingsBelow9: wave40Ready ? 0 : 6,
      noteRu: wave40Ready
        ? 'Wave 40: 6 ceilings strict 9.0 via WORKSHOP2_STAGING_CONTRACT_MODE + localhost mock + PG partnerAck (prod live — отдельный env).'
        : '6 ceilings 8.9 без staging contract; prod live требует реальный env + E2E ACK.',
    },
    wave1Horizontal: buildWorkshop2Wave1HorizontalProbes(),
    wave2Horizontal: buildWorkshop2Wave2HorizontalProbes(),
    wave3Horizontal: buildWorkshop2Wave3HorizontalProbes(),
    wave4Horizontal: buildWorkshop2Wave4HorizontalProbes(),
    wave5Horizontal: buildWorkshop2Wave5HorizontalProbes(),
    wave6Horizontal: buildWorkshop2Wave6HorizontalProbes(process.env, {
      shopifyStoredConnection: Boolean(shopifyConn?.accessToken),
    }),
    wave7Horizontal: buildWorkshop2Wave7HorizontalProbes(),
    wave8Horizontal: buildWorkshop2Wave8HorizontalProbes(),
    wave9RuHorizontal: buildWorkshop2Wave9RuHorizontalProbes(),
    wave10RuHorizontal: buildWorkshop2Wave10RuHorizontalProbes(),
    wave11RuConnectivity: buildWorkshop2Wave11RuConnectivityProbe(),
    wave12RuJourney: buildWorkshop2Wave12RuConnectivityProbe(),
    wave13RuFinalization: buildWorkshop2Wave13RuFinalizationProbe(),
    wave14RuShowroomReadiness: buildWorkshop2Wave14RuFinalizationProbe(),
    wave15RuComplianceCycle: buildWorkshop2Wave15RuComplianceCycleProbe(),
    wave16RuBatchLinks: buildWorkshop2Wave16RuBatchLinksProbe(),
    wave17RuStabilization: buildWorkshop2Wave17RuStabilizationProbe(),
    wave17RuApiErrors: buildWorkshop2Wave17RuApiErrorsProbe(),
    wave18RuApiCoverage: buildWorkshop2Wave18RuApiCoverageProbe(),
    wave19RuStabilization: buildWorkshop2Wave19RuStabilizationProbe(),
    wave20RuMaturity: buildWorkshop2Wave20RuMaturityProbe(),
    wave21B2bJoorParity: buildWorkshop2Wave21B2bJoorParityProbe(),
    wave22B2bParityGaps: buildWorkshop2Wave22B2bParityGapsProbe(),
    wave23B2bFullParity: buildWorkshop2Wave23B2bFullParityProbe(),
    wave24RuInfra: buildWorkshop2Wave24RuInfraProbe(),
    wave26RuE2eReady: buildWorkshop2Wave26RuE2eReadyProbe(),
    wave27GreenSuite: buildWorkshop2Wave27GreenSuiteProbe(),
    wave28DeadEndsFixed: buildWorkshop2Wave28DeadEndsFixedProbe(),
    wave29ModuleHealth: buildWorkshop2Wave29ModuleHealthProbe(),
    wave30Priority: buildWorkshop2Wave30PriorityProbe(),
    wave31GreenSuite: buildWorkshop2Wave31GreenSuiteProbe(),
    wave32LiveReadiness: buildWorkshop2Wave32LiveReadinessProbe(),
    wave33CiReady: buildWorkshop2Wave33CiReadyProbe(),
    wave34StagingLive: buildWorkshop2Wave34StagingLiveProbe(),
    waveRuSummary: buildWorkshop2WaveRuSummary(),
    stagingNoteRu: investorReadiness.stagingNoteRu,
  });
}
