'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WORKSHOP2_RU_COLLECTION_DEFAULTS } from '@/lib/production/workshop2-collection-defaults-constants';
import {
  resolveWorkshop2EdoAssignmentCta,
  resolveWorkshop2EdoProviderCabinetUrl,
  workshop2EdoProviderLabelRu,
} from '@/lib/production/workshop2-edo-assignment-cta';
import { resolveWorkshop2EdoProvider } from '@/lib/production/workshop2-edo-signoff';
import { isWorkshop2MarkingApiConfigured } from '@/lib/production/workshop2-marking-honest-sign';
import { buildWorkshop2KonturEdoSetupWizardSteps } from '@/lib/production/workshop2-edo-kontur-client';

/** Wave 13: компактная секция «Интеграции РФ» — read-only toggles из env + probes. */
export type Workshop2RuIntegrationToggle = {
  id: string;
  labelRu: string;
  envKeys: readonly string[];
  configured: boolean;
};

export function buildWorkshop2RuIntegrationToggles(
  env: Record<string, string | undefined> = typeof process !== 'undefined'
    ? (process.env as Record<string, string | undefined>)
    : {}
): Workshop2RuIntegrationToggle[] {
  const has = (...keys: readonly string[]) => keys.some((k) => Boolean(env[k]?.trim()));

  return [
    {
      id: 'moysklad',
      labelRu: 'МойСклад',
      envKeys: ['WORKSHOP2_MOYSKLAD_TOKEN', 'WORKSHOP2_MOYSKLAD_BASE_URL'],
      configured: has('WORKSHOP2_MOYSKLAD_TOKEN', 'WORKSHOP2_MOYSKLAD_BASE_URL'),
    },
    {
      id: 'edo',
      labelRu: 'ЭДО провайдер',
      envKeys: [
        'WORKSHOP2_EDO_PROVIDER',
        'WORKSHOP2_KONTUR_DIADOC_URL',
        'WORKSHOP2_SBIS_EDO_API_URL',
      ],
      configured: has(
        'WORKSHOP2_KONTUR_DIADOC_URL',
        'WORKSHOP2_KONTUR_EDO_API_URL',
        'WORKSHOP2_SBIS_EDO_API_URL',
        'WORKSHOP2_EDO_PROVIDER'
      ),
    },
    {
      id: 'marking',
      labelRu: 'ЧЗ API',
      envKeys: ['WORKSHOP2_MARKING_API_URL'],
      configured: has('WORKSHOP2_MARKING_API_URL'),
    },
    {
      id: 'yukassa',
      labelRu: 'ЮKassa',
      envKeys: ['YUKASSA_SHOP_ID', 'YUKASSA_SECRET_KEY'],
      configured: has('YUKASSA_SHOP_ID', 'YUKASSA_SECRET_KEY'),
    },
    {
      id: 'erp1c',
      labelRu: '1С URL',
      envKeys: ['WORKSHOP2_ERP_1C_BASE_URL', 'WORKSHOP2_FACTORY_ERP_BASE_URL'],
      configured: has('WORKSHOP2_ERP_1C_BASE_URL', 'WORKSHOP2_FACTORY_ERP_BASE_URL'),
    },
  ];
}

export function Workshop2RuIntegrationsSetupPanel() {
  const toggles = useMemo(() => buildWorkshop2RuIntegrationToggles(), []);
  const edoProvider = useMemo(() => resolveWorkshop2EdoProvider(), []);
  const edoCta = useMemo(() => resolveWorkshop2EdoAssignmentCta(), []);
  const markingConnected = useMemo(() => isWorkshop2MarkingApiConfigured(), []);
  const edoCabinetUrl = resolveWorkshop2EdoProviderCabinetUrl(edoProvider);
  const konturWizard = useMemo(() => buildWorkshop2KonturEdoSetupWizardSteps(), []);

  return (
    <div
      className="space-y-3 rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-4"
      data-testid="workshop2-setup-ru-integrations"
      id="kontur-edo"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-emerald-950">Интеграции РФ</p>
        <Link
          href="/api/workshop2/integration-probes"
          className="text-[11px] text-indigo-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          GET integration-probes
        </Link>
      </div>
      <p className="text-[11px] text-slate-600">
        Read-only из env. ЭДО:{' '}
        <span className="font-medium">{workshop2EdoProviderLabelRu(edoProvider)}</span>
        {edoCabinetUrl ? (
          <>
            {' '}
            ·{' '}
            <a
              href={edoCabinetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 underline"
            >
              тестовый кабинет
            </a>
          </>
        ) : null}
        . ЧЗ API:{' '}
        <Badge
          variant={markingConnected ? 'default' : 'outline'}
          className="align-middle text-[9px]"
        >
          {markingConnected ? 'connected' : 'not connected'}
        </Badge>{' '}
        (<code className="text-[10px]">WORKSHOP2_MARKING_API_URL</code>).
      </p>
      <p className="text-[10px] text-slate-500">{edoCta.hintRu}</p>
      <div
        className="rounded-md border border-indigo-200/80 bg-white/80 p-3"
        data-testid="workshop2-kontur-edo-setup-wizard"
      >
        <p className="text-xs font-semibold text-indigo-950">Подключение Контур</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[11px] text-slate-700">
          {konturWizard.map((step) => (
            <li key={step.id} className={step.done ? 'text-emerald-800' : undefined}>
              <span className="font-medium">{step.labelRu}</span>
              {step.envKey ? (
                <span className="ml-1 font-mono text-[10px] text-slate-500">({step.envKey})</span>
              ) : null}
              <span className="block text-[10px] text-slate-500">{step.hintRu}</span>
            </li>
          ))}
        </ol>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {toggles.map((t) => (
          <li
            key={t.id}
            className="flex items-start justify-between gap-2 rounded-md border border-slate-200/80 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900">{t.labelRu}</p>
              <p className="font-mono text-[10px] text-slate-500">{t.envKeys.join(' · ')}</p>
            </div>
            <Badge variant={t.configured ? 'default' : 'outline'} className="shrink-0 text-[9px]">
              {t.configured ? 'on' : 'off'}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Wave 13: дефолты коллекции RU (НДС, RUB, маркировка). */
export function Workshop2CollectionDefaultsSetupPanel({
  defaultCollectionId = 'SS27',
}: {
  defaultCollectionId?: string;
}) {
  const [collectionId, setCollectionId] = useState(defaultCollectionId);
  const [vatPercent, setVatPercent] = useState(WORKSHOP2_RU_COLLECTION_DEFAULTS.vatPercent);
  const [markingRequiredDefault, setMarkingRequiredDefault] = useState(
    WORKSHOP2_RU_COLLECTION_DEFAULTS.markingRequiredDefault
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDefaults = async (cid: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/workshop2/setup/collection-defaults?collectionId=${encodeURIComponent(cid)}`,
        { cache: 'no-store' }
      );
      const json = (await res.json()) as {
        defaults?: { vatPercent?: number; markingRequiredDefault?: boolean };
      };
      if (json.defaults) {
        setVatPercent(json.defaults.vatPercent ?? 20);
        setMarkingRequiredDefault(json.defaults.markingRequiredDefault ?? true);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveDefaults = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/workshop2/setup/collection-defaults', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId,
          vatPercent,
          markingRequiredDefault,
          currency: 'RUB',
        }),
      });
      const json = (await res.json()) as { ok?: boolean; messageRu?: string };
      setMessage(json.ok ? 'Сохранено в file-store collection-defaults' : 'Ошибка сохранения');
    } catch {
      setMessage('Сеть недоступна');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3" data-testid="workshop2-collection-defaults-setup">
      <p className="text-sm font-semibold text-slate-900">Дефолты коллекции (RU)</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="w2-col-defaults-id">ID коллекции</Label>
          <Input
            id="w2-col-defaults-id"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="w2-col-vat">НДС %</Label>
          <Input
            id="w2-col-vat"
            type="number"
            value={vatPercent}
            onChange={(e) => setVatPercent(Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={markingRequiredDefault}
          onChange={(e) => setMarkingRequiredDefault(e.target.checked)}
        />
        Маркировка ЧЗ по умолчанию (apparel)
      </label>
      <p className="text-[11px] text-slate-600">Валюта: RUB (фиксировано для market=ru).</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => void loadDefaults(collectionId)}
        >
          Загрузить
        </Button>
        <Button type="button" size="sm" disabled={loading} onClick={() => void saveDefaults()}>
          Сохранить
        </Button>
      </div>
      {message ? <p className="text-[11px] text-emerald-800">{message}</p> : null}
    </div>
  );
}
