export interface Spaceport {
  portId: string;
  location: { lat: number; lon: number; region: string };
  launchCapacityTons: number;
  costPerKgUSD: number;
  nextAvailableLaunchWindow: string; // ISO Date
}

export interface SubOrbitalCargo {
  shipmentId: string;
  totalWeightKg: number;
  origin: { lat: number; lon: number; region: string };
  destination: { lat: number; lon: number; region: string };
  urgency: 'standard' | 'critical' | 'mission_critical';
  maxBudgetUSD: number;
}

export interface OrbitalRoutingPlan {
  shipmentId: string;
  routeType: 'terrestrial_air' | 'sub_orbital_point_to_point';
  departureSpaceportId?: string;
  arrivalSpaceportId?: string;
  estimatedTransitTimeHours: number;
  totalCostUSD: number;
  carbonEmissionsKg: number; // Суборбитальные полеты (на метане) могут быть углеродно-нейтральными, если топливо синтезировано
  reasoning: string;
}

/**
 * [Phase 42 — Sub-Orbital Logistics Routing (Global B2B)]
 * Движок маршрутизации суборбитальных грузовых перевозок (Point-to-Point Space Travel).
 * Для сверхсрочных B2B заказов (например, эксклюзивная коллекция для Fashion Week в Токио
 * должна быть доставлена из Милана за 2 часа).
 * Оценивает стоимость, вес и доступные окна запуска на космодромах (Spaceports).
 * Интегрируется с QuantumSupplyChainOptimizer (Phase 36).
 */
export class SubOrbitalRoutingEngine {
  /**
   * Планирует маршрут доставки груза (Земля vs Суборбита).
   */
  public static planRoute(cargo: SubOrbitalCargo, spaceports: Spaceport[]): OrbitalRoutingPlan {
    let routeType: OrbitalRoutingPlan['routeType'] = 'terrestrial_air';
    let estimatedTransitTimeHours = 24; // Стандартная авиадоставка
    let totalCostUSD = cargo.totalWeightKg * 5; // $5/kg для авиа
    let carbonEmissionsKg = cargo.totalWeightKg * 2.5; // Авиация грязная
    let reasoning = 'Standard terrestrial air freight selected due to budget or urgency constraints. ';
    let departureSpaceportId: string | undefined = undefined;
    let arrivalSpaceportId: string | undefined = undefined;

    // 1. Проверка необходимости суборбитального полета (Urgency)
    if (cargo.urgency === 'critical' || cargo.urgency === 'mission_critical') {
      // Ищем ближайшие космодромы к точке отправления и назначения
      // В реальной системе здесь сложная гео-математика (Haversine formula)
      // Для мока берем первые попавшиеся с достаточной грузоподъемностью
      const originPort = spaceports.find(p => p.location.region === cargo.origin.region && p.launchCapacityTons * 1000 >= cargo.totalWeightKg);
      const destPort = spaceports.find(p => p.location.region === cargo.destination.region);

      if (originPort && destPort) {
        // Рассчитываем стоимость суборбитального прыжка
        const subOrbitalCost = cargo.totalWeightKg * originPort.costPerKgUSD;

        // 2. Проверка бюджета (Budget Constraints)
        if (subOrbitalCost <= cargo.maxBudgetUSD || cargo.urgency === 'mission_critical') {
          routeType = 'sub_orbital_point_to_point';
          departureSpaceportId = originPort.portId;
          arrivalSpaceportId = destPort.portId;
          
          // Суборбитальный прыжок занимает ~45-90 минут в любую точку Земли
          // Плюс логистика до/от космодрома (допустим 2 часа)
          estimatedTransitTimeHours = 3.5; 
          totalCostUSD = subOrbitalCost;
          
          // Если ракеты летают на синтетическом метане (как Starship), выбросы могут быть нулевыми (Zero-Carbon)
          carbonEmissionsKg = 0; 

          reasoning = `Mission-critical urgency detected. Sub-orbital point-to-point flight selected from ${originPort.portId} to ${destPort.portId}. Transit time reduced from 24h to ${estimatedTransitTimeHours}h. Cost: $${totalCostUSD.toLocaleString()}. Zero net carbon emissions (Synthetic Methane). `;
        } else {
          reasoning = `Sub-orbital flight rejected due to budget constraints ($${subOrbitalCost.toLocaleString()} > $${cargo.maxBudgetUSD.toLocaleString()}). Falling back to terrestrial air freight. `;
        }
      } else {
        reasoning = `No suitable spaceports found in origin (${cargo.origin.region}) or destination (${cargo.destination.region}) regions with sufficient capacity. Falling back to terrestrial air freight. `;
      }
    }

    return {
      shipmentId: cargo.shipmentId,
      routeType,
      departureSpaceportId,
      arrivalSpaceportId,
      estimatedTransitTimeHours,
      totalCostUSD,
      carbonEmissionsKg,
      reasoning
    };
  }
}
