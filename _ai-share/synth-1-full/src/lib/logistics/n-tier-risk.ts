export interface SupplierNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3; // 1 = Фабрика (сборка), 2 = Ткацкая (ткань), 3 = Ферма (хлопок)
  location: string;
  dependentNodes: string[]; // ID узлов, которые зависят от этого (вверх по цепочке)
}

export interface DisruptionEvent {
  nodeId: string;
  type: 'weather' | 'strike' | 'bankruptcy' | 'port_closure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedDelayDays: number;
}

export interface CascadingRiskAlert {
  affectedTier1FactoryId: string;
  rootCauseNodeId: string;
  probabilityOfDelay: number; // 0.0 - 1.0
  expectedDelayDays: number;
  reasoning: string;
}

/**
 * [Phase 19 — N-Tier Supply Chain Risk Mapping]
 * Движок глубокого анализа рисков (N-Tier Visibility).
 * Анализирует не только прямых поставщиков (Tier 1), но и их поставщиков (Tier 2/3).
 * Если на хлопковой ферме (Tier 3) забастовка, движок вычисляет вероятность задержки
 * на швейной фабрике (Tier 1) и предупреждает бренд заранее.
 */
export class NTierRiskEngine {
  private network: Map<string, SupplierNode>;

  constructor(nodes: SupplierNode[]) {
    this.network = new Map(nodes.map(n => [n.id, n]));
  }

  /**
   * Просчитывает "эффект домино" от события на глубоких уровнях (Tier 3/2)
   * до финальной фабрики (Tier 1).
   */
  public propagateRisk(event: DisruptionEvent): CascadingRiskAlert[] {
    const rootNode = this.network.get(event.nodeId);
    if (!rootNode) return [];

    const alerts: CascadingRiskAlert[] = [];
    
    // Рекурсивный обход графа вверх по цепочке поставок
    const traverse = (currentNode: SupplierNode, currentDelay: number, probability: number) => {
      // Если дошли до Tier 1 (Фабрика, которая шьет для нас)
      if (currentNode.tier === 1) {
        alerts.push({
          affectedTier1FactoryId: currentNode.id,
          rootCauseNodeId: event.nodeId,
          probabilityOfDelay: probability,
          expectedDelayDays: currentDelay,
          reasoning: `Disruption at Tier ${rootNode.tier} (${rootNode.name}) will cascade to Tier 1 (${currentNode.name}) with ${(probability * 100).toFixed(0)}% probability, causing ~${currentDelay} days delay.`
        });
        return;
      }

      // Идем дальше к зависимым узлам (вверх к бренду)
      for (const depId of currentNode.dependentNodes) {
        const depNode = this.network.get(depId);
        if (depNode) {
          // На каждом уровне вероятность задержки немного падает (буферы, альтернативы)
          // Но задержка может накапливаться (эффект хлыста)
          const newProbability = probability * 0.85; // 15% шанс, что следующий уровень компенсирует задержку
          const newDelay = Math.round(currentDelay * 1.1); // Эффект хлыста: задержка увеличивается на 10%
          
          traverse(depNode, newDelay, newProbability);
        }
      }
    };

    // Начальная вероятность зависит от тяжести события
    let initialProbability = 0.5;
    if (event.severity === 'critical') initialProbability = 0.95;
    if (event.severity === 'high') initialProbability = 0.80;

    traverse(rootNode, event.estimatedDelayDays, initialProbability);

    return alerts;
  }
}
