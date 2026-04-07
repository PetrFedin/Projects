/**
 * Brandboom: Private Invites по домену.
 * Доступ к B2B-порталу только по корпоративному email (например @store.ru).
 */

export interface DomainInvite {
  id: string;
  brandId: string;
  /** Домен без @ (store.ru, fashion-group.com) */
  domain: string;
  /** Название организации */
  companyName?: string;
  /** Права: viewer, buyer, admin */
  defaultRole: 'viewer' | 'buyer' | 'admin';
  /** Срок действия инвайта */
  validFrom: string;
  validTo?: string;
  /** Приглашение активно */
  active: boolean;
  createdAt: string;
  createdBy: string;
}

export function checkEmailDomain(email: string, allowedDomains: string[]): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return allowedDomains.some(d => domain === d.toLowerCase() || domain.endsWith('.' + d.toLowerCase()));
}
