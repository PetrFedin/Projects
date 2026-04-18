import { DomainEventTypes, eventBus, type DomainEvent } from '../order/domain-events';
import { publishUrgentGlobalAnomalyDetected } from '../order/domain-event-factories';

export interface AnomalyReport {
  eventId: string;
  aggregateType: string;
  anomalyScore: number; // 0.0 to 1.0
  confidence: number;
  detectedPatterns: string[];
  recommendedAction: 'ignore' | 'investigate' | 'quarantine';
}

/**
 * [Phase 57 — Global Anomaly Detection Engine (Quantum-Inspired)]
 * Центральный движок для выявления статистических и структурных аномалий.
 * Подключается как глобальный перехватчик (Interceptor) к DomainEventBus.
 * Анализирует весь поток событий в реальном времени, выявляя:
 * - Всплески частоты (Temporal Bursts)
 * - Раздувание данных (Payload Bloat)
 * - Возрождение редких событий (Rare Event Resurgence)
 */
export class GlobalAnomalyEngine {
  private static isInitialized = false;

  // Mock ML model state
  private static eventFrequencies = new Map<string, number>();
  private static lastSeen = new Map<string, number>();

  public static initialize() {
    if (this.isInitialized) return;

    console.log('[GlobalAnomalyEngine] Initializing Quantum-Inspired Anomaly Detection...');

    // Подключаемся к шине событий напрямую
    eventBus.addGlobalInterceptor((event: DomainEvent) => {
      this.analyzeEvent(event);
    });

    this.isInitialized = true;
    console.log('[GlobalAnomalyEngine] Interceptor attached. Monitoring event stream.');
  }

  private static analyzeEvent(event: DomainEvent): void {
    // Игнорируем собственные события, чтобы избежать бесконечного цикла
    if (
      event.aggregateType === 'system' &&
      (event as { type?: string }).type === DomainEventTypes.system.globalAnomalyDetected
    ) {
      return;
    }

    const now = Date.now();
    const eventType = (event as any).type || event.aggregateType;

    // 1. Frequency Analysis
    const freq = (this.eventFrequencies.get(eventType) || 0) + 1;
    this.eventFrequencies.set(eventType, freq);

    // 2. Temporal Velocity Analysis (Burst detection)
    const lastTime = this.lastSeen.get(eventType) || now;
    const timeDeltaMs = Math.max(1, now - lastTime);
    this.lastSeen.set(eventType, now);

    let score = 0.0;
    const patterns: string[] = [];

    // Burst anomaly
    if (timeDeltaMs < 10 && freq > 100) {
      score += 0.4;
      patterns.push('temporal_burst');
    }

    // Payload structural anomaly (deep inspection)
    const payloadStr = JSON.stringify(event.payload || {});
    if (payloadStr.length > 50000) {
      score += 0.5;
      patterns.push('payload_bloat');
    }

    // Rare event anomaly (e.g., event hasn't happened in a long time)
    if (freq < 5 && now - lastTime > 86400000) {
      // 1 day
      score += 0.2;
      patterns.push('rare_event_resurgence');
    }

    // [Phase 57] Math hardening
    score = Math.max(0.0, Math.min(1.0, score));

    if (score > 0.6) {
      const report: AnomalyReport = {
        eventId: event.eventId,
        aggregateType: event.aggregateType,
        anomalyScore: score,
        confidence: Math.min(1.0, 0.85 + Math.random() * 0.1), // Mock ML confidence
        detectedPatterns: patterns,
        recommendedAction: score > 0.8 ? 'quarantine' : 'investigate',
      };

      console.warn(
        `[GlobalAnomalyEngine] ANOMALY DETECTED in ${eventType}. Score: ${score.toFixed(2)}`
      );

      void publishUrgentGlobalAnomalyDetected({
        aggregateId: event.aggregateId,
        payload: {
          targetEventId: report.eventId,
          targetEventType: eventType,
          targetAggregate: report.aggregateType,
          anomalyScore: report.anomalyScore,
          confidence: report.confidence,
          detectedPatterns: report.detectedPatterns,
          recommendedAction: report.recommendedAction,
        },
      });
    }
  }
}
