import { InventoryGrain, calculateATP } from '../logic/inventory-ledger';

/**
 * [Phase 2 — Omnichannel Router]
 * Сервис для интеллектуального выбора локации (магазина/склада).
 * Используется для BOPIS, Ship-from-Store и кросс-кабинетной логистики.
 */

export interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'retail_store';
  coordinates: { lat: number; lng: number };
  ownerId: string;
}

export interface RoutingRequest {
  sku: string;
  quantity: number;
  customerCoordinates?: { lat: number; lng: number };
  preferredLocationId?: string;
  actorId: string;
  actorType: 'brand' | 'shop';
}

export interface RoutingResult {
  success: boolean;
  locationId?: string;
  distanceKm?: number;
  availableStock?: number;
  error?: string;
}

export class OmnichannelRouter {
  /**
   * Находит оптимальную локацию для выдачи/отгрузки.
   */
  public static findOptimalLocation(
    request: RoutingRequest,
    locations: Location[],
    ledgerGrains: InventoryGrain[]
  ): RoutingResult {
    const { sku, quantity, customerCoordinates, actorId, actorType } = request;

    // 1. Фильтруем локации с доступным стоком
    const candidateLocations = locations.filter((loc) => {
      const atp = calculateATP({
        grains: ledgerGrains.filter((g) => g.locationId === loc.id && g.sku === sku),
        actorId,
        actorType,
        channelId: loc.type === 'retail_store' ? 'retail' : undefined,
      });
      return atp >= quantity;
    });

    if (candidateLocations.length === 0) {
      return { success: false, error: 'No locations with sufficient stock' };
    }

    // 2. Если есть предпочтительная локация и там есть сток — выбираем её
    if (request.preferredLocationId) {
      const preferred = candidateLocations.find((l) => l.id === request.preferredLocationId);
      if (preferred) {
        return {
          success: true,
          locationId: preferred.id,
          availableStock: calculateATP({
            grains: ledgerGrains.filter((g) => g.locationId === preferred.id && g.sku === sku),
            actorId,
            actorType,
          }),
        };
      }
    }

    // 3. Если указаны координаты клиента — ищем ближайшую
    if (customerCoordinates) {
      const sortedByDistance = candidateLocations
        .map((loc) => ({
          loc,
          distance: this.calculateDistance(customerCoordinates, loc.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance);

      const nearest = sortedByDistance[0];
      return {
        success: true,
        locationId: nearest.loc.id,
        distanceKm: Math.round(nearest.distance * 10) / 10,
        availableStock: calculateATP({
          grains: ledgerGrains.filter((g) => g.locationId === nearest.loc.id && g.sku === sku),
          actorId,
          actorType,
        }),
      };
    }

    // 4. Fallback: возвращаем первую доступную (обычно склад)
    const fallback =
      candidateLocations.find((l) => l.type === 'warehouse') || candidateLocations[0];
    return {
      success: true,
      locationId: fallback.id,
      availableStock: calculateATP({
        grains: ledgerGrains.filter((g) => g.locationId === fallback.id && g.sku === sku),
        actorId,
        actorType,
      }),
    };
  }

  /**
   * Формула гаверсинуса для расчета расстояния между точками.
   */
  private static calculateDistance(
    p1: { lat: number; lng: number },
    p2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Радиус Земли в км
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
