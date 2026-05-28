export interface DeliveryTask {
  orderId: string;
  weightKg: number;
  volumeCm3: number;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  distanceKm: number;
  isExpress: boolean;
}

export interface VehicleFleet {
  dronesAvailable: number;
  droneMaxPayloadKg: number;
  droneRangeKm: number;
  evAvailable: number; // Electric Vehicles (Vans)
  evMaxPayloadKg: number;
  evRangeKm: number;
}

export interface RoutingDecision {
  orderId: string;
  assignedVehicle: 'drone' | 'ev_van' | '3rd_party_courier';
  estimatedCostUSD: number;
  carbonEmissionsKg: number;
  reasoning: string;
}

/**
 * [Phase 30 — Autonomous Last-Mile Routing (Drone/EV Fleet)]
 * Движок оптимизации "последней мили" (Last-Mile Delivery).
 * Управляет собственным флотом дронов и электромобилей (EV).
 * Распределяет заказы так, чтобы минимизировать стоимость доставки,
 * уложиться в окна времени (SLA) и свести углеродный след к нулю.
 */
export class LastMileRoutingEngine {
  /**
   * Назначает оптимальное транспортное средство для доставки заказа.
   */
  public static optimizeRoute(task: DeliveryTask, fleet: VehicleFleet): RoutingDecision {
    let assignedVehicle: RoutingDecision['assignedVehicle'] = '3rd_party_courier';
    let estimatedCostUSD = 12.5; // Базовая стоимость сторонней курьерской службы
    let carbonEmissionsKg = task.distanceKm * 0.2; // ДВС-курьер выбрасывает ~200g CO2 на км
    let reasoning = 'Defaulting to 3rd-party ICE courier due to fleet constraints.';

    // 1. Проверяем возможность доставки Дроном (Drone Delivery)
    // Дроны идеальны для легких, срочных посылок на короткие расстояния
    const canUseDrone =
      fleet.dronesAvailable > 0 &&
      task.weightKg <= fleet.droneMaxPayloadKg &&
      task.distanceKm <= fleet.droneRangeKm;

    if (canUseDrone && task.isExpress) {
      assignedVehicle = 'drone';
      estimatedCostUSD = 2.5; // Электричество + амортизация
      carbonEmissionsKg = 0; // Нулевой выхлоп (Zero Emissions)
      reasoning = `Express order (${task.weightKg}kg, ${task.distanceKm}km) fits drone constraints. Assigned to autonomous drone. Zero emissions. Cost: $${estimatedCostUSD}.`;
      return {
        orderId: task.orderId,
        assignedVehicle,
        estimatedCostUSD,
        carbonEmissionsKg,
        reasoning,
      };
    }

    // 2. Проверяем возможность доставки Электромобилем (EV Van)
    // EV подходят для тяжелых посылок или дальних маршрутов
    const canUseEV =
      fleet.evAvailable > 0 &&
      task.weightKg <= fleet.evMaxPayloadKg &&
      task.distanceKm <= fleet.evRangeKm;

    if (canUseEV) {
      assignedVehicle = 'ev_van';
      estimatedCostUSD = 5.0; // Дешевле стороннего курьера, но дороже дрона
      carbonEmissionsKg = 0; // Нулевой выхлоп
      reasoning = `Order (${task.weightKg}kg, ${task.distanceKm}km) assigned to Electric Van fleet. Zero emissions. Cost: $${estimatedCostUSD}.`;
      return {
        orderId: task.orderId,
        assignedVehicle,
        estimatedCostUSD,
        carbonEmissionsKg,
        reasoning,
      };
    }

    // 3. Если свой флот занят или не подходит (слишком далеко/тяжело)
    // Отдаем сторонней службе (3rd Party Courier - UPS/FedEx)
    if (task.distanceKm > fleet.evRangeKm) {
      reasoning = `Destination (${task.distanceKm}km) exceeds EV range (${fleet.evRangeKm}km). Routing via 3rd-party courier. Carbon footprint: ${carbonEmissionsKg.toFixed(1)}kg CO2e.`;
    } else if (task.weightKg > fleet.evMaxPayloadKg) {
      reasoning = `Payload (${task.weightKg}kg) exceeds EV capacity (${fleet.evMaxPayloadKg}kg). Routing via 3rd-party freight. Carbon footprint: ${carbonEmissionsKg.toFixed(1)}kg CO2e.`;
    }

    return {
      orderId: task.orderId,
      assignedVehicle,
      estimatedCostUSD,
      carbonEmissionsKg,
      reasoning,
    };
  }
}
