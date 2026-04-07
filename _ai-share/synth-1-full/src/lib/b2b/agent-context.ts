/**
 * Zedonk: агентский кабинет — один логин, несколько брендов, переключение контекста.
 * Комиссии и отчёты по брендам (мок).
 */

export interface AgentBrand {
  id: string;
  name: string;
  /** Комиссия агента по бренду (мок: %) */
  commissionPercent: number;
  /** Выручка по бренду за период (мок) */
  revenueYtd: number;
  /** Количество заказов по бренду за период */
  ordersCountYtd: number;
}

const STORAGE_KEY_SELECTED = 'b2b_agent_selected_brand_id';

const AGENT_BRANDS: AgentBrand[] = [
  { id: 'syntha', name: 'Syntha', commissionPercent: 8, revenueYtd: 2_400_000, ordersCountYtd: 12 },
  { id: 'apc', name: 'A.P.C.', commissionPercent: 6, revenueYtd: 1_100_000, ordersCountYtd: 8 },
  { id: 'acne', name: 'Acne Studios', commissionPercent: 7, revenueYtd: 850_000, ordersCountYtd: 5 },
];

export function getAgentBrands(): AgentBrand[] {
  return AGENT_BRANDS;
}

export function getSelectedAgentBrandId(): string | null {
  if (typeof window === 'undefined') return AGENT_BRANDS[0]?.id ?? null;
  const stored = localStorage.getItem(STORAGE_KEY_SELECTED);
  if (stored && AGENT_BRANDS.some((b) => b.id === stored)) return stored;
  return AGENT_BRANDS[0]?.id ?? null;
}

export function setSelectedAgentBrandId(brandId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SELECTED, brandId);
}

export function getSelectedAgentBrand(): AgentBrand | null {
  const id = getSelectedAgentBrandId();
  return AGENT_BRANDS.find((b) => b.id === id) ?? null;
}

/** Комиссия агента по выбранному бренду (мок). */
export function getAgentCommissionForBrand(brandId: string): { percent: number; amountYtd: number } {
  const brand = AGENT_BRANDS.find((b) => b.id === brandId);
  if (!brand) return { percent: 0, amountYtd: 0 };
  const amountYtd = Math.round((brand.revenueYtd * brand.commissionPercent) / 100);
  return { percent: brand.commissionPercent, amountYtd };
}
