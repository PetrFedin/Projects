/**
 * Discover + заявки на доступ: пайплайн «запрос → одобрение → каталог» с аудитом.
 * Без API — localStorage; при API те же поля в REST.
 */

import type { BuyerApplication, BuyerApplicationStatus } from './buyer-onboarding';

export interface BuyerApplicationAuditEntry {
  id: string;
  applicationId: string;
  at: string;
  action: 'submitted' | 'under_review' | 'approved' | 'rejected';
  userId?: string;
  userLabel: string;
  comment?: string;
}

export interface BuyerApplicationWithBrand extends BuyerApplication {
  /** К какому бренду обращена заявка (для фильтра на стороне бренда) */
  brandId: string;
  brandName: string;
}

export interface BuyerApplicationsState {
  applications: BuyerApplicationWithBrand[];
  audit: BuyerApplicationAuditEntry[];
}

const STORAGE_KEY = 'b2b_buyer_applications_v1';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function seed(): BuyerApplicationsState {
  return {
    applications: [
      {
        id: 'app-1',
        brandId: 'syntha',
        brandName: 'Syntha',
        companyName: 'Boutique No.7',
        contactName: 'Ольга С.',
        email: 'olga@boutique7.ru',
        phone: '+7 812 …',
        country: 'Россия',
        city: 'СПб',
        applicantType: 'retailer',
        status: 'pending',
        message: 'Хотим представлять премиум outerwear в СПб.',
        submittedAt: new Date().toISOString(),
      },
      {
        id: 'app-2',
        brandId: 'syntha',
        brandName: 'Syntha',
        companyName: 'ЦУМ',
        contactName: 'Михаил В.',
        email: 'buyer@tsum.ru',
        country: 'Россия',
        city: 'Москва',
        applicantType: 'retailer',
        status: 'under_review',
        message: 'Расширение ассортимента FW26.',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    audit: [
      {
        id: 'aud-1',
        applicationId: 'app-1',
        at: new Date().toISOString(),
        action: 'submitted',
        userLabel: 'Система',
      },
      {
        id: 'aud-2',
        applicationId: 'app-2',
        at: new Date(Date.now() - 86400000).toISOString(),
        action: 'submitted',
        userLabel: 'Система',
      },
      {
        id: 'aud-3',
        applicationId: 'app-2',
        at: new Date(Date.now() - 3600000).toISOString(),
        action: 'under_review',
        userLabel: 'Мария (бренд)',
        comment: 'Проверяем территорию',
      },
    ],
  };
}

export function loadBuyerApplicationsState(): BuyerApplicationsState {
  if (typeof window === 'undefined') return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as BuyerApplicationsState;
  } catch {
    return seed();
  }
}

export function saveBuyerApplicationsState(state: BuyerApplicationsState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function submitApplication(payload: {
  brandId?: string;
  brandName?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  applicantType: BuyerApplication['applicantType'];
  message?: string;
}): BuyerApplicationWithBrand {
  const state = loadBuyerApplicationsState();
  const id = generateId('app');
  const app: BuyerApplicationWithBrand = {
    id,
    brandId: payload.brandId ?? 'syntha',
    brandName: payload.brandName ?? 'Syntha',
    companyName: payload.companyName,
    contactName: payload.contactName,
    email: payload.email,
    phone: payload.phone,
    country: payload.country,
    city: payload.city,
    applicantType: payload.applicantType,
    status: 'pending',
    message: payload.message,
    submittedAt: new Date().toISOString(),
  };
  const auditEntry: BuyerApplicationAuditEntry = {
    id: generateId('aud'),
    applicationId: id,
    at: app.submittedAt,
    action: 'submitted',
    userLabel: 'Байер (заявка)',
  };
  const next: BuyerApplicationsState = {
    applications: [...state.applications, app],
    audit: [auditEntry, ...state.audit],
  };
  saveBuyerApplicationsState(next);
  return app;
}

export function setApplicationStatus(
  applicationId: string,
  status: BuyerApplicationStatus,
  userLabel: string,
  brandComment?: string
): BuyerApplicationsState | null {
  const state = loadBuyerApplicationsState();
  const app = state.applications.find((a) => a.id === applicationId);
  if (!app) return null;
  const action =
    status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'under_review';
  const updated: BuyerApplicationWithBrand = {
    ...app,
    status,
    brandComment,
    reviewedAt: new Date().toISOString(),
    reviewedBy: userLabel,
  };
  const auditEntry: BuyerApplicationAuditEntry = {
    id: generateId('aud'),
    applicationId,
    at: updated.reviewedAt!,
    action,
    userLabel,
    comment: brandComment,
  };
  const next: BuyerApplicationsState = {
    applications: state.applications.map((a) => (a.id === applicationId ? updated : a)),
    audit: [auditEntry, ...state.audit],
  };
  saveBuyerApplicationsState(next);
  return next;
}

export function getApplicationsByBrand(
  brandId: string,
  state: BuyerApplicationsState
): BuyerApplicationWithBrand[] {
  return state.applications.filter((a) => a.brandId === brandId || !brandId);
}

export function getAuditForApplication(
  applicationId: string,
  state: BuyerApplicationsState
): BuyerApplicationAuditEntry[] {
  return state.audit
    .filter((e) => e.applicationId === applicationId)
    .sort((a, b) => b.at.localeCompare(a.at));
}
