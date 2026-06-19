'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  WORKSHOP2_LIVE_INTEGRATION_LABELS,
  type Workshop2LiveIntegrationKind,
} from '@/lib/production/workshop2-integration-live-required';
import { fetchWorkshop2LiveIntegrationProbes } from '@/lib/production/workshop2-live-integration-probes-client';
import { WORKSHOP2_CEILING_ROADMAP_PATH } from '@/lib/production/workshop2-ceiling-staging-core';

export type Workshop2CeilingEnvStatusPanelProps = {
  catalogId: number;
  kind: Workshop2LiveIntegrationKind;
  /** Точная причина disabled для primary action */
  disabledReasonRu?: string;
  onStagingAttempt?: () => void | Promise<void>;
  stagingBusy?: boolean;
  stagingLabel?: string;
  /** Wave 40: partner ACK из PG mirror после staging contract verify */
  partnerAckId?: string | null;
  stagingContractMode?: boolean;
};

export function Workshop2CeilingEnvStatusPanel({
  catalogId,
  kind,
  disabledReasonRu,
  onStagingAttempt,
  stagingBusy,
  stagingLabel = 'Staging (fail-closed)',
  partnerAckId,
  stagingContractMode: stagingContractModeProp,
}: Workshop2CeilingEnvStatusPanelProps) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [prodLive, setProdLive] = useState<boolean | null>(null);
  const [envKeys, setEnvKeys] = useState<string[]>([]);
  const [unlockHint, setUnlockHint] = useState<string | undefined>();
  const [stagingContractModeProbe, setStagingContractModeProbe] = useState(false);

  useEffect(() => {
    void fetchWorkshop2LiveIntegrationProbes().then((res) => {
      if (!res?.ceilings) return;
      const c = res.ceilings.find((x) => x.catalogId === catalogId);
      if (c) {
        setConfigured(c.configured);
        setProdLive(Boolean(c.live));
        setEnvKeys([...(c.envKeys ?? [])]);
        setUnlockHint(c.unlockHintRu);
        setStagingContractModeProbe(Boolean(c.stagingContractMode));
      }
    });
  }, [catalogId]);

  const stagingContractMode = stagingContractModeProp ?? stagingContractModeProbe;
  const contractButtonLabel = 'Проверить контракт (staging)';
  const live = prodLive === true;
  const envConfigured = configured === true;
  const reason =
    disabledReasonRu ??
    (!envConfigured
      ? (unlockHint ?? WORKSHOP2_LIVE_INTEGRATION_LABELS[kind])
      : !live
        ? 'Env задан (staging/localhost) — prod live URL требуется для ACK.'
        : undefined);

  return (
    <div
      className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/80 p-3"
      data-testid={`workshop2-ceiling-env-${catalogId}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={live ? 'default' : 'outline'} className="text-[9px]">
          #{catalogId} ·{' '}
          {live
            ? 'prod live'
            : envConfigured
              ? 'configured (staging)'
              : stagingContractMode
                ? 'staging contract'
                : 'ceiling 8.9 max'}
        </Badge>
        {partnerAckId ? (
          <Badge variant="secondary" className="font-mono text-[9px]" title="ACK в PG journal">
            staging contract · {partnerAckId}
          </Badge>
        ) : null}
        <span className="text-[10px] text-amber-900">
          {WORKSHOP2_LIVE_INTEGRATION_LABELS[kind]}
        </span>
      </div>
      {envKeys.length > 0 ? (
        <p className="break-all font-mono text-[9px] text-amber-950">Env: {envKeys.join(' | ')}</p>
      ) : null}
      {reason ? <p className="text-[10px] leading-snug text-amber-900">{reason}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-indigo-800" title="См. репозиторий">
          Roadmap: {WORKSHOP2_CEILING_ROADMAP_PATH}
        </span>
        {onStagingAttempt ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            disabled={stagingBusy}
            onClick={() => void onStagingAttempt()}
            title={reason ?? 'HTTP staging — ошибка API не маскируется как success'}
          >
            {stagingBusy ? '…' : stagingContractMode ? contractButtonLabel : stagingLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
