/**
 * Company Accounts — одно юрлицо, несколько пользователей (директор, байер, бухгалтер).
 * Shopify Plus B2B style.
 */

export type CompanyUserRole = 'admin' | 'director' | 'buyer' | 'accountant' | 'viewer';

export interface CompanyUser {
  id: string;
  email: string;
  name: string;
  role: CompanyUserRole;
  isPrimary: boolean;
}

export interface CompanyAccount {
  id: string;
  /** Название компании (юрлицо) */
  legalName: string;
  inn?: string;
  kpp?: string;
  users: CompanyUser[];
  /** Группа клиентов для этой компании */
  customerGroupId?: string;
  /** Net terms для компании (переопределяет группу) */
  netTermDays?: number;
  /** Освобождение от НДС */
  vatExempt?: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'b2b_company_accounts_v1';

function load(): CompanyAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompanyAccount[]) : [];
  } catch {
    return [];
  }
}

function save(accounts: CompanyAccount[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export function getCompanyAccounts(): CompanyAccount[] {
  return load();
}

export function getCompanyAccount(id: string): CompanyAccount | undefined {
  return load().find((a) => a.id === id);
}

export function getCompanyByUserId(userId: string): CompanyAccount | undefined {
  return load().find((a) => a.users.some((u) => u.id === userId));
}

export const ROLE_LABELS: Record<CompanyUserRole, string> = {
  admin: 'Администратор',
  director: 'Директор',
  buyer: 'Байер',
  accountant: 'Бухгалтер',
  viewer: 'Наблюдатель',
};
