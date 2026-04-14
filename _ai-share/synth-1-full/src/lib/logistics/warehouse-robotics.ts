export interface AGVRobot {
  robotId: string;
  batteryLevel: number; // 0-100%
  status: 'idle' | 'charging' | 'picking' | 'error';
  currentLocation: { x: number; y: number };
  payloadCapacityKg: number;
}

export interface PickingTask {
  taskId: string;
  sku: string;
  quantity: number;
  weightKg: number;
  shelfLocation: { x: number; y: number };
  priority: 'standard' | 'express';
}

export interface FleetAssignment {
  robotId: string;
  taskId: string;
  estimatedTimeToCompleteMinutes: number;
  reasoning: string;
}

/**
 * [Phase 21 — Autonomous Warehouse Robotics Fleet Manager]
 * Оркестратор флота роботов (AGV - Automated Guided Vehicles) на складе.
 * Назначает задачи по сборке заказов (Picking) свободным роботам,
 * учитывая заряд батареи, грузоподъемность и расстояние до полки.
 */
export class WarehouseFleetManager {
  /**
   * Распределяет задачи по сборке заказов между доступными роботами.
   */
  public static assignTasks(robots: AGVRobot[], tasks: PickingTask[]): FleetAssignment[] {
    const assignments: FleetAssignment[] = [];
    const availableRobots = robots.filter(r => r.status === 'idle' && r.batteryLevel > 15); // Не берем разряженных

    // Сортируем задачи по приоритету (сначала экспресс)
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.priority === 'express' && b.priority !== 'express') return -1;
      if (a.priority !== 'express' && b.priority === 'express') return 1;
      return 0;
    });

    for (const task of sortedTasks) {
      if (availableRobots.length === 0) break; // Нет свободных роботов

      // Ищем робота, который может поднять груз и находится ближе всего
      let bestRobotIndex = -1;
      let minDistance = Infinity;

      for (let i = 0; i < availableRobots.length; i++) {
        const robot = availableRobots[i];
        if (robot.payloadCapacityKg >= task.weightKg) {
          // Вычисляем манхэттенское расстояние (складские ряды)
          const distance = Math.abs(robot.currentLocation.x - task.shelfLocation.x) + 
                           Math.abs(robot.currentLocation.y - task.shelfLocation.y);
          
          if (distance < minDistance) {
            minDistance = distance;
            bestRobotIndex = i;
          }
        }
      }

      if (bestRobotIndex !== -1) {
        const selectedRobot = availableRobots[bestRobotIndex];
        
        // Вычисляем примерное время (допустим, 1 минута на единицу расстояния + 2 минуты на взятие товара)
        const estimatedTime = minDistance * 1 + 2;

        assignments.push({
          robotId: selectedRobot.robotId,
          taskId: task.taskId,
          estimatedTimeToCompleteMinutes: estimatedTime,
          reasoning: `Assigned task ${task.taskId} to robot ${selectedRobot.robotId} (distance: ${minDistance}, battery: ${selectedRobot.batteryLevel}%).`
        });

        // Удаляем робота из списка доступных
        availableRobots.splice(bestRobotIndex, 1);
      }
    }

    return assignments;
  }
}
