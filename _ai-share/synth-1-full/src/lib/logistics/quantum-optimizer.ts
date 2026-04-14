export interface LogisticsNode {
  id: string;
  type: 'factory' | 'port' | 'dc' | 'store';
  capacityUnits: number;
  processingCostUSD: number;
}

export interface LogisticsEdge {
  fromNodeId: string;
  toNodeId: string;
  transitTimeDays: number;
  transportCostUSD: number;
  carbonEmissionsKg: number;
}

export interface NetworkOptimizationGoal {
  totalUnitsToMove: number;
  maxAcceptableDays: number;
  priority: 'minimize_cost' | 'minimize_carbon' | 'minimize_time';
}

export interface OptimizedRoutePlan {
  path: string[]; // ['factory-1', 'port-shanghai', 'dc-europe', 'store-berlin']
  totalCostUSD: number;
  totalTimeDays: number;
  totalCarbonKg: number;
  reasoning: string;
}

/**
 * [Phase 31 — Quantum-Inspired Supply Chain Optimizer]
 * Движок глобальной маршрутизации (Global Routing).
 * Решает задачу коммивояжера (TSP) и задачу о потоке минимальной стоимости (Min-Cost Flow)
 * для глобальной цепи поставок. Ищет идеальный путь от фабрики в Азии до магазина в Европе,
 * балансируя между тремя целями: Деньги, Время и Экология (Carbon).
 */
export class QuantumSupplyChainOptimizer {
  /**
   * Находит оптимальный маршрут в графе логистической сети.
   * (Упрощенная эвристика для мока, в реальности здесь работают солверы вроде Gurobi/CPLEX)
   */
  public static findOptimalPath(
    nodes: LogisticsNode[],
    edges: LogisticsEdge[],
    goal: NetworkOptimizationGoal
  ): OptimizedRoutePlan | null {
    // 1. Инициализация графа (Adjacency List)
    const graph = new Map<string, LogisticsEdge[]>();
    nodes.forEach(n => graph.set(n.id, []));
    edges.forEach(e => {
      if (graph.has(e.fromNodeId)) {
        graph.get(e.fromNodeId)!.push(e);
      }
    });

    // 2. Поиск всех возможных путей от фабрик до магазинов (DFS)
    const factories = nodes.filter(n => n.type === 'factory');
    const stores = nodes.filter(n => n.type === 'store');
    const allPaths: OptimizedRoutePlan[] = [];

    const dfs = (currentNodeId: string, currentPath: string[], cost: number, time: number, carbon: number) => {
      currentPath.push(currentNodeId);
      
      const node = nodes.find(n => n.id === currentNodeId);
      if (node) cost += node.processingCostUSD * goal.totalUnitsToMove;

      if (node?.type === 'store') {
        allPaths.push({
          path: [...currentPath],
          totalCostUSD: cost,
          totalTimeDays: time,
          totalCarbonKg: carbon,
          reasoning: ''
        });
      } else {
        const neighbors = graph.get(currentNodeId) || [];
        for (const edge of neighbors) {
          // Защита от циклов
          if (!currentPath.includes(edge.toNodeId)) {
            dfs(
              edge.toNodeId,
              currentPath,
              cost + (edge.transportCostUSD * goal.totalUnitsToMove),
              time + edge.transitTimeDays,
              carbon + (edge.carbonEmissionsKg * goal.totalUnitsToMove)
            );
          }
        }
      }
      currentPath.pop();
    };

    for (const factory of factories) {
      dfs(factory.id, [], 0, 0, 0);
    }

    if (allPaths.length === 0) return null;

    // 3. Фильтрация по жестким ограничениям (SLA)
    const validPaths = allPaths.filter(p => p.totalTimeDays <= goal.maxAcceptableDays);
    if (validPaths.length === 0) return null;

    // 4. Выбор лучшего пути в зависимости от приоритета (Objective Function)
    let bestPath = validPaths[0];

    for (const path of validPaths) {
      if (goal.priority === 'minimize_cost' && path.totalCostUSD < bestPath.totalCostUSD) {
        bestPath = path;
      } else if (goal.priority === 'minimize_carbon' && path.totalCarbonKg < bestPath.totalCarbonKg) {
        bestPath = path;
      } else if (goal.priority === 'minimize_time' && path.totalTimeDays < bestPath.totalTimeDays) {
        bestPath = path;
      }
    }

    bestPath.reasoning = `Selected path ${bestPath.path.join(' -> ')} prioritizing ${goal.priority}. ` +
                         `Total Cost: $${bestPath.totalCostUSD}, Time: ${bestPath.totalTimeDays} days, Carbon: ${bestPath.totalCarbonKg}kg.`;

    return bestPath;
  }
}
