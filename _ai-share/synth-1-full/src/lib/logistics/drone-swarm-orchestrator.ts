export interface DroneState {
  droneId: string;
  type: 'quadcopter' | 'hexacopter' | 'ground_rover';
  batteryPercent: number;
  maxPayloadKg: number;
  maxRangeKm: number;
  status: 'idle' | 'charging' | 'in_flight' | 'maintenance';
  currentLocation: { lat: number; lon: number };
}

export interface DeliveryTask {
  orderId: string;
  weightKg: number;
  distanceKm: number;
  urgency: 'standard' | 'express' | 'medical';
  destination: { lat: number; lon: number };
}

export interface SwarmDispatchResult {
  droneId: string;
  orderId: string;
  action: 'dispatch' | 'delayed_weather' | 'delayed_capacity';
  estimatedFlightTimeMins: number;
  reasoning: string;
}

/**
 * [Phase 41 — Autonomous Drone Swarm Orchestrator (Last-Mile)]
 * Движок управления роем автономных дронов для доставки "последней мили".
 * Распределяет заказы между дронами (воздушными и наземными) на основе
 * их грузоподъемности, заряда батареи, дальности полета и погодных условий.
 * Интегрируется с LastMileRoutingEngine (Phase 36).
 */
export class DroneSwarmOrchestrator {
  /**
   * Назначает дроны на выполнение задач доставки.
   */
  public static dispatchFleet(
    tasks: DeliveryTask[],
    fleet: DroneState[],
    weather: { windSpeedKmh: number; isRaining: boolean }
  ): SwarmDispatchResult[] {
    const results: SwarmDispatchResult[] = [];
    const availableDrones = fleet.filter(d => d.status === 'idle' && d.batteryPercent > 20);

    for (const task of tasks) {
      let assignedDrone: DroneState | null = null;
      let action: SwarmDispatchResult['action'] = 'delayed_capacity';
      let reasoning = 'No available drones with sufficient capacity or range.';
      let estimatedFlightTimeMins = 0;

      // 1. Проверка погоды: Воздушные дроны не летают при сильном ветре или дожде
      const airTravelSafe = weather.windSpeedKmh < 35 && !weather.isRaining;

      if (!airTravelSafe) {
        // Ищем только наземных роверов (ground_rover)
        assignedDrone = availableDrones.find(d => 
          d.type === 'ground_rover' && 
          d.maxPayloadKg >= task.weightKg && 
          d.maxRangeKm >= task.distanceKm * 2 // Туда и обратно
        ) || null;

        if (assignedDrone) {
          action = 'dispatch';
          reasoning = `Air travel unsafe (Wind: ${weather.windSpeedKmh}km/h, Rain: ${weather.isRaining}). Assigned ground rover ${assignedDrone.droneId}.`;
          estimatedFlightTimeMins = (task.distanceKm / 15) * 60; // Скорость ровера ~15 км/ч
        } else {
          action = 'delayed_weather';
          reasoning = `Air travel unsafe and no ground rovers available for payload ${task.weightKg}kg. Delivery delayed.`;
        }
      } else {
        // Погода летная, ищем воздушные дроны (предпочтительно)
        assignedDrone = availableDrones.find(d => 
          (d.type === 'quadcopter' || d.type === 'hexacopter') && 
          d.maxPayloadKg >= task.weightKg && 
          d.maxRangeKm >= task.distanceKm * 2.2 // Воздушный запас хода (туда-обратно + ветер)
        ) || null;

        if (assignedDrone) {
          action = 'dispatch';
          reasoning = `Assigned ${assignedDrone.type} ${assignedDrone.droneId} for ${task.weightKg}kg payload. Battery at ${assignedDrone.batteryPercent}%.`;
          estimatedFlightTimeMins = (task.distanceKm / 60) * 60; // Скорость дрона ~60 км/ч
        }
      }

      // Если дрон найден, "бронируем" его (убираем из пула доступных для следующих задач)
      if (assignedDrone) {
        const index = availableDrones.findIndex(d => d.droneId === assignedDrone!.droneId);
        if (index !== -1) availableDrones.splice(index, 1);
      }

      results.push({
        droneId: assignedDrone ? assignedDrone.droneId : 'none',
        orderId: task.orderId,
        action,
        estimatedFlightTimeMins: Math.round(estimatedFlightTimeMins),
        reasoning
      });
    }

    return results;
  }
}
