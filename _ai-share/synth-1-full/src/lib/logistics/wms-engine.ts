/**
 * [Phase 6 — WMS Wave Picking & Zone Routing]
 * Логика складского управления для оптимизации сборки заказов.
 */

export interface WarehouseZone {
  id: string;
  name: string;
  pickingPriority: number; // Чем меньше, тем раньше собираем (например, 1 - зона A, 2 - зона B)
}

export interface PickTask {
  sku: string;
  quantity: number;
  zoneId: string;
  locationBin: string; // A1-04-B
  orderId: string;
}

export interface PickingWave {
  waveId: string;
  status: 'pending' | 'in_progress' | 'completed';
  tasks: PickTask[];
  assignedPickerId?: string;
  estimatedTimeMinutes: number;
}

export class WMSEngine {
  // Мок-топология склада
  private static zones: Map<string, WarehouseZone> = new Map([
    ['zone-fast', { id: 'zone-fast', name: 'Fast Movers (A)', pickingPriority: 1 }],
    ['zone-slow', { id: 'zone-slow', name: 'Slow Movers (B)', pickingPriority: 2 }],
    ['zone-bulky', { id: 'zone-bulky', name: 'Bulky Items (C)', pickingPriority: 3 }]
  ]);

  /**
   * Создает волну сборки (Wave Picking) для пула заказов.
   * Оптимизирует маршрут кладовщика по зонам склада.
   */
  public static generatePickingWave(orders: Array<{ orderId: string, items: Array<{ sku: string, qty: number }> }>): PickingWave {
    const tasks: PickTask[] = [];

    // 1. Разбираем заказы на отдельные задачи сборки
    for (const order of orders) {
      for (const item of order.items) {
        // Мок: определяем зону по SKU (в реальности это запрос к Inventory Ledger)
        const zoneId = item.sku.includes('FAST') ? 'zone-fast' : (item.sku.includes('BULKY') ? 'zone-bulky' : 'zone-slow');
        const bin = `${zoneId.split('-')[1].toUpperCase()}-${Math.floor(Math.random() * 100)}`;
        
        tasks.push({
          sku: item.sku,
          quantity: item.qty,
          zoneId: zoneId,
          locationBin: bin,
          orderId: order.orderId
        });
      }
    }

    // 2. Сортируем задачи по приоритету зоны (Zone Routing)
    // Это минимизирует "зигзаги" кладовщика по складу
    tasks.sort((a, b) => {
      const priorityA = this.zones.get(a.zoneId)?.pickingPriority || 99;
      const priorityB = this.zones.get(b.zoneId)?.pickingPriority || 99;
      
      if (priorityA !== priorityB) return priorityA - priorityB;
      
      // Внутри зоны сортируем по ячейке (Location Bin)
      return a.locationBin.localeCompare(b.locationBin);
    });

    // 3. Рассчитываем примерное время сборки (2 минуты на задачу + 5 минут на смену зоны)
    const uniqueZones = new Set(tasks.map(t => t.zoneId)).size;
    const estimatedTimeMinutes = (tasks.length * 2) + (uniqueZones * 5);

    return {
      waveId: `wave-${Date.now()}`,
      status: 'pending',
      tasks,
      estimatedTimeMinutes
    };
  }
}
