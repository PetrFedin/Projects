import type { UserProfile } from '@/lib/types';

/** Подпись к предприятию из профиля (бренд в кабинете / партнёр). */
export function workshop2TzSignoffOrganizationLabelFromUser(
  user: UserProfile | null | undefined
): string {
  if (!user) return '';
  for (const b of user.brands ?? []) {
    const n = b.name?.trim();
    if (n) return n;
  }
  const partner = user.partnerName?.trim();
  if (partner) return partner;
  return '';
}

const WEAK_SIGNER_LABELS = new Set(['не авторизован']);

/**
 * Для подтверждения секции ТЗ нужно непустое отображаемое имя, не заглушка гостя.
 */
export function workshop2TzSectionSignoffByLabelMeaningful(label: string): boolean {
  const t = label.trim();
  if (t.length < 2) return false;
  if (WEAK_SIGNER_LABELS.has(t.toLowerCase())) return false;
  return true;
}
