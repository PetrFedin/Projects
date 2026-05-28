import { MaterialComponent } from '../core/digital-product-passport';

export interface ShipmentManifest {
  shipmentId: string;
  originCountry: string;
  destinationCountry: string;
  hsCode: string;
  declaredValueUSD: number;
  billOfMaterials: MaterialComponent[];
}

export interface CustomsClearanceResult {
  shipmentId: string;
  status: 'approved' | 'held_for_inspection' | 'rejected_compliance';
  requiredDocuments: string[]; // e.g., 'Commercial Invoice', 'Certificate of Origin'
  complianceFlags: string[];
  estimatedClearanceDays: number;
  reasoning: string;
}

/**
 * [Phase 33 — Cross-Border Customs Auto-Clearance (AI Trade Compliance)]
 * Движок автоматической таможенной очистки (Trade Compliance).
 * Проверяет состав товара (BOM) на наличие запрещенных материалов (например,
 * хлопок из Синьцзяна или кожа редких животных), генерирует необходимые документы
 * и предсказывает время задержки на границе.
 */
export class CustomsClearanceEngine {
  // Список запрещенных регионов/поставщиков (Упрощенный мок)
  private static restrictedRegions = ['XINJIANG', 'NORTH_KOREA', 'IRAN'];
  private static restrictedMaterials = ['EXOTIC_LEATHER', 'IVORY'];

  /**
   * Оценивает партию товара на соответствие таможенным правилам.
   */
  public static evaluateCompliance(manifest: ShipmentManifest): CustomsClearanceResult {
    let status: CustomsClearanceResult['status'] = 'approved';
    let estimatedClearanceDays = 1; // Стандартная растаможка
    let complianceFlags: string[] = [];
    let requiredDocuments: string[] = ['Commercial Invoice', 'Packing List'];
    let reasoning = 'Shipment complies with all international trade regulations.';

    // 1. Проверка состава (Bill of Materials) на запрещенные материалы
    for (const component of manifest.billOfMaterials) {
      // Проверка региона происхождения (например, UFLPA в США)
      if (this.restrictedRegions.includes(component.originCountry.toUpperCase())) {
        status = 'rejected_compliance';
        complianceFlags.push(`UFLPA_VIOLATION_${component.originCountry}`);
        reasoning = `CRITICAL COMPLIANCE FAILURE: Bill of Materials contains ${component.materialName} originating from restricted region (${component.originCountry}). Shipment blocked to prevent seizure and fines.`;
        estimatedClearanceDays = 0;
        break; // Дальше можно не проверять, груз заблокирован
      }

      // Проверка запрещенных материалов (CITES)
      if (this.restrictedMaterials.includes(component.materialName.toUpperCase())) {
        status = 'rejected_compliance';
        complianceFlags.push(`CITES_VIOLATION_${component.materialName}`);
        reasoning = `CRITICAL COMPLIANCE FAILURE: Contains restricted material (${component.materialName}). Shipment blocked.`;
        estimatedClearanceDays = 0;
        break;
      }

      // Если в составе есть переработанные материалы (Recycled) — нужен сертификат
      if (component.isRecycled && !requiredDocuments.includes('GRS_Certificate')) {
        requiredDocuments.push('GRS_Certificate'); // Global Recycled Standard
        complianceFlags.push('RECYCLED_MATERIAL_CLAIM');
      }
    }

    // Если груз заблокирован, возвращаем результат сразу
    if (status === 'rejected_compliance') {
      return {
        shipmentId: manifest.shipmentId,
        status,
        requiredDocuments,
        complianceFlags,
        estimatedClearanceDays,
        reasoning,
      };
    }

    // 2. Проверка стоимости и пошлин (Документы)
    if (manifest.declaredValueUSD > 2500) {
      // Крупные партии требуют сертификат происхождения для применения льготных тарифов (FTA)
      requiredDocuments.push('Certificate of Origin');
      estimatedClearanceDays += 1; // Дополнительный день на проверку сертификата
      complianceFlags.push('HIGH_VALUE_SHIPMENT');
      reasoning = `High-value shipment ($${manifest.declaredValueUSD}). Certificate of Origin required to claim preferential tariffs. Clearance extended to ${estimatedClearanceDays} days.`;
    }

    // 3. Специфичные правила стран
    if (manifest.destinationCountry === 'EU') {
      // В ЕС нужен цифровой паспорт продукта (DPP)
      requiredDocuments.push('Digital Product Passport (DPP)');
      complianceFlags.push('EU_ESPR_COMPLIANCE');
    }

    // Рандомизированная проверка (Customs Hold)
    // Таможня случайно задерживает 5% грузов
    if (Math.random() < 0.05) {
      status = 'held_for_inspection';
      estimatedClearanceDays += 5;
      complianceFlags.push('RANDOM_CUSTOMS_HOLD');
      reasoning = `Shipment randomly selected for physical customs inspection. Estimated clearance delayed by 5 days.`;
    }

    return {
      shipmentId: manifest.shipmentId,
      status,
      requiredDocuments,
      complianceFlags,
      estimatedClearanceDays,
      reasoning,
    };
  }
}
