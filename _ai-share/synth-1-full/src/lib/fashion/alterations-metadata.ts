import type { Product } from '@/lib/types';
import type { AlterationOffer } from './types';

/** Ателье / подшив из PIM (`attributes`). */
export function extractAlterationOffer(product: Product): AlterationOffer | null {
  const a = product.attributes ?? {};
  const raw = a.alterationsAvailable ?? a.alterationAvailable ?? a.tailoring;
  const available =
    raw === true ||
    raw === 'true' ||
    (typeof raw === 'string' && /^(yes|да|1)$/i.test(raw.trim()));
  const listRaw = a.alterationServices ?? a.tailoringServices;
  const services: string[] = Array.isArray(listRaw)
    ? listRaw.map(String)
    : typeof listRaw === 'string'
      ? listRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : [];
  const hem = a.hemServiceCm ?? a.maxHemCm;
  if (hem != null && String(hem).trim()) {
    services.push(`Подшив до ${String(hem).trim()} см (указано в карточке)`);
  }
  const note =
    typeof a.alterationsNote === 'string'
      ? a.alterationsNote
      : typeof a.tailoringNote === 'string'
        ? a.tailoringNote
        : '';

  if (!available && !services.length && !note.trim()) return null;

  return { available: !!available, services, note: note.trim() };
}
