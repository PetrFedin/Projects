/**
 * Wave 24 RU: UI-режимы CTA ЭДО на вкладке «Задание» — mock/staging vs kontur/sbis.
 * Fail-closed: без URL провайдера кнопка отправки недоступна.
 */
import {
  resolveWorkshop2EdoProvider,
  resolveWorkshop2KonturEdoBaseUrl,
  type Workshop2EdoProvider,
} from '@/lib/production/workshop2-edo-signoff';

export type Workshop2EdoAssignmentCtaMode = 'mock_demo' | 'send_edo' | 'disabled';

/** Публичные URL тестовых кабинетов (без секретов). */
export const WORKSHOP2_EDO_PROVIDER_CABINET_URLS: Record<
  Exclude<Workshop2EdoProvider, 'none' | 'mock'>,
  string
> = {
  kontur: 'https://diadoc.kontur.ru/',
  sbis: 'https://online.sbis.ru/',
  goskey: 'https://www.gosuslugi.ru/goskey',
};

export function workshop2EdoProviderLabelRu(provider: Workshop2EdoProvider): string {
  switch (provider) {
    case 'kontur':
      return 'Контур Diadoc';
    case 'sbis':
      return 'СБИС ЭДО';
    case 'goskey':
      return 'Госключ';
    case 'mock':
      return 'ЭДО mock (dev/staging)';
    default:
      return 'Не настроен';
  }
}

export function resolveWorkshop2EdoProviderCabinetUrl(
  provider: Workshop2EdoProvider
): string | null {
  if (provider === 'none' || provider === 'mock') return null;
  return WORKSHOP2_EDO_PROVIDER_CABINET_URLS[provider] ?? null;
}

/** Режим primary CTA + нужен ли poll edo-status после POST. */
export function resolveWorkshop2EdoAssignmentCta(input?: {
  env?: Record<string, string | undefined>;
}): {
  provider: Workshop2EdoProvider;
  mode: Workshop2EdoAssignmentCtaMode;
  primaryLabelRu: string;
  pollAfterSend: boolean;
  cabinetUrl: string | null;
  providerLabelRu: string;
  configured: boolean;
  hintRu: string;
} {
  const env = input?.env ?? process.env;
  const provider = resolveWorkshop2EdoProvider(env);

  if (provider === 'mock') {
    return {
      provider,
      mode: 'mock_demo',
      primaryLabelRu: 'Подписать (демо)',
      pollAfterSend: false,
      cabinetUrl: null,
      providerLabelRu: workshop2EdoProviderLabelRu(provider),
      configured: true,
      hintRu: 'Mock/staging: мгновенная подпись без HTTP в Контур/СБИС.',
    };
  }

  if (provider === 'kontur' || provider === 'sbis') {
    const baseUrl =
      provider === 'kontur'
        ? resolveWorkshop2KonturEdoBaseUrl(env)
        : env.WORKSHOP2_SBIS_EDO_API_URL?.trim();
    const configured = Boolean(baseUrl);
    return {
      provider,
      mode: configured ? 'send_edo' : 'disabled',
      primaryLabelRu: 'Отправить в ЭДО',
      pollAfterSend: true,
      cabinetUrl: resolveWorkshop2EdoProviderCabinetUrl(provider),
      providerLabelRu: workshop2EdoProviderLabelRu(provider),
      configured,
      hintRu: configured
        ? `POST fail-closed → poll «Ожидает подписи» / «Подписано» / ошибка API.`
        : `Задайте ${provider === 'kontur' ? 'WORKSHOP2_KONTUR_DIADOC_URL' : 'WORKSHOP2_SBIS_EDO_API_URL'}.`,
    };
  }

  return {
    provider,
    mode: 'disabled',
    primaryLabelRu: 'ЭДО не настроен',
    pollAfterSend: false,
    cabinetUrl: null,
    providerLabelRu: workshop2EdoProviderLabelRu(provider),
    configured: false,
    hintRu: 'WORKSHOP2_EDO_PROVIDER=mock|kontur|sbis для пилота РФ.',
  };
}
