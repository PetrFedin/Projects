/**
 * Ссылки на трекинг перевозчика по коду/названию и трек-номеру.
 * При интеграции с API перевозчик может приходить кодом (dhl, ups, cdek).
 */

const CARRIER_TRACKING_URLS: Record<string, (track: string) => string> = {
  DHL: (t) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(t)}`,
  'DHL Express': (t) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(t)}`,
  UPS: (t) => `https://www.ups.com/track?tracknum=${encodeURIComponent(t)}`,
  СДЕК: (t) => `https://www.cdek.ru/track.html?order_id=${encodeURIComponent(t)}`,
  CDEK: (t) => `https://www.cdek.ru/track.html?order_id=${encodeURIComponent(t)}`,
  DPD: (t) => `https://tracking.dpd.ru/status/ru_RU/parcel/${encodeURIComponent(t)}`,
  Boxberry: (t) => `https://boxberry.ru/tracking/?id=${encodeURIComponent(t)}`,
};

/** Возвращает URL страницы трекинга перевозчика или null, если шаблон неизвестен. */
export function getCarrierTrackingUrl(carrier: string, trackNumber: string): string | null {
  if (!trackNumber?.trim()) return null;
  const key = Object.keys(CARRIER_TRACKING_URLS).find((k) =>
    carrier.toLowerCase().includes(k.toLowerCase())
  );
  if (!key) return null;
  return CARRIER_TRACKING_URLS[key](trackNumber.trim());
}
