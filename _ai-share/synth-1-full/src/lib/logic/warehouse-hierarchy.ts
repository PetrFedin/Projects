/**
 * [Phase 2 — Inventory / Warehouse / Logistics architecture]
 * Канон: docs/domain-model/inventory-execution.md.
 * Модель иерархии складских локаций (Warehouse Hierarchy).
 */

export type LocationType = 'warehouse' | 'zone' | 'bin' | 'retail_store' | 'virtual_pool';

export interface WarehouseLocation {
  id: string;
  parentId?: string; // Для вложенности (склад -> зона -> ячейка)
  name: string;
  type: LocationType;
  
  /** Свойства локации */
  properties: {
    isPickable: boolean;
    isStaging: boolean;
    capacity?: number;
    temperatureControlled?: boolean;
  };

  /** Гео-привязка (для складов и магазинов) */
  address?: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };

  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

/**
 * Возвращает полный путь локации (напр. "WH-01 > Zone-A > Bin-10").
 */
export function getLocationPath(locationId: string, allLocations: WarehouseLocation[]): string {
  const loc = allLocations.find(l => l.id === locationId);
  if (!loc) return locationId;
  
  if (loc.parentId) {
    return `${getLocationPath(loc.parentId, allLocations)} > ${loc.name}`;
  }
  
  return loc.name;
}

/**
 * Проверяет, является ли локация частью (потомком) другой локации.
 */
export function isDescendantOf(childId: string, parentId: string, allLocations: WarehouseLocation[]): boolean {
  const child = allLocations.find(l => l.id === childId);
  if (!child || !child.parentId) return false;
  
  if (child.parentId === parentId) return true;
  
  return isDescendantOf(child.parentId, parentId, allLocations);
}
