/**
 * Wave E (#4): онбординг хаба — LS cache не primary SoT; явный drift при finish без PG.
 */
import type { Workshop2HubPgOnlyBackendStatus } from '@/lib/production/workshop2-hub-pg-only-policy';
import { isWorkshop2HubPgServerAvailable } from '@/lib/production/workshop2-hub-pg-only-policy';

export type Workshop2HubOnboardingBrowserFinish = {
  /** Можно закрыть диалог (LS cache допустим как read-on-miss). */
  allowBrowserCache: boolean;
  /** Предупреждение для UI — онбординг не в PG до workspace PUT. */
  warningRu?: string;
  /** Sample-order gate остаётся заблокированным до PG mirror. */
  blocksSampleUntilPgMirror: boolean;
};

/** Finish диалога онбординга: LS «done» без PG — честный drift, не silent success. */
export function evaluateWorkshop2HubOnboardingBrowserFinish(input: {
  backendStatus: Workshop2HubPgOnlyBackendStatus;
  pgReferencesOk?: boolean;
}): Workshop2HubOnboardingBrowserFinish {
  const pgOnline = isWorkshop2HubPgServerAvailable(input.backendStatus);

  if (pgOnline && input.pgReferencesOk !== false) {
    return {
      allowBrowserCache: true,
      warningRu:
        'Онбординг в LS-кэше — финальная запись в PG при открытии workspace (hub_onboarding_mirror PUT).',
      blocksSampleUntilPgMirror: true,
    };
  }

  if (pgOnline && input.pgReferencesOk === false) {
    return {
      allowBrowserCache: true,
      warningRu:
        'PostgreSQL недоступен или справочники в fallback — онбординг только в браузере до восстановления PG.',
      blocksSampleUntilPgMirror: true,
    };
  }

  return {
    allowBrowserCache: true,
    warningRu:
      'Backend offline — онбординг только в localStorage. Sample-order заблокирован до синхронизации с PG.',
    blocksSampleUntilPgMirror: true,
  };
}

/** Wave O — явный gate sample-order / создание образца при PG off в онбординге хаба. */
export function evaluateWorkshop2HubOnboardingPgGate(input: {
  pgStatus: 'ok' | 'disabled' | 'fallback' | 'unknown';
}): {
  blocksSampleCreation: boolean;
  gateCopyRu: string;
} {
  if (input.pgStatus === 'ok') {
    return {
      blocksSampleCreation: false,
      gateCopyRu:
        'PostgreSQL подключён — создание артикула и sample-order доступны после workspace PUT в PG.',
    };
  }
  if (input.pgStatus === 'disabled' || input.pgStatus === 'unknown') {
    return {
      blocksSampleCreation: true,
      gateCopyRu:
        'PostgreSQL не настроен — создание образца и sample-order заблокированы. Поднимите PG: bash scripts/workshop2-pg-bootstrap.sh',
    };
  }
  return {
    blocksSampleCreation: true,
    gateCopyRu:
      'PostgreSQL в fallback (seeds) — sample-order недоступен до полного подключения PG и перезапуска dev.',
  };
}
