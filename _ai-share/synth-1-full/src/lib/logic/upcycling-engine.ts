import { ArticleAggregate } from '../article/article-aggregate';
import { MaterialComponent } from '../core/digital-product-passport';

export interface UpcyclingConcept {
  originalSku: string;
  newSku: string;
  newCategory: string;
  newBillOfMaterials: MaterialComponent[];
  estimatedUpcyclingCostUSD: number;
  projectedResaleValueUSD: number;
  reasoning: string;
}

/**
 * [Phase 33 — Circular Economy Upcycling Engine (Waste to Value)]
 * Движок апсайклинга (переработки в более ценный продукт).
 * Если клиент возвращает порванную или неликвидную вещь (Trade-in: Poor condition),
 * вместо того чтобы выбрасывать ее (Recycle) или продавать за копейки (Clearance),
 * система генерирует концепт нового продукта (Upcycled SKU).
 * Например: старые джинсы -> джинсовые шорты или сумка-шоппер.
 */
export class UpcyclingEngine {
  /**
   * Генерирует концепт апсайклинга для поврежденной вещи.
   */
  public static generateUpcycledConcept(
    damagedArticle: ArticleAggregate,
    originalBom: MaterialComponent[],
    damageType: 'torn_sleeves' | 'stained_hem' | 'faded_color'
  ): UpcyclingConcept | null {
    // 1. Оценка пригодности для апсайклинга
    // Если вещь из дешевого полиэстера, апсайклинг не окупится (проще сжечь/переработать)
    const isPremiumMaterial = originalBom.some(m => 
      m.materialName.toLowerCase().includes('denim') || 
      m.materialName.toLowerCase().includes('leather') ||
      m.materialName.toLowerCase().includes('wool')
    );

    if (!isPremiumMaterial) {
      return null; // Отправляем в обычный ресайклинг
    }

    let newCategory = '';
    let estimatedUpcyclingCostUSD = 0;
    let projectedResaleValueUSD = 0;
    let reasoning = '';

    // 2. Выбор стратегии апсайклинга в зависимости от повреждения
    if (damageType === 'torn_sleeves' && damagedArticle.pim.category === 'jacket') {
      // Порваны рукава куртки -> делаем жилетку (Vest)
      newCategory = 'vest';
      estimatedUpcyclingCostUSD = 15; // Работа швеи по обрезке и обработке проймы
      projectedResaleValueUSD = 85; // Жилетки стоят дешевле курток, но это лучше, чем 0
      reasoning = `Sleeves are torn. Upcycling jacket into a premium vest. Cost: $${estimatedUpcyclingCostUSD}. Expected Resale: $${projectedResaleValueUSD}.`;
    } else if (damageType === 'stained_hem' && damagedArticle.pim.category === 'pants') {
      // Грязный/порванный низ штанин -> делаем шорты (Shorts)
      newCategory = 'shorts';
      estimatedUpcyclingCostUSD = 10; // Обрезка и подгибка
      projectedResaleValueUSD = 45;
      reasoning = `Hem is stained/damaged. Upcycling pants into summer shorts. Cost: $${estimatedUpcyclingCostUSD}. Expected Resale: $${projectedResaleValueUSD}.`;
    } else if (damageType === 'faded_color') {
      // Выцветшая вещь -> красим (Garment Dyeing) или делаем пэчворк-сумку
      newCategory = 'tote_bag';
      estimatedUpcyclingCostUSD = 25; // Раскрой на лоскуты и пошив сумки
      projectedResaleValueUSD = 60;
      reasoning = `Fabric is faded. Upcycling into a patchwork tote bag. Cost: $${estimatedUpcyclingCostUSD}. Expected Resale: $${projectedResaleValueUSD}.`;
    } else {
      // Неизвестный паттерн повреждения
      return null;
    }

    // 3. Формирование нового BOM (Bill of Materials)
    // Мы берем старые материалы и помечаем их как "Upcycled"
    const newBom: MaterialComponent[] = originalBom.map(m => ({
      ...m,
      materialName: `Upcycled ${m.materialName}`,
      isRecycled: true
    }));

    // Добавляем новую фурнитуру (например, нитки или молнию для сумки)
    newBom.push({
      materialName: 'New Trims (Thread/Zippers)',
      percentage: 5,
      originCountry: 'LOCAL',
      supplierId: 'internal-upcycling-lab',
      isRecycled: false
    });

    return {
      originalSku: damagedArticle.id,
      newSku: `upc-${damagedArticle.id}-${Date.now()}`,
      newCategory,
      newBillOfMaterials: newBom,
      estimatedUpcyclingCostUSD,
      projectedResaleValueUSD,
      reasoning
    };
  }
}
