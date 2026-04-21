/**
 * Multi-location inventory — остатки по складам/городам (Москва, СПб, регионы).
 */

export type LocationId = 'msk' | 'spb' | 'regions';

export interface InventoryLocation {
  id: LocationId;
  name: string;
  city?: string;
}

export interface StockByLocation {
  locationId: LocationId;
  productId: string;
  sku: string;
  qty: number;
  reserved?: number;
  available: number;
  updatedAt: string;
}

const LOCATIONS: InventoryLocation[] = [
  { id: 'msk', name: 'Москва', city: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург', city: 'Санкт-Петербург' },
  { id: 'regions', name: 'Регионы', city: undefined },
];

const STORAGE_KEY = 'b2b_multi_location_inventory_v1';

function load(): StockByLocation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StockByLocation[]) : [];
  } catch {
    return [];
  }
}

function save(items: StockByLocation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getLocations(): InventoryLocation[] {
  return LOCATIONS;
}

export function getLocation(id: LocationId): InventoryLocation | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

export function getStockByProduct(productId: string): StockByLocation[] {
  return load().filter((s) => s.productId === productId);
}

export function getTotalStock(productId: string): number {
  return load()
    .filter((s) => s.productId === productId)
    .reduce((sum, s) => sum + s.available, 0);
}

export function getStockByLocation(locationId: LocationId): StockByLocation[] {
  return load().filter((s) => s.locationId === locationId);
}
