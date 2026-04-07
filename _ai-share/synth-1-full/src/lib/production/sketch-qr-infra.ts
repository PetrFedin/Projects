import QRCode from 'qrcode';

/**
 * Локальная генерация QR (без внешних API). Для печати А4 и PDF в ZIP.
 * При появлении бэкенда можно подставить вызов своего `/api/qr` с тем же контрактом.
 */
export async function buildSketchQrDataUrl(text: string): Promise<string | null> {
  const t = text.trim();
  if (!t) return null;
  try {
    return await QRCode.toDataURL(t, { margin: 1, width: 200, errorCorrectionLevel: 'M' });
  } catch {
    return null;
  }
}
