export type WasteMaterialType =
  | 'cotton_scraps'
  | 'polyester_blend'
  | 'cardboard_offcuts'
  | 'defective_garments'
  | 'chemical_dye';

export interface WasteItem {
  wasteId: string;
  locationId: string;
  materialType: WasteMaterialType;
  weightKg: number;
  purityPercentage: number; // 0.0 - 1.0 (How clean/sorted the waste is)
}

export interface RecyclingPartner {
  partnerId: string;
  acceptedMaterials: WasteMaterialType[];
  minPurityRequired: number;
  pricePaidPerKgUSD: number; // If positive, they buy it. If negative, we pay them to dispose.
  carbonOffsetPerKg: number; // kg CO2 saved by recycling instead of landfill
  distanceKm: number; // Simplified distance from current location
}

export interface WasteRoutingDecision {
  wasteId: string;
  selectedPartnerId: string;
  action: 'sell_for_recycling' | 'pay_for_disposal' | 'internal_upcycling';
  financialImpactUSD: number; // Net revenue or cost (including transport)
  carbonOffsetKg: number;
  reasoning: string;
}

/**
 * [Phase 60 — Autonomous Circular Economy Engine (Waste Routing)]
 * ИИ-движок для управления отходами (тканевые обрезки, картон, брак).
 * Автоматически маршрутизирует отходы к оптимальным партнерам по переработке,
 * максимизируя финансовую выгоду (или минимизируя затраты на утилизацию)
 * и максимизируя экологический эффект (ESG/Carbon Offset).
 */
export class CircularEconomyEngine {
  // Стоимость транспортировки 1 кг на 1 км (упрощенно)
  private static readonly TRANSPORT_COST_PER_KG_KM = 0.005;
  // Выбросы CO2 при транспортировке 1 кг на 1 км
  private static readonly TRANSPORT_CARBON_PER_KG_KM = 0.0001;

  // Mock DB of recycling partners
  private static partners: RecyclingPartner[] = [
    {
      partnerId: 'eco-threads-inc',
      acceptedMaterials: ['cotton_scraps', 'defective_garments'],
      minPurityRequired: 0.8,
      pricePaidPerKgUSD: 0.5,
      carbonOffsetPerKg: 2.1,
      distanceKm: 50,
    },
    {
      partnerId: 'poly-melt-corp',
      acceptedMaterials: ['polyester_blend'],
      minPurityRequired: 0.9,
      pricePaidPerKgUSD: 0.2,
      carbonOffsetPerKg: 1.5,
      distanceKm: 120,
    },
    {
      partnerId: 'cardboard-revive',
      acceptedMaterials: ['cardboard_offcuts'],
      minPurityRequired: 0.5,
      pricePaidPerKgUSD: 0.1,
      carbonOffsetPerKg: 1.2,
      distanceKm: 20,
    },
    {
      partnerId: 'toxic-disposal-llc',
      acceptedMaterials: ['chemical_dye'],
      minPurityRequired: 0.0,
      pricePaidPerKgUSD: -2.0,
      carbonOffsetPerKg: 0.0,
      distanceKm: 200,
    }, // We pay them
  ];

  /**
   * Принимает решение о маршрутизации партии отходов.
   */
  public static routeWaste(waste: WasteItem): WasteRoutingDecision {
    // [Phase 60] Math Hardening: защита от NaN и отрицательного веса
    const safeWeightKg = Math.max(0.01, isNaN(waste.weightKg) ? 1 : waste.weightKg);
    const safePurity = Math.max(
      0.0,
      Math.min(1.0, isNaN(waste.purityPercentage) ? 0.5 : waste.purityPercentage)
    );

    // 1. Поиск подходящих партнеров
    const eligiblePartners = this.partners.filter(
      (p) => p.acceptedMaterials.includes(waste.materialType) && safePurity >= p.minPurityRequired
    );

    if (eligiblePartners.length === 0) {
      // Если никто не берет, отправляем на внутренний апсайклинг (или свалку, но мы за ESG)
      return {
        wasteId: waste.wasteId,
        selectedPartnerId: 'internal_facility',
        action: 'internal_upcycling',
        financialImpactUSD: -(safeWeightKg * 0.5), // Внутренние затраты на хранение/переработку
        carbonOffsetKg: 0,
        reasoning: `No external partners found for ${waste.materialType} with purity ${(safePurity * 100).toFixed(0)}%. Routing to internal upcycling facility.`,
      };
    }

    // 2. Оценка каждого партнера (Финансы + Экология)
    let bestPartner = eligiblePartners[0];
    let bestScore = -Infinity;
    let bestFinancialImpact = 0;
    let bestCarbonOffset = 0;

    for (const partner of eligiblePartners) {
      const transportCost = safeWeightKg * partner.distanceKm * this.TRANSPORT_COST_PER_KG_KM;
      const materialRevenue = safeWeightKg * partner.pricePaidPerKgUSD;
      const netFinancialImpact = materialRevenue - transportCost;

      const transportCarbon = safeWeightKg * partner.distanceKm * this.TRANSPORT_CARBON_PER_KG_KM;
      const grossCarbonOffset = safeWeightKg * partner.carbonOffsetPerKg;
      const netCarbonOffset = grossCarbonOffset - transportCarbon;

      // Комбинированный скор: 1 USD = 1 балл, 1 кг CO2 = 2 балла (высокий приоритет ESG)
      const combinedScore = netFinancialImpact + netCarbonOffset * 2;

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestPartner = partner;
        bestFinancialImpact = netFinancialImpact;
        bestCarbonOffset = netCarbonOffset;
      }
    }

    const action = bestPartner.pricePaidPerKgUSD >= 0 ? 'sell_for_recycling' : 'pay_for_disposal';

    return {
      wasteId: waste.wasteId,
      selectedPartnerId: bestPartner.partnerId,
      action,
      financialImpactUSD: Number(bestFinancialImpact.toFixed(2)),
      carbonOffsetKg: Number(bestCarbonOffset.toFixed(2)),
      reasoning: `Selected ${bestPartner.partnerId} (Dist: ${bestPartner.distanceKm}km). Net Revenue: $${bestFinancialImpact.toFixed(2)}. Net Carbon Offset: ${bestCarbonOffset.toFixed(2)}kg CO2.`,
    };
  }
}
