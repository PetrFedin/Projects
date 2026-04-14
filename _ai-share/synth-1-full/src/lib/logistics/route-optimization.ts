export interface ShippingRoute {
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedDays: number;
  costPerKg: number;
  carbonEmissionsKg: number;
  carrier: string;
}

export interface RouteOptimizationResult {
  selectedRoute: ShippingRoute;
  alternatives: ShippingRoute[];
  reasoning: string;
}

/**
 * [Phase 9 — Dynamic Route Optimization]
 * Оптимизация маршрутов доставки для B2B партий и B2C заказов.
 * Учитывает стоимость, скорость и экологический след (Carbon Footprint).
 */
export class RouteOptimizationEngine {
  // Мок-база маршрутов
  private static routes: ShippingRoute[] = [
    { origin: 'WH-A', destination: 'STORE-1', distanceKm: 500, estimatedDays: 1, costPerKg: 1.5, carbonEmissionsKg: 120, carrier: 'FastTrack' },
    { origin: 'WH-A', destination: 'STORE-1', distanceKm: 550, estimatedDays: 3, costPerKg: 0.8, carbonEmissionsKg: 45, carrier: 'EcoRail' },
    { origin: 'WH-B', destination: 'STORE-1', distanceKm: 1200, estimatedDays: 2, costPerKg: 3.0, carbonEmissionsKg: 300, carrier: 'AirFreight' }
  ];

  /**
   * Выбирает оптимальный маршрут в зависимости от приоритета (скорость, цена, экология).
   */
  public static optimizeRoute(
    origin: string,
    destination: string,
    totalWeightKg: number,
    priority: 'speed' | 'cost' | 'eco' = 'cost'
  ): RouteOptimizationResult | null {
    const availableRoutes = this.routes.filter(r => r.origin === origin && r.destination === destination);
    
    if (availableRoutes.length === 0) return null;

    let bestRoute = availableRoutes[0];
    let bestScore = -Infinity;

    for (const route of availableRoutes) {
      let score = 0;
      
      const totalCost = route.costPerKg * totalWeightKg;
      const totalEmissions = route.carbonEmissionsKg;

      // Нормализуем метрики для скоринга (чем меньше, тем лучше, поэтому вычитаем)
      if (priority === 'speed') {
        score = -route.estimatedDays * 100 - totalCost * 0.1;
      } else if (priority === 'cost') {
        score = -totalCost * 100 - route.estimatedDays * 10;
      } else if (priority === 'eco') {
        score = -totalEmissions * 100 - totalCost * 0.1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestRoute = route;
      }
    }

    const reasoning = `Selected ${bestRoute.carrier} based on ${priority} priority. ` +
      `Est. Days: ${bestRoute.estimatedDays}, Cost: $${(bestRoute.costPerKg * totalWeightKg).toFixed(2)}, ` +
      `Emissions: ${bestRoute.carbonEmissionsKg}kg CO2.`;

    return {
      selectedRoute: bestRoute,
      alternatives: availableRoutes.filter(r => r !== bestRoute),
      reasoning
    };
  }
}
